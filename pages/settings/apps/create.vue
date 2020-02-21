<template>
    <div></div>
</template>

<script>
	export default {
		layout: function() {
			return 'settings/apps/create';
		},

		asyncData({store}) {
			store.state.mode = 'app-create';
			store.state.pageName = 'settings app-create';
		},

		data: function() {
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
