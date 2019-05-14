<template>
  <div id="hud" class="hud">
        <help-menu
            :class="helpClassObject"
            v-hammer:swipe.up.down="(event) => changeHelpVisibility(event)"/>
        <paginator v-if="!isMobile"/>
        <settings/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import HelpMenu from './HelpMenu.vue';
import paginator from './paginator.vue';
import settings from './settings.vue';

export default {
    components: {
        HelpMenu,
        paginator,
        settings
    },

    data() {
        return {
            helpStyleObject: {
                visibility: 'visible',
            },
            helpClassObject: {
                fakehidden: false,
            },
        }
    },

    computed: {
      ...mapState('xr',
      [
        'isMobile',
      ])
    },

    methods: {
        changeHelpVisibility(event) {
            // if (CONFIG.DEBUG) {console.log("changeHelpVisibility");}
            switch (event.direction) {
                case 8: // up
                    this.helpClassObject.fakehidden = true;
                    break;
                case 16: // down
                    this.helpClassObject.fakehidden = false;
                    break;
            };
        },
    }
}
</script>

<style src="./hud.css"></style>
