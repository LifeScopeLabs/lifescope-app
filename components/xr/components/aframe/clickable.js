function _clickHandler(evt) {
    if (this.intersectingRaycaster) {
        const intersection = this.intersectingRaycaster.getIntersection(this.el);
        if (intersection){
            var clickEvent = new Event( this.data.clickevent, {bubbles: true});
            this.el.dispatchEvent(clickEvent);
        }
    }
}

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
            // console.log('intersecting:')
            // console.log(intersection.object.name);
        }
    }
    else {
        // console.log('self.intersectingRaycaster is null')
    }
}


AFRAME.registerComponent('clickable', {

    schema: {
        id: { type: 'string', default: '' },
        enabled: { type: 'boolean', default: true },
        clickevent: { type: 'string', default: 'cellclicked' },
        enableevent: { type: 'string', default: 'enable-clickable' },
        disableevent: { type: 'string', default: 'disable-clickable' }
    },

    init() {
        this.clickHandler = _clickHandler.bind(this);
        this.raycasterIntersectedHandler = _raycasterIntersectedHandler.bind(this);
        this.raycasterIntersectedClearedHandler = _raycasterIntersectedClearedHandler.bind(this);

        this.firstUpdate = true;
    },

    tick: function() {
        if (!this.intersectingRaycaster) {
            return;
        }
    
        const intersection = this.intersectingRaycaster.getIntersection(this.el);
        this.intersection = intersection;
    },

    update(oldData) {
        var self = this;
        var data = self.data;
        var changedData = Object.keys(self.data).filter(x => self.data[x] != oldData[x]);

        if (this.firstUpdate) {
            this.firstUpdate = false;
            return;
        }
        if (changedData.includes('enabled')) {
            if (data.enabled) {
                this.addHandlers();
            }
            else {
                this.removeHandlers();
            }
        }
    },

    remove() {
        this.removeHandlers();
    },

    play() {
        if (this.data.enabled) {
            this.addHandlers();
        }
    },

    pause() {
        if (this.data.enabled) {
            this.removeHandlers();
        }
    },

    addHandlers: function() {
        this.el.addEventListener("click", this.clickHandler );
        this.el.addEventListener("raycaster-intersected", this.raycasterIntersectedHandler );
        this.el.addEventListener("raycaster-intersected-cleared", this.raycasterIntersectedClearedHandler );
    },

    removeHandlers: function() {
        this.el.removeEventListener("click", this.clickHandler );
        this.el.removeEventListener("raycaster-intersected", this.raycasterIntersectedHandler );
        this.el.removeEventListener("raycaster-intersected-cleared", this.raycasterIntersectedClearedHandler );
    },


});