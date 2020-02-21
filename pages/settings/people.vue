<template>
    <div></div>
</template>

<script>
	export default {
		layout: function() {
			return 'settings/people';
		},

		asyncData({store}) {
			store.state.mode = 'people';
			store.state.pageName = 'settings people';
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
