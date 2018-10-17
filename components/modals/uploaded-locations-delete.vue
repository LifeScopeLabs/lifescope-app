<template>
  <div class="content padded">
    <div class="flexbox flex-end">
      <i class="close-button fas fa-times-circle" v-on:click="$emit('close')"></i>
    </div>

    <div class="body flexbox flex-column flex-x-center">
      <div class="paragraph flexbox flex-column flex-x-center" style="margin-bottom: 15px;">
        <h3 >Delete Uploaded Locations?</h3>
        <div class="instructions">
          <p>Are you sure you want to delete all locations generated from files you've Uploaded?</p>
        </div>
      </div>

      <div class="mobile-modal-buttons">
        <button class="left-button" v-on:click="$emit('close')">No, Cancel</button>
        <button class="danger confirm" v-bind:class="{ hidden: $data.deleting === true }" v-on:click="deleteUploadedLocations">Yes, Delete</button>
        <i class="fas fa-spin fa-spinner" v-bind:class="{ hidden: $data.deleting === false }"></i>
      </div>
    </div>
  </div>
</template>


<script>
  import uploadedLocationsRemoveMany from '../../apollo/mutations/uploaded-locations-remove-many.gql'

  export default {
  	data: function() {
  		return {
  			deleting: false
        }
    },
    methods: {
      deleteUploadedLocations: async function() {
      	this.$data.deleting = true;

        await this.$apollo.mutate({
          mutation: uploadedLocationsRemoveMany
        });

        this.$data.deleting = false;

        this.$emit('close');
      }
    }
  }
</script>
