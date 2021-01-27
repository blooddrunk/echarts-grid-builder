import { setState } from '@/utils/vuex.js';

export const state = () => ({
  // different versions of persisted state and current state considered incompatible with each other
  // (so that wont' be restored at app launch)
  version: 1,

  // whether use has changed persisted state
  hasPersistedStateChange: false,
});

export const mutations = {
  setHasPersistedStageChange: setState('hasPersistedStateChange'),
};
