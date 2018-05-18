import Vue from 'vue';

import App from './App.vue';

// must import aframe here to load components
import 'aframe';
import 'aframe-layout-component';
import 'networked-aframe';
//import 'easyrtc';

import 'three';


//var app = new Vue(Vue.util.extend({ router }, App)).$mount('#app');
var app = new Vue({
    el: '#app',
    render: h => h(App)
  });
  