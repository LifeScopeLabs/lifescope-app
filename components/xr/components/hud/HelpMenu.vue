<template>
    <div class="help-menu" :style="helpStyleObject" :class="{ 'desktop-menu': !isMobile, 'mobile-menu': isMobile }">
        <div class="help-controls">
            <ul class="desktop-controls" v-if="!isMobile">
                <h2> Controls </h2>
                <li> <b>H - </b> toggle help menu </li>

                <li> <b>G - </b> toggle graphics settings menu </li>

                <li> <b> WASD - </b> movement controls </li>

                <li> <b> click and drag </b> to look around </li>

                <li> <b> hover room name </b> to select new room </li>
            </ul>

            <ul class="mobile-controls" v-if="isMobile" >
                <h2> Controls </h2>
                <li> <b> swipe up/down </b> toggle help menu </li>

                <!-- <li> <b> swipe up </b> toggle graphics settings menu </li> -->

                <li> <b> joysticks at bottom of screen </b> movement controls </li>

                <li> <b> rotate mobile device </b> to look around </li>

            </ul>
        </div>

    </div> 

</template>

<script>
import { mapState } from 'vuex';

export default {

    data() {
        return {
            helpStyleObject: {
                visibility: 'visible',
            },
        }
    },

    computed: {
      ...mapState('xr',
      [
        'isMobile',
      ])
    },

    mounted() {
        var self = this;

        document.body.addEventListener('keypress', function(evt) {
            if (evt.key == 'h') {
                self.toggleHelpVisibility();
            }
        });
    },

    methods: {
        toggleHelpVisibility() {
            // if (CONFIG.DEBUG) {console.log("toggleHelpVisibility");}
            this.helpStyleObject.visibility = 
                this.helpStyleObject.visibility == 'visible' ?
                'hidden' : 'visible';
        }
    },
}
</script>

<style src="./HelpMenu.css"></style>
