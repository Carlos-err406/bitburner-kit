import { AttackInitConfig } from "scripts/config/config";
const { grow } = AttackInitConfig;
import { NS } from "@ns";

export const main = async (ns: NS) => {
  const target = ns.args[0] as string;
  while (true) {
    await ns.sleep(20);
    await ns.grow(target, { stock: grow.stock });
  }
};
