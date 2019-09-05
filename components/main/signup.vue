<template>
    <transition appear
                name="page-load"
    >
        <main>
            <div class="scroller">
                <div class="flexbox flex-grow flex-x-center flex-center">
                    <div v-if="$store.state.mode === 'signup-choice'"
                         class="flexbox flex-column flex-grow flex-center flex-x-center"
                    >
                        <img class="logo"
                             src="~/assets/images/icons/Logo.svg"
                        />
                        <div id="signup-choice">
                            <h1>You can sign up for LifeScope in two ways:</h1>

                            <h4>
                                (By signing up for LifeScope, you agree to the
                                <a target="_blank"
                                   href="https://lifescope.io/terms"
                                >
                                    Terms of Service
                                </a>
                                and
                                <a target="_blank"
                                   href="https://lifescope.io/privacy"
                                >
                                    Privacy Policy
                                </a>
                                )
                            </h4>
                            <div class="flexbox">
                                <div class="signup-button email"
                                     v-on:click="emailClick"
                                >
                                    <div class="box-content">
                                        <p>Email</p>
                                        <p class="subtext">You can be emailed a link to complete the signup process</p>
                                    </div>
                                </div>
                                <div class="signup-button provider"
                                     v-on:click="providerClick"
                                >
                                    <div class="box-content">
                                        <p>Social Login</p>
                                        <p class="subtext">
                                            You can sign up using a Facebook/Google/Spotify/etc. account
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button class="opposite"
                                    v-on:click="goToLogin"
                            >
                                Log In to existing account
                            </button>
                        </div>
                    </div>
                    <div v-else-if="$store.state.mode === 'signup-email'"
                         id="signup"
                    >
                        <div v-if="$data.signupSuccess !== true">
                            <div class="flexbox flex-grow flex-column flex-center flex-x-center">
                                <img class="logo"
                                     src="~/assets/images/icons/Logo.svg"
                                />
                                <h3>
                                    Enter your email address below and read and accept LifeScope's
                                    <a target="_blank"
                                       href="https://lifescope.io/terms"
                                    >Terms of Service
                                    </a>
                                    and
                                    <a target="_blank"
                                       href="https://lifescope.io/privacy"
                                    >Privacy Policy
                                    </a>
                                    .
                                    You will be emailed a link to complete your signup process.
                                </h3>
                            </div>
                            <div id="email-form">
                                <div class="text-box flex-grow">
                                    <input v-model="$data.email"
                                           type="text"
                                           name="email"
                                           placeholder="Enter your email address"
                                    />
                                </div>

                                <label class="term-agreement">
                                    <input v-model="$data.termsAccepted"
                                           type="checkbox"
                                           v-bind:value="$data.termsAccepted"
                                    />
                                    I agree to the LifeScope
                                    <a target="_blank"
                                       href="https://lifescope.io/terms"
                                    >
                                        Terms of Service
                                    </a>
                                    and
                                    <a target="_blank"
                                       href="https://lifescope.io/privacy"
                                    >
                                        Privacy Policy
                                    </a>
                                </label>

                                <label class="newsletter-agreement">
                                    <input v-model="$data.newsletter"
                                           type="checkbox"
                                           v-bind:value="$data.newsletter"
                                    />
                                    I would like to receive the LifeScope newsletter
                                </label>

                                <div v-if="$data.errors.visible === true"
                                     class="errors"
                                >
                                    <div v-if="$data.errors.invalidEmail === true">
                                        You must enter a valid email address
                                    </div>
                                    <div v-if="$data.errors.termsNotAccepted === true">
                                        You must agreee to the ToS and Privacy Policy
                                    </div>
                                    <div v-if="$data.errors.emailInUse === true">
                                        That email is already in use
                                    </div>
                                </div>

                                <button class="primary"
                                        type="submit"
                                        v-on:click="submitSignup"
                                >
                                    Sign up
                                </button>
                                <button class="back"
                                        v-on:click="backToSignupChoice"
                                >
                                    Go back
                                </button>
                            </div>
                        </div>
                        <div v-else>
                            <div class="flexbox flex-grow flex-column flex-center flex-x-center">
                                <img class="logo"
                                     src="~/assets/images/icons/Logo.svg"
                                />
                                <h3>
                                    Check your email for a link to complete the signup process.
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <modals-container />
        </main>
    </transition>
</template>

<script>
    /* global $ */
	export default {
		data: function() {
			return {
				email: "",
				termsAccepted: false,
				signupSuccess: false,
				errors: {
					visible: false,
					invalidEmail: false,
					termsNotAccepted: false,
					emailInUse: false
				}
			}
		},

		beforeMount: async function() {
		},

		mounted: async function() {
		},

		updated() {
		},

		methods: {
			backToSignupChoice: function() {
				this.$router.push('/signup');
			},

			emailClick: function() {
				this.$router.push('/signup/email');
			},

			goToLogin: function() {
				this.$router.push('/login');
			},

			providerClick: function() {
				this.$router.push('/signup/provider')
			},

			submitSignup: function() {
				let self = this;

				self.$data.errors.visible = false;
				self.$data.errors.invalidEmail = false;
				self.$data.errors.termsNotAccepted = false;
				self.$data.errors.emailInUse = false;

				$.ajax({
					url: 'https://api.lifescope.io/signup/send-email',
					method: 'POST',
					xhrFields: {
						withCredentials: true
					},
					data: JSON.stringify({
						email: self.$data.email,
						terms_accepted: self.$data.termsAccepted,
						newsletter: self.$data.newsletter
					}),
					contentType: 'application/json',
				})
					.done(function() {
						self.$data.signupSuccess = true;
					})
					.fail(function(err) {
						let errors = err.responseJSON.message.split(',');

						self.$data.errors.visible = true;

						if (errors.indexOf('invalid_email') >= 0) {
							self.$data.errors.invalidEmail = true;
						}

						if (errors.indexOf('terms_not_accepted') >= 0) {
							self.$data.errors.termsNotAccepted = true;
						}

						if (errors.indexOf('email_in_use') >= 0) {
							self.$data.errors.emailInUse = true;
						}
					});
			}
		},
	}
</script>
