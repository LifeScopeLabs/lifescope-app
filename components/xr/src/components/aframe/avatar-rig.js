var CONFIG = {};
CONFIG.DEBUG = true;

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
  }
  else {
    if (CONFIG.DEBUG) {console.log("Registering avatar-rig...");}
  }
  
// links the rotation of an avatar to the camera
//
// <avatar-rig>
//   <avatar/>
//   <camera/>
// <avatar-rig/>
  AFRAME.registerComponent('avatar-rig', {
      schema: {
        camera: { type: "selector" }
      },

      init: function () {
        this.avatar = null;
        if (CONFIG.DEBUG) {
          console.log('avatar-rig init');
          console.log(this);
          console.log(this.el.children);
        }
        for (var i = 0; i < this.el.children.length; i++) {
            if (CONFIG.DEBUG) {console.log("className: " + this.el.children[i].className);};
            if (this.el.children[i].className == "avatar") {
              this.avatar = this.el.children[i];
              if (CONFIG.DEBUG) {console.log(this.avatar);}
              break;
            }        
        }
      },

      tick: function () {
          if (this.avatar) {
            this.avatar.setAttribute('rotation', this.data.camera.getAttribute('rotation'));
          }
      }

    });