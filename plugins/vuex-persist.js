import VuexPersistence from 'vuex-persist';
import localforage from 'localforage';
import { MessageBox } from 'element-ui';
import merge from 'lodash/merge';

const hasStoreStructureChanged = (store, savedState) => {
  if (savedState && savedState.persist) {
    return store.state.persist.version !== savedState.persist.version;
  }
  return true;
};

export default ({ store }) => {
  const vuexPersist = new VuexPersistence({
    key: 'echarts_grid_builder',

    asyncStorage: true,
    storage: localforage,
    restoreState: async (key, storage) => {
      const savedState = await storage.getItem(key);

      if (savedState && !hasStoreStructureChanged(store, savedState)) {
        try {
          await MessageBox.confirm('本地可能存在编辑过的配置，是否尝试恢复?', '提示', {
            type: 'warning',
          });

          return savedState;
        } catch {
          // cancelled
          return Promise.resolve();
        }
      } else {
        return Promise.resolve();
      }
    },

    modules: ['persist'],
  });

  vuexPersist.plugin(store);

  // const rehydrateStore = async () => {
  //   const savedStatePromise = localforage.getItem(vuexPersist.key);
  //   if (savedStatePromise) {
  //     try {
  //       await MessageBox.confirm('可能存在编辑过的配置，是否尝试恢复?', '提示', {
  //         type: 'warning',
  //       });
  //       const savedState = await savedStatePromise;
  //       store.replaceState(merge({}, store.state, savedState));
  //     } catch {
  //       // cancelled
  //     }
  //   }
  // };

  // rehydrateStore();
};
