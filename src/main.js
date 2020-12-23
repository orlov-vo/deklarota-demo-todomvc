import startMessaging from './bus/startMessaging';
import { App } from './views/App';

const worker = new Worker('./worker.js');
const initView = startMessaging(window, worker);

initView(() => {
  return {
    RootView: App,
    interfaces: {
      win: window,
      window,
    },
  };
});
