<template>
    <div></div>
</template>

<script>
	export default {
		layout: function() {
			return 'settings/apps/edit';
		},

		data: function() {
			return {
				authenticated: this.$store.state.user != undefined
			}
		},

		asyncData({store}) {
			store.state.mode = 'app-edit';
			store.state.pageName = 'settings app-edit';
		},

		middleware: function({store, redirect}) {
			if (store.state.user == undefined) {
				return redirect('/');
			}
		}
	}
</script>
