<template>
    <transition appear
                name="page-load"
    >
        <main>
            <div class="scroller">
                <div class="flexbox flex-grow flex-x-center flex-center">
                    <div class="flexbox flex-column flex-grow flex-center flex-x-center">
                        <img class="logo"
                             src="~/assets/images/icons/Logo.svg"
                        />
                        <div id="signin-choice">
                            <div>Welcome to LifeScope!</div>
                            <div class="flexbox">
                                <div class="signin-button"
                                     v-on:click="signupClick"
                                >
                                    <div class="box-content">
                                        <p>Sign Up</p>
                                    </div>
                                </div>
                                <div class="signin-button provider"
                                     v-on:click="loginClick"
                                >
                                    <div class="box-content">
                                        <p>Log In</p>
                                    </div>
                                </div>
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
	export default {
		data: function() {
			return {
			}
		},

		beforeMount: async function() {
		},

		mounted: async function() {
		},

		updated() {
		},

		methods: {
			signupClick: function() {
				let route = '/signup';

				if (this.$route.query && this.$route.query.client === 'app') {
					route += '?client=app';
                }

				this.$router.push(route);
			},

			loginClick: function() {
				let route = '/login';

				if (this.$route.query && this.$route.query.client === 'app') {
					route += '?client=app';
				}

				this.$router.push(route);
			},
		},
	}
</script>
