import TextureLoaderHelper from '../../util/TextureLoaderHelper.js';

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
      repeatV: { type: 'number', default: 40},
      reflectivity: { type: 'number', default: 0.5 },
      withBump: { type: 'boolean', default: false },
      withNormal: { type: 'boolean', default: false },
      quality: { default: 'l' },
      shading: { default: 'default' },
      helper: { default: false }
    },

    update: function() {
        if (this.el.object3DMap.hasOwnProperty('mesh')) {
            this.el.removeObject3D('mesh');
        }
        this._createWoodenFloor();
    },

    _createWoodenFloor: function() {
        if (CONFIG.DEBUG) {console.log("_createWoodenFloor");}
        var self = this;
       
        self._buildMaterial()
        .then((material) => {
            var floorGeometry = new THREE.CircleBufferGeometry(self.data.radius, self.data.radialsegments);
            floorGeometry.rotateX(-Math.PI / 2);
            
            var floor = new THREE.Mesh(floorGeometry, material);
    
            floor.position.set(this.data.x, this.data.y, this.data.z);
    
            // var mesh = self.el.getObject3D('mesh') || new THREE.Group();
            //if (this.data.helper) {mesh.add(new THREE.BoxHelper(floor, HELPER_COLOR));}
            // mesh.add(floor);
            self.el.setObject3D('mesh', floor);
        });
    },

    _buildMaterial: function() {
        var self = this;
        return new Promise((resolve, reject) => {
            if (self.data.shading == 'cel') {
                var material = new CelShader(0xA0522D);
                resolve(material);
            }

            var tlHelper = new TextureLoaderHelper();
            const baseUrl = 'https://s3.amazonaws.com/lifescope-static/static/xr/textures/WoodenFloor/wood_';

            var baseTexture = tlHelper.loadTexture( 'wood', 'base', self.data.quality, 'jpg',
                // onLoad
                function (texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.offset.set( 0, 0 );
                    texture.repeat.set( self.data.repeatU, self.data.repeatV );

                    var floorMaterial = new THREE.MeshPhongMaterial( { map: baseTexture,
                        side:THREE.DoubleSide,
                        // reflectivity: self.data.reflectivity,
                        // color: 0x552811,
                        specular: 0x222222,
                        shininess: 25,
                    } );
        
                    if (self.data.withBump) {
                        var bumpTexture = tlHelper.loadTexture( 'wood-panel', 'height', self.data.quality, 'jpg',
                            function (texture) {
                                floorMaterial.bumpMap = texture;
                                floorMaterial.bumpScale = 1;
                            }
                        );
                        
                    }
                    if (self.data.withNormal) {
                        var normalTexture = tlHelper.loadTexture( 'wood-panel', 'normal', self.data.quality, 'jpg',
                            function (texture) {
                                floorMaterial.normalMap = texture;
                            } );
                    }
        
                    resolve(floorMaterial);
                },
                // onProgress
                function (xhr) {
                    // console.log(xhr);
                },
                // onError
                function (error) {
                    console.log('failed to load texture');
                    var material = new CelShader(0xA0522D);
                    resolve(material);
                }
            );
        });
    }
});

AFRAME.registerPrimitive( 'a-wooden-floor', {
    defaultComponents: {
        'wooden-floor': { },
    },
    mappings: {
        'radius': 'wooden-floor.radius',
        'x': 'wooden-floor.x',
        'y': 'wooden-floor.y',
        'z': 'wooden-floor.z',
        'bump': 'wooden-floor.withBump',
        'normal': 'wooden-floor.withNormal',
        'quality': 'wooden.quality',
        'radialsegments': 'wooden-floor.radialsegments',
        'shading': 'wooden-floor.shading',
    }
});