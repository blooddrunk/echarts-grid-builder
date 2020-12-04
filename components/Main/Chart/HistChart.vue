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
import 'echarts/lib/chart/bar';

import theme from '@/plugins/echarts/theme/primary';
import { getAxisLabelFormatter } from '@/utils/chart';
import withSimple2DChart from '@/mixins/withSimple2DChart.js';

// TODO: create hignlight color set
const highlightColorSet = theme.color;

const orderByDesc = (data = [], key) => {
  return data.slice().sort((a, b) => (b[key] || 0) - (a[key] || 0));
};

export default {
  name: 'HistChart',

  mixins: [withSimple2DChart],

  props: {
    highlight: {
      type: [Object, String],
      default: undefined,
    },

    xAxisLabelBreak: {
      type: Number,
      default: 0,
    },

    sorted: {
      type: [Boolean, String],
      default: false,
    },
  },

  computed: {
    defaultOrderKey() {
      if (this.valueDim) {
        const item = this.valueDim[0];
        return item && item.name ? item.name : item;
      }

      return '';
    },

    computedHighlight() {
      let highlight = this.highlight;
      if (typeof highlight === 'string') {
        highlight = {
          name: highlight,
        };
      }

      return highlight;
    },

    // highlightIndex() {
    //   if (this.computedHighlight) {
    //     const { name, index } = this.computedHighlight;
    //     if (index) {
    //       return index;
    //     } else {
    //       return this.chartData.findIndex((item) => item[this.categoryDim] === name);
    //     }
    //   }

    //   return -1;
    // },

    chartData() {
      if (this.sorted) {
        const sortBy = this.sorted === true ? this.defaultOrderKey : this.sorted;
        return orderByDesc(this.data, sortBy);
      }
      return this.data;
    },

    chartXAxis() {
      const defaultXAxisConfig = {
        type: 'category',
        show: !!this.xAxis,
        axisLabel: {
          rotate: 45,
          formatter: getAxisLabelFormatter(+this.xAxisLabelBreak),
        },
      };

      if (typeof this.xAxis === 'function') {
        return this.xAxis(defaultXAxisConfig);
      }

      return merge(defaultXAxisConfig, this.xAxis);
    },

    chartSeries() {
      if (Array.isArray(this.series)) {
        return this.series;
      }

      const baseConfig = {
        type: 'bar',
        barMaxWidth: 16,
        // barGap: '70%',
        markLine: this.markLine,
      };

      if (this.computedHighlight) {
        const itemStyle = {
          color: (param) => {
            const { seriesIndex, name } = param;

            if (
              seriesIndex === this.computedHighlight.index ||
              name === this.computedHighlight.name
            ) {
              return this.computedHighlight.color || highlightColorSet[seriesIndex];
            }

            return theme.color[seriesIndex];
          },
        };
        baseConfig.itemStyle = itemStyle;
      }

      if (typeof this.series === 'function') {
        return this.series(baseConfig);
      }

      return Array(this.valueDimLength).fill(baseConfig);
    },
  },
};
</script>
