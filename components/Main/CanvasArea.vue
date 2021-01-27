<template>
  <div
    id="__canvas__"
    :class="[$style.canvas, fullscreen ? $style.fullscreen : '']"
    :style="canvasStyle"
    @drop="onDrop"
    @dragover="onDragOver"
  >
    <GridLayout
      v-if="layout"
      ref="grid"
      :style="gridStyle"
      v-bind="gridConfig"
      :auto-size="false"
      :layout="layout"
      @update:layout="handleLayoutChange"
      @layout-updated="handleLayoutChange"
    >
      <ChartContainer
        v-for="item in layout"
        :key="item.i"
        :layout="item"
        :remove-item="removeItem"
        @click.native="handleChartSelect(item.i)"
      >
      </ChartContainer>
    </GridLayout>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import { GridLayout } from 'vue-grid-layout';

import { convertToUnit } from '@/utils/misc';
import ChartContainer from './ChartContainer';

// @dragenter="onDragEnter"
// @dragleave="onDragLeave"

export default {
  name: 'CanvasArea',

  components: {
    GridLayout,
    ChartContainer,
  },

  props: {
    layout: {
      type: Array,
      required: true,
    },

    removeItem: {
      type: Function,
      required: true,
    },

    onDrop: {
      type: Function,
      required: true,
    },

    onDragEnter: {
      type: Function,
      required: true,
    },

    onDragLeave: {
      type: Function,
      required: true,
    },

    onDragOver: {
      type: Function,
      required: true,
    },
  },

  computed: {
    ...mapState('persist/ui', ['currentBackground']),
    ...mapGetters('persist/chart', ['gridConfig', 'gridHeight']),
    ...mapState('ui', ['fullscreen']),

    gridStyle() {
      const height = convertToUnit(this.gridHeight) || '100%';
      return {
        height,
      };
    },

    canvasStyle() {
      if (!this.currentBackground) {
        return null;
      }

      return {
        backgroundImage: `url('${this.$config.routerRoot}images/bg/${this.currentBackground}.png')`,
      };
    },
  },

  watch: {
    fullscreen(val) {
      if (!this.$el) {
        return;
      }

      if (val) {
        this.$el.requestFullscreen();
      } else if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    },
  },

  mounted() {
    document.addEventListener('fullscreenchange', this.handleFullscreenChange);

    this.$on('hook:beforeDestroy', () => {
      document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
    });
  },

  methods: {
    ...mapMutations('ui', ['toggleFullscreen']),
    ...mapActions('ui', ['showChartConfig']),

    handleFullscreenChange() {
      // exit fullscreen
      if (!document.fullscreenElement) {
        this.toggleFullscreen(false);
      }
    },

    handleLayoutChange(newLayout) {
      this.$emit('layout-updated', newLayout);
    },

    handleChartSelect(id) {
      this.showChartConfig(id);
    },
  },
};
</script>

<style lang="scss" module>
.canvas {
  @apply tw-flex-grow tw-mt-6 tw-bg-white tw-overflow-auto;

  :global {
    .vue-grid-item {
      touch-action: none;

      &:not(.vue-grid-placeholder) {
        @apply tw-border tw-border-medium tw-rounded-lg tw-overflow-hidden;
        @apply tw-shadow-lg;
      }

      &.resizing {
        @apply tw-opacity-75;
      }

      &.vue-grid-placeholder {
        @apply tw-bg-tertiary;
      }

      &.selected {
        @apply tw-shadow-accent;
      }
    }
  }

  &.fullscreen {
    @apply tw-overflow-hidden;
  }
}
</style>
