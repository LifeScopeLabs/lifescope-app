var CONFIG = {};
CONFIG.DEBUG = true;

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}
else {
  if (CONFIG.DEBUG) {console.log("Registering play-gaze...");}
}

AFRAME.registerComponent('play-gaze', {
  schema: {
    button: {default: false},
    position: {default: "0 0 0"},
    rig: {default: 'self'},
    play_image_src: {default: "#video-play"},
    pause_image_src: {default: "#video-pause"}
  },
    init: function () {
      var self = this;
      this.video_el = self.el;
      //this.video = this.video_el.components.material.material.map.image;



      // play when looking at video
      this.el.addEventListener('mouseenter', function (evt) {
        var video = this.components.material.material.map.image;
        if (!video || self.buttonActive) { return; }
        video.play();
        if (CONFIG.DEBUG) {console.log('mouseenter: ', evt.detail);}
      });
  
      // pause when looking away from video
      this.el.addEventListener('mouseleave', function (evt) {
        var video = this.components.material.material.map.image;
        if (!video || self.buttonActive) { return; }
        video.pause();
        if (CONFIG.DEBUG) {console.log('mouseleave: ', evt.detail);}
      });

      // add play/pause button
      if (self.data.button) {
        // Create icon image (play/pause), different image whether video is playing.

        this.play_image = document.createElement("a-image");
        this.play_image.setAttribute('position', this.data.position);
        this.play_image.setAttribute("src", self.data.play_image_src);
        this.play_image.className += " clickable";

        if (!this.video_el.isPlaying) {
          //console.log("this.video_el.paused");
          //console.log(self.data.play_image_src);
          this.play_image.setAttribute("src", self.data.play_image_src);
          self.buttonActive = false;
        } else {
          //console.log("this.video_el.play");
          //console.log(self.data.pause_image_src);
          this.play_image.setAttribute("src", self.data.pause_image_src);
          self.buttonActive = true;
        }

        // Change icon to 'play' on end

        this.video_el.addEventListener("ended", function(){

            self.play_image.setAttribute("src", self.data.play_image_src);

        });

        // Change icon to 'pause' on start.

        this.video_el.addEventListener("pause", function(){

            self.play_image.setAttribute("src", self.data.play_image_src);

        });

        // Change icon to 'play' on pause.

        this.video_el.addEventListener("playing", function(){

            self.play_image.setAttribute("src", self.data.pause_image_src);

        });

        // play on fuse
        this.play_image.addEventListener('click', function (event) {
          if (CONFIG.DEBUG) {console.log("click");}
          var video = self.el.components.material.material.map.image;

          if(!video.paused){
              this.setAttribute("src", self.data.play_image_src);
  
              video.pause();
              self.buttonActive = false;
          }
          else {
              this.setAttribute("src", self.data.pause_image_src);
  
              video.play();
              self.buttonActive = true;
          }
  
        });

        if (self.data.rig === 'self') {
          self.el.appendChild(this.play_image);
        }
        else {
          var videoRig = document.getElementById(self.data.rig);
          videoRig.appendChild(this.play_image);
        }

      }

    }
  });