import { setState } from '@/utils/vuex';

export const state = () => ({
  theme: 'primary',

  currentBackground: '',
});

export const mutations = {
  setTheme: setState('theme'),

  setCurrentBackground: setState('currentBackground'),
  resetBackground: (state) => {
    state.currentBackground = '';
  },
};
