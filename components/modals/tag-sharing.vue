<template>
    <div id="sharing">
        <div class="content padded">
            <div class="flexbox flex-end">
                <i class="close-button fal fa-2x fa-times-circle"
                   v-on:click="$emit('close')"
                ></i>
            </div>

            <div class="paragraph flexbox flex-column flex-x-center">
                <span class="instructions">
                    Share #{{ tag.tag }} Tag Stream
                </span>

                <div id="sharing-options"
                     class="flexbox flex-column flex-x-center"
                >
                    <label v-bind:class="{active: tag.share === 'none' || tag.share == null }"
                           class="radio"
                           for="share-none"
                    >
                        <input id="share-none"
                               v-model="$data.share"
                               type="radio"
                               name="none"
                               value="none"
                               v-on:change="updateSharing"
                        />
                        <span>Not Shared</span>
                    </label>

                    <label v-bind:class="{active: tag.share === 'public' }"
                           class="radio"
                           for="share-public"
                    >
                        <input id="share-public"
                               v-model="$data.share"
                               type="radio"
                               name="public"
                               value="public"
                               v-on:change="updateSharing"
                        />
                        <span>Link Shared</span>
                    </label>
                </div>

                <div v-if="$data.share === 'public' && $data.passcode != null"
                     class="flexbox flex-column flex-x-center"
                >
                    <span class="instructions">Share Link</span>
                    <div class="share-link">
                        <div class="flexbox flex-column flex-x-center">
                            <a v-bind:href="shareUrl(tag)"
                               style="word-break: break-all"
                               class="public-link"
                            >https://app.lifescope.io/shared?id={{ tag.id }}&passcode={{ $data.passcode }}
                            </a>
                            <i class="fal fa-clipboard clipboard-copy"
                               v-on:click="copyToClipboard('.public-link')"
                            >
                                <span> Copy to Clipboard</span>
                            </i>
                        </div>
                    </div>
                    <div class="share-link">
                        <div id="social-tag-shares">
                            <a v-bind:href="facebookUrl(tag)"
                               target="_blank"
                            >
                                <i class="fab fa-facebook"></i>
                            </a>
                            <a v-bind:href="twitterUrl(tag)"
                               target="_blank"
                            >
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a v-bind:href="redditUrl(tag)"
                               target="_blank"
                            >
                                <i class="fab fa-reddit-alien"></i>
                            </a>
                            <a v-bind:href="emailUrl(tag)"
                               target="_blank"
                            >
                                <i class="far fa-envelope"></i>
                            </a>
                            <a v-bind:href="smsUrl(tag)"
                               target="_blank"
                            >
                                <i class="fas fa-comments"></i>
                            </a>
                            <a v-bind:href="tumblrUrl(tag)"
                               target="_blank"
                            >
                                <i class="fab fa-tumblr"></i>
                            </a>
                            <a v-bind:href="pinterestUrl(tag)"
                               target="_blank"
                            >
                                <i class="fab fa-pinterest"></i>
                            </a>
                            <a v-bind:href="linkedInUrl(tag)"
                               target="_blank"
                            >
                                <i class="fab fa-linkedin"></i>
                            </a>
                        </div>
                    </div>
                    <div class="share-link flexbox flex-column flex-x-center">
                        <span class="instructions">Embed #{{ tag.tag }} Tag Stream</span>
                        <div class="flexbox flex-column flex-x-center">
                            <span class="iframe-code">{{ iframe(tag) }}</span>
                            <i class="fal fa-clipboard clipboard-copy"
                               v-on:click="copyToClipboard('.iframe-code')"
                            >
                                <span> Copy to Clipboard</span>
                            </i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import tagUpdateSharing from '../../apollo/mutations/tag-update-sharing.gql';

	import _ from 'lodash';

	const logoUrl = 'https://d21yg5z5swigyg.cloudfront.net/assets/images/icons/android-chrome-512x512.png';

	export default {
		props: {
			tag: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},

		data: function() {
			return {
				share: null,
				passcode: null
			};
		},

		mounted: function() {
			this.$data.share = this.$props.tag.share || 'none';
			this.$data.passcode = this.$props.tag.passcode || null;
		},

		methods: {
			updateSharing: async function() {
				let result = await this.$apollo.mutate({
					mutation: tagUpdateSharing,
					variables: {
						id: this.$props.tag.id,
						share: this.$data.share
					}
				});

				let update = result.data.tagUpdateSharing;

				let storeCopy = _.cloneDeep(this.$store.state.tagMany);

				let match = _.find(storeCopy, function(item) {
					return item.id === update.id;
				});

				match.passcode = update.passcode;
				match.share = update.share;

				this.$data.share = update.share;
				this.$data.passcode = update.passcode;
				this.$store.state.tagMany = storeCopy;
			},

			copyToClipboard(selector) {
				let text = document.querySelector(selector).innerText;
				let textarea = document.createElement('textarea');
				textarea.textContent = text;
				document.body.appendChild(textarea);

				let selection = document.getSelection();
				let range = document.createRange();
				range.selectNode(textarea);
				selection.removeAllRanges();
				selection.addRange(range);

				document.execCommand('copy');
				selection.removeAllRanges();

				document.body.removeChild(textarea);
			},

			shareUrl: function(tag) {
				return 'https://app.lifescope.io/shared?id=' + tag.id + '&passcode=' + this.$data.passcode;
			},

			emailUrl: function(tag) {
				return 'mailto:%20?subject=' + encodeURIComponent('#' + tag.tag + ' shared from lifescope.io') + '&body=' + encodeURIComponent('Check out my LifeScope search results for #' + tag.tag + ': ' + this.shareUrl(tag));
			},

			facebookUrl: function(tag) {
				return 'https://www.facebook.com/sharer.php?s=100&u=' + encodeURIComponent(this.shareUrl(tag));
			},

			linkedInUrl: function(tag) {
				return 'http://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(this.shareUrl(tag)) + '&title=' + encodeURIComponent('#' + tag.tag + ' shared from lifescope.io') + '&summary=' + encodeURIComponent('LifeScope search results for #' + tag.tag) + '&source=' + encodeURIComponent(this.shareUrl(tag));
			},

			pinterestUrl: function(tag) {
				return 'http://pinterest.com/pin/create/button/?url=' + encodeURIComponent(this.shareUrl(tag)) + '&media=' + logoUrl + '&description=' + encodeURIComponent('#' + tag.tag + ' shared from lifescope.io');
			},

			redditUrl: function(tag) {
				return 'https://www.reddit.com/submit?url=' + encodeURIComponent(this.shareUrl(tag)) + '&title=' + encodeURIComponent('#' + tag.tag + ' shared from lifescope.io');
			},

			smsUrl: function(tag) {
				return 'sms:%20&body=' + encodeURIComponent('#' + tag.tag + ' shared from lifescope.io') + '%20-%20' + encodeURIComponent(this.shareUrl(tag));
			},

			tumblrUrl: function(tag) {
				return 'http://www.tumblr.com/share/link?url=' + encodeURIComponent(this.shareUrl(tag)) + '&name=' + encodeURIComponent('#' + tag.tag + ' shared from lifescope.io') + '&description=' + encodeURIComponent('My LifeScope search results for #' + tag.tag) + '&tags=LifeScope' + '&show-via=true'
			},

			twitterUrl: function(tag) {
				return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent('#' + tag.tag + ' shared from lifescope.io') + '&url=' + encodeURIComponent(this.shareUrl(tag));
			},

			iframe: function(tag) {
				return '<iframe frameborder=0 width=100% height=600 src="' + this.shareUrl(tag) + '"></iframe>'
			}
		}
	}
</script>
