<template>
  <div>
    <el-tabs v-model="activeTab" type="card" stretch>
      <el-tab-pane label="基本配置" name="base">
        <ChartEditBase
          v-if="currentChartConfig"
          ref="baseForm"
          :current-chart-option="currentChartConfig"
          :current-chart-layout="currentChartLayout"
          :config-key-range="baseConfigKeys"
          :on-option-change="handleBaseOptionChange"
          :on-data-change="handleDataChange"
          :on-data-commit="handleDataCommit"
        ></ChartEditBase>
      </el-tab-pane>
      <el-tab-pane label="进阶配置" name="advanced">
        <component
          :is="advancedEditComponent"
          ref="adForm"
          :current-chart-option="currentChartConfig"
          :current-chart-layout="currentChartLayout"
          :config-key-range="advancedConfigKeys"
          :on-option-change="handleBaseOptionChange"
        ></component>
      </el-tab-pane>
    </el-tabs>

    <div class="tw-w-full tw-absolute tw-bottom-0 tw-right-0 tw-flex">
      <el-button class="tw-w-full tw-rounded-none" type="primary" @click="handleBaseOptionCommit">
        确定
      </el-button>
      <el-button
        class="tw-ml-0 tw-w-full tw-rounded-none"
        type="primary"
        plain
        @click="handleReset"
      >
        重置
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';

import defaultChartConfig from '@/assets/chart/default-config.json';
import ChartEditBase from './ChartEditBase';
import ChartEditLine from './ChartEditLine';
import ChartEditFallback from './ChartEditFallback';

export default {
  name: 'ChartEdit',

  components: {
    ChartEditBase,
    ChartEditLine,
    ChartEditFallback,
  },

  data: () => ({
    activeTab: 'base',
    baseOption: {},
    dataSource: [],
  }),

  computed: {
    ...mapGetters('chart', ['currentChartConfig', 'currentChartLayout']),

    advancedEditComponent() {
      const { pType } = this.currentChartLayout;
      switch (pType) {
        case 'line':
          return 'ChartEditLine';
        default:
          return 'ChartEditFallback';
      }
    },

    baseConfigKeys() {
      return Object.keys(defaultChartConfig.base);
    },

    advancedConfigKeys() {
      const keys = ['series', '__series'];
      const { pType } = this.currentChartLayout;
      switch (pType) {
        case 'line':
        case 'bar':
          return ['xAxis', 'yAxis'].concat(keys);
        default:
          return keys;
      }
    },
  },

  methods: {
    ...mapMutations('chart', ['updateChartConfig', 'updateChartData']),

    handleBaseOptionChange(option) {
      this.baseOption = {
        ...this.baseOption,
        ...option,
      };
    },

    handleDataChange(data) {
      this.dataSource = data;
    },

    handleBaseOptionCommit() {
      this.updateChartConfig(cloneDeep(this.baseOption));
    },

    handleDataCommit() {
      this.updateChartData(this.dataSource);
    },

    handleReset() {
      this.$refs.baseForm.resetForm();
      this.$refs.adForm.resetForm();

      this.handleBaseOptionCommit();
    },
  },
};
</script>
