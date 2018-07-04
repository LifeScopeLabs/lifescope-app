<template>
  <div id="sharing">
    <div class="content padded">
      <div class="flexbox flex-end">
        <i class="fa fa-times-circle" v-on:click="$emit('close')"></i>
      </div>

      <div class="paragraph flexbox flex-column flex-x-center" style="margin-bottom: 15px;">
        <h2>Share objects tagged with #{{ tag.tag }}</h2>

        <div class="instructions">
          <p>
            You can let others see Events in your LifeScope history tagged with #{{ tag.tag }} by setting the sharing status below to 'Public'.
            This will generate a URL that you can give out to whoever you'd like to have access to that tag.
            Tag more Events, Content, or Contacts with #{{ tag.tag }} and they'll automatically be made available at that URL.
          </p>
          <p>Don't want anyone to see this tag any longer? Just set the status back to 'None', and everything with #{{ tag.tag }} will be completely private again.</p>
        </div>

        <div id="sharing-options">
          <h3 style="margin-top:1em">Sharing status</h3>
          <label v-bind:class="{active: tag.share === 'none' || tag.share == null }" class="radio" for="share-none">
            <input id="share-none" type="radio" name="none" value="none" v-model="$data.share" v-on:change="updateSharing"/>
            <span class="bold">None</span>
          </label>

          <label v-bind:class="{active: tag.share === 'public' }" class="radio" for="share-public">
            <input id="share-public" type="radio" name="public" value="public" v-model="$data.share" v-on:change="updateSharing"/>
            <span class="bold">Public</span>
          </label>
        </div>

        <div class="flexbox flex-column flex-x-center" v-if="$data.share === 'public' && $data.passcodeString != null">
          <h4>Sharing Link</h4>
          <span>Share this link with others to give them access to tagged results:</span>
          <span>https://app.lifescope.io/shared?id={{ tag.id }}&passcode={{ $data.passcodeString }}</span>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
  import tagUpdateSharing from '../../apollo/mutations/tag-update-sharing.gql';

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
      }
    },

    mounted: function() {
      this.$data.share = this.$props.tag.share || 'none';
      this.$data.passcodeString = this.$props.tag.passcode_string || null;
    }
  }
</script>
