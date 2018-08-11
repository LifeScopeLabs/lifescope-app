<template>
   <a-entity class="carousel-explorer">
       <!-- Carousel left -->
        <!-- Paginator -->
        <!-- content/events/contacts -->
        <a-entity class="gallery-carousel-left"
                        :layout="'type: line; margin: ' + carouselDim.layoutMargin"
                        rotation="0 90 0"
                        :position="-hallWidth/2 + ' 1 ' + (-carouselDim.wallEdgeOffset) ">
            <user-contact v-if="$store.state.facet === 'contacts'"
                v-for="contact in itemsLeft"
                :key="contact.id"
                :contact="contact"
                :connection="contact.connection"
                :carouselDim="carouselDim">
            </user-contact>
            <user-content v-if="$store.state.facet === 'content'"
                v-for="content in itemsLeft"
                :key="content.id"
                :content="content"
                :connection="content.connection"
                :carouselDim="carouselDim">
            </user-content>
            <user-event v-if="$store.state.facet === 'events'"
                v-for="event in itemsLeft"
                :key="event.id"
                :event="event"
                :carouselDim="carouselDim">
            </user-event>
        </a-entity>

        <!-- Carousel back -->
        <a-entity class="gallery-carousel-back"
                    :layout="'type: line; margin: ' + carouselDim.layoutMargin"
                    rotation="0 0 0"
                    :position="(-hallDepth/2 + carouselDim.wallEdgeOffset) + ' 1 ' + -hallDepth">
            <user-contact v-if="$store.state.facet === 'contacts'"
                v-for="contact in itemsBack"
                :key="contact.id"
                :contact="contact"
                :connection="contact.connection"
                :carouselDim="carouselDim">
            </user-contact>
            <user-content v-if="$store.state.facet === 'content'"
                v-for="content in itemsBack"
                :key="content.id"
                :content="content"
                :connection="content.connection"
                :carouselDim="carouselDim">
            </user-content>
            <user-event v-if="$store.state.facet === 'events'"
                v-for="event in itemsBack"
                :key="event.id"
                :event="event"
                :carouselDim="carouselDim">
            </user-event>
        </a-entity>

        <!-- Carousel right -->
        <a-entity class="gallery-carousel-right"
                    :layout="'type: line; margin: ' + carouselDim.layoutMargin"
                    rotation="0 -90 0"
                    :position="hallWidth/2 + ' 1 ' + (-hallDepth +carouselDim.wallEdgeOffset)">
            <user-contact v-if="$store.state.facet === 'contacts'"
                v-for="contact in itemsRight"
                :key="contact.id"
                :contact="contact"
                :connection="contact.connection"
                :carouselDim="carouselDim">
            </user-contact>
            <user-content v-if="$store.state.facet === 'content'"
                v-for="content in itemsRight"
                :key="content.id"
                :content="content"
                :connection="content.connection"
                :carouselDim="carouselDim">
            </user-content>
            <user-event v-if="$store.state.facet === 'events'"
                v-for="event in itemsRight"
                :key="event.id"
                :event="event"
                :carouselDim="carouselDim">
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
    data () {
        return {
            page: 0,
            carouselDim: {
                wallEdgeOffset: 1,
                itemsPerWall: 18,
                layoutMargin: 1,
                contentHeight: 2,
                top: 1.5,
                lineSeparation: 0.1,
                columnWidth: 1,
                iconOffset: 0.5,
                iconWidth: 0.1,
                backgroundWidth: 0.8,
                backgroundHeight: 1.5,
                displayDegrees: 45
            }
        }
    },
    props: ['hallWidth', 'hallDepth'],

    components: {
        UserContact,
        UserContent,
        UserEvent
    },

	computed: {
        imageMaterial: function() {
            return 'src: #image-' + this.content.id + '; side: double'
        },
        itemsCurrent: function() {
            var items;
            if (this.$store.state.facet === 'contacts') {
                items = this.$store.state.objects.contacts.slice(0, 3*this.carouselDim.itemsPerWall);
            }
            else if (this.$store.state.facet === 'content') {
                items = this.$store.state.objects.content.slice(0, 3*this.carouselDim.itemsPerWall);
            }
            else if (this.$store.state.facet === 'events') {
                items = this.$store.state.objects.events.slice(0, 3*this.carouselDim.itemsPerWall);
            }
            return items;
        },

        itemsLeft: function () {
            return this.itemsCurrent.slice(0, this.carouselDim.itemsPerWall);
        },
        itemsBack: function () {
            return this.itemsCurrent.slice(this.carouselDim.itemsPerWall, 2*this.carouselDim.itemsPerWall);
        },
        itemsRight: function () {
            return this.itemsCurrent.slice(2*this.carouselDim.itemsPerWall, 3*this.carouselDim.itemsPerWall);
        },
    },

    methods: {
        textString: function(value) {
            return 'width: 1.5; color: white; value: ' + value
        }
    },

    mounted () {
    }
  }
</script>
