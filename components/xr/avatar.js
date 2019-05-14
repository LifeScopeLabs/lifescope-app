export default class Avatar {
    constructor() {
    }

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

      }

      addAvatarRigTemplate() {
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
      }


      createNetworkedPlayer() {
        var frag = this.fragmentFromString(`
        <a-entity id="playerRig"
          position="0 1.6 -2"
          wasd-controls
          networked="template:#avatar-rig-template;attachTemplateToLocal:true;"
          
          character-controller="pivot: #player-camera"
          >
         
         <a-entity id="player-camera"
            class="camera"
            camera
            pitch-yaw-rotator
          >
          
          
          
          </a-entity>
          <a-entity id="rightHandRig"
            class="hand"
          ></a-entity>
        </a-entity>`);
        document.getElementsByTagName('a-scene')[0].appendChild(frag);
      }


      createRightHandNetworked() {
        // if (CONFIG.DEBUG) {console.log("creating networked right hand");}
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
      }

      fragmentFromString(strHTML) {
            return document.createRange().createContextualFragment(strHTML);
      }
  }