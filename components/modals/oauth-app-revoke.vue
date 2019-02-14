<template>
    <div class="content padded">
        <div class="flexbox flex-end">
            <i class="close-button fal fa-2x fa-times-circle" v-on:click="$emit('close')"></i>
        </div>

        <div class="body flexbox flex-column flex-x-center">
            <div class="paragraph flexbox flex-column flex-x-center">
                <span class="instructions">Revoke {{ app.name }}'s tokens?</span>
                <div v-if="tryAgain === false">
                    <p>Are you sure?</p>
                    <p>Any tokens {{ app.name }} has acquired on your behalf will be deleted. Data {{ app.name }} has already collected using these keys will remain in their possession,
                        but they will be unable to collect any further information.
                    </p>
                </div>
                <div v-if="tryAgain === true">
                    <p>Something went wrong; please try again later, or contact support if this issue persists.</p>
                </div>
            </div>

            <div class="mobile-buttons">
                <button class="left-button" v-on:click="$emit('close')">No, Cancel</button>
                <button class="danger confirm" v-on:click="deleteApp(app)">Yes, Revoke</button>
            </div>
        </div>
    </div>
</template>


<script>
	import oauthAppRevoke from '../../apollo/mutations/oauth-app-revoke.gql';

	export default {
		data: function() {
			return {
				tryAgain: false
            }
        },
        props: ['app'],
		methods: {
            deleteApp: async function(app) {
            	let self = this;

            	try {
		            await this.$apollo.mutate({
			            mutation: oauthAppRevoke,
			            variables: {
				            id: app.id
			            }
		            });

		            self.$store.state.oauthAppAuthorizedMany = _.filter(self.$store.state.oauthAppAuthorizedMany, function(authorizedApp) {
		            	console.log(authorizedApp !== authorizedApp.id);
		            	return app.id !== authorizedApp.id;
                    });

		            self.$emit('close');
	            } catch(err) {
            		console.log(err);
            		self.$data.tryAgain = true;

            		setTimeout(function() {
            			self.$data.tryAgain = false;
                    }, 10000)
                }
            }
		}
	}
</script>
