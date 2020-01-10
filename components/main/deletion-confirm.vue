<template>
    <main>
        <transition appear
                    name="page-load"
        >
            <div v-if="$data.dataRemovalConfirmationCheck.noRecord === true"
                 class="boxed-group"
            >
                <div class="title">Invalid Confirmation Code</div>
                <div class="padded paragraphed">
                    The data deletion confirmation code provided appears to be invalid. If you definitely requested that
                    your data be removed, you can make sure it gets deleted by going to the
                    <a href="/settings/connections">Connection Settings page</a> and deleting the Connection used to
                    obtain this data.
                </div>
            </div>
            <div v-else-if="$data.dataRemovalConfirmationCheck.success === true"
                 class="boxed-group"
            >
                <div class="title">Data Deletion Confirmed</div>
                <div class="padded paragraphed">
                    This data deletion request has been successfully fulfilled. Your Connection to that data source
                    and all its associated data has been removed from LifeScope.
                </div>
                <div>
                    Note that if you deleted the data from your only remaining Connection, and you did not have an email
                    associated with that LifeScope account, your LifeScope account was deleted as well.
                </div>
            </div>
            <div v-else-if="$data.dataRemovalConfirmationCheck.success != null && $data.dataRemovalConfirmationCheck.success !== true"
                 class="boxed-group"
            >
                <div class="title">Data Deletion Failed</div>
                <div class="padded paragraphed">
                    Something went wrong when trying to delete your data. This shouldn't have happened, as LifeScope is
                    committed to removing your data as soon as you request it. To ensure this data is removed, go to
                    the <a href="/settings/connections">Connection Settings page</a> and delete the Connection used to
                    obtain this data.
                </div>
            </div>
        </transition>
    </main>
</template>

<script>
	import dataRemovalConfirmationCheck from '../../apollo/queries/data-removal-confirmation-check.gql';

	export default {
		data: function() {
			return {
				dataRemovalConfirmationCheck: {}
            };
		},

		mounted: async function() {
			let self = this;

			let result = await this.$apollo.query({
				query: dataRemovalConfirmationCheck,
				fetchPolicy: 'no-cache',
                variables: {
					confirmation_code: self.$route.query.confirmation_code
                }
			});

			self.$data.dataRemovalConfirmationCheck = result.data.dataRemovalConfirmationCheck;
		}
	}
</script>
