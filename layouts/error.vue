<template>
  <section :class="$style.root">
    <div class="tw-w-2/3 tw-flex tw-flex-col tw-items-end tw-justify-center tw-px-8 xl:tw-px-16">
      <header
        class="tw-mt-4 xl:tw-mt-8 tw-flex tw-flex-col tw-items-end tw-text-5xl xl:tw-text-6xl tw-font-bold tw-tracking-wide tw-text-gray-100"
      >
        <FontAwesomeIcon class="tw-self-center" icon="exclamation-triangle"></FontAwesomeIcon>
        <h1 class="tw-mt-3">
          {{ message }}
        </h1>
      </header>

      <div class="tw-mt-6 xl:tw-mt-10 tw-text-white">
        <p v-if="statusCode === 404">
          <nuxt-link class="colored-underline gradient-link tw-border-b-2 tw-border-primary" to="/">
            回到首页
          </nuxt-link>
        </p>
        <p v-else-if="statusCode === 500">
          <a
            href="#"
            class="colored-underline gradient-link tw-border-b-2 tw-border-primary"
            @click.prevent="handleRefresh"
          >
            刷新试试
          </a>
        </p>
        <p v-else>
          <nuxt-link
            class="colored-underline gradient-link tw-border-b-2 tw-border-primary"
            to="/sign-in"
          >
            退出登录
          </nuxt-link>
        </p>
      </div>
    </div>

    <div :class="$style.bg"></div>

    <div class="tw-fixed tw-left-0 tw-bottom-0 tw-p-6 tw-text-white">
      {{ $config.appName }}
    </div>
  </section>
</template>

<script>
export default {
  name: 'ErrorLayout',

  layout: 'empty',

  props: {
    error: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    statusCode() {
      return (this.error && this.error.statusCode) || 500;
    },

    message() {
      return this.error && this.error.message;
    },
  },

  methods: {
    handleRefresh() {
      location.reload();
    },
  },

  head() {
    return {
      title: this.message,
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0',
        },
      ],
    };
  },
};
</script>

<style lang="postcss" module>
.root {
  @apply tw-h-screen tw-flex;
  @apply tw-bg-blue-300;
}

.bg {
  background-image: url(~assets/images/error-bg.svg);

  @apply tw-w-3/5;
  @apply tw-border-l-thin tw-border-indigo-300 tw-border-opacity-50;
  @apply tw-bg-no-repeat tw-bg-right tw-bg-contain;
}
</style>
