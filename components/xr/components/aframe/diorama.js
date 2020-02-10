import TextureLoaderHelper from '../../util/TextureLoaderHelper.js';
import { _buildMediaMesh, _createMedia, _updateAspectRatio, getCenterPoint } from './media-cell';

var materialColors =  new Map([
    ['brass', 0xDAA520],
    ['bronze', 0xDAA520],
    ['wood', 0xA0522D],
    ['wood-panel', 0xA0522D],
    ['glass', 0xC0C0C0],
])

function _buildMaterial(shading, type, quality='l', withBump=false, withNormal=false, repeatU=1, repeatV=1, props={}) {
    return new Promise((resolve, reject) => {
    
        var material, baseTexture, bumpTexture, nomralTexture;
        if (type=='glass') {
            material = new THREE.MeshPhysicalMaterial( 
                {
                    color: props.color,
                    metalness: props.metalness,
                    reflectivity: props.reflectivity,
                    roughness: props.roughness,
                    opacity: props.opacity,
                    side: THREE.DoubleSide,
                    transparent: true,
                    envMapIntensity: 5,
                    premultipliedAlpha: true,
            });
            resolve(material);
        }

        // if (shading=='cel') {
        //     var material = new CelShader(materialColors.get(type), props);
        //     resolve(material);
        // }

        // if (type=='gradient') {
        //     var material = new GradientShader(0xACB6E5, 0x74ebd5);
        //     resolve(material);
        // }
        
        var tlHelper = new TextureLoaderHelper();

        baseTexture = tlHelper.loadTexture( type, 'base', quality, 'jpg',
            // onLoad
            function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set( repeatU, repeatV );

                material = new THREE.MeshPhongMaterial( { map: texture,//baseTexture,
                    side:THREE.FrontSide,
                    specular: 0x222222,
                    shininess: 25,
                    } );

                if (withBump) {
                    bumpTexture = tlHelper.loadTexture( type, 'height', quality, 'jpg',
                        function (texture) {
                            material.bumpMap = texture;
                            material.bumpScale = 1;
                        }
                    );
                }
                if (withNormal) {
                    nomralTexture = tlHelper.loadTexture( type, 'normal', quality, 'jpg',
                        function (texture) {
                            material.normalMap = texture;
                        }
                    );
                }
                material.needsUpdate = true;
                resolve(material);
            },
            // onProgress
            function (xhr) {
                // console.log(xhr);
            },
            // onError
            function (error) {
                console.log('failed to load texture');
                console.log(error);
                // var material = new CelShader(materialColors.get(type), props);
                // resolve(material);
            }
        );
    
    });
}

function _buildGeometry(type, data) {
    var geom, height, width, depth;
    var x, y, z;
    x = data.x;
    y = data.y;
    z = data.z;
    switch (type) {
        case 'column':
            height = data.railheight + 0.01;
            geom =  new THREE.CylinderBufferGeometry( data.columnradius,
                data.columnradius,
                height,
                data.radialsegments, 1, false );

            geom.translate(x,
                y + height/2,
                z);
            break;
    
        case 'sphere':
            var radius = data.columnradius * (3/2);
            height = data.railheight + 0.01 + radius;
            geom = new THREE.SphereBufferGeometry( radius,
                data.radialsegments, data.radialsegments );
        
            geom.translate(x,
                y + height,
                z);
            break;
        case 'case':
            height = data.height;
            width = data.width;
            if (data.aspectratio) {
                if (data.srcFit == 'width') {
                    height = data.imagewidth / data.aspectratio;
                }
                else {
                    width = data.imageheight * data.aspectratio;
                }
            }
            geom = new THREE.BoxBufferGeometry( width, height, data.depth );
            geom.rotateX(2 * Math.PI * data.rotationx / 360);
            geom.translate(x + data.offset.x, y + data.offset.y, z + data.offset.z)
            break;
        case 'base':
        case 'trim':
        case 'glass':
            width = (data.floorradius) * Math.sin(2 * Math.PI / data.radialsegments);
            if (type == 'glass') { height = data.railheight - (2*data.baseheight); depth = data.basedepth - 0.01; }
            else if (type == 'base') { height = data.baseheight; depth = data.basedepth; }
            else if (type == 'trim') { height = data.trimheight; depth = 0.01;}

            var shape = new THREE.Shape();
            var cr = data.columnradius;

            shape.moveTo( -(width - cr)/2, -height/2 );
            shape.lineTo( -(width - cr)/2, height/2 );
            shape.lineTo( (width + cr)/2, height/2 );
            shape.lineTo( (width + cr)/2, -height/2 );
            shape.lineTo( -(width - cr)/2, -height/2 );
        
            var extrudeSettings = {
                steps: 2,
                depth: depth,
                //amount: self.data.depth, // aframe 8.2 / three.js r92
                bevelEnabled: type == 'trim' ? false : true,
                bevelThickness: 0.01,
                bevelSize: 0.01,
                bevelSegments: 1
            };
            geom = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );

            if (type == 'base') {
                if (data.pos == 'top') {
                    y += data.railheight - data.baseheight - 0.01;
                }
            }
            else if (type == 'trim') {
                if (data.side == 'front') {
                    z += 0.02;
                }
                else if (data.side == 'back') {
                    z -= 0.02;
                }
                if (data.pos == 'top') {
                    y += data.railheight - data.baseheight - 0.02;
                }
                else {
                    y += data.baseheight;
                }
            }
            else if (type == 'glass') {
                y += data.baseheight;
            }
 
            geom.translate(x + ((width + cr/2 + 0.01)/2),
                        y + height/2,
                        z - depth/2);
            break;
        default:
            break;
    }
    return geom;
}


AFRAME.registerComponent('diorama-rail', {
    schema: {
        x: { type: 'number', default: 0},
        y: { type: 'number', default: 0},
        z: { type: 'number', default: 0},

        railheight: { type: 'number', default: 1.2 },
        baseheight: { type: 'number', default: 0.075 },
        trimheight: { type: 'number', default: 0.01 },
        basedepth: { type: 'number', default: 0.03 },
        columnradius: { type: 'number', default: 0.05 },

        radialsegments: { type: 'number', default: 36 },
        floorradius: { type: 'number', default: 6},

        color: { default: 0xe8f1ff}, //0xe8f1ff
        opacity: { type: 'number', default: 0.2 },
        metalness: { type: 'number', default: 0.0 },
        reflectivity: { type: 'number', default: 0.5 },
        roughness: { type: 'number', default: 0.2 },

        repeatU: { type: 'number', default: 4},
        repeatV: { type: 'number', default: 1},

        withBump: { default: false },
        withNormal: { default: false },
        quality: { default: 'l' }, //, oneOf: ['s', 'm', 'l']
        shading: { default: 'default' },
    },

    multiple: true,

    update: function() {
        var self = this;
        if (self.el.object3DMap.hasOwnProperty(self.id)) {
            self.el.removeObject3D(self.id);
        }
        if (self.id != undefined) {
            self._createRail();
        }
    },

    remove: function () {
        if (this.el.object3DMap.hasOwnProperty(this.id)) {
            this.el.removeObject3D(this.id);
        }
    },

    _createRail() {
        var data = this.data;
        this._createDioramaComponent('brass', 'column');
        this._createDioramaComponent('brass', 'sphere');
        this._createDioramaComponent('wood-panel', 'base');
        this._createDioramaComponent('wood-panel', 'base', 'top');
        this._createDioramaComponent('brass', 'trim', '', 'front');
        this._createDioramaComponent('brass', 'trim', '', 'back');
        this._createDioramaComponent('brass', 'trim', 'top', 'front');
        this._createDioramaComponent('brass', 'trim', 'top', 'back');
        this._createDioramaComponent('glass', 'glass', '', '', {
            color: data.color,
            metalness: data.metalness,
            reflectivity: data.reflectivity,
            roughness: data.roughness,
            opacity: data.opacity,
        });
    },

    _createDioramaComponent(type, shape,  pos='', side='front', props={}) {
        var self = this;
        var geom, mesh;
        var data = Object.assign({}, self.data);
        data.pos = pos;
        data.side = side;
    
        _buildMaterial(data.shading, type, data.quality, data.withBump, data.withNormal, data.repeatU, data.repeatV, props)
        .then( (material) => {
            geom = _buildGeometry(shape, data);
            if (shape == 'base' && material.map != undefined) {
                var texture = material.map;
                var offsetx = (data.floorradius) * Math.sin(2 * Math.PI / data.radialsegments);
                var offsety = data.baseheight / 2
                texture.rotation = Math.PI / 2;
                texture.offset.set( offsetx, offsety );
            }
            mesh = new THREE.Mesh(geom, material);
        
            var group = self.el.getObject3D(self.id) || new THREE.Group();
            group.add(mesh);
            self.el.setObject3D(self.id, group); 
        });
    },

});


AFRAME.registerPrimitive( 'a-rail', {
    defaultComponents: {
        'diorama-rail__rail': { 
            repeatV: 1,
        },

    },
    mappings: {
        'radius': 'diorama-rail__rail.floorradius',
        'bump': 'diorama-rail__rail.withBump',
        'normal': 'diorama-rail__rail.withNormal',
        'quality': 'diorama-rail__rail.quality',
        'radialsegments': 'diorama-rail__rail.radialsegments',
        'railheight': 'diorama-rail__rail.railheight',
        'shading': 'diorama-rail__rail.shading',
    }
});



AFRAME.registerComponent('diorama-column', {
    schema: {
        x: { type: 'number', default: 0},
        y: { type: 'number', default: 0},
        z: { type: 'number', default: 0},

        railheight: { type: 'number', default: 1.2 },
        baseheight: { type: 'number', default: 0.075 },
        trimheight: { type: 'number', default: 0.01 },
        basedepth: { type: 'number', default: 0.03 },
        columnradius: { type: 'number', default: 0.05 },

        radialsegments: { type: 'number', default: 36 },
        floorradius: { type: 'number', default: 6},

        color: { default: 0xe8f1ff}, //0xe8f1ff
        opacity: { type: 'number', default: 0.2 },
        metalness: { type: 'number', default: 0.0 },
        reflectivity: { type: 'number', default: 0.5 },
        roughness: { type: 'number', default: 0.2 },

        repeatU: { type: 'number', default: 4},
        repeatV: { type: 'number', default: 1},

        withBump: { default: false },
        withNormal: { default: false },
        quality: { default: 'l' }, //, oneOf: ['s', 'm', 'l']
        shading: { default: 'default' },

        withTrim: { default: false }
    },

    multiple: true,

    update: function() {
        var self = this;
        if (self.el.object3DMap.hasOwnProperty(self.id)) {
            self.el.removeObject3D(self.id);
        }
        if (self.id != undefined) {
            self._createRail();
        }
    },

    remove: function () {
        if (this.el.object3DMap.hasOwnProperty(this.id)) {
            this.el.removeObject3D(this.id);
        }
    },

    _createRail() {
        var data = this.data;
        this._createDioramaComponent('brass', 'column');
        this._createDioramaComponent('brass', 'sphere');
        if (data.withTrim) {
            this._createDioramaComponent('wood-panel', 'base');
            // this._createDioramaComponent('wood-panel', 'base', 'top');
            this._createDioramaComponent('brass', 'trim', '', 'front');
            this._createDioramaComponent('brass', 'trim', '', 'back');
        }
        // this._createDioramaComponent('brass', 'trim', 'top', 'front');
        // this._createDioramaComponent('brass', 'trim', 'top', 'back');
        // this._createDioramaComponent('glass', 'glass', '', '', {
        //     color: data.color,
        //     metalness: data.metalness,
        //     reflectivity: data.reflectivity,
        //     roughness: data.roughness,
        //     opacity: data.opacity,
        // });
    },

    _createDioramaComponent(type, shape,  pos='', side='front', props={}) {
        var self = this;
        var geom, mesh;
        var data = Object.assign({}, self.data);
        data.pos = pos;
        data.side = side;
    
        _buildMaterial(data.shading, type, data.quality, data.withBump, data.withNormal, data.repeatU, data.repeatV, props)
        .then( (material) => {
            geom = _buildGeometry(shape, data);
            if (shape == 'base' && material.map != undefined) {
                var texture = material.map;
                var offsetx = (data.floorradius) * Math.sin(2 * Math.PI / data.radialsegments);
                var offsety = data.baseheight / 2
                texture.rotation = Math.PI / 2;
                texture.offset.set( offsetx, offsety );
            }
            mesh = new THREE.Mesh(geom, material);
        
            var group = self.el.getObject3D(self.id) || new THREE.Group();
            group.add(mesh);
            self.el.setObject3D(self.id, group); 
        });
    },

});

AFRAME.registerPrimitive( 'a-diorama-column', {
    defaultComponents: {
        'diorama-column__column': { 
            repeatV: 1,
            withTrim: true
        },

    },
    mappings: {
        'radius': 'diorama-column__column.floorradius',
        'bump': 'diorama-column__column.withBump',
        'normal': 'diorama-column__column.withNormal',
        'quality': 'diorama-column__column.quality',
        'radialsegments': 'diorama-column__column.radialsegments',
        'railheight': 'diorama-column__column.railheight',
        'shading': 'diorama-column__column.shading',
    }
});

AFRAME.registerComponent('diorama-case', {
    schema: {
        x: { type: 'number', default: 0},
        y: { type: 'number', default: 0},
        z: { type: 'number', default: 0},
        rotationx: { type: 'number', default: 30 }, // degrees

        type: { type: 'string', default: 'image' },
        url: {type: 'string', default: ''},
        srcFit: { type: 'string', default: 'width' },

        imagewidth: { type: 'number', default: 0.6 },
        imageheight: { type: 'number', default: 0.6 },
        depth: { type: 'number', default: 0.01 },

        casedepth: { type: 'number', default: 0.06 },
        bronzedepth: { type: 'number', default: 0.01 },
        casemargin: { type: 'number', default: 0.05 },

        railheight: { type: 'number', default: 1.2 },

        color: { default: 0xe8f1ff}, //0xe8f1ff
        opacity: { type: 'number', default: 0.2 },
        metalness: { type: 'number', default: 0.0 },
        reflectivity: { type: 'number', default: 0.5 },
        roughness: { type: 'number', default: 0.2 },

        repeatU: { type: 'number', default: 4},
        repeatV: { type: 'number', default: 1},

        withBump: { default: false },
        withNormal: { default: false },
        quality: { default: 'l' }, //, oneOf: ['s', 'm', 'l']
        shading: { default: 'default' },

        withGlass: { default: true },
        withBronze: { default: true },
        withRail: { default: true },

        aspectratio: { type: 'number', default: 0 },

        animateLoad: { type: 'boolean', default: false },
        animateInSeconds: { type: 'number', default: 0.5 },
        animateOutSeconds: { type: 'number', default: 0.2 },
    },

    multiple: true,

    init: function() {
        var self = this;
        var data = self.data;

        this._createMedia = _createMedia.bind(this);
        this._updateAspectRatio = _updateAspectRatio.bind(this);

        self._createDiorama();

        if (self.data.url != '' && 
            (self.data.type=="image" || self.data.type=="video")) {
            self._createMedia({ x: 0, y: data.railheight + 0.3, z: -.15, rotx: data.rotationx, roty: 180 });
        }

        // if (self.data.url != '' && self.data.type=="video") {
        //     self._createMedia();
        //     // if (self.data.selected) {
        //     //     self._createVideoControls();
        //     // }
        // }

    },

  
    update: function(oldData) {
        var self = this;
        var changedData = Object.keys(self.data).filter(x => self.data[x] != oldData[x]);

        if (self.el.object3DMap.hasOwnProperty(self.id)) {
            self.el.removeObject3D(self.id);

            if (self.id != undefined) {
                self._createDiorama();
            }
        }
        
        if ( self.el.object3DMap.hasOwnProperty('image') &&
            ['url', 'srcFit', 'imagewidth', 'imageheight', 'depth', 'aspectratio', 'type', 'railheight']
            .some(prop => changedData.includes(prop))) {
                
                if (self.el.object3DMap.hasOwnProperty('image')) {
                    self.el.removeObject3D('image');
                }
            if (self.data.url != '' && self.data.type=="image") {
                self._createMedia({ x: 0, y: self.data.railheight + 0.3, z: -.15, rotx: self.data.rotationx, roty: 180 });
            }
        }

        if ( self.el.object3DMap.hasOwnProperty('video') &&
            ['url', 'srcFit', 'imagewidth', 'imageheight', 'depth', 'aspectratio', 'type', 'railheight']
            .some(prop => changedData.includes(prop)) ) {
                // console.log('removing video');
            self.el.removeObject3D('video');
            if (self.data.url != '' && self.data.type=="video") {
                self._createMedia({ x: 0, y: self.data.railheight + 0.3, z: -.15, rotx: self.data.rotationx, roty: 180 });
            }
        }

    },

    remove: function () {
        if (this.el.object3DMap.hasOwnProperty(this.id)) {
            this.el.removeObject3D(this.id);
        }
        if (this.el.object3DMap.hasOwnProperty('image')) {
            this.el.removeObject3D('image');
        }
        if (this.el.object3DMap.hasOwnProperty('video')) {
            this.el.removeObject3D('video');
        }
    },

    _createDiorama() {
        var self = this;
        var data = self.data;

        if (data.withGlass) {
            self._createCase(
                'glass',
                data.imagewidth + data.casemargin,
                data.imageheight + data.casemargin,
                data.casedepth,
                {
                    x: 0,
                    y: data.railheight + 0.3,
                    z: -.15 + data.casedepth/2 + 2*data.bronzedepth
                },
                {
                    color: data.color,
                    metalness: data.metalness,
                    reflectivity: data.reflectivity,
                    roughness: data.roughness,
                    opacity: data.opacity,
                }
            );
        }
        if (data.withBronze) {
            self._createCase(
                'brass',
                data.imagewidth,
                data.imageheight,
                data.bronzedepth,
                {
                    x: 0,
                    y: data.railheight + 0.3,
                    z: -.15 + 1.5*data.bronzedepth
                }
            );
        }
        self._createCase(
            'wood-panel',
            data.imagewidth + 0.06,
            data.imageheight + 0.07,
            data.bronzedepth*2,
            {
                x: 0,
                y: data.railheight + 0.3,
                z: -.15 + data.casedepth + 3*data.bronzedepth
            }
        );
        // if (data.withRail) {
        //     self._createCase(
        //         'brass',
        //         0.03,
        //         0.03,
        //         0.2,
        //         {
        //             x: 0,
        //             y: data.railheight + 0.3 + Math.cos(2 * Math.PI * data.rotationx / 360) * -0.2 + 0.04,
        //             z: -.05 + data.casedepth + 3*data.bronzedepth + Math.sin(2 * Math.PI * data.rotationx / 360) * -0.2 - 0.04
        //         }
                
        //     );
        // }
    },

   
    _createCase(type, width, height, depth, offset, props={}) {
        var self = this;
        var geom, mesh;
        var data = Object.assign({}, self.data);

        data.width = width;
        data.height = height;
        data.depth = depth;
        data.offset = offset;
    
        _buildMaterial(data.shading, type, data.quality, data.withBump, data.withNormal, data.repeatU, data.repeatV, props)
        .then( (material) => {
            geom = _buildGeometry('case', data);
            mesh = new THREE.Mesh(geom, material);
        
            var group = self.el.getObject3D(self.id) || new THREE.Group();
            group.add(mesh);
            self.el.setObject3D(self.id, group); 
        });
    },

});


AFRAME.registerPrimitive( 'a-diorama', {
    defaultComponents: {
        'diorama-case__case': {
            withGlass: false,
            withBronze: false
        },
    },
    mappings: {
        'width': 'diorama-case__case.imagewidth',
        'height': 'diorama-case__case.imageheight',
        'aspectratio': 'diorama-case__case.aspectratio',
        'bump': 'diorama-case__case.withBump',
        'normal': 'diorama-case__case.withNormal',
        'rail': 'diorama-case__case.withRail',
        'quality': 'diorama-case__case.quality',
        'src': 'diorama-case__case.url',
        'srcfit': 'diorama-case__case.srcFit',
        'railheight': 'diorama-case__case.railheight',
        'shading': 'diorama-case__case.shading',
        'type': 'diorama-case__case.type',
        'animate-load': 'diorama-grid-case__case.animateLoad',
        'animatein': 'diorama-case__case.animateInSeconds',
        'animateout': 'diorama-case__case.animateOutSeconds',
    }
});
