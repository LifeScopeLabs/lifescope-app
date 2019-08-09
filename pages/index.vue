<template>
    <div></div>
</template>

<script>
	import _ from 'lodash';

	export default {
		layout: function(context) {
			let user = _.get(context, 'req.user') ? context.req.user : _.get(context, 'nuxtState.state.user');

			return user != undefined ? 'home' : 'base';
		},

		data: function() {
			return {
				authenticated: this.$store.state.user != undefined
			}
		},

		asyncData({store}) {
			store.state.mode = 'home';
			store.state.pageName = store.state.user ? 'home' : 'base';
		},
	}
</script>
