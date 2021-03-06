<template>
  <GridItem
    ref="gridItem"
    :key="layout.i"
    :class="{ selected, 'tw-hidden': layout.visible === undefined ? false : !layout.visible }"
    :x="layout.x"
    :y="layout.y"
    :w="layout.w"
    :h="layout.h"
    :i="layout.i"
    @resized="handleResize"
    @container-resized="handleResize"
  >
    <div :class="$style.container">
      <ECharts
        v-if="chartOptions"
        ref="chart"
        class="tw-w-full tw-h-full"
        autosize
        :theme="theme"
        :options="chartOptions"
      ></ECharts>

      <div v-show="!fullscreen" :class="$style.toolbar">
        <el-button type="text" @click="previewConfig()">
          <FontAwesomeIcon icon="code"></FontAwesomeIcon>
        </el-button>
        <el-button type="text" @click="removeItem(layout.i)">
          <FontAwesomeIcon icon="times"></FontAwesomeIcon>
        </el-button>
      </div>
    </div>
  </GridItem>
</template>

<script>
import { GridItem } from 'vue-grid-layout';
import { mapState, mapGetters, mapMutations } from 'vuex';
import omit from 'lodash/omit';

import { getDefaultChartOptionsByType } from '@/utils/chart';

export default {
  name: 'ChartContainer',

  components: {
    GridItem,
  },

  props: {
    layout: {
      type: Object,
      required: true,
    },

    removeItem: {
      type: Function,
      required: true,
    },
  },

  data: () => ({
    chartOptions: null,
  }),

  computed: {
    ...mapState('ui', ['fullscreen']),
    ...mapState('persist/chart', ['currentEditingChart', 'chartDataMap', 'chartConfigMap']),
    ...mapState('persist/ui', ['theme']),
    ...mapGetters('persist/chart', ['getChartDataById', 'getChartConfigById']),

    currentChartId() {
      return this.layout.i;
    },

    selected() {
      return this.currentEditingChart === this.layout.i && !this.fullscreen;
    },
  },

  created() {
    // fill in default option
    // preset data should already be populated at this time
    this.updateChartConfigById({
      id: this.layout.i,
      data: getDefaultChartOptionsByType({
        dataSource: this.getChartDataById(this.layout.i),
        type: this.layout.type,
      }),
    });

    this.startWatching();
  },

  methods: {
    ...mapMutations('persist/chart', ['updateChartConfigById']),
    ...mapMutations('ui', ['showConfigPreviewDialog', 'setConfigPreviewContent']),

    startWatching() {
      // ! watch current chart config and data change,
      // ! because vuex getters won't capture nested entry change

      this.$watch(
        () => this.chartDataMap[this.currentChartId],
        function () {
          this.updateCurrentChartOptions();
        },
        {
          deep: true,
        }
      );

      this.$watch(
        () => this.chartConfigMap[this.currentChartId],
        function () {
          this.updateCurrentChartOptions();
        },
        {
          deep: true,
          immediate: true,
        }
      );
    },

    updateCurrentChartOptions() {
      this.chartOptions = this.getChartConfigById(this.currentChartId);
    },

    handleResize() {
      if (this.$refs.chart) {
        setTimeout(() => {
          this.$refs.chart.resize();
        }, 300);
      }
    },

    previewConfig() {
      this.setConfigPreviewContent({
        base: omit(this.chartOptions, ['__series']),
        full: omit(this.$refs.chart.computedOptions, ['__series']),
      });
      this.showConfigPreviewDialog(true);
    },
  },
};
</script>

<style lang="scss" module>
.container {
  @apply tw-relative tw-w-full tw-h-full;

  .toolbar {
    @apply tw-absolute tw-right-0 tw-top-0;
    @apply tw-flex tw-items-center tw-px-3;
    @apply tw-transition tw-duration-150;
    @apply tw-transform tw-scale-x-0 tw-origin-right;
  }

  &:hover {
    .toolbar {
      @apply tw-scale-x-100;
    }
  }
}
</style>
