<template>
    <div class="content padded">
        <div class="flexbox flex-end">
            <i class="close-button fal fa-2x fa-times-circle" v-on:click="$emit('close')"></i>
        </div>

        <div class="body flexbox flex-column flex-x-center">
            <div class="paragraph flexbox flex-column flex-x-center">
                <span class="instructions" v-if="tryAgain === false"> Are you sure you want to delete this Person?</span>
                <p v-if="tryAgain === true">
                    Something went wrong; please try again later, or contact support if this issue persists.
                </p>
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
