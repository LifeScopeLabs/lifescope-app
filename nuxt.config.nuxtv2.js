import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jquery from 'jquery';
import moment from 'moment';
import webpack from 'webpack';

import cookieAuthorization from "./lib/middleware/cookie-authorization";
import initialSearches from "./lib/middleware/initial-searches";

export default {
  /*
  ** Headers of the page
  */
  head: {
    title: 'LifeScope',
    description: 'Search and explore the internet of you',
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
  loading: { color: '#3B8070' },

	modules: ['@nuxtjs/apollo'],

	apollo: {
		clientConfigs: {
			default: '../apollo/client-configs/default.js'
		}
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
		  presets: ['es2015', 'stage-2'],
      babelrc: true
    },

		vendor: [
		  'jquery',
			'mixitup',
			'vue-js-modal',
			'vue2-filters',
      'vue-bootstrap-datetimepicker'
		],

    plugins: [
      new webpack.ProvidePlugin({
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        $: 'jquery',
        moment: 'moment',
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
