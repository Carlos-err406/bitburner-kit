import { AttackInitConfig } from "scripts/config/config";
const { hack } = AttackInitConfig;
import { NS } from "@ns";

export const main = async (ns: NS) => {
  const target = ns.args[0] as string;
  while (true) {
    await ns.sleep(200);
    await ns.hack(target, { stock: hack.stock });
  }
};
