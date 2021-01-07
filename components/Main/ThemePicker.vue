<template>
  <el-dropdown @command="handleThemeChange">
    <el-button type="primary">
      选择主题（WIP）
      <FontAwesomeIcon icon="palette"></FontAwesomeIcon>
    </el-button>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="{ id, config } in themeList" :key="id" :command="id">
        <div
          class="tw-mb-1 tw-p-2 tw-flex tw-items-center tw-justify-between tw-shadow tw-space-x-1 tw-rounded"
          :class="getActiveClass(id)"
          :style="{ backgroundColor: config.backgroundColor }"
        >
          <div
            v-for="color in config.color"
            :key="color"
            class="tw-w-6 tw-h-6 tw-rounded"
            :style="{ backgroundColor: color }"
          ></div>
        </div>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'ThemePicker',

  computed: {
    ...mapState('ui', ['theme', 'themeList']),
  },

  methods: {
    ...mapMutations('ui', ['setTheme']),

    handleThemeChange(theme) {
      this.setTheme(theme);
    },

    getActiveClass(theme) {
      if (theme === this.theme) {
        return 'tw-ring-2 tw-ring-primary';
      }

      return '';
    },
  },
};
</script>
