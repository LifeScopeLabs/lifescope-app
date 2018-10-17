<template>
	<div class="object content" v-bind:id="content.id">
    <!-- header -->
		<div class="header">
      <!-- type -->
			<div class="type">
				<i v-bind:class="getContentTypeIcon(content.type)"></i>
				{{ content.type }}
			</div>

      <!-- provider -->
			<div class="provider">
				<i v-bind:class="getProviderIcon(connection.provider)"></i> {{ connection.name | truncate(30) }}
			</div>

      <!-- tags -->
			<aside class="action-bar" v-on:click="openActionModal(content, 'content')">
				<span>Tag</span><i class="fas fa-hashtag"></i>
				<!--<span>Share</span><i class="fas fa-share"></i>-->
			</aside>
		</div>

    <!-- embed content -->
		<div class="content-embed"
        data-type="content"
        v-bind:data-id="content.id">
      <audio v-if="isAudio(content)"
            controls v-observe-visibility="{ callback: visbilityChanged, throttle: 500 }" v-bind:style="{ width: getWidth, height: getHeight }">
            <source v-bind:src="content.embed_content"
                    v-bind:type="getAudioType(content.embed_format)">
        </audio>
      <img v-if="isImage(content)"
          v-observe-visibility="{ callback: visbilityChanged, throttle: 500 }" v-bind:src="content.embed_content" v-bind:alt="content.title"
        />
      <video v-if="isVideo(content)"
          v-observe-visibility="{ callback: visbilityChanged, throttle: 500 }"
          v-bind:width="getWidth" v-bind:height="getHeight"
          controls>
          <source v-bind:src="content.embed_content"
                  v-bind:type="getVideoType(content.embed_format)">
        </video>
      <iframe v-if="isEmail(content)"
              v-observe-visibility="{ callback: visbilityChanged, throttle: 500 }" frameBorder="0" v-bind:width="getWidth()"
              v-bind:height="getHeight()"
              v-on:load="renderEmailIframe(content)"
              v-bind:name="content.id"></iframe>
      <span v-if="isIframe(content)"
            class="iframe-wrapper"
          v-observe-visibility="{ callback: visbilityChanged, throttle: 500 }"
            v-html="content.embed_content">
        </span>
    </div>

    <!-- embed thumbnail -->
		<div v-if="content.embed_thumbnail" class="thumbnail" v-bind:class="{ hidden: isAudio(content) || isImage(content) || isVideo(content) || isEmail(content) || isIframe(content) }">
			<img v-if="content.title == null" v-bind:src="content.embed_thumbnail"/>

			<a v-else v-bind:href="content.url" target="_blank">
				<img v-bind:src="content.embed_thumbnail"/>
			</a>
		</div>

    <!-- title -->
		<div v-if="content.title != null && content.title.length > 0" class="title">
			<a v-if="content.url != null && content.url.length > 0" v-bind:href="content.url" target="_blank">{{ content.title | safe }}</a>
			<span v-else>{{ content.title | safe }}</span>
		</div>

	<!-- amount -->
		<div v-if="content.price && content.price > 0">
			<div style="text-align: center">${{ content.price }}</div>
		</div>

    <!-- text -->
		<div v-if="content.text != null && content.text.length > 0" class="text">
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

    <!-- url -->
    <!-- if no title or text but there is a url -->
    <div v-if="(content.title == null || content.title.length === 0) &&
         (content.text == null || content.text.length === 0) &&
         content.url != null"
         class="title">
      <a v-bind:href="content.url" target="blank">{{ content.url | safe }}</a>
    </div>

    <!-- tags -->
		<div class="tagging">
			<div class="tags">
				<span v-for="tag in content.tags" v-bind:key="tag">#{{ tag }}</span>
			</div>
		</div>
	</div>
</template>

<script>
  import $ from 'jquery';
  import _ from 'lodash';
  import actionModal from '../modals/action-modal';
	import icons from '../../lib/util/icons';

  const DEFAULT_EMBED_WIDTH = '100%';
  const DEFAULT_DESKTOP_EMBED_WIDTH = 600; //px
  const DEFAULT_EMBED_HEIGHT = 500;  //px
  const SCROLL_EMBED_LEAD_AREA = 700; //px

  const audioTypes = ['mp3', 'ogga', 'wav'];
  const imageTypes = ['png', 'jpg', 'jpeg', 'svg', 'tiff', 'bmp', 'webp'];
  const videoTypes = ['mp4', 'oggv', 'webm'];
  // const iframeTypes = ['email', 'iframe', 'link'];

  function isMobile() {
    if (window.matchMedia) {
      return window.matchMedia('(max-device-width: 1080px) and (min-device-pixel-ratio: 1.5)').matches;
    }
    else {
      return false;
    }
  }

	export default {
		data: function() {
			return {
				tags: function() {
					let tags = [];

					if (this.content.tagMasks) {
						_.forEach(this.tagMasks.source, function(tag) {
							if (tags.indexOf(tag) === -1) {
								tags.push(tag);
							}
						});

						_.forEach(this.tagMasks.added, function(tag) {
							if (tags.indexOf(tag) === -1) {
								tags.push(tag);
							}
						});

						_.forEach(this.tagMasks.removed, function(tag) {
							let index = tags.indexOf(tag);

							if (index > -1) {
								tags.splice(index, 1);
							}
						});
					}

					return tags;
				}
			}
		},

		filters: {
			safe: function(input) {
				return typeof input === 'string' ? input : input == null ? '' : input.toString()
			}
		},

		methods: {
			getContentTypeIcon: function(type) {
				return icons('content', type)
			},

			getProviderIcon: function(provider) {
				return icons('provider', provider.name);
			},

      openActionModal: function(item, type) {
        this.$modal.show(actionModal, {
          shareable: false,
          item: item,
          taggable: true,
          type: type
        }, {
          height: 'auto',
          scrollable: true
        });
      },

      isAudio: function(item) {
			  return audioTypes.indexOf(item.embed_format.toLowerCase()) > -1;
      },

      isEmail: function(item) {
			  return item.embed_format.toLowerCase() === 'email';
      },

      isIframe: function(item) {
			  return item.embed_format.toLowerCase() === 'iframe';
      },

      isImage: function(item) {
			  return imageTypes.indexOf(item.embed_format.toLowerCase()) > -1;
      },

      isVideo: function(item) {
			  return videoTypes.indexOf(item.embed_format.toLowerCase()) > -1;
      },

      getHeight: function() {
			  return DEFAULT_EMBED_HEIGHT;
      },

      getWidth: function() {
        return isMobile() ? DEFAULT_EMBED_WIDTH : DEFAULT_DESKTOP_EMBED_WIDTH;
      },

      getAudioType: function(format) {
			  switch(format) {
          case 'mp3':
            return 'audio/mp3';

            break;

          case 'ogga':
            return 'audio/audio';

            break;

          case 'wav':
            return 'audio/wav';

            break;

          default:
            return 'audio/audio';
        }
      },

      getVideoType: function(format) {
        switch(format) {
          case 'mp4':
            return 'video/mp4';

            break;

          case 'oggv':
            return 'video/ogg';

            break;

          case 'webm':
            return 'video/webm';

            break;

          default:
            return 'video/video';
        }
      },

      renderIframe(content) {
        let $iframe = $(content);

        if (!isMobile() && $iframe.width() > DEFAULT_DESKTOP_EMBED_WIDTH) {
          let scaleRatio = $iframe.height() / $iframe.width();
          $iframe.attr('width', width);
          $iframe.attr('height', $iframe.width() * scaleRatio);
        }

        return $iframe.html();
      },

      renderEmailIframe(content) {
			  let $iframe = $('iframe[name="' + content.id + '"]');

			  let iframe = $iframe.get(0);
			  if (iframe.contentDocument) {
			    iframe.contentDocument.body.innerHTML = content.embed_content;
        }
      },

      visbilityChanged(isVisible, entry) {
			  if (isVisible) {
			    entry.target.classList.remove('embed-hidden');
			    $(entry.target).parent().siblings('.thumbnail').addClass('hidden');
        }
        else {
			    entry.target.classList.add('embed-hidden');
          $(entry.target).parent().siblings('.thumbnail').removeClass('hidden');
        }
      }
		},
		props: [
			'connection',
			'content'
		]
	}
</script>
