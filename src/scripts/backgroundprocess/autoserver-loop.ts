import { NS } from "@ns";
import { BackgroundProcessConfig } from "scripts/config/config";
const { interval, hostname, scriptNames, newServerName, upgradeLimitExp } =
  BackgroundProcessConfig;

export const main = async (ns: NS) => {
  while (true) {
    const servers = ns.getPurchasedServers();
    killSelf(ns, servers);
    const { money } = ns.getPlayer();
    if (servers.length === 25) {
      //upgrade existing servers
      const { server, ram } = getMinRamServer(ns, servers);
      const upgradeTo = ram * 2;
      if (canUpgrade(ns, money, server, upgradeTo)) {
        upgrade(ns, server, upgradeTo);
        notifyUpgrade(ns, server, upgradeTo);
        if (
          server === hostname &&
          ns.scriptRunning(scriptNames.share, hostname)
        ) {
          ns.scriptKill(scriptNames.share, hostname);
        }
        const avalableRam =
          ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname);
        const threads = Math.floor(avalableRam / 4);
        runRefresh(ns, threads);
      }
    } else {
      //buy new server
      const maxRamBought = getMaxRamBought(ns, servers);
      if (canBuy(ns, maxRamBought, money)) {
        const serverName = buyServer(ns, maxRamBought);
        notifyPurchase(ns, serverName, maxRamBought);
        runRefresh(ns);
      }
    }
    await ns.sleep(1000 * interval);
  }
};

/** @param {NS} ns */
const canUpgrade = (ns: NS, money: number, server: string, ram: number) => {
  const exp = Math.log2(ram);
  if (exp === upgradeLimitExp) return false;
  const cost = ns.getPurchasedServerUpgradeCost(server, ram);
  return money > cost;
};

const upgrade = (ns: NS, server: string, ram: number) => {
  return ns.upgradePurchasedServer(server, ram);
};
/** @param {NS} ns */
const killSelf = (ns: NS, servers: string[]) => {
  const { length } = servers;
  const maxedRam = servers.every((server) => {
    const serverRam = ns.getServerMaxRam(server);
    const exp = Math.log2(serverRam);
    return exp === upgradeLimitExp;
  });
  if (maxedRam && length === 25)
    ns.scriptKill(scriptNames.buyservers, hostname);
};
/** @param {NS} ns */
const canBuy = (ns: NS, ram: number, money: number) => {
  const cost = ns.getPurchasedServerCost(ram);
  return money > cost;
};

/** @param {NS} ns */
const getMinRamServer = (ns: NS, serverList: string[]) => {
  const maxRam = Math.pow(2, 20);
  const host = serverList.reduce(
    (acc, server) => {
      const { ram } = acc;
      const serverRam = ns.getServerMaxRam(server);
      if (serverRam < ram) {
        acc = { server, ram: serverRam };
      }
      return acc;
    },
    { server: "", ram: maxRam + 1 }
  );

  return host;
};

/** @param {NS} ns */
const getMaxRamBought = (ns: NS, servers: string[]) => {
  return servers.reduce((acc, server) => {
    const ram = ns.getServerMaxRam(server);
    acc = ram > acc ? ram : acc;
    return acc;
  }, 0);
};
/** @param {NS} ns */
const buyServer = (ns: NS, ram: number) => {
  return ns.purchaseServer(newServerName, ram);
};

/** @param {NS} ns */
const runRefresh = (ns: NS, shareThreads?: number) => {
  ns.killall(hostname, true);
  ns.exec(scriptNames.refresher, hostname, 1);
  if (shareThreads) ns.exec(scriptNames.share, hostname, shareThreads);
};

/** @param {NS} ns */
const notifyPurchase = (ns: NS, server: string, ram: number) => {
  ns.toast(
    `NEW SERVER: ${server} ${ns.formatRam(ram)}`,
    ns.enums.ToastVariant.SUCCESS,
    5500
  );
};

/** @param {NS} ns */
const notifyUpgrade = (ns: NS, server: string, ram: number) => {
  ns.toast(
    `UPGRADED: ${server} ${ns.formatRam(ram)}`,
    ns.enums.ToastVariant.SUCCESS,
    5500
  );
};
