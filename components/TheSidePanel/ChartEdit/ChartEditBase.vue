<template>
  <div>
    <div class="tw-py-3 tw-text-center tw-bg-gray-100">
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

        <el-form-item label="副标题">
          <!-- <template #label>
            <TogglableLabel
              :default-value="false"
              :on-switch="(val) => handleFieldSwitch('title.subtext', val)"
            >
              副标题
            </TogglableLabel>
          </template> -->

          <el-input v-model="formData.title.subtext" :disabled="formState.title.subtext"></el-input>
        </el-form-item>

        <PositionSelector @change="handleTitlePosChange"></PositionSelector>
      </CollapsedEditItem>

      <CollapsedEditItem title="边距">
        <MarginEditCombo v-model="formData.grid" class="tw-mt-4"></MarginEditCombo>
      </CollapsedEditItem>

      <CollapsedEditItem v-model="formData.legend.show" has-toggle title="图例">
        <PositionSelector
          default-position="bottom"
          @change="handleLegendPosChange"
        ></PositionSelector>
      </CollapsedEditItem>

      <CollapsedEditItem v-model="formData.tooltip.show" has-toggle title="提示">
        <el-form-item label="触发方式">
          <SimpleRadioGroup
            v-model="formData.tooltip.trigger"
            :items="tooltipTriggerItemList"
          ></SimpleRadioGroup>
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
import pick from 'lodash/pick';

import defaultChartConfig from '@/assets/chart/default-config.json';
import withForm from '@/mixins/withForm';
import SimpleRadioGroup from '@/components/UI/SimpleRadioGroup';
import DataEditDialog from './DataEditDialog';
import CollapsedEditItem from './CollapsedEditItem';
import PositionSelector from './PositionSelector';
import MarginEditCombo from './MarginEditCombo';

export default {
  name: 'ChartEditBase',

  components: {
    SimpleRadioGroup,
    DataEditDialog,
    CollapsedEditItem,
    PositionSelector,
    MarginEditCombo,
  },

  mixins: [withForm(pick(defaultChartConfig.base, ['title', 'grid', 'legend', 'tooltip']))],

  props: {
    currentChartOption: {
      type: Object,
      default: null,
    },

    currentChartLayout: {
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

    tooltipTriggerItemList: [
      { label: '轴', value: 'axis' },
      { label: '点', value: 'item' },
    ],
  }),

  watch: {
    currentChartLayout(val) {
      if (val) {
        this.initFormData();
      }
    },
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

    handleTitlePosChange(config) {
      this.formData.title = {
        ...this.formData.title,
        ...config,
      };
    },

    handleLegendPosChange(config) {
      this.formData.legend = {
        ...this.formData.legend,
        ...config,
      };
    },

    // handleFieldSwitch(fieldPath, on, defaultValue = '') {
    //   const path = fieldPath.split('.');

    //   deepSet(this.formState, path, !on, this.$set);

    //   if (!on) {
    //     deepSet(this.formData, path, defaultValue);
    //   }
    // },
  },
};
</script>
