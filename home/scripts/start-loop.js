/** @param {NS} ns */
export async function main(ns) {
    const openPortScriptFunctions = getOpenPortScriptFunctions(ns)
    const servers = getAllServers(ns, 'home', [])
    const { hackeable, target } = getHackeableServers(ns, servers, openPortScriptFunctions)
    killAllScripts(ns, hackeable)
    distributeScripts(ns, hackeable, target)
}

/** @param {NS} ns 
 * @param {string} currentServer
 * @param {string[]} serverList
*/
const getAllServers = (ns, currentServer, serverList) => {
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
    let hackeable = [...ns.getPurchasedServers().filter(s => s !== 'backgroundprocess'), 'home']
    const hackSkills = ns.getHackingLevel() * 0.7
    const hackeableExternalServers = serverList.filter(server => {
        const enoughHackSkills = ns.getServerRequiredHackingLevel(server) <= hackSkills
        const enoughPorts = ns.getServerNumPortsRequired(server) < openPortScriptFunctions.length
        enoughHackSkills && enoughPorts && openPortScriptFunctions.forEach(opener => opener(server))
        return enoughHackSkills && enoughPorts
    })
    let target = getServerToHack(ns, hackeableExternalServers)
    ns.tprint("\nTARGET SERVER: ", target, '\n')
    hackeable.push(...hackeableExternalServers)
    return { hackeable, target }
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
    const scriptRam = 1.75
    const totalThreadsQuantity = calcTotalThreads(ns, serverList, scriptRam)
    const growQuantity = Math.floor(totalThreadsQuantity * 0.6);
    const weakQuantity = Math.floor(totalThreadsQuantity * 0.3);
    const hackQuantity = Math.floor(totalThreadsQuantity * 0.1);
    let assignedGrowQuantity = 0
    let assignedHackQuantity = 0
    let assignedWeakedQnatity = 0
    const growScript = 'scripts/grow-loop.js'
    const hackScript = 'scripts/hack-loop.js'
    const weakenScript = 'scripts/weaken-loop.js'
    debugger
    serverList.forEach(server => {
        let assignedQuantity = 0
        const serverRam = ns.getServerMaxRam(server)

        if (assignedGrowQuantity < growQuantity) {
            assignedQuantity = Math.min(growQuantity - assignedGrowQuantity, Math.floor(serverRam / scriptRam))
            assignedGrowQuantity += assignedQuantity
            copyAndRun(ns, growScript, server, target, assignedQuantity)

            let usedServerRam = ns.getServerUsedRam(server)
            let leftRam = serverRam - usedServerRam
            if (assignedGrowQuantity === growQuantity && leftRam > scriptRam) {
                assignedQuantity = Math.min(weakQuantity - assignedWeakedQnatity, Math.floor(leftRam / scriptRam))
                assignedWeakedQnatity += assignedQuantity
                copyAndRun(ns, weakenScript, server, target, assignedQuantity)

                usedServerRam = ns.getServerUsedRam(server)
                leftRam = serverRam - usedServerRam
                if (assignedWeakedQnatity === weakQuantity && leftRam > scriptRam) {
                    assignedQuantity = Math.min(hackQuantity - assignedHackQuantity, Math.floor(leftRam / scriptRam))
                    assignedHackQuantity += assignedQuantity
                    copyAndRun(ns, hackScript, server, target, assignedQuantity)
                }
            }
        }

        else if (assignedWeakedQnatity < weakQuantity) {
            assignedQuantity = Math.min(weakQuantity - assignedWeakedQnatity, Math.floor(serverRam / scriptRam))
            assignedWeakedQnatity += assignedQuantity
            copyAndRun(ns, weakenScript, server, target, assignedQuantity)

            let usedServerRam = ns.getServerUsedRam(server)
            let leftRam = serverRam - usedServerRam
            if (assignedWeakedQnatity === weakQuantity && leftRam > scriptRam) {
                assignedQuantity = Math.min(hackQuantity - assignedHackQuantity, Math.floor(leftRam / scriptRam))
                assignedHackQuantity += assignedQuantity
                copyAndRun(ns, hackScript, server, target, assignedQuantity)
            }
        }

        else if (assignedHackQuantity < hackQuantity) {
            assignedQuantity = Math.min(hackQuantity - assignedHackQuantity, Math.floor(serverRam / scriptRam))
            assignedHackQuantity += assignedQuantity
            copyAndRun(ns, hackScript, server, target, assignedQuantity)
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
    ns.scp(script, server)
    //TODO: install backdoor
    ns.exec(script, server, threads, target)
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
        ns.killall(server, true)
    }
}

/** @param {NS} ns 
 * @param {string[]} serverList
*/
const getServerToHack = (ns, serverList) => {
    const { server } = serverList.reduce((acc, server) => {
        const maxMoney = ns.getServerMaxMoney(server);
        const serverGrouth = ns.getServerGrowth(server);
        const serverGrowTime = ns.getGrowTime(server);
        const serverWeakenTime = ns.getWeakenTime(server);
        const maxScore = acc.score
        const score = Math.log2(maxMoney * 0.25 / serverGrouth * serverGrowTime - 5 * serverWeakenTime)

        if (score > maxScore)
            acc = { server, score }

        return acc
    }, { server: '', score: 0 })
    return server
}