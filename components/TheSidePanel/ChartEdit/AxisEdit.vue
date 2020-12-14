<template>
  <CollapsedEditItem v-model="innerValue.show" :title="title">
    <el-form-item label="名称">
      <el-input v-model="innerValue.name"></el-input>
    </el-form-item>
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
    title: {
      type: String,
      required: true,
      validator: (value) => ['X轴', 'Y轴'].includes(value),
    },

    value: {
      type: Object,
      required: true,
    },
  },

  data: (vm) => ({
    innerValue: vm.value || {},
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
  },
};
</script>
