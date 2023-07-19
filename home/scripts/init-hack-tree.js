import { HackTreeInitConfig } from "scripts/config/config"
const { exclude, scriptRam, target: defaultTarget, grow, weaken, hack } = HackTreeInitConfig

/** @param {NS} ns */
export async function main(ns) {
    const openPortScriptFunctions = getOpenPortScriptFunctions(ns)
    const servers = getAllServers(ns)
    const hackeable = getHackeableServers(ns, servers, openPortScriptFunctions)
    let target = getServerToHack(ns, hackeable)
    ns.tprint("\nTARGET SERVER: ", target, '\n')

    killAllScripts(ns, hackeable)
    distributeScripts(ns, hackeable, target)
}

/** @param {NS} ns 
 * @param {string} currentServer
 * @param {string[]} serverList
*/
const getAllServers = (ns, currentServer = 'home', serverList = []) => {
    serverList.push(currentServer)
    const childrenList = ns.scan(currentServer)
    for (const children of childrenList) {
        const childrenExistInList = serverList.find(s => s === children)
        if (!childrenExistInList) {
            serverList = getAllServers(ns, children, serverList)
        }
    }
    return serverList
}

/** @param {NS} ns 
 *  @param {string[]} serverList
*   @param {Function[]} currentPortsQuantity
*/
const getHackeableServers = (ns, serverList = [], openPortScriptFunctions) => {
    const hackSkills = ns.getHackingLevel() * 0.7
    const purchasedServer = ns.getPurchasedServers()
    const hackeable = serverList.filter(server => {
        if (server === 'home') return true
        else if (purchasedServer.includes(server)) return true
        const enoughHackSkills = ns.getServerRequiredHackingLevel(server) <= hackSkills
        const enoughPorts = ns.getServerNumPortsRequired(server) < openPortScriptFunctions.length
        const serverRam = ns.getServerMaxRam(server) > 0
        enoughHackSkills && enoughPorts && openPortScriptFunctions.forEach(script => script(server))
        return enoughHackSkills && enoughPorts && serverRam
    })
    return hackeable
}

/** @param {NS} ns 
 * @returns {Function[]}
*/
const getOpenPortScriptFunctions = (ns) => {
    let scriptFunctions = []
    ns.fileExists("BruteSSH.exe") && (scriptFunctions = [...scriptFunctions, ns.brutessh])
    ns.fileExists("relaySMTP.exe") && (scriptFunctions = [...scriptFunctions, ns.relaysmtp])
    ns.fileExists("FTPCrack.exe") && (scriptFunctions = [...scriptFunctions, ns.ftpcrack])
    ns.fileExists("HTTPWorm.exe") && (scriptFunctions = [...scriptFunctions, ns.httpworm])
    ns.fileExists("SQLInject.exe") && (scriptFunctions = [...scriptFunctions, ns.sqlinject])
    return scriptFunctions = [...scriptFunctions, ns.nuke]
}


/** @param {NS} ns 
 * @param {string[]} serverList
 * @param {string} target
*/
const distributeScripts = (ns, serverList = [], target) => {
    const totalThreadsQuantity = calcTotalThreads(ns, serverList, scriptRam)
    const growQuantity = Math.floor(totalThreadsQuantity * grow.percentage);
    const weakQuantity = Math.floor(totalThreadsQuantity * weaken.percentage);
    const hackQuantity = Math.floor(totalThreadsQuantity * hack.percentage);
    let assignedGrowQuantity = 0
    let assignedHackQuantity = 0
    let assignedWeakedQnatity = 0
    serverList.forEach(server => {

        let assignedQuantity = 0
        const serverRam = ns.getServerMaxRam(server)
        if (assignedGrowQuantity < growQuantity) {
            assignedQuantity = Math.min(growQuantity - assignedGrowQuantity, Math.floor(serverRam / scriptRam))
            assignedGrowQuantity += assignedQuantity
            copyAndRun(ns, grow.script, server, target, assignedQuantity)

            let usedServerRam = ns.getServerUsedRam(server)
            let ramLeft = serverRam - usedServerRam
            if (assignedGrowQuantity === growQuantity && ramLeft > scriptRam) {
                assignedQuantity = Math.min(weakQuantity - assignedWeakedQnatity, Math.floor(ramLeft / scriptRam))
                assignedWeakedQnatity += assignedQuantity
                copyAndRun(ns, weaken.script, server, target, assignedQuantity)

                usedServerRam = ns.getServerUsedRam(server)
                ramLeft = serverRam - usedServerRam
                if (assignedWeakedQnatity === weakQuantity && ramLeft > scriptRam) {
                    assignedQuantity = Math.min(hackQuantity - assignedHackQuantity, Math.floor(ramLeft / scriptRam))
                    assignedHackQuantity += assignedQuantity
                    copyAndRun(ns, hack.script, server, target, assignedQuantity)
                }
            }
        }

        else if (assignedWeakedQnatity < weakQuantity) {
            assignedQuantity = Math.min(weakQuantity - assignedWeakedQnatity, Math.floor(serverRam / scriptRam))
            assignedWeakedQnatity += assignedQuantity
            copyAndRun(ns, weaken.script, server, target, assignedQuantity)

            let usedServerRam = ns.getServerUsedRam(server)
            let ramLeft = serverRam - usedServerRam
            if (assignedWeakedQnatity === weakQuantity && ramLeft > scriptRam) {
                assignedQuantity = Math.min(hackQuantity - assignedHackQuantity, Math.floor(ramLeft / scriptRam))
                assignedHackQuantity += assignedQuantity
                copyAndRun(ns, hack.script, server, target, assignedQuantity)
            }
        }

        else if (assignedHackQuantity < hackQuantity) {
            assignedQuantity = Math.min(hackQuantity - assignedHackQuantity, Math.floor(serverRam / scriptRam))
            assignedHackQuantity += assignedQuantity
            copyAndRun(ns, hack.script, server, target, assignedQuantity)
        }
    })

}

/** @param {NS} ns 
 * @param {string} script
 * @param {string} server
 * @param {string} target
 * @param {number} threads
*/
const copyAndRun = (ns, script, server, target, threads) => {
    ns.scp([script, 'scripts/config/config.js'], server)
    ns.exec(script, server, { threads }, target)

    //TODO: install backdoor
}

/** @param {NS} ns 
 * @param {string[]} serverList
 * @param {number} neededRam
*/
const calcTotalThreads = (ns, serverList = [], neededRam) => {
    const result = serverList.reduce((acc, server) => {
        const serverRam = ns.getServerMaxRam(server)
        acc += Math.floor(serverRam / neededRam)
        return acc
    }, 0)
    return result
}

/** @param {NS} ns 
 * @param {string[]} serverList 
 * */
const killAllScripts = (ns, serverList) => {
    for (const server of serverList) {
        ns.scriptKill(grow.script, server)
        ns.scriptKill(hack.script, server)
        ns.scriptKill(weaken.script, server)
    }
}

/** @param {NS} ns 
 * @param {string[]} serverList
*/
const getServerToHack = (ns, serverList) => {
    if (defaultTarget.length > 0) return defaultTarget
    return serverList.reduce((acc, server) => {
        const maxMoney = ns.getServerMaxMoney(server);
        const serverGrouth = ns.getServerGrowth(server);
        const serverGrowTime = ns.getGrowTime(server);
        const serverWeakenTime = ns.getWeakenTime(server);
        const maxScore = acc.score
        const score = Math.log2(maxMoney * 0.25 / serverGrouth * serverGrowTime - 5 * serverWeakenTime)

        if (score > maxScore)
            acc = { server, score }

        return acc
    }, { server: '', score: 0 }).server
}