<template>
    <div class="content padded">
        <div class="flexbox flex-end">
            <i class="close-button fas fa-times-circle" v-on:click="$emit('close')"></i>
        </div>

        <div class="body flexbox flex-column flex-x-center">
            <div class="paragraph flexbox flex-column flex-x-center" style="margin-bottom: 15px;">
                <h3>Delete this app?</h3>
                <div class="instructions" v-if="tryAgain === false">
                    <p>Are you sure?</p>
                    <p>All of the existing tokens created with this app will be invalidated.</p>
                </div>
                <div class="instructions" v-if="tryAgain === true">
                    <p>Something went wrong; please try again later, or contact us if this issue persists.</p>
                </div>
            </div>

            <div class="mobile-buttons">
                <button class="left-button" v-on:click="$emit('close')">No, Cancel</button>
                <button class="danger confirm" v-on:click="deleteApp">Yes, Delete</button>
            </div>
        </div>
    </div>
</template>


<script>
	import oauthAppDelete from '../../apollo/mutations/oauth-app-delete.gql';

	export default {
		data: function() {
			return {
				tryAgain: false
            }
        },
		methods: {
            deleteApp: async function(connection) {
            	let self = this;

            	try {
		            await this.$apollo.mutate({
			            mutation: oauthAppDelete,
			            variables: {
				            id: self.$store.state.app.id
			            }
		            });

		            window.location.href = '/settings/developer';
	            } catch(err) {
            		self.$data.tryAgain = true;

            		setTimeout(function() {
            			self.$data.tryAgain = false;
                    }, 10000)
                }
            }
		}
	}
</script>
