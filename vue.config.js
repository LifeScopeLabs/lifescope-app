import Vue from 'vue';

// prevents unknown custom elements in Firefox
Vue.config.ignoredElements = ['a-scene', 'a-assets', 'a-gltf-model', 'a-entity', 'a-sphere', 'a-animation', 'a-sky', 'a-mapbox-terrain', 'a-ionicon'];