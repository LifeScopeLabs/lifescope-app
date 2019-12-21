AFRAME.registerComponent('arrow', {
    dependencies: ['highlight'],

    schema: {
        x: { type: 'number', default: 0},
        y: { type: 'number', default: 0},
        z: { type: 'number', default: 0},

        direction: { default: 'up', oneOf: ['left', 'right', 'up', 'down', 'angle']},
        angle: { type: 'number', default: 0 },

        width: { type: 'number', default: 1 },
        height: { type: 'number', default: 1 },
        depth: { type: 'number', default: 0.01 },

        color: { default: 0xe8f1ff }, 
        opacity: { type: 'number', default: 1 },
        disabledopacity: { type: 'number', default: 0.2 },

    },
  

    init: function() {
        this._createArrow();
    },

    update: function(oldData) {
        var self = this;
        var changedData = Object.keys(self.data).filter(x => self.data[x] != oldData[x]);
        if (changedData.includes('disabled') && !!self.el.getAttribute('highlight')) {
            self.el.setAttribute('highlight', { 
                disabled: this.data.disabled
            } );
        }
    },

    remove: function () {
        if (this.el.object3DMap.hasOwnProperty('mesh')) {
            this.el.removeObject3D('mesh');
        }
    },


    _createArrow() {
        var self = this;
        var data = self.data;

        var mat, geom, mesh;

        data.offset = {
            x: 0 + data.x,
            y: 0 + data.y,
            z: 0 + data.z,
        }

        var shape = new THREE.Shape();
        var width = data.width;
        var height = data.height;

        shape.moveTo( 0, height/2 );
        shape.lineTo( width/2, -height/2 );
        shape.lineTo( -width/2, -height/2 );
        shape.lineTo( 0, height/2 );
    
        geom = new THREE.ShapeBufferGeometry( shape );

        var rotationZ = data.angle;
        switch (data.direction) {
            case 'up':
                break;
            case 'left':
                rotationZ = 90;
                break;
            case 'down':
                rotationZ = 180;
                break;
            case 'right':
                rotationZ = -90;
                break;
            default:
                break;
        }
        geom.rotateZ(2 * Math.PI * rotationZ / 360);

        geom.translate(data.offset.x, data.offset.y, data.offset.z);
    
        var color = data.color;
        var opacity = data.disabled ? data.disabledopacity : data.opacity;
        var transparent = data.disabled ? true : false;
        mat = new THREE.MeshBasicMaterial( {
            color: new THREE.Color( color ),
            transparent: transparent,
            opacity: opacity,
            side: THREE.DoubleSide,
        } );
    
        mesh = new THREE.Mesh(geom, mat);
        mesh.name = 'arrow';

        self.el.setObject3D('mesh', mesh);  
    },
});


AFRAME.registerPrimitive( 'a-arrow', {
    defaultComponents: {
        'arrow': {
        },
        'highlight': {
            type: 'color',
            borderbaseopacity: 0.7,
            disabledopacity: 0.2,
            color: 0xe8f1ff,
        }
    },
    mappings: {
        'direction': 'arrow.direction',
        'color': 'arrow.color',
        'width': 'arrow.width',
        'height': 'arrow.height',
        'hover': 'highlight.hover',
        'active': 'highlight.active',
        'disabled': 'highlight.disabled',
        'hovercolor': 'highlight.hoverColor',
        'activecolor': 'highlight.activeColor',
    }
});