<template>
    <div></div>
</template>

<script>
	export default {
		layout: function() {
			return 'deletion-confirm'
		},

		asyncData({store}) {
			store.state.mode = 'deletion-confirm';
			store.state.pageName = 'deletion-confirm';
		},

		data: function() {
			return {
				authenticated: this.$store.state.user != undefined
			}
		},
	}
</script>
