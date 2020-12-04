<template>
  <ul class="tw-space-y-6">
    <li
      v-for="item in backgroundListWithState"
      :key="item.fileName"
      class="tw-flex tw-justify-center"
    >
      <div
        :class="[$style.thumbnail, item.active ? 'tw-shadow-accent' : '']"
        :style="getThumbnailStyle(item.fileName)"
        @click="toggleBackground(item)"
      ></div>
    </li>
  </ul>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'BackgroundList',

  computed: {
    ...mapState('ui', ['currentBackground', 'backgroundList']),

    backgroundListWithState() {
      return this.backgroundList.map((fileName) => ({
        fileName,
        active: fileName === this.currentBackground,
      }));
    },
  },

  methods: {
    ...mapMutations('ui', ['setCurrentBackground']),

    getThumbnailStyle(fileName) {
      return {
        backgroundImage: `url('${this.$config.routerRoot}images/bg/${fileName}.png')`,
      };
    },

    toggleBackground({ fileName, active }) {
      this.setCurrentBackground(active ? '' : fileName);
    },
  },
};
</script>

<style lang="scss" module>
.thumbnail {
  @apply tw-w-32 tw-h-32;
  @apply tw-bg-no-repeat tw-bg-cover;
  @apply tw-rounded-lg tw-cursor-pointer;
  @apply tw-border-2 tw-border-medium tw-shadow;
  @apply tw-transition tw-duration-300;

  &:hover {
    @apply tw-transform tw-scale-105;
    @apply tw-shadow-xl;
  }
}
</style>
