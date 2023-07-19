import { HackTreeInitConfig } from "scripts/config/config"
const { grow } = HackTreeInitConfig
/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0]
  const min = 1
  const max = 6
  while (true) {
    const timeToWait = Math.floor(Math.random() * (max - min + 1) + min)
    await ns.sleep(timeToWait * 1000)
    await ns.grow(target, { stock: grow.stock })
  }
}