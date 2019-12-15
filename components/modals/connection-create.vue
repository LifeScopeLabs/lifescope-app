<template>
    <div class="modal-content"
         v-bind:class="{ upload: provider.name.toLowerCase() === 'financial files' }"
    >
        <div v-if="provider.name === 'Instagram' && provider.enabled !== true"
             id="workflow"
             class="boxed-group"
        >
            <div class="align-center">
                <div class="flexbox flex-x-center">
                    <i v-bind:class="getProviderIcon(provider)"></i>
                    <div class="header flex-grow">Workaround to get Instagram data</div>
                    <i class="close-button fal fa-2x fa-times-circle"
                       v-on:click="$emit('close')"
                    ></i>
                </div>
            </div>
            <div class="padded paragraphed">
                <p>
                    Instagram has recently shut off access to third parties causing direct LifeScope access to no longer
                    be supported.
                </p>
                <p>
                    LifeScope Browser Extensions can track your Instagram visits in your web browser. Simply track the
                    domain 'instagram.com'.
                </p>
                <p>
                    Instagram is hugely popular and profitable, but more closed than ever. We believe that Instagram
                    should be a more open platform and should reopen their API to others.
                </p>
                <p>
                    If you feel like we do,
                    <a href="https://help.instagram.com"
                       target="_blank"
                    >
                        contact Instagram and ask for the API back!
                    </a>
                </p>
            </div>
        </div>
        <div v-else-if="provider.name === 'Lyft' && provider.enabled !== true"
             id="workflow"
             class="boxed-group"
        >
            <div class="align-center">
                <div class="flexbox flex-x-center">
                    <i v-bind:class="getProviderIcon(provider)"></i>
                    <div class="header flex-grow">Lyft</div>
                    <i class="close-button fal fa-2x fa-times-circle"
                       v-on:click="$emit('close')"
                    ></i>
                </div>
            </div>
            <div class="padded paragraphed">
                <p>
                    Lyft has recently shut off access to third parties causing direct LifeScope access to no longer
                    be supported.
                </p>
                <p>
                    Lyft is hugely popular, but more closed than ever. We believe that Lyft should be a more open
                    platform and should reopen their API to others.
                </p>
                <p>
                    If you feel like we do,
                    <a href="https://help.lyft.com/hc/en-us/requests/new"
                       target="_blank"
                    >
                        contact Lyft and ask for their API back!
                    </a>
                </p>
            </div>
        </div>
        <div v-else-if="provider.name === 'Uber' && provider.enabled !== true"
             id="workflow"
             class="boxed-group"
        >
            <div class="align-center">
                <div class="flexbox flex-x-center">
                    <i v-bind:class="getProviderIcon(provider)"></i>
                    <div class="header flex-grow">Uber</div>
                    <i class="close-button fal fa-2x fa-times-circle"
                       v-on:click="$emit('close')"
                    ></i>
                </div>
            </div>
            <div class="padded paragraphed">
                <p>
                    Uber has recently shut off access to third parties causing direct LifeScope access to no longer
                    be supported.
                </p>
                <p>
                    Uber is hugely popular, but more closed than ever. We believe that Uber should be a more open
                    platform and should reopen their API to others.
                </p>
                <p>
                    If you feel like we do,
                    <a href="https://help.uber.com/riders/article/how-can-i-contact-uber"
                       target="_blank"
                    >
                        contact Uber and ask for their API back!
                    </a>
                </p>
            </div>
        </div>
        <div v-else
             id="workflow"
             class="boxed-group"
             v-bind:data-provider-id="provider.id"
        >
            <div class="align-center">
                <div class="flexbox flex-x-center">
                    <i v-bind:class="getProviderIcon(provider)"></i>
                    <div class="header flex-grow">New {{ provider.name }} Connection</div>
                    <i class="close-button fal fa-2x fa-times-circle"
                       v-on:click="$emit('close')"
                    ></i>
                </div>
            </div>

            <div v-if="provider.name.toLowerCase() === 'chrome extension'"
                 class="padded paragraphed"
            >
                <p>
                    Record your Google Chrome browsing history for any sites that you approve.
                </p>

                <div class="action">
                    <button class="primary"
                            v-on:click="openStore('chrome')"
                    >
                        Connect to Chrome
                    </button>
                </div>
            </div>
            <div v-else-if="provider.name.toLowerCase() === 'firefox extension'"
                 class="padded paragraphed"
            >
                <p>
                    Record your Mozilla Firefox browsing history for any sites that you approve.
                </p>

                <div class="action">
                    <button class="primary"
                            v-on:click="openStore('firefox')"
                    >
                        Connect to Firefox
                    </button>
                </div>
            </div>
            <div v-else-if="provider.name.toLowerCase() === 'financial files'"
                 class="padded paragraphed"
            >
                <p>
                    Upload .csv files generated by financial software such as Mint.
                </p>

                <form id="financial-file"
                      class="flexbox flex-column flex-x-center"
                      action="/financials/upload_file"
                      method="POST"
                      v-on:submit.self.prevent="uploadFinancialFile"
                >
                    <input type="file"
                           name="spec"
                           accept="text/csv"
                           class="inputfile"
                    />
                    <div class="errorlist hidden">
                        Error uploading financial file. Check that financial data and is in .csv format.
                    </div>
                    <button class="primary"
                            v-bind:class="{ hidden: $data.financial_uploading === true }"
                            type="submit"
                    >
                        Submit
                    </button>
                    <i class="fal fa-spin fa-spinner"
                       v-bind:class="{ hidden: $data.financial_uploading === false }"
                       style="height: 1em; width: 1em; margin: 0.5em;"
                    ></i>
                </form>
            </div>
            <div v-else
                 class="padded paragraphed"
            >
                <div v-if="provider.coming_soon === true"
                     class="coming-soon"
                >
                    {{ provider.name }} Support is still in development.
                </div>
                <form action="/connections"
                      method="POST"
                      v-on:submit.self.prevent="createConnection"
                >
                    <!--<input type="hidden" name="csrftoken" value="{{ csrf_token }}" />-->
                    <input v-model="connectionForm.provider_id"
                           type="hidden"
                           name="provider_id"
                           v-bind:val="provider.id"
                    />

                    <div class="align-center">
                        <input v-model="connectionForm.name"
                               class="line-entry align-center"
                               type="text"
                               name="name"
                               v-bind:placeholder="getPlaceholder(provider)"
                               style="padding-top: 0;"
                               autofocus
                        />
                    </div>

                    <div class="source-container"
                         style="margin-top: 25px;"
                    >
                        <div class="label">What would you like?</div>
                        <div class="sources">
                            <div v-for="(source, name) in provider.sources"
                                 v-bind:key="name"
                                 class="paragraph source-checkbox"
                            >
                                <label>
                                    <input v-model="connectionForm.sources"
                                           type="checkbox"
                                           v-bind:value="name"
                                    />
                                    {{ name | formatNames }}
                                </label>
                                <div class="tooltip">{{ source.description }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="action">
                        <button v-if="provider.name === 'Google'"
                                class="no-style"
                                type="submit"
                        >
                            <img src="~/assets/images/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png" />
                        </button>
                        <button v-else-if="provider.name === 'Facebook'"
                                class="primary facebook-connect flexbox flex-x-center"
                                type="submit"
                        >
                            <img src="~/assets/images/facebook/white/PNG/flogo-HexRBG-Wht-58.png" />
                            <div v-if="$store.getters.authenticated === true">Connect to {{ provider.name }}</div>
                            <div v-else>Log in with {{ provider.name }}</div>
                        </button>
                        <button v-else-if="$store.getters.authenticated === true"
                                class="primary"
                                type="submit"
                        >
                            Connect to {{ provider.name }}
                        </button>
                        <button v-else
                                class="primary"
                                type="submit"
                        >
                            Log in with {{ provider.name }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!--<div id="manage">-->
        <!--<a class="primary" v-bind:href="connectionLink(id)">Manage {{ name }} Connections</a>-->

        <!--</div>-->
    </div>
</template>

<script>
    /* global $ Windows */

	import _ from 'lodash';
	import bowser from 'bowser';

	import icons from '../../lib/util/icons';
	import initializeConnection from '../../apollo/mutations/initialize-connection.gql';

	export default {
		filters: {
			formatNames: function(value) {
				if (!value) {
					return '';
				}

				value = value.toString();

				let pieces = value.split('_');

				let capitalized = _.map(pieces, function(value) {
					return value.charAt(0).toUpperCase() + value.slice(1);
				});

				return capitalized.join(' ');
			}
		},

		props: {
			provider: {
				type: Object,
				default: function() {
					return {};
				}
			}
		},

		data: function(context) {
			let sources = _.map(context.provider.sources, function(source, name) {
				return source.enabled_by_default ? name : null;
			});

			return {
				connectionForm: {
					provider_id: context.provider.id,
					name: '',
					sources: sources
				},

				financial_uploading: false
			}
		},

		methods: {
			getProviderIcon: function(provider) {
				return icons('provider', provider.name) + " fa-2x";
			},

			getPlaceholder: function(provider) {
				return 'My ' + provider.name + ' Account';
			},

			createConnection: async function() {
				let form = this.$data.connectionForm;

				let permissions = {};

				_.each(form.sources, function(source) {
					permissions[source] = true;
				});

				let variables = {
					name: form.name,
					provider_id_string: form.provider_id,
					permissions: permissions
				};

				let query = this.$route.query;

				if (query.client && query.client === 'app') {
					variables.app_session = true;
				}

				let response = await this.$apollo.mutate({
					mutation: initializeConnection,
					variables: variables
				});

				if (typeof Windows !== 'undefined' && Windows != null && Windows.System && Windows.System.Launcher) {
					Windows.System.Launcher.launchUriAsync(
						new Windows.Foundation.Uri(response.data.initializeConnection.redirectUrl));
				}
				else {
					window.location = response.data.initializeConnection.redirectUrl;
				}
			},

			openStore: function(browser) {
				let newWindow;

				if (browser === 'chrome') {
					newWindow = window.open('https://chrome.google.com/webstore/search/lifescope', '_blank');
					newWindow.focus();
				}
				else if (browser === 'firefox') {
					if (bowser.osname === 'macOS') {
						newWindow = window.open('https://addons.mozilla.org/en-US/firefox/search/?platform=mac&q=lifescope', '_blank');
					}
					else {
						newWindow = window.open('https://addons.mozilla.org/en-US/firefox/search/?platform=' + bowser.osname + '&q=lifescope', '_blank');
					}

					newWindow.focus();
				}
			},

			uploadFinancialFile: function(e) {
				let file, self = this;

				let $formElem = $(e.srcElement);

				file = new FormData($formElem.get(0));

				this.$data.financial_uploading = true;

				$.ajax({
					url: $formElem.attr('action'),
					method: $formElem.attr('method'),
					contentType: false,
					mimeType: 'multipart/form-data',
					processData: false,
					data: file,
					headers: {
						'X-CSRF-Token': self.$store.state.csrf_token
					}
				})
					.done(function() {
						self.$data.financial_uploading = false;

						self.$emit('close');
					})
					.fail(function() {
						self.$data.financial_uploading = false;

						$formElem.find('.errorlist').removeClass('hidden');
					});
			}
		}
	}
</script>

