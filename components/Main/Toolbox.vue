<template>
  <div :class="$style.toolbox">
    <header class="tw-space-x-3">
      <el-button type="primary" @click="toggleBgPanel">
        选择背景
        <FontAwesomeIcon class="tw-ml-1" icon="image"></FontAwesomeIcon>
      </el-button>

      <el-button type="primary" @click="toggleChartPanel">
        选择图表
        <FontAwesomeIcon class="tw-ml-1" icon="chart-area"></FontAwesomeIcon>
      </el-button>

      <el-button type="primary" @click="toggleFullscreenMode">
        全屏
        <FontAwesomeIcon class="tw-ml-1" icon="expand"></FontAwesomeIcon>
      </el-button>

      <el-dropdown split-button type="primary" @command="handleExport">
        导出画布
        <FontAwesomeIcon icon="download"></FontAwesomeIcon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="image">
              <FontAwesomeIcon icon="image"></FontAwesomeIcon>
              图片
            </el-dropdown-item>
            <el-dropdown-item command="pdf">
              <FontAwesomeIcon icon="file-pdf"></FontAwesomeIcon>
              PDF
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
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

    // TODO: wait for all charts ready
    async handleExport(command) {
      const loadingInstance = this.$loading({ fullscreen: true });

      switch (command) {
        case 'image':
          await this.handleExportImage();
          break;
        case 'pdf':
          this.$message.warning('Not yet implemented');
          break;
        default:
          break;
      }

      loadingInstance.close();
    },

    async handleExportImage() {
      try {
        const { saveAs } = await import('file-saver');
        const targetEl = document.querySelector('#__canvas__');
        const html2canvas = (await import('html2canvas')).default;

        const canvas = await html2canvas(targetEl, {
          scrollY: 0,
        });
        canvas.toBlob((blob) => {
          saveAs(blob, 'charts.png');
        });
      } catch (error) {
        console.error(error);
        this.$message.error(`图片导出失败`);
      }
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
