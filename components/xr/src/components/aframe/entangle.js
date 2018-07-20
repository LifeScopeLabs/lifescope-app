var CONFIG = {};
CONFIG.DEBUG = true;
if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
  }
  else {
    if (CONFIG.DEBUG) {console.log("Registering entangle...");}
  }
  
  AFRAME.registerComponent('entangle', {
      schema: {
        target: { type: "selector" }
      },

      init: function () {
        var self = this;
  
        // this.el.addEventListener('', function (evt) {
        //   console.log("");
        // });
      },

      tick: function () {
          //console.log(this);
          this.el.setAttribute('rotation', this.data.target.getAttribute('rotation'));
      }

    });