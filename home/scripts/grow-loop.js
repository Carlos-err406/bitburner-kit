import { HackTreeInitConfig } from "scripts/config/config"
const { grow } = HackTreeInitConfig
/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0]
  while (true) {
    await ns.sleep(20)
    await ns.grow(target, { stock: grow.stock })
  }
}