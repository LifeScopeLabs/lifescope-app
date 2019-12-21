import axios from 'axios';

export const state = function () {
    return {
        cursorActive: true,
        rightHandControllerActive: false,
        avatars: [],
        avatarURLs: {},
        playerHeight: 1.6
    };
};

export const mutations = {
    SET_CURSOR_ACTIVE: function(state, active=true) {
        // if (CONFIG.DEBUG) {console.log("SET_CURSOR_ACTIVE")}
        state.cursorActive = active;
    },
    SET_RIGHT_HAND_CONTROLLER_ACTIVE: function(state, active=true) {
        // if (CONFIG.DEBUG) {console.log("SET_RIGHT_HAND_CONTROLLER_ACTIVE")}
        state.rightHandControllerActive = active;
    },
    SET_AVATARS: function(state, objs) {
        // if (CONFIG.DEBUG) {console.log('SET_AVATARS');}
        state.avatars = objs;
    },
    ADD_AVATARURL: function(state, payload) {
        Vue.set(state.avatarURLs, payload.key, payload.url);
    }
};

export const getters = {
    getAvatarURL: (state) => (key) => {
        return state.avatarURLs[ key ];
    }
};

export const actions = {
    getAvatars ({ commit }) {
        // if (CONFIG.DEBUG) {console.log("getAvatars action");};
        return axios.get("/avatars")
        .then((res) => {
            commit('SET_AVATARS', res.data);
        })
        .catch(function (error) {
            // handle error
            console.log('getAvatars error');
            console.log(error);
        })
    },
};

const avatarModule = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};

export default avatarModule;
