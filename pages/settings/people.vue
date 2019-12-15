<template>
    <div></div>
</template>

<script>
	export default {
		layout: function() {
			return 'settings/people';
		},

		data: function() {
			return {
				authenticated: this.$store.state.user != undefined
			}
		},

		asyncData({store}) {
			store.state.mode = 'people';
			store.state.pageName = 'settings people';
		},

		middleware: function({store, redirect}) {
			if (store.state.user == undefined) {
				return redirect('/');
			}
		}
	}
</script>
