<template>
    <div id="body"
         v-bind:class="[{ authenticated: $store.getters.authenticated }, $store.getters.theme, $store.state.pageName]"
    >
        <vue-header></vue-header>

        <vue-menu></vue-menu>

        <vue-aside></vue-aside>

        <vue-main></vue-main>

        <location-tracking></location-tracking>

        <!--<cookie-consent></cookie-consent>-->
    </div>
</template>

<script>
	// import CookieConsent from '../components/cookie-consent.vue';
	import LocationTracking from '../components/location-tracking.vue';
	import VueHeader from '../components/header.vue';
	import VueMenu from '../components/menu.vue';
	import VueAside from '../components/aside.vue';
	import VueMain from '../components/main/providers.vue';

	export default {
		components: {
			// CookieConsent: CookieConsent,
			LocationTracking: LocationTracking,
			VueAside: VueAside,
			VueHeader: VueHeader,
			VueMenu: VueMenu,
			VueMain: VueMain
		}
	}
</script>
