<template>
  <div>
    <el-table
      ref="table"
      v-loading="listState.loading"
      :data="listState.items"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <slot></slot>
    </el-table>

    <el-pagination
      :class="$style.pager"
      class="tw-py-3"
      v-bind="mergedPaignationProps"
      :page-size="listState.pagination.rowsPerPage"
      :total="listState.total"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
    >
      <slot name="pagination"></slot>
    </el-pagination>
  </div>
</template>

<script>
// should be used with withList mixin
export default {
  name: 'ElementTable',

  props: {
    listState: {
      type: Object,
      required: true,
    },

    paginationProps: {
      type: Object,
      default: () => ({}),
    },

    updatePagination: {
      type: Function,
      required: true,
    },
  },

  data: () => ({
    defaultPaginationProps: {
      // background: true,
      pageSizes: [10, 20, 50, 100],
      layout: 'total, sizes, prev, pager, next, jumper, ->, slot',
    },
  }),

  computed: {
    mergedPaignationProps() {
      const props = {
        ...this.defaultPaginationProps,
        ...this.paginationProps,
      };

      if (this.listState.pagination) {
        props.currentPage = this.listState.pagination.page;
      }

      return props;
    },
  },

  methods: {
    handleSizeChange(rowsPerPage) {
      this.updatePagination({
        page: 1,
        rowsPerPage,
      });
    },

    handlePageChange(page) {
      this.updatePagination({
        page,
      });
    },

    doLayout() {
      this.$refs.table && this.$refs.table.doLayout();
    },
  },
};
</script>

<style lang="scss" module>
.pager {
  :global {
    .el-pager {
      @apply tw-pl-0;
    }
  }
}
</style>
