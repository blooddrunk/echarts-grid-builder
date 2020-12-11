<template>
  <div>
    <el-form v-if="hasFormData" size="mini" label-width="110px">
      <CollapsedEditItem title="系列">
        <el-form-item class="tw-pb-3 tw-border-b tw-border-b-medium" label="统一编辑系列">
          <el-switch v-model="formData.__series.enable"></el-switch>
        </el-form-item>

        <template v-if="formData.__series.enable">
          <el-form-item label="平滑曲线">
            <el-switch v-model="formData.__series.smooth"></el-switch>
          </el-form-item>
        </template>
      </CollapsedEditItem>
    </el-form>
  </div>
</template>

<script>
import withForm from '@/mixins/withForm';
import withChartEdit from './mixins/edit';
import CollapsedEditItem from './CollapsedEditItem';

export default {
  name: 'ChartEditLine',

  components: {
    CollapsedEditItem,
  },

  mixins: [withForm({}), withChartEdit],
};
</script>
