AFRAME.registerComponent('flex-item', {
    schema: {
        width: { type: 'number', default: 1 },
        height: { type: 'number', default: 1 },
        dimtype: { type: 'string', default: 'el', },
        dimattr: { type: 'string', default: '' }
        // x positive, y negative
        // marginx: { type: 'vec2', default: { p: 0, n: 0 } }, 
        // marginy: { type: 'vec2', default: { p: 0, p: 0 } },
        // marginz: { type: 'vec2', default: { p: 0, n: 0 } },

        /* TODO
            margin
            order
            flex-grow
            flex-shrink
            flex-basis
            align-self
        */
    },

    init() {
        this.el.isFlexItem = true;

        switch (this.data.dimtype) {
            case 'el':
                this.data.width = +this.el.getAttribute('width') || this.data.width;
                this.data.height = +this.el.getAttribute('height') || this.data.height;
                break;
            case 'attr':
            case 'attribute':
                if (!!this.data.dimattr) {
                    this.data.width = +this.el.getAttribute(this.data.dimattr)['width'] || this.data.width;
                    this.data.height = +this.el.getAttribute(this.data.dimattr)['height'] || this.data.height;
                }
                else {
                    console.warn('dimtype is attribute but dimattr is undefined');
                }
                break;
            case 'flex-container':
                this.data.width = +this.el.getAttribute('flex-container')['width'] || this.data.width;
                this.data.height = +this.el.getAttribute('flex-container')['height'] || this.data.height;
                break;
            case 'sphere':
                var radius = +this.el.getAttribute('radius');
                this.data.width = radius * 2 || this.data.width;
                this.data.height = radius * 2 || this.data.height;
            default:
                break;
        }
    }
});


AFRAME.registerSystem('flex-container', {

    updateLayout(data, children) {
        var offsetX = 0;
        var offsetY = 0;
        var mainAxis = data.flexDirection;
        var crossAxis = mainAxis == 'row' ? 'column' : 'row';
        var mainAxisLength = this._childrenLength(children, mainAxis);
        var crossAxisLength = this._childrenLength(children, crossAxis);
        var mainAxisDimension = mainAxis == 'row' ? 'width' : 'height';
        var space = this._justifySpace(data.justifyContent, data[mainAxisDimension], mainAxisLength, children.length);
        switch (data.flexDirection) {
            case 'row':
                offsetX += this._justifyContent(data.justifyContent, data.width, mainAxisLength, space);
                break;
            case 'column':
                offsetY -= this._justifyContent(data.justifyContent, data.height, mainAxisLength, space);
                break;
            default:
                break;
        }
        children.forEach(child => {
            var childFlexItem= child.getAttribute('flex-item');
            var posx, posy;
            switch (data.flexDirection) {
                case 'row':
                    posx = offsetX + childFlexItem.width/2;
                    posy = offsetY - this._alignItems(data.alignItems, data.height, childFlexItem.height);

                    offsetX += childFlexItem.width + space;
                    break;
                case 'column':
                    posx = offsetX + this._alignItems(data.alignItems, data.width, childFlexItem.width);
                    
                    posy = offsetY - childFlexItem.height/2;
                    offsetY -= childFlexItem.height + space;
                    break;
                default:
                    break;
            }
            
            child.object3D.position.set(posx, posy, 0.001);
        });
    },

    // defines the alignment along the main axis
    _justifyContent(val, length, contentLength, space) {
        switch(val) {
            case 'flexStart':
            case 'space-between':
                return -length/2;
            case 'flexEnd':
                return length/2  - contentLength;
            case 'space-around':
                return (space - length)/2;
            case 'space-evenly':
                return space - (length/2);
            case 'center':
            default:
                return -contentLength/2;
        }

    },

    _justifySpace(val, length, contentLength, numItems) {
        var totalSpace = length - contentLength;

        switch(val) {
            case 'space-between':
                return totalSpace / (numItems - 1);
            case 'space-around':
                return totalSpace / numItems;
            case 'space-evenly':
                return totalSpace / (numItems + 1);
            default:
                return 0;
        }
    },

    _childrenLength(children, flexDirection='row') {
        var result = 0;

        var dimension = flexDirection == 'row' ? 'width' : 'height';
        var marginDirection = flexDirection == 'row' ? 'x' : 'y';
        children.forEach(child => {
            var flexItem = child.getAttribute('flex-item');
            result += flexItem[dimension];
        });
        return result;
    },

    _margin(flexItem, direction) {
        var margin = flexItem['margin' + direction]
        if (margin.x) { return margin.x + margin.y; }
        else return 0;
    },

    _alignItems(val, containerLength, contentLength) {
        switch(val) {
            case 'flexStart':
                return (contentLength - containerLength)/2;
            case 'flexEnd':
                return (containerLength - contentLength)/2;
            case 'center':
            default:
                return 0;
        }

    },

});

AFRAME.registerComponent('flex-container', {
    schema: {
        width: { type: 'number', default: 1 },
        height: { type: 'number', default: 1 },
        flexDirection: { type: 'string', default: 'row', onOf: ['row', 'column'] },
        justifyContent: { type: 'string', default: 'flexStart',
            onOf: ['flexStart', 'flexStart', 'center', 'space-between', 'space-around', 'space-evenly'] },
        alignItems: { type: 'string', default: 'center',
            onOf: ['flexStart', 'flexStart', 'center']  }, // TODO : stretch
        dimtype: { type: 'string', default: 'el', },
        needsUpdate: { type: 'boolean', default: true },
        /* TODO
            flex-wrap
            align-content
        */
    },

    init: function () {
        var self = this;
        this.el.isFlexContainer = true;

        switch (this.data.dimtype) {
            case 'el':
                this.data.width = +this.el.getAttribute('width') || this.data.width;
                this.data.height = +this.el.getAttribute('height') || this.data.height;
                break;
            default:
                break;
        }

        this.updateChildren();
    },

    update(oldData) {
        if (this.data.needsUpdate) {
            this.updateChildren();
            this.system.updateLayout(this.data, this.children);
            this.data.needsUpdate = false;
        }
    },

    updateChildren() {
        this.children = this.el.getChildEntities().filter((el) => {return el.isFlexItem});
    },

    flexItemAppendedHandler(evt) {
        this.system.updateLayout(this.data, this.children);
    }

});

AFRAME.registerPrimitive( 'a-flex-container', {
    defaultComponents: {
        'flex-item': { dimtype: 'flex-container' },
        'flex-container': { }
    },
    mappings: {
        'width': 'flex-item.width',
        'height': 'flex-item.height',
        'marginx': 'flex-item.marginx',
        'marginy': 'flex-item.marginy',
        'marginz': 'flex-item.marginz',
        'flex-direction': 'flex-container.flexDirection',
        'justify-content': 'flex-container.justifyContent',
        'align-items': 'flex-container.alignItems',
    }
});
