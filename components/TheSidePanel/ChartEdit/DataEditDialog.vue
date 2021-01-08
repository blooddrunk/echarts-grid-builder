<template>
  <el-dialog :visible.sync="visible" append-to-body>
    <template #title>
      <FontAwesomeIcon icon="table"></FontAwesomeIcon>
      数据编辑
    </template>

    <div v-loading="depLoading" class="tw-p-3">
      <div v-if="XLSX">
        <div class="tw-text-center">
          <el-upload
            drag
            action="/"
            accept=".csv,.xls,.xlsx"
            :multiple="false"
            :limit="1"
            :on-success="handleUpload"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">支持.csv,.xls,.xlsx文件</div>
            </template>
          </el-upload>
        </div>

        <HotTable ref="hotTable" class="tw-mt-6" :settings="hotSettings"> </HotTable>
      </div>
    </div>

    <template #footer>
      <el-button @click="onDialogClose">取消</el-button>

      <el-button type="primary" :disabled="depLoading" :loading="depLoading" @click="handleExport">
        <FontAwesomeIcon icon="download"></FontAwesomeIcon>
        导出
      </el-button>
      <el-button
        type="primary"
        :disabled="depLoading"
        :loading="depLoading"
        @click="handleDataCommit"
      >
        <FontAwesomeIcon icon="pen"></FontAwesomeIcon>
        更新
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { HotTable } from '@handsontable/vue';

import withDialog from '@/mixins/withDialog';

const fileToBinaryString = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target.result);
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsBinaryString(file);
  });

export default {
  name: 'DataEditDialog',

  components: {
    HotTable,
  },

  mixins: [withDialog()],

  props: {
    onDataCommit: {
      type: Function,
      required: true,
    },

    onDataChange: {
      type: Function,
      required: true,
    },
  },

  data: () => ({
    XLSX: null,
    depLoading: false,
    xlsxData: [],
    hotTable: null,
  }),

  computed: {
    ...mapState('persist/chart', ['currentEditingChart']),
    ...mapGetters('persist/chart', ['currentChartData']),

    hotSettings() {
      return {
        data: this.xlsxData,
        licenseKey: 'non-commercial-and-evaluation',
        language: 'zh-CN',
        height: '35vh',
        width: '100%',
        rowHeaders: true,
        colHeaders: true,
        contextMenu: true,
        fixedColumnsLeft: 1,
        fixedRowsTop: 1,
        manualColumnResize: true,
        manualRowResize: true,
        afterChange: this.handleDataChange,
        cells: (row, column) => {
          return {
            type: row > 0 && column > 0 ? 'numeric' : 'text',
          };
        },
      };
    },
  },

  watch: {
    currentEditingChart: {
      immediate: true,
      handler() {
        this.xlsxData = this.currentChartData;
        if (this.$refs.hotTable) {
          this.$refs.hotTable.hotInstance.loadData(this.xlsxData);
        }
      },
    },
  },

  async mounted() {
    await this.loadDependencies();
  },

  methods: {
    async handleUpload(response, file) {
      const rawData = await fileToBinaryString(file.raw);

      const wb = this.XLSX.read(rawData, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const data = this.XLSX.utils.sheet_to_json(ws);

      this.xlsxData = data;
    },

    async loadDependencies() {
      this.depLoading = true;
      try {
        await Promise.all([
          (async () => {
            const XLSX = await import('xlsx');
            this.XLSX = XLSX.default;
          })(),
          import('handsontable/languages/zh-CN'),
        ]);

        this.depLoading = false;
      } catch (error) {
        this.depLoading = false;
        this.$message.error('数据初始化失败');
      }
    },

    handleDataChange() {
      // change local data
      this.xlsxData = this.$refs.hotTable.hotInstance.getSourceData();
      this.onDataChange(this.xlsxData);
    },

    handleDataCommit() {
      this.onDataCommit();
      this.onDialogClose();
    },

    handleExport() {
      try {
        const ws = this.XLSX.utils.aoa_to_sheet(this.xlsxData);
        const wb = this.XLSX.utils.book_new();
        this.XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        this.XLSX.writeFile(wb, 'out.xlsx');
      } catch (error) {
        console.error(error);
        this.$message.error('无法导出数据');
      }
    },
  },
};
</script>
