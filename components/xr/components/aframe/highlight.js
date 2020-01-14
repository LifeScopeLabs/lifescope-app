function _raycasterIntersectedHandler(evt) {
  this.intersectingRaycaster = evt.detail.el.components.raycaster;
}

function _raycasterIntersectedClearedHandler(evt) {
  if (this.intersectingRaycaster != null) {
      const intersection = this.intersectingRaycaster.getIntersection(this.el);
      if (intersection == undefined) {
          this.intersectingRaycaster = null;
      }
      else {
      }
  }
  else {
      // console.log('self.intersectingRaycaster is null')
  }

  if(this.data.hover) {
    this.el.setAttribute('highlight', {'hover': false});
  }
}

function _mousedownHandler(evt) {
  this._handleIntersection('active');
}

function _mouseupHandler(evt) {
  if (this.el.getAttribute('highlight').active) {
    this.el.setAttribute('highlight', {'active': false});
  }
}

AFRAME.registerComponent('highlight', {
  schema: {
    hover: { type: 'boolean', default: false },
    active: { type: 'boolean', default: false },
    disabled: { type: 'boolean', default: false },
    color: { type: 'color', default: 0x484848 },
    hoverColor: { type: 'color', default: 0x04FF5F },
    activeColor: { type: 'color', default: 0xFFD704 },
    disabledColor: { default: 0xA9A9A9 },
    type: { default: 'color', oneOf: ['color', 'border', 'text'] },
    target: { default: '', type: 'string' },

    bordersize: { type: 'number', default: 0.05 },
    borderbaseopacity: { type: 'number', default: 0 },

    disabledopacity:  { type: 'number', default: 0.2 },

    createborder: { type: 'boolean', default: false },
    bordername: { type: 'string', default: 'border' },
  },

  init() {
    this.firstUpdate = true;

    this.raycasterIntersectedHandler = _raycasterIntersectedHandler.bind(this);
    this.raycasterIntersectedClearedHandler = _raycasterIntersectedClearedHandler.bind(this);
    this.mousedownHandler = _mousedownHandler.bind(this);
    this.mouseupHandler = _mouseupHandler.bind(this);
    
    if ( this.data.createborder ) {
      this._createBorder();
    }
  },

  update: function(oldData) {
    var self = this;
    var data = self.data;
    var changedData = Object.keys(self.data).filter(x => self.data[x] != oldData[x]);

    if ( changedData.includes('disabled') ) {
      this.el.setAttribute('highlight', { 'hover': false, 'active': false });
    }

    if (['hover', 'active', 'disabled'].some(prop => changedData.includes(prop))) {
        if (data.type == 'color') {
          self._updateColor();
        }
        else if (data.type == 'text') {
          self._updateTextColor();
        }
        else if (data.type == 'border' && self.el.object3DMap.hasOwnProperty(this.data.bordername) ) {
          self._updateColor(this.data.bordername);
        }
    }

    if (this.firstUpdate) {
        this.firstUpdate = false;
        return;
    }
    if (changedData.includes('disabled')) {
        if (!data.disabled) {
            this.addHandlers();
        }
        else {
            this.removeHandlers();
        }
    }
  },

  tick: function() {
    this._handleIntersection();
  },


  remove() {
    this.removeHandlers();
  },

  play() {
      if (!this.data.disabled) { //this.data.enabled && 
          this.addHandlers();
      }
  },

  pause() {
      if (!this.data.disabled) {
          this.removeHandlers();
      }
  },

  addHandlers: function() {
      this.el.addEventListener("raycaster-intersected", this.raycasterIntersectedHandler );
      this.el.addEventListener("raycaster-intersected-cleared", this.raycasterIntersectedClearedHandler );
      this.el.addEventListener("mousedown", this.mousedownHandler );
      this.el.addEventListener("mouseup", this.mouseupHandler );

  },

  removeHandlers: function() {
      this.el.removeEventListener("raycaster-intersected", this.raycasterIntersectedHandler );
      this.el.removeEventListener("raycaster-intersected-cleared", this.raycasterIntersectedClearedHandler );
      this.el.removeEventListener("mousedown", this.mousedownHandler );
      this.el.removeEventListener("mouseup", this.mouseupHandler );
  },

  _createBorder() {
    var self = this;
    var data = self.data;

    var geomAttribute;

    if (data.target == '') {
      geomAttribute = self.el.getAttribute('geometry');
    }
    else {
      if (self.el.object3DMap.hasOwnProperty(data.target)) {
        var geo = self.el.getObject3D(data.target).geometry;
        geomAttribute = geo.parameters;
        if (geo.type == "PlaneBufferGeometry") {
          geomAttribute.primitive = "plane";
          geomAttribute.buffer = true;
          geomAttribute.skipCache = false;
          geomAttribute.segmentsHeight = geomAttribute.heightSegments || 1;
          geomAttribute.segmentsWidth = geomAttribute.widthSegments || 1;
        }
      }
      else {
        self.el.addEventListener('media-mesh-set', (evt) => {
          self._createBorder();
        });
        return;
      }
    }
    if (geomAttribute) {
      switch (geomAttribute.primitive){
        case 'sphere':
          self._createBorderSphere(geomAttribute);
          break;
        case 'plane':
          self._createBorderPlane(geomAttribute);
          break;
        default:
          break;
      }
      
    }
  },

  _createBorderSphere(geomAttribute) {
    var self = this;
    var data = self.data;

    var borderGeomAttribute = Object.assign({}, geomAttribute);
    borderGeomAttribute.radius = borderGeomAttribute.radius*(1 + data.bordersize);
    var geom = self.el.sceneEl.systems.geometry.getOrCreateGeometry(borderGeomAttribute);

    var color = data.active ? data.activeColor : data.hover ? data.hoverColor : data.color;

    var opacity = data.active || data.hover ? 1 : data.borderbaseopacity;
    var transparent = data.active || data.hover ? false : true;

    var mat = new THREE.MeshBasicMaterial( {
        color: new THREE.Color( color ),
        side: THREE.BackSide,
        opacity: opacity,
        transparent: transparent,
    } );
    var newMesh = new THREE.Mesh(geom, mat);
    newMesh.name = this.data.bordername;
    newMesh.updateMatrix();

    self.el.setObject3D(this.data.bordername, newMesh);  
  },

  _createBorderPlane(geomAttribute) {
    var self = this;
    var data = Object.assign({}, self.data);

    var mat, mesh;

    var borderGeomAttribute = Object.assign({}, geomAttribute);
    borderGeomAttribute.width = borderGeomAttribute.width*(1 + data.bordersize);
    borderGeomAttribute.height = borderGeomAttribute.height*(1 + data.bordersize);
    var cache = self.el.sceneEl.systems.geometry.cache;
    var hash = self.el.sceneEl.systems.geometry.hash(borderGeomAttribute);
    var isCached = !!cache[hash];
    var geom = self.el.sceneEl.systems.geometry.getOrCreateGeometry(borderGeomAttribute);
    if (!isCached) {
      geom.translate(0, 0, -0.001);
    }

    var color = data.active ? data.activeColor : data.hover ? data.hoverColor : data.color;

    var opacity = data.active || data.hover ? 1 : data.borderbaseopacity;
    var transparent = data.active || data.hover ? false : true;

    mat = new THREE.MeshBasicMaterial( {
      color: new THREE.Color( color ),
      side: THREE.FrontSide,
      opacity: opacity,
      transparent: transparent,
    } );
    mesh = new THREE.Mesh(geom, mat);
    mesh.name = this.data.bordername;

    self.el.setObject3D(this.data.bordername, mesh);
  },

  _updateColor(meshName='mesh') {
    var self = this;
    var data = self.data;

    var newColor = data.disabled ? data.disabledColor : data.active ? data.activeColor : data.hover ? data.hoverColor : data.color;

    var opacity = data.disabled ? data.disabledopacity : data.active || data.hover ? 1 : data.borderbaseopacity;
    var transparent = data.disabled ? true : data.active || data.hover ? false : true;

    var mesh = self.el.getObject3D(meshName);
    if (mesh) {
        mesh.material.color = new THREE.Color( newColor );
        mesh.material.opacity = opacity;
        mesh.material.transparent = transparent;
    }
  },

  _updateTextColor() {
    var self = this;
    var data = self.data;

    var newColor = data.disabled ? data.disabledColor : data.active ? data.activeColor : data.hover ? data.hoverColor : data.color;
    var txtObj = this.el.getObject3D('text')
    if(txtObj && txtObj.material) {
      txtObj.material.uniforms.color.value = new THREE.Color(newColor);
    }
  },

  _handleIntersection(attribute='hover') {
    var self = this;
    if (!this.intersectingRaycaster) {
        return;
    }

    var value = {};
    value[attribute] = true;
    const intersection = this.intersectingRaycaster.getIntersection(this.el);
    self.intersection = intersection;
    if (intersection && !self.data[attribute]) {
        if (self.data.target != '') {
          switch (intersection.object.name) {
            case self.data.target:
            case this.data.bordername:
                self.el.setAttribute('highlight', value);
                break;
            default:
              break;
          }
        }
        else {
          self.el.setAttribute('highlight', value);
        }
    }
  }
})