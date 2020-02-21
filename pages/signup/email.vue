<template>
    <div></div>
</template>

<script>
	export default {
		layout: 'signup/email',

		asyncData({store}) {
			store.state.mode = 'signup-email';
			store.state.pageName = 'signup email';
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
