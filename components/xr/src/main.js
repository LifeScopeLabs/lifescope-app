import Vue from 'vue';
import VueRouter from 'vue-router';

//import 'config';
var CONFIG = {};
CONFIG.DEBUG = false;

// disable warn
//console.warn = function() {};

import 'three';
// must import aframe here to load components
import 'aframe';
import 'aframe-layout-component';
import 'networked-aframe';
import 'aframe-animation-component';
import 'aframe-src-fit-component';
import 'aframe-asset-on-demand-component';
import 'aframe-input-mapping-component';
import 'aframe-teleport-controls';
import 'aframe-extras';
import 'aframe-gui';
import './components/aframe/play-gaze.js';
import './components/aframe/dynamic-autoplay.js';
import './components/aframe/entangle.js';
import './components/aframe/avatar-rig';


// controls
import {mappings, inputActions} from './controls/input-mappings';
AFRAME.registerInputActions(inputActions, 'default');
AFRAME.registerInputMappings(mappings);


import { runInThisContext } from 'vm';

// router
Vue.use(VueRouter);
var router = new VueRouter({
  mode: 'history',
  routes: []
});

// ignore elements for Firefox
Vue.config.ignoredElements = ['a-scene', 'a-assets', 'a-gltf-model', 'a-entity', 'a-sphere', 'a-animation', 'a-sky', 'a-gui-flex-container', 'a-gui-button'];

import App from './App.vue';

//var app = new Vue(Vue.util.extend({ router }, App)).$mount('#app');
var app = new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
  });
  