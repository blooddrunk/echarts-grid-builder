<template>
  <div>
    <div class="tw-py-3 tw-text-center">
      <el-button type="text" @click="handleDataEdit">
        <FontAwesomeIcon icon="table"></FontAwesomeIcon>
        编辑数据
        <FontAwesomeIcon icon="arrow-right"></FontAwesomeIcon>
      </el-button>
    </div>

    <el-form size="mini" label-width="110px">
      <CollapsedEditItem v-model="formData.title.show" has-toggle title="标题">
        <el-form-item label="主标题">
          <el-input v-model="formData.title.text"></el-input>
        </el-form-item>

        <el-form-item>
          <template #label>
            <TogglableLabel :default-value="false">副标题</TogglableLabel>
          </template>

          <el-input v-model="formData.title.subtext"></el-input>
        </el-form-item>
      </CollapsedEditItem>
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
// import getIn from 'lodash/get';

import { mergeData } from '@/mixins/helpers';
import withForm from '@/mixins/withForm';
import DataEditDialog from './DataEditDialog';
import TogglableLabel from './TogglableLabel';
import CollapsedEditItem from './CollapsedEditItem';

export default {
  name: 'ChartEditBase',

  components: {
    DataEditDialog,
    TogglableLabel,
    CollapsedEditItem,
  },

  mixins: [
    withForm({
      title: {
        show: true,
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

    formState: {
      title: {
        subtext: false,
      },
    },
  }),

  beforeCreate() {
    mergeData(this, (data) => ({
      formState: cloneDeep(data.form.data),
    }));
  },

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

    // handleFieldSwitch(fieldPath, on) {
    //   if(on) {

    //   }
    // },
  },
};
</script>
