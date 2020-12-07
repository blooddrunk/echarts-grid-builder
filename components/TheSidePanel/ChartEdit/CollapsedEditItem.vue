<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item :name="title" :disabled="!enabled">
      <template #title>
        <header class="tw-flex tw-items-center tw-text-sm">
          <span>{{ title }}</span>
          <el-switch
            v-if="hasToggle"
            v-model="enabled"
            class="tw-ml-2"
            @click.native.stop
          ></el-switch>
        </header>
      </template>

      <slot></slot>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  name: 'CollapsedEditItem',

  props: {
    title: {
      type: String,
      default: '',
    },

    defaultCollapsed: {
      type: Boolean,
      default: true,
    },

    hasToggle: {
      type: Boolean,
      default: false,
    },

    value: {
      type: Boolean,
      default: true,
    },
  },

  data: (vm) => ({
    activeNames: vm.defaultCollapsed ? [] : [vm.title],

    enabled: !!vm.value,
  }),

  watch: {
    value(val) {
      this.enabled = val;
    },

    enabled(val) {
      this.$emit('input', val);

      if (val && this.activeNames.length < 1) {
        this.activeNames = [this.title];
      } else if (!val) {
        this.activeNames = [];
      }
    },
  },
};
</script>
