<template>
    <div></div>
</template>

<script>
	export default {
		layout: 'providers',

		asyncData({store}) {
			store.state.mode = 'login-provider';
			store.state.pageName = 'login providers';
		},

		data: function() {
			return {
				authenticated: this.$store.state.user != undefined
			}
		},

		middleware: function({store, redirect}) {
			if (store.state.user != null) {
				return redirect('/');
			}
		},
	}
</script>
