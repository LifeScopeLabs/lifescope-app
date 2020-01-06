AFRAME.registerSystem('searching', {
    schema: {}, 

    init: function () {
    },
  
  });

AFRAME.registerComponent('searching', {

    schema: {
        id: { type: 'string', default: '' },

        radius: { type: 'number', default: 1 },
        tube: { type: 'number', default: 0.1 },
        color:  { default: '#2ac1de' },

        altcolor: { default: '#f93' },

        arc: { type: 'number', default: 2*Math.PI }, //radians

        animate: { type: 'boolean', default: true},
    },

    init() {
        var self = this;
        var data = self.data;

        var geometry = new THREE.TorusBufferGeometry( data.radius, data.tube, 16, 64, data.arc );
        var material = new THREE.MeshBasicMaterial( { color: data.color,
            opacity: 0.7,
            transparent: true
        } );
        var torus = new THREE.Mesh( geometry, material );
        this.el.object3D.add( torus );

        var geoIndicator = new THREE.TorusBufferGeometry( data.radius, 1.1*data.tube, 16, 64, Math.PI/16 );
        var matIndicator = new THREE.MeshBasicMaterial( { color: data.altcolor } );
        var indicator = new THREE.Mesh( geoIndicator, matIndicator );
        this.el.object3D.add( indicator );

        var textEl = document.createElement('a-entity');
        textEl.setAttribute('text-cell', { id: 'searchingtext', text: 'Searching',
                width: 2*data.radius,
                height: 0.3,});
        self.el.appendChild(textEl);

        if (data.animate) {
            AFRAME.ANIME({
                targets: self.el.object3D.rotation,
                easing: 'linear',
                z: [0, 2*Math.PI],
                duration: 1000*(1),
                loop: true,
                easing: 'cubicBezier(.5, .05, .1, .3)',
            });
        }
    },

});

AFRAME.registerPrimitive('a-searching', {
	defaultComponents: {
		'searching': {},
	},
	mappings: {
        'id': 'searching.id',
        'radius': 'searching.radius',
        'tube': 'searching.tube',
        'color': 'searching.color',
        'arc': 'searching.arc',
        'animate': 'searching.animate',
	}
});