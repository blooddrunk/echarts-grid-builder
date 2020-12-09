<template>
  <el-dialog
    :visible="configPreviewDialogVisible"
    append-to-body
    @open="handleOpen"
    @close="handleClose"
  >
    <div role="toolbox" class="tw-text-right">
      <el-button
        size="mini"
        type="primary"
        :plain="!showFullConfig"
        @click="showFullConfig = !showFullConfig"
      >
        {{ `显示${showFullConfig ? '用户' : '全部'}配置` }}
      </el-button>
    </div>

    <pre class="language-json" style="max-height: 40vh">
      <code ref="code">{{ configText }}</code>
    </pre>

    <template #footer> <el-button @click="handleClose">取消</el-button></template>
  </el-dialog>
</template>

<script>
import Prism from 'prismjs';
import 'clipboard';
import 'prismjs/components/prism-json';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import { mapState, mapMutations } from 'vuex';

import withDialog from '@/mixins/withDialog';

Prism.manual = true;

export default {
  name: 'TheConfigPreview',

  mixins: [withDialog()],

  data: () => ({
    showFullConfig: false,
  }),

  computed: {
    ...mapState('ui', ['configPreviewDialogVisible', 'configPreviewContent']),

    baseConfig() {
      return this.prettyPrintJSON(this.configPreviewContent.base || '');
    },

    fullConfig() {
      return this.prettyPrintJSON(this.configPreviewContent.full || '');
    },

    configText() {
      return this.showFullConfig ? this.fullConfig : this.baseConfig;
    },
  },

  watch: {
    configPreviewContent(val) {
      if (val && val.base) {
        this.highlightCode();
      }
    },

    async showFullConfig(val) {
      this.$refs.code.innerHTML = this.configText;
      await this.$nextTick();
      this.highlightCode();
    },
  },

  methods: {
    ...mapMutations('ui', ['showConfigPreviewDialog']),

    handleOpen() {
      this.showConfigPreviewDialog(true);
    },

    handleClose() {
      this.showConfigPreviewDialog(false);
      this.showFullConfig = false;
    },

    prettyPrintJSON(json) {
      return JSON.stringify(json, null, 2);
    },

    async highlightCode() {
      await this.$nextTick();

      if (this.$refs.code) {
        Prism.highlightElement(this.$refs.code);
      }
    },
  },
};
</script>
