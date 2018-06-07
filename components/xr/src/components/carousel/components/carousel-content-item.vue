<template>
    <!-- <a-entity class="carousel-item carousel-content-item">
        <a-entity scale="2 2 1"
                  :text="this.textString(obj.title)"
                  position="0 -.2 0"/>
        <a-entity scale="2 2 1"
                  :text="this.textString('type: ' + obj.type)"
                  position="0 -.4 0"/>
        <a-entity scale="2 2 1"
                  :text="this.textString('url: ' + obj.url)"
                   position="0 -.6 0"/>
    </a-entity> -->
    <a-entity class="carousel-item carousel-content-item" v-bind:id="obj.id">
		<a-entity class="header">
			<a-entity class="type">
				<i v-bind:class="getContentTypeIcon(obj.type)"></i>
                <a-entity
                    geometry="primitive: plane; width: 3; height: 2"
                    :material="this.imageMaterial"
                    rotation="0 0 0"
                    position="0 1 0">
                </a-entity>
                <a-entity scale="2 2 1"
                  :text="this.textString(obj.type)"
                   position="0 -.6 0"/>
			</a-entity>

			<div class="provider">
				<i v-bind:class="getProviderIcon(connection.provider)"></i> {{ connection.name | truncate(30) }}
			</div>

			<aside class="action-bar" v-on:click="openActionModal(content, 'content')">
				<span>Tag</span><i class="fa fa-hashtag"></i>
				<span>Share</span><i class="fa fa-share"></i>
			</aside>
		</a-entity>

		<div class="content-embed" data-type="content" v-bind:data-id="content.id">
      <audio v-if="isAudio(content)"controls v-bind:style="{ width: getWidth, height: getHeight }"><source v-bind:src="content.embed_content" v-bind:type="getAudioType(content.embed_format)"></audio>
      <img v-if="isImage(content)" v-bind:src="content.embed_content" v-bind:alt="content.title"/>
      <video v-if="isVideo(content)" v-bind:width="getWidth" v-bind:height="getHeight" controls><source v-bind:src="content.embed_content" v-bind:type="getVideoType(content.embed_format)"></video>
      <iframe v-if="isEmail(content)" frameBorder="0" v-bind:width="getWidth()" v-bind:height="getHeight()" v-on:load="renderEmailIframe(content)" v-bind:name="content.id"></iframe>
      <div v-if="isIframe(content)"><span v-html="content.embed_content"></span></div>
    </div>

		<div v-if="content.embed_thumbnail && !isImage(content) && !isVideo(content) && !isIframe(content)" class="thumbnail">
			<img v-if="content.title == null" v-bind:src="content.embed_thumbnail"/>

			<a v-else v-bind:href="content.url" target="_blank">
				<img v-bind:src="content.embed_thumbnail"/>
			</a>
		</div>

		<div class="title">
			<a v-if="content.url != null" v-bind:href="content.url" target="_blank">{{ content.title | safe }}</a>
			<span v-else>{{ content.title | safe }}</span>
		</div>

		<div v-if="content.text != null" class="text">
		<!--{% if text_truncated %}-->
			<!--<a v-if="content.url && content.title == null" class="truncated" href="{{ url }}" target="_blank">{{ text_truncated | safe }}</a>-->
		<!--{% endif %}-->
		<a v-if="content.url && content.title == null" class="full" v-bind:href="content.url" target="_blank">{{ content.text | safe }}</a>

		<!--{% if text_truncated %}-->
			<!--<pre class="truncated">{{ text_truncated | safe }}</pre>-->
		<!--{% endif %}-->
		<pre v-else class="full">{{ content.text | safe }}</pre>
			<!--<div class="expand">More</div>-->
		</div>

		<div class="tagging">
			<div class="tags">
				<span v-for="tag in content.tags">#{{ tag }}</span>
			</div>
		</div>
	</a-entity>
</template>

<script>
console.log("from carousel-item.vue <script>")
export default {
    props: ['obj'],

    methods: {
        textString: function (value) {
            return 'width: 1.5; color: white; value: ' + value
        }
    },

    mounted () {
        //console.log(this.obj.id)
    }
  }
</script>
