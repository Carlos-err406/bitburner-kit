import { RefresherConfig } from "scripts/config/config"
const { interval, script, host } = RefresherConfig

/** @param {NS} ns */
export async function main(ns) {
    while (true) {
        ns.exec(script, host)
        ns.tprint("\nREFRESHING HACK TREE...\n")
        await ns.sleep(1000 * interval) //TODO when hacking level increases 10 levels?
    }
}