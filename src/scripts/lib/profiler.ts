import { NS } from "@ns";
import { AttackInitConfig } from "scripts/config/config";

const { target: attackTarget } = AttackInitConfig;
interface Profiling {
  money: {
    serverMaxMoney: string;
    serverCurrentMoney: string;
  };
  timings: {
    hackString: string;
    growString: string;
    weakenString: string;
  };
  misc: {
    rootAccess: boolean;
    portsRequired: number;
    attacking: boolean;
  };
  security: {
    level: string;
    minLevel: string;
    hackChance: string;
  };
}
interface Timings {
  hackTime: number;
  growTime: number;
  weakenTime: number;
}
export const main = async (ns: NS) => {
  const profileTarget = ns.args[0] as string;

  const maxMoney = ns.getServerMaxMoney(profileTarget);
  const currentMoney = ns.getServerMoneyAvailable(profileTarget);
  const serverMaxMoney = formatMoney(ns, maxMoney);
  const serverCurrentMoney = formatMoney(ns, currentMoney);

  const rootAccess = ns.hasRootAccess(profileTarget);
  const portsRequired = ns.getServerNumPortsRequired(profileTarget);
  const attacking = attackTarget == profileTarget;
  4;
  const level = ns.getServerSecurityLevel(profileTarget).toPrecision(2) + "%";
  const minLevel =
    ns.getServerMinSecurityLevel(profileTarget).toPrecision(2) + "%";
  const hackChance = ns.hackAnalyzeChance(profileTarget) * 100 + "%";

  const hackTime = ns.getHackTime(profileTarget) / 1000;
  const growTime = ns.getGrowTime(profileTarget) / 1000;
  const weakenTime = ns.getWeakenTime(profileTarget) / 1000;

  const timings = getTimes(ns, {
    hackTime,
    growTime,
    weakenTime,
  });

  const money = {
    serverCurrentMoney,
    serverMaxMoney,
  };
  const security = {
    level,
    hackChance,
    minLevel,
  };
  const misc = { attacking, portsRequired, rootAccess };
  const options: Profiling = {
    timings,
    money,
    security,
    misc,
  };

  printProfile(ns, profileTarget, options);
};

const formatMoney = (ns: NS, money: number) => {
  let formatted: string = ns.formatNumber(money, 2);
  let q = 1000000000000000;
  let t = q / 1000;
  let b = t / 1000;
  let m = b / 1000;
  let k = m / 1000;

  if (money > q) {
    formatted = ns.formatNumber(money / q, 2) + "Q";
  } else if (money > t) {
    formatted = ns.formatNumber(money / t, 2) + "T";
  } else if (money > b) {
    formatted = ns.formatNumber(money / b, 2) + "B";
  } else if (money > m) {
    formatted = ns.formatNumber(money / m, 2) + "M";
  } else if (money > k) {
    formatted = ns.formatNumber(money / k, 2) + "K";
  } else if (money < k) {
    formatted = ns.formatNumber(money, 2);
  }

  return formatted;
};

const getTimes = (ns: NS, timings: Timings) => {
  const { hackTime, growTime, weakenTime } = timings;
  let hackString: string = "";
  let growString: string = "";
  let weakenString: string = "";

  if (hackTime > 60) {
    let secs = ns.formatNumber(hackTime % 60, 0);
    let mins = Math.floor(hackTime / 60);
    if (mins > 60) {
      let minsH = mins % 60;
      let hours = Math.floor(mins / 60);
      hackString = `${hours}h ${minsH}m ${secs}s`;
    } else hackString = `${mins}m ${secs}s`;
  } else {
    hackString = `${ns.formatNumber(hackTime, 2)}s`;
  }
  if (growTime > 60) {
    let secs = ns.formatNumber(growTime % 60, 0);
    let mins = Math.floor(growTime / 60);
    if (mins > 60) {
      let minsH = ns.formatNumber(mins % 60, 0);
      let hours = ns.formatNumber(mins / 60, 0);
      growString = `${hours}h ${minsH}m ${secs}s`;
    } else growString = `${mins}m ${secs}s`;
  } else {
    growString = `${ns.formatNumber(growTime, 2)}s`;
  }

  if (weakenTime > 60) {
    let secs = ns.formatNumber(weakenTime % 60, 0);
    let mins = Math.floor(weakenTime / 60);
    if (mins > 60) {
      let minsH = ns.formatNumber(mins % 60, 0);
      let hours = ns.formatNumber(mins / 60, 0);
      weakenString = `${hours}h ${minsH}m ${secs}s`;
    } else weakenString = `${mins}m ${secs}s`;
  } else {
    weakenString = `${ns.formatNumber(weakenTime, 2)}s`;
  }

  return { hackString, growString, weakenString };
};

const printProfile = async (
  ns: NS,
  profileTarget: string,
  profile: Profiling
) => {
  const {
    timings: showTimings,
    money: showMoney,
    misc: showMisc,
    security: showSecurity,
    all: showAll,
  } = ns.flags([
    ["timings", false],
    ["money", false],
    ["misc", false],
    ["security", false],
    ["all", false],
  ]);
  if (!(showTimings || showMoney || showMisc || showSecurity || showAll)) {
    let alert = "Run the script with the flags\n\n";
    const margin = 15;

    alert +=
      "--timings" +
      " ".repeat(margin - "--timings".length) +
      "for the hack, grow and weaken timings\n";

    alert +=
      "--money" +
      " ".repeat(margin - "--money".length) +
      "for the server's max money and current money\n";

    alert +=
      "--security" +
      " ".repeat(margin - "--security".length) +
      "for the sever's security data and hack chance\n";

    alert +=
      "--misc" +
      " ".repeat(margin - "--misc".length) +
      "for other server information like needed ports\n";

    alert +=
      "--all" +
      " ".repeat(margin - "--all".length) +
      "for all the server information\n";

    ns.tprint("\n\n" + alert);
    ns.toast("No flag specified", ns.enums.ToastVariant.ERROR, 3000);
    return;
  }
  const { timings, misc, security, money } = profile;

  const column1Width = 17;
  const column2Width = 17;
  const separator = (title?: string) =>
    "-".repeat(column1Width + column2Width) + (title ? title : "") + "\n";

  const lines = ["\n\n", `\tPROFILE OF: ${profileTarget}\n`];
  if (showTimings || showAll) {
    const { hackString, growString, weakenString } = timings;
    lines.push(
      ...[
        separator("TIMINGS"),
        `\tHACK TIME: ${hackString.padEnd(column2Width)}\n`,
        `\tGROW TIME: ${growString.padEnd(column2Width)}\n`,
        `\tWEAKEN TIME: ${weakenString.padEnd(column2Width)}\n`,
      ]
    );
  }
  if (showMoney || showAll) {
    const { serverMaxMoney, serverCurrentMoney } = money;
    lines.push(
      ...[
        separator("MONEY"),
        `\tMAX MONEY: ${serverMaxMoney.padEnd(column2Width)}\n`,
        `\tCURRENT MONEY: ${serverCurrentMoney.padEnd(column2Width)}\n`,
      ]
    );
  }
  if (showSecurity || showAll) {
    const { level, minLevel, hackChance } = security;
    lines.push(
      ...[
        separator("SECURITY"),
        `\tSECURITY LEVEL ${level}\n`,
        `\tMIN SECURITY LEVEL ${minLevel}\n`,
        `\tHACK CHANCE ${hackChance}\n`,
      ]
    );
  }
  if (showMisc || showAll) {
    const { attacking, rootAccess, portsRequired } = misc;
    lines.push(
      ...[
        separator("MISC"),
        `\tROOT ACCESS: ${(rootAccess ? "YES" : "NO").padEnd(column2Width)}\n`,
        `\tPORTS REQUIRED: ${String(portsRequired).padEnd(column2Width)}\n`,
        `\tATTACKING: ${(attacking ? "YES" : "NO").padEnd(column2Width)}\n`,
      ]
    );
  }
  lines.push(...[separator()]);
  ns.tprint(lines.join(""));
};
