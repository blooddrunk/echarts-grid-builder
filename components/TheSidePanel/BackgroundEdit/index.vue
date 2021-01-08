<template>
  <el-form size="mini" label-width="80px" @submit.native.prevent="handleConfigChange">
    <el-alert type="info" show-icon :closable="false">
      图表大小和比例在全屏下可能不一样

      <template #title>提示</template>
    </el-alert>

    <el-collapse v-model="activeSectionNames">
      <el-collapse-item title="基本配置" name="basic">
        <el-form-item label="高度">
          <el-input-number
            v-model="formData.panelHeight"
            controls-position="right"
            :min="600"
            :max="9999"
            :disabled="formData.useScreenHeight"
          ></el-input-number>
          <el-checkbox v-model="formData.useScreenHeight" size="mini">使用屏幕高度</el-checkbox>
        </el-form-item>

        <el-form-item label="列数">
          <el-input-number
            v-model="formData.grid.colNum"
            controls-position="right"
            :min="2"
            :max="8"
            :precision="0"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="行高">
          <el-input-number
            v-model="formData.grid.rowHeight"
            controls-position="right"
            :min="50"
            :max="600"
            :disabled="formData.useAutoLineHeight"
            @
          ></el-input-number>

          <el-checkbox v-model="formData.useAutoLineHeight" size="mini"> 自动设置 </el-checkbox>
        </el-form-item>

        <transition
          enter-active-class="animate__animated animate__slideInDown animate__faster"
          leave-active-class="animate__animated animate__slideOutUp animate__faster"
        >
          <el-form-item v-if="rowNumEditVisible" label="行数">
            <el-input-number
              v-model="formData.rowNum"
              controls-position="right"
              :min="2"
              :max="8"
              :precision="0"
              @change="handleRowNumChange"
            ></el-input-number>
          </el-form-item>
        </transition>

        <el-form-item label="水平间距">
          <el-input-number
            v-model="formData.grid.margin[0]"
            controls-position="right"
            :min="1"
            :max="100"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="垂直间距">
          <el-input-number
            v-model="formData.grid.margin[1]"
            controls-position="right"
            :min="1"
            :max="100"
          ></el-input-number>
        </el-form-item>
      </el-collapse-item>

      <el-collapse-item title="背景" name="background">
        <BackgroundList></BackgroundList>
      </el-collapse-item>
    </el-collapse>

    <div class="tw-w-full tw-absolute tw-bottom-0 tw-right-0 tw-flex">
      <el-button class="tw-w-full tw-rounded-none" type="primary" native-type="submit">
        确定
      </el-button>
      <el-button
        class="tw-ml-0 tw-w-full tw-rounded-none"
        type="primary"
        plain
        @click="handleReset"
      >
        重置
      </el-button>
    </div>
  </el-form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';

import withForm from '@/mixins/withForm';
import { defaultCanvasConfig } from '@/store/persist/chart';
import { isNumeric } from '@/utils/math';
import BackgroundList from './BackgroundList';

export default {
  name: 'BackgroundEdit',

  components: {
    BackgroundList,
  },

  mixins: [withForm(defaultCanvasConfig)],

  data: () => ({
    activeSectionNames: ['basic', 'background'],
    rowNumEditVisible: false,
  }),

  computed: {
    ...mapGetters('persist/chart', ['gridHeight', 'gridConfig']),

    verticalGap() {
      const { margin } = this.gridConfig || {};
      if (margin && margin.length) {
        return margin[1] ?? 0;
      }

      return 0;
    },
  },

  watch: {
    'formData.useScreenHeight': {
      immediate: true,
      handler(val) {
        if (val) {
          this.formData.panelHeight = screen.height;
        }
      },
    },

    'formData.useAutoLineHeight': {
      immediate: true,
      handler(val) {
        if (val) {
          this.handleRowNumChange(this.formData.rowNum);
        }
        this.rowNumEditVisible = val;
      },
    },
  },

  created() {
    // commit auto-calculated line height to vuex
    this.handleConfigChange();
  },

  methods: {
    ...mapMutations('persist/ui', ['resetBackground']),
    ...mapMutations('persist/chart', ['setCanvasConfig']),

    caculateRowHeightFromRowNum(rowNum) {
      const verticalSpace = (rowNum + 1) * this.verticalGap;
      return Math.floor((this.gridHeight - verticalSpace) / rowNum);
    },

    handleRowNumChange(val) {
      const rowHeight = this.caculateRowHeightFromRowNum(val);
      if (isNumeric(rowHeight)) {
        this.formData.grid.rowHeight = rowHeight;
        return true;
      } else {
        this.$message.error('行高计算失败，请检查');
        return false;
      }
    },

    handleConfigChange() {
      this.setCanvasConfig(cloneDeep(this.formData));
    },

    handleReset() {
      this.clearForm();
      this.setCanvasConfig(this.form.initialData);
      this.resetBackground();
    },
  },
};
</script>
