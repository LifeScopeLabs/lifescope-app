export const state = function () {
    return {
        page: 0,
        rows: 3,
        columns: 5,
        radius: 6,
        cellWidth: 1.5,
        cellHeight: 0.7,
        cellContentHeight: 0.6,
        gridCellsPerRow: 24,
        focusedCellPosititon: { x:0, y:0.1, z:-1.5 },
        focusedCellScale: { x:1, y:1, z:1 },
        arrowWidth: 0.2,
        arrowHeight: 0.3,
        focusArrowHeight: 0.2,
        focusArrowWidth: 0.35,
        focusArrowMargin: 0.15,
        animateInSeconds: 1,
        animateOutSeconds: 0.2,
     };
};

export const getters = {
    itemsPerPage: (state) => {
        return state.rows * state.columns;
    },
    canPageLeft: (state) => {
        return !!state.page;
    },
    canPageRight: (state, getters, rootState, rootGetters) => {
        if (getters.itemsPerPage >= rootGetters['xr/totalItems']) {
            return false;
        }
        var result = (state.page+1)*getters.itemsPerPage <= rootGetters['xr/totalItems'];
        return result;
    },
};

export const mutations = {
    PAGE_LEFT: function(state) {
        if (state.page >= 1) {
            state.page -= 1;
        }
        else {
            state.page = 0;
        }
    },
    PAGE_RIGHT: function(state) {
        state.page += 1;
    },
    RESET_PAGE: function(state) {
        state.page = 0;
    },
};

export const actions = {
    pageRight: function(context) {
        // if (CONFIG.DEBUG) {console.log("pageRight");}
        if (context.getters.canPageRight) {
            context.commit('PAGE_RIGHT');
        }
    },
    pageLeft: function(context) {
        // if (CONFIG.DEBUG) {console.log("pageLeft");}
        if (context.getters.canPageLeft) {
            context.commit('PAGE_LEFT');
        }
    },
    
}

const gridModule = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}

export default gridModule;
