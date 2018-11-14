<template>
</template>

<script>
	export default {
		layout: function(context) {
			return 'settings/apps/edit';
		},

		asyncData({store}) {
			store.state.mode = 'app-edit';
			store.state.pageName = 'settings app-edit';
		},

		data: function({ params }) {
			return {
				authenticated: this.$store.state.user != undefined
			}
		},

		middleware: function({store, redirect}) {
			if (store.state.user == undefined) {
				return redirect('/');
			}
		}
	}
</script>
