import { HackTreeInitConfig } from "scripts/config/config"
const { hack } = HackTreeInitConfig
/** @param {NS} ns */
export async function main(ns) {
    const target = ns.args[0]
    while (true) {
        await ns.hack(target, { stock: hack.stock })
    }
}