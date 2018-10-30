<template>
  <a-scene embedded :networked-scene="'serverURL: https://nxr.lifescope.io; app: lifescope-app; room: '+ roomName + '; audio: true; adapter: janus; connectOnLoad: true;'">

    <a-assets class="aframe-assets">
      <img id="sky" src="../../static/images/nightsky.jpg">
      <img id="floor" src="../../static/images/floor.jpg">
      <img id="earth" src="../../static/earth/Albedo.jpg">
      <img id="video-play" src="../../static/video/video_play.png">
      <img id="video-pause" src="../../static/video/video_pause.png">
      <a-gltf-model id="logo" src="https://s3.amazonaws.com/lifescope-static/static/xr/logo/logo.gltf" crossorigin="anonymous"></a-gltf-model>
    </a-assets>

    <gallery />

    <a-sky src="#sky" rotation="90 0 90">
    </a-sky>

  </a-scene>
</template>

<script>

import axios from 'axios';

import socketIO from 'socket.io-client';
import easyrtc from '../../static/easyrtc/easyrtc.js';

import gallery from "./gallery.vue";

import {mappings, inputActions} from '../../lib/aframe/input-mappings';
import specialCharacters from "../../lib/util/specialcharacters.js";

// TODO: fix CONFIG (working with webpack) for debug
var CONFIG = {};
CONFIG.DEBUG = true;
import debugListeners from '../../lib/dev/listeners.js';

if (CONFIG.DEBUG) {console.log("from gallery-container.vue <script>");}
export default {
    components: {
        gallery
    },

    beforeCreate () {
      if (CONFIG.DEBUG) {console.log("beforeCreate");};
    },

    created () {
      if (CONFIG.DEBUG) {console.log("created");};
    },

    beforeMount () {
      if (CONFIG.DEBUG) {console.log("beforeMount");};
    },

    mounted () {
      if (CONFIG.DEBUG) {console.log("App.vue mounted");};

      // set userHeight after a-scene is available
      document.body.addEventListener('renderstart', function (evt) {
        if (CONFIG.DEBUG) {console.log('renderstart');};
        AFRAME.scenes[0].renderer.vr.userHeight = 0;
        AFRAME.registerInputActions(inputActions, 'default');
        AFRAME.registerInputMappings(mappings);
      });

      // Add hand when user enters vr mode
      var self = this;
      document.body.addEventListener('enter-vr', function (evt) {
        if (CONFIG.DEBUG) {console.log('entered vr');};
        var rightHand = document.getElementById('rightHandController');
        if (rightHand == null) {
          if (CONFIG.DEBUG) {console.log('adding hand...');};
          self.createRightHandNetworked();
        }
      });

      document.body.addEventListener('connected', function (evt) {
        console.log('connected event. clientId =', evt.detail.clientId);
        console.log('roomName: ' + self.roomName);
      });

      // make eyes invisible to user when the avatar is created
      document.body.addEventListener('entityCreated', function (evt) {
        //console.log('entityCreated event. detail:');
        //console.log(evt.detail);
        
        if (evt.detail.el.id === 'playerRig') {
          document.getElementsByClassName('player')[0].getElementsByClassName('face')[0].setAttribute('visible', 'false');
          document.getElementsByClassName('player')[0].getElementsByClassName('head')[0].setAttribute('visible', 'false');
        }
      });
      
      this.createAvatarRigTemplate();
      this.addAvatarRigTemplate();
      this.createNetworkedPlayer();

      if (AFRAME.utils.device.isMobile()) {
        if (CONFIG.DEBUG) {console.log("isMobile");};
        var playerRig = document.getElementById('playerRig');
        playerRig.setAttribute("virtual-gamepad-controls", {});
        var camera = document.getElementById('player-camera');
        var sceneEl = AFRAME.scenes[0];
        //this.eventHandlers.push(new TouchEventsHandler(this.cursor, this.cameraController, this.cursor.el));
        //camera.setAttribute("pitch-yaw-rotator");
        sceneEl.setAttribute("look-on-mobile", "camera", camera);
        sceneEl.setAttribute("look-on-mobile", "verticalLookSpeedRatio", 3);
      } else {
        if (CONFIG.DEBUG) {console.log("!isMobile");};
        var playerRig = document.getElementById('playerRig');
        playerRig.setAttribute("look-controls", "reverseMouseDrag:true");
      }
    },

    computed: {
      roomName: function() {
        //var testname = '//!"#$%&\'() *+,\\/:;<=>?@[]^_`{|}~'; 
        var name = this.$store.state.user._id;
        return name.replace(/[!"#$%&'()*+,-.\\\/:;<=>?@\[\]^_`{|}~]/g, function(match) {return specialCharacters[match]; });
      },
    },

    methods: {
      
      createAvatarRigTemplate() {
        var frag = this.fragmentFromString(`
        <template id="avatar-rig-template" v-pre>
          <a-entity class="player">

            <a-entity class="avatar" networked-audio-source >
              <a-sphere class="head"
                color="#5985ff"
                scale="0.45 0.5 0.4"
              ></a-sphere>
              <a-entity class="face"
                position="0 0.05 0"
              >
                <a-sphere class="eye"
                  color="#efefef"
                  position="0.16 0.1 -0.35"
                  scale="0.12 0.12 0.12"
                >
                  <a-sphere class="pupil"
                    color="#000"
                    position="0 0 -1"
                    scale="0.2 0.2 0.2"
                  ></a-sphere>
                </a-sphere>
                <a-sphere class="eye"
                  color="#efefef"
                  position="-0.16 0.1 -0.35"
                  scale="0.12 0.12 0.12"
                >
                  <a-sphere class="pupil"
                    color="#000"
                    position="0 0 -1"
                    scale="0.2 0.2 0.2"
                  ></a-sphere>
                </a-sphere>
              </a-entity>
            </a-entity>

          </a-entity>
        </template> 
        `);

        document.getElementsByClassName('aframe-assets')[0].appendChild(frag);

      },

      addAvatarRigTemplate() {
        if (CONFIG.DEBUG) {console.log("addAvatarRigTemplate");};
        NAF.schemas.add({
          template: '#avatar-rig-template',
          components: [
            {
              component: 'position'
            },
            {
              component: 'rotation'
            },
            {
              selector: '.avatar',
              component: 'rotation'
            }
          ]
       });
      },

      createNetworkedPlayer() {
        var frag = this.fragmentFromString(`
        <a-entity id="playerRig"
          position="0 1.6 -2"
          wasd-controls
          networked="template:#avatar-rig-template;attachTemplateToLocal:true;"
          character-controller="pivot: #player-camera"
          avatar-rig="camera:#player-camera;"
          >
         
         <a-entity id="player-camera"
            class="camera"
            camera
            pitch-yaw-rotator
          >
          
          <a-gui-cursor id="cursor"
					  raycaster="far: 1;interval: 1000; objects: gui-interactable, .clickable"
					  fuse="true" fuse-timeout="4000"
					  design="dot"
			      >
			    </a-gui-cursor>
          
          </a-entity>
          <a-entity id="rightHandRig"
            class="hand"
          ></a-entity>
        </a-entity>`);
        document.getElementsByTagName('a-scene')[0].appendChild(frag);
      },


      createRightHandNetworked() {
        var frag = this.fragmentFromString(`
        <a-entity id="rightHandController"
           teleport-controls="cameraRig: #playerRig; teleportOrigin: #player-camera; startEvents: teleportstart; endEvents: teleportend; collisionEntities:.boundry; landingNormal: 0 0 1;"
            daydream-controls="hand: right;"
            oculus-touch-controls="hand: right"
            vive-controls="hand: right"
            windows-motion-controls="hand: right"
            gearvr-controls="hand: right"
            oculus-go-controls="hand: right">
         </a-entity>`);
        document.getElementById('playerRig').appendChild(frag);
      },

      fragmentFromString(strHTML) {
            return document.createRange().createContextualFragment(strHTML);
      },

    }
  }
</script>

<style src="../../lib/aframe/ionicon.css"></style>