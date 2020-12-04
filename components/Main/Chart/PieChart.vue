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
import 'echarts/lib/chart/pie';

import withChart from '@/mixins/withChart.js';
import { getPieTooltipFormatter, normalizePieData } from '@/utils/chart';

export default {
  name: 'PieChart',

  mixins: [withChart()],

  props: {
    categoryKey: {
      type: String,
      default: 'name',
    },

    valueKey: {
      type: String,
      default: 'value',
    },

    data: {
      type: Array,
      default: () => [],
    },

    grid: {
      type: Object,
      default: undefined,
    },

    legend: {
      type: [Boolean, Object],
      default: true,
    },

    series: {
      type: [Object, Function],
      default: undefined,
    },

    ring: {
      type: Boolean,
      default: true,
    },

    showNumber: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    chartData() {
      return normalizePieData(this.data, {
        categoryKey: this.categoryKey,
        valueKey: this.valueKey,
      }).sort((a, b) => b.value - a.value);
    },

    chartDims() {
      return [this.categoryKey, this.valueKey];
    },

    chartSeries() {
      const baseConfig = {
        type: 'pie',
        radius: [this.ring ? '20%' : 0, '40%'],
        center: ['50%', '40%'],
        selectedMode: 'single',
        startAngle: 30,
        selectedOffset: 0,

        label: {
          fontSize: 10,
          formatter: ({ name, percent }) => {
            if (name) {
              name = name.replace(new RegExp(`(.{${7}})`, 'g'), `$1\n`);
            }
            return `${name}\n(${percent}%)`;
          },
        },
        labelLine: {
          length: 0.00001,
          // length2: 1,
        },
      };

      if (typeof this.series === 'function') {
        return this.series(baseConfig);
      }

      return merge(baseConfig, this.series);
    },

    chartGrid() {
      const defaultGridConfig = {
        top: 20,
        bottom: 20,
      };
      return merge(defaultGridConfig, this.grid);
    },

    chartLegend() {
      const defaultLegendConfig = {
        show: !!this.legend,
        top: '70%',
        formatter: (name) => {
          const target = this.chartData.find((item) => item[this.categoryKey] === name);
          if (target) {
            return `${target[this.categoryKey]}(${target.displayPercentage})`;
          }
        },
      };

      return merge(defaultLegendConfig, this.legend);
    },

    chartOptions() {
      return this.getOption({
        color: typeof this.color === 'string' ? [this.color] : this.color,

        grid: this.chartGrid,

        legend: this.chartLegend,

        title: {
          text: this.title,
        },

        tooltip: {
          show: true,
          position: ['10%', '50%'],
          formatter: getPieTooltipFormatter({
            type: 'pie',
            showNumber: this.showNumber,
            valueGetter: ({ data }) => data[this.valueKey],
          }),
        },
      });
    },
  },
};
</script>
