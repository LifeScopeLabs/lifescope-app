<template>
  <div id="xrapp">
    <aframe-scene></aframe-scene>
    <!-- <hud v-if="sceneLoaded"></hud> -->
    <loading-screen v-if="!sceneLoaded"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import axios from 'axios';
import Vue from 'vue';


import aframeScene from './scene.vue';
import LoadingScreen from './LoadingScreen.vue';
// import hud from './components/hud/hud.vue';

export default {
    components: {
        aframeScene,
        LoadingScreen,
        // hud
    },

    computed: {
      ...mapState('xr',
      [
        'sceneLoaded',
        'isMobile',
      ])
    }
}
</script>

<style src="./xrapp.css"></style>
