if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
  }
  else {
    if (CONFIG.DEBUG) {console.log("Registering sun-sky-position...");}
  }
  
AFRAME.registerComponent('sun-sky-position', {
    schema: {
        starttime: {type: 'number', default: 10},
        updaterate: {type: 'number', default: 1}
    },

    init: function () {
        this.clocktime = this.data.starttime;
        this.lastUpdate = 0;

        this.updateSunPosition();
    },

    update: function (oldData) {
        var self = this;

        if (this.data.starttime != oldData.starttime) {
            self.clocktime = self.data.starttime;
            self.lastUpdate = 0;
        }

        this.updateSunPosition();
    },

    tick: function (time, timeDelta) {
        var updateInterval = 1000 * (60) / this.data.updaterate;
        if (time - this.lastUpdate >= updateInterval) {
            var newTime = this.clocktime + updateInterval;

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
    }
 
});