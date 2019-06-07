<template>
    <div class="content padded">
        <div class="flexbox flex-end">
            <i class="close-button fal fa-times-circle"
               v-on:click="$emit('close')"
            ></i>
        </div>

        <div class="body flexbox flex-column flex-x-center">
            <div class="paragraph flexbox flex-column flex-x-center">
                <h3>Generate new client secret?</h3>
                <div v-if="tryAgain === false"
                     class="instructions"
                >
                    <p>Are you sure?</p>
                    <p>
                        All of your existing OAuth tokens will still work, but you will need to update your application
                        configuration(s) in order to make any new tokens.
                    </p>
                </div>
                <div v-if="tryAgain === true"
                     class="instructions"
                >
                    <p>Something went wrong; please try again later, or contact us if this issue persists.</p>
                </div>
            </div>

            <div class="mobile-buttons">
                <button class="left-button"
                        v-on:click="$emit('close')"
                >
                    No, Cancel
                </button>
                <button class="danger confirm"
                        v-on:click="resetClientSecret"
                >
                    Yes, Generate
                </button>
            </div>
        </div>
    </div>
</template>


<script>
	import oauthAppResetClientSecret from '../../apollo/mutations/oauth-app-reset-client-secret.gql';

	export default {
		data: function() {
			return {
				tryAgain: false
			}
		},
		methods: {
			resetClientSecret: async function() {
				let self = this;

				try {
					let result = await this.$apollo.mutate({
						mutation: oauthAppResetClientSecret,
						variables: {
							id: self.$store.state.app.id
						}
					});

					self.$store.state.app.clientSecret.value = result.data.oauthAppResetClientSecret.client_secret;

					this.$emit('close');
				}
				catch (err) {
					self.$data.tryAgain = true;

					setTimeout(function() {
						self.$data.tryAgain = false;
					}, 10000)
				}
			}
		}
	}
</script>
