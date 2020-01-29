<template>
    <a-entity class="xr-grid" :position="'0 0 ' + offsetz">
        <!-- lights -->
        <a-entity light="type: ambient; color: #FFF; intensity: 0.8"></a-entity>
        <a-entity id="dirLight" light="type: directional; color: #FFF; intensity: 0.8;" position="-1 -1 0"></a-entity>
        <a-light type='point' color='#FFF' intensity='0.8' position="10 10 0" ></a-light>
        <a-light type='hemisphere' color='#FFF' groundColor='#00F' intensity='0.8' ></a-light>
    
        <a-searching v-if="searching"
                    radius=0.5
                    :position="focusedCellPosititon.x + ' ' +focusedCellPosititon.y + ' ' + (focusedCellPosititon.z - offsetz)"/>
        <a-entity 
            class="grid-cylinder"
            :rotation="'0 ' + gridRotation + ' 0'"
            :position="'0 ' + gridOffsetY + ' 0'">

            <a-entity v-for="(item, n) in items"
                :key="'grid-cell-' + n"
                :position="gridCellPosition(n)"
                :rotation="gridCellRotation(n)">
                
                <a-ls-cell v-if="$store.state.facet == 'events'"
                    class="clickable gridcell"
                    clickable="clickevent: cellclicked;"
                    :highlight="'type: border; hoverColor: ' + hoverColor +
                        '; activeColor: ' + activeColor + ';' +
                        'borderbaseopacity: 0.7;'"
                    :id="'grid-cell-' + n"
                    :mediatype="item.content.type"
                    :mediaurl="item.content.embed_content"
                    :width="cellWidth"
                    :height="cellContentHeight"
                    srcFit="bothmax"
                    :animatein="animateInSeconds"

                    :provider="item.connection.provider.name"
                    :contenttype="item.content.type"
                    :value="item.content.text"
                    :title="item.content.title"
                    :price="item.content.price"
                    :url="item.content.url"
                    :tags="item.content.tags"

                    :facet="$store.state.facet"

                    :eventtype="item.eventtype"
                    :datetime="item.datetime"

                    fontsize=1
                    wrapcount=44
                    color='#a2a2a2'
                    nobr=false
                    background=true
                    wrapfit=true
                    fade
                />

                <a-ls-cell v-else-if="$store.state.facet == 'content'"
                    :id="'grid-cell-' + n"
                    :key="'grid-cell-' + n"
                    class="clickable gridcell"

                    :width="cellWidth"
                    :height="cellContentHeight"
                    fontsize=1
                    wrapcount=44
                    color='#a2a2a2'
                    nobr=false
                    background=true
                    wrapfit=true
                    srcFit="bothmax"
                    :animatein="animateInSeconds"
                    fade
                    clickable="clickevent: cellclicked;"
                    :highlight="'type: border; hoverColor: ' + hoverColor +
                        '; activeColor: ' + activeColor + ';' +
                        'borderbaseopacity: 0.7;'"

                    :facet="$store.state.facet"
                    :contenttype="item.type"
                    :provider="item.connection.provider.name"

                    :mediatype="item.type"
                    :mediaurl="item.embed_content"
                    
                    :value="item.text"
                    :title="item.title"
                    :price="item.price"
                    :url="item.url"
                    :tags="item.tags"
                    />

                <a-ls-cell v-else-if="$store.state.facet == 'contacts'"
                        class="clickable gridcell"
                        clickable="clickevent: cellclicked;"
                        :highlight="'type: border; hoverColor: ' + hoverColor +
                            '; activeColor: ' + activeColor + ';' +
                            'borderbaseopacity: 0.7;'"
                        :id="'grid-cell-' + n"
                        :mediatype="item.type"
                        :mediaurl="item.embed_content"
                        :width="cellWidth"
                        :height="cellContentHeight"
                        srcFit="bothmax"
                        :animatein="animateInSeconds"

                        :facet="$store.state.facet"

                        :avatarurl="item.avatar_url"
                        :contactname="item.name"
                        :contacthandle="item.handle"

                        :tags="item.tags"

                        fontsize=1
                        wrapcount=44
                        color='#a2a2a2'
                        nobr=false
                        background=true
                        wrapfit=true
                        fade
                    />

                <a-ls-cell v-else-if="$store.state.facet == 'people'"
                        class="clickable gridcell"
                        clickable="clickevent: cellclicked;"
                        :highlight="'type: border; hoverColor: ' + hoverColor +
                            '; activeColor: ' + activeColor + ';' +
                            'borderbaseopacity: 0.7;'"
                        :id="'grid-cell-' + n"
                        :mediatype="item.type"
                        :mediaurl="item.embed_content"
                        :width="cellWidth"
                        :height="cellContentHeight"
                        srcFit="bothmax"
                        :animatein="animateInSeconds"

                        :avatarurl="item.avatar_url"
                        :firstname="item.first_name"
                        :lastname="item.last_name"
                        :middlename="item.middle_name"
                        :tags="item.tags"

                        :facet="$store.state.facet"

                        fontsize=1
                        wrapcount=44
                        color='#a2a2a2'
                        nobr=false
                        background=true
                        wrapfit=true
                        fade
                    />
            </a-entity>

            <!-- <a-entity class="floor-map-selector"
                :position="gridCellPosition(-4)"
                fade>
                <a-entity
                    id="floor-map-selector"
                    class="clickable"
                    clickable="clickevent: objectclicked;"
                    geometry="primitive: sphere; radius: 0.05;"
                    material="shader: standard; src: #earth"
                    highlight="type: border; createborder: true;">
                </a-entity>
            </a-entity> -->

        </a-entity>

        <a-arrow
            class="grid-arrow-left clickable"
            direction="left"
            clickable="clickevent: pageleft;"
            :position="leftArrowPosition"
            :width="arrowWidth" :height="arrowHeight"
            :disabled="!canPageLeft"
            :hoverColor="hoverColor"
            :activeColor="activeColor"
            />

        <a-arrow class="grid-arrow-right clickable"
            direction="right"
            clickable="clickevent: pageright;"
            :position="rightArrowPosition"
            :width="arrowWidth" :height="arrowHeight"
            :disabled="!canPageRight"
            :hoverColor="hoverColor"
            :activeColor="activeColor"
            />

        <a-entity v-if="focusedCell != ''"
            class="focused-cell-controls"
            :position="focusedCellPosititon.x + ' ' +focusedCellPosititon.y + ' ' + (focusedCellPosititon.z - offsetz)">
            <a-arrow
                :disabled="focusedCellIndex==0 && !canPageLeft"
                class="cell-arrow-left clickable"
                :clickable="'clickevent: previouscell; enabled: ' + (focusedCellIndex!=0 || canPageLeft)"
                direction="left"
                :position="-((cellWidth * focusedCellScale.x)/2 + focusArrowMargin)+ ' 0 0'"
                :width="focusArrowWidth"
                :height="focusArrowHeight"
                :hoverColor="hoverColor"
                :activeColor="activeColor"
            />
            <a-arrow 
                :disabled="focusedCellIndex==(numberOfItemsToDisplay - 1) && !canPageRight"
                class="cell-arrow-right clickable"
                direction="right"
                :clickable="'clickevent: nextcell; enabled: ' + (focusedCellIndex!=(numberOfItemsToDisplay - 1) || canPageRight)"
                :position="((cellWidth * focusedCellScale.x)/2 + focusArrowMargin)+ ' 0 0'"
                :width="focusArrowWidth"
                :height="focusArrowHeight"
                :hovercolor="hoverColor"
                :activecolor="activeColor"
                />
            <a-mapbox-terrain v-if="focusedHasLocation"
                position="0 -0.75 0"
                rotation="45 0 0"
                class="focused-cell-map"
                :scale="floorScale + ' 1 ' + floorScale"
                :latitude="focusedLatitude" :longitude="focusedLongitude"
                :zoom-level="floorZoom" :rows="floorRows"
                :highdpi="floorHighDPI"
                :heightmap="floorMapHeightmap"
                :heightmapheight="floorMapHeight"
                :type="mapboxType"></a-mapbox-terrain>
        </a-entity>

    <!-- Demo Map -->
    <!-- Floor -->
    <a-mapbox-terrain v-if="floorMapActive == true"
        :position="'0 -1.6 ' + -offsetz"
        :scale="floorScale + ' 1 ' + floorScale"
        :latitude="mapLatitude" :longitude="mapLongitude"
        :zoom-level="floorZoom" :rows="floorRows"
        :highdpi="floorHighDPI"
        :heightmap="floorMapHeightmap"
        :heightmapheight="floorMapHeight"
        :type="mapboxType"></a-mapbox-terrain>
    <!-- World -->
    <a-mapbox-terrain v-if="worldMapActive == true"
        position="0 -4 0" :scale="worldScale + ' 1 ' + worldScale"
        :latitude="mapLatitude" :longitude="mapLongitude"
        :zoom-level="worldZoom" :rows="worldRows"
        :highdpi="worldHighDPI"
        :heightmap="worldMapHeightmap"
        :heightmapheight="worldMapHeight"></a-mapbox-terrain>


    <a-entity
        :position="'0 -0.5 0'"
        animation="property: rotation; easing: linear; to: 0 360; dur: 15000; loop: true;">
        <globe>
        </globe>
    </a-entity>

    <saved-searches
        :position="'1 0.5 ' + (-offsetz)"
        rotation="0 -90 0"
    />

    <!-- Carousel Selector -->


        <!-- Logo  -->
        <a-entity 
                id="Logo" :position="'0 1.1 0'"
                rotation="0 0 0"
                animation="property: rotation; easing: linear; to: 0 -360; dur: 42000; loop: true;">
            <a-gltf-model 
                src="#logo"
                scale="0.075 0.075 0.075">
            </a-gltf-model>
        </a-entity>
  </a-entity>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

import { Cylinder, CylindricalGrid } from '../../util/GridUtils';

import { SceneLayoutEnum } from '../../../../store/modules/xr';
import { SkyboxEnum } from '../../../../store/modules/xr/modules/graphics';

import searchMany from '../../../../apollo/queries/search-many.gql';

import SavedSearches from './SavedSearches.vue';

import Globe from '../globe/globe.vue';

import TimeUtils from '../../util/TimeUtils.js';

export default {

    components: {
        SavedSearches,
        Globe,
    },

    data () {
        return {
            focusedCell: '',
            dur: 0.5, //seconds
            cylinder: null,
            cylindricalGrid: null,
            SkyboxEnum: SkyboxEnum,
            paginatorOffsetZ: 1.4,
            searchJustChanged: false,
        }
    },

    props: ['offsetz'],

    computed: {
        gridRotation() {
            return (180-(360/this.gridCellsPerRow)*2);
        },

        gridOffsetY() {
            return (1-this.rows/2)*this.cellHeight;
        },

        items: function() {
            var items;
            if (this.$store.state.facet === 'contacts') {
                items = this.LS_CONTACTS.slice(this.page * this.itemsPerPage,
                    (this.page+1) * this.itemsPerPage);
            }
            else if (this.$store.state.facet === 'content') {
                items = this.LS_CONTENT.slice(this.page * this.itemsPerPage,
                    (this.page+1) * this.itemsPerPage);
            }
            else if (this.$store.state.facet === 'events') {
                items = this.LS_EVENTS.slice(this.page * this.itemsPerPage,
                    (this.page+1) * this.itemsPerPage);
            }
            else if (this.$store.state.facet === 'people') {
                items = this.LS_PEOPLE.slice(this.page * this.itemsPerPage,
                    (this.page+1) * this.itemsPerPage);
            }
            return items;
        },
        numberOfItemsToDisplay() {
            return Math.min(this.itemsPerPage, this.items.length);
        },

        focusedCellIndex() {
            if (this.focusedCell == '') {
                return -1;
            }
            return +(this.focusedCell.match(/\d+$/)[0]);
        },

        focusedHasLocation() {
            var item = this.items[this.focusedCellIndex];
            var result = (typeof item.hydratedLocation != 'undefined' || 
                typeof item.location != 'undefined' & item.location != null);
            return result;
        },

        focusedLatitude() {
            var item = this.items[this.focusedCellIndex];
            if (item.location != null && item.location.geolocation != null) {
                return item.location.geolocation[1];
            }
            return 0;
        },

        focusedLongitude() {
            var item = this.items[this.focusedCellIndex];
            if (item.location != null && item.location.geolocation != null) {
                return item.location.geolocation[0];
            }
            return 0;
        },

        ...mapState(
            [
                'facet',
                'searching'
            ]
        ),
        ...mapState('xr',
            [
                'inVR',
                'LSObjs',
                'roomConfig',
                'sceneLayout',
            ]
        ),

        ...mapState('xr/graphics',
            [
                'bump',
                'normal',
                'quality',
                'shading',
            ]
        ),

        ...mapGetters('xr/graphics',
            [
                'skybox',
            ]
        ),

         ...mapState('xr/style',
            [
                'hoverColor',
                'activeColor',
            ]
        ),
        
        ...mapState('xr/map',
            [
                // 'globeActive',
                'floorMapActive',
                'worldMapActive',
                'mapLatitude',
                'mapLongitude',
                'mapboxType',

                'floorRows',
                'floorZoom',
                'floorHighDPI',
                'floorScale',
                'floorMapHeightmap',
                'floorMapHeight',

                'worldRows',
                'worldZoom',
                'worldHighDPI',
                'worldScale',
                'worldMapHeightmap',
                'worldMapHeight',

            ]
        ),

        ...mapState('xr/grid',
            [
                'page',
                'columns',
                'rows',
                'radius',
                'top',
                'bottom',
                'cellWidth',
                'cellHeight',
                'cellContentHeight',
                'gridCellsPerRow',
                'focusedCellPosititon',
                'focusedCellScale',
                'arrowWidth',
                'arrowHeight',
                'focusArrowHeight',
                'focusArrowWidth',
                'focusArrowMargin',
                'animateInSeconds',
                'animateOutSeconds',
            ]
        ),

        ...mapGetters('xr',
            [
                'LS_CONTENT',
                'LS_EVENTS',
                'LS_CONTACTS',
                'LS_PEOPLE'
            ]
        ),

        ...mapGetters('xr/grid',
            [
                'itemsPerPage',
                'canPageLeft',
                'canPageRight',
            ]
        ),

        leftArrowPosition() {
            return `${-this.cellWidth} ${this.gridOffsetY-this.cellHeight} ${-this.offsetz - this.paginatorOffsetZ}`;
        },

        rightArrowPosition() {
            return `${this.cellWidth} ${this.gridOffsetY-this.cellHeight} ${-this.offsetz - this.paginatorOffsetZ}`;
        },

    },

    watch: {
        facet: function (newVal, oldVal) {
            this.facetJustChanged = true;
            this.$store.commit('xr/grid/RESET_PAGE');
        },

        searching: function (newVal, oldVal) {
            this.searchJustChanged = true;
            this.$store.commit('xr/grid/RESET_PAGE');
        },

        gridCellsPerRow: function (newVal, oldVal) {
            this.cylinder.cellsPerRow = newVal;
            this.cylindricalGrid.cellsPerRow = newVal;
        },
        cellHeight: function (newVal, oldVal) {
            this.cylinder.cellHeight = newVal;
            this.cylindricalGrid.cellHeight = newVal;
        },
        radius: function (newVal, oldVal) {
            this.cylinder.radius = newVal;
            this.cylindricalGrid.radius = newVal;
        },
        items: function (newVal, oldVal) {
            var self = this;
            var scene = AFRAME.scenes[0];
            var self = this;
            var behavior = {
                el: scene,
                get tick() {
                    return function() {
                        for (var n=0; n < self.numberOfItemsToDisplay; n++) {
                            var cell = document.querySelector(`#grid-cell-${n}`);
                            cell.components['ls-cell'].updateCell();
                        }
                        scene.removeBehavior(this);
                    }
                }
            }
            if( !this.searching ) {
                if ( !this.searchJustChanged ){
                    scene.addBehavior(behavior);
                }
                else if ( this.searchJustChanged ) {
                    this.searchJustChanged = false;
                }
            }
        },

        LS_CONTENT: function (newVal, oldVal) {
            this.$store.commit('xr/grid/RESET_PAGE');
        },
        LS_EVENTS: function (newVal, oldVal) {
            this.$store.commit('xr/grid/RESET_PAGE');
        },
        LS_CONTACTS: function (newVal, oldVal) {
            this.$store.commit('xr/grid/RESET_PAGE');
        },
        LS_PEOPLE: function (newVal, oldVal) {
            this.$store.commit('xr/grid/RESET_PAGE');
        },
    
    },
    
    created() {
        this.cylinder = new Cylinder(this.gridCellsPerRow, this.cellHeight, this.radius);
        this.cylindricalGrid = new CylindricalGrid(this.gridCellsPerRow, this.cellHeight,
            this.radius, this.rows, this.columns);
    },

    mounted() {
        var self = this;
        this.$el.addEventListener('cellclicked', self.cellClickedHandler);
        // this.$el.addEventListener('objectclicked', self.objectClickedHandler);
        this.$el.addEventListener('media-mesh-set', self.mediaMeshLoadedHandler);
        this.$el.addEventListener('pageleft', self.handlePageLeft);
        this.$el.addEventListener('pageright', self.handlePageRight);
        this.$el.addEventListener('previouscell', self.previousCell);
        this.$el.addEventListener('nextcell', self.nextCell);
    },

    beforeDestroy() {
        var self = this;
        this.$el.removeEventListener('cellclicked', self.cellClickedHandler);
        // this.$el.removeEventListener('objectclicked', self.objectClickedHandler);
        this.$el.removeEventListener('media-mesh-set', self.mediaMeshLoadedHandler);
        this.$el.removeEventListener('pageleft', self.handlePageLeft);
        this.$el.removeEventListener('pageright', self.handlePageRight);
        this.$el.removeEventListener('previouscell', self.previousCell);
        this.$el.removeEventListener('nextcell', self.nextCell);
        this.$store.commit('xr/grid/RESET_PAGE');
    },

    methods: {

        ...mapActions('xr/grid/',
        [
            'pageRight',
            'pageLeft'
        ]),

        gridCellRotation: function(itemNum) {
            var rot = this.cylindricalGrid.cellRotation(itemNum);
            return `${rot.x} ${rot.y + 180} ${rot.z}`;
        },

        gridCellPosition: function(itemNum) {
            var pos = this.cylindricalGrid.cellPosition(itemNum);
            return `${pos.x} ${pos.y} ${pos.z}`;
        },

        cylinderRotation: function(column, row) {
            var rot = this.cylinder.cellRotation(column, row);
            return `${rot.x} ${rot.y} ${rot.z}`;
        },

        cylinderPosition: function(column, row) {
            var pos = this.cylinder.cellPosition(column, row);
            return `${pos.x} ${pos.y} ${pos.z}`;
        },

        nextCell(evt) {
            var n = this.focusedCellIndex;
            var m = (n + 1) % this.numberOfItemsToDisplay;
            var nextCellId = this.focusedCell.replace(/\d+$/, m);
            var focusedCellEl = document.querySelector('#' + this.focusedCell);
            var nextCellEl =  document.querySelector('#' + nextCellId);
            this.focusedCell = nextCellId;

            this.unFocusCell(focusedCellEl);
            if (n == this.numberOfItemsToDisplay - 1 && this.canPageRight) {
                this.pageRight();
                this.focusedCell = '';
                this.revealNonFocusedCells();
                return;
            }
            focusedCellEl.components['fade'].animateHideCellPromise();
            this.focusCell(nextCellEl);
            nextCellEl.components['fade'].animateRevealCellPromise();
        },

        previousCell(evt) {
            var self = this;
            var n = this.focusedCellIndex;
            var m = n == 0 ? this.itemsPerPage - 1 : n - 1;
            var previousCellId = this.focusedCell.replace(/\d+$/, m);
            var focusedCellEl = document.querySelector('#' + this.focusedCell);
            var previousCellEl = document.querySelector('#' + previousCellId);
            this.focusedCell = previousCellId;

            this.unFocusCell(focusedCellEl);

            if (n == 0 && this.canPageLeft) {
                this.pageLeft();
                this.focusedCell = '';
                self.revealNonFocusedCells();
                return;
            }
            focusedCellEl.components['fade'].animateHideCellPromise();
            if (!!previousCellEl) {
                this.focusCell(previousCellEl);
                previousCellEl.components['fade'].animateRevealCellPromise();
            }
            else {
                var mediaSetCallback =  function(evt) {
                    if (evt.target.id == previousCellId) {
                        self.focusCell(evt.target);
                        self.$el.removeEventListener('media-mesh-set', mediaSetCallback);
                    }
                }
                self.$el.addEventListener('media-mesh-set', mediaSetCallback);
            }
        },

        cellClickedHandler(evt) {
            var self = this;
            var el = evt.target;
            var id = el.id;

            if (id == 'grid-cell-carousel') {
                self.toggleLayout();
                return;
            }

            switch (self.focusedCell) {
                case '':
                    self.focusedCell = id;
                    self.focusCell(el);
                    self.hideNonFocusedCells();
                    break;
                case id:
                    const unFocusingCellIndex = self.focusedCellIndex;
                    self.unFocusCell(el);
                    self.focusedCell = '';
                    self.revealNonFocusedCells(unFocusingCellIndex);
                    break;
                default:
                    var focusedCellEl = document.querySelector('#' + self.focusedCell);
                    self.unFocusCell(focusedCellEl);
                    self.focusCell(el);
                    break;
            }
        },

        // objectClickedHandler(evt) {
        //     var self = this;
        //     var el = evt.target;
        //     var id = el.id;

        //     switch (id) {
        //         case 'floor-map-selector':
        //             this.$store.commit('xr/map/SET_FLOOR_MAP_ACTIVE', !this.floorMapActive);
        //             break;
        //         default:
        //             break;
        //     }
        // },

        mediaMeshLoadedHandler(evt) {
            var self = this;
            if (self.focusedCell != '') {
                if (evt.detail.id != self.focusedCell) {
                    evt.target.components['fade'].animateHideCellPromise();
                }
            }
        },

        focusCell(el) {
            var self = this;
            // if (CONFIG.DEBUG) {console.log('focusCell');}

            var cylinderEl = this.$el.querySelector(".grid-cylinder");
            var fcp = self.focusedCellPosititon;
            var position = new THREE.Vector3( fcp.x, fcp.y, fcp.z );
            position = cylinderEl.object3D.worldToLocal(position);

            AFRAME.ANIME({
                targets: el.parentEl.object3D.position,
                easing: 'linear',
                x: position.x,
                y: position.y,
                z: position.z,
                duration: self.dur*1000,
                begin: function(anim) {
                    self.focusedCell = el.id;
                    self.setSkyFromFocusedCell();
                },
                complete: function(anim) {
                    el.setAttribute('selected', true);
                }
            });
            AFRAME.ANIME({
                targets: el.parentEl.object3D.rotation,
                easing: 'linear',
                x: 0,
                y: THREE.Math.degToRad(360-self.gridRotation),
                z: 0,
                duration: self.dur*1000
            });
            // AFRAME.ANIME({
            //     targets: el.parentEl.object3D.scale,
            //     easing: 'linear',
            //     x: self.focusedCellScale.x,
            //     y: self.focusedCellScale.y,
            //     z: self.focusedCellScale.z,
            //     duration: self.dur*1000
            // });
        },

        unFocusCell(el) {
            var self = this;
            // if (CONFIG.DEBUG) {console.log('unFocusCell');}      
            var posx, posy, posz, rotx, roty, rotz;
            var id = el.id;
            var n = id.match(/\d+$/);
            var position = self.gridCellPosition(+n);
            var positionArray = position.split(' ');
            posx = +positionArray[0];
            posy = +positionArray[1];
            posz = +positionArray[2];
            var rotation = self.gridCellRotation(+n);
            var rotationArray = rotation.split(' ');
            rotx = +rotationArray[0] * (Math.PI/180) ;
            roty = +rotationArray[1] * (Math.PI/180);
            rotz = +rotationArray[2] * (Math.PI/180);
            AFRAME.ANIME({
                targets: el.parentEl.object3D.position,
                easing: 'linear',
                x: posx,
                y: posy,
                z: posz,
                duration: self.dur*1000,
                begin: function(anim) {
                    el.setAttribute('selected', false);
                }
            });
            AFRAME.ANIME({
                targets: el.parentEl.object3D.rotation,
                easing: 'linear',
                x: rotx,
                y: roty,
                z: rotz,
                duration: self.dur*1000
            });
            // AFRAME.ANIME({
            //     targets: el.parentEl.object3D.scale,
            //     easing: 'linear',
            //     x: 1,
            //     y: 1,
            //     z: 1,
            //     duration: self.dur*1000
            // });
        },
        unFocusFoscusedCell() {
            if (this.focusedCell) {
                var focusedCellEl = document.querySelector('#' + this.focusedCell);
                this.focusedCell = '';
                this.unFocusCell(focusedCellEl);
            }
        },

        hideNonFocusedCells() {
            var self = this;
            var animationPromises = [];
            for (var i=0; i<this.numberOfItemsToDisplay; i++) {
                if (i==this.focusedCellIndex) continue;
                var el = document.querySelector(`#grid-cell-${i}`);
                var anim = el.components['fade'].animateHideCellPromise();
                animationPromises.push(anim);
            }
            animationPromises.push()
            var leftArrow = document.querySelector('.grid-arrow-left');
            var rightArrow = document.querySelector('.grid-arrow-right');
            var skyboxSelector = document.querySelector('.skybox-selector');
            var floorMapSelector = document.querySelector('.floor-map-selector');
            leftArrow.setAttribute('visible', false);
            rightArrow.setAttribute('visible', false);
            animationPromises.push(skyboxSelector.components['fade'].animateHideCellPromise());
            animationPromises.push(floorMapSelector.components['fade'].animateHideCellPromise());
            Promise.all(animationPromises);
        },
        revealNonFocusedCells(skipCellIndex=-1) {
            var self = this;
            var animationPromises = [];
            for (var i=0; i<this.numberOfItemsToDisplay; i++) {
                if (i==skipCellIndex) continue;
                var el = document.querySelector(`#grid-cell-${i}`);
                var anim = el.components['fade'].animateRevealCellPromise();
                animationPromises.push(anim);
            }
            var leftArrow = document.querySelector('.grid-arrow-left');
            var rightArrow = document.querySelector('.grid-arrow-right');
            var skyboxSelector = document.querySelector('.skybox-selector');
            var floorMapSelector = document.querySelector('.floor-map-selector');
            animationPromises.push(skyboxSelector.components['fade'].animateRevealCellPromise());
            animationPromises.push(floorMapSelector.components['fade'].animateRevealCellPromise());
            leftArrow.setAttribute('visible', true);
            rightArrow.setAttribute('visible', true);
            Promise.all(animationPromises);
        },
        handlePageLeft() {
            if(!this.canPageLeft) return;
            this.unFocusFoscusedCell();
            this.pageAnimation(this.pageLeft);
        },

        handlePageRight() {
            if(!this.canPageRight) return;
            this.unFocusFoscusedCell();
            this.pageAnimation(this.pageRight);
        },

        pageAnimation(pageCallback) {
            var self = this;
            var cellObjs = [];
            var cells = [];
            var animationPromises = [];
            for (var n=0; n < this.numberOfItemsToDisplay; n++) {
                var cell = document.querySelector(`#grid-cell-${n}`);
                animationPromises.push(this.animateCellRemovalPromise(cell.object3D));
                cellObjs.push(cell.object3D);
                cells.push(cell);
            }
            Promise.all(animationPromises)
            .then((results) => {
                pageCallback();
                cells.forEach((cell) => {
                    self.resetCellScale(cell.object3D);
                    // cell.components['ls-cell'].updateCell();
                });
            });
        },

        animateCellRemovalPromise(obj) {
            var self = this;
            return new Promise((resolve, reject) => {
                try {
                    AFRAME.ANIME({
                        targets: obj.scale,
                        easing: 'linear',
                        x: [1, 0],
                        y: [1, 0],
                        z: [1, 0],
                        duration: 1000*(self.animateOutSeconds),
                        complete: function(anim) {
                            resolve();
                        }
                    });
                }
                catch (error) {
                    console.error('animateCellRemovalPromise error');
                    console.log(error);
                    reject(error);
                }
            });
        },

        resetCellScale(obj) {
            obj.scale.set(1,1,1);
        },

        toggleLayout() {
            // if (CONFIG.DEBUG) {console.log("toggleLayout");}
            var newVal = this.sceneLayout == SceneLayoutEnum.GRID ? 'GALLERY' : 'GRID';
            this.$store.commit('xr/SET_LAYOUT', newVal);
        },

        updateSkyTime(item) {
            var newTime = TimeUtils.datetimeToHourDecimal(item.datetime);
            this.$store.commit('xr/graphics/SET_SKYTIME', newTime);
        },

        setSkyFromFocusedCell() {
            var item = this.items[this.focusedCellIndex];
            if (typeof item.datetime != 'undefined' && item.datetime != null) {
                this.updateSkyTime(item);
            }
        },
    }
}
</script>
