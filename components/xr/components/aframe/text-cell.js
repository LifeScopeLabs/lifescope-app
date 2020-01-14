var loadBMFont = require('load-bmfont');

var FONT_BASE_URL = 'https://cdn.aframe.io/fonts/';
var FONTS = {
  aileronsemibold: FONT_BASE_URL + 'Aileron-Semibold.fnt',
  dejavu: FONT_BASE_URL + 'DejaVu-sdf.fnt',
  exo2bold: FONT_BASE_URL + 'Exo2Bold.fnt',
  exo2semibold: FONT_BASE_URL + 'Exo2SemiBold.fnt',
  kelsonsans: FONT_BASE_URL + 'KelsonSans.fnt',
  monoid: FONT_BASE_URL + 'Monoid.fnt',
  mozillavr: FONT_BASE_URL + 'mozillavr.fnt',
  roboto: FONT_BASE_URL + 'Roboto-msdf.json',
  sourcecodepro: FONT_BASE_URL + 'SourceCodePro.fnt'
};
var DEFAULT_FONT = 'roboto';

function loadFont (src, yOffset) {
    return new Promise(function (resolve, reject) {
        loadBMFont(src, function (err, font) {
            if (err) {
                error('Error loading font', src);
                reject(err);
                return;
            }

            // Fix negative Y offsets for Roboto MSDF font from tool. Experimentally determined.
            if (src.indexOf('/Roboto-msdf.json') >= 0) { yOffset = 30; }
            if (yOffset) { font.chars.map(function doOffset (ch) { ch.yoffset += yOffset; }); }

            resolve(font);
        });
    });
}

function computeFontWidthFactor (font) {
    var sum = 0;
    var digitsum = 0;
    var digits = 0;
    font.chars.map(function (ch) {
        sum += ch.xadvance;
        if (ch.id >= 48 && ch.id <= 57) {
        digits++;
        digitsum += ch.xadvance;
        }
    });
        return digits ? digitsum / digits : sum / font.chars.length;
    }

function computeWidth (wrapPixels, wrapCount, widthFactor) {
    return wrapPixels || ((0.5 + wrapCount) * widthFactor);
}


function _createText(opts={})  {
    var self = this;
    var data = self.data;
    var id = opts.id || '';
    var textName = id != '' ? `text__${id}` : 'text';

    var fontSize = opts.fontsize || data.fontsize;
    var width = opts.width || data.width;
    var wrapCount = opts.wrapcount || data.wrapcount;
    if (data.wrapfit) {
        wrapCount =  (width / fontSize) * (20/0.3); 
    }
    var wrapSize = (wrapCount) / 20;
    var widthScale = 0.3 / (width);
    var textWidth = width * fontSize * widthScale * wrapSize;
    var xOffset = (textWidth - width) / 2;

    var text = opts.text || data.text;
    var height = opts.height || data.height;
    var color = opts.color || data.color;

    self.el.setAttribute(textName, {
        // id: id,
        value: text,
        width: textWidth,
        height: height,
        wrapCount: wrapCount,
        xOffset: xOffset,
        color: color,
        anchor: data.anchor,
    });

    var textObj = self.el.getObject3D(textName);
    this.textObj = textObj;
}

function _setUpTextHandler(id='', offset={}) {
    var self = this;
    var object3DName = id != '' ? `text__${id}` : 'text';
    var textObj = self.el.getObject3D(object3DName);
    var lineHeight = textObj.geometry.layout._lineHeight;
    var linesTotal = textObj.geometry.layout._linesTotal;
    var textScale = textObj.scale.x;
    var halfLines = linesTotal % 2 == 0 ? linesTotal/2 : (linesTotal)/2 - 1;
    var offsetY = self.data.height/2;
    if (linesTotal>1) { offsetY -= halfLines*(lineHeight * textScale); }
    else { offsetY -= (lineHeight * textScale)/2 }

    textObj.translateY(offsetY);
    if (offset.x) textObj.translateX(offset.x);
    if (offset.y) textObj.translateY(offset.y);
    if (offset.z) textObj.translateZ(offset.z);

    self._setUpClipping(id);
}

function _setUpFAHandler(id='', offset={}) {
    var obj = this.el.getObject3D('fa-' + id);
    var width = obj.geometry.parameters.width;
    obj.translateX(width/2);
    obj.translateY(-width/2);
    if (offset.x) obj.translateX(offset.x);
    if (offset.y) obj.translateY(offset.y);
    if (offset.z) obj.translateZ(offset.z);
}

function _setUpClipping(id='') {
    var self = this;
    var el = self.el;
    if (self.clippingSetUp) {
        return;
    }

    var object3DName = id != '' ? `text__${id}` : 'text';
    var textObj = self.el.getObject3D(object3DName);
    var lineHeight = textObj.geometry.layout._lineHeight;
    var linesTotal = textObj.geometry.layout._linesTotal;
    var textScale = textObj.scale.x;

    var offsetY = 0;

    var renderer = el.sceneEl.renderer;
    renderer.localClippingEnabled = true;

    el.sceneEl.object3D.updateMatrixWorld();
    var pos = new THREE.Vector3();
    el.object3D.getWorldPosition(pos);
    var posy = pos.y; 
    var height = textObj.geometry.layout._opt.height;

    var normalBot = new THREE.Vector3( 0, 1, 0 );
    var constantBot = -(posy + self.data.height/2 + offsetY - height);

    if (self.data.nobr) {
        var lineRemainder = (height) % (lineHeight * textScale);
        constantBot -= lineRemainder;
    }

    var clippingPlaneBot = new THREE.Plane( normalBot, constantBot );
    self.clippingPlaneBot = clippingPlaneBot;

    var normalTop = new THREE.Vector3( 0, -1, 0 );
    var constantTop = posy + self.data.height/2 + offsetY

    var clippingPlaneTop = new THREE.Plane( normalTop, constantTop );
    self.clippingPlaneTop = clippingPlaneTop;

    var mat = textObj.material;
    mat.clipping = true;
    mat.clippingPlanes = [clippingPlaneBot, clippingPlaneTop];

    mat.vertexShader = 'precision highp float;\n' + 
        '#include  <clipping_planes_pars_vertex>\n' +
        mat.vertexShader.replace(/(void main.*)/, '$1\n  #include <begin_vertex>')
        .replace(/}$/, '  #include <project_vertex>\n  #include <clipping_planes_vertex>\n}');

    mat.fragmentShader = 'precision highp float;\n' + 
        '#include  <clipping_planes_pars_fragment>\n' + 
        mat.fragmentShader.replace(/(void main.*)/, '$1\n  #include <clipping_planes_fragment>');
    
    // set isMeshBasicMaterial so that the WebGLRenderer updates opacity uniform during animations
    mat.isMeshBasicMaterial = true;
    mat.needsUpdate = true;
    self.clippingSetUp = true;
}


function _updateClipping(id='') {
    var self = this;
    var el = self.el;
    if (!self.clippingPlaneTop) {return;}


    var object3DName = id != '' ? `text__${id}` : 'text';
    var textObj = self.el.getObject3D(object3DName);
    if (!textObj) {
        return;
    }
    var lineHeight = textObj.geometry.layout._lineHeight;
    var linesTotal = textObj.geometry.layout._linesTotal;
    var textScale = textObj.scale.x;

    var offsetY = 0;

    el.sceneEl.object3D.updateMatrixWorld();
    var pos = new THREE.Vector3();
    el.object3D.getWorldPosition(pos);
    var posy = pos.y; 
    var height = textObj.geometry.layout._opt.height;


    var constantBot = -(posy + self.data.height/2 + offsetY - height);
    self.clippingPlaneBot.constant = constantBot;

    if (self.data.nobr) {
        var lineRemainder = (height) % (lineHeight * textScale);
        constantBot -= lineRemainder;
    }

    var constantTop = posy + self.data.height/2 + offsetY
    self.clippingPlaneTop.constant = constantTop;
    var mat = textObj.material;

    mat.needsUpdate = true;
}

AFRAME.registerSystem('text-cell', {
    schema: {}, 

    init: function () {
        var oldUpdateLayout = AFRAME.components["text"].Component.prototype.updateLayout;
        AFRAME.components["text"].Component.prototype.updateLayout = function()
            {
                oldUpdateLayout.call(this);
                this.el.emit('textlayoutchanged', {name: this.attrName, id: this.id});
            };
    },
  
  });

AFRAME.registerComponent('text-cell', {

    schema: {
        id: { type: 'string', default: '' },

        width: { type: 'number', default: 0.6 },
        height: { type: 'number', default: 0.6 },

        text: { type: 'string', default: 'text' },

        color:  { default: '#FFF' },

        fontsize: { type: 'number', default: 1 },
        wrapcount: { type: 'number', default: 20 },
        wrappixels: { type: 'number', default: 0 },

        nobr: { type: 'boolean', default: false },

        border: { type: 'boolean', default: true },
        bordersize: { type: 'number', default: 0.05 },
        borderColor: { default: '#484848' },

        wrapfit: { type: 'boolean', default: false },

        // justifycontent: { type: 'string', default: 'flexStart' },
        anchor: { type: 'string', default: 'center' },
    },

    init() {
        var self = this;
        var data = self.data;
        self.clippingSetUp = false;
        this._createText = _createText.bind(this);
        this._setUpTextHandler = _setUpTextHandler.bind(this);
        this._setUpFAHandler = _setUpFAHandler.bind(this);
        this._setUpClipping = _setUpClipping.bind(this);
        this._updateClipping = _updateClipping.bind(this);

        this.worldPosition = this.el.object3D.getWorldPosition();

    },

    update: function(oldData) {
        var self = this;
        var data = self.data;

        var textName = data.id != '' ? `text__${data.id}` : 'text';

        self.el.removeAttribute(textName);

        var font = self.data.font || DEFAULT_FONT;

        loadFont(FONTS[font]).then(
            (result) => {
                self.lineHeight = result.common.lineHeight;
                self.widthFactor = computeFontWidthFactor(result);
                self.textRenderWidth = computeWidth(self.data.wrappixels, self.data.wrapcount,
                    self.widthFactor);

                self.textScale = self.data.width / self.textRenderWidth;
                self.textHeight = self.lineHeight * self.textScale * self.data.fontsize;
                
                self.el.addEventListener('textlayoutchanged', self._textLayoutChangedHandler.bind(self),
                    {once: true});
                self.el.addEventListener('font-awesome.drawn', self._fontAwesomeDrawnHandler.bind(self),
                    {once: true})
            
                self._createText({ id: data.id, text: data.text, width: data.width, 
                    height: data.height, color: data.color });
            },
        );
    },

    tick() {
        var position = new THREE.Vector3();
        this.el.object3D.getWorldPosition(position);
        if (!!this.worldPosition && !this.comparePositions(this.worldPosition, position)){
            this._updateClipping(this.data.id);
            this.worldPosition = position;
        }
    },

    remove() {
        this.el.removeEventListener('textlayoutchanged', this._textLayoutChangedHandler.bind(this));
        this.el.removeEventListener('font-awesome.drawn', this._fontAwesomeDrawnHandler.bind(this));
    },

    comparePositions(posA, posB) {
        return posA.x == posB.x && posA.y == posB.y && posA.z == posB.z;
    },

    _textLayoutChangedHandler(evt) {
        this._setUpTextHandler(evt.detail.id || '', {});
    },

    _fontAwesomeDrawnHandler(evt) {
        if (!!evt.detail) {
            this._setUpFAHandler(evt.detail.id, {});
        }
    }
});

AFRAME.registerPrimitive('a-text-cell', {
	defaultComponents: {
		'text-cell': {},
	},
	mappings: {
        'id': 'text-cell.id',
        'value': 'text-cell.text',
        'width': 'text-cell.width',
        'height': 'text-cell.height',
        'fontsize': 'text-cell.fontsize',
        'wrapcount': 'text-cell.wrapcount',
        'nobr': 'text-cell.nobr',
        'color': 'text-cell.color',
        'font': 'text-cell.font',
        'wrapfit': 'text-cell.wrapfit',
        'lines': 'text-cell.lines',
        'anchor': 'text-cell.anchor',
	}
});

export { FONTS, DEFAULT_FONT, loadFont, computeWidth, computeFontWidthFactor };