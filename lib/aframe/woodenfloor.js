AFRAME.registerComponent('wooden-floor', {
    schema: {
      uiScale: { type: 'number', default: 0.4},
      angle: { type: 'number', default: 0},
      radius: { type: 'number', default: 10},
      height: { type: 'number', default: 1},
      radialsegments: { type: 'number', default: 36 },
      rotaion: { type: 'number', default: Math.PI / 2 }, //rads
      x: { type: 'number', default: 0},
      y: { type: 'number', default: 0},
      z: { type: 'number', default: 0},
      repeatU: { type: 'number', default: 10},
      repeatV: { type: 'number', default: 10},
      reflectivity: { type: 'number', default: 0.5 },
      withBump: { default: true },
      helper: { default: false }
    },
  
    init: function () {

        var self = this;
        const baseUrl = 'https://s3.amazonaws.com/lifescope-static/static/xr/textures/WoodenFloor/WoodenFloor_';
        // texture author: Brandon Funk https://gumroad.com/l/wood_floor
        var baseTexture = new THREE.TextureLoader().load( baseUrl + 'basecolor.png');
        var bumpTexture = new THREE.TextureLoader().load( baseUrl + 'height.png');
        var normalTexture = new THREE.TextureLoader().load( baseUrl + 'normal.png');
    
        baseTexture.wrapS = baseTexture.wrapT = THREE.RepeatWrapping;
        baseTexture.offset.set( 0, 0 );
        baseTexture.repeat.set( this.data.repeatU, this.data.repeatV );
        
        var floorMaterial = new THREE.MeshPhongMaterial( { map: baseTexture,
            side:THREE.DoubleSide,// } );
            bumpMap: bumpTexture,
            normalMap: normalTexture,
            // reflectivity: self.data.reflectivity,
            // color: 0x552811,
            specular: 0x222222,
            shininess: 25,
            bumpScale: 1} );
        var floorGeometry = new THREE.CircleBufferGeometry(self.data.radius, self.data.radialsegments);
            
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = Math.PI / 2;
        // floor.rotation.z = Math.PI / 2;
        floor.rotation.z = 1 * Math.PI / 36;

        floor.position.set(this.data.x, this.data.y, this.data.z);

        var normalMap = THREE.ImageUtils.loadTexture( baseUrl + 'normal.png', undefined, function () {
            floor.material.normalMap = normalMap;
            floor.material.needsUpdate = true; // update material
            //renderer.render(scene, camera);
        });

        var group = self.el.getObject3D('group') || new THREE.Group();
        //if (this.data.helper) {group.add(new THREE.BoxHelper(floor, HELPER_COLOR));}
        group.add(floor);
        self.el.setObject3D('group', group);
        
    }
});

AFRAME.registerPrimitive( 'a-wooden-floor', {
    defaultComponents: {
        'wooden-floor': { },
    },
    mappings: {
        'radius': 'wooden-floor.radius',
        'x': 'envmap-sphere.x',
        'y': 'envmap-sphere.y',
        'z': 'envmap-sphere.z',
    }
});