<template>
  <main :class="$style.main">
    <div class="tw-flex-grow tw-flex tw-flex-col xl:tw-p-8 tw-p-6 tw-bg-main">
      <Toolbox></Toolbox>
      <CanvasArea
        ref="canvas"
        :layout="localLayout"
        :remove-item="removeGridItem"
        :on-drop="handleDrop"
        :on-drag-enter="handleDragEnter"
        :on-drag-leave="handleDragLeave"
        :on-drag-over="handleDragOver"
        @layout-updated="handleLayoutChange"
      ></CanvasArea>
    </div>

    <transition
      enter-active-class="animate__animated animate__fadeInRight animate__faster"
      leave-active-class="animate__animated animate__fadeOutRight animate__faster"
    >
      <TheSidePanel :create-grid-item="createGridItem" :on-drag="handleDrag"></TheSidePanel>
    </transition>
  </main>
</template>

<script>
import { nanoid } from 'nanoid';
import { mapState, mapGetters, mapMutations } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';

import Toolbox from '@/components/Main/Toolbox';
import CanvasArea from '@/components/Main/CanvasArea';
import TheSidePanel from '@/components/TheSidePanel';

const DROP_PLACEHOLDER = 'drop';

export default {
  name: 'Home',

  components: {
    Toolbox,
    CanvasArea,
    TheSidePanel,
  },

  data: () => ({
    localLayout: [],

    mousePos: {
      x: null,
      y: null,
    },

    dragItem: {},
  }),

  computed: {
    ...mapState('chart', ['canvasLayout']),
    ...mapGetters('chart', ['currentChartCount', 'gridConfig']),

    colNum() {
      return this.gridConfig.colNum || 4;
    },
  },

  created() {
    // initialize layout from vuex
    this.localLayout = cloneDeep(this.canvasLayout);
  },

  methods: {
    ...mapMutations('chart', ['addCanvasItem', 'removeCanvasItemById', 'setCanvasLayout']),

    createDefaultItem(id, props) {
      return {
        x: this.currentChartCount % (this.colNum || 12),
        y: this.currentChartCount + (this.colNum || 12),
        w: 1,
        h: 1,
        i: id || nanoid(),
        ...props,
      };
    },

    createGridItem(type) {
      if (!type) {
        throw new Error(`Chart type is required`);
      }

      const pType = type.slice(0, type.indexOf('-'));

      const newItem = this.createDefaultItem(nanoid(), {
        type,
        pType,
      });

      this.addCanvasItem(cloneDeep(newItem));
      this.localLayout.push(newItem);
    },

    async removeGridItem(id) {
      try {
        await this.$confirm('您确认要删除吗？一旦删除，不可恢复。', '提示', {
          type: 'warning',
        });
        this.localLayout = this.localLayout.filter((layout) => layout.i !== id);
        this.removeCanvasItemById(id);
      } catch {
        // cancelled
      }
    },

    handleLayoutChange(newLayout) {
      this.localLayout = newLayout;
      // commit layout change back to vuex
      this.setCanvasLayout(cloneDeep(newLayout));
    },

    getDrapItemIndex() {
      return this.canvasLayout.findIndex((item) => item.i === DROP_PLACEHOLDER);
    },

    handleDragEnter() {
      const drapItemIndex = this.getDrapItemIndex();
      if (drapItemIndex === -1) {
        this.dragItem = this.createDefaultItem(DROP_PLACEHOLDER, { visible: false });
        this.addCanvasItem(this.dragItem);
      }
    },

    handleDragLeave() {
      const drapItemIndex = this.getDrapItemIndex();
      if (drapItemIndex > -1) {
        this.removeGridItem(DROP_PLACEHOLDER);
      }
    },

    handleDrag(event) {
      if (!this.$refs.canvas) {
        return;
      }

      const canvas = this.$refs.canvas;
      const canvasRect = canvas.$el.getBoundingClientRect();
      const grid = canvas.$refs.grid;

      // recalculating... this might not be necessary
      const dragItemIndex = this.getDrapItemIndex();

      if (dragItemIndex > -1) {
        // get grid item
        const gridItem = grid.$children[dragItemIndex];
        console.log(gridItem);
        gridItem.dragging = {
          top: this.mousePos.y - canvasRect.top,
          left: this.mousePos.x - canvasRect.left,
        };
        const newPos = gridItem.calcXY(
          this.mousePos.y - canvasRect.top,
          this.mousePos.x - canvasRect.left
        );

        grid.dragEvent('dragstart', 'drop', newPos.x, newPos.y, gridItem.h, gridItem.w);
      }
    },

    handleDrop(event) {
      const type = event.dataTransfer.getData('text/plain');

      if (type) {
        this.createGridItem(type);
      }

      event.preventDefault();
    },

    handleDragOver(event) {
      event.dataTransfer.dropEffect = 'copy';
      // this.mousePos.x = event.clientX;
      // this.mousePos.y = event.clientY;

      // this.handleDrag(event);

      event.preventDefault();
    },
  },
};
</script>

<style lang="scss" module>
.main {
  @apply tw-flex-grow tw-flex tw-h-full;
  max-height: calc(100vh - theme('spacing.20'));
}
</style>
