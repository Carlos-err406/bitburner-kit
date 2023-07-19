import { BuyServersConfig } from "scripts/config/config"
const { interval, hostname, scriptNames, newServerName } = BuyServersConfig

/** @param {NS} ns */
export async function main(ns) {
  while (true) {
    const servers = ns.getPurchasedServers()
    killSelf(ns, servers)
    const { money } = ns.getPlayer()
    if (servers.length === 25) {//upgrade existing servers
      const { server, ram } = getMinRamServer(ns, servers)
      if (canUpgrade(ns, money, server, ram)) {
        upgrade(ns, server, ram * 2)
        notifyPurchase(ns, server, ram * 2)
        runRefresh(ns)
      }
    } else {//buy new server
      const maxRamBought = getMaxRamBought(ns, servers)
      if (canBuy(ns, maxRamBought, money)) {
        const serverName = buyServer(ns, maxRamBought)
        notifyPurchase(ns, serverName, maxRamBought)
        runRefresh(ns)
      }
    }
    await ns.sleep(1000 * interval)
  }
}

/** @param {NS} ns */
const canUpgrade = (ns, money, server, ram) => {
  const exp = Math.log2(ram)
  if (exp === 20) return false
  const cost = ns.getPurchasedServerUpgradeCost(server, ram)
  return money > cost
}

const upgrade = (ns, server, ram) => {
  return ns.upgradePurchasedServer(server, ram * 2)
}
/** @param {NS} ns */
const killSelf = (ns, servers) => {
  const { length } = servers
  const maxedRam = servers.every(server => {
    if (server === hostname) return true
    const serverRam = ns.getServerMaxRam(server)
    const exp = Math.log2(serverRam)
    return exp === 20
  })
  if (maxedRam && length === 25) ns.scriptKill(scriptNames.buyservers, hostname)
}
/** @param {NS} ns */
const canBuy = (ns, ram, money) => {
  const cost = ns.getPurchasedServerCost(ram)
  return money > cost
}

/** @param {NS} ns */
const getMinRamServer = (ns, serverList) => {
  const servers = serverList.filter((server) => server !== hostname)
  const maxRam = Math.pow(2, 20)
  const host = servers.reduce((acc, server) => {
    const { ram } = acc
    const serverRam = ns.getServerMaxRam(server)
    if (serverRam < ram) {
      acc = { server, ram: serverRam }
    }
    return acc
  }, { server: '', ram: maxRam + 1 })

  return host
}

/** @param {NS} ns */
const getMaxRamBought = (ns, servers) => {
  return servers.reduce((acc, server) => {
    const ram = ns.getServerMaxRam(server)
    acc = ram > acc ? ram : acc
    return acc
  }, 0)
}
/** @param {NS} ns */
const buyServer = (ns, ram) => {
  return ns.purchaseServer(newServerName, ram)
}

/** @param {NS} ns */
const notifyPurchase = (ns, server, ram) => {
  ns.tprint("\nNEW SERVER!!: ", `${server} (${ns.formatRam(ram)})`, "\n")
}

/** @param {NS} ns */
const runRefresh = (ns) => {
  ns.killall(hostname, true)
  ns.exec(scriptNames.refresher, hostname)
}