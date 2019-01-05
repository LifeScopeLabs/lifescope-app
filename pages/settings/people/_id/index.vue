<template>
</template>

<script>
	export default {
		layout: function(context) {
			return 'settings/people/edit';
		},

		asyncData({store}) {
			store.state.mode = 'people-edit';
			store.state.pageName = 'settings people-edit';
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
