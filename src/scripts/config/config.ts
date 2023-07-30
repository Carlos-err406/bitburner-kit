import { NS } from "@ns";
export const main = async (ns: NS) => {};

const BuyServersConfig = {
  hostname: "backgroundprocess",
  minRam: 16,
  interval: 60,
  newServerName: "host",
  upgradeLimitExp: 13,
  scriptNames: {
    buyservers: "scripts/backgroundprocess/buyservers.js",
    refresher: "scripts/backgroundprocess/refresher.js",
    share: "scripts/share-loop.js",
  },
  neededScripts: {
    config: "scripts/config/config.js",
    buyServers: "scripts/backgroundprocess/autoserver-loop.js",
    refresher: "scripts/backgroundprocess/refresher.js",
    share: "scripts/share-loop.js",
  },
};

const RefresherConfig = {
  interval: 10000,
  script: "scripts/init.js",
  host: "home",
};

const HackTreeInitConfig = {
  grow: {
    script: "scripts/grow-loop.js",
    percentage: 0.90444,
    stock: true,
  },
  weaken: {
    script: "scripts/weaken-loop.js",
    percentage: 0.0955,
    stock: false,
  },
  hack: {
    script: "scripts/hack-loop.js",
    percentage: 0.00006,
    stock: false,
  },
  scriptRam: 1.75,
  exclude: [BuyServersConfig.hostname],
  // target: "n00dles",
  // target: 'joesguns',
  // target: 'iron-gym',
  // target: 'hong-fang-tea',
  // target: 'sigma-cosmetics',
  // target: 'silver-helix',
  // target: 'omega-net',
  target: "4sigma",
  // target: '',
};
export { BuyServersConfig, RefresherConfig, HackTreeInitConfig };
