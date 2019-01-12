<template>
    <div class="content padded">
        <div class="flexbox flex-end">
            <i class="close-button fas fa-times-circle" v-on:click="$emit('close')"></i>
        </div>

        <div class="body flexbox flex-column flex-x-center">
            <div class="paragraph flexbox flex-column flex-x-center" style="margin-bottom: 15px;">
                <h3>Delete this Person?</h3>
                <div class="instructions" v-if="tryAgain === false">
                    <p>Are you sure?</p>
                    <p>You must manually re-create this Person if you change your mind.</p>
                </div>
                <div class="instructions" v-if="tryAgain === true">
                    <p>Something went wrong; please try again later, or contact us if this issue persists.</p>
                </div>
            </div>

            <div class="mobile-buttons">
                <button class="left-button" v-on:click="$emit('close')">No, Cancel</button>
                <button class="danger confirm" v-on:click="deletePerson">Yes, Delete</button>
            </div>
        </div>
    </div>
</template>


<script>
	import personDelete from '../../apollo/mutations/person-delete.gql';

	export default {
		data: function() {
			return {
				tryAgain: false
            }
        },
		methods: {
            deletePerson: async function() {
            	let self = this;

            	try {
		            await this.$apollo.mutate({
			            mutation: personDelete,
			            variables: {
				            id: self.$route.params.id
			            }
		            });

		            window.location.href = '/settings/people';
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
