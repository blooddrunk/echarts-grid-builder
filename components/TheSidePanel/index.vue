<template>
  <div v-if="isSidePanelVisible" :class="$style.panel">
    <header class="tw-flex tw-items-center tw-px-3 tw-border-b-thin tw-border-light">
      <h3 class="tw-font-semibold tw-text-primary">{{ currentSidePanelContent.title }}</h3>

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
  @apply tw-flex-shrink-0 tw-flex tw-flex-col tw-w-84;
  @apply tw-border-l-thin tw-border-light;

  :global {
    .el-collapse-item__header {
      @apply tw-px-3;
      @apply tw-font-semibold tw-text-base tw-text-medium;

      &.is-active {
        @apply tw-text-secondary;
      }
    }

    .el-collapse-item__content {
      @apply tw-py-3 tw-px-4 tw-bg-main;
    }

    .el-form-item {
      .el-input-number {
        @apply tw-w-full;
      }
    }
  }
}
</style>
