<template>

    <a-assets>
        <img v-for="image in LSObjs"
            :key="'image-' + image.id"
            :id="'image-' + image.id"
            :src="imageSrc(image)"
            crossorigin="anonymous">
    </a-assets>
    
</template>

<script>

export default {
    props:  ['LSObjs'],
    
    methods: {

        imageSrc: function (image) {
            var x = 'https://d15xakt8l0tdrr.cloudfront.net/assets/images/icons/android-chrome-512x512.png';
            const imageTypes = ['png', 'jpg', 'jpeg', 'svg', 'tiff', 'bmp', 'webp'];

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
            if (imageTypes.indexOf(image.embed_format.toLowerCase()) > -1) {
                x = image.embed_content;
            }
           // x = "/photos" + x;

            //x = x.replace(/\.[^/.]+$/, "")  // remove extension
            //x = x.replace(/^\//g, '') // remove leading slash
            
            //console.log("imageSrc: " + x)
            //console.log("this.image.id: " + this.image.id)
            
            return x;
        }
    }
}
</script>
