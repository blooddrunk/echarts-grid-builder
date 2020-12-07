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
            <TogglableLabel
              :default-value="false"
              :on-switch="(val) => handleFieldSwitch('title.subtext', val)"
            >
              副标题
            </TogglableLabel>
          </template>

          <el-input v-model="formData.title.subtext" :disabled="formState.title.subtext"></el-input>
        </el-form-item>

        <PositionSelector
          :avail-position="['top', 'bottom']"
          @change="handleTitlePosChange"
        ></PositionSelector>
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

import { deepSet } from '@/utils/misc';
import withForm from '@/mixins/withForm';
import DataEditDialog from './DataEditDialog';
import TogglableLabel from './TogglableLabel';
import CollapsedEditItem from './CollapsedEditItem';
import PositionSelector from './PositionSelector';

export default {
  name: 'ChartEditBase',

  components: {
    DataEditDialog,
    TogglableLabel,
    CollapsedEditItem,
    PositionSelector,
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

    handleTitlePosChange(config) {
      this.formData.title = {
        ...this.formData.title,
        ...config,
      };
    },

    handleFieldSwitch(fieldPath, on, defaultValue = '') {
      const path = fieldPath.split('.');

      deepSet(this.formState, path, !on, this.$set);

      if (!on) {
        deepSet(this.formData, path, defaultValue);
      }
    },
  },
};
</script>
