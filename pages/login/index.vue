<template>
    <div></div>
</template>

<script>
	export default {
		layout: 'login/index',

		data: function() {
			return {
				authenticated: this.$store.state.user != undefined
			}
		},

		asyncData({store}) {
			store.state.mode = 'login-choice';
			store.state.pageName = 'login choice';
		},

		middleware: function({store, redirect}) {
			if (store.state.user != null) {
				return redirect('/');
			}
		},
	}
</script>
