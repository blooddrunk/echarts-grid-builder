import 'echarts/lib/component/dataset';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import debounce from 'lodash/debounce';
import merge from 'lodash/merge';
import { addListener, removeListener } from 'resize-detector';

import ECharts from 'vue-echarts';

import { getDisplayName } from '@/utils/vm';
import { getTooltipFormatter, getDimLookup } from '@/utils/chart';

const debug = process.env.NODE_ENV === 'development';

/**
 * This mixin has a lot of opinionated conventions,
 * for the key components that form a complete chart option,
 * it lacks reliability that vue provides such as props validation.
 * That being said, I still prefer keep these parts local and as much as
 * isolated as possible
 */
export default ({
  ref = 'chart',
  aspectRatio,
  optionsField = 'chartOptions',
  seriesField = 'chartSeries',
  dimsField = 'chartDims',
  dataField = 'chartData',
  displayEmptyValue = 'N/A',
  precision = 2,
} = {}) => ({
  components: {
    ECharts,
  },

  props: {
    // FIXME: DO NOT use autoresize when using aspectRatio
    aspectRatio: {
      type: Number,
      default: aspectRatio,
    },

    autoresize: {
      type: Boolean,
      default: false,
    },

    color: {
      type: [Array, String],
      default: undefined,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    displayEmptyValue: {
      type: [String, Number],
      default: displayEmptyValue,
    },

    precision: {
      type: Number,
      default: precision,
    },

    showLog: {
      type: Boolean,
      default: false,
    },

    theme: {
      type: String,
      default: 'primary',
    },

    title: {
      type: String,
      default: undefined,
    },
  },

  data() {
    return {
      chartLoading: this.loading,
      chartMounted: false,
    };
  },

  computed: {
    displayName() {
      return getDisplayName(this);
    },

    // FIXME: bad practice as https://vuejs.org/v2/guide/components-edge-cases.html#Accessing-Child-Component-Instances-amp-Child-Elements indicates
    chartInstance() {
      if (this.chartMounted) {
        if (!this.$refs[ref]) {
          console.warn(`${this.displayName}[withChart]: ref '${ref}' should be supplied`);
        }

        return this.$refs[ref];
      }

      return null;
    },

    dimLookup() {
      return getDimLookup(this[dimsField]);
    },

    defaultOption() {
      return {
        tooltip: {
          confine: true,
          extraCssText: 'max-width: 90%; white-space: normal',
        },

        dataset: {
          dimensions: this[dimsField],
          source: this[dataField],
        },

        series: this[seriesField],

        title: {
          text: this.title,
          top: 20,
          left: 'center',
          textStyle: {
            color: '#1486CD',
            fontSize: 18,
          },
        },
      };
    },
  },

  created() {
    if (!this[optionsField]) {
      console.error(
        `${this.displayName}[withChart]: '${optionsField}' should be defined for echarts options`
      );
      return;
    }

    if (debug && this.showLog) {
      this.$_unwatchOption = this.$watch(
        function () {
          return this[optionsField];
        },
        function (val) {
          console.log(`${this.displayName}[options]: `, val);
        },
        { immediate: true }
      );
    }
  },

  watch: {
    loading(val) {
      this.chartLoading = val;
    },

    chartLoading() {
      this.$_checkLoadingState();
    },
  },

  async mounted() {
    this.chartMounted = true;

    await this.$nextTick();
    this.$_keepAspectRatio();

    setTimeout(() => {
      this.$_checkLoadingState();
    }, 150);
  },

  beforeDestroy() {
    if (this.$_resizeHandler) {
      removeListener(this.chartInstance.$el, this.$_resizeHandler);
    }
  },

  methods: {
    $_callInstance(fn, ...args) {
      this.chartInstance && this.chartInstance[fn](...args);
    },

    $_showLoading() {
      this.$_callInstance('showLoading', {
        text: '加载中...',
        color: '#0AABF6',
        textColor: '#0AABF6',
        maskColor: 'rgba(255, 255, 255, 0.25)',
      });
    },

    $_hideLoading() {
      this.$_callInstance('hideLoading');
    },

    $_checkLoadingState() {
      if (this.chartLoading === true) {
        this.$_showLoading();
      } else {
        this.$_hideLoading();
      }
    },

    $_resize(options) {
      this.$_callInstance('resize', options);
    },

    // automatically set height based on width and aspectRatio
    $_keepAspectRatio() {
      if (this.aspectRatio) {
        // this.chartInstance.$el.style.height = 'auto';

        this.$_resizeHandler = debounce(() => {
          // this.$_resize();
          const width = this.chartInstance.width;
          const height = this.chartInstance.width / this.aspectRatio;

          this.$_resize({
            height,
          });

          setTimeout(() => {
            this.$emit('size-change', {
              width,
              height,
            });
          }, 100);
        }, 150);
        addListener(this.chartInstance.$el, this.$_resizeHandler);

        this.$_resizeHandler();
      }
    },

    getOption(options = {}) {
      if (typeof options === 'function') {
        return options.call(this, this.defaultOption);
      } else {
        return merge({}, this.defaultOption, options);
      }
    },

    setOption(...args) {
      this.$_callInstance('mergeOptions', ...args);
    },

    async fetchChartData(dataFetcher) {
      this.$_showLoading();
      try {
        const response = await dataFetcher.call(this);
        return response;
      } catch (error) {
        // TODO: deal with error
        console.error(error);
      } finally {
        this.$_hideLoading();
      }
    },

    getTooltipFormatter(config) {
      if (!this[dimsField]) {
        throw new Error(`'${this[dimsField]}' must be defined for this to work`);
      }

      return getTooltipFormatter({
        displayEmptyValue: this.displayEmptyValue,
        precision: this.precision,
        valueFormatter: ({ data, seriesName }) => {
          const dimName = this.dimLookup[seriesName] && this.dimLookup[seriesName].name;
          if (!dimName) {
            throw new Error(`Unable to find property name for ${seriesName} in data`);
          }
          return data[dimName];
        },
        ...config,
      });
    },
  },
});
