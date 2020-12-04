<template>
  <el-switch
    v-model="currentTheme"
    active-value="dark"
    inactive-value="light"
    active-icon-class="fas fa-moon tw-text-blue-100"
    inactive-icon-class="fas fa-sun tw-text-yellow-300"
  ></el-switch>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'TheThemeToggle',

  data: () => ({
    currentTheme: '',
  }),

  computed: {
    ...mapState('ui', ['theme']),
  },

  mounted() {
    if (
      this.theme === 'dark' ||
      (!this.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      this.initTheme('dark');
    } else {
      this.initTheme('light');
    }

    this.$watch('currentTheme', function (val, oldVal) {
      this.setTheme(val);

      this.toggleClass(val, oldVal);
    });
  },

  methods: {
    ...mapMutations('ui', ['setTheme']),

    initTheme(theme) {
      this.setTheme(theme);
      this.toggleClass(theme);
      this.currentTheme = theme;
    },

    toggleClass(theme, oldTheme) {
      const rootEl = this.$root.$el;
      if (oldTheme) {
        rootEl.classList.remove(oldTheme);
      }
      rootEl.classList.add(theme);
    },
  },
};
</script>
