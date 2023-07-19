/** @param {NS} ns */
export async function main(ns) {
    const upgraded = ns.upgradePurchasedServer(ns.args[0], ns.args[1]);
    upgraded ? ns.alert("server upgraded!") : ns.alert("server NOT upgraded!");
}