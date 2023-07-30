import { NS } from "@ns";
export const main = async (ns: NS) => {
  while (true) {
    await ns.sleep(20);
    await ns.share();
  }
};
