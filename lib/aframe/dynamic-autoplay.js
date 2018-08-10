var CONFIG = {};
CONFIG.DEBUG = false;
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}
else {
  if (CONFIG.DEBUG) {console.log("Registering dynamic-autoplay...");}
}

AFRAME.registerComponent('dynamic-autoplay', {
    schema: {
      // Type will be inferred to be boolean.
      default: true
    },
    init: function () {
      var self = this;
      this.video_el = self.el;

      this.el.addEventListener('materialvideoloadeddata', function (evt) {
        if (CONFIG.DEBUG) {console.log("materialvideoloadeddata");}
        var video = this.components.material.material.map.image;
        if (self.data) { 
          //https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
          // can't video.play() before user interacts with domain
          video.autoplay = true;
        }
        else {
          video.pause();
        }
        
      });

    }
  });