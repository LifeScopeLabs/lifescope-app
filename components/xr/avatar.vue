<template>
  <a-entity id="playerRig"
          position="0 1.6 -2"
          >
         
         <a-entity id="player-camera"
            class="camera"
            camera
          >
          </a-entity>
    </a-entity>
</template>

<script>

export default {
    methods: {
        setupDesktop() {
            console.log("setupDesktop");
            var playerRig = document.getElementById('playerRig');
            try {
                if (playerRig) {
                    playerRig.setAttribute("wasd-controls", {'enabled': true, 'acceleration': 100});
                    playerRig.setAttribute("look-controls", 'reverseMouseDrag', true);
                }
                else {
                    console.log("failed to set controls on playerRig");
                }
            }
            catch (e) {
                console.log("failed to set controls on playerRig");
                console.log(e);
            }
        },

        setupMobile() {
            console.log("setupMobile");
            var playerRig = document.getElementById('playerRig');
            var camera = playerRig.querySelector('#player-camera');
            var sceneEl = document.getElementsByTagName('a-scene')[0];
            try {
                if (playerRig) {
                    playerRig.setAttribute("character-controller", {'pivot': "#player-camera"});
                    playerRig.setAttribute("virtual-gamepad-controls", {});
                    camera.setAttribute('pitch-yaw-rotator', {});
                    sceneEl.setAttribute("look-on-mobile", "camera", camera);
                    // sceneEl.setAttribute("look-on-mobile", "verticalLookSpeedRatio", 3);
                }
                else {
                    console.log("failed to set controls on playerRig");
                }
            }
            catch (e) {
                console.log("failed to set controls on playerRig");
                console.log(e);
            }
        },
    }
}
</script>