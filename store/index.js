import Vue from 'vue';
import Vuex from 'vuex';
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
      count: null,
      query: null,
      filters: [],
      favorited: null,
      icon: null,
      icon_color: null,
      name: null
    },

    tempSearch: {
      id: null,
      count: null,
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
    pageSize: null,
    pageOffset: null,
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

    connectionsLoaded: false,
    providersLoaded: false,

    facet: null
	},

	getters: {
		authenticated (state) {
			return state.user != undefined;
		},
		dateJoined (state) {
			return moment(state.user.date_join).format('MMMM DD, YYYY')
		}
	},

	mutations: {
		SET_REQ: function(state, req) {
			state.cookies = req.cookies;
			state.user = req.user;
		}
	},

	actions: {
		async nuxtServerInit({ commit }, { req }) {
			await commit('SET_REQ', req);
		}
	}
});

export default store;
