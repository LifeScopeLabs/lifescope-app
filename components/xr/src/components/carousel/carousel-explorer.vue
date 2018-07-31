<template>
   <!-- facets -->
   <a-entity class="carousel-explorer">
       <!-- Carousel left -->
        <a-entity class="gallery-carousel-left"
                        layout="type: line; margin: 4"
                        rotation="0 90 0"
                        position="-3.8 1 0">
            <user-contact v-if="$store.state.facet === 'contacts'"
                v-for="contact in $store.state.objects.contacts"
                :key="contact.id"
                :contact="contact"
                :connection="contact.connection">
            </user-contact>
            <user-content v-if="$store.state.facet === 'content'"
                v-for="content in $store.state.objects.content"
                :key="content.id"
                :content="content"
                :connection="content.connection">
            </user-content>
            <user-event v-if="$store.state.facet === 'events'"
                v-for="event in $store.state.objects.events"
                :key="event.id"
                :event="event">
            </user-event>
        </a-entity>
   </a-entity>
</template>

<script>
console.log("from carousel-explorer.vue <script>")
import UserContact from './objects/contact.vue';
import UserContent from './objects/content.vue';
import UserEvent from './objects/event.vue';

export default {
    components: {
        UserContact,
        UserContent,
        UserEvent
    },

	computed: {
        imageMaterial: function() {
            return 'src: #image-' + this.content.id + '; side: double'
        }
    },

    methods: {
        textString: function(value) {
            return 'width: 1.5; color: white; value: ' + value
        }
    },

    mounted () {
        //console.log(this.content.id)
    }
  }
</script>
