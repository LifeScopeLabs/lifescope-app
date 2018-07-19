var path = require('path');

const bodyParser = require('body-parser');
const config = require('config');
const cookieParser = require('cookie-parser');
const webpack = require('webpack');

const cookieAuthorization = require('./lib/middleware/cookie-authorization');
const initialSearches = require('./lib/middleware/initial-searches');

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'LIFESCOPE',
    description: 'LIFESCOPE',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width' },
      { hid: 'description', name: 'description', content: '{{escape description }}' },
      { name: 'apple-mobile-web-app-capable', content: 'no' },
      { name: 'apple-mobile-web-app-title', content: 'LifeScope' },
      { name: 'application-name', content: 'LifeScope' },
      { name: 'msapplication-TileColor', content: '#2ac1de' },
      { name: 'msapplication-TileImage', content: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/mstile-144x144.png' },
      { name: 'msapplication-square70x70logo', content: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/mstile-70x70.png' },
      { name: 'msapplication-square150x150logo', content: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/mstile-150x150.png' },
      { name: 'msapplication-wide310x150logo', content: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/mstile-310x150.png' },
      { name: 'msapplication-square310x310logo', content: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/mstile-310x310.png' },
      { name: 'theme-color', content: '#ffffff' },
      { name: 'google-site-verification', content: 'b8zInA5OFENnwrupGy0EPeJDeWvtY4e_R4SZDXZF6xI' },
      { name: 'keywords', content: 'small data, search, data discovery, social media, LifeScope, life scope' },
      { property: 'og:title', content: 'LifeScope' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://app.lifescope.io' },
      { property: 'og:site_name', content: 'LifeScope' },
      { property: 'og:description', content: 'Search & Discover the Internet of You!' },
      { property: 'og:image:secure_url', content: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/apple-touch-icon-180x180.png' }
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '57x57', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/apple-touch-icon-57x57.png' },
      { rel: 'apple-touch-icon', sizes: '60x60', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/apple-touch-icon-60x60.png' },
      { rel: 'apple-touch-icon', sizes: '72x72', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/apple-touch-icon-72x72.png' },
      { rel: 'apple-touch-icon', sizes: '76x76', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/apple-touch-icon-76x76.png' },
      { rel: 'apple-touch-icon', sizes: '114x114', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/apple-touch-icon-114x114.png' },
      { rel: 'apple-touch-icon', sizes: '120x120', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/apple-touch-icon-120x120.png' },
      { rel: 'apple-touch-icon', sizes: '144x144', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/apple-touch-icon-144x144.png' },
      { rel: 'apple-touch-icon', sizes: '152x152', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/apple-touch-icon-152x152.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/apple-touch-icon-180x180.png' },
      { rel: 'icon', sizes: '16x16', type: 'image/png', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/favicon-16x16.png' },
      { rel: 'icon', sizes: '32x32', type: 'image/png', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/favicon-32x32.png' },
      { rel: 'icon', sizes: '36x36', type: 'image/png', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/android-chrome-36x36.png' },
      { rel: 'icon', sizes: '48x48', type: 'image/png', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/android-chrome-48x48.png' },
      { rel: 'icon', sizes: '72x72', type: 'image/png', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/android-chrome-72x72.png' },
      { rel: 'icon', sizes: '96x96', type: 'image/png', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/android-chrome-96x96.png' },
      { rel: 'icon', sizes: '144x144', type: 'image/png', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/android-chrome-144x144.png' },
      { rel: 'icon', sizes: '192x192', type: 'image/png', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/android-chrome-192x192.png' },
      { rel: 'icon', sizes: '256x256', type: 'image/png', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/android-chrome-256x256.png' },
      { rel: 'icon', sizes: '384x384', type: 'image/png', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/android-chrome-384x384.png' },
      { rel: 'icon', sizes: '512x512', type: 'image/png', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/android-chrome-512x512.png' },
      { rel: 'mask-icon', color: '#5bbad5', href: 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/safari-pinned-tab.svg' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Lato:300,400,700|PT+Sans:400,400italic,700,700italic|Quicksand:400,300|Raleway:400|Roboto:300,400,700|Source+Sans+Pro:300,400,700' },
      { rel: 'stylesheet', href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' },
    ]
  },

  /*
  ** Customize the progress bar color
  */
  loading: { color: '#2ac1de' },

	modules: [
	  '@nuxtjs/apollo',
    '@nuxtjs/google-analytics',
    ['nuxt-sass-resources-loader', [
      './assets/scss/lifescope-styles/themes/default.scss',
      './assets/scss/lifescope-styles/media/media.scss',
      './assets/scss/lifescope-styles/mixins/flexbox.scss',
      './assets/scss/lifescope-styles/mixins/generic.scss'
    ]]
  ],

	apollo: {
		clientConfigs: {
			default: '../apollo/client-configs/default.js'
		}
	},

  'google-analytics': {
    id: config.googleAnalytics.trackingID,
    debug: {
      sendHitTask: config.googleAnalytics.enabled
    }
  },

	css: [
		'./assets/scss/site.scss'
  ],

  /*
  ** Build configuration
  */
	build: {
		extend (config, ctx) {
			config.node = {
				dns: 'empty',
				fs: 'empty',
				module: 'empty',
				net: 'empty',
				tls: 'empty'
      };

<<<<<<< HEAD
      // easyrtc support
      // if (isClient) {
      //   config.module.rules.push({
      //     test: require.resolve('./static/easyrtc/easyrtc.js'),
      //     use: { loader: 'expose-loader',
      //     options: 'easyrtc' }
      //   });
      // }

      // config.module.rules.push({
      //       exclude: /(node_modules)/
      // });

=======
>>>>>>> 031590e0ddeb8d24b7eb341af2c3d96fb959ed18
      // /*
      // ** Run ESLint on save
      // */
      // if (isDev && isClient) {
      //   config.module.rules.push({
      //     enforce: 'pre',
      //     test: /\.(js|vue)$/,
      //     loader: 'eslint-loader',
      //     exclude: /(node_modules)/
      //   })
      // }
		},

    babel: {
		  presets: ['env', 'stage-2'],
      plugins: [
        'transform-runtime'
      ],
      babelrc: true
    },

		vendor: [
		  'jquery',
			'mixitup',
			'vue-js-modal',
			'vue2-filters',
      'vue-bootstrap-datetimepicker',
      'vue-observe-visibility',
      'aframe',
      'aframe-layout-component',
      'networked-aframe'
		],

    plugins: [
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        $: 'jquery',
        moment: 'moment',
        // 'socket.io': 'socket.io-client',
        easyrtc: './static/easyrtc/easyrtc.js',
        // 'window.easyrtc': './node_modules/easyrtc/api/easyrtc.js'
        }),
<<<<<<< HEAD
        
=======

>>>>>>> 031590e0ddeb8d24b7eb341af2c3d96fb959ed18
    ]
	},

	plugins: [
		'./plugins/vue-js-modal',
		'./plugins/vue2-filters',
    './plugins/vue-observe-visibility',
    {
      src: './plugins/vue-bootstrap-datetimepicker',
      ssr: false
    }
	],

	serverMiddleware: [
		bodyParser.json(),
		cookieParser(),
		cookieAuthorization,
    initialSearches,
	]
};
