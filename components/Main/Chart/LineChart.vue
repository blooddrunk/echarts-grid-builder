<template>
  <ECharts
    ref="chart"
    :autoresize="autoresize"
    :theme="theme"
    :options="chartOptions"
    v-on="$listeners"
  >
  </ECharts>
</template>

<script>
import merge from 'lodash/merge';
import 'echarts/lib/chart/line';

import withSimple2DChart from '@/mixins/withSimple2DChart.js';

export default {
  name: 'LineChart',

  mixins: [withSimple2DChart],

  computed: {
    chartData() {
      return this.data;
    },

    chartXAxis() {
      const defaultXAxisConfig = {
        type: 'category',
        show: !!this.xAxis,
        axisLabel: {},
      };

      return merge(defaultXAxisConfig, this.xAxis);
    },

    chartSeries() {
      if (Array.isArray(this.series)) {
        return this.series;
      }

      const baseConfig = {
        type: 'line',
      };

      if (typeof this.series === 'function') {
        return this.series(baseConfig);
      }

      return Array(this.valueDimLength).fill(baseConfig);
    },
  },
};
</script>
