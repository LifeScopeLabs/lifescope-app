<template>
    <div></div>
</template>

<script>
	export default {
		layout: function() {
			return 'settings/locations';
		},

		data: function() {
			return {
				authenticated: this.$store.state.user != undefined
			}
		},

		asyncData({store}) {
			store.state.mode = 'locations';
			store.state.pageName = 'settings locations';
		},

		middleware: function({store, redirect}) {
			if (store.state.user == undefined) {
				return redirect('/');
			}
		}
	}
</script>
