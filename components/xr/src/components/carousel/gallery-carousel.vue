<template>
    <a-entity class="gallery-carousel">
        <!-- Carousel left -->
        <a-entity class="gallery-carousel-left"
                        layout="type: line; margin: 4"
                        rotation="0 90 0"
                        position="-3.8 1 0">
                <carouselContent v-for="con of  $store.state.objects.content.slice(0, $store.state.objects.content.length/2)"
                    :key="con.id"
                    :content="con"
                    :connection="con.connection"
                    rotation="0 0 0">
                </carouselContent>
                <!-- <carouselExplorer/> -->

        </a-entity>
        <!-- Carousel right -->
        <a-entity class="gallery-carousel-right"
                    layout="type: line; margin: 4"
                    rotation="0 90 0"
                    position="3.8 1 0">
                <carouselContent v-for="con of $store.state.objects.content.slice($store.state.objects.content.length/2, $store.state.objects.content.length)"
                            :key="con.id"
                            :content="con"
                            :connection="con.connection"
                            rotation="180 0 180">
                </carouselContent>
        </a-entity> 
    </a-entity>
</template>

<script>

import carouselItem from "./components/carousel-item.vue";
import carouselContent from "./components/carousel-content-item.vue";
import carouselExplorer from "./carousel-explorer.vue";

import Vue from 'vue';

var CONFIG = {};
CONFIG.DEBUG = false;

console.log("from carousel.vue <script>");
export default {
    // data () {
    //     return {
    //         LSObjs: this.$store.state.objects.content
    //     }
    // },
    components: {
        carouselItem,
        carouselContent,
        carouselExplorer
    },
    mounted () {
        //debugger;
    }
  }
</script>
