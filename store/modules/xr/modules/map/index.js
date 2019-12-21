const MapboxTypeEnum = Object.freeze({
    SATELLITE: 'satellite',
    STREETS: 'streets',
    SATELLITESTREETS: 'satellite-streets',
    OUTDOORS: 'outdoors',
    LIGHT: 'light',
    DARK: 'dark',
    NAVIGATIONPREVIEWDAY: 'navigation-preview-day',
    NAVIGATIONPREVIEWNIGHT: 'navigation-preview-night',
    NAVIGATIONGUIDANCEDAY: 'navigation-guidance-day',
    NAVIGATIONGUIDANCENIGHT: 'navigation-guidance-night',
});

export const state = function () {
    return {
        floorMapActive: false,
        worldMapActive: false,
        mapLatitude: 34.023552,
        mapLongitude: -118.286189,

        floorMapType: 'satellite',
        floorRows: 1,
        floorZoom: 11,
        floorHighDPI: false,
        floorScale: 1,
        floorMapHeightmap: false,
        floorMapHeight: 1,

        worldRows: 1,
        worldZoom: 11,
        worldHighDPI: false,
        worldScale: 8,
        worldMapHeightmap: false,
        worldMapFloorHeight: 1,

        mapboxType: MapboxTypeEnum.SATELLITE,
        worldRows: 10,
        worldZoom: 8,

        globeActive: true,
    };
};

export const mutations = {
    SET_FLOOR_MAP_ACTIVE: function(state, active=true) {
        // if (CONFIG.DEBUG) {console.log("SET_FLOOR_MAP_ACTIVE");}
        state.floorMapActive = active;
    },
    SET_WORLD_MAP_ACTIVE: function(state, active=true) {
        // if (CONFIG.DEBUG) {console.log("SET_WORLD_MAP_ACTIVE");}
        state.worldMapActive = active;
    },
    SET_MAP_LATITUDE: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_MAP_LATITUDE");}
        var num = new Number(val);
        if (num < -90) {num = -90;}
        if (num > 90) {num = 90;}
        state.mapLatitude = num;
    },
    SET_MAP_LONGITUDE: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_MAP_LONGITUDE");}
        var num = new Number(val);
        if (num < -180) {num = -180;}
        if (num > 180) {num = 180;}
        state.mapLongitude = num;
    },

    SET_FLOOR_MAP_ROWS: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_FLOOR_MAP_ROWS");}
        state.floorRows = val;
    },
    SET_FLOOR_MAP_ZOOM: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_FLOOR_MAP_ZOOM");}
        state.floorZoom = val;
    },
    SET_FLOOR_DPI: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_FLOOR_DPI");}
        state.floorHighDPI = val;
    },
    SET_FLOOR_SCALE: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_FLOOR_SCALE");}
        state.floorScale = val;
    },
    SET_FLOOR_HEIGHTMAP: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_FLOOR_HEIGHTMAP");}
        state.floorMapHeightmap = val;
    },
    SET_FLOOR_HEIGHT: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_FLOOR_HEIGHT");}
        state.floorMapHeight = val;
    },


    SET_WORLD_MAP_ROWS: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_WORLD_MAP_ROWS");}
        state.worldRows = val;
    },
    SET_WORLD_MAP_ZOOM: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_WORLD_MAP_ZOOM");}
        state.worldZoom = val;
    },
    SET_WORLD_DPI: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_WORLD_DPI");}
        state.worldHighDPI = val;
    },
    SET_WORLD_SCALE: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_WORLD_SCALE");}
        state.worldScale = val;
    },
    SET_WORLD_HEIGHTMAP: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_WORLD_HEIGHTMAP");}
        state.worldMapHeightmap = val;
    },
    SET_WORLD_HEIGHT: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_WORLD_HEIGHT");}
        state.worldMapHeight = val;
    },
    SET_MAPTYPE: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_MAPTYPE");}
        if (MapboxTypeEnum.hasOwnProperty(val)) {
            state.mapboxType = MapboxTypeEnum[val];
        }
        else {
            console.log(`cannot set mapboxType, ${val} is not a MapboxTypeEnum`);
        }
    },
    SET_GLOBE_ACTIVE: function(state, active=true) {
        // if (CONFIG.DEBUG) {console.log("SET_GLOBE_ACTIVE");}
        state.globeActive = active;
    },
};

const mapModule = {
    namespaced: true,
    state,
    mutations
}

export { MapboxTypeEnum };
export default mapModule;
