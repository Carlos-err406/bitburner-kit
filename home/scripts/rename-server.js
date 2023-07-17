/** @param {NS} ns */
export async function main(ns) {
    ns.renamePurchasedServer(ns.arg[0] ?? ns.getServer().hostname, ns.args[0])
}