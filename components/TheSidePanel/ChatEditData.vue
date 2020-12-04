<template>
  <div v-loading="xlsxLoading">
    <div v-if="XLSX" :class="$style.data">
      <el-upload
        class="tw-w-full"
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

      <HotTable
        ref="hotTable"
        class="tw-mt-6"
        :data="xlsxData"
        license-key="non-commercial-and-evaluation"
        :row-headers="true"
        :col-headers="true"
        height="400px"
        :after-change="handleDataChange"
      >
      </HotTable>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { HotTable } from '@handsontable/vue';

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
  name: 'ChartEditData',

  components: {
    HotTable,
  },

  data: () => ({
    XLSX: null,
    xlsxLoading: false,
    xlsxData: [],
    hotTable: null,
  }),

  computed: {
    ...mapState('chart', ['currentEditingChart']),
    ...mapGetters('chart', ['currentChartData']),
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
    this.XLSX = await this.loadXLSX();
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

    async loadXLSX() {
      this.xlsxLoading = true;
      try {
        const XLSX = await import('xlsx');
        this.xlsxLoading = false;
        return XLSX.default;
      } catch (error) {
        this.xlsxLoading = false;
        console.log(this.$message.error('数据初始化失败'));
      }
    },

    handleDataChange() {
      // change local data
      this.xlsxData = this.$refs.hotTable.hotInstance.getSourceData();
      this.$emit('data-change', this.xlsxData);
    },
  },
};
</script>

<style lang="scss" module>
.data {
  :global {
    .el-upload--text,
    .el-upload-dragger {
      @apply tw-w-full;
    }
  }
}
</style>
