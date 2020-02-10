export const state = function () {
    return {
        pageStart: 0,
        pageStep: 5,
        numberOfSegments: 24,
        floorRadius: 5,
        railHeight: 1.2,
        floorActive: true
     };
};

export const mutations = {
    PAGE_LEFT: function(state) {
        // if (CONFIG.DEBUG) {console.log("PAGE_LEFT");}
        if (state.pageStart - state.pageStep >= 0) {
            state.pageStart -= state.pageStep;
        }
        else {
            state.pageStart = 0;
        }
    },
    PAGE_RIGHT: function(state, length) {
        // if (CONFIG.DEBUG) {console.log(`PAGE_RIGHT`);}
        if (length == 0) {return;}
        if (state.pageStep + state.pageStart + state.numberOfSegments < length) {
            state.pageStart += state.pageStep;
        }
        else if (length - state.numberOfSegments >= 0) {
            state.pageStart = length - state.numberOfSegments;
        }
    },
    SET_NUMBER_OF_SEGMENTS: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_NUMBER_OF_SEGMENTS")}
        var num = new Number(val);
        if (num < 12) {num = 12;}
        if (num > 121) {num = 121;}
        state.numberOfSegments = num;
    },
    SET_FLOOR_RADIUS: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_FLOOR_RADIUS")}
        var num = new Number(val);
        if (num < 1) {num = 1;}
        // if (num > 24) {num = 24;}
        state.floorRadius = num;
    },
    SET_FLOOR_ACTIVE: function(state, active=true) {
        // if (CONFIG.DEBUG) {console.log("SET_FLOOR_ACTIVE");}
        state.floorActive = active;
    },
};
     
export const actions = {
    pageLeft: function(context) {
        // if (CONFIG.DEBUG) {console.log("pageLeft");}
        context.commit('PAGE_LEFT');
        },
    pageRight: function(context) {
        // if (CONFIG.DEBUG) {console.log("pageRight");}
        context.commit('PAGE_RIGHT', context.rootState.xr.LSObjs.length);
    }
};

const carouselModule = {
    namespaced: true,
    state,
    mutations,
    actions
}

export default carouselModule;
