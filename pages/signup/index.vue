<template>
    <div></div>
</template>

<script>
	export default {
		layout: 'signup/index',

		data: function() {
			return {
				authenticated: this.$store.state.user != undefined
			}
		},

		asyncData({store}) {
			store.state.mode = 'signup-choice';
			store.state.pageName = 'signup choice';
		},

		middleware: function({store, redirect}) {
			if (store.state.user != null) {
				return redirect('/');
			}
		},
	}
</script>
