<template>
	<a-entity class="object contact" v-bind:id="contact.id">
		<!-- Contact -->
		<a-entity :position="'0 ' + top + ' 0'">
			<!-- Avatar -->
			<a-entity class="user-avatar">
				<!-- <img v-if="contact.avatar_url" class="avatar" v-bind:src="contact.avatar_url" /> -->
				<!-- <i v-else class="fa fa-user"></i> -->
				<a-ionicon :icon="getIoniconFromFA(stripFontAwesome(getContentTypeIcon('fa-user')))"
					:size="size * iconSize"></a-ionicon>
			</a-entity>

			<!-- details -->
			<a-entity class="details" 
				:position="'0 ' + (-lineSeparation) + ' 0'">
				<!-- Name -->
				<a-entity v-if="contact.name"
					:scale="textScale"
                  	:text="this.textString( contact.name )">
				</a-entity>
				<!-- Handle -->
				<a-entity v-if="contact.handle"
					:position="'0 ' + (-lineSeparation) + ' 0'"
					:scale="textScale"
                  	:text="this.textString( contact.handle )">
				</a-entity>
			</a-entity>
		</a-entity>
		<!-- tags -->
		<a-entity class="tagging"
			:position="'0 ' + (top -( 3 * lineSeparation)) + ' 0'">
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
import icons from '../../../../../../lib/util/icons';
import FAIonicon from '../../util/font-awesome-ionicons';

console.log("from objects/contact.vue <script>")
export default {
	data () {
        return {
			size: 1,
			iconSize: 0.25,
			top: 1,
			lineSeparation: 0.25
        }
	},

	props: ['contact', 'connection'],

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
		}
    },

    mounted () {
        //console.log(this.content.id)
    }
  }
</script>
