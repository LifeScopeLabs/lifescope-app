<template>
  <div class="content padded actions">
    <div class="flexbox flex-end width100">
      <i class="close-button fa fa-times-circle" v-on:click="$emit('close')"></i>
    </div>

    <div class="title">
      Tag '{{ item.title || item.text || item.context || item.handle || item.type }}'
    </div>

    <p>You can publicly share items tagged with a given tag through the 'Tags' tab on the <a href="app.lifescope.io">home page.</a></p>

    <div v-if="item.embed_thumbnail != null" class="preview">
      <img v-bind:src="item.embed_thumbnail">
    </div>

    <!--<div v-if="shareable === true" class="share-action">-->
      <!--<span>Share</span>-->
    <!--</div>-->

    <div v-if="taggable" class="tagging">
      <form v-on:submit.prevent="addTag">
        <div>Tags</div>
        <div class="add-tag">
          <span>#</span>
          <input type="text" placeholder="Add a tag" v-model="tagName">
          <i class="fa fa-plus" v-on:click="addTag"></i>
        </div>
        <div class="tags">
          <div v-for="tag in item.tags">
            <span>#{{ tag }}</span>
            <i class="delete fa fa-times" v-on:click="removeTag(tag)"></i>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import tagContact from '../../apollo/mutations/tag-contact.gql';
  import tagContent from '../../apollo/mutations/tag-content.gql';
  import tagEvent from '../../apollo/mutations/tag-event.gql';
  import untagContact from '../../apollo/mutations/untag-contact.gql';
  import untagContent from '../../apollo/mutations/untag-content.gql';
  import untagEvent from '../../apollo/mutations/untag-event.gql';


  const tagMap = {
    contact: tagContact,
    content: tagContent,
    event: tagEvent,
  };

  const untagMap = {
    contact: untagContact,
    content: untagContent,
    event: untagEvent,
  };

  export default {
    data: function() {
      return {
        tagName: ''
      }
    },

    props: ['shareable', 'item', 'taggable', 'type'],

    methods: {
      addTag: async function() {
        let strippedTag = this.$data.tagName.replace(/[^a-zA-Z0-9\s-]/, '').replace(/\s+/g, ' ');
        let slugifiedTag = strippedTag.toLowerCase().replace(/\s/g, '-');

        if (slugifiedTag.length === 0) {
          this.$data.tagName = 0;

          return;
        }

        await this.$apollo.mutate({
          mutation: tagMap[this.$props.type],
          variables: {
            id: this.$props.item.id,
            tags: [slugifiedTag]
          }
        });

        if (!this.$props.item.tagMasks) {
          this.$props.item.tagMasks = {};
        }

        if (this.$props.item.tagMasks && !this.$props.item.tagMasks.added) {
          this.$props.item.tagMasks.added = [];
        }

        if (this.$props.item.tagMasks && !this.$props.item.tagMasks.removed) {
          this.$props.item.tagMasks.removed = [];
        }

        let addedIndex = _.findIndex(this.$props.item.tagMasks.added, function(item) {
          return item === strippedTag;
        });

        let removedIndex = _.findIndex(this.$props.item.tagMasks.removed, function(item) {
          return item === strippedTag;
        });

        if (addedIndex === -1) {
          this.$props.item.tagMasks.added.push(strippedTag);
        }

        if (removedIndex >= 0) {
          this.$props.item.tagMasks.removed.splice(removedIndex, 1);
        }

        this.$data.tagName = '';
      },

      removeTag: async function(tag) {
        let strippedTag = tag.replace(/[^a-zA-Z0-9\s-]/, '').replace(/\s+/g, ' ');
        let slugifiedTag = strippedTag.toLowerCase().replace(/\s/g, '-');

        await this.$apollo.mutate({
          mutation: untagMap[this.$props.type],
          variables: {
            id: this.$props.item.id,
            tags: [slugifiedTag]
          }
        });

        if (!this.$props.item.tagMasks) {
          this.$props.item.tagMasks = {};
        }

        if (this.$props.item.tagMasks && !this.$props.item.tagMasks.added) {
          this.$props.item.tagMasks.added = [];
        }

        if (this.$props.item.tagMasks && !this.$props.item.tagMasks.removed) {
          this.$props.item.tagMasks.removed = [];
        }

        let addedIndex = _.findIndex(this.$props.item.tagMasks.added, function(item) {
          return item === strippedTag;
        });

        let removedIndex = _.findIndex(this.$props.item.tagMasks.removed, function(item) {
          return item === strippedTag;
        });

        if (addedIndex >= 0) {
          this.$props.item.tagMasks.added.splice(addedIndex, 1);
        }

        if (removedIndex === -1) {
          this.$props.item.tagMasks.removed.push(strippedTag);
        }
      }
    }
  }
</script>
