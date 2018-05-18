<template>
    <a-entity class="carousel-item carousel-content-item">
        <a-entity scale="2 2 1"
                  :text="this.textString(obj.title)"
                  position="0 -.2 0"/>
        <a-entity scale="2 2 1"
                  :text="this.textString('type: ' + obj.type)"
                  position="0 -.4 0"/>
        <a-entity scale="2 2 1"
                  :text="this.textString('url: ' + obj.url)"
                   position="0 -.6 0"/>
    </a-entity>
</template>

<script>
console.log("from carousel-item.vue <script>")
export default {
    props: ['obj'],

    methods: {
        textString: function (value) {
            return 'width: 1.5; color: white; value: ' + value
        }
    },

    mounted () {
        //console.log(this.obj.id)
    }
  }
</script>
