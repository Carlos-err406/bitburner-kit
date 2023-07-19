note: this is still a WIP

## General kit Setup

Create the file home/scripts/config/config.js where the script configurations will be.
With the following contents:

```javascript
/** @param {NS} ns*/
export const main = async (ns) => { }

const BuyServersConfig = {
    hostname: "backgroundprocess",
    minRam: 16,
    interval: 60,
    newServerName: 'host',
    scriptNames: {
        buyservers: 'scripts/backgroundprocess/buyservers.js',
        refresher: 'scripts/backgroundprocess/refresher.js',
    },
    neededScripts: {
        config: "scripts/config/config.js",
        buyServers: "scripts/backgroundprocess/autoserver-loop.js",
        refresher: "scripts/backgroundprocess/refresher.js",
    },
}

const RefresherConfig = {
    interval: 360,
    script: "scripts/init-hack-tree.js",
    host: 'home'
}

const HackTreeInitConfig = {
    grow: {
        script: 'scripts/grow-loop.js',
        percentage: 0.6,
        stock: true
    },
    weaken: {
        script: 'scripts/weaken-loop.js',
        percentage: 0.25,
        stock: false
    },
    hack: {
        script: 'scripts/hack-loop.js',
        percentage: 0.15,
        stock: false
    },
    scriptRam: 1.75,
    exclude: [BuyServersConfig.hostname],
    target: 'joesguns'
}
export { BuyServersConfig, RefresherConfig, HackTreeInitConfig }
```

## VSCode extension

Highly recommended extension "bitburner.bitburner-vscode-integration"

### Setup

```json
//.vscode/settings.json
{
  "bitburner.authToken": "",
  "bitburner.scriptRoot": "./home",
  "bitburner.fileWatcher.enable": true,
  "bitburner.showPushSuccessNotification": true,
  "bitburner.showFileWatcherEnabledNotification": true
}
```

**Happy hacking!** 👾👾👾
