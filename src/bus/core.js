import { getModelById } from 'dkt/core';
import { createClient } from './bindCore';

export function init({ sync_sender: syncSender, app_model: appModel }) {
  const makeCall = (id, args) => {
    const model = getModelById(appModel, id);
    if (!model) {
      throw new Error('there is no such model');
    }
    model.RPCLegacy(...args);
  };

  const onMessage = event => {
    const msg = event.data;
    if (msg == null || msg.type !== 'RPC_LEGACY') return;

    makeCall(msg.payload.provoda_id, msg.payload.args);
  };

  globalThis.onconnect = function onConnect(event) {
    const [port] = event.ports;

    const onUnload = () =>
      port.postMessage({
        protocol: 'window-port',
        command: 'unload',
      });
    const onUnloadOptions = { once: true };

    const onDisconnect = () => {
      globalThis.removeEventListener('beforeunload', onUnload, onUnloadOptions);

      fetched.then(({ makeFree }) => {
        if (!makeFree) return;
        makeFree();
      });

      syncSender.removeSyncStream(stream);
    };

    const stream = createClient({
      send: data => {
        try {
          port.postMessage(data);
        } catch (e) {
          console.error(e);
          syncSender.removeSyncStream(stream);
          port.close();
        }
      },
    });

    globalThis.addEventListener('beforeunload', onUnload, onUnloadOptions);
    port.addEventListener('message', data => onMessage(data, port));
    port.start();
  };
}
