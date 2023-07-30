import { NS } from "@ns";

export const main = async (ns: NS) => {
  const target = ns.args[0] as string;
  let serverMoney = formatMoney(ns, target);
  let hackTime = ns.getHackTime(target) / 1000;
  let growTime = ns.getGrowTime(target) / 1000;
  let weakenTime = ns.getWeakenTime(target) / 1000;
  const { hackString, growString, weakenString } = getTimes(
    ns,
    hackTime,
    growTime,
    weakenTime
  );
  printProfile(ns, target, serverMoney, hackString, growString, weakenString);
};

const formatMoney = (ns: NS, target: string) => {
  let maxMoney: number = ns.getServerMaxMoney(target);
  let formatted: string = ns.formatNumber(maxMoney, 2);
  let q = 1000000000000000;
  let t = q / 1000;
  let b = t / 1000;
  let m = b / 1000;
  let k = m / 1000;

  if (maxMoney > q) {
    formatted = ns.formatNumber(maxMoney / q, 2) + "Q";
  } else if (maxMoney > t) {
    formatted = ns.formatNumber(maxMoney / t, 2) + "T";
  } else if (maxMoney > b) {
    formatted = ns.formatNumber(maxMoney / b, 2) + "B";
  } else if (maxMoney > m) {
    formatted = ns.formatNumber(maxMoney / m, 2) + "M";
  } else if (maxMoney > k) {
    formatted = ns.formatNumber(maxMoney / k, 2) + "K";
  } else if (maxMoney < k) {
    formatted = ns.formatNumber(maxMoney, 2);
  }

  return formatted;
};

const getTimes = (ns: NS, hack: number, grow: number, weaken: number) => {
  let hackString: string = "";
  let growString: string = "";
  let weakenString: string = "";

  if (hack > 60) {
    let secs = ns.formatNumber(hack % 60, 0);
    let mins = Math.floor(hack / 60);
    if (mins > 60) {
      let minsH = mins % 60;
      let hours = Math.floor(mins / 60);
      hackString = `${hours}h ${minsH}m ${secs}s`;
    } else hackString = `${mins}m ${secs}s`;
  } else {
    hackString = `${ns.formatNumber(hack, 2)}s`;
  }
  if (grow > 60) {
    let secs = ns.formatNumber(grow % 60, 0);
    let mins = Math.floor(grow / 60);
    if (mins > 60) {
      let minsH = ns.formatNumber(mins % 60, 0);
      let hours = ns.formatNumber(mins / 60, 0);
      growString = `${hours}h ${minsH}m ${secs}s`;
    } else growString = `${mins}m ${secs}s`;
  } else {
    growString = `${ns.formatNumber(grow, 2)}s`;
  }

  if (weaken > 60) {
    let secs = ns.formatNumber(weaken % 60, 0);
    let mins = Math.floor(weaken / 60);
    if (mins > 60) {
      let minsH = ns.formatNumber(mins % 60, 0);
      let hours = ns.formatNumber(mins / 60, 0);
      weakenString = `${hours}h ${minsH}m ${secs}s`;
    } else weakenString = `${mins}m ${secs}s`;
  } else {
    weakenString = `${ns.formatNumber(weaken, 2)}s`;
  }

  return { hackString, growString, weakenString };
};

const printProfile = (
  ns: NS,
  target: string,
  money: string,
  hack: string,
  grow: string,
  weaken: string
) => {
  let line0 = `   \nPROFILE OF:  ${target}\n`;
  let line1 = `   HACK TIME: ${hack}\n`;
  let line2 = `   GROW TIME: ${grow}\n`;
  let line3 = `   WEAKEN TIME: ${weaken}\n`;
  let line4 = `   MAX MONEY: ${money}\n`;
  let length = Math.max(
    line0.length,
    line1.length,
    line2.length,
    line3.length,
    line4.length
  );
  let separator = "-".repeat(length) + "\n";
  let message =
    line0 + separator + line1 + line2 + line3 + "\n" + line4 + separator;
  ns.tprint(message);
};
