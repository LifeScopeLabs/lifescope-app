<template>
  <div class="content padded">
    <div class="flexbox flex-end">
      <i class="close-button fas fa-times-circle" v-on:click="$emit('close')"></i>
    </div>

    <div class="body flexbox flex-column flex-x-center">
      <div class="paragraph flexbox flex-column flex-x-center" style="margin-bottom: 15px;">
        <h3>Disable {{ connection.name }}?</h3>
        <div class="instructions">
          <p>Are you sure?</p>
          <p>Disabling this connection will stop data collection.</p>
          <p>You can re-enable the connection at any time and data collection will restart.</p>
        </div>
      </div>

      <div class="mobile-modal-buttons">
        <button class="left-button" v-on:click="$emit('close')">No, Cancel</button>
        <button class="danger confirm" v-on:click="disableConnection(connection)">Yes, Disable</button>
      </div>
    </div>
  </div>
</template>


<script>
  import patchConnection from '../../apollo/mutations/patch-connection.gql'

  export default {
    props: ['connection'],
    methods: {
      disableConnection: async function(connection) {
        await this.$apollo.mutate({
          mutation: patchConnection,
          variables: {
            id: connection.id,
            enabled: false
          }
        });

        this.$emit('close');
      }
    }
  }
</script>
