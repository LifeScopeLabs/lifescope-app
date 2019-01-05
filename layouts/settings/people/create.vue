<template>
    <div id="body" v-bind:class="[{ authenticated: $store.getters.authenticated }, $store.getters.theme, $store.state.pageName]">
        <vue-header></vue-header>

        <vue-menu></vue-menu>

        <vue-main></vue-main>

        <location-tracking></location-tracking>

        <!--<cookie-consent></cookie-consent>-->
    </div>
</template>

<script>
	// import CookieConsent from '../../components/cookie-consent';
  import LocationTracking from '../../../components/location-tracking';
	import VueHeader from '../../../components/header';
	import VueMenu from '../../../components/menu';
	import VueMain from '../../../components/main/settings';

	export default {
		components: {
			// CookieConsent: CookieConsent,
      LocationTracking: LocationTracking,
			VueHeader: VueHeader,
			VueMenu: VueMenu,
			VueMain: VueMain
		}
	}
</script>
