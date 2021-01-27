import { getField, updateField } from 'vuex-map-fields';

import { setState } from '@/utils/vuex.js';

export const state = () => ({
  // whether use has changed persisted state
  hasPersistedStateChange: false,
});

export const getters = {
  getField,
};

export const mutations = {
  updateField,

  setHasPersistedStageChange: setState('hasPersistedStateChange'),
};
