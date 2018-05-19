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
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '{{escape description }}' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress bar color
  */
  loading: { color: '#2ac1de' },

	modules: [
	  '@nuxtjs/apollo',
    '@nuxtjs/google-analytics'
  ],

	apollo: {
		clientConfigs: {
			default: '../apollo/client-configs/default.js'
		}
	},

  'google-analytics': {
    id: config.googleAnalytics.trackingID
  },

	css: [
		'./assets/css/site.min.css'
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

      // config.module.rules.push({
      //       exclude: /(node_modules)/
      // });

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
      'aframe',
      'aframe-layout-component',
      'networked-aframe'
		],

    plugins: [
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        $: 'jquery',
        moment: 'moment'//,
        // 'socket.io': 'socket.io',
        // easyrtc: 'easyrtc',
        // 'window.easyrtc': 'easyrtc'
      }),
    ]
	},

	plugins: [
		'./plugins/vue-js-modal',
		'./plugins/vue2-filters',
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
