import { BuyServersConfig } from 'scripts/config/config'
const { hostname, minRam, neededScripts } = BuyServersConfig

/** @param {NS} ns */
export const main = async (ns) => {
    const servers = ns.getPurchasedServers()
    if(servers.legth === 25){
        ns.alert("Cant setup, max amount of servers reached")
        return
    }
    let buyInitialServer = servers.findIndex((server) => server === hostname) === -1
    debugger
    while (buyInitialServer) {
        const { money } = ns.getPlayer()
        const cost = ns.getPurchasedServerCost(minRam)
        if (money > cost) {
            ns.purchaseServer(hostname, minRam)
            buyInitialServer = false
            ns.alert("SERVER ", hostname, " BOUGHT!\nstarting process...")
        } else
            await ns.sleep(1000 * 60)
    }
    Object.values(neededScripts).forEach(script => {
        ns.scp(script, hostname)
    })
    ns.killall(hostname)
    ns.exec(neededScripts.buyServers, hostname)
}