<template>
    <div></div>
</template>

<script>
	export default {
		layout: function() {
			return 'settings/authorized-apps';
		},

		asyncData({store}) {
			store.state.mode = 'authorized-apps';
			store.state.pageName = 'settings authorized-apps';
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
