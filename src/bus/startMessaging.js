import initSync from './initSync';

/**
 * Make interface for messaging through message port
 * @param {Window} window
 * @param {MessagePort} port
 */
export default function startMessaging(window, port) {
  port.start();

  return initSync(window, {
    send: data => {
      port.postMessage(data);
    },
    subscribe: fn => {
      const efn = event => {
        fn(event);
      };
      port.addEventListener('message', efn);
      return () => port.removeEventListener('message', efn);
    },
  });
}
