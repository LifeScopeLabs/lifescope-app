<template>
    <a-entity class="carousel-item carousel-content-item" v-bind:id="content.id">
		<a-entity class="header">
			<a-entity class="type">
				<!-- <i v-bind:class="getContentTypeIcon(content.type)"></i> -->
                <!-- <a-entity
                    geometry="primitive: plane; width: 3; height: 2"
                    :material="this.imageMaterial"
                    rotation="0 0 0"
                    position="0 1 0">
                </a-entity> -->
                <a-entity scale="2 2 1"
                  :text="this.textString(content.type)"
                   position="0 -.2 0"/>
			</a-entity>

			<a-entity v-if="connection.name !== undefined" class="provider">
				<!-- <i v-bind:class="getProviderIcon(connection.provider)"></i> {{ connection.name | truncate(30) }} -->
				<a-entity scale="2 2 1"
                  :text="this.textString(connection.name)"
                   position="0 -.4 0"/>
			</a-entity>

		</a-entity>

		<!-- audio/image/video/email/iframe/-->
		 <a-entity class="content-embed" data-type="content" v-bind:data-id="content.id">
		 	<!-- <audio v-if="isAudio(content)"controls v-bind:style="{ width: getWidth, height: getHeight }"><source v-bind:src="content.embed_content" v-bind:type="getAudioType(content.embed_format)"></audio> -->
		 	<!-- <img v-if="isImage(content)" v-bind:src="content.embed_content" v-bind:alt="content.title"/> -->
			 <a-entity
				geometry="primitive: plane; width: 3; height: 2"
				:material="this.imageMaterial"
				rotation="0 0 0"
				position="0 1 0">
			</a-entity>
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
		<a-entity class="title">
			<!-- <a v-if="content.url != null" v-bind:href="content.url" target="_blank">{{ content.title | safe }}</a>
			<span v-else>{{ content.title | safe }}</span> -->
			<a-entity scale="2 2 1"
                  :text="this.textString(content.title)"
                   position="0 -.6 0"/>
		</a-entity>

		<!-- contet.text -->
		<a-entity v-if="content.text != null" class="text">
			<!--{% if text_truncated %}-->
				<!--<a v-if="content.url && content.title == null" class="truncated" href="{{ url }}" target="_blank">{{ text_truncated | safe }}</a>-->
			<!--{% endif %}-->
			<!-- <a v-if="content.url && content.title == null" class="full" v-bind:href="content.url" target="_blank">{{ content.text | safe }}</a> -->

			<a-entity scale="2 2 1"
                  :text="this.textString(content.text)"
                   position="0 -.8 0"/>
			<!--{% if text_truncated %}-->
				<!--<pre class="truncated">{{ text_truncated | safe }}</pre>-->
			<!--{% endif %}-->
			<!-- <pre v-else class="full">{{ content.text | safe }}</pre> -->
				<!--<div class="expand">More</div>-->
		</a-entity>

		<a-entity class="tagging">
			<a-entity class="tags">
				<a-entity v-for="tag in content.tags"
					:key="tag"
					scale="2 2 1"
					:text="tag">
				</a-entity>
			</a-entity>
		</a-entity>
	</a-entity>
</template>

<script>
console.log("from carousel-item.vue <script>")
export default {
	props: ['content', 'connection'],

	computed: {
        imageMaterial: function() {
            return 'src: #image-' + this.content.id + '; side: double'
        }
    },

    methods: {
        textString: function(value) {
            return 'width: 1.5; color: white; value: ' + value
        }
    },

    mounted () {
        //console.log(this.content.id)
    }
  }
</script>
