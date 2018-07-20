<template>
    <a-entity class="carousel-item carousel-link">

        <a-entity class="clickable" :link="this.link"
                    />
        <!-- <a-entity scale="2 2 1"
                rotation="0 0 0"
                :text="this.textString(this.title)"
                position="0.2 0 0"/> -->
    </a-entity>

    
</template>

<script>
var CONFIG = {};
CONFIG.DEBUG = true;

if (CONFIG.DEBUG) {console.log("from carousel-link.vue <script>")}
export default {
    props: ['room'],

    computed: {
        link: function () {
            return "href: " + this.href + '; ' +  'title: ' + this.title + '; ' + 'image: #sky' + ';';
        },
        href: function () {
            return '?room=' + this.room;
        },
        title: function () {
            // capitalize first letter
            return this.room.charAt(0).toUpperCase() + this.room.slice(1);;
        }
    },

    methods: {
        textString: function (value) {
            return 'width: 1.5; color: white; value: ' + value;
        }
    },

    created () {
        //console.log(this.room);
    },
    mounted () {
        //console.log(this.room);
    }
  }
</script>
