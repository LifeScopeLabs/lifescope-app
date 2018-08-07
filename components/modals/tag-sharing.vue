<template>
  <div id="sharing">
    <div class="content padded">
      <div class="flexbox flex-end">
        <i class="close-button fa fa-times-circle" v-on:click="$emit('close')"></i>
      </div>

      <div class="paragraph flexbox flex-column flex-x-center" style="margin-bottom: 15px;">
        <h2>Share #{{ tag.tag }}</h2>

        <div class="instructions">
          <p>
            You can share parts of your LifeScope history tagged with #{{ tag.tag }} by changing the sharing status below.
            Sharing generates a URL for #{{ tag.tag }}. Anyone who navigates to the link will have access to the tagged results.
            Adding #{{ tag.tag }} to more items will make them automatically appear at the shared link.
          </p>
          <p>Don't want anyone to have access to this tag anymore? Just set the status back to 'Not Shared' and the link will stop working.</p>
        </div>

        <div id="sharing-options">
          <h3 style="margin-top:1em">Sharing status</h3>
          <label v-bind:class="{active: tag.share === 'none' || tag.share == null }" class="radio" for="share-none">
            <input id="share-none" type="radio" name="none" value="none" v-model="$data.share" v-on:change="updateSharing"/>
            <span class="bold">Not Shared</span>
          </label>

          <label v-bind:class="{active: tag.share === 'public' }" class="radio" for="share-public">
            <input id="share-public" type="radio" name="public" value="public" v-model="$data.share" v-on:change="updateSharing"/>
            <span class="bold">Public</span>
          </label>
        </div>

        <div class="flexbox flex-column flex-x-center" v-if="$data.share === 'public' && $data.passcodeString != null">
          <h3 style="margin-top: 1em;">Sharing Links</h3>
          <div class="share-link">
            <span>Share this link with others to give them access to tagged results:</span>
            <div class="flexbox">
              <a v-bind:href="shareUrl(tag)" style="word-break: break-all" class="public-link">https://app.lifescope.io/shared?id={{ tag.id }}&passcode={{ $data.passcodeString }}</a>
              <i class="fa fa-clipboard clipboard-copy" v-on:click="copyToClipboard('.public-link')">
                <span class="tooltiptext">Copy to clipboard</span>
              </i>
            </div>
          </div>
          <div class="share-link">
            <span>Share this tag to social media:</span>
            <div id="social-tag-shares">
              <a v-bind:href="facebookUrl(tag)" target="_blank"><i class="fa fa-facebook"></i></a>
              <a v-bind:href="twitterUrl(tag)" target="_blank"><i class="fa fa-twitter"></i></a>
              <a v-bind:href="redditUrl(tag)" target="_blank"><i class="fa fa-reddit-alien"></i></a>
              <a v-bind:href="emailUrl(tag)" target="_blank"><i class="fa fa-envelope"></i></a>
              <a v-bind:href="smsUrl(tag)" target="_blank"><i class="fa fa-comments"></i></a>
              <a v-bind:href="tumblrUrl(tag)" target="_blank"><i class="fa fa-tumblr"></i></a>
              <a v-bind:href="pinterestUrl(tag)" target="_blank"><i class="fa fa-pinterest"></i></a>
              <a v-bind:href="linkedInUrl(tag)" target="_blank"><i class="fa fa-linkedin"></i></a>
            </div>
          </div>
          <div class="share-link">
            <span>Embed this shared stream on your site:</span>
            <div class="flexbox">
              <span class="iframe-code">{{ iframe(tag) }}</span>
              <i class="fa fa-clipboard clipboard-copy" v-on:click="copyToClipboard('.iframe-code')">
                <span class="tooltiptext">Copy to clipboard</span>
              </i>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
  import tagUpdateSharing from '../../apollo/mutations/tag-update-sharing.gql';

  const logoUrl = 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/android-chrome-512x512.png';

  export default {
    data: function() {
      return {
        share: null,
        passcodeString: null
      };
    },

    props: [
      'tag'
    ],

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
        match.passcode_string = update.passcode_string;
        match.share = update.share;

        this.$data.share = update.share;
        this.$data.passcodeString = update.passcode_string;
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
        return 'https://app.lifescope.io/shared?id=' +  tag.id + '&passcode=' + this.$data.passcodeString;
      },

      emailUrl: function(tag) {
        return 'mailto:%20?subject=' + encodeURIComponent('#' + tag.tag + ' shared from lifescope.io') + '&body=' + encodeURIComponent('Check out my LifeScope search results for #' + tag.tag + ': ' + this.shareUrl(tag));
      },

      facebookUrl: function(tag) {
        return 'https://www.facebook.com/sharer.php?s=100&u=' + encodeURIComponent(this.shareUrl(tag));
      },

      linkedInUrl: function(tag) {
        return 'http://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(this.shareUrl(tag)) + '&title=' + encodeURIComponent('#' + tag.tag + ' shared from lifescope.io') + '&summary=' + encodeURIComponent('Lifescope search results for #' + tag.tag) + '&source=' + encodeURIComponent(this.shareUrl(tag));
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
        return 'http://www.tumblr.com/share/link?url=' + encodeURIComponent(this.shareUrl(tag)) + '&name=' + encodeURIComponent('#' + tag.tag + ' shared from lifescope.io') + '&description=' + encodeURIComponent('My LifeScope search results for #' + tag.tag) + '&tags=LifeScope'+ '&show-via=true'
      },

      twitterUrl: function(tag) {
        return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent('#' + tag.tag + ' shared from lifescope.io') + '&url=' + encodeURIComponent(this.shareUrl(tag));
      },

      iframe: function(tag) {
        return '<iframe frameborder=0 width=100% height=600 src="' + this.shareUrl(tag) + '"></iframe>'
      }
    },

    mounted: function() {
      this.$data.share = this.$props.tag.share || 'none';
      this.$data.passcodeString = this.$props.tag.passcode_string || null;
    }
  }
</script>
