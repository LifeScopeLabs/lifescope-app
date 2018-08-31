<template>
  <a-entity class="gallery">
      <!-- Create scene -->
      <!-- Floor -->
      <a-entity id="floor" class="boundry"
                :geometry="'primitive: plane; width:' + hallWidth + '; height: ' + hallDepth + ''"
                :material="'src:#floor; repeat: ' + hallWidth + ' ' + -hallDepth"
                rotation="-90 0 0"
                :position="'0 0 ' + -hallWidth/2">
      </a-entity>
      
      <!-- Wall left -->
      <a-entity id="wall-left" class="boundry"
                :geometry="'primitive: plane; width:' + hallDepth + '; height: ' + wallHeight"
                material="color: #cee1ff; side: double; transparent: true; opacity: 0.4;" 
                rotation="0 90 0"
                :position="-hallWidth/2 + ' ' + wallHeight/2 +' ' + -hallDepth/2">
      </a-entity>
      
      <!-- Wall right -->
      <a-entity id="wall-right" class="boundry"
                :geometry="'primitive: plane; width:' + hallDepth + '; height: ' + wallHeight"
                material="color: #cee1ff; side: double; transparent: true; opacity: 0.4;"
                rotation="180 90 0"
                :position="hallWidth/2 + ' ' + wallHeight/2 +' ' + -hallDepth/2">
      </a-entity>

      <!-- Wall front -->
      <a-entity id="wall-front" class="boundry"
                :geometry="'primitive: plane; width:' + hallWidth + '; height: ' + wallHeight"
                material="color: #cee1ff; side: double; transparent: true; opacity: 0.4;"
                rotation="0 0 0"
                :position="'0 ' + wallHeight/2 +' ' + -hallDepth">
      </a-entity>
      
      <!-- Wall back -->
      <a-entity id="wall-back" class="boundry"
                :geometry="'primitive: plane; width:' + hallWidth + '; height: ' + wallHeight"
                material="color: #cee1ff; side: double; transparent: true; opacity: 0.4;"
                rotation="0 0 0"
                :position="'0 ' + wallHeight/2 + ' 0'">
      </a-entity>

      <!-- Carousel   -->
      <carousel-explorer v-if="$store.state.objects.content.length > 0 ||
                            $store.state.objects.contacts.length > 0 ||
                            $store.state.objects.events.length > 0 "
                            :hallWidth='hallWidth' :hallDepth='hallDepth'/>
      
      <!-- Earth -->
      <globe-points />

       <a-sphere id="Earth" class="boundry"
                :position="'0 1.5 ' + -hallWidth/2" 
                radius=".99"
                material="src:#earth; roughness: 1; transparent: true; opacity: 0.9;">
          <a-animation attribute="rotation"
                 easing="linear" 
                 dur="150000"
                 fill="forwards"
                 to="0 360 0"
                 repeat="indefinite"></a-animation>
        </a-sphere>

        <a-entity id="Logo" :position="'0 2.6 ' + -hallWidth/2"
              rotation="0 0 0">
      <a-gltf-model src="#logo" scale="0.075 0.075 0.075">
        </a-gltf-model>
        <a-animation attribute="rotation"
                 easing="linear" 
                 dur="42000"
                 fill="forwards"
                 to="0 -360 0"
                 repeat="indefinite"></a-animation>
    </a-entity>


    <!-- Demo Map -->
    <!-- Floor -->
    <a-mapbox-terrain id="mapbox-floor" latitude="34.023552" longitude="-118.286189" position="0 0 -10" zoom-level="11"></a-mapbox-terrain>
    <!-- World -->
    <a-mapbox-terrain id="mapbox-world" latitude="34.023552" longitude="-118.286189" position="0 -4 0" zoom-level="11" scale="45 5 45"></a-mapbox-terrain>



  </a-entity>
</template>

<script>
import carouselExplorer from "./carousel-explorer.vue";
import globePoints from "./globe.vue";

import Vue from 'vue';

var CONFIG = {};
CONFIG.DEBUG = true;

if (CONFIG.DEBUG) {console.log("from gallery.vue <script>")}
export default {
    data () {
        return {
            name: "LifeScope",
            description: "The Internet of You",
            wallHeight: 1.1,
            hallWidth: 20,
            hallDepth: 20,
        }
    },
    components: {
        carouselExplorer,
        globePoints
    },
    
    // Lifecycle hooks
    // https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
    beforeCreate () {
        if (CONFIG.DEBUG) {console.log("beforeCreate");};
    },
    created () {
        //  data observation, computed properties, methods, watch/event callbacks
        if (CONFIG.DEBUG) {console.log("created");};
        //debugger;
    },
    beforeMount () {
        if (CONFIG.DEBUG) {console.log("beforeMount");};
    },
    mounted () {
        // el is replaced by the newly created vm.$el
        if (CONFIG.DEBUG) {console.log("mounted");};

        this.$nextTick(function () {
            // Code that will run only after the
            // entire view has been rendered
            if (CONFIG.DEBUG) {console.log("mounted nextTick");};
        })
    },
    beforeUpdate () {
        if (CONFIG.DEBUG) {console.log("beforeUpdate");};
    },
    updated () {
        if (CONFIG.DEBUG) {console.log("updated");};
    },
    beforeDestroy () {
        if (CONFIG.DEBUG) {console.log("beforeDestroy");};
    },
    destroyed () {
        if (CONFIG.DEBUG) {console.log("destroyed");};
    }
}
</script>
