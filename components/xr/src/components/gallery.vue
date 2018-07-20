<template>
  <a-entity class="gallery">
      <!-- Create scene -->
      <!-- Floor -->
      <a-entity id="floor" class="boundry"
                geometry="primitive: plane; width: 8; height: 400"
                material="src:#floor; repeat: 4 200"
                rotation="-90 0 0"
                position="0 0 -4">
      </a-entity>
      
      <!-- Wall left -->
      <a-entity id="wall-left" class="boundry"
                :geometry="'primitive: plane; width:' + wallWidth + '; height: ' + wallHeight"
                material="color: #cee1ff; side: double; transparent: true; opacity: 0.5;" 
                rotation="0 90 0"
                :position="-hallWidth/2 + ' ' + wallHeight/2 + ' 0'">
      </a-entity>
      
      <!-- Wall right repeat: 4 200" -->
      <a-entity id="wall-right" class="boundry"
                :geometry="'primitive: plane; width:' + wallWidth + '; height: ' + wallHeight"
                material="color: #cee1ff; side: double; transparent: true; opacity: 0.5;"
                rotation="180 90 0"
                :position="hallWidth/2 + ' ' + wallHeight/2 + ' 0'">
      </a-entity>

      <!-- Carousel -->
      <gallery-carousel v-if="$store.state.objects.content.length > 0" />
      
      <!-- portals -->
        <a-entity class="portal-left"
                    layout="type: line; margin: 4"
                    rotation="0 90 0"
                    position="-3.8 1.5 16">

                <carouselLink v-for="room of roomsLeft"
                        :key="room"
                        :room="room"
                        rotation="0 180 0">
                </carouselLink>

        </a-entity>
      <a-entity class="portal-right"
                    layout="type: line; margin: 4"
                    rotation="0 270 0"
                    position="3.8 1.5 16">
                <carouselLink v-for="room of roomsRight"
                        :key="room"
                        :room="room"
                        rotation="180 0 180">
                </carouselLink>
        </a-entity> 


      <!-- Earth -->
      <a-sphere id="Earth" class="boundry"
                position="0 1.2 -4" radius=".99" 
                material="src:#earth; roughness: 1; transparent: true; opacity: 0.9;">
          <a-animation attribute="rotation"
                 easing="linear" 
                 dur="150000"
                 fill="forwards"
                 to="0 360 0"
                 repeat="indefinite"></a-animation>
      </a-sphere>

    <a-entity id="Logo" position="0 2.5 -4"
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


  </a-entity>
</template>

<script>
import galleryCarousel from "./carousel/gallery-carousel.vue";
import carouselLink from "./carousel/components/carousel-link.vue";

import Vue from 'vue';

var CONFIG = {};
CONFIG.DEBUG = true;

if (CONFIG.DEBUG) {console.log("from gallery.vue <script>")}
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
        galleryCarousel,
        carouselLink
    },
    
    computed: {
        sortedRooms() {
            var sorted = this.rooms;
            sorted.sort(function (a, b) {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            });
            return sorted;
        },
        roomsLeft() {
            return this.sortedRooms.slice(0, this.rooms.length/2);
        },
        roomsRight() {
            var reversed = this.sortedRooms.slice(this.rooms.length/2, this.rooms.length);
            reversed.reverse();
            return reversed;
        },
        aRoom() {
            if (CONFIG.DEBUG) {console.log(this.roomsRight[0]);};
            return this.roomsRight[0];
        }
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
        if (CONFIG.DEBUG) {console.log("gallery.vue :" + this.LSObjs);};

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
