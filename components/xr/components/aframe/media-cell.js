import TextureLoaderHelper from '../../util/TextureLoaderHelper.js';

function _buildMediaMesh(url, type, width, height, depth, offset, srcFit, aspectratio=0) {
    return new Promise((resolveMesh, rejectMesh) => {
        var mediaMaterial, colorMaterial, geom, mesh;

        var textureLoader = new THREE.TextureLoader();
        var loadFunction;
        if(type == 'video') {
            var textureLoaderHelper = new TextureLoaderHelper();
            loadFunction = textureLoaderHelper.getVideoTexture.bind(textureLoaderHelper);
        }
        else {
            loadFunction = textureLoader.load.bind(textureLoader);
        }

        var textureLoaderPromise = new Promise ( function(resolve, reject) {
            loadFunction( url,
                // onLoad
                function (texture) {
                    resolve(texture);
                },
                // onProgress
                function (xhr) {
                    // //  console.log(xhr);
                },
                // onError
                function (xhr) {
                    // if (CONFIG.DEBUG) {console.log(`failed to load ${url}`)}
                    textureLoader.load( '../../../static/images/LifeScope.png',
                        // onLoad
                        function (texture) {
                            resolve(texture);
                        },
                        // onProgress
                        function (xhr) {
                            // console.log(xhr);
                        },
                        // onError
                        function (xhr) {
                            reject(xhr);
                        }
                    );
                },
            );
        });

        textureLoaderPromise.then( function(texture) {
            var srcWidth = texture.image.videoWidth || texture.image.width;
            var srcHeight = texture.image.videoHeight || texture.image.height;
            var aspectRatio = (srcWidth || 1.0) / (srcHeight || 1.0);

            var geomWidth, geomHeight;
            if (srcFit == 'bothmax') {
                geomWidth = width;
                geomHeight = width / aspectRatio;
                if (geomHeight > height) {
                    geomHeight = height;
                    geomWidth = height * aspectRatio;
                }
            }
            else if (srcFit == 'width') {
                geomWidth = width;
                geomHeight = width / aspectRatio;
            }
            else {
                geomWidth = height * aspectRatio;
                geomHeight = height;
            }
            
            geom = new THREE.PlaneBufferGeometry( geomWidth, geomHeight );
            if(offset.roty) geom.rotateY(THREE.Math.degToRad(offset.roty));
            if(offset.rotx) geom.rotateX(THREE.Math.degToRad(offset.rotx));
            if(offset.rotz) geom.rotateZ(THREE.Math.degToRad(offset.rotz));
            geom.translate(offset.x, offset.y, offset.z);

            mediaMaterial = new THREE.MeshBasicMaterial( { map: texture } );
            mediaMaterial.name = type == 'video' ? 'mVideo' : "mImage";

            mesh = new THREE.Mesh(geom, mediaMaterial);
            mesh.name = type == 'video' ? 'video' : "image";
            resolveMesh(mesh);
        })
        .catch(function(error) {
            console.error(error);
            rejectMesh(error);
        });
    });
}


function _createMedia(offset = { x: 0, y: 0, z: 0, rotx: 0, roty: 0, rotz: 0 }) {
    var self = this;
    var data = self.data;

    var Type = data.type.charAt(0).toUpperCase() + data.type.slice(1);

    _buildMediaMesh(data.url, data.type, data.width, data.height, data.depth, offset, data.srcFit,
        data.aspectratio)
    .then( (mesh) => {
        self.media = mesh.material.map.image;

        switch (data.type) {
            case 'video':
                self.video = self.media;
                self._setVideoProgressListener()
                break;
            case 'image':
                self.image = self.media;
                break;
            default:
                break;
        }

        self._updateAspectRatio();
        if (data.animateLoad) {
            AFRAME.ANIME({
                targets: self.el.object3D.scale,
                easing: 'linear',
                x: [0, 1],
                y: [0, 1],
                z: [0, 1],
                duration: 1000*(data.animateInSeconds)
            });
        }
        self.el.setObject3D(data.type, mesh);
        self.el.emit('media-mesh-set', {id: self.el.getAttribute('id')});
    })
    .catch(function(error) {
        console.log('_createMedia error')
        console.error(error);
    });
}

function _updateAspectRatio() {
    var self = this;
    var data = self.data
    var media = self.media;
    var srcWidth = media.videoWidth || media.width;
    var srcHeight = media.videoHeight || media.height;
    var aspectRatio = (srcWidth || 1.0) / (srcHeight || 1.0);
    if (!data.aspectratio || data.aspectratio != aspectRatio) {
        self.el.setAttribute('aspectratio', aspectRatio);
    }
    var geomWidth, geomHeight;
    if (data.srcFit == 'width') {
        geomHeight = data.width / aspectRatio;
        if (data.height != geomHeight) {
            self.el.setAttribute('height', geomHeight);
        }
    }
    else {
        geomWidth = data.height * aspectRatio;
        if (data.width != geomWidth) {
            self.el.setAttribute('width', geomWidth);
        }
    }
}

function getCenterPoint(mesh) {
    var geometry = mesh.geometry;
    geometry.computeBoundingBox();   
    var center = geometry.boundingBox.getCenter();
    mesh.localToWorld( center );
    return center;
}




AFRAME.registerComponent('media-cell', {
    schema: {
        id: { type: 'string', default: '' },
        x: { type: 'number', default: 0},
        y: { type: 'number', default: 0},
        z: { type: 'number', default: 0},
        scale: { type: 'number', default: 1 },

        type: { type: 'string', default: 'image' },

        url: {type: 'string', default: ''},
        srcFit: { type: 'string', default: 'width' },

        width: { type: 'number', default: 0.6 },
        height: { type: 'number', default: 0.6 },
        depth: { type: 'number', default: 0.01 },

        hoverPlayButton: { type: 'boolean', default: false },
        activePlayButton: { type: 'boolean', default: false },
        isplaying: { type: 'boolean', default: false },

        hoverSeeking: { type: 'boolean', default: false },
        activeSeeking: { type: 'boolean', default: false },

        color: { default: 0xe8f1ff},
        opacity: { type: 'number', default: 0.2 },
        metalness: { type: 'number', default: 0.0 },
        reflectivity: { type: 'number', default: 0.5 },
        roughness: { type: 'number', default: 0.2 },

        repeatU: { type: 'number', default: 4},
        repeatV: { type: 'number', default: 1},

        selected: { type: 'boolean', default: false },
        borderwidth: { type: 'number', default: 0.02 },
        aspectratio: { type: 'number', default: 0 },

        animateLoad: { type: 'boolean', default: true },
        animateInSeconds: { type: 'number', default: 0.5 },
        animateOutSeconds: { type: 'number', default: 0.2 },

        disabled: { type: 'boolean', default: false },

    },
  
    multiple: true,

    init: function() {
        var self = this;

        self.originalHeight = self.data.height;
        self.originalWidth = self.data.width;

        self.seekingPoint = null;

        this.el.addEventListener("mousedown", evt => {
            if(!self.data.selected) {
                self._animateActive();
            }
            if (self.intersectingRaycaster != null) {
                 const intersection = this.intersectingRaycaster.getIntersection(this.el);
                 self.intersection = intersection;
                 if (intersection) {
                    switch (intersection.object.name) {
                        case 'videolength':
                        case 'videoprogress':
                        case 'videoseekingpoint':
                            self.el.setAttribute('activeseeking', true);
                            break;
                        case 'playPauseButton':
                            self.el.setAttribute('activeplaybutton', true);
                        default:
                            break;
                    }
                    if (intersection.object.name.startsWith('videobuffered')) {
                        self.el.setAttribute('activeseeking', true);
                    }
                }
            }
        });
        this.el.addEventListener("mouseup", evt => {
            self.el.setAttribute('activeseeking', false);
            self.el.setAttribute('activePlayButton', false);
        });
        this.el.addEventListener("raycaster-intersected", evt => {
            self.intersectingRaycaster = evt.detail.el.components.raycaster;
            // console.log("raycaster-intersected");
        });
        this.el.addEventListener("raycaster-intersected-cleared", evt => {
            // console.log('raycaster-intersected-cleared');
            if (self.intersectingRaycaster != null) {
                const intersection = self.intersectingRaycaster.getIntersection(self.el);
                if (intersection == undefined) {
                    self.intersectingRaycaster = null;
                }
                else {
                    // console.log('intersecting:')
                    // console.log(intersection.object.name);
                }
            }
            else {
                // console.log('self.intersectingRaycaster is null')
            }
            
            if (self.data.hoverPlayButton) {
                self.el.setAttribute('hoverplaybutton', false);
            }
            if (self.data.hoverSeeking) {
                self.el.setAttribute('hoverseeking', false);
            }
        });

        this._createMedia = _createMedia.bind(this);
        this._updateAspectRatio = _updateAspectRatio.bind(this);

        if (self.data.url != '' && self.data.type=="image") {
            self._createMedia();
        }

        if (self.data.url != '' && self.data.type=="video") {
            self._createMedia();
            if (self.data.selected && !!self.video) {
                self._createVideoControls();
            }
            else if (self.data.selected) {
                self.el.addEventListener('media-mesh-set', (evt) => {
                    //  console.log('media-mesh-set received');
                    self._createVideoControls();
                })
            }
        }


        if (self.data.selected) {
            self.el.setAttribute('text__videoprogress', {transparent: false});
            self.el.setAttribute('text__videoprogress', {opacity: 1});
        }
        else {
            self.el.setAttribute('text__videoprogress', {transparent: true});
            self.el.setAttribute('text__videoprogress', {opacity: 0});
        }
    },

    tick: function() {
        var self = this;
        if (self.video && self.data.isplaying) {
            self._updateProgressBar();
        }

        if (!this.intersectingRaycaster) {
           return;
        }
   
        const intersection = this.intersectingRaycaster.getIntersection(this.el);
        self.intersection = intersection;
        if (intersection) {
            switch (intersection.object.name) {
                case 'playPauseButton':
                    if(!self.data.hoverPlayButton) {
                        self.el.setAttribute('hoverplaybutton', true);
                    }
                    break;
                case 'videolength':
                case 'videoprogress':
                case 'videoseekingpoint':
                    if (!self.data.hoverSeeking) {
                        self.el.setAttribute('hoverseeking', true);
                    }
                    if (self.seekingPoint != intersection.point) {
                        self.seekingPoint = intersection.point;
                        self._updateSeeking(self.seekingPoint);
                    }
                    break;
                default:
                    break;
            }
            if (intersection.object.name.startsWith('videobuffered')) {
                if (self.seekingPoint != intersection.point) {
                    self.seekingPoint = intersection.point;
                    self._updateSeeking(self.seekingPoint);
                }
                if (!self.data.hoverSeeking) {
                    self.el.setAttribute('hoverseeking', true);
                }
            }
        }
    },

    update: function(oldData) {
        var self = this;
        var data = self.data;
        var changedData = Object.keys(self.data).filter(x => self.data[x] != oldData[x]);
        if ( changedData.includes('url') ) {
            self.el.setAttribute('aspectratio', 0);
            self.el.setAttribute('height', self.originalHeight);
            self.el.setAttribute('width', self.originalWidth);
        }
        if ( !!self.media && ['srcFit', 'width', 'height', ]
            .some(prop => changedData.includes(prop))) {
            self._updateAspectRatio();
        }

        if ( self.el.object3DMap.hasOwnProperty('image') &&
            ['url', 'srcFit', 'width', 'height', 'depth', 'aspectratio']
            .some(prop => changedData.includes(prop))) {
            self.el.removeObject3D('image');
            if (self.data.url != '' && self.data.type=="image") {
                self._createMedia();
            }
        }
        if ( self.el.object3DMap.hasOwnProperty('video') &&
            ['url', 'srcFit', 'width', 'height', 'depth', 'aspectratio']
            .some(prop => changedData.includes(prop)) ) {
            self.el.removeObject3D('video');
            if (self.data.url != '' && self.data.type=="video") {
                self._createMedia();
            }
        }
        if (
            [ 'selected', 'srcFit', 'width', 'height', 'depth', 'aspectratio',]
            .some(prop => changedData.includes(prop))) {
                if (self.el.object3DMap.hasOwnProperty('videocontrols')) {
                    this.el.removeObject3D('videocontrols');
                }
                if (this.el.object3DMap.hasOwnProperty('progressbar')) {
                    this.el.removeObject3D('progressbar');
                }
            if (!!self.video && self.data.selected && self.data.type == 'video') {
                self._createVideoControls();
            }
        }
        if (
            [ 'hoverPlayButton', 'activePlayButton', 'selected', ] //'isplaying'
            .some(prop => changedData.includes(prop))) {
                var colorPlayPauseButton = data.disabled ? 0xA9A9A9 : data.activePlayButton ? 0xFFD704 : data.hoverPlayButton ? 0x04FF5F : data.color;
                var group = self.el.getObject3D('videocontrols');
                if (group) {
                    var playPauseButton = group.children.find(function(obj) {
                        return obj.name == 'playPauseButton';
                    });
                    playPauseButton.material.color = new THREE.Color( colorPlayPauseButton );
                }
        }
        if (
            [ 'isplaying' ]
            .some(prop => changedData.includes(prop))) {
            if (!!self.video && self.data.selected && self.data.type == 'video') {
                self._updatePausePlayButton();
            }
        }

        if (
            [ 'selected' ]
            .some(prop => changedData.includes(prop))) {
                if (self.data.selected) {
                    self.el.setAttribute('text__videoprogress', {transparent: false});
                    self.el.setAttribute('text__videoprogress', {opacity: 1});
                }
                else {
                    self.el.setAttribute('text__videoprogress', {transparent: true});
                    self.el.setAttribute('text__videoprogress', {opacity: 0});
                }
        }

        if (
            [ 'hoverSeeking', 'activeSeeking', ] //'isplaying'
            .some(prop => changedData.includes(prop))) {
                if (!data.hoverSeeking && !data.activeSeeking) {
                    var group = self.el.getObject3D('progressbar') || new THREE.Group();
                    var mesh = group.children.find(function(obj) {
                        return obj.name == 'videoseekingpoint';
                    });
                    if (mesh) {
                        group.remove(mesh);
                    }
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
        if (this.el.object3DMap.hasOwnProperty('border')) {
            this.el.removeObject3D('border');
        }
        if (this.el.object3DMap.hasOwnProperty('videocontrols')) {
            this.el.removeObject3D('videocontrols');
        }
        if (this.el.object3DMap.hasOwnProperty('progressbar')) {
            this.el.removeObject3D('progressbar');
        }
    },



    _createProgressBar() {
        var self = this;

        var progressBarY = -self.data.height/2 - 0.05;

        var group = self.el.getObject3D('progressbar') || new THREE.Group();
        group.name = 'gProgressbar'


        //
        // Video base
        //
        var geomVideoLength = new THREE.CylinderBufferGeometry( 0.01, 0.01, self.data.width, 8, 1 );

        geomVideoLength.rotateZ(Math.PI/2);
        geomVideoLength.translate(0, progressBarY, 0);
        var matVideoLength = new THREE.MeshBasicMaterial( {color: 0xaeaeae} );
        var meshVideoLength = new THREE.Mesh( geomVideoLength, matVideoLength );
        meshVideoLength.name = 'videolength';
        
        group.add(meshVideoLength);


        //
        // Progress
        //
        var minWidthPercent = 0.001;
        var minWidth = self.data.width*minWidthPercent;
        var geo = new THREE.CylinderBufferGeometry( 0.02, 0.02, minWidth, 8, 1 );
        geo.rotateZ(Math.PI/2);
        geo.translate(minWidth/2, progressBarY, 0);

        geo.morphAttributes.position = [];

        var positions = geo.attributes.position.array;
        var morphPositions = [];

        for ( var i = 0; i < positions.length; i += 3 ) {

            var x = positions[ i ];
            var y = positions[ i + 1 ];
            var z = positions[ i + 2 ];

            morphPositions.push(

                x / minWidthPercent,
                y ,
                z

            );

        }

        geo.morphAttributes.position[ 0 ] = new THREE.Float32BufferAttribute( morphPositions, 3 );
        
        var mat = new THREE.MeshBasicMaterial( 
            {
                color: 0x27BEFF, 
                morphTargets: true
            }
        );
        var meshVideoProgress = new THREE.Mesh( geo, mat );
        meshVideoProgress.translateX(-self.data.width/2);
        meshVideoProgress.name ='videoprogress';
        group.add(meshVideoProgress);

        //
        // Buffered
        //
        var bufferedMeshes = self._createBuffers();
        if (bufferedMeshes.length != 0) {
            bufferedMeshes.forEach( mesh => group.add(mesh));
        }

        self.el.setObject3D('progressbar', group);   
    },

    _updateProgressBar() {
        var self = this;

        var group = self.el.getObject3D('progressbar') || new THREE.Group();
        var meshVideoProgress;
        if (self.el.object3DMap.hasOwnProperty('progressbar')) {
            meshVideoProgress = group.children.find(function(obj) {
                return obj.name == 'videoprogress';
              });
        }
        else {
            return;
        }

        var progressPercent = self.video.currentTime/self.video.duration;
        meshVideoProgress.morphTargetInfluences[ 0 ] = progressPercent;

        if (self.video.buffered && self.video.buffered.length != 0) {
            self._updateBuffered();
        }
    },

    _createBuffers() {
        var self = this;
        var meshes = [];

        var minWidthPercent = 0.001;
        var minWidth = self.data.width*minWidthPercent;
        var progressBarY = -self.data.height/2 - 0.05;

        if (self.video.buffered && self.video.buffered.length != 0) {
            var i = 0;
            const bufferedLengths = self.video.buffered.length;
            const timeRange = self.video.buffered;
            const duration = self.video.duration;
            const width = self.data.width;
            while (i < bufferedLengths) {
                var start = timeRange.start(i);
                var end = timeRange.end(i);
                var meshBuffered = self._createBufferMesh(start, end, duration, width, minWidth, minWidthPercent);
                meshBuffered.translateY(progressBarY);
                meshBuffered.name = 'videobuffered-' + i;
                meshes.push(meshBuffered);
                i++;
            }
        }
        return meshes;
    },

    _createBufferMesh(start, end, duration, width, minWidth, minWidthPercent) {
        var bufferedPercent = (end-start)/duration;
        var bufferedStartX = (1/2 - start/duration ) * width;// + minWidth;//+  1/2 - bufferedPercent/2
        var geomBuffered = new THREE.CylinderBufferGeometry( 0.015, 0.015, minWidth, 8, 1 );

        geomBuffered.rotateZ(Math.PI/2);
        geomBuffered.translate(minWidth/2, 0, 0);

        geomBuffered.morphAttributes.position = [];

        var bufferedPositions = geomBuffered.attributes.position.array;
        var bufferedMorphPositions = [];

        for ( var j = 0; j < bufferedPositions.length; j += 3 ) {
            var x = bufferedPositions[ j ];
            var y = bufferedPositions[ j + 1 ];
            var z = bufferedPositions[ j + 2 ];
            bufferedMorphPositions.push(
                x / minWidthPercent,
                y ,
                z
            );
        }

        geomBuffered.morphAttributes.position[ 0 ] = new THREE.Float32BufferAttribute( bufferedMorphPositions, 3 );

        var matBuffered = new THREE.MeshBasicMaterial( 
            {
                color: 0x29F1FF, 
                morphTargets: true
            }
        );
        var meshBuffered = new THREE.Mesh( geomBuffered, matBuffered );
        meshBuffered.translateX(-bufferedStartX);
        return meshBuffered;
    },

    _updateBuffered() {
        var self = this;
        var i = 0;
        const bufferedLengths = self.video.buffered.length;
        const timeRange = self.video.buffered;
        const duration = self.video.duration;
        const width = self.data.width;
        var progressBarY = -self.data.height/2 - 0.05;

        var minWidthPercent = 0.001;
        var minWidth = self.data.width*minWidthPercent;

        var group = self.el.getObject3D('progressbar');

        var currentBufferedIndices = [];
        var bufferedMeshes;
        if (this.el.object3DMap.hasOwnProperty('progressbar')) {
            bufferedMeshes = group.children.filter( obj => obj.name.startsWith('videobuffered'));
            if (Array.isArray(bufferedMeshes) && bufferedMeshes.length != 0) {
                bufferedMeshes.forEach( obj => currentBufferedIndices.push(+obj.name.match(/\d+$/)));
            }
            
        }

        while (i < bufferedLengths) {
            var start = timeRange.start(i);
            var end = timeRange.end(i);
            if (currentBufferedIndices.includes(i)) {
                var meshBuffered = bufferedMeshes.find(function(obj) {
                    return obj.name == 'videobuffered-' + i;
                  });
                var bufferedPercent = (end-start)/duration;
                meshBuffered.morphTargetInfluences[ 0 ] = bufferedPercent;
            }
            else {
                var meshBuffered = self._createBufferMesh(start, end, duration, width, minWidth, minWidthPercent);
                meshBuffered.translateY(progressBarY);
                meshBuffered.name = 'videobuffered-' + i;
                group.add(meshBuffered);
            }
            i++;
        }
    },

    _createVideoControls() {
        this._createProgressBar();
        this._updatePausePlayButton();
    },

    _updatePausePlayButton() {
        var self = this;
        var data = self.data;

        var group = self.el.getObject3D('videocontrols') || new THREE.Group();

        if (this.el.object3DMap.hasOwnProperty('videocontrols')) {
            var meshPlayPauseButton = group.children.find(function(obj) {
                return obj.name == 'playPauseButton';
              });
            group.remove(meshPlayPauseButton);
        }


        // play/pause button
        var playPauseButton = new THREE.Shape();
        var hole = new THREE.Path();
        var playWidth = 0.1;
        var playHeight = 0.1;
        var playDepth = 0.01;

        // pause button
        if (self.data.isplaying) {
            playPauseButton.moveTo( -playWidth/2, -playHeight/2 );
            playPauseButton.lineTo( -playWidth/2, playHeight/2 );
            playPauseButton.moveTo( playWidth/2, playHeight/2 );
            playPauseButton.lineTo( playWidth/2, -playHeight/2 );
            
            hole.moveTo( playWidth/4, playHeight/2 );
            hole.lineTo( playWidth/4, -playHeight/2 );
            hole.lineTo( -playWidth/4, -playHeight/2 );
            hole.lineTo( -playWidth/4, playHeight/2 );

            playPauseButton.holes = [hole];
        }
        else { // play button
            playPauseButton.moveTo( playHeight/2, 0 );
            playPauseButton.lineTo( -playHeight/2, playWidth/2 );
            playPauseButton.lineTo( -playHeight/2, -playWidth/2, );
            playPauseButton.lineTo( playHeight/2, 0 );
        }
    
        var geomPlayPauseButton = new THREE.ShapeBufferGeometry( playPauseButton );

        var progressBarY = -self.data.height/2 - 0.05;
        var playPauseButtonOffsetX = self.data.width/2 - 0.1;
        var playPauseButtonOffsetY = progressBarY - 0.2;
        geomPlayPauseButton.translate(-playPauseButtonOffsetX, playPauseButtonOffsetY, 0);

        var colorPlayPauseButton = data.disabled ? 0xA9A9A9 : data.activePlayButton ? 0xFFD704 : data.hoverPlayButton ? 0x04FF5F : data.color;
        var opacity = data.disabled ? 0.2 : data.opacity;
        var transparent = data.disabled ? true : false;
        var matPlayPauseButton = new THREE.MeshBasicMaterial( {color: new THREE.Color( colorPlayPauseButton ),
            transparent: transparent,
            opacity: opacity,
            side: THREE.DoubleSide,},
        );
    
        var meshPlayPauseButton = new THREE.Mesh(geomPlayPauseButton, matPlayPauseButton);
        meshPlayPauseButton.name = 'playPauseButton';
        group.add(meshPlayPauseButton);
        group.name = 'gVideocontrols';

        self.el.setObject3D('videocontrols', group);   
    },

    _playPauseHandler() {
        var self = this;
        try {
            if (self.video.paused) {
                self.video.play();
                self.el.setAttribute('isplaying', true);
            }
            else {
                self.video.pause();
                self.el.setAttribute('isplaying', false);
            }
        }
        catch (error) {
            console.log('error in _playPauseHandler');
            console.error(error);
        }
    },

    _videoSeekingHandler() {
        var self = this;
        try {
            if (self.video && self.seekingPercantage) {
                self.video.currentTime = self.video.duration * self.seekingPercantage;
            }
            else {
            }
        }
        catch (error) {
            console.log('error in _videoSeekingHandler');
            console.error(error);
        }
    },

    _setVideoProgressListener() {
        var self = this;
        if (self.video) {
            self.video.addEventListener("progress", evt => {
                self._updateProgressBar();
            });
        }
    },

    _createSeeking(point) {
        var self = this;
        var data = self.data;

        var group = self.el.getObject3D('progressbar') || new THREE.Group();
        var meshVideoLength = group.children.find(function(obj) {
            return obj.name == 'videolength';
          });

        var center = getCenterPoint(meshVideoLength);

        var b = new THREE.Vector3(1, 0, 0);

        var seekingPoint = new THREE.Vector3();
        seekingPoint.copy(point);
        seekingPoint = seekingPoint.projectOnVector(b)
        self.seekingPercantage = (seekingPoint.x + self.data.width*1.5/2)/(self.data.width*1.5);


        seekingPoint.add(center);

        var geometry = new THREE.CylinderBufferGeometry( 0.025, 0.025, 0.01, 8, 1 );
        geometry.rotateZ(Math.PI/2);
        var color = data.disabled ? 0xA9A9A9 : data.activeSeeking ? 0xFFD704 : 0xFFFF00;
        var material = new THREE.MeshBasicMaterial( {color: new THREE.Color(color)} );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.name = 'videoseekingpoint';
        seekingPoint = group.worldToLocal(seekingPoint);

        mesh.position.set(seekingPoint.x, seekingPoint.y, seekingPoint.z);
        mesh.updateMatrix();
        group.add( mesh );
    },

    _updateSeeking(point) {
        var self = this;
        var data = self.data;
        
        var group = self.el.getObject3D('progressbar') || new THREE.Group();
        var meshVideoLength = group.children.find(function(obj) {
            return obj.name == 'videolength';
          });
        var meshOldSeeking = group.children.find(function(obj) {
            return obj.name == 'videoseekingpoint';
          });

        if (!meshOldSeeking) {
            self._createSeeking(point);
            return
        }

        var center = getCenterPoint(meshVideoLength);

        var b = new THREE.Vector3(1, 0, 0);

        var seekingPoint = new THREE.Vector3();
        seekingPoint.copy(point);
        seekingPoint = seekingPoint.projectOnVector(b)
        self.seekingPercantage = (seekingPoint.x + self.data.width*1.5/2)/(self.data.width*1.5);

        seekingPoint.add(center);

        var color = data.disabled ? 0xA9A9A9 : data.activeSeeking ? 0xFFD704 : data.hoverSeeking ? 0xFFFF00 : data.color;
        meshOldSeeking.material.color = new THREE.Color( color );

        seekingPoint = group.worldToLocal(seekingPoint);
        meshOldSeeking.position.set(seekingPoint.x, seekingPoint.y, seekingPoint.z);
    },

    // TODO : fix anime.js keyframes
    _animateHover(originalValues=null) {
        if (this.animatingHover) {return;} 
        this.animatingHover = true;
        var self = this;
        var scale = originalValues ? originalValues : Object.assign({}, self.el.object3D.scale); //JSON.parse(JSON.stringify(obj))
        var x = scale.x;
        var y = scale.y;
        var xmax = x*1.1;
        var xmin = x*0.9;
        var ymax = y*1.1;
        var ymin = y*0.9;
        var dur = 500;


        AFRAME.ANIME({
            targets: self.el.object3D.scale,
            easing: 'linear',
            x: [x, xmax],
            y: [y, ymax],
            duration: dur/2,
        }).finished.then(() => {
            return AFRAME.ANIME({
                targets: self.el.object3D.scale,
                easing: 'linear',
                x: [xmax, xmin],
                y: [ymax, ymin],
                duration: dur,
            }).finished
        }
        ).then( () => {
            return AFRAME.ANIME({
                targets: self.el.object3D.scale,
                easing: 'linear',
                x: [xmin, x],
                y: [ymin, y],
                duration: dur/2,
                complete: function(anim) {
                    self.animatingHover = false;
                }
            }).finished
        }
        )
        .catch(error =>
            console.log(error)
        );
    },

    _animateActive(originalValues=null) {
        if (this.animatingActive) { return;}
        this.animatingActive = true;
        var self = this;
        var rot = originalValues ? originalValues : Object.assign({}, self.el.object3D.rotation);
        var step = (2*Math.PI/ 100) * 2;
        var x = rot._x;
        var y = rot._y;
        var z = rot._z;
        var xmin = x-step;
        var xmax = x+step;
        var ymin = y-step;
        var ymax = y+step;
        var zmin = z-step;
        var zmax = z+step;
        var dur = 250;
        AFRAME.ANIME({
            targets: self.el.object3D.rotation,
            easing: 'linear',
            // x: xmin,
            // y: ymin,
            z: zmin,
            duration: dur,
            
        }).finished
        .then(() => {
            return AFRAME.ANIME({
                targets: self.el.object3D.rotation,
                easing: 'linear',
                // x: xmax,
                // y: ymin,
                z: zmax,
                duration: dur,
                complete: function(anim) {
                    self.animatingActive = false;
                    AFRAME.ANIME({
                        targets: self.el.object3D.rotation,
                        easing: 'linear',
                        x: x,
                        y: y,
                        z: z,
                        duration: dur/2,
                    })
                }
            }).finished
        })
    }
});


AFRAME.registerPrimitive( 'a-media-cell', {
    defaultComponents: {
        'media-cell__cell': {
        },
        'text__videoprogress': { value: '', align: 'center'},
    },
    mappings: {
        'src': 'media-cell__cell.url',
        'srcfit': 'media-cell__cell.srcFit',
        'width': 'media-cell__cell.width',
        'height': 'media-cell__cell.height',
        'scale': 'media-cell__cell.scale',
        'aspectratio': 'media-cell__cell.aspectratio',
        'selected': 'media-cell__cell.selected',
        'hoverplaybutton': 'media-cell__cell.hoverPlayButton',
        'activeplaybutton': 'media-cell__cell.activePlayButton',
        'hoverseeking': 'media-cell__cell.hoverSeeking',
        'activeseeking': 'media-cell__cell.activeSeeking',
        'isplaying': 'media-cell__cell.isplaying',
        'type': 'media-cell__cell.type',
        'id': 'media-cell__cell.id',
        'animate-load': 'media-cell__cell.animateLoad',
        'animatein': 'media-cell__cell.animateInSeconds',
        'animateout': 'media-cell__cell.animateOutSeconds',
    }
});

export { _buildMediaMesh, _createMedia, _updateAspectRatio, getCenterPoint };