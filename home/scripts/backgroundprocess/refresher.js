/** @param {NS} ns */
export async function main(ns) {
    const { time } = ns.flags([['time', 3600]]) 
    while (true) {
        ns.exec('scripts/start-loop.js', 'home')
        ns.tprint("\nREFRESHING HACKS...\n")
        await ns.sleep(1000 * time) //TODO when hacking level increases 10 levels?
    }
}