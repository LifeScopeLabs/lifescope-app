<template>
    <div></div>
</template>

<script>
	export default {
		layout: function() {
			return 'settings/people/edit';
		},

		data: function() {
			return {
				authenticated: this.$store.state.user != undefined
			}
		},

		asyncData({store}) {
			store.state.mode = 'people-edit';
			store.state.pageName = 'settings people-edit';
		},

		middleware: function({store, redirect}) {
			if (store.state.user == undefined) {
				return redirect('/');
			}
		}
	}
</script>
