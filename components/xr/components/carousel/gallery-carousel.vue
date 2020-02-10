<template>
    <a-entity class="gallery-carousel">
        <a-entity v-if="floorActive">
            <a-diorama-column v-for="n in radialsegments"
                :key="'railSegment' + n"
                :rotation="railRotation(n-1)"
                :position="railPosition(n-1)"
                :radius="floorRadius"
                :railheight="railHeight"
                :radialsegments="numberOfSegments"
                :bump="bump"
                :normal="normal"
                :quality="qualityString"
                :shading="shadingString"/>
        </a-entity>
        <a-entity v-for="(item, n) in items"
            :key="'carouselItem' + n">
            <a-diorama 
                :type="item.type"
                :src="imageSrc(item)"
                :rotation="dioramaRotation(n-1)"
                :position="dioramaPosition(n-1)"
                :railheight="railHeight"
                :bump="bump"
                :normal="normal"
                :rail="floorActive"
                :quality="qualityString"
                :shading="shadingString"
            />
        </a-entity>
    </a-entity>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { GraphicsQualityEnum, ShadingEnum } from '../../../../store/modules/xr/modules/graphics';

export default {
    computed: {
        radialsegments() {
            return Math.max(this.numberOfSegments, 12);
        },
        sortedLSObjs() {
            var sorted = this.LSObjs;
            sorted.sort(function (a, b) {
                return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
            });
            return sorted;
        },
        items() {
            return this.sortedLSObjs.slice(this.pageStart, this.pageStart + this.numberOfSegments);
        },
        totalItems() {
            return this.LSObjs.length;
        },
        numberOfItemsToDisplay() {
            return Math.min(this.numberOfSegments, this.items.length);
        },
        // vuex store
        ...mapState('xr',
            [
                'LSObjs',
                'roomConfig'
            ]
        ),
        ...mapState('xr/carousel',
            [
                'pageStart',
                'numberOfSegments',
                'floorRadius',
                'railHeight',
                'floorActive'
            ]
        ),
        ...mapState('xr/graphics',
            [
                'bump',
                'normal',
                'quality',
                'shading'
            ]
        ),
        ...mapGetters('xr/graphics',
            [
                'qualityString',
                'shadingString',
            ]
        ),
    },
    methods: {
        imageSrc: function (image) {
            if(!image)
                return '';
            else
                return this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + image.route;
        },
        railRotation: function(segment) {
            var u = (segment + 0.5) / this.numberOfSegments;
            var theta = (135 - u * 360);

            var roty = theta - 90;
            var rotx = 0;

            return `${rotx} ${roty} 0`;
        },
        railPosition: function(segment) {
            var u = segment / this.numberOfSegments;
            var theta = (3*Math.PI/4 -u * 2 * Math.PI);

            var sinTheta = Math.sin( theta );
            var cosTheta = Math.cos( theta );

            var x = + this.floorRadius * cosTheta;
            var z = - this.floorRadius * sinTheta;

            return `${x} 0 ${z}`;
        },
        dioramaRotation: function(segment) {
            var u = segment / this.numberOfSegments;
            var theta =  - (u * Math.PI * 2) + (-3*Math.PI/4); //(-3*Math.PI/4)

            var roty = theta * (180/Math.PI);
            var rotx = 0;

            return `${rotx} ${roty} 0`;
        },
        dioramaPosition: function(segment) {
            var u = segment / this.numberOfSegments;
            var theta = (-3*Math.PI/4) - (u * Math.PI * 2);

            var sinTheta = Math.sin( theta );
            var cosTheta = Math.cos( theta );

            var x = (this.floorRadius) * sinTheta;
            var y = 0;
            var z = (this.floorRadius) * cosTheta;

            return `${x} ${y} ${z}`;
        },
    },
  }
</script>