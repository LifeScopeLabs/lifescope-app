if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
  }
  else {
    if (CONFIG.DEBUG) {console.log("Registering sun-sky-position...");}
  }

import TimeUtils from '../../util/TimeUtils.js';

AFRAME.registerComponent('sun-sky-position', {
    schema: {
        starttime: {type: 'number', default: 10},
        updaterate: {type: 'number', default: 1},
        duration: {type: 'number', default: 1},
    },

    init: function () {
        this.clocktime = this.data.starttime;
        this.lastUpdate = 0;
        this.animating = false;
        this.updateSunPosition();
    },

    update: function (oldData) {
        var self = this;

        if (this.data.starttime != oldData.starttime) {
            this.animateSun(self.clocktime, self.data.starttime);
        }
    },

    tick: function (time, timeDelta) {
        if (this.animating) {
            this.updateSunPosition();
            return;
        }

        var updateInterval = 1000 * (60) / this.data.updaterate;
        if (time - this.lastUpdate >= updateInterval) {
            var newTime = this.clocktime + TimeUtils.millisecondsToHours(updateInterval);

            this.clocktime = newTime;
            this.lastUpdate = time;

            this.updateSunPosition();
        }
    },

    timeToSkyPos: function(time) {
        var hoursToRad = 2 * Math.PI / 24;
        // subtract Pi/2 so noon is Pi/2
        var theta = hoursToRad * time - (Math.PI/2);
        var y = Math.sin(theta);
        var z = Math.cos(theta);
        var pos = new THREE.Vector3( 0, y, z );
    
        return pos;
    },

    updateSunPosition: function() {
        var sunPositon = this.timeToSkyPos(this.clocktime);
        this.el.setAttribute('material', 'sunPosition', sunPositon);
    },

    async animateSun(oldtime, newtime) {
        var self = this;

        if (this.sunAnimationPromise) {
            await this.sunAnimationPromise;
        }
        var promise = new Promise((resolve, reject) => {
            try {
                AFRAME.ANIME({
                    targets: self,
                    easing: 'linear',
                    clocktime: [oldtime, newtime],
                    duration: self.data.duration*1000,
                    begin: function(anim) {
                        self.animating = true;
                    },
                    complete: function(anim) {
                        self.animating = false;
                        self.clocktime = self.data.starttime;
                        self.lastUpdate = 0;
                        resolve();
                    },
                });
            }
            catch (error) {
                console.error('animateSun error');
                console.log(error);
                reject(error);
            }
        });
        this.sunAnimationPromise = promise;
        return promise;
    },
 
});