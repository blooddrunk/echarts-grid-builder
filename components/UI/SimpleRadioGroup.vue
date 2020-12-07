<template>
  <el-radio-group v-bind="$attrs" :size="size" v-on="$listeners">
    <el-radio-button v-for="item in items" :key="item.value" :label="item.value">
      {{ item.label }}
    </el-radio-button>
  </el-radio-group>
</template>

<script>
export default {
  name: 'SimpleRadioGroup',
  inheritAttrs: false,
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    size: {
      type: String,
      default: 'mini',
      validator: (value) => ['mini', 'small', 'medium'].includes(value),
    },
  },
};
</script>
