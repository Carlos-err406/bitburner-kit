import { AttackInitConfig } from "scripts/config/config";
const { exclude, scriptRam, target, grow, weaken, hack } = AttackInitConfig;
import { NS } from "@ns";
export const main = async (ns: NS) => {
  const openPortScriptFunctions = getOpenPortScriptFunctions(ns);
  const servers = getAllServers(ns);
  const hackeable = getHackeableServers(ns, servers, openPortScriptFunctions);
  ns.toast(`TARGET SERVER: ${target}`, ns.enums.ToastVariant.INFO, 5500);

  killAllScripts(ns, hackeable);
  distributeScripts(ns, hackeable);
};

const getAllServers = (
  ns: NS,
  currentServer = "home",
  serverList: string[] = []
) => {
  serverList.push(currentServer);
  const childrenList = ns.scan(currentServer);
  for (const children of childrenList) {
    const childrenExistInList = serverList.find((s) => s === children);
    if (!childrenExistInList) {
      serverList = getAllServers(ns, children, serverList);
    }
  }
  return serverList;
};

const getHackeableServers = (
  ns: NS,
  serverList: string[] = [],
  openPortScriptFunctions: Function[]
) => {
  const hackSkills = ns.getHackingLevel(); //* 0.75
  const purchasedServer = ns.getPurchasedServers();
  const hackeable = serverList.filter((server) => {
    if (exclude.includes(server)) return false;
    else if (purchasedServer.includes(server)) return true;
    const enoughHackSkills =
      ns.getServerRequiredHackingLevel(server) <= hackSkills;
    const enoughPorts =
      ns.getServerNumPortsRequired(server) < openPortScriptFunctions.length;
    const serverRam = ns.getServerMaxRam(server) > 0;
    enoughHackSkills &&
      enoughPorts &&
      openPortScriptFunctions.forEach((script) => script(server));
    return enoughHackSkills && enoughPorts && serverRam;
  });
  hackeable.push("home");
  return hackeable;
};

const getOpenPortScriptFunctions = (ns: NS) => {
  let scriptFunctions: Function[] = [];
  ns.fileExists("BruteSSH.exe") &&
    (scriptFunctions = [...scriptFunctions, ns.brutessh]);
  ns.fileExists("relaySMTP.exe") &&
    (scriptFunctions = [...scriptFunctions, ns.relaysmtp]);
  ns.fileExists("FTPCrack.exe") &&
    (scriptFunctions = [...scriptFunctions, ns.ftpcrack]);
  ns.fileExists("HTTPWorm.exe") &&
    (scriptFunctions = [...scriptFunctions, ns.httpworm]);
  ns.fileExists("SQLInject.exe") &&
    (scriptFunctions = [...scriptFunctions, ns.sqlinject]);
  return (scriptFunctions = [...scriptFunctions, ns.nuke]);
};

const distributeScripts = (ns: NS, serverList: string[] = []) => {
  const { growQuantity, hackQuantity, weakQuantity } = getThreadDistribution(
    ns,
    serverList
  );
  let assignedGrowQuantity = 0;
  let assignedHackQuantity = 0;
  let assignedWeakQuantity = 0;
  serverList.forEach((server) => {
    let assignedQuantity = 0;
    const serverRam = ns.getServerMaxRam(server);
    if (assignedGrowQuantity < growQuantity) {
      assignedQuantity = Math.min(
        growQuantity - assignedGrowQuantity,
        Math.floor(serverRam / scriptRam)
      );
      assignedGrowQuantity += assignedQuantity;
      copyAndRun(ns, grow.script, server, assignedQuantity);

      let usedServerRam = ns.getServerUsedRam(server);
      let ramLeft = serverRam - usedServerRam;
      if (assignedGrowQuantity === growQuantity && ramLeft > scriptRam) {
        assignedQuantity = Math.min(
          weakQuantity - assignedWeakQuantity,
          Math.floor(ramLeft / scriptRam)
        );
        assignedWeakQuantity += assignedQuantity;
        copyAndRun(ns, weaken.script, server, assignedQuantity);

        usedServerRam = ns.getServerUsedRam(server);
        ramLeft = serverRam - usedServerRam;
        if (assignedWeakQuantity === weakQuantity && ramLeft > scriptRam) {
          assignedQuantity = Math.min(
            hackQuantity - assignedHackQuantity,
            Math.floor(ramLeft / scriptRam)
          );
          assignedHackQuantity += assignedQuantity;
          copyAndRun(ns, hack.script, server, assignedQuantity);
        }
      }
    } else if (assignedWeakQuantity < weakQuantity) {
      assignedQuantity = Math.min(
        weakQuantity - assignedWeakQuantity,
        Math.floor(serverRam / scriptRam)
      );
      assignedWeakQuantity += assignedQuantity;
      copyAndRun(ns, weaken.script, server, assignedQuantity);

      let usedServerRam = ns.getServerUsedRam(server);
      let ramLeft = serverRam - usedServerRam;
      if (assignedWeakQuantity === weakQuantity && ramLeft > scriptRam) {
        assignedQuantity = Math.min(
          hackQuantity - assignedHackQuantity,
          Math.floor(ramLeft / scriptRam)
        );
        assignedHackQuantity += assignedQuantity;
        copyAndRun(ns, hack.script, server, assignedQuantity);
      }
    } else if (assignedHackQuantity < hackQuantity) {
      assignedQuantity = Math.min(
        hackQuantity - assignedHackQuantity,
        Math.floor(serverRam / scriptRam)
      );
      assignedHackQuantity += assignedQuantity;
      copyAndRun(ns, hack.script, server, assignedQuantity);
    }
  });
};

const getThreadDistribution = (ns: NS, serverList: string[]) => {
  const totalThreadsQuantity = calcTotalThreads(ns, serverList);
  const growQuantity = Math.floor(totalThreadsQuantity * grow.percentage);
  const weakQuantity = Math.floor(totalThreadsQuantity * weaken.percentage);
  const hackQuantity = Math.floor(totalThreadsQuantity * hack.percentage);
  printThreadDistribution(
    ns,
    totalThreadsQuantity,
    growQuantity,
    weakQuantity,
    hackQuantity
  );
  return { growQuantity, weakQuantity, hackQuantity };
};

const printThreadDistribution = (
  ns: NS,
  totalThreads = 0,
  growQuantity = 0,
  weakQuantity = 0,
  hackQuantity = 0
) => {
  let message = `\n\tTOTAL THREADS: ${totalThreads}\n`;
  // message += `\n\tTHREADS PER HOST: ${threadsPerHost}\n`
  message += `\t-------------------------\n`;
  message += `\t| GROW\t\t${growQuantity}\t|\n`;
  message += `\t| WEAKEN\t${weakQuantity}\t|\n`;
  message += `\t| HACK\t\t${hackQuantity}\t|\n`;
  message += `\t-------------------------\n`;
  ns.tprint(message);
};

const copyAndRun = (
  ns: NS,
  script: string,
  server: string,
  threads: number
) => {
  ns.scp([script, "scripts/config/config.js"], server);
  threads > 0 && ns.exec(script, server, { threads }, target);

  //TODO: install backdoor
};

const calcTotalThreads = (ns: NS, serverList: string[] = []) => {
  const result = serverList.reduce((acc, server) => {
    const serverRam = ns.getServerMaxRam(server);
    acc += Math.floor(serverRam / scriptRam);
    return acc;
  }, 0);
  return result;
};

/** @param {NS} ns
 * @param {string[]} serverList
 * */
const killAllScripts = (ns: NS, serverList: string[]) => {
  for (const server of serverList) {
    ns.scriptKill(grow.script, server);
    ns.scriptKill(hack.script, server);
    ns.scriptKill(weaken.script, server);
  }
};
