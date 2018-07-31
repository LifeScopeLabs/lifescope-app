<template>
    <a-entity class="carousel-item carousel-content-item" v-bind:id="content.id">
		<!-- header -->
		<a-entity class="header"
			:position="'0 ' + top + ' 0'">
			<!-- type -->
			<a-entity class="type">
				<!-- <a-font-awesome :charcode="getContentTypeIcon(content.type)" color="blue" size="512"></a-font-awesome> -->
				<a-ionicon :icon="getIoniconFromFA(stripFontAwesome(getContentTypeIcon(content.type)))"
							:size="size * iconSize"></a-ionicon>
                <a-entity :scale="textScale"
                  :text="this.textString(content.type)"/>
			</a-entity>
			<!-- Provider / Connection -->
			<a-entity v-if="connection.name !== undefined"
					class="provider"
					:position="'0 ' + (-lineSeparation) + ' 0'">
				<!-- <i v-bind:class="getProviderIcon(connection.provider)"></i> {{ connection.name | truncate(30) }} -->
				<a-ionicon :icon="getIoniconFromFA(stripFontAwesome(getProviderIcon(connection.name)))"
							:size="size * iconSize"></a-ionicon>

				<a-entity :scale="textScale"
                  :text="this.textString(connection.name)"
				/>
			</a-entity>

		</a-entity>

		<!-- audio/image/video/email/iframe/-->
		 <a-entity class="content-embed" data-type="content" v-bind:data-id="content.id">
		 	<!-- <audio v-if="isAudio(content)"controls v-bind:style="{ width: getWidth, height: getHeight }"><source v-bind:src="content.embed_content" v-bind:type="getAudioType(content.embed_format)"></audio> -->
		 	<!-- <img v-if="isImage(content)" v-bind:src="content.embed_content" v-bind:alt="content.title"/> -->
			 <!-- <a-entity
				geometry="primitive: plane; width: 3; height: 2"
				:material="this.imageMaterial"
				rotation="0 0 0"
				position="0 1 0">
			</a-entity> -->
		 	<!-- <video v-if="isVideo(content)" v-bind:width="getWidth" v-bind:height="getHeight" controls><source v-bind:src="content.embed_content" v-bind:type="getVideoType(content.embed_format)"></video>
		 	<iframe v-if="isEmail(content)" frameBorder="0" v-bind:width="getWidth()" v-bind:height="getHeight()" v-on:load="renderEmailIframe(content)" v-bind:name="content.id"></iframe>
		 	<div v-if="isIframe(content)"><span v-html="content.embed_content"></span></div> -->
		 </a-entity>

		<!-- content.embed_thumbnail for non-Image/Video/Iframe-->
		<!-- <div v-if="content.embed_thumbnail && !isImage(content) && !isVideo(content) && !isIframe(content)" class="thumbnail">
			<img v-if="content.title == null" v-bind:src="content.embed_thumbnail"/>

			<a v-else v-bind:href="content.url" target="_blank">
				<img v-bind:src="content.embed_thumbnail"/>
			</a>
		</div> -->

		<!-- url link -->
		<a-entity class="title"
			:position="'0 ' + (top - (3 * lineSeparation)) + ' 0'">
			<!-- <a v-if="content.url != null" v-bind:href="content.url" target="_blank">{{ content.title | safe }}</a>
			<span v-else>{{ content.title | safe }}</span> -->
			<a-entity :scale="textScale"
                  :text="this.textString(content.title)"
			/>
		</a-entity>

		<!-- contet.text -->
		<a-entity v-if="content.text != null"
			class="text"
			:position="'0 ' + (top - (4 * lineSeparation)) + ' 0'">
			<!--{% if text_truncated %}-->
				<!--<a v-if="content.url && content.title == null" class="truncated" href="{{ url }}" target="_blank">{{ text_truncated | safe }}</a>-->
			<!--{% endif %}-->
			<!-- <a v-if="content.url && content.title == null" class="full" v-bind:href="content.url" target="_blank">{{ content.text | safe }}</a> -->

			<a-entity :scale="textScale"
                  :text="this.textString(content.text)"/>
                   <!-- position="0 -.8 0"/> -->
			<!--{% if text_truncated %}-->
				<!--<pre class="truncated">{{ text_truncated | safe }}</pre>-->
			<!--{% endif %}-->
			<!-- <pre v-else class="full">{{ content.text | safe }}</pre> -->
				<!--<div class="expand">More</div>-->
		</a-entity>

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
import icons from '../../../../../../lib/util/icons';
import FAIonicon from '../../util/font-awesome-ionicons';

console.log("from objects/content.vue <script>")
export default {
	data () {
        return {
			size: 1,
			iconSize: 0.25,
			top: 1.25,
			lineSeparation: 0.25
        }
    },
	props: ['content', 'connection'],

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
