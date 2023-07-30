import { NS } from "@ns";
export const main = (ns: NS) => {
  const currentName = ns.args[0] as string;
  const newName = ns.args[1] as string;
  const purchased = ns.renamePurchasedServer(currentName, newName);
  purchased
    ? ns.toast("Server renamed", ns.enums.ToastVariant.SUCCESS, 2500)
    : ns.toast("Server not renamed", ns.enums.ToastVariant.ERROR, 2500);
};
