import { NS } from "@ns";
export const main = async (ns: NS) => {
  const servers = ns.getPurchasedServers();
  let output = `\n\tPurchased servers\n---------------------------------\n`;
  for (const server of servers) {
    let spaces = 20 - server.length;
    const ram = ns.getServerMaxRam(server);
    const formatted = ns.formatRam(ram);
    output += `| ${server}${" ".repeat(spaces)}${formatted}\t|\n`;
  }
  output += "---------------------------------\n";
  ns.tprint(output);
};
