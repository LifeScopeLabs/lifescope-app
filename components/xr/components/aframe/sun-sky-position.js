if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
  }
  else {
    // if (CONFIG.DEBUG) {console.log("Registering sun-sky-position...");}
  }
  
AFRAME.registerComponent('sun-sky-position', {
    schema: {
        time: {type: 'number', default: 10},
    },
    update: function () {
        var self = this;
        var sunPositon = timeToSkyPos(self.data.time);

        this.el.setAttribute('material', 'sunPosition', sunPositon);
    },

    
});

// time: hours from midnight
function timeToSkyPos(time) {
    var hoursToRad = 2 * Math.PI / 24;
    // subtract Pi/2 so noon is Pi/2
    var theta = hoursToRad * time - (Math.PI/2);
    var y = Math.sin(theta);
    var z = Math.cos(theta);
    var pos = new THREE.Vector3( 0, y, z );

    return pos;
}