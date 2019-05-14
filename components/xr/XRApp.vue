<template>
  <div id="xrapp">
    <aframe-scene></aframe-scene>
    <!-- <hud v-if="sceneLoaded"></hud> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';

import axios from 'axios';
import Vue from 'vue';


import aframeScene from './scene.vue';
import hud from './components/hud/hud.vue';

export default {
    components: {
        aframeScene,
        hud
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
