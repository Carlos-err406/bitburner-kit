export const main = async(ns) => {
    while (true) {
        await ns.sleep(20)
        await ns.share()
    }
}