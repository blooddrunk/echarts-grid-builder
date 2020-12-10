<template>
  <header :class="$style.heading">
    <div class="tw-flex tw-justify-between tw-items-center tw-h-full tw-p-4">
      <nuxt-link to="/">
        <h1 class="tw-font-semibold tw-text-lg">{{ $config.appName }}</h1>
      </nuxt-link>

      <!-- <TheThemeToggle></TheThemeToggle> -->
    </div>
  </header>
</template>

<script>
// import TheThemeToggle from './TheThemeToggle';

export default {
  name: 'TheHeading',

  components: {
    // TheThemeToggle,
  },
};
</script>

<style lang="scss" module>
.heading {
  @apply tw-bg-gradient-to-r tw-from-blue-400 tw-to-blue-300;
  @apply tw-h-20;
  @apply tw-shadow tw-text-white;
}
</style>
