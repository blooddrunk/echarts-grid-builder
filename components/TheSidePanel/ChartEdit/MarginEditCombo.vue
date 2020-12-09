<template>
  <div>
    <el-form-item label="上边距">
      <el-input v-model="margin.top"></el-input>
    </el-form-item>
    <el-form-item label="右边距">
      <el-input v-model="margin.right"></el-input>
    </el-form-item>
    <el-form-item label="下边距">
      <el-input v-model="margin.bottom"></el-input>
    </el-form-item>
    <el-form-item label="左边距"> <el-input v-model="margin.left"></el-input> </el-form-item>
  </div>
</template>

<script>
import isEqual from 'lodash/isEqual';

import defaultChartConfig from '@/assets/chart/default-config.json';

const DEFAULT_MARGIN = defaultChartConfig.base.grid;

export default {
  name: 'MarginEditCombo',

  props: {
    value: {
      type: Object,
      required: true,
    },
  },

  data: (vm) => ({
    margin: {
      ...DEFAULT_MARGIN,
      ...vm.margin,
    },
  }),

  watch: {
    value(val) {
      if (!isEqual(val, this.margin)) {
        this.setMargin(val);
      }
    },

    margin: {
      deep: true,
      handler(val) {
        this.$emit('input', val);
      },
    },
  },

  methods: {
    setMargin(newValue) {
      this.margin = {
        ...DEFAULT_MARGIN,
        ...newValue,
      };
    },
  },
};
</script>
