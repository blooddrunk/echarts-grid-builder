<template>
  <div>
    <div class="tw-py-3 tw-text-center tw-bg-gray-100">
      <el-button type="text" @click="handleDataEdit">
        <FontAwesomeIcon icon="table"></FontAwesomeIcon>
        编辑数据
        <FontAwesomeIcon icon="arrow-right"></FontAwesomeIcon>
      </el-button>
    </div>

    <el-form v-if="hasFormData" size="mini" label-width="110px">
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

          <el-input v-model="formData.title.subtext"></el-input>
        </el-form-item>

        <PositionSelector v-model="formData.title"></PositionSelector>
      </CollapsedEditItem>

      <CollapsedEditItem title="边距">
        <MarginEditCombo v-model="formData.grid" class="tw-mt-4"></MarginEditCombo>
      </CollapsedEditItem>

      <CollapsedEditItem v-model="formData.legend.show" has-toggle title="图例">
        <PositionSelector v-model="formData.legend"></PositionSelector>
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
import withForm from '@/mixins/withForm';
import withChartEdit from './mixins/edit';
import DataEditDialog from './DataEditDialog';
import CollapsedEditItem from './CollapsedEditItem';
import PositionSelector from './PositionSelector';
import MarginEditCombo from './MarginEditCombo';

export default {
  name: 'ChartEditBase',

  components: {
    DataEditDialog,
    CollapsedEditItem,
    PositionSelector,
    MarginEditCombo,
  },

  mixins: [
    // base config
    withForm({}),
    withChartEdit,
  ],

  props: {
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

    tooltipTriggerItemList: [
      { label: '轴', value: 'axis' },
      { label: '点', value: 'item' },
    ],
  }),

  methods: {
    handleDataEdit() {
      this.dataEditDialogVisible = true;
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
