import startMessaging from './bus/startMessaging';
import { App } from './views/App';

const worker = new SharedWorker('./worker.js');
const initView = startMessaging(window, worker.port);

initView(() => {
  return {
    RootView: App,
    interfaces: {
      win: window,
      window,
    },
  };
});
