const SkyboxEnum = {
    STARS: 1,
    SUN: 2
};


export const state = function () {
    return {
        floorMapActive: false,
        worldMapActive: false,
        mapLatitude: 34.023552,
        mapLongitude: -118.286189,
        skytime: 0, // 24 hours
        bump: false,
        normal: false
    }
};

export const getters = {
    skybox: (state, getters, rootState, rootGetters) => {
        return (state.skytime > 20) || (state.skytime < 6) ? SkyboxEnum.STARS : SkyboxEnum.SUN;
    }
}

export const mutations = {
    SET_FLOOR_MAP_ACTIVE: function(state, active=true) {
        // if (CONFIG.DEBUG) {console.log("SET_FLOOR_MAP_ACTIVE")}
        state.floorMapActive = active;
    },
    SET_WORLD_MAP_ACTIVE: function(state, active=true) {
        // if (CONFIG.DEBUG) {console.log("SET_WORLD_MAP_ACTIVE")}
        state.worldMapActive = active;
    },
    SET_MAP_LATITUDE: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_MAP_LATITUDE")}
        var num = new Number(val);
        if (num < -90) {num = -90;}
        if (num > 90) {num = 90;}
        state.mapLatitude = num;
    },
    SET_MAP_LONGITUDE: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_MAP_LONGITUDE")}
        var num = new Number(val);
        if (num < -180) {num = -180;}
        if (num > 180) {num = 180;}
        state.mapLongitude = num;
    },
    // SET_SKYBOX: function(state, val) {
    //     // if (CONFIG.DEBUG) {console.log("SET_SKYBOX");}
    //     if (SkyboxEnum.hasOwnProperty(val)) {
    //         state.skybox = SkyboxEnum[val];
    //     }
    //     else {
    //         console.log(`cannot set skybox, ${val} is not a SkyboxEnum`);
    //     }
    // },
    SET_BUMP: function(state, active=true) {
        // if (CONFIG.DEBUG) {console.log(`SET_BUMP: ${active}`)}
        state.bump = active ? true : false;//new Boolean(active);
    },
    SET_NORMAL: function(state, active=true) {
        // if (CONFIG.DEBUG) {console.log(`SET_NORMAL: ${active}`)}
        state.normal = active ? true : false;//new Boolean(active);
    },
    SET_SKYTIME: function(state, time=0) {
        state.skytime = time;
    },
};

const graphicsModule = {
    namespaced: true,
    state,
    getters,
    mutations
}

export { SkyboxEnum };
export default graphicsModule;
