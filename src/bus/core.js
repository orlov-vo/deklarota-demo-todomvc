import { createClient, createHandler } from './bindCore';

export function initBusCore({ sync_sender: syncSender, app_model: appModel, rootBwlev }) {
  globalThis.onconnect = function onConnect(event) {
    const [port] = event.ports;

    const onUnload = () =>
      port.postMessage({
        protocol: 'window-port',
        command: 'unload',
      });
    const onUnloadOptions = { once: true };

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

    const handle = createHandler({
      syncSender,
      rootBwlev,
      inited: { appModel },
      stream,
      getRoot: async () => ({
        root: appModel,
      }),
    });

    globalThis.addEventListener('beforeunload', onUnload, onUnloadOptions);
    port.addEventListener('message', event => handle(event.data, port));
    port.start();
  };
}
