<template>
</template>

<script>
  export default {
    layout: 'explorer',

    asyncData({ store }) {
      store.state.mode = 'app';
      store.state.pageName = 'explorer';
    },

    data: function() {
      return {
        authenticated: this.$store.state.user != undefined
      }
    },

    middleware: function({ store, redirect }) {
      if (store.state.user == undefined) {
        return redirect('/');
      }
    }
  }
</script>
