<template>
  <a-entity class="gallery">



      <!-- Camera -->
      <!-- <a-camera>
        <a-entity cursor="rayOrigin: mouse"></a-entity>
      </a-camera> -->

      <!-- Create scene -->
      <!-- Floor -->
      <a-entity id="floor"
                geometry="primitive: plane; width: 8; height: 400"
                material="src:#floor; repeat: 4 200"
                rotation="-90 0 0"
                position="0 0 -4">
      </a-entity>
      
      <!-- Wall left -->
      <a-entity id="wall-left"
                :geometry="'primitive: plane; width:' + wallWidth + '; height: ' + wallHeight"
                material="color: #cee1ff; side: double; transparent: true; opacity: 0.5;" 
                rotation="0 90 0"
                :position="-hallWidth/2 + ' ' + wallHeight/2 + ' 0'">
      </a-entity>
      
      <!-- Wall right repeat: 4 200" -->
      <a-entity id="wall-right"
                :geometry="'primitive: plane; width:' + wallWidth + '; height: ' + wallHeight"
                material="color: #cee1ff; side: double; transparent: true; opacity: 0.5;"
                rotation="180 90 0"
                :position="hallWidth/2 + ' ' + wallHeight/2 + ' 0'">
      </a-entity>

      <!-- Carousel -->
      <gallery-carousel v-bind:LSObjs='LSObjs'/>
      
      <!-- Earth -->
      <a-sphere id="Earth" position="0 1.2 -4" radius=".99" 
                material="src:#earth; roughness: 1; transparent: true; opacity: 0.9;">
          <a-animation attribute="rotation"
                 easing="linear" 
                 dur="150000"
                 fill="forwards"
                 to="0 360 0"
                 repeat="indefinite"></a-animation>
      </a-sphere>
  </a-entity>
</template>

<script>
import galleryCarousel from "./carousel/gallery-carousel.vue";

import Vue from 'vue';

console.log("from gallery.vue <script>")
export default {
    data () {
        return {
            name: "Lifescope",
            description: "The Internet of You",
            wallWidth: 400,
            wallHeight: 4,
            hallWidth: 8
        }
    },
    components: {
        galleryCarousel
    },

    props: ['LSObjs'],
    
    
    // Lifecycle hooks
    // https://vuejs.org/v2/api/#Options-Lifecycle-Hooks
    beforeCreate () {
        console.log("beforeCreate");
    },
    created () {
        //  data observation, computed properties, methods, watch/event callbacks
        console.log("created");
        //debugger;
    },
    beforeMount () {
        console.log("beforeMount");
    },
    mounted () {
        // el is replaced by the newly created vm.$el
        console.log("mounted");
        console.log("gallery.vue :" + this.LSObjs);

        this.$nextTick(function () {
            // Code that will run only after the
            // entire view has been rendered
            console.log("mounted nextTick");
        })
    },
    beforeUpdate () {
        console.log("beforeUpdate");
    },
    updated () {
        console.log("updated");
    },
    beforeDestroy () {
        console.log("beforeDestroy");
    },
    destroyed () {
        console.log("destroyed");
    }
}
</script>
