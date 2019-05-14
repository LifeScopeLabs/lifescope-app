import textureLoaderHelper from './textureLoaderHelper.js';

var brassBaseTexture, brassBumpTexture, brassNormalTexture;
var woodBaseTexture, woodBumpTexture, woodNormalTexture;

var railHeight = 1.2

var floorRad = 6;
var columnRadius = 0.05;
var columnHeight = railHeight + 0.01;

var sphereRadius = columnRadius * (3/2);

// self.data.cylradius * Math.sin(2 * Math.PI / self.data.radialsegments);
var baseWidth = (floorRad) * Math.sin(2 * Math.PI / 36);
var baseHeight = 0.075;
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


// Diorama
function createDioramaComponent(self) {
    var material, geom, mesh;
    var tlHelper = new textureLoaderHelper();

    if (self.data.mat == 'brass') {
        brassBaseTexture = tlHelper.loadTexture( 'bronze', 'base', 'jpg',
            function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set( 0, 0 );
                texture.repeat.set( self.data.repeatU, self.data.repeatV );
        });
        
        material = new THREE.MeshPhongMaterial( { map: brassBaseTexture,
            side:THREE.FrontSide,
            // reflectivity: self.data.reflectivity,
            // color: 0x552811,
            specular: 0x222222,
            shininess: 25,
            } );

        if (self.data.withBump) {
            brassBumpTexture = tlHelper.loadTexture( 'bronze', 'height',
                function (texture) {
                    material.bumpMap = texture;
                    material.bumpScale = 1;
                }
            );
        }
        if (self.data.withNormal) {
            brassNormalTexture = tlHelper.loadTexture( 'bronze', 'normal',
                function (texture) {
                    material.normalMap = texture;
                }
            );
        }
    }

    else if (self.data.mat == 'wood') {

        woodBaseTexture = tlHelper.loadTexture( 'wood-panel', 'base', 'jpg',
            function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.offset.set( 0, 0 );
                texture.repeat.set( self.data.repeatU, self.data.repeatV );
        });
        
        var material = new THREE.MeshPhongMaterial( { map: woodBaseTexture,
            side:THREE.DoubleSide,
            needsUpdate: true,
            // reflectivity: self.data.reflectivity,
            // color: 0x552811,
            specular: 0x222222,
            shininess: 25,
            bumpScale: 1} );

        if (self.data.withBump) {
            woodBumpTexture = tlHelper.loadTexture( 'wood-panel', 'height',
                function (texture) {
                    material.bumpMap = texture;
                    material.bumpScale = 1;
                }
            );
        }
        if (self.data.withNormal) {
            woodNormalTexture = tlHelper.loadTexture( 'wood-panel', 'normal',
                function (texture) {
                    material.normalMap = texture;
                }
            );
        }

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
            //amount: self.data.depth, // aframe 8.2 / three.js r92
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
        geom.translate(self.data.x + (self.data.width/2),
                self.data.y + self.data.height/2,
                self.data.z - self.data.depth/2);
    }

    mesh = new THREE.Mesh(geom, material);


    var group = self.el.getObject3D(self.id) || new THREE.Group();
    //if (self.data.helper) {group.add(new THREE.BoxHelper(floor, HELPER_COLOR));}
    // group.add(new THREE.BoxHelper(mesh, 0xffff00));
    group.add(mesh);
    self.el.setObject3D(self.id, group);        
}

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
        repeatU: { type: 'number', default: 4},
        repeatV: { type: 'number', default: 1},
        color: { default: 0xe8f1ff},
        opacity: { type: 'number', default: 0.2 },
        metalness: { type: 'number', default: 0.0 },
        reflectivity: { type: 'number', default: 0.5 },
        roughness: { type: 'number', default: 0.2 },
        withBump: { default: false },
        withNormal: { default: false },
        cyl: { default: false },
        helper: { default: false }
    },

    multiple: true,
  
    update: function() {
        var self = this;
        if (self.el.object3DMap.hasOwnProperty(self.id)) {
            self.el.removeObject3D(self.id);
        }
        createDioramaComponent(self); 
    }
});



function createStakeComponent(self) {
    var tlHelper = new textureLoaderHelper();

    var stakeGeom1, stakeGeom2, stakeGeom3;
    var material, mesh1, mesh2, mesh3;

    //load brass texture once
    brassBaseTexture = tlHelper.getOrLoadTexture( 'bronze', 'base', 'jpg',
        function (texture) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.offset.set( 0, 0 );
            texture.repeat.set( self.data.repeatU, self.data.repeatV );
    });
    brassBumpTexture = tlHelper.getOrLoadTexture( 'bronze', 'height' );
    brassNormalTexture = tlHelper.getOrLoadTexture( 'bronze', 'normal' );
    
    material = new THREE.MeshPhongMaterial( { map: brassBaseTexture,
        side:THREE.FrontSide,
        // reflectivity: self.data.reflectivity,
        // color: 0x552811,
        specular: 0x222222,
        shininess: 25,
        bumpScale: 1} );

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

    var group = self.el.getObject3D('group') || new THREE.Group();
    // group.add(new THREE.BoxHelper(mesh1, 0xffff00));
    group.add(mesh1);
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
        rotation: { type: 'number', default: 0 }, //degrees
        withBump: { default: false },
        withNormal: { default: false }
    },

    multiple: true,

    init: function() {
        var self = this;
        createStakeComponent(self);
    }
});


function createImageComponent(self) {
    var imgMaterial, colorMaterial, geom, mesh;

    var texture = new THREE.TextureLoader().load( self.data.imageURL, function () {
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

        imgMaterial = new THREE.MeshBasicMaterial( { map: texture } );
        colorMaterial = new THREE.MeshBasicMaterial( {color: new THREE.Color( 0xffffff )} );

        var materials = [
            colorMaterial,        // Left side
            colorMaterial,       // Right side
            colorMaterial,         // Top side
            colorMaterial,      // Bottom side
            colorMaterial,       // Front side
            imgMaterial         // Back side
        ];
        mesh = new THREE.Mesh(geom, materials);

        var group = self.el.getObject3D('image') || new THREE.Group();
        // group.add(new THREE.BoxHelper(mesh, 0xffff00));
        group.add(mesh);
        self.el.setObject3D('image', group);   
    } );
}

function formatTextDashes(text, boardWidth, maxChars) {
    if (text.length > maxChars) {
        text = text.substring(0,maxChars-3) + "..."
    }
    var charPixelRatio = 1.0;
    var charsPerRow = boardWidth / charPixelRatio;

    // if (text.length < charsPerRow) {
    //     return text;
    // }

    var i = 0;
    var formattedText = "";
    while (i < text.length - charsPerRow) {
        if (text.substring(i+charsPerRow-1,i+charsPerRow) == "." || text.substring(i+charsPerRow-1,i+charsPerRow) == " ") {
            formattedText += text.substring(i,i+charsPerRow) + "\n";
            if (text.substring(i+charsPerRow,i+charsPerRow+1) == " ") {
                i += 1; //skip space on new line
            }
            i += charsPerRow;
        }
        else {
            formattedText += text.substring(i,i+charsPerRow-1) + "-\n";
            i += charsPerRow-1;
        }
    }
    formattedText += text.substring(i, i+charsPerRow);

    return formattedText;
}

function formatTextNewlines(text, boardWidth, maxChars) {
    if (text.length > maxChars) {
        text = text.substring(0,maxChars-3) + "..."
    }
    var charPixelRatio = 1.0;
    var charsPerRow = boardWidth / charPixelRatio;

    var words = text.split(" ");

    var curNumChars = 0;
    var formattedText = "";
    for (var i = 0; i < words.length; i++) {
        if (words[i].length > boardWidth) {
            formattedText += words[i].substring(0, boardWidth - curNumChars) + "-\n"; // no other choice but to use -
            words[i] = words[i].substring(boardWidth - curNumChars, words[i].length);
            i -= 1; //keep trying this word until done with it
            curNumChars = 0; //because now on new line
        }
        else {
            if (boardWidth - curNumChars >= words[i].length) { // have room for full next word
                formattedText += words[i] + " ";
                curNumChars += words[i].length;
            }
            else {
                formattedText += "\n" + words[i] + " ";
                curNumChars = 0 + words[i].length; 
            }
        }
    }
    return formattedText;
}

function createTextComponent(self) {
    var material, geom, mesh;

    console.log('creating text geometry');
    console.log('self.data.rotation = ' + self.data.rotation);
    var fontLoader = new THREE.FontLoader();
    
    var font = fontLoader.load( self.data.font, //anonymous regular is monospace    
        function ( font ) {
            var charsPerRow = 29;
            var maxChars = 200;
            var text = formatTextNewlines(self.data.text, charsPerRow, maxChars)

            var shapes = font.generateShapes( text, 0.02 );
            
            var textGeom = new THREE.ShapeBufferGeometry( shapes );
            textGeom.computeBoundingBox();
            textGeom.rotateX((2 * Math.PI * self.data.rotation / 360));
            textGeom.rotateY(Math.PI);
            textGeom.rotateX((2 * Math.PI * 60 / 360)); // why 60?
            
            textGeom.translate(self.data.x, self.data.y, self.data.z);
            textGeom.translate(0,0,-0.02); //so it's not right inside the plank

            var textMat = new THREE.MeshPhongMaterial( { color: 0x000 } );

            mesh = new THREE.Mesh( textGeom, textMat );

                
            var group = self.el.getObject3D('group') || new THREE.Group();
            // group.add(new THREE.BoxHelper(mesh, 0xffff00));

            group.add(mesh);

            self.el.setObject3D('group', group);
        },
        // onProgress callback
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
        
        // onError callback
        function ( err ) {
            console.log( 'An error happened: ' + err );
        }
    );

}

AFRAME.registerComponent('image-component', {
    schema: {
        imageURL: {type: 'string', default: 'https://s3.amazonaws.com/lifescope-static/test/content/ls-room/10-Solved.png'},
        height: { type: 'number', default: 0},
        width: { type: 'number', default: 0 },
        depth: { type: 'number', default: 0.0},
        x: { type: 'number', default: 0},
        y: { type: 'number', default: 0},
        z: { type: 'number', default: 0},
        opacity: { type: 'number', default: 0.2 },
        srcFit: { type: 'string', default: 'width' },
        rotation: { type: 'number', default: 0}
    },

    multiple: true,


    update: function() {
        var self = this;
        if (self.el.object3DMap.hasOwnProperty('image')) {
            self.el.removeObject3D('image');
        }
        createImageComponent(self);
    }
});

AFRAME.registerComponent('text-component', {
    schema: {
        text: { type: 'string', default: "Hello, my friends. I am back with a new tutorial. Yes, you heard me correctly."},
        font: { type: 'string', default: '/static/fonts/Anonymous_Regular.json'},
        x: { type: 'number', default: 0},
        y: { type: 'number', default: 0},
        z: { type: 'number', default: 0},
        opacity: { type: 'number', default: 1 },
    },

    multiple: true,

    init: function() {
        var self = this;
        createTextComponent(self);
    }
});

AFRAME.registerPrimitive('a-custom-image', {
    defaultComponents: {
        'image-component': {
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
        'src': 'image-component.imageURL',
        'bump': 'diorama-component.withBump',
        'normal': 'diorama-component.withNormal'
    }
});



AFRAME.registerPrimitive( 'a-rail', {
    defaultComponents: {
        'diorama-component__left_column': { 'geo': 'column', 'mat': 'brass',
            'radius': columnRadius, 'height': columnHeight, 'depth': columnRadius,
            'x': 0, 'z': -(columnRadius/2)},
        'diorama-component__left_sphere': { 'geo': 'sphere', 'mat': 'brass',
            'radius': sphereRadius, 'depth': columnRadius,
            'x': 0, 'y': columnHeight + sphereRadius, 'z': -(columnRadius/2)},
        'diorama-component__base': { 'geo': 'ex-box', 'mat': 'wood',
            'width': baseWidth, 'height': baseHeight, 'depth': baseDepth,
            'repeatU': 1, 'repeatV': 1 },
        'diorama-component__trim_base_front': { 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight, 'z': glassDepth
        },
        'diorama-component__trim_base_back': { 'geo': 'box', 'mat': 'brass',
            'width': glassWidth, 'height': trimHeight, 'depth': trimDepth,
            'y': baseHeight, 'z': -glassDepth,
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
            'y': baseHeight + glassHeight - bevelThickness,//'0.99'
            'repeatU': 1, 'repeatV': 1 
        },
        'diorama-component__glass': { 'geo': 'ex-box', 'mat': 'glass',
            'width': glassWidth, 'height': glassHeight, 'depth': glassDepth,
            'y': baseHeight },
    },
    mappings: {
        'radius': 'diorama-component.cylradius',
        'bump': 'diorama-component.withBump',
        'normal': 'diorama-component.withNormal'
    }
});