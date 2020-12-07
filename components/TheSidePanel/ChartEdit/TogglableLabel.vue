<template>
  <div class="tw-flex tw-items-center tw-justify-between">
    <span>
      <slot></slot>
    </span>
    <el-switch v-model="value"> </el-switch>
  </div>
</template>

<script>
export default {
  name: 'TogglableLabel',

  props: {
    defaultValue: {
      type: Boolean,
      default: true,
    },

    onSwitch: {
      type: Function,
      default: null,
    },
  },

  data: (vm) => ({
    value: vm.defaultValue,
  }),

  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (this.onSwitch) {
          this.onSwitch(val);
        }
      },
    },
  },
};
</script>
