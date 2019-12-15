<template>
    <div></div>
</template>

<script>
	export default {
		layout: function() {
			return 'settings/person/create';
		},

		data: function() {
			return {
				authenticated: this.$store.state.user != undefined
			}
		},

		asyncData({store}) {
			store.state.mode = 'people-create';
			store.state.pageName = 'settings people-create';
		},

		middleware: function({store, redirect}) {
			if (store.state.user == undefined) {
				return redirect('/');
			}
		}
	}
</script>
