import { HackTreeInitConfig } from "scripts/config/config"
const { weaken } = HackTreeInitConfig
/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0]

    while (true) {
        await ns.sleep(20)
        await ns.weaken(target, { stock: weaken.stock })
    }
}