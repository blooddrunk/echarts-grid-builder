<template>
  <el-select v-bind="$attrs" v-on="$listeners">
    <el-option
      v-for="item in normalizedItems"
      :key="item[keyProp]"
      :value="item.value"
      :label="item.label"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'SimpleSelect',

  inheritAttrs: false,

  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },

    normalizer: {
      type: Function,
      default: undefined,
    },

    keyProp: {
      type: String,
      default: 'value',
    },
  },

  computed: {
    normalizedItems() {
      if (this.normalizer) {
        return this.normalizer(this.items);
      }

      return this.items;
    },
  },
};
</script>
