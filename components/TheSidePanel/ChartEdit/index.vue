<template>
  <div>
    <el-tabs v-model="activeTab" type="card" stretch>
      <el-tab-pane label="基本配置" name="base">
        <ChartEditBase
          v-if="currentChartConfig"
          ref="baseForm"
          :current-chart-option="currentChartConfig"
          :on-option-change="handleBaseOptionChange"
          :on-data-change="handleDataChange"
          :on-data-commit="handleDataCommit"
        ></ChartEditBase>
      </el-tab-pane>
      <el-tab-pane label="进阶配置" name="advanced">进阶配置</el-tab-pane>
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

import withForm from '@/mixins/withForm';
import ChartEditBase from './ChartEditBase';

export default {
  name: 'ChartEdit',

  components: {
    ChartEditBase,
  },

  mixins: [
    withForm({
      base: {
        title: {
          text: '',
          subtext: '',
        },
      },
    }),
  ],

  data: () => ({
    activeTab: 'base',
    baseOption: {},
    dataSource: [],
  }),

  computed: {
    ...mapGetters('chart', ['currentChartConfig']),
  },

  methods: {
    ...mapMutations('chart', ['updateChartConfig', 'updateChartData']),

    handleBaseOptionChange(option) {
      this.baseOption = option;
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
      this.$refs.baseForm.clearForm();

      this.handleOptionCommit();
    },
  },
};
</script>
