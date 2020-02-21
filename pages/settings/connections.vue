<template>
    <div></div>
</template>

<script>
	export default {
		layout: function() {
			return 'settings/connections';
		},

		asyncData({store}) {
			store.state.mode = 'connections';
			store.state.pageName = 'settings connections';
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
