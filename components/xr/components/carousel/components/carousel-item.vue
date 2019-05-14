
<template>
    <a-entity class="carousel-item carousel-content-item">

        <!-- background -->
		<!-- <a-entity 
				:id="'background-' + image.id"
				:geometry="'primitive: plane; width:' + carouselDim.backgroundWidth + '; height: ' + carouselDim.backgroundHeight"
				material="color: #3B3B3B; side: double; transparent: true; opacity: 0.4;"
				:position="(-carouselDim.backgroundWidth/4) + ' 0 -1'"
				:rotation="(-carouselDim.displayDegrees) + ' 0 0'">
		</a-entity> -->
        
        <a-entity v-if="this.image.type === 'image'"
            geometry="primitive: plane; width: 0.7;"
            :rotation="(-carouselDim.displayDegrees) + ' 0 0'"
            position="0 0.4 0"
            :material="this.imageMaterial"
            src-fit="orientation: width; maxDimension: 0.7;"
            >
        </a-entity>

        <a-entity v-if="this.image.name != null"
			class="text"
			:position="'0.4 ' + verticleToSlanted(1*carouselDim.lineSeparation, carouselDim.displayDegrees) + ' 0.2'"
			:rotation="(-carouselDim.displayDegrees) + ' 0 0'">
			<a-entity :scale="textScale"
                  :text="this.textString(image.name.substring(0, carouselDim.truncateText))"/>
		</a-entity>

        <a-entity v-else-if="this.image.type === 'video'"
            :id="'video-rig-' + this.image.id">
            <a-video
                :src="this.videoSrc"
                :rotation="(-carouselDim.displayDegrees) + ' 0 0'"
                position="0 0.4 0"
                width="0.7"
                src-fit
                :play-gaze="'button: true; rig: video-rig-' + this.image.id + '; position: -1 -0.35 0;'"
                dynamic-autoplay="false">
            </a-video>

        </a-entity>
    </a-entity>

    
</template>

<script>


// if (CONFIG.DEBUG) {console.log("from carousel-item.vue <script>")}
export default {
    data () {
        return {
			size: 1,
        }
    },
    
    props: ['image', 'roomConfig', 'carouselDim'],

    computed: {
        imageMaterial: function () {
            //console.log('src: ' + this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + this.image.route);
            return 'src: ' + this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + this.image.route;
        },
        videoSrc: function () {
            //console.log('src: ' + this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + this.image.route);
            return this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + this.image.route;
        },

        textScale: function() {
			return (0.5*this.size) + ' ' + (0.5*this.size) + ' ' + (0.25*this.size);
		}
    },

    methods: {
        textString: function (value) {
            return 'width: 1.5; color: white; value: ' + value
        },

        // Layout
		verticleToSlanted: function(len, degrees) {
			// console.log("verticleToSlanted")
			function toRadians (angle) {
				// console.log(`${angle} degrees is ${angle * (Math.PI / 180)} radians`)
				return angle * (Math.PI / 180);
			}
			// console.log(`Math.sin(toRadians(${degrees}): ${Math.sin(toRadians(degrees))}`)
			return len * Math.sin(toRadians(degrees));
		},
    },

    mounted () {
        //console.log("item mounted");
        //console.log(this.image);
        //console.log(this.image.id);
        //console.log(this.image.name);
        //console.log(this.image.route);
        // if (this.image.type === 'video'){
            // console.log(this.image);
        // }
        // console.log(this.image.type);
        // console.log(this.image.type === 'image');
        // console.log(this.image.type === 'video');
    }
  }
</script>
