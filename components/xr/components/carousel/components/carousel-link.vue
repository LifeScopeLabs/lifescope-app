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


// if (CONFIG.DEBUG) {console.log("from carousel-link.vue <script>")}
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
            var str = this.room.split(' ');
            for (var i = 0; i < str.length; i++) {
                str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
            }
            return str.join(' ');
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
