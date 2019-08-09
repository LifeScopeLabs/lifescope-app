<template>
    <transition appear
                name="page-load"
    >
        <main>
            <div class="scroller">
                <div class="flexbox flex-grow flex-x-center flex-center"
                     style="margin-top: 1em"
                >
                    <div v-if="$store.state.mode === 'login-choice'"
                         class="flexbox flex-column flex-grow flex-center flex-x-center"
                    >
                        <img class="logo"
                             src="~/assets/images/icons/black_LOGO.svg"
                        />
                        <div id="login-choice">
                            <h1>You can log into LifeScope in two ways:</h1>
                            <div class="flexbox">
                                <div class="login-button email"
                                     v-on:click="emailClick"
                                >
                                    <div class="box-content">
                                        <p>Email</p>
                                        <p class="subtext">You can be emailed a link to the email associated with your LifeScope account</p>
                                    </div>
                                </div>
                                <div class="login-button provider"
                                     v-on:click="providerClick"
                                >
                                    <div class="box-content">
                                        <p>Social Login</p>
                                        <p class="subtext">You can log in using a Facebook/Google/Spotify/etc. account associated with your LifeScope account</p>
                                    </div>
                                </div>
                            </div>
                            <button class="opposite"
                                    v-on:click="goToSignup"
                            >
                                Sign up for a new account
                            </button>
                        </div>
                    </div>
                    <div v-else-if="$store.state.mode === 'login-email'"
                         id="login"
                    >
                        <div v-if="$data.loginSuccess !== true">
                            <div class="flexbox flex-grow flex-column flex-center flex-x-center">
                                <img class="logo"
                                     src="~/assets/images/icons/black_LOGO.svg"
                                />
                                <h3>
                                    Enter your email address below.
                                    You will be emailed a link to complete the login process.
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

                                <div v-if="$data.errors.visible === true"
                                     class="errors"
                                >
                                    <div v-if="$data.errors.invalidEmail === true">You must enter a valid email address</div>
                                    <div v-if="$data.errors.emailNotInUse === true">That email is not associated with a LifeScope account</div>
                                </div>

                                <button class="primary"
                                        type="submit"
                                        v-on:click="submitlogin"
                                >
                                    Log In
                                </button>
                                <button class="back"
                                        v-on:click="backToLoginChoice"
                                >
                                    Go back
                                </button>
                            </div>
                        </div>
                        <div v-else>
                            <div class="flexbox flex-grow flex-column flex-center flex-x-center">
                                <img class="logo"
                                     src="~/assets/images/icons/black_LOGO.svg"
                                />
                                <h3>
                                    Check your email for a link to complete the login process.
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                <modals-container />
            </div>
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
                loginSuccess: false,
                errors: {
					visible: false,
                    invalidEmail: false,
                    emailNotInUse: false
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
			backToLoginChoice: function() {
				this.$router.push('/login');
            },

			emailClick: function() {
                this.$router.push('/login/email');
            },

            goToSignup: function() {
				this.$router.push('/signup');
            },

            providerClick: function() {
				this.$router.push('/login/provider')
            },

			submitlogin: function() {
				let self = this;

				self.$data.errors.visible = false;
				self.$data.errors.invalidEmail = false;
				self.$data.errors.emailNotInUse = false;

				$.ajax({
					url: 'https://api.lifescope.io/login/send-email',
					method: 'POST',
                    xhrFields: {
						withCredentials: true
                    },
					data: JSON.stringify({
                        email: self.$data.email
                    }),
                    contentType: 'application/json',
				})
                    .done(function() {
                        self.$data.loginSuccess = true;
                    })
                    .fail(function(err) {
                        let errors = err.responseJSON.message.split(',');

                        self.$data.errors.visible = true;

                        if (errors.indexOf('invalid_email') >= 0) {
                            self.$data.errors.invalidEmail = true;
                        }

                        if (errors.indexOf('email_not_in_use') >= 0) {
                            self.$data.errors.emailNotInUse = true;
                        }
                    });
            }
		},
	}
</script>
