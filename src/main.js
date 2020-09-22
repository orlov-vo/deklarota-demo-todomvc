import { initView } from 'dkt/view';
import { App } from './views/App';

const worker = new SharedWorker('./worker.js', { type: 'module' });

async function main() {
  const interfaces = { win: window };
  const view = await initView(
    {
      mpx: null,
      interfaces,
      RootView: App,
      name: 'general',
      proxies_space: null,
    },
    { proxies: null, sync_r: null },
  );

  window.rootView = view; // for debugging only
}

main();
