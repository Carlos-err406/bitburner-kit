/**
 * Upgrade a purchased server with the specified name.
 * @example ```bash
 *  run upgrade-server.js backgroundprocess 16
 * ```
 * 
 * @param {NS} ns - The Bitburner namespace object.
 */
export async function main(ns) {
    ns.upgradePurchasedServer(ns.args[0], ns.args[1]);
  }
  