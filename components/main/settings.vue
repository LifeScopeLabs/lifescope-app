<template>
  <main>
    <section>
      <aside id="left">
        <div class="boxed-group settings-menu">
          <div>Settings</div>
          
          <div>
            <a href="/settings/connections">Connections</a>
          </div>

          <div>
            <a href="/settings/account">Account</a>
          </div>

          <div>
            <a href="/settings/people">People</a>
          </div>

          <div>
            <a href="/settings/locations">Locations</a>
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
            <div class="boxed-group person">
              <div class="title">
                Profile
                <i v-bind:class="{ shown: $data.profileUpdated === true }" class="fal fa-check-circle flex-grow success-icon"></i>
              </div>

              <div class="padded paragraphed form">

                <div class="flexbox flex-column">
                  <div class="title">Avatar</div>
                  <div v-if="this.$store.state.person.first_name != null || this.$store.state.person.last_name != null || this.$store.state.person.avatar_url != null" class="avatar" v-bind:class="{ 'default-only': hasAvatars() !== true }">
                    <i class="fal fa-2x fa-chevron-left" v-on:click="changeAvatar(-1)"></i>
                    <img v-if="this.$store.state.person.avatar_url != null && this.$store.state.person.avatar_url.length > 0" v-bind:src="this.$store.state.person.avatar_url">
                    <div class="default" v-else-if="this.$store.state.person.avatar_url == null || this.$store.state.person.avatar_url.length === 0" v-bind:style="{ 'background-color': defaultColor($store.state.person) }">{{ defaultLetter($store.state.person) }}</div>
                    <i class="fal fa-2x fa-chevron-right" v-on:click="changeAvatar(1)"></i>
                  </div>
                </div>

                <div class="flexbox flex-column names">
                  <div class="flexbox flex-column">
                    <div class="flexbox">
                      <div class="title">First Name</div>
                    </div>
                    <div class="text-box shrink">
                      <input type="text" title="name" v-model="$store.state.person.first_name" placeholder="Enter first name">
                    </div>
                  </div>
                  <div class="flexbox flex-column">
                    <div class="flexbox">
                      <div class="title">Middle Name</div>
                    </div>
                    <div class="text-box shrink">
                      <input type="text" title="name" v-model="$store.state.person.middle_name" placeholder="Enter middle name">
                    </div>
                  </div>
                  <div class="flexbox flex-column">
                    <div class="flexbox">
                      <div class="title">Last Name</div>
                    </div>
                    <div class="text-box shrink">
                      <input type="text" title="name" v-model="$store.state.person.last_name" placeholder="Enter last name">
                    </div>
                  </div>
                </div>

                <div class="flex-mobile">
                  <button class="primary" v-on:click="updatePerson">Update Profile</button>
                </div>

                <div class="error" v-if="$data.error === true">There was an error updating your profile. If this issue persists, please contact support.</div>
              </div>
            </div>

			<div class="boxed-group">
				<div class="title">Color Theme</div>
				<div class="padded paragraphed">
          <p>Turn the lights off.</p>
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
            <div class="title">Import Location History</div>
            <div class="padded paragraphed">
              <div>Number of uploaded Locations: {{ locationUploadedCount }}</div>
              <div>Location files processing: {{ locationFilesCount }}</div>
              <p>
                LifeScope can import Location history from GeoJSON files. Export location data from Google, Facebook, and other GPS data.
              </p>

              <div class="flex-mobile">
                <button class="primary mobile-flex-center" v-on:click="showLocationUploadModal">Upload Location Files</button>

                <span class="flex-grow"></span>

                <button class="danger delete mobile-flex-center" v-on:click.prevent="showUploadedLocationsDeleteModal">Delete Import Locations</button>
              </div>
            </div>
          </div>
        </section>
        <section id="connections" v-if="$store.state.mode === 'connections'">
          <div v-for="connection in orderBy($store.state.connectionMany, 'provider.name')"
               v-bind:class="{active : $data.activeConnection === connection.id}" class="connection boxed-group"
               v-bind:data-id="connection.id" v-bind:data-provider-id="connection.provider.id">
            <div class="flexbox flex-x-center flex-space-between title" v-on:click="toggleActive(connection.id)">
              <div class="icon-name">
                <i v-bind:class="getIcon(connection)"></i>
                <div class="flex-grow name">{{ connection.name }}</div>
                <div class="disabled"></div>
              </div>
              <div v-if="connection.browser == null && connection.runnable !== false" class="last-run">
                <div v-if="connection.last_run != null" class="updates">
                  {{ getUpdated(connection.last_run) }}
                </div>
                <div v-else-if="connection.status === 'failed'" class="updates">
                  <div>Issue with Initial Index</div>
                </div>
                <div v-else class="updates">
                  <div>Initial Index in Progress</div>
                  <span></span>
                  <i class="fal fa-spinner fa-spin"></i>
                </div>
              </div>

              <i class="fal fa-caret-down"></i>
            </div>

            <form class="auto" v-on:submit.prevent="">
              <div class="padded paragraphed">
                <div v-if="connection.browser == null">
                  <div class="flexbox flex-x-center label">
                    <div>Name</div>
                    <i class="fal fa-check-circle flex-grow success-icon" data-for="name"
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
                        <i class="fal fa-check-circle flex-grow success-icon" v-bind:data-for="name"
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

                <div v-if="(connection.provider.auth_type === 'oauth2' && connection.auth.status.authorized === true && oldConnection(connection) === true) || (connection.status === 'failed')"
                     class="reauthorize">
                  <button class="primary" v-on:click="forceReauthorization(connection)">Reauthorize</button>
                  <div>It looks like we haven't been able to properly fetch data for this Connection in some time. Please try reauthorizing it by clicking the button above.</div>
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
            <i class="fal fa-3x fa-plus"></i>
          </a>
        </section>
        <section id="developer" v-if="$store.state.mode === 'developer'">
          <div class="boxed-group">
            <div class="title">Developer</div>

            <div class="padded paragraphed">
              <p>
                LifeScope is an open data platform you can build on. Learn more by reading our <a href="https://lifescope.io/platform">Documentation</a>.
              </p>
              <p>
                Explore the LifeScope API using our <a href="https://api.lifescope.io/gql-p">GraphQL Playground IDE</a> or <a href="https://api.lifescope.io/gql-i">GraphiQL</a>.
              </p>
              <p>
                The LifeScope GraphQL API can be accessed at (https://api.lifescope.io/gql). Add the Authorization header with your API key. Key: 'Authorization' Value 'Bearer: &lt;your_api_key&gt;'.
              </p>
              <div class="flexbox">
                <p style="margin-right:0.5em;">Your Personal LifeScope API key is:</p>
                <span style="word-break: break-all">{{ $store.state.userOne.api_key_string }}</span>
              </div>

              <div class="mobile-flex-center">
                <button id="new-api-key" class="danger" v-on:click="generateApiKey">New Key</button>
              </div>
            </div>
          </div>

          <div class="boxed-group">
            <div class="title">Platform Apps</div>

            <div class="padded paragraphed">
              <p>You can build apps on top of the LifeScope Platform.</p>
              <p>Please see the <a href="https://lifescope.io/platform">Developer Documentation</a>.</p>

              <div class="mobile-flex-center">
                <button id="new-oauth-app" class="primary" v-on:click="initializeNewApp">New App</button>
              </div>

              <div v-for="app in orderBy($data.oauthAppMany, 'name')" class="flexbox app" v-on:click="editApp(app.id)">
                  <div class="name">{{ app.name }}</div>
                  <div class="description">{{ app.description | shorten }}</div>
              </div>
            </div>
          </div>
        </section>
        <section id="people" v-if="$store.state.mode === 'people'">
          <div class="boxed-group">
            <div class="title">People</div>

            <div class="padded paragraphed">
              <p>Manage People in your life easily in one place. Add a record for a person and associate all of their contacts a single Person.</p>

              <div class="mobile-flex-center">
                <button id="new-person" class="primary" v-on:click="initializeNewPerson">Add Person</button>
              </div>

              <div class="flexbox flex-column">
                <div v-for="person in orderBy($store.state.personMany, 'first_name')" class="flexbox person" v-on:click="editPerson(person.id)">
                  <div class="flexbox flex-column">
                    <div class="flexbox top-line">
                      <div class="avatar">
                        <img v-if="person.avatar_url != null && person.avatar_url.length > 0" v-bind:src="person.avatar_url">
                        <div class="default" v-else-if="person.avatar_url == null || person.avatar_url.length === 0" v-bind:style="{ 'background-color': defaultColor(person) }">{{ defaultLetter(person) }}</div>
                      </div>
                      <div class="name">{{ person.first_name }} {{ person.middle_name }} {{ person.last_name }}</div>
                    </div>
                    <div class="contacts" v-if="person.hydratedContacts.length > 0">{{ assembleContacts(person.hydratedContacts) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="app-create" v-if="$store.state.mode === 'app-create'">
          <div class="boxed-group oauth-app">
            <div class="title">Create Platform App</div>

            <div class="padded paragraphed form">
              <div class="flexbox flex-column">
                <div class="flexbox">
                  <div class="title">App Name</div>
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
                      <button class="danger" v-on:click="showSecretResetModal">Generate Secret</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="revoke-tokens">
                <button class="danger" v-on:click="showTokenRevokeModal">Revoke User Access Tokens</button>
              </div>

				<div class="redirects">
                  <div class="title">Redirect URLS</div>

					<div v-for="redirect in $store.state.app.redirects.value" class="flexbox flex-x-center redirect">
						<div>{{ redirect }}</div>
						<i class="delete fal fa-times" v-on:click="removeRedirect(redirect)"></i>
					</div>

					<div class="flexbox flex-x-center new-redirect">
                        <div class="text-box shrink">
                          <input type="text" placeholder="https://yourapp.com/redirect_path" v-model="$data.tempRedirect.value">
                        </div>
						<i class="add fal fa-plus" v-on:click="addRedirect"></i>
                        <div class="error" v-if="$data.tempRedirect.error === true">Invalid URL</div>
					</div>
				</div>

              <div class="flexbox flex-column">
                <div class="flexbox">
                  <div class="title">App Name</div>
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
            <div class="title">Authorized Apps</div>

            <div class="padded paragraphed">
              <p>Apps granted access to your LifeScope data:</p>

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
        <section id="people-create" v-if="$store.state.mode === 'people-create'">
          <div class="boxed-group person">
            <div class="title">New Person</div>

            <div class="padded paragraphed form">
              <div class="flexbox flex-column names">
                <div class="flexbox flex-column">
                <div class="flexbox">
                    <div class="title">First Name</div>
                  </div>
                  <div class="text-box shrink">
                    <input type="text" title="name" v-model="$store.state.person.first_name" placeholder="Enter first name">
                  </div>
                </div>
                <div class="flexbox flex-column">
                  <div class="flexbox">
                    <div class="title">Middle Name</div>
                  </div>
                  <div class="text-box shrink">
                    <input type="text" title="name" v-model="$store.state.person.middle_name" placeholder="Enter middle name">
                  </div>
                </div>
                <div class="flexbox flex-column">
                  <div class="flexbox">
                    <div class="title">Last Name</div>
                  </div>
                  <div class="text-box shrink">
                    <input type="text" title="name" v-model="$store.state.person.last_name" placeholder="Enter last name">
                  </div>
                </div>
              </div>

              <div class="flexbox flex-column">
                <div class="title">Contacts</div>
                <div class="flexbox flex-column">
                  <div v-for="contact in $store.state.person.hydratedContacts" class="flexbox hydrated-contact">
                    <div class="flexbox flex-grow">
                      <i v-if="contact.hydratedConnection" v-bind:class="getIcon(contact.hydratedConnection)"></i>
                      <img v-if="contact.avatar_url && contact.avatar_url.length > 0" v-bind:src="contact.avatar_url">
                      <div v-if="contact.name != null">{{ contact.name }}</div>
                      <div>{{ contact.handle }}</div>
                    </div>
                    <i class="delete fal fa-times" v-on:click="removeContact(contact)"></i>
                  </div>
                </div>
                <div class="contact-search">
                  <div class="text-box">
                    <input type="text" v-bind:value="$data.query" placeholder="Name or Handle" v-on:input="updateSearch">
                  </div>
                  <div class="flexbox flex-column flex-grow">
                    <div class="flexbox flex-column flex-grow temp-contacts">
                      <div class="scroller">
                        <div v-for="contact in $store.state.objects.contacts" class="flexbox flex-grow temp-contact" v-on:click="addContact(contact)">
                          <i v-if="contact.hydratedConnection" v-bind:class="getIcon(contact.hydratedConnection)"></i>
                          <img v-if="contact.avatar_url && contact.avatar_url.length > 0" v-bind:src="contact.avatar_url">
                          <div v-if="contact.name != null">{{ contact.name }}</div>
                          <div>{{ contact.handle }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="flexbox page-buttons" v-bind:class="{ 'first-page': $data.unpersonedContactOffset === 0, 'last-page': $store.state.objects.contacts.length < $data.unpersonedContactLimit }">
                      <i class="fas fa-chevron-left" v-on:click="pageUnpersonedContacts(-1)"></i>
                      <i class="fas fa-chevron-right" v-on:click="pageUnpersonedContacts(1)"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="this.$store.state.person.first_name != null || this.$store.state.person.last_name != null || this.$store.state.person.avatar_url != null" class="flexbox flex-column">
                <div class="title">Avatar</div>

                <div class="avatar" v-bind:class="{ 'default-only': hasAvatars() !== true }">
                  
                  <i class="fal fa-chevron-left" v-on:click="changeAvatar(-1)"></i>
                  <img v-if="this.$store.state.person.avatar_url != null && this.$store.state.person.avatar_url.length > 0" v-bind:src="this.$store.state.person.avatar_url">
                  <div class="default" v-else-if="this.$store.state.person.avatar_url == null || this.$store.state.person.avatar_url.length === 0" v-bind:style="{ 'background-color': defaultColor($store.state.person) }">{{ defaultLetter($store.state.person) }}</div>
                  <i class="fal fa-chevron-right" v-on:click="changeAvatar(1)"></i>
                </div>
              </div>

              <div class="flex-mobile">
                <button class="primary" v-on:click="createNewPerson">Create Person</button>
                <div class="error" v-if="$data.error === true">There was an error creating this Person. If this issue persists, please contact support.</div>

                <span class="flex-grow"></span>

                <button v-on:click.prevent="cancelEdit">Cancel</button>
              </div>
            </div>
          </div>
        </section>
        <section id="people-edit" v-if="$store.state.mode === 'people-edit'">
          <div class="boxed-group person">
            <div>Update Person</div>

            <div class="padded paragraphed form">
              <div class="flexbox flex-column names">
                <div class="flexbox flex-column">
                  <div class="flexbox">
                    <div class="title">First Name</div>
                  </div>
                  <div class="text-box shrink">
                    <input type="text" title="name" v-model="$store.state.person.first_name" placeholder="Enter first name">
                  </div>
                </div>
                <div class="flexbox flex-column">
                  <div class="flexbox">
                    <div class="title">Middle Name</div>
                  </div>
                  <div class="text-box shrink">
                    <input type="text" title="name" v-model="$store.state.person.middle_name" placeholder="Enter middle name">
                  </div>
                </div>
                <div class="flexbox flex-column">
                  <div class="flexbox">
                    <div class="title">Last Name</div>
                  </div>
                  <div class="text-box shrink">
                    <input type="text" title="name" v-model="$store.state.person.last_name" placeholder="Enter last name">
                  </div>
                </div>
              </div>

              <div class="flexbox flex-column">
                <div class="title">Contacts</div>
                <div class="flexbox flex-column">
                  <div v-for="contact in $store.state.person.hydratedContacts" class="flexbox hydrated-contact">
                    <div class="flexbox flex-grow">
                      <i v-if="contact.hydratedConnection" v-bind:class="getIcon(contact.hydratedConnection)"></i>
                      <img v-if="contact.avatar_url && contact.avatar_url.length > 0" v-bind:src="contact.avatar_url">
                      <div v-if="contact.name != null">{{ contact.name }}</div>
                      <div>{{ contact.handle }}</div>
                    </div>
                    <i class="delete fal fa-times" v-on:click="removeContact(contact)"></i>
                  </div>
                </div>
                <div class="contact-search">
                  <div class="text-box">
                    <input type="text" v-bind:value="$data.query" placeholder="Name or Handle" v-on:input="updateSearch">
                  </div>
                  <div class="flexbox flex-column flex-grow">
                    <div class="flexbox flex-column flex-grow temp-contacts">
                      <div class="scroller">
                        <div v-for="contact in $store.state.objects.contacts" class="flexbox flex-grow temp-contact" v-on:click="addContact(contact)">
                          <i v-if="contact.hydratedConnection" v-bind:class="getIcon(contact.hydratedConnection)"></i>
                          <img v-if="contact.avatar_url && contact.avatar_url.length > 0" v-bind:src="contact.avatar_url">
                          <div v-if="contact.name != null">{{ contact.name }}</div>
                          <div>{{ contact.handle }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="flexbox page-buttons" v-bind:class="{ 'first-page': $data.unpersonedContactOffset === 0, 'last-page': $store.state.objects.contacts.length < $data.unpersonedContactLimit }">
                      <i class="fas fa-chevron-left" v-on:click="pageUnpersonedContacts(-1)"></i>
                      <i class="fas fa-chevron-right" v-on:click="pageUnpersonedContacts(1)"></i>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flexbox flex-column">
                <div v-if="this.$store.state.person.first_name != null || this.$store.state.person.last_name != null || this.$store.state.person.avatar_url != null" class="avatar" v-bind:class="{ 'default-only': hasAvatars() !== true }">                
                  <div class="title">Avatar</div>
                  <i class="fal fa-chevron-left" v-on:click="changeAvatar(-1)"></i>
                  <img v-if="this.$store.state.person.avatar_url != null && this.$store.state.person.avatar_url.length > 0" v-bind:src="this.$store.state.person.avatar_url">
                  <div class="default" v-else-if="this.$store.state.person.avatar_url == null || this.$store.state.person.avatar_url.length === 0" v-bind:style="{ 'background-color': defaultColor($store.state.person) }">{{ defaultLetter($store.state.person) }}</div>
                  <i class="fal fa-chevron-right" v-on:click="changeAvatar(1)"></i>
                </div>
              </div>

              <div class="flex-mobile">
                <button class="primary" v-on:click="updatePerson">Update Person</button>

                <span class="flex-grow"></span>

                <button v-on:click.prevent="cancelEdit">Cancel</button>

                <span class="flex-grow"></span>

                <button class="danger delete" v-on:click.prevent="showDeletePersonModal">Delete Person</button>
              </div>

              <div class="error" v-if="$data.error === true">There was an error updating this Person. If this issue persists, please contact support.</div>
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
  import contactUnpersoned from '../../apollo/queries/contact-unpersoned.gql';
  import { defaultColor, defaultLetter } from '../../lib/util/default-icon';
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
  import personCreate from '../../apollo/mutations/person-create.gql';
  import personDeleteModal from '../modals/person-delete';
  import personMany from '../../apollo/queries/person-many.gql';
  import personOne from '../../apollo/queries/person-one.gql';
  import personUpdate from '../../apollo/mutations/person-update.gql';
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
        },

        query: '',

        error: false,

        profileUpdated: false,

        unpersonedContactOffset: 0,
        unpersonedContactLimit: 20
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
          return icons('browser', connection.browser.toLowerCase());
        }
        else {
          return icons('provider', connection.provider.name.toLowerCase());
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

      showDeletePersonModal: function() {
          this.$modal.show(personDeleteModal, {}, {
              height: 'auto',
              scrollable: true
          })
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

      initializeNewPerson: async function() {
          window.location.href = '/settings/people/create';
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

      editPerson: async function(id) {
          window.location.href = '/settings/people/' + id
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
        },

        updateSearch: _.debounce(async function(e) {
          this.$data.query = e.target.value;

          this.runUnpersonedContactSearch(e.target.value, true)
        }, 1000),

        pageUnpersonedContacts: async function(direction) {
      	  if (direction === -1) {
      	  	if (this.$data.unpersonedContactOffset > 0) {
		        this.runUnpersonedContactSearch(this.$data.query, false, 'dec');
	        }
          }
          else if (direction === 1) {
      	  	if (this.$store.state.objects.contacts.length === this.$data.unpersonedContactLimit) {
		        this.runUnpersonedContactSearch(this.$data.query, false, 'inc');
	        }
          }
        },

        runUnpersonedContactSearch: async function (q, newSearch, incOrDec) {
	        let self = this;

	        if (newSearch === true) {
		        this.$data.unpersonedContactOffset = 0;
	        }
	        else {
		        this.$data.unpersonedContactOffset = incOrDec === 'inc' ? this.$data.unpersonedContactOffset + this.$data.unpersonedContactLimit : this.$data.unpersonedContactOffset - this.$data.unpersonedContactLimit;
	        }

	        let results = await this.$apollo.query({
		        query: contactUnpersoned,
		        variables: {
			        q: q,
			        limit: this.$data.unpersonedContactLimit,
			        offset: this.$data.unpersonedContactOffset
		        }
	        });

	        let data = results.data.contactUnpersoned;

	        let stripped = _.filter(data, function(item) {
		        return self.$store.state.person.contact_id_strings.indexOf(item.id) < 0;
	        });

	        this.$store.state.objects.contacts = stripped;
        },

        addContact: async function(contact) {
      	  let clonedPerson = _.cloneDeep(this.$store.state.person);

      	  clonedPerson.hydratedContacts.push(contact);
      	  clonedPerson.contact_id_strings.push(contact.id);

      	  this.$store.state.person = clonedPerson;

      	  _.remove(this.$store.state.objects.contacts, function(objContact) {
      	  	return contact.id === objContact.id;
          });

      	  if (contact.avatar_url) {
            this.$store.state.person.available_avatars = _.uniq(_.concat(this.$store.state.person.available_avatars, contact.avatar_url));

      	  	if (this.$store.state.person.avatar_url == null || this.$store.state.person.avatar_url.length === 0) {
		        this.$store.state.person.avatar_url = contact.avatar_url;
		        this.$store.state.person.avatar_index = 0;
	        }
          }
        },

        removeContact: async function(contact) {
      	  let clonedContacts = _.cloneDeep(this.$store.state.objects.contacts);
          let clonedHydrated = _.cloneDeep(this.$store.state.person.hydratedContacts);
          let clonedIdStrings = _.cloneDeep(this.$store.state.person.contact_id_strings);

      	  clonedContacts.push(contact);

      	  this.$store.state.objects.contacts = clonedContacts;

          _.remove(clonedHydrated, function(hydratedContact) {
              return contact.id === hydratedContact.id;
          });

          this.$store.state.person.hydratedContacts = clonedHydrated;

          _.remove(clonedIdStrings, function(contactId) {
          	return contactId === contact.id;
          });

          this.$store.state.person.contact_id_strings = clonedIdStrings;

          if (contact.avatar_url) {
          	this.$store.state.person.available_avatars = _.pull(this.$store.state.person.available_avatars, contact.avatar_url);

            if (contact.avatar_url === this.$store.state.person.avatar_url) {
	            if (this.$store.state.person.available_avatars.length > 0) {
		            this.$store.state.person.avatar_url = this.$store.state.person.available_avatars[0];
		            this.$store.state.person.avatar_index = 0;
	            }
	            else {
		            this.$store.state.person.avatar_url = '';
		            this.$store.state.person.avatar_index = -1;
	            }
            }
          }
        },

        createNewPerson: async function() {
      	  let result;
      	  let self = this;

      	  let person = this.$store.state.person;

      	  try {
	          result = await this.$apollo.mutate({
		          mutation: personCreate,
		          variables: {
			          first_name: person.first_name,
			          middle_name: person.middle_name,
			          last_name: person.last_name,
			          contact_id_strings: person.contact_id_strings,
                      avatar_url: person.avatar_url
		          }
	          });
          } catch(err) {
      	  	this.$data.error = true;

      	  	setTimeout(function() {
      	  		self.$data.error = false;
            }, 2000)
          }

      	  window.location.href = '/settings/people';
        },

	    updatePerson: async function() {
		    let result;
		    let self = this;

		    let person = this.$store.state.person;

		    try {
			    result = await this.$apollo.mutate({
				    mutation: personUpdate,
				    variables: {
				    	id: person.id,
					    first_name: person.first_name,
					    middle_name: person.middle_name,
					    last_name: person.last_name,
                        avatar_url: person.avatar_url
				    }
			    });

			    if (this.$store.state.mode === 'people-edit') {
				    window.location.href = '/settings/people';
			    }
			    else {
				    self.$data.profileUpdated = true;

			    	setTimeout(function() {
			    		self.$data.profileUpdated = false;
                    }, 2000)
                }
		    } catch(err) {
			    this.$data.error = true;

			    setTimeout(function() {
				    self.$data.error = false;
			    }, 2000)
		    }
	    },

        assembleContacts: function(contacts) {
      	  let returned = '(';

      	  _.each(contacts, function(contact) {
      	  	returned += contact.handle ? contact.handle + ', ' : contact.name + ', ';
          });

      	  returned = returned.slice(0, returned.length - 2);

      	  returned += ')';

      	  return returned;
        },

        cancelEdit: function() {
	        window.location.href = '/settings/people';
        },

        hasAvatars: function() {
      	  let avatarFound = _.find(this.$store.state.person.hydratedContacts, function(contact) {
      	  	return contact.avatar_url != null && contact.avatar_url.length > 0;
          });

      	  return avatarFound != null;
        },

        defaultLetter: function(person) {
      	  return defaultLetter(person);
        },

        defaultColor: function(person) {
      	  return defaultColor(person);
        },

        changeAvatar: function(change) {
      	  let person = this.$store.state.person;

      	  person.avatar_index = change < 0 ? person.avatar_index - 1 : person.avatar_index + 1;

      	  if (person.avatar_index < -1) {
      	  	person.avatar_index = person.available_avatars.length - 1;
          }

          if (person.avatar_index >= person.available_avatars.length) {
      	  	person.avatar_index = -1;
          }

          person.avatar_url = person.avatar_index > -1 ? person.available_avatars[person.avatar_index] : '';
        },

        forceReauthorization: async function(connection) {
      	    let connectionClone = _.cloneDeep(connection);
      	    let result = await this.$apollo.mutate({
                mutation: patchConnection,
                variables: {
	                id: connection.id,
                    forceUnauthorized: true
                }
            });

	        let newData = result.data.connectionPatch.connection;

	        if (newData) {
		        let id = newData.id;

		        let clone = _.cloneDeep(this.$store.state.connectionMany);

		        let index = _.findIndex(clone, function(item) {
			        return item.id === id;
		        });

		        clone[index].auth.redirectUrl = newData.auth.redirectUrl;
		        connectionClone.auth.redirectUrl = newData.auth.redirectUrl;

		        this.$store.state.connectionMany = clone;
	        }

	        this.getConnectionReauthorization(connectionClone);
        },

        oldConnection: function(connection) {
      	  return moment().subtract(3, 'days') > moment(connection.last_run);
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

      if (this.$store.state.mode === 'account') {
        let personResult = await this.$apollo.query({
            query: personOne,
            variables: {
                self: true
            }
        });

        let person = personResult.data.personOne;

        self.$store.state.person.id = person.id;
        self.$store.state.person.avatar_url = person.avatar_url;
        self.$store.state.person.first_name = person.first_name;
        self.$store.state.person.middle_name = person.middle_name;
        self.$store.state.person.last_name = person.last_name;
        self.$store.state.person.contact_id_strings = person.contact_id_strings;
        self.$store.state.person.hydratedContacts = person.hydratedContacts;
        self.$store.state.person.available_avatars = _.compact(_.map(person.hydratedContacts, function(contact) {
            return contact.avatar_url;
        }));

        self.$store.state.person.avatar_index = _.indexOf(self.$store.state.person.available_avatars, self.$store.state.person.avatar_url);
      }

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

      if (this.$store.state.mode === 'people') {
      	let peopleResult = await this.$apollo.query({
            query: personMany,
            variables: {
	            filter: {
		            self: false
	            }
            }
        });

      	self.$store.state.personMany = peopleResult.data.personMany;
      }

      if (this.$store.state.mode === 'people-edit') {
        let personResult = await this.$apollo.query({
            query: personOne,
            variables: {
                id: self.$route.params.id,
            }
        });

        let person = personResult.data.personOne;

        self.$store.state.person.id = person.id;
        self.$store.state.person.avatar_url = person.avatar_url;
        self.$store.state.person.first_name = person.first_name;
        self.$store.state.person.middle_name = person.middle_name;
        self.$store.state.person.last_name = person.last_name;
        self.$store.state.person.contact_id_strings = person.contact_id_strings;
        self.$store.state.person.hydratedContacts = person.hydratedContacts;
        self.$store.state.person.available_avatars = _.compact(_.map(person.hydratedContacts, function(contact) {
        	return contact.avatar_url;
        }));

        self.$store.state.person.avatar_index = _.indexOf(self.$store.state.person.available_avatars, self.$store.state.person.avatar_url);

        self.runUnpersonedContactSearch('', true);
      }

      if (this.$store.state.mode === 'people-create') {
      	self.$store.state.person.avatar_index = -1;

      	self.runUnpersonedContactSearch('', true);
      }

      if (this.$store.state.mode === 'connections') {
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
      }
    },
  }
</script>
