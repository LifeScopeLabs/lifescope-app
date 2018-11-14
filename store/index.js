import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';
import config from 'config';
import moment from 'moment';

Vue.use(Vuex);

require('whatwg-fetch');

const store = () => new Vuex.Store({
	state: {
		cookies: null,
		user: null,
		menu: {
			open: false
		},

		searchBar: {
			filters: [],
			query: null
		},

		currentSearch: {
			id: null,
			count: 0,
			query: null,
			filters: [],
			favorited: null,
			icon: null,
			icon_color: null,
			name: null
		},

		tempSearch: {
			id: null,
			count: 0,
			query: null,
			filters: [],
			favorited: null,
			icon: null,
			icon_color: null,
			name: null
		},

		searchMany: [],
		searchCount: null,
		tagMany: [],
		pageSize: 100,
		pageOffset: 0,
		searchEnded: false,
		view: null,

		sortField: 'datetime',
		sortOrder: 'desc',

		hide_advanced: false,
		hide_filters: false,
		hide_favorite_star: false,

		searching: false,
		spinner: true,
		facetSelectOpen: false,

		objects: {
			events: [],
			contacts: [],
			content: []
		},

		connectionMany: [],
		providerHydratedMany: [],
		permissions: {},
		userOne: {},

		connectionsLoaded: false,
		providersLoaded: false,

		facet: null,

		mobileViewSelectorOpen: false,
		mobileSortSelectorOpen: false,
		mobileFacetSelectorOpen: false,

		settingsType: null,
		settingsSelectorOpen: false,

		mapbox: {},
		mapInitialized: false,

		app: {
			id: null,
			clientId: {
				value: null,
				error: false
			},
			clientSecret: {
				value: null,
				error: false
			},
			redirects: {
				value: [],
				error: false,
			},
			name: {
				value: null,
				error: false
			},
			description: {
				value: null,
				error: false
			},
			homepage: {
				value: null,
				error: false
			},
			privacyPolicy: {
				value: null,
				error: false
			}
		}
	},

	getters: {
		authenticated(state) {
			return state.user != undefined;
		},

		theme(state) {
			return state.user && _.has(state.user, 'settings.theme') ? state.user.settings.theme : 'light';
		},

		dateJoined(state) {
			return moment(state.user.joined).format('MMMM DD, YYYY')
		}
	},

	mutations: {
		SET_REQ: function(state, req) {
			state.cookies = req.cookies;
			state.user = req.user;
			state.mapbox = req.mapbox;
		}
	},

	actions: {
		async nuxtServerInit({commit}, {req}) {
			await commit('SET_REQ', req);
		}
	}
});

export default store;
