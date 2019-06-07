<template>
    <div></div>
</template>

<script>
	export default {
		layout: function() {
			return 'settings/developer';
		},

		data: function() {
			return {
				authenticated: this.$store.state.user != undefined
			}
		},

		asyncData({store}) {
			store.state.mode = 'developer';
			store.state.pageName = 'settings developer';
		},

		middleware: function({store, redirect}) {
			if (store.state.user == undefined) {
				return redirect('/');
			}
		}
	}
</script>
