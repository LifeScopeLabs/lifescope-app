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
            <a href="/settings/locations">Locations</a>
          </div>

          <div>
            <a href="/settings/connections">Connections</a>
          </div>

          <div>
            <a href="/settings/authorized-apps">Authorized Apps</a>
          </div>

          <div>
            <a href="/settings/developer">Developer</a>
          </div>
        </div>
      </aside>

      <section class="flexbox flex-column flex-grow">
        <section id="account" v-if="$store.state.mode === 'account'">
			<div class="boxed-group">
				<div class="title">Color Theme</div>

				<div class="padded paragraphed">
					<no-ssr>
					  <toggle-button v-bind:width="60" v-bind:height="25" v-model="toggleValue" v-bind:sync="true" v-bind:labels="{ checked: 'Dark', unchecked: 'Light' }" v-bind:color="{ checked: '#9b9b9b', unchecked: '#242424' }" v-on:change="updateTheme"></toggle-button>
					</no-ssr>
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
        </section>
        <section id="locations" v-if="$store.state.mode === 'locations'">
          <div class="boxed-group">
            <div class="title">Browser Location Tracking</div>
            <div class="padded paragraphed">
              <div>Number of tracked Locations: {{ locationTrackedCount }}</div>
              <p>
                LifeScope can record your location when you visit LifeScope pages. This can greatly improve search results over time.
              </p>
              <div class="flex-mobile">
                <button v-if="$store.state.userOne.location_tracking_enabled === true" id="disable-location-tracking" class="primary mobile-flex-center" v-on:click.prevent="showLocationTrackingModal">Disable Location Tracking</button>
                <button v-if="$store.state.userOne.location_tracking_enabled !== true" id="enable-location-tracking" class="primary mobile-flex-center" v-on:click.prevent="showLocationTrackingModal">Enable Location Tracking</button>

                <span class="flex-grow"></span>

                <button class="danger delete mobile-flex-center" v-on:click.prevent="showTrackedLocationsDeleteModal">Delete Tracked Locations</button>
              </div>
            </div>
          </div>

          <div class="boxed-group">
            <div class="title">Upload Location History</div>
            <div class="padded paragraphed">
              <div>Number of uploaded Locations: {{ locationUploadedCount }}</div>
              <div>Location files awaiting processing: {{ locationFilesCount }}</div>
              <p>
                LifeScope can accept Location history from services such as Google. This can greatly improve the estimation of Events' Locations.
              </p>

              <div class="flex-mobile">
                <button class="primary mobile-flex-center" v-on:click="showLocationUploadModal">Upload Location Files</button>

                <span class="flex-grow"></span>

                <button class="danger delete mobile-flex-center" v-on:click.prevent="showUploadedLocationsDeleteModal">Delete Uploaded Locations</button>
              </div>
            </div>
          </div>
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
              <div v-if="connection.browser == null && connection.runnable !== false" class="last-run">
                <div v-if="connection.last_run != null" class="updates">
                  {{ getUpdated(connection.last_run) }}
                </div>
                <div v-else class="updates">
                  <div>Initial index in progress</div>
                  <span></span>
                  <i class="fas fa-spinner fa-spin fa-2x"></i>
                </div>
              </div>

              <i class="fas fa-caret-down expand-indicator"></i>
            </div>

            <form class="auto" v-on:submit.prevent="">
              <div class="padded paragraphed">
                <div v-if="connection.browser == null">
                  <div class="flexbox flex-x-center label">
                    <div>Name</div>
                    <i class="fas fa-check-circle flex-grow success-icon" data-for="name"
                       v-bind:data-namespace="connection.name"></i>
                  </div>
                  <div class="text-box shrink">
                    <input name="name" type="text" v-bind:value="connection.name" v-on:change="updateName(connection, $event)"/>
                  </div>
                </div>

                <div>
                  <div v-if="connection.browser == null" class="label">What would you like?</div>
                  <div v-else-if="connection.browser != null" class="label">The LifeScope Browser extension only tracks sites you approve. Adding or Removing Tracked sites can be done in the LifeScope Browser extension's options menu.</div>
                  <div>
                    <div v-for="permission, name in orderBy(connection.provider.sources, 'name')" class="paragraph ">
                      <div class="flexbox flex-x-center">
                        <label><input class="flag" type="checkbox" v-bind:value="permission.$key"
                                      v-model="$store.state.permissions[connection.id]" v-on:change="updatePermissions(connection)"/>
                          {{ permission.$value.name }}
                        </label>
                        <i class="fas fa-check-circle flex-grow success-icon" v-bind:data-for="name"
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
            <i class="fas fa-plus"></i>
          </a>
        </section>
        <section id="developer" v-if="$store.state.mode === 'developer'">
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
            <div class="title">OAuth2 Apps</div>

            <div class="padded paragraphed">
              <p>You can build apps on top of users' data via OAuth2.</p>
              <p>Please see <a href="https://lifescope.io/oauth2">the documentation</a> for more information.</p>

              <div class="mobile-flex-center">
                <button id="new-oauth-app" class="primary" v-on:click="initializeNewApp">Generate New OAuth App</button>
              </div>

              <div v-for="app in orderBy($data.oauthAppMany, 'name')" class="flexbox app" v-on:click="editApp(app.id)">
                  <div class="name">{{ app.name }}</div>
                  <div class="description">{{ app.description | shorten }}</div>
              </div>
            </div>
          </div>
        </section>
        <section id="app-create" v-if="$store.state.mode === 'app-create'">
          <div class="boxed-group oauth-app">
            <div class="title">New OAuth2 App</div>

            <div class="padded paragraphed form">
              <div class="flexbox flex-column">
                <div class="flexbox">
                  <div class="title">Name</div>
                  <div class="error" v-if="$store.state.app.name.error === true">This app must have a name</div>
                </div>
                <div class="text-box shrink">
                  <input type="text" title="name" v-model="$store.state.app.name.value" placeholder="Enter app name">
                </div>
              </div>

              <div class="flexbox flex-column">
                <div class="flexbox">
                  <div class="title">Description</div>
                  <div class="error" v-if="$store.state.app.description.error === true">This app must have a description</div>
                </div>
                <textarea v-model="$store.state.app.description.value" class="shrink"></textarea>
              </div>

              <div class="flexbox flex-column">
                <div class="flexbox">
                  <div class="title">Homepage URL</div>
                  <div class="error" v-if="$store.state.app.homepage.error === true">This app must have a valid homepage URL</div>
                </div>
                <div class="text-box shrink">
                  <input type="text" title="homepage" v-model="$store.state.app.homepage.value" placeholder="Enter app homepage URL">
                </div>
              </div>

              <div class="flexbox flex-column">
                <div class="flexbox">
                  <div class="title">Privacy Policy URL</div>
                  <div class="error" v-if="$store.state.app.privacyPolicy.error === true">This app must have a valid privacy policy URL</div>
                </div>
                <div class="text-box shrink">
                  <input type="text" title="privacy-policy" v-model="$store.state.app.privacyPolicy.value" placeholder="Enter app privacy policy URL">
                </div>
              </div>

              <button class="primary" v-on:click="createNewApp">Create App</button>
            </div>
          </div>
        </section>
        <section id="app-edit" v-if="$store.state.mode === 'app-edit'">
          <div class="boxed-group oauth-app">
            <div class="title">{{ $store.state.app.name.value }}</div>

            <div class="padded paragraphed form">
              <div class="client-keys">
                <div class="flexbox flex-column">
                  <div class="title">Client ID</div>
                  <div>{{ $store.state.app.clientId.value }}</div>
                </div>

                <div class="flexbox flex-column">
                  <div class="title">Client Secret</div>
                  <button v-if="$store.state.app.clientSecret.value == null" v-on:click="showClientSecret">Show</button>
                  <div v-else>
                    <div>{{ $store.state.app.clientSecret.value }}</div>
                    <div class="flexbox flex-end">
                      <button class="danger" v-on:click="showSecretResetModal">Generate new secret</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="revoke-tokens">
                <button class="danger" v-on:click="showTokenRevokeModal">Revoke user access tokens</button>
              </div>

				<div class="redirects">
                  <div class="title">Redirect URLS</div>

					<div v-for="redirect in $store.state.app.redirects.value" class="flexbox flex-x-center redirect">
						<div>{{ redirect }}</div>
						<i class="delete fas fa-times" v-on:click="removeRedirect(redirect)"></i>
					</div>

					<div class="flexbox flex-x-center new-redirect">
                        <div class="text-box shrink">
                          <input type="text" placeholder="https://yourapp.com/redirect_path" v-model="$data.tempRedirect.value">
                        </div>
						<i class="add fas fa-plus" v-on:click="addRedirect"></i>
                        <div class="error" v-if="$data.tempRedirect.error === true">Invalid URL</div>
					</div>
				</div>

              <div class="flexbox flex-column">
                <div class="flexbox">
                  <div class="title">Name</div>
                  <div class="error" v-if="$store.state.app.name.error === true">This app must have a name</div>
                </div>
                <div class="text-box shrink">
                  <input type="text" title="name" v-model="$store.state.app.name.value" placeholder="Enter app name">
                </div>
              </div>

              <div class="flexbox flex-column">
                <div class="flexbox">
                  <div class="title">Description</div>
                  <div class="error" v-if="$store.state.app.description.error === true">This app must have a description</div>
                </div>
                <textarea v-model="$store.state.app.description.value"></textarea>
              </div>

              <div class="flexbox flex-column">
                <div class="flexbox">
                  <div class="title">Homepage URL</div>
                  <div class="error" v-if="$store.state.app.homepage.error === true">This app must have a valid homepage URL</div>
                </div>
                <div class="text-box shrink">
                  <input type="text" title="homepage" v-model="$store.state.app.homepage.value" placeholder="Enter app homepage URL">
                </div>
              </div>

              <div class="flexbox flex-column">
                <div class="flexbox">
                  <div class="title">Privacy Policy URL</div>
                  <div class="error" v-if="$store.state.app.privacyPolicy.error === true">This app must have a valid privacy policy URL</div>
                </div>
                <div class="text-box shrink">
                  <input type="text" title="privacy-policy" v-model="$store.state.app.privacyPolicy.value" placeholder="Enter app privacy policy URL">
                </div>
              </div>

              <div class="mobile-buttons flexbox flex-space-between">
                <button class="primary left-button" v-on:click="updateApp">Save App</button>
                <button class="danger" v-on:click="showAppDeleteModal">Delete App</button>
              </div>
            </div>
          </div>
        </section>
        <section id="authorized-apps" v-if="$store.state.mode === 'authorized-apps'">
          <div class="boxed-group">
            <div class="title">Authorized apps</div>

            <div class="padded paragraphed">
              <p>Below are all of the apps which you have granted access to your LifeScope data.</p>
              <p>You can revoke access to any of them by clicking on the 'Revoke Access' button.</p>

              <div v-for="app in orderBy($store.state.oauthAppAuthorizedMany, 'name')" class="app">
                <div class="flexbox">
                  <div class="bold name">{{ app.name }}</div>
                  <div class="description">{{ app.description | shorten }}</div>
                </div>
                <div class="flexbox flex-column">
                  <div class="title bold">Permissions</div>
                  <div v-for="scope in app.scopes">{{ scope }}</div>
                </div>
                <div>
                  <button class="danger" v-on:click="showAppRevokeModal(app)">Revoke Access</button>
                </div>
              </div>
            </div>
          </div>
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
  import locationUploadModal from '../modals/location-upload';
  import locationFileCount from '../../apollo/queries/location-file-count.gql';
  import locationTrackedCount from '../../apollo/queries/location-tracked-count.gql';
  import locationUploadedCount from '../../apollo/queries/location-uploaded-count.gql';
  import oauthAppAuthorizedMany from '../../apollo/queries/oauth-app-authorized-many.gql';
  import oauthAppGetClientSecret from '../../apollo/queries/oauth-app-get-client-secret.gql';
  import oauthAppInitialize from '../../apollo/mutations/oauth-app-initialize.gql';
  import oauthAppMany from '../../apollo/queries/oauth-app-many.gql';
  import oauthAppOne from '../../apollo/queries/oauth-app-one.gql';
  import oauthAppRevoke from '../modals/oauth-app-revoke';
  import oauthAppUpdate from '../../apollo/mutations/oauth-app-update.gql';
  import oauthAppDeleteModal from '../modals/oauth-app-delete';
  import oauthSecretResetModal from '../modals/client-secret-reset';
  import oauthTokenRevokeModal from '../modals/oauth-tokens-delete';
  import trackedLocationsDeleteModal from '../modals/tracked-locations-delete';
  import uploadedLocationsDeleteModal from '../modals/uploaded-locations-delete';
  import userThemeUpdate from '../../apollo/mutations/user-theme-update.gql';
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

  let urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

  export default {
    data: function() {
      return {
        activeConnection: null,
        locationFilesCount: null,
        locationTrackedCount: null,
        locationUploadedCount: null,
	  	toggleValue: this.$store.getters.theme === 'dark' ? true : false,

        oauthAppMany: [],
        tempRedirect: {
        	value: null,
            error: false
        }
      }
    },

    filters: {
    	shorten: function(value) {
    		return value.length > 20 ? value.slice(0, 20) + '...' : value;
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

      updateName: async function(connection, e) {
      	if (e.srcElement && e.srcElement.value) {
	        let result = await this.$apollo.mutate({
		        mutation: patchConnection,
		        variables: {
			        id: connection.id,
			        name: e.srcElement.value
		        }
	        });
        }
      },

      updateTheme: async function() {
        let response = await this.$apollo.mutate({
            mutation: userThemeUpdate,
            variables: {
            	theme: this.$store.getters.theme === 'light' ? 'dark' : 'light'
            }
        });

        this.$store.state.user = response.data.userThemeUpdate;
        this.$store.state.userOne = response.data.userThemeUpdate;
      },

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
        });
      },

      showLocationUploadModal: async function() {
      	this.$modal.show(locationUploadModal, {}, {
      		height: 'auto',
            scrollable: true,
        });
      },

      showUploadedLocationsDeleteModal: async function() {
          this.$modal.show(uploadedLocationsDeleteModal, {}, {
              height: 'auto',
              scrollable: true,
          });
      },

      initializeNewApp: async function() {
        window.location.href = '/settings/apps/create';
      },

      createNewApp: async function() {
      	let error = false;

      	this.$store.state.app.name.error = false;
      	this.$store.state.app.description.error = false;
      	this.$store.state.app.homepage.error = false;
      	this.$store.state.app.privacyPolicy.error = false;

      	if (this.$store.state.app.name.value == null || this.$store.state.app.name.value.length === 0) {
      		this.$store.state.app.name.error = true;
      		error = true;
        }

        if (this.$store.state.app.description.value == null || this.$store.state.app.description.value.length === 0) {
            this.$store.state.app.description.error = true;
            error = true;
        }

        if (urlRegex.test(this.$store.state.app.homepage.value) !== true) {
            this.$store.state.app.homepage.error = true;
            error = true;
        }

        if (urlRegex.test(this.$store.state.app.privacyPolicy.value) !== true) {
            this.$store.state.app.privacyPolicy.error = true;
            error = true;
        }

        if (error === false) {
      		let result = await this.$apollo.mutate({
                mutation: oauthAppInitialize,
                variables: {
                	name: this.$store.state.app.name.value,
                    description: this.$store.state.app.description.value,
                    homepage_url: this.$store.state.app.homepage.value,
                    privacy_policy_url: this.$store.state.app.privacyPolicy.value
                }
            });

      		window.location.href = '/settings/apps/' + result.data.oauthAppInitialize.id;
        }
      },

      editApp: async function(id) {
      	window.location.href = '/settings/apps/' + id
      },

      updateApp: async function() {
	      let error = false;

	      this.$store.state.app.name.error = false;
	      this.$store.state.app.description.error = false;
	      this.$store.state.app.homepage.error = false;
	      this.$store.state.app.privacyPolicy.error = false;

	      if (this.$store.state.app.name.value == null || this.$store.state.app.name.value.length === 0) {
		      this.$store.state.app.name.error = true;
		      error = true;
	      }

	      if (this.$store.state.app.description.value == null || this.$store.state.app.description.value.length === 0) {
		      this.$store.state.app.description.error = true;
		      error = true;
	      }

	      if (urlRegex.test(this.$store.state.app.homepage.value) !== true) {
		      this.$store.state.app.homepage.error = true;
		      error = true;
	      }

	      if (urlRegex.test(this.$store.state.app.privacyPolicy.value) !== true) {
		      this.$store.state.app.privacyPolicy.error = true;
		      error = true;
	      }

	      if (error === false) {
		      await this.$apollo.mutate({
			      mutation: oauthAppUpdate,
			      variables: {
			      	  id: this.$store.state.app.id,
				      name: this.$store.state.app.name.value,
				      description: this.$store.state.app.description.value,
				      homepage_url: this.$store.state.app.homepage.value,
				      privacy_policy_url: this.$store.state.app.privacyPolicy.value,
                      redirect_uris: this.$store.state.app.redirects.value
			      }
		      });

		      window.location.href = '/settings/developer';
	      }
      },

      showClientSecret: async function() {
      	let self = this;

      	let result = await this.$apollo.query({
            query: oauthAppGetClientSecret,
            variables: {
              id: self.$store.state.app.id
            }
        });

      	this.$store.state.app.clientSecret.value = result.data.oauthAppOne.client_secret;
      },

      showSecretResetModal: async function() {
	      this.$modal.show(oauthSecretResetModal, {}, {
		      height: 'auto',
		      scrollable: true
	      });
      },

      showTokenRevokeModal: async function() {
          this.$modal.show(oauthTokenRevokeModal, {}, {
              height: 'auto',
              scrollable: true
          });
      },

	    showAppRevokeModal: async function(app) {
		    this.$modal.show(oauthAppRevoke, {
		    	app: app
            }, {
			    height: 'auto',
			    scrollable: true
		    });
	    },

      showAppDeleteModal: async function() {
	      this.$modal.show(oauthAppDeleteModal, {}, {
		      height: 'auto',
		      scrollable: true
	      });
      },

        addRedirect: async function() {
      	this.$data.tempRedirect.error = false;

      	  let newRedirect = this.$data.tempRedirect.value;
            let valid = urlRegex.test(newRedirect);

            if (valid === true) {
            	this.$store.state.app.redirects.value = _.uniq(this.$store.state.app.redirects.value.concat([newRedirect]));
            	this.$data.tempRedirect.value = null;
            }
            else {
            	this.$data.tempRedirect.error = true;
            }
        },

        removeRedirect: async function(removed) {
          this.$store.state.app.redirects.value = _.remove(this.$store.state.app.redirects.value, function(redirect) {
          	return redirect !== removed;
          });
        }
    },

    mounted: async function() {
      let self = this;

      let connectionResult = await this.$apollo.query({
        query: connectionMany
      });

      if (self.$store.state.mode === 'locations') {
	      let locationFilesResult = await this.$apollo.query({
		      query: locationFileCount
	      });

	      let locationTrackedResult = await this.$apollo.query({
		      query: locationTrackedCount
	      });

	      let locationUploadedResult = await this.$apollo.query({
		      query: locationUploadedCount
	      });

	      this.$data.locationFilesCount = locationFilesResult.data.locationFileCount;
	      this.$data.locationTrackedCount = locationTrackedResult.data.locationCount;
	      this.$data.locationUploadedCount = locationUploadedResult.data.locationCount;
      }

      let connectionUpdatedObserver = this.$apollo.subscribe({
        query: connectionUpdated,
      });

      let connectionDeletedObserver = this.$apollo.subscribe({
        query: connectionDeleted,
      });

      if (this.$store.state.mode === 'developer') {
      	let oauthAppResult = await this.$apollo.query({
            query: oauthAppMany
        });

      	self.$data.oauthAppMany = oauthAppResult.data.oauthAppMany;
      }

      if (this.$store.state.mode === 'app-edit') {
      	let appResult = await this.$apollo.query({
            query: oauthAppOne,
            variables: {
            	id: self.$route.params.id
            }
        });

      	let app = appResult.data.oauthAppOne;

      	self.$store.state.app.id = app.id;
      	self.$store.state.app.name.value = app.name;
      	self.$store.state.app.description.value = app.description;
      	self.$store.state.app.homepage.value = app.homepage_url;
      	self.$store.state.app.privacyPolicy.value = app.privacy_policy_url;
      	self.$store.state.app.redirects.value = app.redirect_uris || [];
      	self.$store.state.app.clientId.value = app.client_id;
      }

      if (this.$store.state.mode === 'authorized-apps') {
      	let authorizedAppResult = await this.$apollo.query({
            query: oauthAppAuthorizedMany
        });

      	self.$store.state.oauthAppAuthorizedMany = authorizedAppResult.data.oauthAppAuthorizedMany;
      }

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
