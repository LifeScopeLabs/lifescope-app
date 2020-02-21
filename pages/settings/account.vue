<template>
    <div></div>
</template>

<script>
	export default {
		layout: function() {
			return 'settings/account';
		},

		asyncData({store}) {
			store.state.mode = 'account';
			store.state.pageName = 'settings account';
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
