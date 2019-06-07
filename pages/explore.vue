<template>
    <div></div>
</template>

<script>
	export default {
		layout: 'explorer',

		data: function() {
			return {
				authenticated: this.$store.state.user != undefined
			}
		},

		asyncData({store}) {
			store.state.mode = 'app';
			store.state.pageName = 'explorer';
		},

		middleware: function({store, redirect}) {
			if (store.state.user == undefined) {
				return redirect('/');
			}
		}
	}
</script>
