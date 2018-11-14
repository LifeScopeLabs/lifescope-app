<template>
</template>

<script>
	export default {
		layout: function(context) {
			return 'settings/developer';
		},

		asyncData({ store }) {
			store.state.mode = 'developer';
			store.state.pageName = 'settings developer';
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
