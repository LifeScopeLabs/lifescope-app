<template>
	<a-entity class="object contact" v-bind:id="contact.id">

		<!-- background -->
		<a-entity 
				:geometry="'primitive: plane; width:' + carouselDim.backgroundWidth + '; height: ' + carouselDim.backgroundHeight"
				material="color: #3B3B3B; side: double; transparent: true; opacity: 0.4;"
				:position="(-carouselDim.backgroundWidth/4) + ' 0 -1'"
				:rotation="(-carouselDim.displayDegrees) + ' 0 0'">
		</a-entity>

		<!-- Contact -->
		<a-entity
			:position="'0 ' + verticleToSlanted(6*carouselDim.lineSeparation, carouselDim.displayDegrees) + ' -1.35'"
			:rotation="(-carouselDim.displayDegrees) + ' 0 0'">
			<!-- Avatar -->
			<a-entity class="user-avatar">
				<!-- TODO : use avatar_url -->
				<!-- <img v-if="contact.avatar_url" class="avatar" v-bind:src="contact.avatar_url" /> -->
				<!-- <i v-else class="fal fa-user"></i> -->
				<a-ionicon :icon="getIoniconFromFA(stripFontAwesome(getContentTypeIcon('fa-user')))"
					:size="size * iconSize"
					textAlign="right"
					:position="(-carouselDim.iconOffset) + ' 0 0'"></a-ionicon>
			</a-entity>

			<!-- details -->
			<a-entity class="details" 
				:position="'0 0 0'">
				<!-- Name -->
				<a-entity v-if="contact.name"
					:scale="textScale"
                  	:text="this.textString( contact.name )">
				</a-entity>
				<!-- Handle -->
				<a-entity v-if="contact.handle"
					:position="'0 ' + (-carouselDim.lineSeparation) + ' 0'"
					:scale="textScale"
                  	:text="this.textString( contact.handle )">
				</a-entity>
			</a-entity>
		</a-entity>
		<!-- tags -->
		<a-entity class="tagging"
			:position="'0 ' + (carouselDim.top -( 3 * carouselDim.lineSeparation)) + ' 0'">
			<a-entity class="tags">
				<a-entity v-for="tag in contact.tags"
					:key="tag"
					:scale="textScale"
					:text="tag">
				</a-entity>
			</a-entity>
		</a-entity>
	</a-entity>
</template>

<script>
import icons from '../../../lib/util/icons';
import FAIonicon from '../../../lib/aframe/font-awesome-ionicons';

console.log("from objects/contact.vue <script>")
export default {
	data () {
        return {
			size: 1,
			iconSize: 0.25,
        }
	},

	props: ['contact', 'connection', 'carouselDim'],

	computed: {
        imageMaterial: function() {
            return 'src: #image-' + this.content.id + '; side: double'
        },
		textScale: function() {
			return (0.5*this.size) + ' ' + (0.5*this.size) + ' ' + (0.25*this.size);
		}
    },

    methods: {
        textString: function(value) {
            return 'width: 1.5; color: white; value: ' + value
		},
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

		horizontalToSlanted: function(len, degrees) {
			// console.log("horizontalToSlanted");
			function toRadians (angle) {
				// console.log(`${angle} degrees is ${angle * (Math.PI / 180)} radians`);
				return angle * (Math.PI / 180);
			}
			// console.log(`Math.cos(toRadians(${degrees}): ${Math.cos(toRadians(degrees))}`)
			return len * Math.cos(toRadians(degrees));
		}
    },

    mounted () {
        //console.log(this.content.id)
    }
  }
</script>
