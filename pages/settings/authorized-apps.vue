<template>
    <div></div>
</template>

<script>
	export default {
		layout: function() {
			return 'settings/authorized-apps';
		},

		data: function() {
			return {
				authenticated: this.$store.state.user != undefined
			}
		},

		asyncData({store}) {
			store.state.mode = 'authorized-apps';
			store.state.pageName = 'settings authorized-apps';
		},

		middleware: function({store, redirect}) {
			if (store.state.user == undefined) {
				return redirect('/');
			}
		}
	}
</script>
