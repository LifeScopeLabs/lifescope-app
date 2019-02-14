<template>
    <div class="content padded">
        <div class="flexbox flex-end">
            <i class="close-button fal fa-2x fa-times-circle" v-on:click="$emit('close')"></i>
        </div>

        <div class="body flexbox flex-column flex-x-center">
            <div class="paragraph flexbox flex-column flex-x-center">
                <span class="instructions">Delete {{ connection.name }}?</span>
                <div v-if="$data.lastConnectionMessage === false">
                    <p>Are you sure?</p>
                    <p>Once you delete your connection, all of your data indexed in LifeScope will be deleted.</p>
                    <p v-if="connection.browser != null">Please also remove the browser extension to stop LifeScope browser tracking.</p>
                </div>
                <div class="last-connection" v-if="$data.lastConnectionMessage === true">
                    <p>You cannot delete your last connection. Without any connections, you cannot access your acccount.</p>
                    <p>If you would like to delete this connection, make a connection to another provider that you can log in with first.</p>
                    <p>You can also delete this account, which will get rid of this connection, but you will lose all of your saved searches, tags, etc.</p>
                </div>
            </div>

            <div class="mobile-buttons">
                <button class="left-button" v-on:click="$emit('close')">No, Cancel</button>
                <button class="danger confirm" v-on:click="deleteConnection(connection)">Yolo, Delete</button>
            </div>
        </div>
    </div>
</template>


<script>
    import eliminateConnection from '../../apollo/mutations/eliminate-connection.gql';

	export default {
		data: function() {
			return {
				lastConnectionMessage: false
			}
        },
		props: ['connection'],
		methods: {
            deleteConnection: async function(connection) {
            	let self = this;

            	try {
		            await this.$apollo.mutate({
			            mutation: eliminateConnection,
			            variables: {
				            id: connection.id
			            }
		            });

		            this.$emit('close');
	            } catch(err) {
            		self.$data.lastConnectionMessage = true;
            		setTimeout(function() {
            			self.$data.lastConnectionMessage = false;
                    }, 10000)
                }
            }
		}
	}
</script>
