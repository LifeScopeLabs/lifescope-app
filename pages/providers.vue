<template>
    <div></div>
</template>

<script>
	export default {
		layout: 'providers',

		data: function() {
			return {
				authenticated: this.$store.state.user != undefined
			}
		},

		asyncData({store}) {
			store.state.mode = 'home';
			store.state.pageName = 'providers';
		},
	}
</script>
