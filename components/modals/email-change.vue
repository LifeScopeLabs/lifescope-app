<template>
    <div id="email-change"
         class="content padded"
    >
        <div class="flexbox flex-end">
            <i class="close-button fal fa-2x fa-times-circle"
               v-on:click="$emit('close')"
            ></i>
        </div>

        <div class="body flexbox flex-column flex-x-center">
            <div class="paragraph flexbox flex-column flex-x-center">
                <span class="instructions">Change email address</span>

                <div v-if="$data.success === true"
                     class="align-center"
                >
                    <p>Check your inbox at {{ $store.state.user.email }} for the link to confirm your email change.</p>
                </div>
                <div v-else
                     class="align-center"
                >
                    <div v-if="$store.state.user.email == null || $store.state.user.email.length === 0">
                        <p>There's no email address associated with this account.</p>
                        <p>Enter an email address below and, if it's not being used by another LifeScope account already, we'll associate it with this account.</p>
                    </div>
                    <div v-else>
                        <p>The email address currently associated with this account is {{ $store.state.user.email }}</p>
                        <p>If you enter a new address below and click the button, we'll send an email to the current address with a link to confirm the change.</p>
                        <p>The currently-associated email will not be updated unless the confirmation link is followed within 30 minutes of it being sent out, and any other pending requests will be deleted.</p>
                    </div>
                </div>
            </div>
            <div v-if="$data.success === false"
                 class="flexbox flex-column"
            >
                <div class="flex-mobile">
                    <div class="text-box shrink">
                        <input v-model="$data.newEmail"
                               type="text"
                               title="newEmail"
                               placeholder="1234@abcd.com"
                        >
                    </div>

                    <button class="primary"
                            v-on:click="initiateEmailChange"
                    >
                        Change email
                    </button>
                </div>
            </div>

            <div v-if="$data.errors.visible === true"
                 class="errors align-center"
            >
                <div v-if="$data.errors.invalidEmail === true">You must enter a valid email address</div>
                <div v-if="$data.errors.emailUnchanged === true">That's the email already associated with your account</div>
                <div v-if="$data.errors.emailInUse === true">That email is already in use</div>
            </div>
        </div>
    </div>
</template>


<script>
    import _ from 'lodash';

	import userEmailUpdate from '../../apollo/mutations/user-email-update.gql';

	export default {
		data: function() {
			return {
				errors: {
					visible: false,
                    invalidEmail: false,
                    emailInUse: false,
                    emailUnchanged: false
                },
				newEmail: '',
                success: false
            }
        },
		methods: {
			initiateEmailChange: async function() {
				let self = this;

				self.$data.errors.visible = false;
				self.$data.errors.invalidEmail = false;
				self.$data.errors.emailInUse = false;
				self.$data.errors.emailUnchanged = false;

				try {
                    let response = await this.$apollo.mutate({
                        mutation: userEmailUpdate,
                        variables: {
                            new_email: self.newEmail
                        }
                    });
                    
					let user = response.data.userEmailUpdate;

					self.$data.newEmail = '';

					if (self.$store.state.user.email == null || self.$store.state.user.email.length === 0) {
						let tempUser = _.cloneDeep(self.$store.state.user);

						tempUser.email = user.email;

						self.$store.state.user = tempUser;

						self.$emit('close');
					}
					else {
						self.$data.success = true;
					}
				}
				catch(err) {
					self.$data.errors.visible = true;

					if (err.message.indexOf('invalid_email') >= 0) {
						self.$data.errors.invalidEmail = true;
					}

					if (err.message.indexOf('email_unchanged') >= 0) {
						self.$data.errors.emailUnchanged = true;
					}

					if (err.message.indexOf('email_in_use') >= 0) {
						self.$data.errors.emailInUse = true;
					}
                }
			}
		}
	}
</script>
