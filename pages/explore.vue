<template>
</template>

<script>
  export default {
    layout: 'explorer',
    asyncData({ store }) {
      store.state.mode = 'explorer';
      store.state.pageName = 'explorer';
    },
    data: function() {
      return {
        authenticated: this.$store.state.user != undefined
      }
    }
  }
</script>
