<template>
  <div>
    <div class="tw-py-3 tw-text-center">
      <el-button type="text" @click="handleDataEdit">
        <FontAwesomeIcon icon="table"></FontAwesomeIcon>
        编辑数据
        <FontAwesomeIcon icon="arrow-right"></FontAwesomeIcon>
      </el-button>
    </div>

    <el-form size="mini" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="formData.title.text"></el-input>
      </el-form-item>

      <el-form-item label="副标题">
        <el-input v-model="formData.title.subtext"></el-input>
      </el-form-item>
    </el-form>

    <DataEditDialog
      v-model="dataEditDialogVisible"
      :on-data-commit="onDataCommit"
      :on-data-change="onDataChange"
    ></DataEditDialog>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';

import withForm from '@/mixins/withForm';
import DataEditDialog from '@/components/TheSidePanel/DataEditDialog';

export default {
  name: 'ChartEditBase',

  components: {
    DataEditDialog,
  },

  mixins: [
    withForm({
      title: {
        text: '',
        subtext: '',
      },
    }),
  ],

  props: {
    currentChartOption: {
      type: Object,
      default: null,
    },

    onOptionChange: {
      type: Function,
      required: true,
    },

    onDataChange: {
      type: Function,
      required: true,
    },

    onDataCommit: {
      type: Function,
      required: true,
    },
  },

  data: () => ({
    dataEditDialogVisible: false,
  }),

  created() {
    this.initFormData();

    this.$watch(
      'formData',
      function () {
        this.onOptionChange(this.formData);
      },
      { deep: true }
    );
  },

  methods: {
    handleDataEdit() {
      this.dataEditDialogVisible = true;
    },

    initFormData() {
      const currentChartOption = cloneDeep(this.currentChartOption);
      Object.keys(this.form.data).forEach((key) => {
        if (key in currentChartOption) {
          this.form.data[key] = currentChartOption[key];
        }
      });
    },
  },
};
</script>
