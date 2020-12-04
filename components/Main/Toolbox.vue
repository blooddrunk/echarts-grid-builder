<template>
  <div :class="$style.toolbox">
    <header>
      <el-button type="primary" plain @click="toggleBgPanel">
        选择背景
        <FontAwesomeIcon class="tw-ml-1" icon="image"></FontAwesomeIcon>
      </el-button>

      <el-button type="primary" plain @click="toggleChartPanel">
        选择图表
        <FontAwesomeIcon class="tw-ml-1" icon="chart-area"></FontAwesomeIcon>
      </el-button>

      <el-button type="primary" plain @click="toggleFullscreenMode">
        全屏
        <FontAwesomeIcon class="tw-ml-1" icon="expand"></FontAwesomeIcon>
      </el-button>
    </header>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'Toolbox',

  computed: {
    ...mapState('ui', ['fullscreen']),
  },

  methods: {
    ...mapActions('ui', ['showBgPanel', 'showChartPanel']),
    ...mapMutations('ui', ['toggleFullscreen']),

    toggleBgPanel() {
      this.showBgPanel();
    },

    toggleChartPanel() {
      this.showChartPanel();
    },

    toggleFullscreenMode() {
      this.toggleFullscreen();
    },
  },
};
</script>

<style lang="scss" module>
.toolbox {
  @apply tw-self-start;
  @apply tw-py-3 tw-flex-shrink-0;

  &.fullscreen {
    @apply tw-fixed tw-left-0 tw-top-0 tw-p-6;
    @apply tw-shadow-md;
  }
}
</style>
