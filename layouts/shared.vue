<template>
  <div id="body" v-bind:class="[$store.getters.theme, $store.state.pageName, $store.state.view]">
    <vue-header></vue-header>

    <vue-menu></vue-menu>

    <vue-aside></vue-aside>

    <vue-main></vue-main>

    <location-tracking></location-tracking>

    <!--<cookie-consent></cookie-consent>-->
  </div>
</template>

<script>
  import CookieConsent from '../components/cookie-consent';
  import LocationTracking from '../components/location-tracking';
  import VueHeader from '../components/header';
  import VueMenu from '../components/menu';
  import VueAside from '../components/aside';
  import VueMain from '../components/main/explorer';

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
