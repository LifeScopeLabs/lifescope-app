import { FONTS, DEFAULT_FONT, loadFont, computeWidth, computeFontWidthFactor } from './text-cell.js';
import { getContentTypeIconUnicode, getProviderTypeIconUnicode,
    getEventTypeIconUnicode } from '../../util/FAIconsUtil';
import moment from 'moment';

AFRAME.registerComponent('ls-cell', {

    schema: {
        id: { type: 'string', default: '' },

        width: { type: 'number', default: 0.6 },
        height: { type: 'number', default: 0.6 },

        background: { type: 'boolean', default: true },
        bgColor: { default: 0x22252a },
        bgOpacity: { type: 'number', default: 0.7 },

        facet: { type: 'string', default: 'content',
            onOf: ['content', 'events', 'contacts', 'people'] },

        contenttype: { type: 'string', default: '' },
        provider: { type: 'string', default: '' },
        connectionname: { type: 'string', default: '' },
        mediatype: { type: 'string', default: '' },
        mediaurl: { type: 'string', default: '' },

        embedthumbnail: { type: 'string', default: '' },
        title: { type: 'string', default: '' },
        price: { type: 'number', default: 0 },

        text: { type: 'string', default: '' },
        tags: { type: 'array', default: [] },
        url: { type: 'string', default: '' },

        avatarurl: { type: 'string', default: '' },
        contactname: { type: 'string', default: '' },
        contacthandle: { type: 'string', default: '' },

        eventtype: { type: 'string', default: '' },
        datetime: { type: 'string', default: '' },
        first_name: { type: 'string', default: '' },
        middle_name: { type: 'string', default: '' },
        last_name: { type: 'string', default: '' },

        color:  { default: '#FFF' },
        fontsize: { type: 'number', default: 1 },
        wrapcount: { type: 'number', default: 20 },
        wrappixels: { type: 'number', default: 0 },
        nobr: { type: 'boolean', default: false },

        border: { type: 'boolean', default: true },
        bordersize: { type: 'number', default: 0.05 },
        borderColor: { default: '#484848' },

        wrapfit: { type: 'boolean', default: false },

        animateLoad: { type: 'boolean', default: true },
        animateInSeconds: { type: 'number', default: 0.5 },
        animateOutSeconds: { type: 'number', default: 0.2 },
    },

    init: function() {
        var self = this;
        self.firstUpdate = true;

        self.headerScale = 2;
        self.headerFontSize = self.data.fontsize * self.headerScale;

        var font = self.data.font || DEFAULT_FONT;


        loadFont(FONTS[font]).then(
            (result) => {
                self.lineHeight = result.common.lineHeight;
                self.widthFactor = computeFontWidthFactor(result);

                self.textRenderWidth = computeWidth(self.data.wrappixels, self.data.wrapcount,
                    self.widthFactor);
                self.textScale = self.data.width / self.textRenderWidth;
                self.textHeight = self.lineHeight * self.textScale * self.data.fontsize;
                var headerWrapCount = self.data.wrapcount/self.headerScale;
                if (self.data.wrapfit) {
                    headerWrapCount =  (self.data.width / (self.headerFontSize)) * (20/0.3); 
                }
                self.headerHeight = self.lineHeight * self.data.width / computeWidth(self.data.wrappixels, headerWrapCount,
                    self.widthFactor);
                this._createCell();
            },
        );
        
    },

    remove: function() {
        var root = this.el.querySelector('.ls-cell-root');
        if (root) this.el.removeChild(root);
        if (this.el.object3DMap.hasOwnProperty('background')) this.el.removeObject3D('background');
        if (this.el.object3DMap.hasOwnProperty('border')) this.el.removeObject3D('border');

    },

    updateCell: function() {
        this._createCell();
    },

    _createCell: function() {
        var self = this;
        var data = self.data;

        var root = this.el.querySelector('.ls-cell-root');
        if (root) {
            this.el.removeChild(root);
            if (this.el.object3DMap.hasOwnProperty('background')) this.el.removeObject3D('background');
            if (this.el.object3DMap.hasOwnProperty('border')) this.el.removeObject3D('border');
        }

        if (self.data.background) {
            this._createBackground();
        }


        switch (data.facet) {
            case 'content':
                var contentEls = this._createContentCell();
                var flexEl = contentEls[0];
                flexEl.classList.add('ls-cell-root');
                var headerFlexEl = contentEls[1];
                self.el.appendChild(flexEl);
                headerFlexEl.setAttribute('needsupdate', true);
                flexEl.setAttribute('needsupdate', true);
                break;
            case 'events':
                var flexEl = document.createElement('a-entity');
                flexEl.classList.add('ls-cell-root');
                flexEl.setAttribute('flex-container', { width: data.width, height: data.height,
                    flexDirection: 'row',
                    justifyContent: 'flexStart',
                    alignItems: 'flexStart' });

                var eventEls = this._createEventsCell({width: data.width/4});
                var eventsFlexEl = eventEls[0];
                var typeFlexEl = eventEls[1];
                var providerFlexEl = eventEls[2];
                if (!!data.datetime) {
                    var calFlexEl = eventEls[3];
                    var timeFlexEl  = eventEls[4];
                }

                var contentEls = this._createContentCell({width: data.width*3/4, height: data.height});
                var contentFlexEl = contentEls[0];
                var headerFlexEl = contentEls[1];

                flexEl.appendChild(eventsFlexEl);
                flexEl.appendChild(contentFlexEl);

                self.el.appendChild(flexEl);
                typeFlexEl.setAttribute('needsupdate', true);
                providerFlexEl.setAttribute('needsupdate', true);
                if (!!data.datetime) {
                    calFlexEl.setAttribute('needsupdate', true);
                    timeFlexEl.setAttribute('needsupdate', true);
                }
                headerFlexEl.setAttribute('needsupdate', true);
                contentFlexEl.setAttribute('needsupdate', true);
                eventsFlexEl.setAttribute('needsupdate', true);
                flexEl.setAttribute('needsupdate', true);
                break;
            case 'contacts':
                var flexEl = this._createContactsCell();
                flexEl.classList.add('ls-cell-root');
                self.el.appendChild(flexEl);
                flexEl.setAttribute('needsupdate', true);
                break;
            case 'people':
                var flexEl = this._createPeopleCell();
                flexEl.classList.add('ls-cell-root');
                self.el.appendChild(flexEl);
                flexEl.setAttribute('needsupdate', true);
                break;
            default:
                break;
        }
    },

    _createContentCell: function(opts={}) {
        var self = this;
        var data = self.data;
        var width = opts.width || data.width;
        var height = opts.height || data.height;
        /* Header
            TypeIcon Type Provider ProviderIcon
        */
        var flexEl = document.createElement('a-entity');
        flexEl.setAttribute('flex-container', { width: width, height: height, flexDirection: 'column',
            justifyContent: 'flexStart', alignItems: 'flexStart' });
        flexEl.setAttribute('flex-item', { dimtype: 'flex-container' });


        var headerFlexEl = document.createElement('a-entity');
        headerFlexEl.setAttribute('flex-container', { width: width, height: self.headerHeight, flexDirection: 'row',
            justifyContent: 'space-evenly', alignItems: 'center' });
        headerFlexEl.setAttribute('flex-item', { dimtype: 'flex-container' });

        var typeFAEl = document.createElement('a-entity');
        typeFAEl.setAttribute('width', self.headerHeight);
        typeFAEl.setAttribute('height', self.headerHeight);
        typeFAEl.setAttribute('font-awesome__type', { id: 'type',
        charcode: getContentTypeIconUnicode(data.contenttype),//'f121',
            fontSize: self.headerFontSize,
            size: 256, color: self.data.color,
            mesh: true,
            version: '"Font Awesome 5 Pro"' });
        typeFAEl.setAttribute('flex-item', { dimtype: 'el' });
        
        var typeEl = document.createElement('a-entity');
        typeEl.setAttribute('text-cell', { id: 'type', text: data.contenttype, width: width/2 - self.headerHeight,
            height: self.headerHeight,
            fontsize: self.headerFontSize,
            wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
            nobr: data.nobr } );
        typeEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});

        var providerEl = document.createElement('a-entity');
        providerEl.setAttribute('text-cell', { id: 'provider', text: data.provider,
            width: width/2 - self.headerHeight,
            height: self.headerHeight,
            fontsize: self.headerFontSize,
            wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
            nobr: data.nobr,
            anchor: 'left' } );
        providerEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});

        var providerFAEl = document.createElement('a-entity');
        providerFAEl.setAttribute('width', self.headerHeight);
        providerFAEl.setAttribute('height', self.headerHeight);
        providerFAEl.setAttribute('font-awesome__provider', { id: 'provider',
        charcode: getProviderTypeIconUnicode(data.provider),//'f09b',
            fontSize: self.headerFontSize,
            size: 256, color: self.data.color,
            mesh: true,
            version: '"Font Awesome 5 Brands"' });
        providerFAEl.setAttribute('flex-item', { dimtype: 'el' });


        headerFlexEl.appendChild(typeFAEl);
        headerFlexEl.appendChild(typeEl);
        headerFlexEl.appendChild(providerEl);
        headerFlexEl.appendChild(providerFAEl);
        flexEl.appendChild(headerFlexEl);


        /*
            embed content
        */
        if (data.mediatype == 'video' || data.mediatype == 'image') {
            var mediaEl = document.createElement('a-entity');
            var mediaHeight = self._contentHeight();
            mediaEl.setAttribute('media-cell', { id: 'content',
                width: width,
                height: mediaHeight,
                url: data.mediaurl,
                type: data.mediatype,
                srcFit: 'bothmax',
                animateLoad: false,
                selected: true,
            } );
            mediaEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'media-cell'});
            flexEl.appendChild(mediaEl);
        }

        /* text
            title
            price
            text
            url
        */
        if (!!data.title) {
            var titleEl = document.createElement('a-entity');
            titleEl.setAttribute('text-cell', { id: 'title', text: data.title, width: width,
                height: self.headerHeight,
                fontsize: self.headerFontSize,
                wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
                color: '#2ac1de',
                nobr: data.nobr } );
            titleEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});
            flexEl.appendChild(titleEl);
        }

        if (!!data.price && data.price > 0) {
            var priceEl = document.createElement('a-entity');
            priceEl.setAttribute('text-cell', { id: 'price', text: '$' + data.price, width: width,
                height: self.textHeight,
                fontsize: self.fontSize,
                wrapcount: data.wrapcount, wrapfit: data.wrapfit,
                nobr: data.nobr } );
            priceEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});
            flexEl.appendChild(priceEl);
        }
        
        if (!!data.text && data.mediatype != 'video' && data.mediatype != 'image') {
            var textEl = document.createElement('a-entity');
            var contentHeight = self._contentHeight();
            textEl.setAttribute('text-cell', { id: 'content', text: data.text, width: width,
                height: contentHeight,
                fontsize: self.headerFontSize,
                wrapcount: data.wrapcount, wrapfit: data.wrapfit,
                nobr: data.nobr } );
            textEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});
            flexEl.appendChild(textEl);
        }

        if ( data.url && !data.title && !data.text ) {
            var urlEl = document.createElement('a-entity');
            urlEl.setAttribute('text-cell', { id: 'url', text: data.url, width: width,
                height: self.textHeight,
                fontsize: self.fontSize,
                wrapcount: data.wrapcount, wrapfit: data.wrapfit,
                nobr: data.nobr } );
            urlEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});
            flexEl.appendChild(urlEl);
        }
        

        /*
            Tags
        */
        var tagsEl = document.createElement('a-entity');
        var tagText = '#TAGS: ' + data.tags.join(', ');
        tagsEl.setAttribute('text-cell', { id: 'tags', text: tagText, width: width,
            height: self.headerHeight,
            fontsize: self.headerFontSize,
            wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
            color: '#2ac1de',
            nobr: data.nobr } );
        tagsEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});

        flexEl.appendChild(tagsEl);
        return [flexEl, headerFlexEl];
    },

    _createContactsCell: function() {
        var self = this;
        var data = self.data;

        var flexEl = document.createElement('a-entity');
        flexEl.setAttribute('flex-container', { width: data.width, height: data.height,
            flexDirection: 'column',
            justifyContent: 'flexStart', alignItems: 'flexStart' });
        flexEl.setAttribute('flex-item', { dimtype: 'el' });

        if (!!data.avatarurl) {
            var avatarEl = document.createElement('a-entity');
            var avatarHeight = data.height - 2*self.headerHeight;
            avatarEl.setAttribute('media-cell', { id: 'avatar',
                width: data.width,
                height: avatarHeight,
                url: data.avatarurl,
                type: 'image',
                srcFit: 'bothmax',
                animateLoad: false,
                selected: true,
            } );
            avatarEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'media-cell'});
            flexEl.appendChild(avatarEl);
        }
        else {
            var userFAEl = document.createElement('a-entity');
            userFAEl.setAttribute('width', self.headerHeight);
            userFAEl.setAttribute('height', self.headerHeight);
            userFAEl.setAttribute('font-awesome__user', { id: 'type', charcode: 'f007',
                fontSize: 10*self.headerFontSize,
                size: 256, color: self.data.color, mesh: true,
                visibleWhenDrawn: false });
            userFAEl.setAttribute('flex-item', { dimtype: 'el' });
            flexEl.appendChild(userFAEl)
        }

        if (!!data.contactname) {
            var nameEl = document.createElement('a-entity');
            nameEl.setAttribute('text-cell', { id: 'contactname', text: data.contactname, width: self.data.width,
                height: self.headerHeight,
                fontsize: self.headerFontSize,
                wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
                color: '#2ac1de',
                nobr: data.nobr } );
            nameEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});
            flexEl.appendChild(nameEl);
        }

        if (!!data.contacthandle) {
            var handleEl = document.createElement('a-entity');
            handleEl.setAttribute('text-cell', { id: 'contacthandle', text: data.contacthandle, width: self.data.width,
                height: self.headerHeight,
                fontsize: self.headerFontSize,
                wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
                color: '#2ac1de',
                nobr: data.nobr } );
                handleEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});
            flexEl.appendChild(handleEl);
        }

        return flexEl;
    },

    _createPeopleCell: function() {
        var self = this;
        var data = self.data;

        var flexEl = document.createElement('a-entity');
        flexEl.setAttribute('flex-container', { width: data.width, height: data.height,
            flexDirection: 'column',
            justifyContent: 'flexStart', alignItems: 'flexStart' });
        flexEl.setAttribute('flex-item', { dimtype: 'el' });

        if (!!data.avatarurl) {
            var avatarEl = document.createElement('a-entity');
            var avatarHeight = data.height - 2*self.headerHeight;
            avatarEl.setAttribute('media-cell', { id: 'avatar',
                width: data.width,
                height: avatarHeight,
                url: data.avatarurl,
                type: 'image',
                srcFit: 'bothmax',
                animateLoad: false,
                selected: true,
            } );
            avatarEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'media-cell'});
            flexEl.appendChild(avatarEl);
        }
        else {
            var userFAEl = document.createElement('a-entity');
            userFAEl.setAttribute('width', self.headerHeight);
            userFAEl.setAttribute('height', self.headerHeight);
            userFAEl.setAttribute('font-awesome__user', { id: 'type', charcode: 'f007',
                fontSize: 10*self.headerFontSize,
                size: 256, color: self.data.color, mesh: true,
                visibleWhenDrawn: false });
            userFAEl.setAttribute('flex-item', { dimtype: 'el' });
            flexEl.appendChild(userFAEl)
        }

        if (data.first_name || data.middle_name || data.last_name) {
            var nameEl = document.createElement('a-entity');
            var name = self.concatNames(data.first_name, data.middle_name, data.last_name);
            nameEl.setAttribute('text-cell', { id: 'contactname', text: name, width: self.data.width,
                height: self.headerHeight,
                fontsize: self.headerFontSize,
                wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
                color: '#2ac1de',
                nobr: data.nobr } );
            nameEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});
            flexEl.appendChild(nameEl);
        }

        return flexEl;
    },


    _createEventsCell: function(opts={}) {
        var self = this;
        var data = self.data;
        var width = opts.width || data.width;
        var height = opts.height || data.height;

        /* Detials
            EventTypeIcon Type
            ProviderIcon  Provider
            calIcon date
            clockIcon time
        */
        var flexEl = document.createElement('a-entity');
        flexEl.setAttribute('flex-container', { width: width, height: height, flexDirection: 'column',
            justifyContent: 'flexStart', alignItems: 'flexStart' });
        flexEl.setAttribute('flex-item', { dimtype: 'flex-container' });

        // type
        var typeFlexEl = self._createEventsDetailsRow(opts, 'type',
            getEventTypeIconUnicode(data.eventtype),
            data.eventtype);
        flexEl.appendChild(typeFlexEl);

        // provider
        var providerFlexEl = self._createEventsDetailsRow(opts, 'provider',
            getProviderTypeIconUnicode(data.provider),
            data.provider,
            '"Font Awesome 5 Brands"');
        flexEl.appendChild(providerFlexEl);

        if (!!data.datetime) {
            // date
            var calFlexEl = self._createEventsDetailsRow(opts, 'date', 'f073', this.dateShort(data.datetime));
            flexEl.appendChild(calFlexEl);
            // time
            var timeFlexEl = self._createEventsDetailsRow(opts, 'time', 'f017', this.dateTime(data.datetime));
            flexEl.appendChild(timeFlexEl);
        }

        var els = [flexEl, typeFlexEl, providerFlexEl];
        if (!!data.datetime) {
            els.push(calFlexEl)
            els.push(timeFlexEl)
        }
        return els;
    },

    _createEventsDetailsRow(opts, id, charcode, text, version='') {
        var self = this;
        var data = self.data;
        var width = opts.width || data.width;
        var height = opts.height || data.height;

        var flexRowProps = { width: width, height: self.headerHeight, flexDirection: 'row',
            justifyContent: 'flexStart', alignItems: 'center' };
        var textProps = { width: width - self.headerHeight,
            height: self.headerHeight,
            fontsize: self.headerFontSize,
            wrapcount: data.wrapcount/2, wrapfit: data.wrapfit,
            nobr: data.nobr };
        var FAprops = {fontSize: self.headerFontSize,
            size: 256, color: self.data.color, mesh: true,
            visibleWhenDrawn: false };
        if (!!version) {
            FAprops.version = version;
        }
        else {
            FAprops.version ='"Font Awesome 5 Pro"';
        }

        var flexEl = document.createElement('a-entity');
        flexEl.setAttribute('flex-container', flexRowProps);
        flexEl.setAttribute('flex-item', { dimtype: 'flex-container' });

        var typeFAEl = document.createElement('a-entity');
        typeFAEl.setAttribute('width', self.headerHeight);
        typeFAEl.setAttribute('height', self.headerHeight);
        typeFAEl.setAttribute('font-awesome__' + id,  { id: id, charcode: charcode, ...FAprops });
        typeFAEl.setAttribute('flex-item', { dimtype: 'el' });
       
        var typeEl = document.createElement('a-entity');
        typeEl.setAttribute('text-cell', { id: 'type', text: text, ...textProps } );
        typeEl.setAttribute('flex-item', { dimtype: 'attr', dimattr: 'text-cell'});

        flexEl.appendChild(typeFAEl);
        flexEl.appendChild(typeEl);
        return flexEl;
    },

    _createBackground() {
        var self = this;
        var bgGeom = new THREE.PlaneBufferGeometry(self.data.width, self.data.height);
        var bgMat = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: self.data.bgOpacity,
            side: THREE.DoubleSide,
            color: new THREE.Color(self.data.bgColor),
        })
        var bgMesh = new THREE.Mesh(bgGeom, bgMat);
        bgMesh.name = 'mBackground';

        self.el.setObject3D('background', bgMesh);
        if (self.data.border) {
            self._createBorder();
        }

        if (self.data.animateLoad) {
            AFRAME.ANIME({
                targets: self.el.object3D.scale,
                easing: 'linear',
                x: [0, 1],
                y: [0, 1],
                z: [0, 1],
                duration: 1000*self.data.animateInSeconds,
            });
        }
    },

    _createBorder() {
        var self = this;
        var geom = new THREE.PlaneBufferGeometry(self.data.width + self.data.bordersize,
            self.data.height + self.data.bordersize);
        geom.translate(0, 0, -0.001);
        var mat = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: self.data.bgOpacity,
            side: THREE.DoubleSide,
            color: new THREE.Color(self.data.borderColor),
        })
        var mesh = new THREE.Mesh(geom, mat);
        mesh.name = 'mBorder';

        self.el.setObject3D('border', mesh);
    },

    _contentHeight() {
        var data = this.data;
        // height - (header and tags)
        var result = this.data.height - (2 * this.headerHeight);
        if (!!data.title) { result -= this.headerHeight; }
        if (!!data.price && data.price > 0) { result -= this.textHeight; }
        if ( data.url && !data.title && !data.text ) { result -= this.textHeight; }

        return result > 0 ? result : 0;
    },

    dateShort: function(date) {
        return moment.utc(date).local().format('YYYY/MM/DD');
    },

    dateTiny: function(date) {
        return moment.utc(date).local().format('M/D/YY');
    },

    dateTime: function(date) {
        return moment.utc(date).local().format('hh:mm A');
    },

    concatNames: function(first_name='', middle_name='', last_name='') {
        let returned = '';

        if (first_name || middle_name || last_name) {
            if (first_name) {
                returned += first_name + ' ';
            }

            if (middle_name) {
                returned += middle_name + ' ';
            }

            if (last_name) {
                returned += last_name + ' ';
            }
        }

        return returned;
    },

});

AFRAME.registerPrimitive('a-ls-cell', {
	defaultComponents: {
		'ls-cell': {},
	},
	mappings: {
        'value': 'ls-cell.text',
        'mediaurl': 'ls-cell.mediaurl',
        'mediatype': 'ls-cell.mediatype',
        'width': 'ls-cell.width',
        'height': 'ls-cell.height',
        'fontsize': 'ls-cell.fontsize',
        'wrapcount': 'ls-cell.wrapcount',
        'background': 'ls-cell.background',
        'nobr': 'ls-cell.nobr',
        'color': 'ls-cell.color',
        'contenttype': 'ls-cell.contenttype',
        'provider': 'ls-cell.provider',
        'connectionname': 'ls-cell.connectionname',
        'title': 'ls-cell.title',
        'font': 'ls-cell.font',
        'wrapfit': 'ls-cell.wrapfit',

        'facet': 'ls-cell.facet',
        'embedthumbnail': 'ls-cell.embedthumbnail',
        'price': 'ls-cell.price',
        'tags': 'ls-cell.tags',
        'url': 'ls-cell.url',

        'avatarurl': 'ls-cell.avatarurl',
        'contactname': 'ls-cell.contactname',
        'contacthandle': 'ls-cell.contacthandle',

        'firstname': 'ls-cell.first_name',
        'middlename': 'ls-cell.middle_name',
        'lastname': 'ls-cell.last_name',

        'eventtype': 'ls-cell.eventtype',
        'datetime':'ls-cell.datetime',

        'animate-load': 'ls-cell.animateLoad',
        'animatein': 'ls-cell.animateInSeconds',
        'animateout': 'ls-cell.animateOutSeconds',
	}
});
