<template>
  <div>
    <el-form size="mini" label-width="110px">
      <el-form-item label="平滑曲线">
        <el-switch v-model="formData.seriesCommon.smooth"></el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import withForm from '@/mixins/withForm';

export default {
  name: 'ChartEditLine',

  mixins: [
    withForm({
      seriesCommon: {
        smooth: false,
      },
    }),
  ],
};
</script>
