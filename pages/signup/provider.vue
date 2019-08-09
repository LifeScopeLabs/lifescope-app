<template>
    <div></div>
</template>

<script>
	export default {
		layout: 'providers',

		data: function() {
			return {
				authenticated: this.$store.state.user != undefined
			}
		},

		asyncData({store}) {
			store.state.mode = 'signup-provider';
			store.state.pageName = 'signup providers';
		},

		middleware: function({store, redirect}) {
			if (store.state.user != null) {
				return redirect('/');
			}
		},
	}
</script>
