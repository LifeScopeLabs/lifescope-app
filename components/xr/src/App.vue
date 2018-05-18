<template>
  <a-scene embedded>

    <!-- Load assets -->
    <a-assets class="assets-sky">
      <img id="sky" src="../static/images/nightsky.jpg">
    </a-assets>

    <a-assets class="assets-floor">
      <img id="floor" src="../static/images/floor.jpg">
    </a-assets>

    <a-assets class="assets-earth">
      <img id="earth" src="../static/earth/Albedo.jpg">
    </a-assets>

    <!-- Geojson -->
    <a-assets class="assets-geo" id="geo-assets">
    </a-assets>

    <!-- Load assets with imageLoader -->
    <!-- https://www.pexels.com/search/travel/ -->
    <imageLoader :LSObjs='LSObjs' />

    <!-- Avatar Template -->
    <a-assets class="assets-avatar" v-pre>
        <!-- avatar template -->
          <!-- <avatarComponent/> -->
    </a-assets>

        
    
        <!-- Player -->
        <!-- <a-entity id="player" camera position="0 1.3 0" wasd-controls look-controls networked="template:#avatar-template;attachTemplateToLocal:true;">
        </a-entity> -->

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

   
console.log("from App.vue <script>")
export default {
    components: {
        gallery,
        imageLoader
    },
    data() {
      return {
        LSObjs: [],
        searchData: []
      }
    },

    beforeCreate () {
      console.log("beforeCreate")
      //debugger;
    },

    created () {
      console.log("created");
      //debugger;
      console.log(this.$store.state.objects);
    },

    beforeMount () {
      console.log("beforeMount");
      // debugger;
    },

    mounted () {
      console.log("mounted");
      //this.addAvatarTemplate();
      // debugger;
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
          console.log(res.data);
          var someData = res.data.forEach(element => {
          //var item = new context.store.state.LSObjs.Content(element);
          result.push(element);
            //console.log(item instanceof context.app.LSObj.LSObj);
            //console.log(item)
          });
          return { LSObjs: result }
        })
      },

      addAvatarTemplate() {
        this.createAvatarTemplate();
        this.addAvatarTemplate1();
        this.createPlayer();
        this.networkPlayer();
      },

      createPlayer() {
        console.log('createPlayer');
        var p = document.createElement('a-entity');
        p.id = "player";
        p.setAttribute('camera', '');
        p.setAttribute('v-pre', '');
        var pos = p.getAttribute('position');
        pos.y = 1.3;
        p.setAttribute('position', pos);
        debugger;
        p.setAttribute('wasd-controls', '');
        p.setAttribute('look-controls', '');
        document.getElementsByTagName('a-scene')[0].appendChild(p);
      },

      networkPlayer() {
        console.log("networkPlayer");
        var player = document.getElementById('player');
        debugger;
        player.setAttribute("networked", "template:#avatar-template;attachTemplateToLocal:true;");
        debugger;
      },

      createAvatarTemplate() {
            console.log("createAvatarTemplate");
            var assets = document.getElementsByClassName('assets-avatar')[0];

            var at = document.createElement("template");
            at.id = "avatar-template";

            var avatar = document.createElement("a-entity");
            avatar.classList.add('avatar');
            
            // head
            var head = document.createElement("a-sphere");
            head.classList.add("head");
            head.setAttribute('color', '#5985ff');
            var sc = head.getAttribute('scale');
            sc.x = 0.45;
            sc.y = 0.5;
            sc.z = 0.4;
            var newScale = {
              x: '0.45',
              y: '0.5',
              z: '0.4'
            };
            var newScaleNum = {
              x: 0.45,
              y: 0.5,
              z: 0.4
            };
            var vector = new THREE.Vector3( 0.45, 0.5, 0.4 );
            debugger;
            head.setAttribute('scale', vector);
            
            debugger;
            // head.setAttribute('scale', 'x', '0.45');
            // head.setAttribute('scale', 'x', '0.45');
            // head.setAttribute('scale', 'y', '0.5');
            // head.setAttribute('scale', 'y', '0.5');
            // head.setAttribute('scale', 'z', '0.4');
            // head.setAttribute('scale', 'z', '0.4');

            // // face
            // var face = document.createElement("a-entity");
            // face.classList.add("face");
            // face.setAttribute('position', "1 1 1");//"0 .05 0");

            // // lEye
            // var lEye = document.createElement("a-sphere");
            // lEye.classList.add("eye");
            // lEye.setAttribute('color', '#0000ff');//'#efefef');
            // lEye.setAttribute('scale', '1 1 1');//"0.16 0.1 -0.35");
            // lEye.setAttribute('position', "0 .05 0");

            // // lPupil
            // var lPupil = document.createElement("a-sphere");
            // lPupil.classList.add("pupil");
            // lPupil.setAttribute('color', '#5985ff');//'#000');
            // lPupil.setAttribute('scale', "0.2 0.2 0.2");
            // lPupil.setAttribute('position', "0 0 -1");

            // // rEye
            // var rEye = document.createElement("a-sphere");
            // rEye.classList.add("eye");
            // rEye.setAttribute('color', '#5985ff');//'#efefef');
            // rEye.setAttribute('scale', "-0.16 0.1 -0.35");
            // rEye.setAttribute('position', "0 .05 0");

            // // rPupil
            // var rPupil = document.createElement("a-sphere");
            // rPupil.classList.add("pupil");
            // rPupil.setAttribute('color', '#5985ff');//'#000');
            // rPupil.setAttribute('scale', "0.2 0.2 0.2");
            // rPupil.setAttribute('position', "0 0 -1");

    
            //lEye.appendChild(lPupil);
            //rEye.appendChild(rPupil);
            //face.appendChild(lEye);
            //face.appendChild(rEye);
            
            avatar.appendChild(head);
            //avatar.appendChild(face);

            // https://stackoverflow.com/questions/25981255/defining-a-shadow-dom-template-in-javascript
            at.content.appendChild(avatar);

            debugger;
            assets.appendChild(at);
        },

      addAvatarTemplate1() {
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

    

      
      
      myOnConnect() {
        console.log("Networked-scene connected");
      }

    }
    
  }
</script>