<template>
    <img v-if="obj.type == 'image'"
        :onload="loadedCB()"
        :id="'image-' + obj.id"
        :src="objSrc(obj.route)"
        crossorigin="anonymous"/>
    <video v-else-if="obj.type == 'video'"
        :id="'video-' + obj.id"
        :src="objSrc(obj.route)"
        crossorigin="anonymous"
    />
    <a-gltf-model v-else-if="obj.type == '3d'"
        :id="'gltf-' + obj.id"
        :src="objSrc(obj.route)"
        crossorigin="anonymous"
    />
    <a-asset v-else
        :id="'failed-' + obj.id"
        :src="objSrc(obj.route)"
    />
</template>

<script>

var CONFIG = {};
CONFIG.DEBUG = true;

export default {
    props:  ['obj', 'roomConfig'],

    methods: {
        objSrc: function (route)  {
            return this.roomConfig.bucket_route + '/' + this.roomConfig.BUCKET_NAME + '/' + route;
        },

        loadedCB: function () {
            if (CONFIG.DEBUG) {
                console.log("img onload");
                console.log("obj.id: " + this.obj.id);
                console.log("image-" + this.obj.id);
                console.log(document.getElementById("image-" + this.obj.id));
            };

        }
    },

    mounted () {
        if (CONFIG.DEBUG) {
            console.log("object-loader mounted()");
            console.log("obj.id: " + this.obj.id);
            console.log("image-" + this.obj.id);
            console.log(document.getElementById("image-" + this.obj.id));
            console.log(this.$el);
            console.log("this.$el.width: " + this.$el.width);
            console.log("this.$el.height: " + this.$el.height);
            console.log("this.$el.naturalHeight: " + this.$el.naturalHeight);
            console.log("this.$el.natrualWidth: " + this.$el.naturalWidth);
        };
    }

}
</script>
