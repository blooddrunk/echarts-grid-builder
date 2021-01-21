<template>
  <div>
    <el-alert type="info" show-icon :closable="false">
      双击或拖拽添加到画布

      <template #title>Tips</template>
    </el-alert>

    <el-collapse v-model="activeNames">
      <el-collapse-item
        v-for="chart in presetChartList"
        :key="chart.category"
        :name="chart.category"
        :title="chart.category"
      >
        <ul>
          <li
            v-for="item in chart.items"
            :key="item.key"
            class="tw-flex tw-flex-col tw-items-center tw-py-3"
          >
            <h3 class="tw-py-1 tw-text-medium tw-text-sm">{{ item.description }}</h3>
            <div
              :class="getThumbnailClass(item.key)"
              :style="getThumbnailStyle(item.key)"
              draggable="true"
              @dblclick="addItem(item.key)"
              @dragstart="handleDragStart(item.key, $event)"
            ></div>
          </li>
        </ul>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ChartGallery',

  inheritAttrs: false,

  props: {
    createGridItem: {
      type: Function,
      required: true,
    },

    onDrag: {
      type: Function,
      required: true,
    },
  },

  data: () => ({
    activeNames: ['折线图', '柱状图'],

    selectedThumbnail: '',
  }),

  computed: {
    ...mapState('chart', ['presetChartList']),
  },

  methods: {
    getThumbnailStyle(fileName) {
      return {
        backgroundImage: `url('${this.$config.routerRoot}images/chart/${fileName}.png')`,
      };
    },

    getThumbnailClass(key) {
      return [this.$style.thumbnail, key === this.selectedThumbnail ? 'tw-shadow-accent' : ''];
    },

    toggleSelection(key) {
      this.selectedThumbnail = this.selectedThumbnail === key ? '' : key;
    },

    addItem(type) {
      this.createGridItem(type);
    },

    handleDragStart(type, event) {
      event.dataTransfer.setData('text/plain', type);
    },
  },
};
</script>

<style lang="scss" module>
.thumbnail {
  @apply tw-w-48 tw-h-24;
  @apply tw-bg-no-repeat tw-bg-contain;
  @apply tw-rounded-lg tw-cursor-pointer;
  @apply tw-border-2 tw-border-medium tw-shadow;
  @apply tw-transition tw-duration-300;

  &:hover {
    @apply tw-transform tw-scale-105;
    @apply tw-shadow-xl;
  }
}
</style>
