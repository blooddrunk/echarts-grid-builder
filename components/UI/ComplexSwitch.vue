<template>
  <el-switch
    v-bind="$attrs"
    :value="slimmedValue"
    :active-value="activeValue"
    :inactive-value="inactiveValue"
    @input="handleInput"
  ></el-switch>
</template>

<script>
import isEqual from 'lodash/isEqual';

const isObject = (value) => typeof value === 'object';

export default {
  name: 'ComplexSwitch',

  props: {
    valuePair: {
      type: Array,
      default: () => [true, false],
    },

    value: {
      type: [String, Number, Boolean, Object, Array],
      default: false,
    },
  },

  computed: {
    trueValue() {
      return (this.valuePair && this.valuePair[0]) || true;
    },

    falseValue() {
      return this.valuePair && this.valuePair[1];
    },

    activeValue() {
      return isObject(this.trueValue) ? true : this.trueValue;
    },

    inactiveValue() {
      return isObject(this.falseValue) ? false : this.falseValue;
    },

    slimmedValue() {
      if (isObject(this.value)) {
        return isEqual(this.value, this.trueValue);
      } else {
        return this.value;
      }
    },
  },

  methods: {
    handleInput(rawValue) {
      const value =
        rawValue === true ? this.trueValue : rawValue === false ? this.falseValue : rawValue;
      this.$emit('input', value);
    },
  },
};
</script>
