import $ from 'cash-dom';
import { spv, AppBaseView } from 'dkt/view';

export const App = spv.inh(AppBaseView.WebComplexTreesView, null, {
  children_views: {},
  'collch-start_page': true,
  isRootView: true,
  controllers: {},

  createDetails() {
    this._super();
    this.all_queues = [];
  },

  tpl_r_events: {},
  tpl_events: {},

  selectKeyNodes() {
    spv.cloneObj(this.els, {
      start_screen: $('#start-screen', this.d),
    });
  },

  buildAppDOM: spv.precall(AppBaseView.WebComplexTreesView.prototype.buildAppDOM, () => {
    console.log('dom ready');
  }),
});
