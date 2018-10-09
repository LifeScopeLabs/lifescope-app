<template>
  <div class="content padded">
    <div class="flexbox flex-end">
      <i class="close-button fa fa-times-circle" v-on:click="$emit('close')"></i>
    </div>

    <div class="body flexbox flex-column flex-x-center">
      <div v-if="$store.state.userOne.location_tracking_enabled === true" class="paragraph flexbox flex-column flex-x-center" style="margin-bottom: 15px;">
        <h3>Disable Location Tracking</h3>
        <div class="instructions">
          <p>Are you sure you'd like to disable location tracking?</p>
          <p>You can re-enable location tracking at any time.</p>
          <p>Locations already recorded will remain in LifeScope until you remove them.</p>
        </div>
      </div>

      <div v-if="$store.state.userOne.location_tracking_enabled !== true" class="paragraph flexbox flex-column flex-x-center" style="margin-bottom: 15px;">
        <h3 >Enable Location Tracking</h3>
        <div class="instructions">
          <p>
            LifeScope can record your location when you visit LifeScope pages. This can greatly improve search results over time.
          </p>
        </div>
      </div>

      <div class="mobile-modal-buttons">
        <button class="left-button" v-on:click="$emit('close')">No, Cancel</button>
        <span class="flex-grow"></span>
        <button v-if="$store.state.userOne.location_tracking_enabled === true" class="primary confirm" v-on:click="updateTracking">Yes, Disable</button>
        <button v-if="$store.state.userOne.location_tracking_enabled !== true" class="primary confirm" v-on:click="updateTracking">Yes, Enable</button>
      </div>
    </div>
  </div>
</template>

<script>
  import userLocationTrackingUpdate from '../../apollo/mutations/user-location-tracking-update.gql'

  export default {
    props: ['connection'],
    methods: {
      updateTracking: async function() {
        let response = await this.$apollo.mutate({
          mutation: userLocationTrackingUpdate,
          variables: {
            location_tracking_enabled: !this.$store.state.userOne.location_tracking_enabled
          }
        });

        this.$store.state.userOne = response.data.userLocationTrackingUpdate;

        console.log(this.$store.state.userOne);

        this.$emit('close');
      }
    }
  }
</script>
