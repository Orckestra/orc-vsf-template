const webpack = require('webpack');
const theme = require('./themeConfig');

module.exports = {
  server: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0'
  },

  ssr: true,
  target: 'server',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Vue Storefront',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'crossorigin'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Raleway:300,400,400i,500,600,700|Roboto:300,300i,400,400i,500,700&display=swap'
      }
    ]
  },

  loading: { color: '#fff' },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/api-cookie.server',
    '~/plugins/token-expired.client'
  ],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // to core
    '@nuxtjs/composition-api/module',
    '@nuxt/typescript-build',
    '@nuxtjs/style-resources',
    '@nuxtjs/pwa',
    ['@vue-storefront/nuxt', {
      useRawSource: {
        dev: [
          'orc-vsf',
          '@vue-storefront/core'
        ],
        prod: [
          'orc-vsf',
          '@vue-storefront/core'
        ]
      }
    }],
    ['@vue-storefront/nuxt-theme'],
    ['orc-vsf/nuxt', {}]
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    ['nuxt-i18n', {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    }],
    'cookie-universal-nuxt',
    'vue-scrollto/nuxt',
    '@vue-storefront/middleware/nuxt'
  ],

  i18n: {
    strategy: 'prefix',
    currency: 'CAD',
    country: 'CA',
    countries: [
      { name: 'US', label: 'United States', states: ['California', 'Nevada'] },
      { name: 'AT', label: 'Austria' },
      { name: 'DE', label: 'Germany' },
      { name: 'NL', label: 'Netherlands' }
    ],
    currencies: [
      { name: 'CAD', label: 'Canadian dollar' },
      { name: 'EUR', label: 'Euro' },
      { name: 'USD', label: 'Dollar' }
    ],
    locales: [
      { code: 'en-CA', label: 'English', file: 'en.js', iso: 'en' },
      { code: 'fr-CA', label: 'French', file: 'fr.js', iso: 'fr' }
    ],
    defaultLocale: 'en-CA',
    lazy: true,
    seo: true,
    langDir: 'lang/',
    vueI18n: {
      fallbackLocale: 'en-CA',
      numberFormats: {
        'en-CA': {
          currency: {
            style: 'currency', currency: 'CAD', currencyDisplay: 'symbol'
          }
        },
        'fr-CA': {
          currency: {
            style: 'currency', currency: 'CAD', currencyDisplay: 'symbol'
          }
        }
      }
    },
    detectBrowserLanguage: false
  },

  styleResources: {
    scss: [require.resolve('@storefront-ui/shared/styles/_helpers.scss', { paths: [process.cwd()] })]
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-methods', { loose: true }]
      ]
    },
    transpile: [
      'vee-validate/dist/rules'
    ],
    plugins: [
      new webpack.DefinePlugin({
        'process.VERSION': JSON.stringify({
          // eslint-disable-next-line global-require
          version: require('./package.json').version,
          lastCommit: process.env.LAST_COMMIT || ''
        })
      })
    ]
  },

  router: {
    middleware: ['checkout'],
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'query',
        path: '/q/:name/',
        component: resolve(__dirname, 'pages/Query.vue')
      });
      routes.push({
        name: 'productset',
        path: '/s/:name/',
        component: resolve(__dirname, 'pages/ProductSet.vue')
      });
      routes.push({
        name: 'personalDetails',
        path: '/checkout/personalDetails',
        component: resolve(__dirname, 'pages/Checkout/PersonalDetails.vue')
      });
      routes.push({
        name: 'review',
        path: '/checkout/review',
        component: resolve(__dirname, 'pages/Checkout/Review.vue')
      });
    }
  },
  publicRuntimeConfig: {
    theme,
    appKey: 'vsf2occ',
    appVersion: Date.now()
  },
  pwa: {
    meta: {
      theme_color: '#5ECE7B'
    },
    workbox: {
      dev: false,
      enabled: true,
      config: {
        debug: false,
      },
      // remove if you want to disable cache api
      cachingExtensions: '@/plugins/workbox-request.js',
      offline: true,
      offlineStrategy: 'NetworkFirst',
    }
  },

  telemetry: false
};
