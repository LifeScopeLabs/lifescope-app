<template>
  <a-scene :networked-scene="'app: myApp; room: ' + roomName + '; debug: true; audio: true; adapter: easyrtc; connectOnLoad: true;'">

    <!-- Load assets -->
    <a-assets class="assets-sky">
      <img id="sky" src="https://s3.amazonaws.com/lifescope-static/xr/gallery/skybox/nightsky.jpg"
      crossorigin="anonymous">
    </a-assets>

    <a-assets class="assets-floor">
      <img id="floor" src="https://s3.amazonaws.com/lifescope-static/xr/gallery/floor/wood-panel.jpg"
      crossorigin="anonymous">
    </a-assets>

    <a-assets class="assets-earth">
      <img id="earth" src="https://s3.amazonaws.com/lifescope-static/xr/components/globe/Albedo.jpg"
      crossorigin="anonymous">
    </a-assets>

    <!-- gltf -->
    <a-assets class="assets-gltf">
      <!-- logo -->
      <a-gltf-model id="logo" src="https://s3.amazonaws.com/lifescope-static/xr/logo/logo.gltf"
                    crossorigin="anonymous">
      </a-gltf-model>
    </a-assets>

    <!-- Geojson -->
    <a-assets class="assets-geo" id="geo-assets">
    </a-assets>

    <!-- Load assets with imageLoader -->
    <!-- https://www.pexels.com/search/travel/ -->
    <imageLoader :LSObjs='LSObjs'/>

    <!-- Avatar Template -->
    <a-assets class="assets-avatar" v-pre>
    </a-assets>

        
    
     <!-- Player -->
    <a-entity id="player-rig"
          movement-controls="speed:0.05"
          position="0 0 0">
      <a-entity id="player" camera position="0 1.3 0" wasd-controls="reverseMouseDrag:true" look-controls touch-controls="reverseMouseDrag:true" networked="template:#avatar-template;attachTemplateToLocal:true;">
      </a-entity>
    </a-entity>

    <!-- gallery -->
    <gallery :LSObjs='LSObjs'/>

    <!-- Sky   change id to class?-->
    <a-sky id="Sky" src="#sky" rotation="90 0 90">
    </a-sky>

  </a-scene>
</template>

<script>
import axios from 'axios';

import gallery from "./components/gallery.vue";
import imageLoader from "./components/util/image-loader.vue";

// import easyrtc from 'easyrtc';
// import socketIO from 'socket.io';

console.log("from App.vue <script>")
export default {
    components: {
        gallery,
        imageLoader
    },
    data() {
      return {
        LSObjs: [],
        searchData: [],
        roomName: 'ls-room'
      }
    },

    beforeCreate () {
      console.log("beforeCreate")
      //debugger;
    },

    created () {
      console.log("created");
      //debugger;
      //console.log(this.$store.state.objects);
    },

    beforeMount () {
      console.log("beforeMount");
      // debugger;
    },

    mounted () {
      console.log("mounted");
      // debugger;

      document.body.addEventListener('connected', function (evt) {
        console.log('connected event. clientId =', evt.detail.clientId);
        document.getElementById('player').setAttribute('visible', 'false');
        console.log(this.roomName);
      });
      
      this.createAvatarTemplate();
      this.addAvatarTemplate();


      this.getObjs().then((res) => {
        this.LSObjs = res.LSObjs;
        }
      );
        
      //debugger;
      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been rendered
        console.log("mounted nextTick")
        })
    },


    methods: {

      getObjs () {
        console.log("getObjs");
        //debugger; // eslint-disable-line

        return axios.get("/test/content.json")
        .then((res) => {
          var result = [];
          //console.log(res.data);
          var someData = res.data.forEach(element => {
          //var item = new context.store.state.LSObjs.Content(element);
          result.push(element);
            //console.log(item instanceof context.app.LSObj.LSObj);
            //console.log(item)
          });
          return { LSObjs: result }
        })
      },

      createAvatarTemplate() {
        var frag = this.fragmentFromString(`
        <template id="avatar-template" v-pre>
          <a-entity class="avatar" networked-audio-source>
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
        </template> 
        `);

        document.getElementsByClassName('assets-avatar')[0].appendChild(frag);

      },

      addAvatarTemplate() {
        console.log("addAvatarTemplate");
        NAF.schemas.add({
          template: '#avatar-template',
          components: [
            'position',
            'rotation',
            {
              selector: '.head',
              component: 'material',
              property: 'color'
            }
          ]
       });
      },

      fragmentFromString(strHTML) {
            return document.createRange().createContextualFragment(strHTML);
      },
      
      myOnConnect() {
        console.log("Networked-scene connected");
      }

    }
    
  }
</script>