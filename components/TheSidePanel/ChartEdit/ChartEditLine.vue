<template>
  <div>
    <el-form v-if="hasFormData" size="mini" label-width="110px">
      <AxisEdit v-model="formData.xAxis" title="X轴"></AxisEdit>

      <AxisEdit v-model="formData.yAxis" title="Y轴"></AxisEdit>

      <CollapsedEditItem title="系列">
        <el-form-item class="tw-pb-3 tw-border-b tw-border-b-medium">
          <template #label>
            <span class="tw-font-semibold">统一编辑系列</span>
          </template>

          <el-switch v-model="formData.__series.enable"></el-switch>
        </el-form-item>

        <template v-if="formData.__series.enable">
          <el-form-item label="平滑曲线">
            <el-switch v-model="formData.__series.smooth"></el-switch>
          </el-form-item>
          <el-form-item label="标记尺寸">
            <el-input-number
              v-model="formData.__series.symbolSize"
              controls-position="right"
              :min="1"
              :max="20"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="区域填充">
            <ComplexSwitch
              v-model="formData.__series.areaStyle"
              :value-pair="[defaultAreaStyle, null]"
            ></ComplexSwitch>
          </el-form-item>
        </template>
        <div v-else>
          <fieldset v-for="(item, index) in formData.series" :key="index">
            <legend>{{ `系列${index}` }}</legend>

            <el-form-item label="平滑曲线">
              <el-switch v-model="item.smooth"></el-switch>
            </el-form-item>

            <el-form-item label="标记尺寸">
              <el-input-number
                v-model="item.symbolSize"
                controls-position="right"
                :min="1"
                :max="20"
              ></el-input-number>
            </el-form-item>
          </fieldset>
        </div>
      </CollapsedEditItem>
    </el-form>
  </div>
</template>

<script>
import withForm from '@/mixins/withForm';
import withChartEdit from './mixins/edit';
import CollapsedEditItem from './CollapsedEditItem';
import AxisEdit from './AxisEdit';

export default {
  name: 'ChartEditLine',

  components: {
    CollapsedEditItem,
    AxisEdit,
  },

  mixins: [withForm({}), withChartEdit],

  inject: ['defaultChartConfig'],

  computed: {
    defaultAreaStyle() {
      return this.defaultChartConfig['line-area'].__series.areaStyle;
    },
  },

  watch: {
    'formData.__series': {
      deep: true,
      handler(val) {
        this.applyToAllSeries(val);
      },
    },
  },

  methods: {
    applyToAllSeries(config) {
      // ! shallow merge may not be sufficient
      this.formData.series = this.formData.series.map((item) => ({
        ...item,
        ...config,
      }));
    },
  },
};
</script>
