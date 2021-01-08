import { setState, toggleState } from '@/utils/vuex';

export const state = () => ({
  availableThemes: ['primary', 'theme-1', 'theme-2', 'theme-3'],
  themeList: [],

  fullscreen: false,

  isSidePanelVisible: false,
  currentSidePanelContent: {},

  backgroundList: ['bg-0', 'bg-1'],

  configPreviewDialogVisible: false,
  configPreviewContent: {},
});

export const getters = {
  currentPanelComponent: (state) => (state.currentSidePanelContent || {}).component,
};

export const mutations = {
  setThemeList: setState('themeList'),
  toggleFullscreen: toggleState('fullscreen'),

  toggleSidePanel: toggleState('isSidePanelVisible'),
  showBgPanel: (state) => {
    state.currentSidePanelContent = {
      component: 'BackgroundEdit',
      title: '选择背景',
    };
  },
  showChartGallery: (state) => {
    state.currentSidePanelContent = {
      component: 'ChartGallery',
      title: '选择图表',
    };
  },
  showChartConfig: (state) => {
    state.currentSidePanelContent = {
      component: 'ChartEdit',
      title: '编辑图表',
    };
  },

  showConfigPreviewDialog: setState('configPreviewDialogVisible'),
  setConfigPreviewContent: setState('configPreviewContent'),
};

const shouldOpenPanel = (currentPanelComponent, targetComponent) => {
  if (currentPanelComponent === targetComponent) {
    return undefined;
  }

  return true;
};

export const actions = {
  showBgPanel: ({ commit, getters }) => {
    const visible = shouldOpenPanel(getters.currentPanelComponent, 'BackgroundEdit');
    commit('toggleSidePanel', visible);
    commit('showBgPanel');
    if (visible) {
      commit('persist/chart/setCurrentEditingChart', '', { root: true });
    }
  },

  showChartPanel: ({ commit, getters }) => {
    const visible = shouldOpenPanel(getters.currentPanelComponent, 'ChartGallery');
    commit('toggleSidePanel', visible);
    commit('showChartGallery');
    if (visible) {
      commit('persist/chart/setCurrentEditingChart', '', { root: true });
    }
  },

  showChartConfig: ({ commit, getters }, payload) => {
    commit('toggleSidePanel', true);
    commit('persist/chart/setCurrentEditingChart', payload, { root: true });
    commit('showChartConfig');
  },
};
