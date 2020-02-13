import Vue from 'vue';

import * as THREE from 'three';
import 'aframe';
import 'networked-aframe';
import 'aframe-extras';
import 'aframe-font-awesome';
import 'aframe-geojson-component';
import 'aframe-gui';
import 'aframe-input-mapping-component';
import 'aframe-super-keyboard';
import 'aframe-sun-sky';
import 'aframe-teleport-controls';

import 'nipplejs';
import 'particles.js';
import WebFont from 'webfontloader';

window.WebFont = WebFont;

import { registerAframeComponents, setupFontAwesome, registerAframeInput } from 'lifescope-xr';

registerAframeComponents();
setupFontAwesome();
registerAframeInput();


// ignore elements for Firefox
// core elements
['a-scene', 'a-assets', 'a-entity'].forEach((val,index) => {Vue.config.ignoredElements.push(val)});
// primitives
Object.keys(AFRAME.primitives.primitives).forEach(function(key,index) {
  Vue.config.ignoredElements.push(key);
});
