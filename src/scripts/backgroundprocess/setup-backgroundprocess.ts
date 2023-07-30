import { BuyServersConfig } from "scripts/config/config";
const { hostname, minRam, neededScripts } = BuyServersConfig;
import { NS } from "@ns";

export const main = async (ns: NS) => {
  const servers = ns.getPurchasedServers();
  if (servers.length === 25) {
    ns.alert(
      `Cant setup, max amount of servers reached\nYou can try renaming a server to "${hostname}"`
    );
    return;
  }
  let buyInitialServer =
    servers.findIndex((server) => server === hostname) === -1;
  debugger;
  while (buyInitialServer) {
    const { money } = ns.getPlayer();
    const cost = ns.getPurchasedServerCost(minRam);
    if (money > cost) {
      ns.purchaseServer(hostname, minRam);
      buyInitialServer = false;
    } else await ns.sleep(1000 * 60);
  }
  Object.values(neededScripts).forEach((script) => {
    ns.scp(script, hostname);
  });
  ns.killall(hostname);
  ns.exec(neededScripts.buyServers, hostname);
};
