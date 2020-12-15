<template>
  <div v-if="isSidePanelVisible" :class="$style.panel">
    <header class="tw-flex tw-items-center tw-px-3 tw-border-b-thin tw-border-light tw-text-dark">
      <h3 class="tw-font-semibold">{{ currentSidePanelContent.title }}</h3>

      <el-button class="tw-ml-auto tw-text-xl" type="text" @click="hidePanel">
        <FontAwesomeIcon icon="times"></FontAwesomeIcon>
      </el-button>
    </header>

    <div v-if="currentPanelComponent" class="tw-flex-grow tw-px-4 tw-py-8 tw-overflow-y-auto">
      <transition
        enter-active-class="animate__animated animate__fadeIn animate__faster"
        mode="out-in"
      >
        <component :is="currentPanelComponent" v-bind="$attrs"></component>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

import defaultChartConfig from '@/assets/chart/default-config.json';
import ChartEdit from './ChartEdit';
import BackgroundEdit from './BackgroundEdit';
import ChartGallery from './ChartGallery';

export default {
  name: 'TheSidePanel',

  components: {
    BackgroundEdit,
    ChartGallery,
    ChartEdit,
  },

  provide: {
    defaultChartConfig,
  },

  inheritAttrs: false,

  computed: {
    ...mapState('ui', ['isSidePanelVisible', 'currentSidePanelContent']),
    ...mapGetters('ui', ['currentPanelComponent']),
  },

  methods: {
    ...mapMutations('ui', ['toggleSidePanel']),

    hidePanel() {
      this.toggleSidePanel(false);
    },
  },
};
</script>

<style lang="scss" module>
.panel {
  @apply tw-relative tw-h-full tw-pb-4;
  @apply tw-flex-shrink-0 tw-flex tw-flex-col tw-w-88;
  @apply tw-border-l-thin tw-border-light;

  :global {
    .el-collapse {
      @apply tw-border-t-0;
    }

    .el-collapse-item__header {
      @apply tw-px-3;
      @apply tw-font-semibold tw-text-base tw-text-medium;

      &.is-active {
        @apply tw-text-secondary;
      }
    }

    .el-collapse-item__content {
      @apply tw-pl-0 tw-pr-4 tw-py-6 tw-bg-main;

      .el-form-item:last-child {
        @apply tw-mb-0;
      }

      .el-collapse-item__header {
        @apply tw-bg-gray-200 tw-bg-opacity-70;
      }

      .el-collapse-item__content {
        @apply tw-bg-gray-200 tw-bg-opacity-90;
      }
    }

    .el-form-item {
      .el-input-number {
        @apply tw-w-full;
      }
    }
  }

  fieldset {
    @apply tw-py-2 tw-px-3;
  }

  legend {
    @apply tw-text-primary;
    @apply tw-w-full tw-grid tw-items-center tw-gap-x-3;

    grid-template-columns: 1fr auto 2fr;

    &:before,
    &:after {
      content: '';
      @apply tw-flex-grow;
      @apply tw-border-b-2 tw-border-primary;
    }
  }
}
</style>
