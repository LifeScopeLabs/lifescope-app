const VRHudEnum = Object.freeze({
    NONE: 0,
    HELP: 1,
    SETTINGS: 2
});

export const state = function () {
    return {
        vrKeyboardActive: false,
        vrKeyboardTarget: '',
        vrKeyboardModel: 'basic',
        vrSettingsActive: false,
        vrHelpActive: false,
        vrActiveHud: VRHudEnum.NONE,

        helpMenuVisible: false,
        graphicsMenuVisible: false,
    };
};

export const mutations = {
    SET_VR_KEYBOARD_ACTIVE: function(state, active=true) {
        // if (CONFIG.DEBUG) {console.log(`SET_VR_KEYBOARD_ACTIVE: ${active}`);}
        state.vrKeyboardActive = active;
    },
    SET_VR_KEYBOARD_TARGET: function(state, target) {
        // if (CONFIG.DEBUG) {console.log("SET_VR_KEYBOARD_TARGET");}
        state.vrKeyboardTarget = target;
    },
    SET_VR_KEYBOARD_MODEL: function(state, model) {
        // if (CONFIG.DEBUG) {console.log("SET_VR_KEYBOARD_MODEL");}
        if (['basic', 'numpad'].includes(model)) {
            state.vrKeyboardModel = model;
            console.log(state.vrKeyboardModel);
        }
    },
    SET_VR_HELP_ACTIVE: function(state, active=true) {
        // if (CONFIG.DEBUG) {console.log("SET_VR_HELP_ACTIVE");}
        state.vrHelpActive = active;
    },
    SET_VR_SETTINGS_ACTIVE: function(state, active=true) {
        // if (CONFIG.DEBUG) {console.log("SET_VR_SETTINGS_ACTIVE");}
        state.vrSettingsActive = active;
    },
    SET_ACTIVE_HUD: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_ACTIVE_HUD");}
        if (VRHudEnum.hasOwnProperty(val)) {
            state.vrActiveHud = VRHudEnum[val];
        }
        else {
            console.log(`cannot set active hud, ${val} is not a VRHudEnum`);
        }
    },
    SET_HELP_MENU_ACTIVE: function(state, active=true) {
        // if (CONFIG.DEBUG) {console.log(`SET_HELP_MENU_ACTIVE: ${active}`);}
        state.helpMenuVisible = active;
    },
    SET_GRAPHICS_MENU_ACTIVE: function(state, active=true) {
        // if (CONFIG.DEBUG) {console.log(`SET_GRAPHICS_MENU_ACTIVE: ${active}`);}
        state.graphicsMenuVisible = active;
    },
};

export const actions = {
    cycleHud: function(context) {
        // if (CONFIG.DEBUG) {console.log("cycleHud");}
        context.commit('SET_VR_KEYBOARD_ACTIVE', false);
        switch (context.state.vrActiveHud) {
          case VRHudEnum.NONE:
            // change to Help
            context.commit('SET_VR_HELP_ACTIVE', true);
            context.commit('SET_VR_SETTINGS_ACTIVE', false);
            context.commit('SET_ACTIVE_HUD', 'HELP');
            break;
          case VRHudEnum.HELP:
            // change to Settings
            context.commit('SET_VR_HELP_ACTIVE', false);
            context.commit('SET_VR_SETTINGS_ACTIVE', true);
            context.commit('SET_ACTIVE_HUD', 'SETTINGS');
            break;
          case VRHudEnum.SETTINGS:
            // change to None
            context.commit('SET_VR_HELP_ACTIVE', false);
            context.commit('SET_VR_SETTINGS_ACTIVE', false);
            context.commit('SET_ACTIVE_HUD', 'NONE');
            break;
          default:
            break;
        }
    }
};

const hudModule = {
    namespaced: true,
    state,
    mutations,
    actions
}

export { VRHudEnum };
export default hudModule;
