<template>
    <a-entity class="carousel-item carousel-content-item">
         <a-video
            src="../../../video/VideoOfWomenModelling.mp4"
            rotation="0 0 0"
            position="0 1 0">
        </a-video>
    </a-entity>

        <!-- <a-entity scale="2 2 1"
                  :text="this.textString(image.name)"
                  position="0 -.2 0"/>
    </a-entity> -->
    
</template>

<script>
var CONFIG = {};
CONFIG.DEBUG = false;

if (CONFIG.DEBUG) {console.log("from carousel-item.vue <script>")}
export default {

    computed: {
        imageMaterial: function () {
            return 'src: ' + this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + this.image.route;
        }
    },

    methods: {
        textString: function (value) {
            return 'width: 1.5; color: white; value: ' + value
        }
    }
  }
</script>
