const HOSTNAME = 'backgroundprocess'
const SCRIPT_NAME = 'scripts/backgroundprocess/buyservers.js'
const REFRESHER = 'scripts/backgroundprocess/refresher.js'
const NEW_SERVER_NAME = 'host'

/** @param {NS} ns */
export async function main(ns) {
  const { w: wait } = ns.flags([['w', 3600]])
  while (true) {
    const servers = ns.getPurchasedServers()
    const { money } = ns.getPlayer()
    if (haveToDelete(ns, servers)) {
      const { server, ram } = getMinRamServer(ns, servers)
      if (canBuy(ns, ram, money)) {
        const deleted = deletePurchasedServer(ns, server)
        if (deleted) {
          const newRam = Math.pow(2, Math.log2(ram) + 1)
          const serverName = buyServer(ns, newRam)
          notifyPurchase(ns, serverName, newRam)
          runRefresh(ns)
        }
      }
    } else {
      const maxRamBought = getMaxRamBought(ns, servers)
      if (canBuy(ns, maxRamBought, money)) {
        runRefresh(ns)
        const serverName = buyServer(ns, maxRamBought)
        notifyPurchase(ns, serverName, maxRamBought)
      }
    }
    await ns.sleep(1000 * wait)
  }
}

/** @param {NS} ns */
const haveToDelete = (ns, servers) => {
  const { length } = servers
  const maxedRam = servers.every(server => {
    if (server === HOSTNAME) return true
    const serverRam = ns.getServerMaxRam(server)
    const exp = Math.log2(serverRam)
    return exp === 20
  })
  if (maxedRam && length === 25) {
    ns.scriptKill(SCRIPT_NAME, HOSTNAME)
    return false
  } else
    return length === 25 && !maxedRam
}
/** @param {NS} ns */
const canBuy = (ns, ram, money) => {
  const cost = ns.getPurchasedServerCost(ram)
  return money > cost
}
/** @param {NS} ns */
const deletePurchasedServer = (ns, server) => {
  if (server === HOSTNAME) return
  ns.killall(server)
  return ns.deleteServer(server)
}

/** @param {NS} ns */
const getMinRamServer = (ns, serverList) => {
  const servers = serverList.filter((server) => server !== HOSTNAME)
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
  return ns.purchaseServer(NEW_SERVER_NAME, ram)
}

/** @param {NS} ns */
const notifyPurchase = (ns, server, ram) => {
  ns.tprint("\nNEW SERVER BOUGHT!!: ", `${server} (${ram} GB)`, "\n")
}

/** @param {NS} ns */
const runRefresh = (ns) => {
  ns.killall(HOSTNAME, true)
  ns.exec(REFRESHER, HOSTNAME)
}