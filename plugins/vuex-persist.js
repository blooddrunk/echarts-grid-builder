import VuexPersistence from 'vuex-persist';
import localforage from 'localforage';

export default ({ store }) => {
  new VuexPersistence({
    key: 'echarts_grid_builder',

    asyncStorage: true,
    storage: localforage,

    modules: ['persist'],
  }).plugin(store);
};
