var brassBaseTexture, brassBumpTexture, brassNormalTexture;
var woodBaseTexture, woodBumpTexture, woodNormalTexture;

function getOrLoadTexture(type) {
    const brassBaseUrl = 'https://s3.amazonaws.com/lifescope-static/static/xr/textures/BronzeBare/TexturesCom_Metal_BronzeBare_1K_'
    const woodBaseUrl = 'https://s3.amazonaws.com/lifescope-static/static/xr/textures/WoodenFloor/WoodenFloor_';

    // brass
    if (type == 'brassBase') {
        return brassBaseTexture !== undefined ?
         brassBaseTexture : new THREE.TextureLoader().load( brassBaseUrl + 'albedo.jpg');
    }
    else if (type == 'brassBump') {
        return brassBumpTexture !== undefined ?
        brassBumpTexture : new THREE.TextureLoader().load( brassBaseUrl + 'height.jpg');
    }
    else if (type == 'brassNormal') {
        return brassNormalTexture !== undefined ?
        brassNormalTexture : new THREE.TextureLoader().load( brassBaseUrl + 'normal.jpg');
    }
    // wood
    // texture author: Brandon Funk https://gumroad.com/l/wood_floor
    else if (type == 'woodBase') {
        return woodBaseTexture !== undefined ?
        woodBaseTexture : new THREE.TextureLoader().load( woodBaseUrl + 'basecolor.png');
    }
    else if (type == 'woodBump') {
        return woodBumpTexture !== undefined ?
        woodBumpTexture : new THREE.TextureLoader().load( woodBaseUrl + 'height.png');
    }
    else if (type == 'woodNormal') {
        return woodNormalTexture !== undefined ?
        woodNormalTexture : new THREE.TextureLoader().load( woodBaseUrl + 'normal.png');
    }
}

function createDioramaComponent(self, theta) {
    var material, geom, mesh;

    var sinTheta = Math.sin( theta );
    var cosTheta = Math.cos( theta );

    var segx = self.data.cylradius * sinTheta;
    var segz = self.data.cylradius * cosTheta;
    if (self.data.mat == 'brass') {
        brassBaseTexture = getOrLoadTexture('brassBase');
        brassBumpTexture = getOrLoadTexture('brassBump');
        brassNormalTexture = getOrLoadTexture('brassNormal');


        brassBaseTexture.wrapS = brassBaseTexture.wrapT = THREE.RepeatWrapping;
        brassBaseTexture.offset.set( 0, 0 );
        brassBaseTexture.repeat.set( self.data.repeatU, self.data.repeatV );
        
        material = new THREE.MeshPhongMaterial( { map: brassBaseTexture,
            side:THREE.FrontSide,
            bumpMap: brassBumpTexture,
            normalMap: brassNormalTexture,
            // reflectivity: self.data.reflectivity,
            // color: 0x552811,
            specular: 0x222222,
            shininess: 25,
            bumpScale: 1} );
    }

    else if (self.data.mat == 'wood') {

        woodBaseTexture = getOrLoadTexture('woodBase');
        woodBumpTexture = getOrLoadTexture('woodBump');
        woodNormalTexture = getOrLoadTexture('woodNormal');

        woodBaseTexture.wrapS = woodBaseTexture.wrapT = THREE.RepeatWrapping;
        woodBaseTexture.offset.set( 0, 0 );
        woodBaseTexture.repeat.set( self.data.repeatU, self.data.repeatV );
        
        var material = new THREE.MeshPhongMaterial( { map: woodBaseTexture,
            side:THREE.DoubleSide,// } );
            bumpMap: woodBumpTexture,
            normalMap: woodNormalTexture,
            needsUpdate: true,
            // reflectivity: self.data.reflectivity,
            // color: 0x552811,
            specular: 0x222222,
            shininess: 25,
            bumpScale: 1} );

    }

    else if (self.data.mat == 'glass') {
        material = new THREE.MeshPhysicalMaterial( 
            {
                color: self.data.color,
                metalness: self.data.metalness,
                reflectivity: self.data.reflectivity,
                roughness: self.data.roughness,
                opacity: self.data.opacity,
                side: THREE.DoubleSide,
                transparent: true,
                envMapIntensity: 5,
                premultipliedAlpha: true,
            });
    }
        
        
    if (self.data.geo == 'column') {
        geom =  new THREE.CylinderBufferGeometry( self.data.radius,
            self.data.radius,
            self.data.height,
            self.data.radialsegments, 1, false );
    }
    else if (self.data.geo == 'sphere') {
        geom = new THREE.SphereBufferGeometry( self.data.radius,
            self.data.radialsegments, self.data.radialsegments );
    }
    else if (self.data.geo == 'plack' || self.data.geo == 'case' || self.data.geo == 'safeguard') { // frosted case
        geom = new THREE.BoxBufferGeometry( self.data.width, self.data.height, self.data.depth );
        geom.rotateX(2 * Math.PI * self.data.rotation / 360);

        // mesh = new THREE.Mesh(geom, material);
        // mesh.position.set(self.data.x,
        //     self.data.y + self.data.height/2,
        //     self.data.z);
    }
    else if (self.data.geo == 'box' || self.data.geo == 'ex-box') {
        var width = self.data.width;
        width = self.data.cylradius * Math.sin(2 * Math.PI / self.data.radialsegments);
        var height = self.data.height;

        var shape = new THREE.Shape();

        shape.moveTo( -width/2, -height/2 );
        shape.lineTo( -width/2, height/2 );
        shape.lineTo( width/2, height/2 );
        shape.lineTo( width/2, -height/2 );
        shape.lineTo( -width/2, -height/2 );

        var extrudeSettings = {
            steps: 2,
            depth: self.data.depth,
            amount: self.data.depth,
            bevelEnabled: self.data.geo == 'ex-box' ? true : false,
            bevelThickness: 0.01,
            bevelSize: 0.01,
            bevelSegments: 1
        };
        geom = new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );

    }

    if (self.data.geo == 'column' || self.data.geo == 'sphere') {
        geom.translate(self.data.x + (self.data.width/2),
                self.data.y + self.data.height/2,
                self.data.z + self.data.depth/2);
        geom.rotateY(theta);
        geom.translate(segx - (self.data.width/2), 0, segz);
    }
    else if (self.data.geo == 'plack' || self.data.geo == 'safeguard' || self.data.geo == 'case') {
        // main diorama position logic in gallery-carousel.vue
        // this is for relative positioning of case/display object
        // geom.translate(self.data.x + 0,
        //     self.data.y + self.data.height/2,
        //     self.data.z - self.data.depth/2);
        geom.translate(self.data.x, self.data.y, self.data.z); 
    }
    else {
        geom.rotateY(theta);
        geom.translate(self.data.x + (self.data.width/2),
                self.data.y + self.data.height/2,
                self.data.z - self.data.depth/2);

        geom.translate(segx - (self.data.width/2), 0, segz);
    }

    mesh = new THREE.Mesh(geom, material);


    var group = self.el.getObject3D('group') || new THREE.Group();
    //if (self.data.helper) {group.add(new THREE.BoxHelper(floor, HELPER_COLOR));}
    // group.add(new THREE.BoxHelper(mesh, 0xffff00));
    group.add(mesh);
    self.el.setObject3D('group', group);        
}



function createImageComponent(self) {
    var material, geom, mesh;

    var texture = new THREE.TextureLoader().load( self.data.imageURL, function () {
        console.log("texture loaded");
        //console.log(texture);
        var srcWidth = texture.image.videoWidth || texture.image.width;
        var srcHeight = texture.image.videoHeight || texture.image.height;
        var aspectRatio = (srcWidth || 1.0) / (srcHeight || 1.0);
        var geomWidth, geomHeight;
        if (self.data.srcFit == 'width') {
            geomWidth = self.data.width;
            geomHeight = self.data.width / aspectRatio;
        }
        else {
            geomWidth = self.data.height * aspectRatio;
            geomHeight = self.data.height;
        }
        
        geom = new THREE.BoxBufferGeometry(geomWidth, geomHeight, self.data.depth );
        geom.rotateX(2 * Math.PI * self.data.rotation / 360);
        geom.translate(self.data.x, self.data.y, self.data.z);

        // immediately use the texture for material creation
        material = new THREE.MeshBasicMaterial( { map: texture } );

        mesh = new THREE.Mesh(geom, material);
        // console.log(mesh);

        var group = self.el.getObject3D('group') || new THREE.Group();
        // group.add(new THREE.BoxHelper(mesh, 0xffff00));
        group.add(mesh);
        self.el.setObject3D('group', group);   
    } );
}

var railHeight = 1.2

var floorRad = 6;
var columnRadius = 0.05;
var columnHeight = railHeight + 0.01;

var sphereRadius = columnRadius * (3/2);

// self.data.cylradius * Math.sin(2 * Math.PI / self.data.radialsegments);
var baseWidth = (floorRad) * Math.sin(2 * Math.PI / 36);
var baseHeight = 0.2;
var baseDepth = 0.03;

var glassHeight = railHeight - (2*baseHeight);
var glassWidth = baseWidth;
var glassDepth = baseDepth - 0.01; // 0.02

var trimHeight = 0.01;
var trimDepth = glassDepth/2 // 0.01

var bevelThickness = 0.01

var imagePlackHeight = 0.5;
var imagePlackWidth = 0.6;
var imagePlackDepth = 0.01;
var imagePlackRotation = 30;

var safeguardHeight = 0.3375;
var safeguardWidth = 0.6;
var safeguardDepth = 0.01;

var brassPlackHeight = safeguardHeight;
var brassPlackWidth = safeguardWidth;
var brassPlackDepth = safeguardDepth;

var frostedCaseHeight = safeguardHeight + 0.05;
var frostedCaseWidth = safeguardWidth + 0.05;
var frostedCaseDepth = 0.06;

var woodBackingHeight = safeguardHeight + 0.07;
var woodBackingWidth = safeguardWidth + 0.06;
var woodBackingDepth = 0.02;

function createStakeComponent(self) {
    var stakeGeom1, stakeGeom2, stakeGeom3;
    var material, mesh1, mesh2, mesh3;

    //load brass texture once
    brassBaseTexture = getOrLoadTexture('brassBase');
    brassBumpTexture = getOrLoadTexture('brassBump');
    brassNormalTexture = getOrLoadTexture('brassNormal');

    brassBaseTexture.wrapS = brassBaseTexture.wrapT = THREE.RepeatWrapping;
    brassBaseTexture.offset.set( 0, 0 );
    brassBaseTexture.repeat.set( self.data.repeatU, self.data.repeatV );
    
    material = new THREE.MeshPhongMaterial( { map: brassBaseTexture,
        side:THREE.FrontSide,
        bumpMap: brassBumpTexture,
        normalMap: brassNormalTexture,
        // reflectivity: self.data.reflectivity,
        // color: 0x552811,
        specular: 0x222222,
        shininess: 25,
        bumpScale: 1} );


    /*stakeGeom1 = new THREE.BoxBufferGeometry( self.data.width, self.data.height, self.data.depth );
    // stakeGeom1.translate(0,0,-self.data.depth/2);
    stakeGeom1.rotateX(2 * Math.PI * -30 / 360);
    stakeGeom1.translate(0,self.data.depth/2,0);
    stakeGeom1.translate(self.data.x, self.data.y, self.data.z);
    

    stakeGeom2 = new THREE.BoxBufferGeometry( self.data.width, self.data.height, self.data.depth );
    // stakeGeom1.translate(0,0,-self.data.depth/2);
    stakeGeom2.rotateY(2 * Math.PI * -30 / 360);
    stakeGeom2.rotateZ(2 * Math.PI * 30 / 360);
    stakeGeom2.translate(self.data.x-0.05, self.data.y, self.data.z);
    // stakeGeom2.rotateY(2 * Math.PI * 30 / 360);

    stakeGeom3 = new THREE.BoxBufferGeometry( self.data.width, self.data.height, self.data.depth );
    // stakeGeom1.translate(0,0,-self.data.depth/2);
    stakeGeom3.rotateY(2 * Math.PI * 30 / 360);
    stakeGeom3.rotateZ(2 * Math.PI * -30 / 360);
    stakeGeom3.translate(self.data.x+0.05, self.data.y, self.data.z);*/

    //turn 30 deg towards ground because the whole display is 30 deg towards ground
    

    stakeGeom1 = new THREE.BoxBufferGeometry( self.data.width, self.data.height, self.data.depth );
    // stakeGeom1.rotateX(2 * Math.PI * 30 / 360);
    stakeGeom1.rotateX(2 * Math.PI * self.data.rotation / 360);
    stakeGeom1.translate(self.data.x, self.data.y, self.data.z);
    

    var downShift = -0.2;
    var ang = 30;
    var dy = Math.cos(2 * Math.PI * ang / 360) * downShift;
    var dz = Math.sin(2 * Math.PI * ang / 360) * downShift;
    stakeGeom1.translate(0, dy, dz);
    stakeGeom1.translate(0, 0.04, -0.04);


    mesh1 = new THREE.Mesh(stakeGeom1, material);
    // mesh2 = new THREE.Mesh(stakeGeom2, material);
    // mesh3 = new THREE.Mesh(stakeGeom3, material);


    var group = self.el.getObject3D('group') || new THREE.Group();
    // group.add(new THREE.BoxHelper(mesh1, 0xffff00));
    group.add(mesh1);
    // group.add(mesh2);
    // group.add(mesh3);
    self.el.setObject3D('group', group);   

}

AFRAME.registerComponent('stake-component', {
    schema: {
        mat: { type: 'string', default: '' },
        height: { type: 'number', default: 0},
        width: { type: 'number', default: 0 },
        depth: { type: 'number', default: 0.0},
        x: { type: 'number', default: 0},
        y: { type: 'number', default: 0},
        z: { type: 'number', default: 0},
        opacity: { type: 'number', default: 0.2} ,
        rotation: { type: 'number', default: 0 } //degrees
    },

    multiple: true,

    init: function() {
        var self = this;
        createStakeComponent(self);
    }
});


AFRAME.registerComponent('image-component', {
    schema: {
        imageURL: {type: 'string', default: 'https://i.imgur.com/gmem7Ca.jpg'},
        height: { type: 'number', default: 0},
        width: { type: 'number', default: 0 },
        depth: { type: 'number', default: 0.0},
        x: { type: 'number', default: 0},
        y: { type: 'number', default: 0},
        z: { type: 'number', default: 0},
        opacity: { type: 'number', default: 0.2 },
        srcFit: { type: 'string', default: 'width' }
    },

    multiple: true,

    init: function() {
        var self = this;
        createImageComponent(self);
    }
});

AFRAME.registerPrimitive('a-custom-image', {
    defaultComponents: {
        'image-component': {imageURL: 'https://i.imgur.com/gmem7Ca.jpg',
            'width': imagePlackWidth -0.1, 'height': imagePlackHeight,
            'depth': imagePlackDepth,
            'x': 0, 'y': 0, 'z' : -0.2 + -0.15,
            'rotation': imagePlackRotation },
        // 'diorama-component__safeguard': { 'geo': 'safeguard', 'mat': 'glass',
        //     'width': safeguardWidth, 'height': safeguardHeight, 'depth': safeguardDepth,
        //     'x': 0, 'y': 0, 'z' : -0.2 + -0.16,
        //     'rotation': imagePlackRotation },
        'diorama-component__frosted_case': { 'geo': 'case', 'mat': 'glass',
            'width': frostedCaseWidth, 'height': frostedCaseHeight,
            'depth': frostedCaseDepth,
            'x': 0, 'y': 0, 
            'z' : -0.2 + frostedCaseDepth/2 + safeguardDepth + brassPlackDepth - 0.15,
            'rotation': imagePlackRotation },
        'diorama-component__brass_plack': { 'geo': 'plack', 'mat': 'brass',
            'width': brassPlackWidth, 'height': brassPlackHeight, 'depth': brassPlackDepth,
            'x': 0, 'y': 0, 'z' : -0.2 + brassPlackDepth/2 + safeguardDepth - 0.15,
            'rotation': imagePlackRotation },
        'diorama-component__brass_backing': { 'geo': 'plack', 'mat': 'wood',
            'width': woodBackingWidth, 'height': woodBackingHeight,
            'depth': woodBackingDepth,
            'x': 0, 'y': 0,
            'z' : -0.2 + woodBackingDepth/2 + frostedCaseDepth + safeguardDepth + brassPlackDepth - 0.15,
            'rotation': imagePlackRotation },
        'stake-component': {'mat': 'brass',
            'width': 0.03, 'height':0.03, 'depth': 0.2,
            'x': 0, 'y': 0,
            'z': -0.2 + woodBackingDepth/2 + frostedCaseDepth + safeguardDepth + brassPlackDepth - 0.05,
            'rotation': imagePlackRotation },
    },
    mappings: {
        'src': 'image-component.imageURL'
    }
});



AFRAME.registerComponent('diorama-component', {
    schema: {
        geo: { type: 'string', default: 'column' },
        mat: { type: 'string', default: 'brass' },
        uiScale: { type: 'number', default: 0.4},
        angle: { type: 'number', default: 0},
        radius: { type: 'number', default: 0},
        height: { type: 'number', default: 0},
        width: { type: 'number', default: 0 },
        depth: { type: 'number', default: 0.0},
        cylradius: { type: 'number', default: 6 },
        radialsegments: { type: 'number', default: 36 },
        rotation: { type: 'number', default: Math.PI / 2 }, //rads
        x: { type: 'number', default: 0},
        y: { type: 'number', default: 0},
        z: { type: 'number', default: 0},
        repeatU: { type: 'number', default: 10},
        repeatV: { type: 'number', default: 10},
        color: { default: 0xe8f1ff},
        opacity: { type: 'number', default: 0.2 },
        metalness: { type: 'number', default: 0.0 },
        reflectivity: { type: 'number', default: 0.5 },
        roughness: { type: 'number', default: 0.2 },
        withBump: { default: true },
        cyl: { default: false },
        helper: { default: false }
    },

    multiple: true,
  
    init: function () {

        var self = this;

        if (self.data.cyl) {
            for ( var i = 0; i <= self.data.radialsegments; i ++ ) {

                var u = i / self.data.radialsegments;
    
                var theta = u * Math.PI * 2 + 0;

                createDioramaComponent(self, theta);
            }
        }
        createDioramaComponent(self, 0);    
    }
});

// var railHeight = 1.2

// var floorRad = 6;
// var columnRadius = 0.05;
// var columnHeight = railHeight + 0.01;

// var sphereRadius = columnRadius * (3/2);

// // var safeguardHeight = 0.8;
// // var safeguardWidth = 0.6;
// // var safeguardDepth = 0.01;

// // var brassPlackHeight = 0.8;
// // var brassPlackWidth = 0.6;
// // var brassPlackDepth = 0.01;

// // var frostedCaseHeight = 0.85;
// // var frostedCaseWidth = 0.65;
// // var frostedCaseDepth = 0.06;

// // self.data.cylradius * Math.sin(2 * Math.PI / self.data.radialsegments);
// var baseWidth = (floorRad) * Math.sin(2 * Math.PI / 36);
// var baseHeight = 0.2;
// var baseDepth = 0.03;

// var glassHeight = railHeight - (2*baseHeight);
// var glassWidth = baseWidth;
// var glassDepth = baseDepth - 0.01; // 0.02

// var trimHeight = 0.01;
// var trimDepth = glassDepth/2 // 0.01

// var bevelThickness = 0.01

AFRAME.registerPrimitive( 'a-diorama', {
    defaultComponents: {
        'diorama-component__left_column': { 'geo': 'column', 'mat': 'brass',
            'radius': columnRadius, 'height': columnHeight, 'x': -(glassWidth/2) },
        'diorama-component__right_column': { 'geo': 'column', 'mat': 'brass',
            'radius': columnRadius, 'height': columnHeight, 'x': (glassWidth/2) },
        'diorama-component__base': { 'geo': 'ex-box', 'mat': 'wood',
            'width': baseWidth, 'height': baseHeight, 'depth': baseDepth },
        'diorama-component__trim_base_front': { 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight, 'z': glassDepth
        },
        'diorama-component__trim_base_back': { 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight, 'z': -glassDepth
        },
        'diorama-component__trim_top_front': { 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight + glassHeight - 0.02, 'z': glassDepth
        },
        'diorama-component__trim_top_back': { 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight + glassHeight - 0.02, 'z': -glassDepth
        },
        'diorama-component__top': { 'geo': 'ex-box', 'mat': 'wood',
            'width': glassWidth, 'height': baseHeight, 'depth': baseDepth,
            'y': baseHeight + glassHeight - bevelThickness//'0.99'
        },
        'diorama-component__glass': { 'geo': 'ex-box', 'mat': 'glass',
            'width': glassWidth, 'height': glassHeight, 'depth': glassDepth,
            'y': baseHeight },
        'diorama-component__left_sphere': { 'geo': 'sphere', 'mat': 'brass',
            'radius': sphereRadius,
            'x': -(glassWidth/2), 'y': columnHeight + sphereRadius },
        'diorama-component__right_sphere': { 'geo': 'sphere', 'mat': 'brass',
            'radius': sphereRadius,
            'x': (glassWidth/2), 'y': columnHeight + sphereRadius }
    },
    mappings: {
        'radius': 'brass.radius'
    }
});

AFRAME.registerPrimitive( 'a-diorama-cyl', {
    defaultComponents: {
        'diorama-component__left_column': { 'cyl': true, 'geo': 'column', 'mat': 'brass',
            'radius': columnRadius, 'height': columnHeight, 'depth': columnRadius,
            'x': -(glassWidth/2), },
        'diorama-component__base': { 'cyl': true, 'geo': 'ex-box', 'mat': 'wood',
            'width': baseWidth, 'height': baseHeight, 'depth': baseDepth },
        'diorama-component__trim_base_front': { 'cyl': true, 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight, 'z': glassDepth
        },
        'diorama-component__trim_base_back': { 'cyl': true, 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight, 'z': -glassDepth
        },
        'diorama-component__trim_top_front': { 'cyl': true, 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight + glassHeight - 0.02, 'z': glassDepth
        },
        'diorama-component__trim_top_back': { 'cyl': true, 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight + glassHeight - 0.02, 'z': -glassDepth
        },
        'diorama-component__top': { 'cyl': true, 'geo': 'ex-box', 'mat': 'wood',
            'width': glassWidth, 'height': baseHeight, 'depth': baseDepth,
            'y': baseHeight + glassHeight - bevelThickness//'0.99'
        },
        'diorama-component__glass': { 'cyl': true, 'geo': 'ex-box', 'mat': 'glass',
            'width': glassWidth, 'height': glassHeight, 'depth': glassDepth,
            'y': baseHeight },
        'diorama-component__left_sphere': { 'cyl': true, 'geo': 'sphere', 'mat': 'brass',
            'radius': sphereRadius, 'depth': columnRadius,
            'x': -(glassWidth/2), 'y': columnHeight + sphereRadius },
        // 'diorama-component__left_plack': { 'cyl': true, 'geo': 'safeguard', 'mat': 'glass',
        //     'width': safeguardWidth, 'height': safeguardHeight, 'depth': safeguardDepth,
        //     'x': -(glassWidth/2), 'y': columnHeight + sphereRadius -  safeguardHeight/2, 'z' : -0.15},
        // 'diorama-component__left_frosted_case': { 'cyl': true, 'geo': 'case', 'mat': 'glass',
        //     'width': frostedCaseWidth, 'height': frostedCaseHeight, 'depth': frostedCaseDepth,
        //     'x': -(glassWidth/2), 'y': columnHeight + sphereRadius - safeguardHeight/2, 'z' : frostedCaseDepth/2 + safeguardDepth + brassPlackDepth + 0.1 - 0.2},
        // 'diorama-component__left_brass_plack': { 'cyl': true, 'geo': 'plack', 'mat': 'brass',
        //     'width': brassPlackWidth, 'height': brassPlackHeight, 'depth': brassPlackDepth,
        //     'x': -(glassWidth/2), 'y': columnHeight + sphereRadius - brassPlackHeight/2, 'z' : brassPlackDepth/2 + safeguardDepth - 0.15},
    },
    mappings: {
        'radius': 'diorama-component.cylradius'
    }
});