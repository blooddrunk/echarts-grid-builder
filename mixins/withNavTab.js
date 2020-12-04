import { mapState } from 'vuex';

import { menuLookup } from '@/assets/menu';
import NavTab from '@/components/UI/NavTab.vue';

export default (rootRouteName) => ({
  middleware({ redirect, route, store }) {
    const rootRoute = menuLookup[rootRouteName];
    if (!rootRoute) {
      return;
    }

    const childRoutes = rootRoute.children || [];
    store.commit('ui/setCurrentNavTab', childRoutes);

    if (route.name === rootRouteName) {
      const firstPermittedMenu = store.getters['auth/getFirstPermittedMenu'](childRoutes);
      if (firstPermittedMenu) {
        return redirect(firstPermittedMenu.to);
      }
    }
  },

  components: {
    NavTab,
  },

  computed: {
    ...mapState('ui', ['currentNavTabList']),
  },
});
