/** @param {NS} ns */
export async function main(ns) {
    const upgraded = ns.upgradePurchasedServer(ns.args[0], ns.args[1]);
    upgraded
        ? ns.toast("server upgraded!", ns.enums.ToastVariant.SUCCESS, 4000)
        : ns.toast("server NOT upgraded!", ns.enums.ToastVariant.ERROR, 4000);
}