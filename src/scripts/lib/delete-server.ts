import { NS } from "@ns";
export const main = async (ns: NS) => {
  const host = ns.args[0] as string;
  ns.killall(host);
  const deleted = ns.deleteServer(host);
  deleted
    ? ns.toast("Server deleted", ns.enums.ToastVariant.SUCCESS, 2500)
    : ns.toast("Server not deleted", ns.enums.ToastVariant.ERROR, 2500);
};
