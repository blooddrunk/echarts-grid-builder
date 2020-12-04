import merge from 'lodash/merge';

import withChart from '@/mixins/withChart.js';
import { toPercentage } from '@/utils/math';

export default {
  mixins: [withChart()],

  props: {
    categoryDim: {
      type: String,
      default: 'name',
      required: true,
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
      default: undefined,
    },

    markLine: {
      type: Object,
      default: undefined,
    },

    min: {
      type: [String, Number, Function],
      default: undefined,
    },

    max: {
      type: [String, Number, Function],
      default: undefined,
    },

    percent: {
      type: [Boolean, Object],
      default: undefined,
    },

    series: {
      type: [Array, Function],
      default: undefined,
    },

    simpleTooltip: {
      type: Boolean,
      default: false,
    },

    tooltip: {
      type: [Boolean, Object, Function],
      default: true,
    },

    valueDim: {
      type: Array,
      required: true,
    },

    xAxis: {
      type: [Boolean, Object, Function],
      default: true,
    },

    yAxis: {
      type: [Boolean, Object, Function],
      default: true,
    },
  },

  computed: {
    chartDims() {
      return [this.categoryDim].concat(this.valueDim);
    },

    valueDimLength() {
      return this.valueDim ? this.valueDim.length : 0;
    },

    tooltipFormatter() {
      return this.getTooltipFormatter({
        type: this.simpleTooltip ? 'simple' : 'normal',
        valueGetter: ({ data, seriesName }) => {
          const dim = this.dimLookup[seriesName];
          if (!dim) {
            throw new Error(`Unable to find property name for ${seriesName} in data`);
          }

          let value = data[dim.name];
          const percent = dim.percent || this.percent;
          if (percent === true) {
            value = toPercentage(value);
          } else if (percent) {
            value = toPercentage(value, percent);
          }

          return value;
        },
      });
    },

    chartToolTip() {
      const defaultTooltipConfig = {
        confine: true,
        show: !!this.tooltip,
        // * center tooltip
        // position: (point, params, dom, rect, size) => {
        //     const { viewSize, contentSize } = size;
        //     return [(viewSize[0] - contentSize[0]) / 2, (viewSize[1] - contentSize[1]) / 2];
        // },
        trigger: 'axis',
        formatter: this.tooltipFormatter,
      };

      if (typeof this.tooltip === 'function') {
        return this.tooltip(defaultTooltipConfig);
      }

      return merge(defaultTooltipConfig, this.tooltip);
    },

    chartYAxis() {
      const defaultYAxisConfig = {
        type: 'value',
        show: !!this.yAxis,
        nameTextStyle: {
          color: '#666',
        },
        min: this.min,
        max: this.max,
      };

      if (typeof this.yAxis === 'function') {
        return this.yAxis(defaultYAxisConfig);
      }

      return merge(defaultYAxisConfig, this.yAxis);
    },

    chartGrid() {
      const defaultGridConfig = {
        left: '5%',
        right: '5%',
        top: 50,
        bottom: 90,
      };

      return merge(defaultGridConfig, this.grid);
    },

    chartLegend() {
      const defaultLegendConfig = {
        show: typeof this.legend === 'undefined' ? this.valueDimLength > 1 : !!this.legend,
        bottom: 5,
      };

      return merge(defaultLegendConfig, this.legend);
    },

    chartOptions() {
      return this.getOption({
        color: typeof this.color === 'string' ? [this.color] : this.color,

        grid: this.chartGrid,

        legend: this.chartLegend,

        tooltip: this.chartToolTip,

        xAxis: this.chartXAxis,

        yAxis: this.chartYAxis,
      });
    },
  },
};
