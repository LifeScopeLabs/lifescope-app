<template>
  <main>
    <section>
      <aside id="left">
        <div class="boxed-group settings-menu">
          <div>Settings</div>

          <div>
            <a href="/settings/account">Account</a>
          </div>

          <div>
            <a href="/settings/connections">Connections</a>
          </div>
        </div>
      </aside>

      <section class="flexbox flex-column flex-grow">
        <section id="account" v-if="$store.state.mode === 'account'">
          <div class="boxed-group">
            <div class="title">LifeScope Developer API Platform</div>

            <div class="padded paragraphed">
              <p>
                LifeScope is an open data platform you can build on. Learn more by reading our <a href="https://lifescopelabs.github.io">Documentation on GitHub</a>.
              </p>
              <p>
                Explore the LifeScope API using our <a href="https://api.lifescope.io/gql-p">GraphQL Playground IDE</a> or <a href="https://api.lifescope.io/gql-i">GraphiAL</a>.
              </p>
              <p>
                The LifeScope GraphQL API can be accessed at (https://api.lifescope.io/gql). Add the Authorization header with your API key. Key: 'Authorization' Value 'Bearer: &lt;your_api_key&gt;'.
              </p>
              <p>
                Coming Soon! Social sign in provider support using OAuth 2.
              </p>
              <div class="flexbox">
                <p style="margin-right:0.5em;">Your Personal LifeScope API key is:</p>
                <span style="word-break: break-all">{{ $store.state.userOne.api_key_string }}</span>
              </div>

              <div class="mobile-flex-center">
                <button id="new-api-key" class="danger" v-on:click="generateApiKey">Generate New API Key</button>
              </div>
            </div>
          </div>

          <div class="boxed-group">
            <div class="title">Browser Location Tracking</div>
            <div class="padded paragraphed">
              <p>
                LifeScope can record your location when you visit LifeScope pages. This can greatly improve search results over time.
              </p>
              <div class="location-buttons">
                <div class="mobile-flex-center">
                  <button v-if="$store.state.userOne.location_tracking_enabled === true" id="disable-location-tracking" class="primary" v-on:click.prevent="showLocationTrackingModal">Disable Location Tracking</button>
                  <button v-if="$store.state.userOne.location_tracking_enabled !== true" id="enable-location-tracking" class="primary" v-on:click.prevent="showLocationTrackingModal">Enable Location Tracking</button>
                </div>

                <span class="flex-grow"></span>

                <div class="mobile-flex-center">
                  <button class="danger delete" v-on:click.prevent="showTrackedLocationsDeleteModal">Delete Tracked Locations</button>
                </div>
              </div>
            </div>
          </div>

          <div class="boxed-group">
            <div class="title">Delete LifeScope Account</div>

            <div class="padded paragraphed">
                <p>LifeScope is read only and your connected data source account will remain unchanged.</p>
                <p>Once you delete your account, your LifeScope index will be deleted.</p>
                <p>LifeScope will not keep your data and we never share any data without your consent.</p>

              <div class="mobile-flex-center">
                <button id="delete" class="danger" v-on:click="showAccountDeleteModal">Delete Account</button>
              </div>
            </div>
          </div>

          <modals-container/>
        </section>
        <section id="connections" v-if="$store.state.mode === 'connections'">
          <div v-for="connection in orderBy($store.state.connectionMany, 'provider.name')"
               v-bind:class="{active : $data.activeConnection === connection.id}" class="connection boxed-group"
               v-bind:data-id="connection.id" v-bind:data-provider-id="connection.provider.id">
            <div class="flexbox flex-x-center title" v-on:click="toggleActive(connection.id)">
              <div class="icon-name">
                <i v-bind:class="getIcon(connection)"></i>
                <div class="flex-grow name">{{ connection.name }}</div>
                <div class="disabled"></div>
              </div>
              <div class="last-run">
                <div v-if="connection.browser == null && connection.last_run != null" class="updates">
                  {{ getUpdated(connection.last_run) }}
                </div>
                <div v-else-if="connection.browser == null" class="updates">
                  <div>Initial index in progress</div>
                  <span></span>
                  <i class="fa fa-spinner fa-spin fa-2x"></i>
                </div>
              </div>

              <i class="fa fa-caret-down expand-indicator"></i>
            </div>

            <form class="auto" v-on:submit.prevent="">
              <div class="padded paragraphed">
                <div v-if="connection.browser == null">
                  <div class="flexbox flex-x-center label">
                    <div>Name</div>
                    <i class="fa fa-check-circle flex-grow success-icon" data-for="name"
                       v-bind:data-namespace="connection.id"></i>
                  </div>
                  <div class="text-box shrink">
                    <input name="name" type="text" v-bind:value="connection.name"/>
                  </div>
                </div>

                <div>
                  <div v-if="connection.browser == null" class="label">What would you like?</div>
                  <div v-else-if="connection.browser != null" class="label">The LifeScope Browser extension only tracks sites you approve. Adding or Removing Tracked sites can be done in the LifeScope Browser extension's options menu.</div>
                  <div>
                    <div v-for="permission, name in orderBy(connection.provider.sources, 'name')" class="paragraph ">
                      <div class="flexbox flex-x-center">
                        <label><input class="flag" type="checkbox" v-bind:value="permission.$key"
                                      v-model="$store.state.permissions[connection.id]" v-on:change="updatePermissions(connection)"/>{{
                          permission.$value.name }}</label>
                        <i class="fa fa-check-circle flex-grow success-icon" v-bind:data-for="name"
                           v-bind:data-namespace="connection.id"></i>
                      </div>
                      <div class="tooltip" data-for="">{{ permission.$value.description }}</div>
                    </div>
                  </div>
                </div>

                <input class="hidden" type="submit"/>

                <div v-if="connection.provider.auth_type === 'oauth2' && connection.auth.status.authorized !== true"
                     class="reauthorize">
                  <button class="primary" v-on:click="getConnectionReauthorization(connection)">Reauthorize</button>
                  <div>The changes you have made require you to re-authorize this connection to {{
                    connection.provider.name }}.
                  </div>
                  <div>Retrieval of your data may not work properly until you re-authorize.</div>
                </div>

                <div class="delete-disable">
                  <button v-if="connection.enabled === true" class="danger disable" v-on:click.prevent="showDisableModal(connection)">Disable</button>
                  <button v-else class="primary enable" v-on:click.prevent="enableConnection(connection)">Enable</button>

                  <span class="flex-grow"></span>
                  <button class="danger delete" v-on:click.prevent="showConnectionDeleteModal(connection)">Delete</button>
                </div>
              </div>
            </form>
          </div>

          <a id="big-add" class="flexbox flex-center" href="https://app.lifescope.io/providers">
            <i class="fa fa-plus"></i>
          </a>
        </section>

        <modals-container/>
      </section>
    </section>
  </main>
</template>

<script>
  import _ from 'lodash';
  import moment from 'moment';

  import icons from '../../lib/util/icons';

  import connectionMany from '../../apollo/queries/connection-many.gql';
  import connectionDeleted from '../../apollo/subscriptions/connection-deleted.gql';
  import connectionUpdated from '../../apollo/subscriptions/connection-updated.gql';
  import deleteAccountModal from '../modals/account-delete';
  import deleteConnectionModal from '../modals/connection-delete';
  import disableConnectionModal from '../modals/connection-disable';
  import locationTrackingModal from '../modals/location-tracking';
  import trackedLocationsDeleteModal from '../modals/tracked-locations-delete';
  import patchConnection from '../../apollo/mutations/patch-connection.gql';
  import userApiKeyUpdate from '../../apollo/mutations/user-api-key-update.gql';

  function isBefore(value) {
    let now = moment();
    let parsedValue = moment(new Date(value));

    let delta = now.diff(parsedValue);

    return delta > 0;
  }

  function relativeTime(value) {
    let parsedValue = moment(new Date(value));

    return moment(parsedValue).fromNow();
  }

  export default {
    data: function() {
      return {
        activeConnection: null
      }
    },
    methods: {
      getIcon: function(connection) {
        if (connection.browser) {
          return icons('browser', connection.browser.toLowerCase()) + ' fa-2x';
        }
        else {
          return icons('provider', connection.provider.name.toLowerCase()) + ' fa-2x';
        }
      },

      getUpdated: function(lastRun) {
        return (isBefore(lastRun) ? 'Updated ' : 'Updating ') + relativeTime(lastRun);
      },

      toggleActive: function(id) {
        this.$data.activeConnection = (this.$data.activeConnection === id) ? null : id;
      },

      showDisableModal: function(connection) {
        this.$modal.show(disableConnectionModal, {
          connection: connection
        }, {
          name: 'disableModal',
          height: 'auto',
          scrollable: true
        });
      },

      showAccountDeleteModal: function() {
        this.$modal.show(deleteAccountModal, {}, {
          height: 'auto',
          scrollable: true
        })
      },

      showConnectionDeleteModal: function(connection) {
        this.$modal.show(deleteConnectionModal, {
          connection: connection
        }, {
          height: 'auto',
          scrollable: true
        });
      },

      enableConnection: async function(connection) {
        await this.$apollo.mutate({
          mutation: patchConnection,
          variables: {
            id: connection.id,
            enabled: true
          }
        });
      },

      getConnectionReauthorization: async function(connection) {
        window.location.href = connection.auth.redirectUrl;
      },

      updatePermissions: _.debounce(async function(connection) {
        let sources = connection.provider.sources;

        let permissions = {};

        _.each(sources, function(source, name) {
          permissions[name] = false;
        });

        _.each(this.$store.state.permissions[connection.id], function(source) {
          if (typeof source === 'string') {
            permissions[source] = true;
          }
        });

        await this.$apollo.mutate({
          mutation: patchConnection,
          variables: {
            id: connection.id,
            permissions: permissions
          }
        });
      }, 1000),

      generateApiKey: async function() {
        let response = await this.$apollo.mutate({
          mutation: userApiKeyUpdate
        });

        this.$store.state.userOne = response.data.userApiKeyUpdate;
      },

      showLocationTrackingModal: async function() {
        this.$modal.show(locationTrackingModal, {}, {
          height: 'auto',
          scrollable: true
        });
      },

      showTrackedLocationsDeleteModal: async function() {
        this.$modal.show(trackedLocationsDeleteModal, {}, {
          height: 'auto',
          scrollable: true
        })
      }
    },

    mounted: async function() {
      let self = this;

      let connectionResult = await this.$apollo.query({
        query: connectionMany
      });

      let connectionUpdatedObserver = this.$apollo.subscribe({
        query: connectionUpdated,
      });

      let connectionDeletedObserver = this.$apollo.subscribe({
        query: connectionDeleted,
      });

      connectionUpdatedObserver.subscribe({
        next(data) {
          let newData = data.data.connectionUpdated;

          if (newData) {
            let id = newData.id;

            let clone = _.clone(self.$store.state.connectionMany);

            let index = _.findIndex(clone, function(item) {
              return item.id === id;
            });

            clone.splice(index, 1, newData);

            self.$store.state.connectionMany = clone;
          }
        }
      });

      connectionDeletedObserver.subscribe({
        next(data) {
          let newData = data.data.connectionDeleted;

          if (newData) {
            let id = newData.id;

            let clone = _.clone(self.$store.state.connectionMany);

            clone = clone.filter(item => item.id !== id);

            self.$store.state.connectionMany = clone;
          }
        }
      });

      let connections = connectionResult.data.connectionMany;

      _.each(connections, function(connection) {
        self.$store.state.permissions[connection.id] = _.map(connection.provider.sources, function(source, name) {
          return connection.permissions && connection.permissions.hasOwnProperty(name) && connection.permissions[name].enabled === true ? name : null;
        });
      });

      this.$store.state.connectionMany = connections;
    },
  }
</script>
