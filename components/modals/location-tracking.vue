<template>
  <div class="content padded">
    <div class="flexbox flex-end">
      <i class="close-button fa fa-times-circle" v-on:click="$emit('close')"></i>
    </div>

    <div class="body flexbox flex-column flex-x-center">
      <div v-if="$store.state.userOne.location_tracking_enabled === true" class="paragraph flexbox flex-column flex-x-center" style="margin-bottom: 15px;">
        <h3 >Disable Location Tracking?</h3>
        <div class="instructions">
          <p>Are you sure you'd like to disable location tracking?</p>
          <p>You can re-enable location tracking at any time.</p>
          <p>Note that any locations we've already recorded will remain in our system unless you specifically tell us to remove them.</p>
        </div>
      </div>

      <div v-if="$store.state.userOne.location_tracking_enabled !== true" class="paragraph flexbox flex-column flex-x-center" style="margin-bottom: 15px;">
        <h3 >Enable Location Tracking?</h3>
        <div class="instructions">
          <p>Are you sure you'd like to enable location tracking?</p>
          <p>We'll record your location every time you go to a LifeScope page, and every 5 minutes after that if you remain on the same page.</p>
          <p>You can disable this at any time. You may also clear your tracked location history whenever you'd like.</p>
        </div>
      </div>

      <div class="flexbox flex-x-center">
        <button style="margin-right: 2em" v-on:click="$emit('close')">No, Cancel</button>
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
