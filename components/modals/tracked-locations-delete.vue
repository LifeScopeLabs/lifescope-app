<template>
  <div class="content padded">
    <div class="flexbox flex-end">
      <i class="close-button fal fa-2x fa-times-circle" v-on:click="$emit('close')"></i>
    </div>

    <div class="body flexbox flex-column flex-x-center">
      <div class="paragraph flexbox flex-column flex-x-center">
        <span class="instructions">Delete Tracked Locations?</span>
        <p>Are you sure you want to delete all locations tracked on LifeScope pages?</p>
      </div>

      <div class="mobile-buttons">
        <button class="left-button" v-on:click="$emit('close')">No, Cancel</button>
        <button class="danger confirm" v-on:click="deleteTrackedLocations">Yes, Delete</button>
      </div>
    </div>
  </div>
</template>


<script>
  import trackedLocationsRemoveMany from '../../apollo/mutations/tracked-locations-remove-many.gql'

  export default {
    methods: {
      deleteTrackedLocations: async function() {
        await this.$apollo.mutate({
          mutation: trackedLocationsRemoveMany
        });

        this.$emit('close');
      }
    }
  }
</script>
