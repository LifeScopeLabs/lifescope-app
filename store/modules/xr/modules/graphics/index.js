import TimeUtils from '../../../../../components/xr/util/TimeUtils.js';

const SkyboxEnum = Object.freeze({
    STARS: 1,
    SUN: 2
});

const GraphicsQualityEnum = Object.freeze({
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3
});

const GraphicsQualityString = new Map([
    [GraphicsQualityEnum.LOW, 's'], // small
    [GraphicsQualityEnum.MEDIUM, 'm'],
    [GraphicsQualityEnum.HIGH, 'l'], // large
]);

const ShadingEnum = Object.freeze({
    DEFAULT: 1,
    CEL: 2,
});

const GraphicsShadingString = new Map([
    [ShadingEnum.DEFAULT, 'default'],
    [ShadingEnum.CEL, 'cel'],
]);


export const state = function () {
    return {
        skybox: SkyboxEnum.STARS,
        skytime: 0, // 24 hours, number
        bump: false,
        normal: false,
        quality: GraphicsQualityEnum.HIGH,
        shading: ShadingEnum.DEFAULT,
    };
};

export const getters = {
    skybox: state => {
        return (state.skytime > 20) || (state.skytime < 6) ? SkyboxEnum.STARS : SkyboxEnum.SUN;
    },
    timeHours: state => {
        return TimeUtils.getTimeHours(state.skytime);
    },
    timeMinutes: state => {
        return TimeUtils.getTimeMinutes(state.skytime);
    },
    timeMinutesHourDecimal: (state, getters) => {
        return TimeUtils.minutesToHourDecimal(getters.timeMinutes);
    },
    timeMinutesString: (state, getters) => {
        return TimeUtils.getPaddedMinutesString(getters.timeMinutes);
    },
    qualityString: (state) => {
        return GraphicsQualityString.get(state.quality);
    },
    shadingString: (state) => {
        return GraphicsShadingString.get(state.shading);
    }
}

export const mutations = {
    SET_SKYBOX: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_SKYBOX");}
        if (SkyboxEnum.hasOwnProperty(val)) {
            state.skybox = SkyboxEnum[val];
        }
        else {
            console.log(`cannot set skybox, ${val} is not a SkyboxEnum`);
        }
    },
    SET_QUALITY: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_QUALITY");}
        if (GraphicsQualityEnum.hasOwnProperty(val)) {
            state.quality = GraphicsQualityEnum[val];
        }
        else {
            console.log(`cannot set quality, ${val} is not a GraphicsQualityEnum`);
        }
    },
    SET_SHADING: function(state, val) {
        // if (CONFIG.DEBUG) {console.log("SET_SHADING");}
        console.log(val);
        if (ShadingEnum.hasOwnProperty(val)) {
            state.shading = ShadingEnum[val];
        }
        else {
            console.log(`cannot set shading, ${val} is not a ShadingEnum`);
        }
    },
    SET_BUMP: function(state, active=true) {
        // if (CONFIG.DEBUG) {console.log(`SET_BUMP: ${active}`)}
        state.bump = active ? true : false;
    },
    SET_NORMAL: function(state, active=true) {
        // if (CONFIG.DEBUG) {console.log(`SET_NORMAL: ${active}`)}
        state.normal = active ? true : false;
    },
    SET_SKYTIME: function(state, value) {
        // if (CONFIG.DEBUG) {console.log(`SET_SKYTIME: ${value}`)}
        state.skytime = value;
    },
};

export const actions = {
    setTimeFromString: function(context, timeStr) {
        // if (CONFIG.DEBUG) {console.log("setTimeFromString");}
        var timeNum = 0;
        var timeArray = timeStr.split(':');
        var hours = Number.parseInt(timeArray[0]);
        var minutes = Number.parseInt(timeArray[1]);
        var hourDecimal = minutes / 60;
        timeNum = hours + hourDecimal;
        context.commit('SET_SKYTIME', timeNum);
    },
    updateTimeHours: function(context, hours) {
        // if (CONFIG.DEBUG) {console.log("updateTimeHours");}
        var newTime = +hours + +context.getters.timeMinutesHourDecimal;
        console.log(`hours ${hours}, newTime: ${newTime}`);
        context.commit('SET_SKYTIME', newTime);
    },
    updateTimeMinutes: function(context, minutes) {
        // if (CONFIG.DEBUG) {console.log("updateTimeMinutes");}
        var newTime = +context.getters.timeHours + +TimeUtils.minutesToHourDecimal(minutes);
        context.commit('SET_SKYTIME', newTime);
    },
};

const graphicsModule = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}

export { SkyboxEnum, GraphicsQualityEnum, ShadingEnum };
export default graphicsModule;
