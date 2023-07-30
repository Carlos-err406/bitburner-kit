import { RefresherConfig } from "scripts/config/config";
const { interval, script, host } = RefresherConfig;
import { NS } from "@ns";

export const main = async (ns: NS) => {
  while (true) {
    ns.toast("REFRESHING HACK TREE...", ns.enums.ToastVariant.INFO, 5500);
    ns.exec(script, host);
    await ns.sleep(1000 * interval);
  }
};
