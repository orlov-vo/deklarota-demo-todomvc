import { getModelById } from 'dkt/core';

let ports_counter = 0;

export const createClient = ({ send }) => ({
  id: ++ports_counter,
  buildTree(tree) {
    send({
      protocol: 'provoda',
      action: 'buildtree',
      message: {
        value: tree,
      },
    });
  },
  send(list) {
    send({
      protocol: 'provoda',
      action: 'update',
      message: list,
    });
  },
  changeCollection(prodovaId, struc, nestingName, value) {
    send({
      protocol: 'provoda',
      action: 'update_nesting',
      message: {
        _provoda_id: prodovaId,
        struc,
        name: nestingName,
        value,
      },
    });
  },
  updateStates(prodovaId, data) {
    send({
      protocol: 'provoda',
      action: 'update_states',
      message: {
        _provoda_id: prodovaId,
        value: data,
      },
    });
  },
});

export const createHandler = ({ syncSender, getRoot, inited, stream }) => (data, context) => {
  switch (data.action) {
    case 'init_root': {
      getRoot(data, context, inited.appModel).then(({ root }) => {
        syncSender.addSyncStream(root, stream);
      });
      return;
    }
    case 'rpc_legacy': {
      const { message } = data;
      const tmd = getModelById(inited.appModel, message.provoda_id);
      if (!tmd) {
        throw new Error('there is no such model');
      }
      tmd.RPCLegacy(...message.value);
    }
  }
};
