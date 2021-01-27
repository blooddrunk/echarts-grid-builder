import VuexPersistence from 'vuex-persist';
import localforage from 'localforage';
import { MessageBox, Loading } from 'element-ui';

// import { mutations as UIMutations } from '@/store/persist/ui.js';
// import { mutations as chartMutations } from '@/store/persist/chart.js';

const PERSIST_KEY = 'echarts_grid_builder';
// const PERSIST_MUTATIONS = [...Object.keys(UIMutations), ...Object.keys(chartMutations)];

const hasStoreVersionChanged = (store, savedState) =>
  store.state.persist.version !== savedState.persist.version;
// const hasPersistedStateChange = (savedState) => savedState.persist.hasPersistedStateChange;

export default ({ store }) => {
  const vuexPersist = new VuexPersistence({
    key: PERSIST_KEY,

    asyncStorage: true,
    storage: localforage,
    restoreState: async (key, storage) => {
      const savedState = await storage.getItem(key);

      if (
        savedState &&
        savedState.persist &&
        // hasPersistedStateChange(savedState) &&
        !hasStoreVersionChanged(store, savedState)
      ) {
        const loading = Loading.service({
          fullscreen: true,
        });

        try {
          await MessageBox.confirm('本地可能存在编辑过的配置，是否尝试恢复?', '提示', {
            type: 'warning',
          });

          return savedState;
        } catch {
          // cancelled
          return Promise.resolve();
        } finally {
          loading.close();
        }
      } else {
        return Promise.resolve();
      }
    },

    modules: ['persist'],
  });

  vuexPersist.plugin(store);

  // store.subscribe((mutation, state) => {
  //   if (PERSIST_MUTATIONS.includes(mutation.type)) {
  //     store.commit('persist/setHasPersistedStageChange', true);
  //   }
  // });
};
