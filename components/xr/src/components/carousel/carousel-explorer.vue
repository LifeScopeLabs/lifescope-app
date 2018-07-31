<template>
   <a-entity class="carousel-explorer">
       <!-- Carousel left -->
        <!-- Paginator -->
        <!-- content/events/contacts -->
        <a-entity class="gallery-carousel-left"
                        layout="type: line; margin: 1"
                        rotation="0 90 0"
                        :position="-hallWidth/2 + ' 1 ' + (-wallEdgeOffset) ">
            <user-contact v-if="$store.state.facet === 'contacts'"
                v-for="contact in itemsLeft"
                :key="contact.id"
                :contact="contact"
                :connection="contact.connection">
            </user-contact>
            <user-content v-if="$store.state.facet === 'content'"
                v-for="content in itemsLeft"
                :key="content.id"
                :content="content"
                :connection="content.connection">
            </user-content>
            <user-event v-if="$store.state.facet === 'events'"
                v-for="event in itemsLeft"
                :key="event.id"
                :event="event">
            </user-event>
        </a-entity>

        <!-- Carousel back -->
        <a-entity class="gallery-carousel-back"
                    layout="type: line; margin: 1"
                    rotation="0 0 0"
                    :position="(-hallDepth/2 + wallEdgeOffset) + ' 1 ' + -hallDepth">
            <user-contact v-if="$store.state.facet === 'contacts'"
                v-for="contact in itemsBack"
                :key="contact.id"
                :contact="contact"
                :connection="contact.connection">
            </user-contact>
            <user-content v-if="$store.state.facet === 'content'"
                v-for="content in itemsBack"
                :key="content.id"
                :content="content"
                :connection="content.connection">
            </user-content>
            <user-event v-if="$store.state.facet === 'events'"
                v-for="event in itemsBack"
                :key="event.id"
                :event="event">
            </user-event>
        </a-entity>

        <!-- Carousel right -->
        <a-entity class="gallery-carousel-right"
                    layout="type: line; margin: 1"
                    rotation="0 -90 0"
                    :position="hallWidth/2 + ' 1 ' + (-hallDepth + wallEdgeOffset)">
            <user-contact v-if="$store.state.facet === 'contacts'"
                v-for="contact in itemsRight"
                :key="contact.id"
                :contact="contact"
                :connection="contact.connection">
            </user-contact>
            <user-content v-if="$store.state.facet === 'content'"
                v-for="content in itemsRight"
                :key="content.id"
                :content="content"
                :connection="content.connection">
            </user-content>
            <user-event v-if="$store.state.facet === 'events'"
                v-for="event in itemsRight"
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
    data () {
        return {
            wallEdgeOffset: 1,
			page: 0,
			itemsPerWall: 19
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
                items = this.$store.state.objects.contacts.slice(0, 3*this.itemsPerWall);
            }
            else if (this.$store.state.facet === 'content') {
                items = this.$store.state.objects.content.slice(0, 3*this.itemsPerWall);
            }
            else if (this.$store.state.facet === 'events') {
                items = this.$store.state.objects.events.slice(0, 3*this.itemsPerWall);
            }
            return items;
        },

        itemsLeft: function () {
            return this.itemsCurrent.slice(0, this.itemsPerWall);
        },
        itemsBack: function () {
            return this.itemsCurrent.slice(this.itemsPerWall, 2*this.itemsPerWall);
        },
        itemsRight: function () {
            return this.itemsCurrent.slice(2*this.itemsPerWall, 3*this.itemsPerWall);
        },
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
