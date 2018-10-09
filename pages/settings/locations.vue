<template>
</template>

<script>
	export default {
		layout: function(context) {
			return 'settings/locations';
		},

		asyncData({ store }) {
			store.state.mode = 'locations';
			store.state.pageName = 'settings locations';
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
