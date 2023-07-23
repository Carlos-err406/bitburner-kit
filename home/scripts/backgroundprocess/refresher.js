import { RefresherConfig } from "scripts/config/config"
const { interval, script, host } = RefresherConfig

/** @param {NS} ns */
export async function main(ns) {
    while (true) {
        ns.toast("REFRESHING HACK TREE...", ns.enums.ToastVariant.INFO, 5500)
        ns.exec(script, host)
        await ns.sleep(1000 * interval) //TODO when hacking level increases 10 levels?
    }
}