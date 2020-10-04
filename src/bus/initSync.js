/* eslint-disable fp/no-mutating-methods, fp/no-let, fp/no-mutation, camelcase, fp/no-loops */
import { SyncReceiver } from 'dkt/core';
import { initView } from 'dkt/view';

async function initMainView(window, RootView, mpx, syncReceiver, interfaces) {
  const view = await initView(
    {
      mpx,
      interfaces,
      bwlev: mpx,
      RootView,
      name: 'root',
    },
    { proxies: null, sync_r: syncReceiver },
  );

  window.rootView = () => view;
}

export default function initSync(window, { send, subscribe }) {
  let initFn;
  let initFnArgs;

  const completeInit = () => {
    if (!initFnArgs || !initFn) return;

    const { RootView, interfaces } = initFn();
    const [mpx, syncR] = initFnArgs;
    initMainView(window, RootView, mpx, syncR, interfaces);
  };

  const receivedData = new Set();
  const unsubscribeInit = subscribe(event => receivedData.add(event.data));

  send({ action: 'init_root' });

  let hasAppRootView = false;
  const handler = (data, syncReceiver) => {
    if (!data || data.protocol !== 'provoda') return;
    const action = syncReceiver.actions[data.action];
    const result = action.call(syncReceiver, data.message);

    if (data.action !== 'buildtree' || hasAppRootView) return;

    hasAppRootView = true;
    initFnArgs = [result.mpx, syncReceiver];

    completeInit();
  };

  const syncReceiver = new SyncReceiver({
    RPCLegacy: (id, args) => {
      send({
        protocol: 'provoda',
        action: 'rpc_legacy',
        message: {
          provoda_id: id,
          value: args,
        },
      });
    },
  });

  receivedData.forEach(data => handler(data, syncReceiver));
  receivedData.clear();

  unsubscribeInit();
  subscribe(event => handler(event.data, syncReceiver));

  return fn => {
    initFn = fn;

    completeInit();
  };
}
