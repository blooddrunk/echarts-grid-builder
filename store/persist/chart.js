import merge from 'lodash/merge';
import Vue from 'vue';

import { setState } from '@/utils/vuex';
import sampleData from '@/assets/chart/sample-data.json';

export const defaultCanvasConfig = {
  panelHeight: screen.height,
  useScreenHeight: true,
  useAutoLineHeight: true,
  rowNum: 4,
  grid: {
    colNum: 4,
    rowHeight: 200,
    margin: [40, 40],
  },
};

const createSampleDataByType = ({ type, pType }) => {
  if (!type) {
    return [];
  }

  return sampleData[type] || sampleData[pType] || [];
};

// TODO: more precise data validation
const assertDataPayload = (payload) => {
  if (!Array.isArray(payload)) {
    throw new TypeError('图表数据不合法， 请检查');
  }
};

export const state = () => ({
  canvasConfig: defaultCanvasConfig,
  canvasLayout: [
    // { x: 0, y: 0, w: 1, h: 1, i: '0' },
    // { x: 2, y: 0, w: 1, h: 1, i: '1' },
  ],

  // chart option without dataset, use getters bellow to get option with dataset
  chartConfigMap: {},
  // where chart dataset sits
  chartDataMap: {},

  currentEditingChart: '',
});

export const getters = {
  gridConfig: (state) => state.canvasConfig?.grid || {},
  gridHeight: (state) => state.canvasConfig?.panelHeight,

  canvasLayoutMap: (state) =>
    state.canvasLayout.reduce((acc, layout) => {
      acc[layout.i] = layout;
      return acc;
    }, {}),

  currentChartCount: (state) => (state.canvasLayout ? state.canvasLayout.length : 0),

  getChartDataById: (state) => {
    const dataMap = state.chartDataMap;

    return (id) => dataMap[id] || [];
  },

  getChartConfigById: (state, { getChartDataById }) => {
    const getData = getChartDataById;
    const configMap = state.chartConfigMap;

    return (id) => {
      const source = getData(id);
      return {
        ...configMap[id],
        dataset: {
          source,
        },
      };
    };
  },

  currentChartLayout: (state, { canvasLayoutMap }, rootState) =>
    canvasLayoutMap[rootState.chart.currentEditingChart] || {},

  currentChartData: (state, getters, rootState) =>
    state.chartDataMap[rootState.chart.currentEditingChart] || [],

  currentChartConfig: (state, { currentChartData }, rootState) => ({
    ...state.chartConfigMap[rootState.chart.currentEditingChart],
    dataset: {
      source: currentChartData,
    },
  }),
};

export const mutations = {
  setCanvasConfig: setState('canvasConfig'),
  resetCanvasConfig: (state) => {
    state.canvasConfig = defaultCanvasConfig;
  },

  setCanvasLayout: setState('canvasLayout'),
  addCanvasItem: (state, payload) => {
    if (!payload.i) {
      throw new Error(`Id(property 'i' is required`);
    }

    if (!state.canvasLayout) {
      state.canvasLayout = [];
    }

    state.canvasLayout.push(payload);

    // populate with preset sample data
    state.chartDataMap[payload.i] = createSampleDataByType(payload);
  },
  removeCanvasItemById: (state, id) => {
    state.canvasLayout = state.canvasLayout.filter((layout) => layout.i !== id);

    delete state.chartDataMap[id];
  },

  setCurrentEditingChart: setState('currentEditingChart'),

  updateChartConfig: (state, payload) => {
    Vue.set(
      state.chartConfigMap,
      state.currentEditingChart,
      merge({}, state.chartConfigMap[state.currentEditingChart], payload)
    );
  },

  updateChartConfigById: (state, payload) => {
    if (!payload || !payload.id) {
      throw new Error(`Id(property 'id') is required`);
    }

    Vue.set(
      state.chartConfigMap,
      payload.id,
      merge({}, state.chartConfigMap[payload.id], payload.data)
    );
  },

  updateChartData: (state, payload) => {
    assertDataPayload(payload);

    state.chartDataMap = {
      ...state.chartDataMap,
      [state.currentEditingChart]: payload,
    };

    // FIXME: why can't this trigger watchers??
    // Vue.set(state.chartDataMap, state.currentEditingChart, payload);
  },

  updateChartDataById: (state, payload) => {
    if (!payload || !payload.id) {
      throw new Error(`Id(property 'id') is required`);
    }

    assertDataPayload(payload.data);

    state.chartDataMap = {
      ...state.chartDataMap,
      [payload.id]: payload,
    };
  },
};

export const actions = {};
