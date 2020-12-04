<template>
  <ECharts ref="chart" :options="chartOptions" autoresize show-log v-on="$listeners"> </ECharts>
</template>

<script>
import unionWith from 'lodash/unionWith';
import 'echarts/lib/chart/map';
import { getMap, registerMap } from 'echarts';

import { getRegionNameList, REGION_MAP } from '@/utils/geo';
import withChart from '@/mixins/withChart';

export default {
  name: 'RegionMap',

  mixins: [withChart()],

  props: {
    data: {
      type: Array,
      default: () => [],
    },

    region: {
      type: String,
      required: true,
    },

    selectedMode: {
      type: [Boolean, String],
      default: false,
      validator: (value) => [false, 'single', 'multiple'].includes(value),
    },
  },

  data: () => ({
    mapName: null,
    mapJson: null,
  }),

  computed: {
    presetMapData() {
      if (this.mapJson) {
        const regionNameList = getRegionNameList(this.mapJson);
        return regionNameList.map((name) => ({
          name,
          value: null,
          itemStyle: {
            areaColor: '#CFD8DC',
            borderColor: '#718096',
          },
        }));
      }

      return [];
    },

    mapData() {
      return unionWith(
        this.data,
        this.presetMapData,
        (defaultItem, item) => defaultItem.name === item.name
      );
    },

    chartSeries() {
      return {
        type: 'map',

        mapType: this.mapName,

        selectedMode: this.selectedMode,

        showLegendSymbol: false,

        data: this.mapData,

        itemStyle: {
          areaColor: '#CFD8DC',
          borderColor: '#CBD5E0',
          borderWidth: 0.5,
        },

        emphasis: {
          label: {
            show: false,
          },

          itemStyle: {
            areaColor: '#78909C',
            shadowBlur: 20,
            borderWidth: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      };
    },

    chartOptions() {
      return this.getOption({
        legend: {
          show: false,
        },

        tooltip: {
          formatter: ({ name }) => {
            return name;
          },
        },
      });
    },
  },

  watch: {
    region(val) {
      if (val) {
        this.registerMap();
      }
    },
  },

  created() {
    this.registerMap();
  },

  methods: {
    async registerMap() {
      const mapName = REGION_MAP[this.region];
      if (mapName) {
        try {
          this.mapJson = await import(`echarts/map/json/province/${mapName}.json`);

          if (!getMap(mapName)) {
            registerMap(mapName, this.mapJson);
          }
          await this.$nextTick();
          this.mapName = mapName;
        } catch (error) {
          console.error(error);
          this.$message.error('地图加载失败，请联系管理员');
        }
      } else {
        this.$message.error('地图加载失败，请联系管理员');
      }
    },

    toggleSelect(name) {
      this.chartInstance.dispatchAction({
        type: 'mapToggleSelect',
        name,
      });
    },
  },
};
</script>
