<template>
  <CollapsedEditItem v-model="innerValue.show" has-toggle :title="title">
    <el-form-item label="名称">
      <el-input v-model="innerValue.name"></el-input>
    </el-form-item>

    <el-form-item label="轴线">
      <el-switch v-model="innerValue.axisLine.show"></el-switch>
    </el-form-item>

    <el-form-item label="刻度">
      <el-switch v-model="innerValue.axisTick.show"></el-switch>
    </el-form-item>

    <el-form-item label="分隔线">
      <el-switch v-model="innerValue.splitLine.show"></el-switch>
    </el-form-item>

    <template v-if="type === 'value'">
      <el-form-item label="最小值">
        <el-input v-model.number="innerValue.min" :disabled="useDataMin"></el-input>
        <el-checkbox v-model="useDataMin" size="mini">使用最小的数据值</el-checkbox>
      </el-form-item>

      <el-form-item label="最大值">
        <el-input v-model.number="innerValue.max" :disabled="useDataMax"></el-input>
        <el-checkbox v-model="useDataMax" size="mini">使用最大的数据值</el-checkbox>
      </el-form-item>
    </template>

    <CollapsedEditItem
      v-if="type === 'category'"
      v-model="innerValue.axisLabel.show"
      class="tw--mb-6 tw--mr-4"
      has-toggle
      title="标签"
    >
      <el-form-item label="旋转">
        <el-input-number
          v-model="innerValue.axisLabel.rotate"
          controls-position="right"
          :min="-90"
          :max="90"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="间隔">
        <SimpleSelect
          v-model.number="innerValue.axisLabel.interval"
          class="tw-w-full"
          :items="labelIntervalList"
          filterable
          allow-create
          default-first-option
          clearable
          placeholder="可以手动添加并选择数字选项"
        ></SimpleSelect>
      </el-form-item>
    </CollapsedEditItem>
  </CollapsedEditItem>
</template>

<script>
import isEqual from 'lodash/isEqual';

import CollapsedEditItem from './CollapsedEditItem';

export default {
  name: 'AxisEdit',

  components: {
    CollapsedEditItem,
  },

  props: {
    chartId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      validator: (value) => ['X轴', 'Y轴'].includes(value),
    },

    type: {
      type: String,
      default: 'value',
      validator: (value) => ['category', 'value'].includes(value),
    },

    value: {
      type: Object,
      required: true,
    },
  },

  data: (vm) => ({
    innerValue: vm.value || {},

    useDataMin: false,
    useDataMax: false,

    labelIntervalList: [
      { label: '自动调整', value: 'auto' },
      { label: '全部显示', value: 0 },
    ],
  }),

  watch: {
    innerValue: {
      deep: true,
      handler(val) {
        this.$emit('input', val);
      },
    },

    value(val) {
      if (!isEqual(val, this.innerValue)) {
        this.innerValue = this.value;
      }
    },

    useDataMin(val) {
      if (val) {
        this.$set(this.innerValue, 'min', 'dataMin');
      } else if (this.innerValue.min === 'dataMin') {
        this.$set(this.innerValue, 'min', undefined);
      }
    },

    useDataMax(val) {
      if (val) {
        this.$set(this.innerValue, 'max', 'dataMax');
      } else if (this.innerValue.max === 'dataMax') {
        this.$set(this.innerValue, 'max', undefined);
      }
    },

    chartId() {
      this.initMinMax();
    },
  },

  created() {
    this.initMinMax();
  },

  methods: {
    initMinMax() {
      this.useDataMin = this.value.min === 'dataMin';
      this.useDataMax = this.value.max === 'dataMax';
    },
  },
};
</script>
