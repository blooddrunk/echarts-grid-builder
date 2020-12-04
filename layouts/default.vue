<template>
  <div class="tw-h-screen tw-w-full tw-flex tw-flex-col tw-overflow-hidden">
    <TheHeading></TheHeading>

    <Nuxt></Nuxt>
  </div>
</template>

<script>
import TheHeading from '@/components/TheHeading.vue';

export default {
  name: 'DefaultLayout',

  components: {
    TheHeading,
  },
};
</script>
