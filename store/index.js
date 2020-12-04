import createPersistedState from 'vuex-persistedstate';
import { getField, updateField } from 'vuex-map-fields';

export const plugins = [
  createPersistedState({
    key: 'echarts_grid_builder',
    paths: ['ui.theme'],
    filter: ({ type }) => ['ui/setTheme'].some((mutation) => mutation === type),
  }),
];

export const getters = {
  getField,
};

export const mutations = {
  updateField,
};
