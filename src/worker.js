import { prepareAppRuntime } from 'dkt/core';
import { initBusCore } from './bus/core';
import { App } from './models/App';
import { init as initInterfaces } from './interfaces';

globalThis.name = 'core';

async function main() {
  const runtime = prepareAppRuntime({
    sync_sender: true,
    proxies: true,
  });

  const interfaces = await initInterfaces();
  const inited = await runtime.start({ App, interfaces });

  initBusCore(inited);

  globalThis.inited = inited; // only for dev observations! don't use it in code!
}

main();
