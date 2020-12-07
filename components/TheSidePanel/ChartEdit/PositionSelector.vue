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
      default: () => ['top', 'right', 'bottom', 'left'],
    },

    defaultPosition: {
      type: String,
      default: 'top',
      validator: (val) => ['top', 'right', 'bottom', 'left'].includes(val),
    },

    margin: {
      type: Number,
      default: 15,
    },

    defaultAlignment: {
      type: Array,
      default: () => ['center', 'middle'],
    },
  },

  data: (vm) => ({
    position: vm.defaultPosition,

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
  },

  watch: {
    position(val) {
      this.alignment = this.getDefaultAlignmentByPosition(val);
    },

    alignment() {
      this.handleConfigChange();
    },
  },

  created() {
    this.alignment = this.getDefaultAlignmentByPosition(this.position);

    this.handleConfigChange();
  },

  methods: {
    isPositionHorizontal(position) {
      return ['top', 'bottom'].includes(position);
    },

    getDefaultAlignmentByPosition(position) {
      const [x, y] = this.defaultAlignment;

      if (this.isPositionHorizontal(position)) {
        return x || 'center';
      }
      return y || 'middle';
    },

    getConfigByValue(list, value) {
      const target = list.find((item) => item.value === value);
      return target ? target.config : undefined;
    },

    handleConfigChange() {
      const positionConfig = this.getConfigByValue(this.positionList, this.position);
      const alignmentConfig = this.getConfigByValue(this.alignmentList, this.alignment);

      this.$emit(
        'change',
        Object.assign({}, DEFAULT_CONFIG, {
          ...positionConfig,
          ...alignmentConfig,
        })
      );

      console.log({
        ...positionConfig,
        ...alignmentConfig,
      });
    },
  },
};
</script>
