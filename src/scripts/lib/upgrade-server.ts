import { NS } from "@ns";
export const main = async (ns: NS) => {
  const server = ns.args[0] as string;
  const ram = ns.args[1] as number;
  const upgraded = ns.upgradePurchasedServer(server, ram);
  upgraded
    ? ns.toast("server upgraded!", ns.enums.ToastVariant.SUCCESS, 4000)
    : ns.toast("server NOT upgraded!", ns.enums.ToastVariant.ERROR, 4000);
};
