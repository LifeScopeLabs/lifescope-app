<template>
    <a-entity class="gallery-carousel">
        <!-- Carousel left -->
        <a-entity class="gallery-carousel-left"
                        layout="type: line; margin: 4"
                        rotation="0 90 0"
                        position="-3.8 1 0">
                <carouselItem v-for="wimage of $store.state.objects.content.slice(0, $store.state.objects.content.length/2)"
                            :key="wimage.id"
                            :obj='wimage'
                            rotation="0 0 0">
                </carouselItem>
        </a-entity>
        <!-- Carousel right -->
        <a-entity class="gallery-carousel-right"
                    layout="type: line; margin: 4"
                    rotation="0 90 0"
                    position="3.8 1 0">
                <carouselItem v-for="wimage of $store.state.objects.content.slice($store.state.objects.content.length/2, $store.state.objects.content.length)"
                            :key="wimage.id"
                            :obj='wimage'
                            rotation="180 0 180">
                </carouselItem>
        </a-entity> 
    </a-entity>
</template>

<script>

import carouselItem from "./components/carousel-item.vue"

import Vue from 'vue'

console.log("from carousel.vue <script>")
export default {
    // data () {
    //     return {
    //         LSObjs: this.$store.state.objects.content
    //     }
    // },
    components: {
        carouselItem
    },
    mounted () {
        //debugger;
    }
  }
</script>
