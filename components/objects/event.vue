<template>
	<div v-if="$store.state.view === 'feed'" class="object event" v-bind:id="event.id">
		<aside class="details">
			<div class="type">
				<i v-bind:class="getEventTypeIcon(event.type)"></i>

				<span v-if="event.context">
					{{ event.context }}
				</span>
				<span v-else>
					{{ event.type }}
				</span>

				<aside class="action-bar">
					<span>Tag</span><i class="fa fa-hashtag"></i>
				</aside>
			</div>

			<div class="provider">
				<i v-bind:class="getProviderIcon(event.hydratedConnection.provider)"></i>
				<span>{{ event.hydratedConnection.name | truncate(30) }}</span>
			</div>

			<div v-if="event.date" class="date">
				<div>
					<div>
						<i class="fa fa-calendar"></i> <span>{{ event.date | dateFilter }}</span>
					</div>


					<div v-if="!event.date" class="estimation">
						<i class="fa fa-flask"></i> <span>Estimated</span>
					</div>

					<div v-else>
						<i class="fa fa-clock-o"></i> <span>{{ event.date | timeFilter }}</span>
					</div>
				</div>
			</div>

			<div class="tagging">
				<div class="tags">
					<span v-for="tag in tags">#{{ tag }}</span>
				</div>
			</div>
		</aside>

		<section v-if="event.content && event.content.length > 0" class="content">
			<user-content v-for="content in event.hydratedContent" v-bind:key="content.id" v-bind:content="content" v-bind:connection="event.hydratedConnection"></user-content>
		</section>

		<aside v-if="(event.contacts && event.contacts.length > 0) || (event.people && event.people.length > 0) || (event.organizations && event.organizations.length > 0)" class="interactions">
			<div v-if="event.contact_interaction_type">{{ event.content_interaction_type }}</div>
			<div class="objects">
				<user-contact v-for="contact in event.hydratedContacts" v-bind:key="contact.id" v-bind:contact="contact" v-bind:connection="event.hydratedConnection"></user-contact>
			</div>
			<div v-if="event.contacts > 3 || event.people > 3 || event.organizations > 3" class="expand">More</div>
		</aside>
	</div>

  <div v-else-if="$store.state.view === 'grid'" class="item grid" v-bind:id="event.id" v-on:click="$emit('render-details', event)">
    <div v-if="hasThumbnail() === true" class="mobile-thumbnail">
      <img v-bind:src="getGridThumbnail()" />
    </div>
    <div v-else>
      <i v-bind:class="getEventTypeIcon(event.type)" class="type-icon large-grid-icon"></i>
    </div>

    <div class="title-bar">
      <i v-bind:class="getEventTypeIcon(event.type)" class="bubble"></i>

      <div v-if="hasTitle" class="title">
        {{ getGridTitle() | safe }}
      </div>
      <div v-else-if="event.datetime">
        <div class="title">
          <div>
            <i class="fa fa-calendar"></i> <span>{{ date | dateShort }}</span>
          </div>

          <div>
            <i class="fa fa-clock-o"></i> <span>{{ date | dateTime }}</span>
          </div>
        </div>
      </div>

      <i v-bind:class="getProviderIcon(event.hydratedConnection.provider)" class="bubble"></i>
    </div>
  </div>

  <div v-else="if=$store.state.view === 'list'" class="item list" v-bind:id="event.id" v-on:click="$emit('render-details', event)">
    <div>
      <span v-if="event.hydratedContent && event.hydratedContent.length > 0">{{ getFirstTitle(event) | truncate(30) }}</span>
    </div>

    <div class="icon-column">
      <i v-bind:class="getEventTypeIcon(event.type)"></i>
      <span class="mobile-hide">{{ contextOrType(event) | truncate(30) }}</span>
    </div>

    <div class="icon-column">
      <i v-bind:class="getProviderIcon(event.hydratedConnection.provider)"></i>
      <span class="mobile-hide">{{ event.hydratedConnection.provider.name }}</span>
    </div>

    <div class="mobile-hide">
      <span v-if="event.hydratedContacts && event.hydratedContacts.length > 0">{{ getFirstContact(event) | truncate(30) }}</span>
    </div>

    <div>
      <span v-if="event.date">{{ event.date | tinyDate }}</span>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';

	import icons from '../../lib/util/icons';
	import safeFilter from '../filters/safe';
	import UserContact from '../objects/contact';
	import UserContent from '../objects/content';

	export default {
		components: {
			UserContact,
			UserContent
		},
		data: function() {
			return {
				tags: function() {
					let tags = [];

					if (this.event.tagMasks) {
						_.forEach(this.tagMasks.source, function(tag) {
							if (tags.indexOf(tag) === -1) {
								tags.push(tag);
							}
						});

						_.forEach(this.tagMasks.added, function(tag) {
							if (tags.indexOf(tag) === -1) {
								tags.push(tag);
							}
						});

						_.forEach(this.tagMasks.removed, function(tag) {
							let index = tags.indexOf(tag);

							if (index > -1) {
								tags.splice(index, 1);
							}
						});
					}

					return tags;
				}
			}
		},
		props: [
			'event'
		],
		filters: {
      safe: safeFilter,

      dateShort: function(date) {
        return moment.utc(date).format('YYYY/MM/DD');
      },

      dateTiny: function(date) {
        return moment.utc(date).format('M/D/YY')
      },

      dateTime: function(date) {
        return moment.utc(date).format('hh:mm A')
      }
		},
		methods: {
		  getFirstTitle: function(event) {
		    let returned = '';

		    _.each(event.hydratedContent, function(item) {
		      if (item.title) {
		        returned = item.title;

		        return false;
          }
        });

		    return returned;
      },

      getFirstContact: function(event) {
		    let returned = '';

		    _.each(event.hydratedContacts, function(item) {
		      if (item.handle || item.name) {
		        returned = item.handle || item.name;
          }

          return false;
        });

		    return returned;
      },

      contextOrType: function(event) {
        return event.context ? event.context : event.type[0].toUpperCase() + event.type.slice(1);
      },

			getEventTypeIcon: function(type) {
				return icons('event', type)
			},

			getProviderIcon: function(provider) {
				return icons('provider', provider.name);
			},

      hasThumbnail: function() {
			  let hasThumbnail = false;

        _.each(this.$props.event.hydratedContent, function(item) {
          if (item.embed_thumbnail) {
            hasThumbnail = true;
          }
        });

        return hasThumbnail;
      },

      hasTitle: function() {
        let hasTitle = false;

        _.each(this.$props.event.hydratedContent, function(item) {
          if (item.title) {
            hasTitle = true;
          }
        });

        return hasTitle;
      },

      getGridThumbnail: function() {
			  let firstMatch = _.find(this.$props.event.hydratedContent, function(item) {
			    return item.embed_thumbnail != null;
        });

			  return firstMatch.embed_thumbnail;
      },

      getGridTitle: function() {
        let firstMatch = _.find(this.$props.event.hydratedContent, function(item) {
          return item.title != null;
        });

        return firstMatch.title.length > 40 ? firstMatch.title.slice(0, 40) + '...' : firstMatch.title;
      }
		}
	}
</script>
