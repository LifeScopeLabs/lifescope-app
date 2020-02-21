<template>
    <div></div>
</template>

<script>
	export default {
		layout: 'login/index',

		asyncData({store}) {
			store.state.mode = 'login-choice';
			store.state.pageName = 'login choice';
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
