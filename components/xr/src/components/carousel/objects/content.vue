<template>
    <a-entity class="carousel-item carousel-content-item" v-bind:id="content.id">
		<!-- header -->
		<a-entity class="header"
			:position="'0 ' + top + ' 0'">
			<!-- type -->
			<a-entity class="type"
					:position="'0 0 0'">
				<!-- <a-font-awesome :charcode="getContentTypeIcon(content.type)" color="blue" size="512"></a-font-awesome> -->
				<a-ionicon :icon="getIoniconFromFA(stripFontAwesome(getContentTypeIcon(content.type)))"
							:size="size * iconSize"
							textAlign="right"
							:position="(-columnWidth/2) + ' 0 0'"></a-ionicon>
                <a-entity :scale="textScale"
                  :text="this.textString(content.type)"/>
			</a-entity>
			<!-- Provider / Connection -->
			<a-entity v-if="connection.name !== undefined"
					class="provider"
					:position="(1*layoutMargin/6) + ' 0 0'">
				<!-- <i v-bind:class="getProviderIcon(connection.provider)"></i> {{ connection.name | truncate(30) }} -->
				<a-ionicon :icon="getIoniconFromFA(stripFontAwesome(getProviderIcon(connection.name)))"
							:size="size * iconSize"
							textAlign="right"
							:position="(-columnWidth/2) + ' 0 0'"></a-ionicon>

				<a-entity :scale="textScale"
                  :text="this.textString(connection.name)"
				/>
			</a-entity>

			<!-- tag-->
			<!-- <a-entity class="action-bar"
				:position="(2*layoutMargin/6) + ' 0 0'">
				<a-entity :scale="textScale"
                  :text="this.textString('Tag')"
				/>
				<a-ionicon :icon="getIoniconFromFA(stripFontAwesome(getProviderIcon('fa fa-hashtag')))"
							:size="size * iconSize"
							textAlign="right"
							:position="(-columnWidth/2) + ' 0 0'"></a-ionicon>
				
			</a-entity> -->
			<!--<span>Share</span><i class="fa fa-share"></i>-->

		</a-entity>

		<!-- embed content -->
		<!-- audio/image/video/email/iframe/-->
		 <a-entity class="content-embed" 
		 	v-bind:data-id="content.id"
			:position="'0 ' + (top-2*lineSeparation) + ' 0'">

			<!-- Audio -->
			<a-entity v-if="isAudio(content)">
				<a-ionicon 
							:icon="getIoniconFromFA(stripFontAwesome(getProviderIcon('fa fa-headphones')))"
							:size="size * iconSize"
							textAlign="right"
							:position="(-columnWidth/2) + ' 0 0'">
					</a-ionicon>
				<a-entity :scale="textScale"
                  :text="this.textString('Audio')"
				/>
			</a-entity>

			 <!-- Image -->
			 <a-entity v-if="isImage(content)">
				<a-entity 
					geometry="primitive: plane; width: 3; height: 2"
					:material="this.imageMaterial"
					rotation="0 0 0"
					position="0 1 0">
				</a-entity>
			</a-entity>

			<!-- Video -->
			<a-entity v-if="isVideo(content)">
				<a-ionicon 
							:icon="getIoniconFromFA(stripFontAwesome(getProviderIcon('fa fa-video')))"
							:size="size * iconSize"
							textAlign="right"
							:position="(-columnWidth/2) + ' 0 0'">
					</a-ionicon>
				<a-entity :scale="textScale"
                  :text="this.textString('Video')"
				/>
			 </a-entity>

			<!-- iframe -->
			<a-entity v-if="isIframe(content)">
				<a-ionicon 
							:icon="getIoniconFromFA(stripFontAwesome(getProviderIcon('fa fa-code')))"
							:size="size * iconSize"
							textAlign="right"
							:position="(-columnWidth/2) + ' 0 0'">
					</a-ionicon>
				<a-entity :scale="textScale"
                  :text="this.textString('iFrame')"
				/>
			</a-entity>

			<!-- Email -->
			<a-entity v-if="isEmail(content)">
				<a-ionicon 
							:icon="getIoniconFromFA(stripFontAwesome(getProviderIcon('fa fa-envelope')))"
							:size="size * iconSize"
							textAlign="right"
							:position="(-columnWidth/2) + ' 0 0'">
					</a-ionicon>
				<a-entity :scale="textScale"
                  :text="this.textString('Email')"
				/>
			</a-entity>

		 </a-entity>

		<!-- content.embed_thumbnail -->
		<a-entity v-if="content.embed_thumbnail && !isImage(content) && !isVideo(content) && !isIframe(content)" class="thumbnail"
			:position="'0 ' + (top - (3 * lineSeparation)) + ' 0'">
			<a-entity v-if="content.title == null"
				geometry="primitive: plane; width: 1; height: 1"
				:material="this.thumbnailMaterial"/>

			<!-- <a v-else :href="content.url" target="_blank">
				<img v-bind:src="content.embed_thumbnail"/>
			</a> -->
		</a-entity>

		<!-- title -->
		<a-entity class="title"
			:position="'0 ' + (top - (4 * lineSeparation)) + ' 0'">
			<!-- <a v-if="content.url != null" v-bind:href="content.url" target="_blank">{{ content.title | safe }}</a>
			<span v-else>{{ content.title | safe }}</span> -->
			<a-entity :scale="textScale"
                  :text="this.textString(content.title)"
			/>
		</a-entity>

		<!-- text -->
		<!-- content.text -->
		<a-entity v-if="content.text != null"
			class="text"
			:position="'0 ' + (top - (5 * lineSeparation)) + ' 0'">
			<a-entity :scale="textScale"
                  :text="this.textString(content.text)"/>
		</a-entity>

		<!-- url -->
		<!-- if no (title or text) but there is a url -->
		<a-entity v-if="(content.title == null || content.title.length === 0) &&
					(content.text == null || content.text.length === 0) &&
					content.url != null"
					class="title"
					:position="'0 ' + (top - (5 * lineSeparation)) + ' 0'">
					<a-entity :scale="textScale"
                  		:text="this.textString(content.url)"/>
		</a-entity>

		<!-- tags -->
		<a-entity class="tagging"
			:position="'0 ' + (top - (5 * lineSeparation)) + ' 0'">
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
CONFIG.DEBUG = true;

import icons from '../../../../../../lib/util/icons';
import FAIonicon from '../../util/font-awesome-ionicons';

const audioTypes = ['mp3', 'ogga', 'wav'];
const imageTypes = ['png', 'jpg', 'jpeg', 'svg', 'tiff', 'bmp', 'webp'];
const videoTypes = ['mp4', 'oggv', 'webm'];

console.log("from objects/content.vue <script>")
export default {
	data () {
        return {
			size: 1,
			iconSize: 0.25,
			top: 1.5,
			lineSeparation: 0.25,
			layoutMargin: 3, // TODO : use layoutMargin from explorer
			columnWidth: 1,
			iconOffset: 1.5
        }
    },
	props: ['content', 'connection'],

	computed: {
        imageMaterial: function() {
            return 'src: #image-' + this.content.id + '; side: double'
		},

		thumbnailMaterial: function() {
            return 'src: ' + this.content.embed_thumbnail + '; side: double'
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
			else {
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

    },

    mounted () {
        //console.log(this.content.id)
    }
  }
</script>
