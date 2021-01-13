import VuexPersistence from 'vuex-persist';
import localforage from 'localforage';
import { MessageBox } from 'element-ui';
import merge from 'lodash/merge';

export default ({ store }) => {
  const vuexPersist = new VuexPersistence({
    key: 'echarts_grid_builder',

    asyncStorage: true,
    storage: localforage,
    restoreState: async (key, storage) => {
      const savedStatePromise = storage.getItem(key);
      if (savedStatePromise) {
        try {
          await MessageBox.confirm('可能存在编辑过的配置，是否尝试恢复?', '提示', {
            type: 'warning',
          });

          return savedStatePromise;
        } catch {
          // cancelled
        }
      }

      return Promise.resolve();
    },
    // restoreState: () => Promise.resolve(null),

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
