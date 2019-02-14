<template>
    <a-entity class="carousel-item carousel-content-item" v-bind:id="content.id">
		<!-- background -->
		<a-entity 
				:geometry="'primitive: plane; width:' + carouselDim.backgroundWidth + '; height: ' + carouselDim.backgroundHeight"
				material="color: #3B3B3B; side: double; transparent: true; opacity: 0.4;"
				:position="(-carouselDim.backgroundWidth/4) + ' 0 -1'"
				:rotation="(-carouselDim.displayDegrees) + ' 0 0'">
		</a-entity>

		<!-- header -->
		<a-entity class="header"
			:position="'0 ' + verticleToSlanted(6*carouselDim.lineSeparation, carouselDim.displayDegrees) + ' -1.35'"
			:rotation="(-carouselDim.displayDegrees) + ' 0 0'">
			<!-- type -->
			<a-entity class="type"
					:position="'0 0 0'">
				<!-- <a-font-awesome :charcode="getContentTypeIcon(content.type)" color="blue" size="512"></a-font-awesome> -->
				<a-ionicon :icon="getIoniconFromFA(stripFontAwesome(getContentTypeIcon(content.type)))"
							:size="size * iconSize"
							textAlign="right"
							:position="(-carouselDim.columnWidth/2) + ' 0 0'"></a-ionicon>
                <a-entity :scale="textScale"
                  :text="this.textString(content.type)"/>
			</a-entity>
			<!-- Provider / Connection -->
			<a-entity v-if="connection.name !== undefined"
					class="provider"
					:position="'0 ' + (-carouselDim.lineSeparation) + ' 0'">
				<!-- <i v-bind:class="getProviderIcon(connection.provider)"></i> {{ connection.name | truncate(30) }} -->
				<a-ionicon :icon="getIoniconFromFA(stripFontAwesome(getProviderIcon(connection.name)))"
							:size="size * iconSize"
							textAlign="right"
							:position="(-carouselDim.columnWidth/2) + ' 0 0'"></a-ionicon>

				<a-entity :scale="textScale"
                  :text="this.textString(connection.name)"
				/>
			</a-entity>

		</a-entity>

		 <a-entity class="content-embed" 
		 	v-bind:data-id="content.id"
			:position="'0 ' + verticleToSlanted(-3*carouselDim.lineSeparation, carouselDim.displayDegrees) + ' -0.75'"
			:rotation="(-carouselDim.displayDegrees) + ' 0 0'">

			<!-- Audio -->
			<a-entity v-if="isAudio(content)">
				<a-ionicon 
							:icon="getIoniconFromFA(stripFontAwesome(getProviderIcon('fal fa-headphones')))"
							:size="size * iconSize"
							textAlign="right"
							:position="(-carouselDim.columnWidth/2) + ' 0 0'">
					</a-ionicon>
				<a-entity :scale="textScale"
                  :text="this.textString('Audio')"
				/>
			</a-entity>

			 <!-- Image -->
			 <a-entity v-if="isImage(content)">
				<a-entity 
					geometry="primitive: plane; width: 0.7"
					:material="this.imageMaterial"
					rotation="0 0 0"
					position="-0.175 0 0"
					src-fit="orientation: width; maxDimension: 0.7;">
				</a-entity>
			</a-entity>

			<!-- Video -->
			<a-entity v-if="isVideo(content)">
				<a-video
                :src="this.videoSrc"
                rotation="-30 0 0"
                position="0 0.4 0"
                width="0.7"
                src-fit>
                <!-- :play-gaze="'button: true; rig: video-rig-' + this.image.id + '; position: -1 -0.35 0;'"
                dynamic-autoplay="false"> -->
            </a-video>
				<a-entity :scale="textScale"
                  :text="this.textString('Video')"
				/>
			 </a-entity>

			<!-- iframe -->
			<a-entity v-if="isIframe(content)">
				<a-ionicon 
							:icon="getIoniconFromFA(stripFontAwesome(getProviderIcon('fal fa-code')))"
							:size="size * iconSize"
							textAlign="right"
							:position="(-carouselDim.columnWidth/2) + ' 0 0'">
					</a-ionicon>
				<a-entity :scale="textScale"
                  :text="this.textString('iFrame')"
				/>
			</a-entity>

			<!-- Email -->
			<a-entity v-if="isEmail(content)">
				<a-ionicon 
							:icon="getIoniconFromFA(stripFontAwesome(getProviderIcon('fal fa-envelope')))"
							:size="size * iconSize"
							textAlign="right"
							:position="(-carouselDim.columnWidth/2) + ' 0 -0.01'">
					</a-ionicon>
				<a-entity :scale="textScale"
                  :text="this.textString('Email')"
				  :position="'0 ' + verticleToSlanted(0 * carouselDim.lineSeparation, carouselDim.displayDegrees) + ' -0.0'"
				/>
			</a-entity>

		 </a-entity>

		<!-- content.embed_thumbnail -->
		<a-entity v-if="content.embed_thumbnail && !isImage(content) && !isVideo(content) && !isIframe(content)" class="thumbnail"
			:position="'0 ' + verticleToSlanted(4*carouselDim.lineSeparation, carouselDim.displayDegrees) + ' -1.35'"
			:rotation="(-carouselDim.displayDegrees) + ' 0 0'">
			<a-entity v-if="content.title == null"
				geometry="primitive: plane; width: 1; height: 1"
				:material="this.thumbnailMaterial"/>

			<!-- <a v-else :href="content.url" target="_blank">
				<img v-bind:src="content.embed_thumbnail"/>
			</a> -->
		</a-entity>

		<!-- title -->
		<!-- :position="'0 ' + (carouselDim.top - (3 * carouselDim.lineSeparation)) + ' 0'" -->
		<a-entity class="title"
			:position="'0 ' + verticleToSlanted(2*carouselDim.lineSeparation, carouselDim.displayDegrees) + ' -1.0'"
			:rotation="(-carouselDim.displayDegrees) + ' 0 0'">
			<!-- <a v-if="content.url != null" v-bind:href="content.url" target="_blank">{{ content.title | safe }}</a>
			<span v-else>{{ content.title | safe }}</span> -->
			<a-entity :scale="textScale"
                  :text="this.textString(content.title)"
			/>
		</a-entity>

		<!-- text -->
		<!-- content.text -->
		<!-- :position="'0 ' + (carouselDim.top - (4 * carouselDim.lineSeparation)) + ' 0'" -->
		<a-entity v-if="content.text != null"
			class="text"
			:position="'0 ' + verticleToSlanted(2*carouselDim.lineSeparation, carouselDim.displayDegrees) + ' -1.0'"
			:rotation="(-carouselDim.displayDegrees) + ' 0 0'">
			<a-entity :scale="textScale"
                  :text="this.textString(content.text)"/>
		</a-entity>

		<!-- url -->
		<!-- if no (title or text) but there is a url -->
		<a-entity v-if="(content.title == null || content.title.length === 0) &&
					(content.text == null || content.text.length === 0) &&
					content.url != null"
					class="title"
					:position="'0 ' + verticleToSlanted(2*carouselDim.lineSeparation, carouselDim.displayDegrees) + ' -1.0'"
					:rotation="(-carouselDim.displayDegrees) + ' 0 0'">
					<a-entity :scale="textScale"
                  		:text="this.textString(content.url)"/>
		</a-entity>

		<!-- tags -->
		<a-entity class="tagging"
			:position="'0 ' + (carouselDim.top - (5 * carouselDim.lineSeparation)) + ' 0'">
			<a-entity class="tags">
				<a-entity v-for="tag in content.tags"
					:key="tag"
					:scale="textScale"
					:text="tag">
				</a-entity>
			</a-entity>
		</a-entity>
	</a-entity>
</template>

<script>
var CONFIG = {};
CONFIG.DEBUG = false;

import icons from '../../../lib/util/icons';
import FAIonicon from '../../../lib/aframe/font-awesome-ionicons';

const audioTypes = ['mp3', 'ogga', 'wav'];
const imageTypes = ['png', 'jpg', 'jpeg', 'svg', 'tiff', 'bmp', 'webp'];
const videoTypes = ['mp4', 'oggv', 'webm'];

console.log("from objects/content.vue <script>")
export default {
	data () {
        return {
			size: 1,
			iconSize: 0.25,
        }
    },
	props: ['content', 'connection', 'carouselDim'],

	computed: {
        imageMaterial: function() {
            return 'src: ' + this.content.embed_content + '; side: double'
		},

		thumbnailMaterial: function() {
            return 'src: ' + this.content.embed_thumbnail + '; side: double'
		},

		videoSrc: function () {
            //console.log('src: ' + this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + this.image.route);
            return "https://s3.amazonaws.com/lifescope-static/test/content/video/VideoOfWomenModelling.mp4";//this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + this.image.route;
        },
		
		textScale: function() {
			return (0.5*this.size) + ' ' + (0.5*this.size) + ' ' + (0.25*this.size);
		}
    },

    methods: {
		// Text
        textString: function(value) {
            return 'width: 1.5; color: white; value: ' + value
		},

		// Icon
		getContentTypeIcon: function(type) {
			return icons('content', type);
		},
		getProviderIcon: function(provider) {
				return icons('provider', provider.name);
		},
		stripFontAwesome(type) {
			//console.log(`stripFontAwesome(${type})`)
			var regex=/fa\-[a-zA-Z\-]+/i;
			return type.match(regex)[0];
		},
		getIoniconFromFA: function(icon) {
			//console.log(`getIoniconFromFA(${icon})`)
			//console.log(`FAIonicon[${icon}] == ${FAIonicon[icon]}`)
			return FAIonicon[icon];
		},

		// Type check
		isAudio: function(item) {
			var truth = audioTypes.indexOf(item.embed_format.toLowerCase()) > -1;
			if (CONFIG.DEBUG & truth) {
				console.log("isAudio");
				console.log(item.embed_format);
				}
			else if (CONFIG.DEBUG){
				console.log("not audio");
				console.log(item.embed_format);
			};
			return truth;
		},
		isEmail: function(item) {
			var truth = item.embed_format.toLowerCase() === 'email';
			if (CONFIG.DEBUG & truth) {
				console.log("isEmail");
				console.log(item.embed_format);
				};
			return truth;
		},
		isIframe: function(item) {
			var truth = item.embed_format.toLowerCase() === 'iframe';
			if (CONFIG.DEBUG & truth) {
				console.log("isIframe");
				console.log(item.embed_format);
				};
			return truth;
		},
		isImage: function(item) {
			var truth = imageTypes.indexOf(item.embed_format.toLowerCase()) > -1;
			if (CONFIG.DEBUG & truth) {
				console.log("isImage");
				console.log(item.embed_format);
				};
			return truth;
		},
		isVideo: function(item) {
			var truth = videoTypes.indexOf(item.embed_format.toLowerCase()) > -1;
			if (CONFIG.DEBUG & truth) {
				console.log("isVideo");
				console.log(item.embed_format);};
			return truth;
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
    }
  }
</script>
