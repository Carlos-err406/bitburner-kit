import { HackTreeInitConfig } from "scripts/config/config";
import { NS } from "@ns";
const { weaken } = HackTreeInitConfig;

export const main = async (ns: NS) => {
  const target = ns.args[0] as string;

  while (true) {
    await ns.sleep(20);
    await ns.weaken(target, { stock: weaken.stock });
  }
};
