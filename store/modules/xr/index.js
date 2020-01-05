import axios from 'axios';

import avatarModule from './modules/avatar';
import carouselModule from './modules/carousel';
import hudModule from './modules/hud';
import graphicsModule from './modules/graphics';
import mapModule from './modules/map';
import nafModule from './modules/naf';
import gridModule from './modules/grid';
import styleModule from './modules/style';

const SceneLayoutEnum = Object.freeze({
    GALLERY: 1,
    GRID: 2
});

export const modules = {
    avatar: avatarModule,
    carousel: carouselModule,
    graphics: graphicsModule,
    hud: hudModule,
    map: mapModule,
    naf: nafModule,
    grid: gridModule,
    style: styleModule,
};

export const state = function () {
        return {
        LSObjs: [],
        LSObjsLoaded: false,
        roomConfig: {},
        roomName: 'ls-room',
        rooms: [],
        sceneLoaded: false,
        isMobile: false,
        inVR: false,
        sceneLayout: SceneLayoutEnum.GRID,
     }
};

export const getters = {
    totalItems: (state, getters, rootState, rootGetters) => {
        switch (rootState.facet) {
            case 'content':
                return getters.LS_CONTENT.length;
            case 'events':
                return getters.LS_EVENTS.length;
            case 'contacts':
                return getters.LS_CONTACTS.length;
            case 'people':
                return getters.LS_PEOPLE.length;
            default:
                return 0;
        }
    },
    LS_CONTENT: (state, getters, rootState, rootGetters) => {
        return rootState.objects.content;
    },
    LS_EVENTS: (state, getters, rootState, rootGetters) => {
        var events = rootState.objects.events;
        var items = [];
        events.forEach(event => {
            var obj = {};
            obj.datetime = event.datetime;
            obj.eventtype = event.type;
            obj.connection = event.connection;
            event.content.forEach(content => {
                items.push({ ...obj, content: content });
            });
        });
        return items;
    },
    LS_CONTACTS: (state, getters, rootState, rootGetters) => {
        rootState.objects.contacts.forEach(contact => {
            // console.log(contact);
        });

        return rootState.objects.contacts;
    },
    LS_PEOPLE: (state, getters, rootState, rootGetters) => {
        rootState.objects.people.forEach(person => {
            // console.log(person);
        });

        return rootState.objects.people;
    }
};

export const mutations = {
    SET_LSOBJS: function(state, objs) {
            // if (CONFIG.DEBUG) {console.log('SET_LSOBJS');}
            state.LSObjs = objs;
            state.LSObjsLoaded = true;
    },
    SET_ROOMS: function(state, rooms) {
        // if (CONFIG.DEBUG) {console.log('SET_ROOMS');}
        state.rooms = rooms;
    },
    SET_ROOMCONFIG: function(state, roomConfig) {
        // if (CONFIG.DEBUG) {console.log('SET_ROOMCONFIG');}
        state.roomConfig = roomConfig;
    },
    SET_ROOMNAME: function(state, name) {
        // if (CONFIG.DEBUG) {console.log('SET_ROOMNAME');}
        state.roomName = name;
    },
    SET_SCENELOADED: function(state) {
        // if (CONFIG.DEBUG) {console.log('SET_SCENELOADED');}
        if (AFRAME == undefined) {
            state.sceneLoaded = false;
        }
        else {
            var scene = AFRAME.scenes[0];
            state.sceneLoaded = scene == undefined ? false : scene.hasLoaded;
        }
    },
    SET_ISMOBILE: function(state) {
        // if (CONFIG.DEBUG) {console.log('SET_ISMOBILE');}
        if (AFRAME == undefined) {
            console.log("Cannto call SET_ISMOBILE before AFRAME is loaded");
        }
        else {
            state.isMobile = AFRAME.utils.device.isMobile();
        }
    },
    SET_LAYOUT: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_LAYOUT");}
        if (SceneLayoutEnum.hasOwnProperty(val)) {
            state.sceneLayout = SceneLayoutEnum[val];
        }
        else {
            console.log(`cannot set sceneLayout, ${val} is not a SceneLayoutEnum`);
        }
    },
};


const xrModule = {
    namespaced: true,
    modules,
    state,
    mutations,
    getters
};

export { SceneLayoutEnum };
export default xrModule;
