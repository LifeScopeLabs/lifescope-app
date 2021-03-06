<template>
    <div class="content padded actions">
        <div class="flexbox flex-end width100">
            <i class="close-button fal fa-2x fa-times-circle"
               v-on:click="$emit('close')"
            ></i>
        </div>

        <div class="title">
            Tag '{{ item.title || item.text || item.context || item.handle || item.type || concatNames(item) }}'
        </div>

        <div v-if="item.embed_thumbnail != null"
             class="preview"
        >
            <img v-bind:src="item.embed_thumbnail">
        </div>

        <!--<div v-if="shareable === true" class="share-action">-->
        <!--<span>Share</span>-->
        <!--</div>-->

        <div v-if="taggable"
             class="tagging"
        >
            <form v-on:submit.prevent="addTag">
                <div class="add-tag">
                    <span># </span>
                    <input v-model="tagName"
                           type="text"
                           placeholder="Add a Tag"
                    >
                    <i class="fal fa-plus"
                       v-on:click="addTag"
                    ></i>
                </div>
                <div class="tags">
                    <div v-for="tag in item.tags"
                         v-bind:key="tag"
                    >
                        <span v-on:click="searchTag(tag)">#{{ tag }}</span>
                        <i class="delete fal fa-times"
                           v-on:click="removeTag(tag)"
                        ></i>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
	import _ from 'lodash';

	import searchUpsert from '../../apollo/mutations/search-upsert.gql';
	import tagContact from '../../apollo/mutations/tag-contact.gql';
	import tagContent from '../../apollo/mutations/tag-content.gql';
	import tagEvent from '../../apollo/mutations/tag-event.gql';
	import tagPerson from '../../apollo/mutations/tag-person.gql';
	import untagContact from '../../apollo/mutations/untag-contact.gql';
	import untagContent from '../../apollo/mutations/untag-content.gql';
	import untagEvent from '../../apollo/mutations/untag-event.gql';
	import untagPerson from '../../apollo/mutations/untag-person.gql';


	const tagMap = {
		contact: tagContact,
		content: tagContent,
		event: tagEvent,
		person: tagPerson,
	};

	const untagMap = {
		contact: untagContact,
		content: untagContent,
		event: untagEvent,
		person: untagPerson,
	};

	export default {
		props: {
			shareable: {
				type: Boolean,
				default: function() {
					return false
				}
			},

			item: {
				type: Object,
				default: function() {
					return {};
				}
			},

			taggable: {
				type: Boolean,
				default: function() {
					return false;
				}
			},

			type: {
				type: String,
				default: function() {
					return 'event';
				}
			}
		},

		data: function() {
			return {
				tagName: ''
			}
		},

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
			},

			searchTag: async function(tag) {
				let result = await this.$apollo.mutate({
					mutation: searchUpsert,
					variables: {
						query: '#' + tag
					}
				});

				let data = result.data.searchUpsert;

				if (data && data.id) {
					this.$router.push('/explore?qid=' + data.id);
				}
			},

			concatNames(item) {
				let returned = '';

				if (item.first_name || item.middle_name || item.last_name) {
					if (item.first_name) {
						returned += item.first_name + ' ';
					}

					if (item.middle_name) {
						returned += item.middle_name + ' ';
					}

					if (item.last_name) {
						returned += item.last_name + ' ';
					}

					returned = _.trim(returned);
				}

				return returned;
			}
		}
	}
</script>
