import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import cookieAuthorization from "./lib/middleware/cookie-authorization";
import initialSearches from "./lib/middleware/initial-searches";

export default {
  /*
  ** Headers of the page
  */
  head: {
    title: 'LIFESCOPE',
    description: 'This is LIFESCOPE',
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
		extend (config, { isDev, isClient }) {
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
		vendor: [
			'mixitup',
			'vue-js-modal',
			'vue2-filters'
		]
	},

	plugins: [
		'./plugins/vue-js-modal',
		'./plugins/vue2-filters'
	],

	serverMiddleware: [
		bodyParser.json(),
		cookieParser(),
		cookieAuthorization,
	]
};
