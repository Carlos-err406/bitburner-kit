import { NS } from "@ns";
export const main = async (ns: NS) => {
  const server = ns.args[0] as string;
  const ram = ns.args[1] as number;
  const name = ns.purchaseServer(server, ram);
  if (name) {
    ns.toast(
      `${name}(${ns.formatRam(ram)}) Purchased`,
      ns.enums.ToastVariant.SUCCESS,
      3000
    );
  }
  ns.toast("Server not purchased", ns.enums.ToastVariant.ERROR, 3000);
};
