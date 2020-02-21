<template>
    <div></div>
</template>

<script>
	export default {
		layout: 'login/email',

		asyncData({store}) {
			store.state.mode = 'login-email';
			store.state.pageName = 'login email';
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
