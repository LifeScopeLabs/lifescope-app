<template>
    <div id="body" v-bind:class="[{ authenticated: $store.getters.authenticated }, $store.state.pageName]">
        <vue-header></vue-header>

        <vue-menu></vue-menu>

        <vue-main></vue-main>

        <cookie-consent></cookie-consent>
    </div>
</template>

<script>
	import CookieConsent from '../../components/cookie-consent';
	import VueHeader from '../../components/header';
	import VueMenu from '../../components/menu';
	import VueMain from '../../components/main/settings';

	export default {
		components: {
			CookieConsent: CookieConsent,
			VueHeader: VueHeader,
			VueMenu: VueMenu,
			VueMain: VueMain
		}
	}
</script>
