<template>
  <div>
    <el-form-item label="位置">
      <SimpleRadioGroup v-model="position" :items="positionList"></SimpleRadioGroup>
    </el-form-item>

    <el-form-item label="对齐">
      <SimpleRadioGroup v-model="alignment" :items="alignmentList"></SimpleRadioGroup>
    </el-form-item>
  </div>
</template>

<script>
import isEqual from 'lodash/isEqual';

import SimpleRadioGroup from '@/components/UI/SimpleRadioGroup';

const DEFAULT_CONFIG = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto',
};

export default {
  name: 'PositionSelector',

  components: {
    SimpleRadioGroup,
  },

  props: {
    availPosition: {
      type: Array,
      default: () => ['top', 'bottom'],
    },

    margin: {
      type: Number,
      default: 15,
    },

    value: {
      type: Object,
      required: true,
    },

    fallbackPosition: {
      type: String,
      default: 'top',
    },

    fallbackAlignment: {
      type: String,
      default: 'center',
    },
  },

  data: (vm) => ({
    position: '',

    alignment: '',
  }),

  computed: {
    isHorizontal() {
      return this.isPositionHorizontal(this.position);
    },

    positionList() {
      const fullList = [
        { label: '上', value: 'top', config: { top: this.margin } },
        { label: '右', value: 'right', config: { right: this.margin } },
        { label: '下', value: 'bottom', config: { bottom: this.margin } },
        { label: '左', value: 'left', config: { left: this.margin } },
      ];

      return fullList.filter((item) => this.availPosition.includes(item.value));
    },

    alignmentList() {
      if (this.isHorizontal) {
        return [
          { label: '靠左', value: 'left', config: { left: this.margin } },
          { label: '居中', value: 'center', config: { left: 'center' } },
          { label: '靠右', value: 'right', config: { right: this.margin } },
        ];
      } else {
        return [
          { label: '靠上', value: 'top', config: { top: this.margin } },
          { label: '居中', value: 'middle', config: { top: 'middle' } },
          { label: '靠下', value: 'bottom', config: { right: this.margin } },
        ];
      }
    },

    currentPositionConfig() {
      return this.getConfigByValue(this.positionList, this.position);
    },

    currentAlignmentConfig() {
      return this.getConfigByValue(this.alignmentList, this.alignment);
    },

    computedConfig() {
      return Object.assign(
        {},
        DEFAULT_CONFIG,
        this.currentPositionConfig,
        this.currentAlignmentConfig
      );
    },
  },

  watch: {
    value(val) {
      if (!isEqual(val, this.computedConfig)) {
        this.initPositionAndAlignment();
      }
    },

    position(val, oldVal) {
      this.setAlignmentByPosition();
      this.handleConfigChange();
    },

    alignment() {
      this.handleConfigChange();
    },
  },

  created() {
    this.initPositionAndAlignment();

    this.handleConfigChange();
  },

  methods: {
    isPositionHorizontal(position) {
      return ['top', 'bottom'].includes(position);
    },

    initPositionAndAlignment() {
      const { top, bottom, left } = this.value;
      if (top) {
        this.position = 'top';
        if (top === 'middle') {
          this.alignment = top;
        }
      } else if (bottom) {
        this.position = 'bottom';
      }

      if (left === 'center') {
        this.alignment = 'center';
      }

      // ! all other values are ignored

      if (!this.position) {
        this.position = this.fallbackPosition;
      }

      if (!this.alignment) {
        this.alignment = this.fallbackAlignment;
      }
    },

    setAlignmentByPosition(pos, oldPos) {
      if (this.isPositionHorizontal(pos) && !this.isPositionHorizontal(oldPos)) {
        this.alignment = 'center';
      } else if (!this.isPositionHorizontal(pos) && this.isPositionHorizontal(oldPos)) {
        this.alignment = 'middle';
      }
    },

    getConfigByValue(list, value) {
      const target = list.find((item) => item.value === value);
      return target ? target.config : undefined;
    },

    handleConfigChange() {
      this.$emit('input', this.computedConfig);
    },
  },
};
</script>
