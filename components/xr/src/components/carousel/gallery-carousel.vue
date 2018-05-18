<template>
    <a-entity class="gallery-carousel">
        <!-- Carousel left -->
        <a-entity class="gallery-carousel-left"
                        layout="type: line; margin: 4"
                        rotation="0 90 0"
                        position="-3.8 1 0">
                <carouselItem v-for="wimage of LSObjs.slice(0, LSObjs.length/2)"
                            :key="wimage.id"
                            :image='wimage'
                            rotation="0 0 0">
                </carouselItem>
        </a-entity>
        <!-- Carousel right -->
        <a-entity class="gallery-carousel-right"
                    layout="type: line; margin: 4"
                    rotation="0 90 0"
                    position="3.8 1 0">
                <carouselItem v-for="wimage of LSObjs.slice(LSObjs.length/2, LSObjs.length)"
                            :key="wimage.id"
                            :image='wimage'
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
    props: {'LSObjs': {
            default: []}
    },
    components: {
        carouselItem
    }
  }
</script>
