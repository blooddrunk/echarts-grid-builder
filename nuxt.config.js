import { join } from 'path';
import dartSass from 'sass';

const APP_NAME = 'Echarts Grid Builder';

export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: APP_NAME,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: `${process.env.ROUTER_ROOT}/favicon.ico`.replace(/\/\//g, '/'),
      },
    ],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/assets/css/tailwind.css',
    '@/assets/scss/main.scss',
    'animate.css',
    '@/assets/scss/element-ui.scss',
    'handsontable/dist/handsontable.full.css',
    'prismjs/themes/prism.css',
    'prismjs/plugins/toolbar/prism-toolbar.css',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/nuxt-client-init',
    '@/plugins/filters',
    '@/plugins/directives',
    '@/plugins/axios',
    '@/plugins/router-after-each',
    '@/plugins/font-awesome',
    '@/plugins/echarts',
    '@/plugins/element-ui',
    '@/plugins/vee-validate',
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  router: {
    base: process.env.ROUTER_ROOT,

    middleware: [],
  },

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  eslint: {
    files: ['.', '!node_modules'],
  },

  tailwindcss: {
    exposeConfig: true,
  },

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: true,
  },

  proxy: [
    [
      '^/hn/',
      {
        target: 'http://hn.algolia.com/api/v1',
        pathRewrite: {
          '^/hn': '',
        },
      },
    ],

    [
      '^/json/',
      {
        // target: 'https://jsonplaceholder.typicode.com/',
        target: 'https://my-json-server.typicode.com/blooddrunk/my-json-server/',
        pathRewrite: {
          '^/json': '',
        },
      },
    ],
  ],

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  pwa: {
    icon: false, // disables the icon module
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend(config, ctx) {
      // alias
      config.resolve.alias.styles = join(config.resolve.alias.assets, 'scss');
    },

    sass: {
      implementation: dartSass,
    },

    scss: {
      implementation: dartSass,
    },

    transpile: ['vue-echarts', 'resize-detector', 'vee-validate/dist/rules'],
  },

  env: {},

  publicRuntimeConfig: {
    appName: APP_NAME,
    routerRoot: process.env.ROUTER_ROOT,
    apiRoot: process.env.API_ROOT,
    apiPrefix: process.env.API_PREFIX,
  },

  privateRuntimeConfig: {},

  loading: { color: '#4fd1c5' },

  loadingIndicator: {
    name: 'pulse',
    color: '#38BDF8',
    background: '#f7fafc',
  },

  messages: {
    error_404: '404 NOT FOUND',
    back_to_home: '返回首页',
    nuxtjs: APP_NAME,
  },
};
