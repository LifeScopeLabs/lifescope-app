import _ from 'lodash';
import moment from 'moment';

require('whatwg-fetch');

export const strict = false;

function initialState () {
    return {
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
        mapPageSize: 1000,
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
            content: [],
            people: [],
        },

        connectionMany: [],
        connectedOAuthProviderMany: [],
        providerHydratedMany: [],
        permissions: {},
        userOne: {},

        connectionsLoaded: false,
        oauthProvidersLoaded: false,
        providersLoaded: false,

        facet: null,

        mobileViewSelectorOpen: false,
        mobileSortSelectorOpen: false,
        mobileFacetSelectorOpen: false,

        settingsType: null,
        settingsSelectorOpen: false,

        mapbox: {},
        mapInitialized: false,

        home: {
            tab: null,
            sort: null
        },

        auth: {
            app: {},
            scopes: []
        },

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
            },

            providerId: {
                value: null,
                error: false
            }
        },

        person: {
            id: null,
            avatar_url: null,
            exernal_avatar_url: null,
            first_name: null,
            middle_name: null,
            last_name: null,
            contact_id_strings: [],
            hydratedContacts: [],
            available_avatars: [],
            avatar_index: null,
            address: {
                street_address: null,
                street_address_2: null,
                city: null,
                postal_code: null,
                region: null,
                country: null
            }
        },

        personMany: [],

        oauthAppAuthorizedMany: [],

        show_native_notification: false,

        visibleObjectStartIndex: 0
    }
}

export const state = initialState;

export const getters = {
    authenticated(state) {
        return state.user != undefined;
    },

    theme(state) {
        return state.user && _.has(state.user, 'settings.theme') ? state.user.settings.theme : 'light';
    },

    dateJoined(state) {
        return moment(state.user.joined).format('MMMM DD, YYYY')
    }
};

export const mutations = {
    SET_REQ: function (state, req) {
        state.cookies = req.cookies;
        state.user = req.user;
        state.mapbox = req.mapbox;
    },

    SET_RES: function (state, res) {
        state.csrf_token = res.context ? res.context.csrf_token : null;
    },

    RESET_STATE: function(state) {
        let clean = initialState();

        let saved = {
            cookies: state.cookies,
            user: state.user,
            mapbox: state.mapbox,
            csrf_token: state.csrf_token
        };

        _.each(clean, function(val, key) {
            state[key] = clean[key];
        });

        _.assign(state, saved);
    }
};

export const actions = {
    async nuxtServerInit({commit}, {req, res}) {
        await commit('SET_REQ', req);
        await commit('SET_RES', res);
    },

    async resetState({commit}) {
        await commit('RESET_STATE')
    }
};
