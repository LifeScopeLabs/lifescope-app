<template>
    <div class="content padded">
        <div class="flexbox flex-end">
            <i class="close-button fal fa-2x fa-times-circle"
               v-on:click="$emit('close')"
            ></i>
        </div>

        <div class="body flexbox flex-column flex-x-center">
            <div class="paragraph flexbox flex-column flex-x-center">
                <span class="instructions">Delete Your LifeScope Account</span>

                <p>Are you sure you'd like to delete your LifeScope account?</p>
                <p>LifeScope is read only and your connected data source account will remain unchanged.</p>
                <p>Once you delete your account, your LifeScope index will be deleted.</p>
                <p>LifeScope will not keep your data and we never share any data without your consent.</p>
            </div>
            <div class="mobile-buttons">
                <button class="left-button"
                        v-on:click="$emit('close')"
                >
                    No, Cancel
                </button>
                <button class="danger confirm"
                        v-on:click="deleteAccount"
                >
                    Yolo, Delete
                </button>
            </div>
        </div>
    </div>
</template>


<script>
	import deleteAccount from '../../apollo/mutations/delete-account.gql';

	export default {
		methods: {
			deleteAccount: async function() {
				await this.$apollo.mutate({
					mutation: deleteAccount
				});

				window.location = '/';
			}
		}
	}
</script>
