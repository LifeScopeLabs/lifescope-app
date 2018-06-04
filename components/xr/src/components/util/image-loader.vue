<template>

    <a-assets>
        <img v-for="image in LSObjs"
            :key="'image-' + image.id"
            :id="'image-' + image.id"
            :src="imageSrc(image)">
    </a-assets>
    
</template>

<script>
//import LSO from '../../plugins/lso-plugin';
//debugger;

export default {
    props:  ['LSObjs'],
    
    methods: {

        imageSrc: function (image) {
            var x = '';
            //debugger; // eslint-disable-line
            
            // if (image instanceof LSO.Content) {
            //     x = image.embed_thumbnail; 
            //     console.log(x);
            // } else if (image instanceof LSO.Contact) {
            //     x = image.avatar_url;
            // } else {
            //     x = '/iris.jpg';
            //     console.log("not a lifescopeObject");
            // }
            
            x = image.embed_thumbnail;
            x = "/photos" + x;

            //x = x.replace(/\.[^/.]+$/, "")  // remove extension
            //x = x.replace(/^\//g, '') // remove leading slash
            
            //console.log("imageSrc: " + x)
            //console.log("this.image.id: " + this.image.id)
            
            return x;
        }
    }
}
</script>
