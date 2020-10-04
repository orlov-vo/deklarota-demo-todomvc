import $ from 'cash-dom';
import { updateAttr } from 'dkt/core';
import { spv, View } from 'dkt/view';

const ENTER_KEY = 13;

const parsePathname = (() => {
  const a = document.createElement('a');

  return href => {
    a.href = href;
    return a.pathname;
  };
})();

function getRoute(pathname) {
  switch (pathname) {
    case '/active':
      return 'active';
    case '/completed':
      return 'completed';
    default:
      return 'all';
  }
}

export const App = spv.inh(View, null, {
  children_views: {},
  'collch-start_page': true,
  isRootView: true,
  controllers: {},
  dom_rp: true,

  createDetails() {
    this._super();

    this.root_view = this;
    this.root_view.root_app_view = this;
    this.d = this.opts.d;

    this.all_queues = [];
    this.c = $(this.d.getElementById('app'));
    this.useInterface('con', this.getCNode());
    updateAttr(this, '$meta$apis$con$appended', true);
    updateAttr(this, 'vis_con_appended', true);

    this.tpls = [];
    this.els = {};
    this.samples = {};
    this.dom_related_props.push('calls_flow', 'samples', 'els', 'struc_store');

    const templator = View._PvTemplate.templator(this._getCallsFlow(), (sample_name, simple, opts) =>
      this.getSample(sample_name, simple, opts),
    );
    this.pvtemplate = templator.template;
    this.pvsampler = templator.sampler;

    const tpl = this.createTemplate(this.getCNode());
    this.tpls.push(tpl);

    this.useHashRouter();
  },

  useHashRouter() {
    const handler = () => {
      const link = location.hash.slice(1);
      this.updateAttr('activeRoute', getRoute(parsePathname(link)));
    };

    window.addEventListener('hashchange', handler, false);
    handler();

    return () => {
      window.removeEventListener('hashchange', handler, false);
    };
  },

  attrs: {
    activeRoute: ['input', 'all'],
    focusedTodoId: ['comp', ['focusedTodoIdRaw'], raw => parseInt(raw, 10) || null],

    visibleTodos: [
      'comp',
      ['activeRoute', 'todos', 'activeItems', 'completedItems'],
      (activeRoute, todos, activeItems, completedItems) => {
        switch (activeRoute) {
          case 'active':
            return activeItems;
          case 'completed':
            return completedItems;
          case 'all':
          default:
            return todos;
        }
      },
    ],
  },

  tpl_r_events: {},
  tpl_events: {
    tryCreateTodo(event, node) {
      if (event.keyCode !== ENTER_KEY) return;

      const trimmedValue = node.value.trim();
      if (!trimmedValue.length) return;

      this.RPCLegacy('dispatch', 'addTodo', { title: trimmedValue });
      node.value = '';
    },
    tryUpdateTodo(event, node, todoId) {
      if (event.keyCode !== ENTER_KEY) return;

      const id = parseInt(todoId, 10);
      const trimmedValue = node.value.trim();
      if (!trimmedValue.length || !Number.isInteger(id)) return;

      this.RPCLegacy('dispatch', 'updateTodo', { id, title: trimmedValue });
      node.value = '';
    },
  },
});
