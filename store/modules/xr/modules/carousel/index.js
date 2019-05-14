export const state = function () {
    return {
        pageStart: 0,
        pageStep: 5,
        numberOfSegments: 36,
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
        // if (CONFIG.DEBUG) {console.log("PAGE_RIGHT");}
        if (state.pageStep + state.pageStart + state.numberOfSegments < length) {
            state.pageStart += state.pageStep;
        }
        else {
            state.pageStart = length - state.numberOfSegments;
        }
    }
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
