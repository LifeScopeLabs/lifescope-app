<template>
  <div class="modal-content">
    <div id="workflow" class="boxed-group" v-if="provider.name === 'Instagram' && provider.enabled !== true">
      <div class="align-center">
        <div class="flexbox flex-x-center">
          <i v-bind:class="getProviderIcon(provider)"></i>
          <div class="header flex-grow">Workaround to get Instagram data</div>
          <i class="close-button fa fa-times-circle" v-on:click="$emit('close')"></i>
        </div>
      </div>
      <div class="padded paragraphed">
        <p>Instagram is shutting off access to their public API and will not approve any new applications for API access. LifeScope is unable to get your Instagram history as a result.</p>
        <p>
          There is a partial workaround that you can take: install one of the Browser Extensions and track the domain 'instagram.com'.
          This isn't a perfect solution for two reasons: one, LifeScope can't tell when you posted anything to Instagram, just when you've viewed things on Instagram; and two, LifeScope can't track what you do in the Instagram app, just what you've viewed in that browser.
        </p>
        <p>
          If you feel very strongly about getting your Instagram history, you could try contacting Instagram and petitioning them to make a new public user API.
          You could also set up your own local copy of LifeScope; if you make your own application in Instagram, you can register your account as a test account and never need to submit an application for production keys.
        </p>
      </div>
    </div>
    <div v-else id="workflow" class="boxed-group" v-bind:data-provider-id="provider.id">
      <div class="align-center">
        <div class="flexbox flex-x-center">
          <i v-bind:class="getProviderIcon(provider)"></i>
          <div class="header flex-grow">New {{ provider.name }} Connection</div>
          <i class="close-button fa fa-times-circle" v-on:click="$emit('close')"></i>
        </div>
      </div>

      <div v-if="provider.name.toLowerCase() === 'chrome extension'" class="padded paragraphed">
        <p>
          You can install a browser extension for Chrome that will record your browsing history for sites that you approve.
        </p>
        <p>
          Click the button below to be taken to the Chrome extension store.
        </p>

        <div class="action">
          <button class="primary" v-on:click="openStore('chrome')">Connect to your Chrome history</button>
        </div>
      </div>
      <div v-else-if="provider.name.toLowerCase() === 'firefox extension'" class="padded paragraphed">
        <p>
          You can install a browser extension for Firefox that will record your browsing history for sites that you approve.
        </p>
        <p>
          Click the button below to be taken to the Firefox extension store.
        </p>

        <div class="action">
          <button class="primary" v-on:click="openStore('firefox')">Connect to your Firefox history</button>
        </div>
      </div>
      <div v-else class="padded paragraphed">
        <form action="/connections" method="POST" v-on:submit.self.prevent="createConnection">
          <!--<input type="hidden" name="csrftoken" value="{{ csrf_token }}" />-->
          <input type="hidden" name="provider_id" v-bind:val="provider.id" v-model="connectionForm.provider_id"/>

          <div class="align-center">
            <input class="line-entry align-center" type="text" name="name" v-bind:placeholder="getPlaceholder(provider)"
                   v-model="connectionForm.name" style="padding-top: 0;" autofocus/>
          </div>

          <div class="source-container" style="margin-top: 25px;">
            <div class="label">What would you like?</div>
            <div class="sources">
              <div v-for="source, name in provider.sources" class="paragraph source-checkbox">
                <label><input type="checkbox" v-bind:value="name" v-model="connectionForm.sources"/>{{ name | formatNames }}</label>
                <div class="tooltip">{{ source.description }}</div>
              </div>

            </div>
          </div>

          <div class="action">
            <button v-if="provider.name === 'Google'" class="no-style" type="submit"><img src="~/assets/images/google_signin_buttons/web/1x/btn_google_signin_dark_normal_web.png" /></button>
            <button v-else class="primary" type="submit">Log in with {{ provider.name }}</button>
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
  import _ from 'lodash';
  import bowser from 'bowser';
  import icons from '../../lib/util/icons';
  import initializeConnection from '../../apollo/mutations/initialize-connection.gql';

  export default {
    data: function(context) {
      let sources = _.map(context.provider.sources, function(source, name) {
        return source.enabled_by_default ? name : null;
      });

      return {
        connectionForm: {
          provider_id: context.provider.id,
          name: '',
          sources: sources
        }
      }
    },

    filters: {
      formatNames: function(value) {
        if (!value) return '';

        value = value.toString();

        let pieces = value.split('_');

        let capitalized = _.map(pieces, function(value) {
          return value.charAt(0).toUpperCase() + value.slice(1);
        });

        return capitalized.join(' ');
      }
    },
    props: ['provider'],

    methods: {
      getProviderIcon: function(provider) {
        return icons('provider', provider.name);
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

        let response = await this.$apollo.mutate({
          mutation: initializeConnection,
          variables: {
            name: form.name,
            provider_id_string: form.provider_id,
            permissions: permissions
          }
        });

        window.location = response.data.initializeConnection.redirectUrl;
      },

      openStore: function(browser) {
        if (browser === 'chrome') {
          let newWindow = window.open('https://chrome.google.com/webstore/search/lifescope', '_blank');
          newWindow.focus();
        }
        else if (browser === 'firefox') {
          let newWindow = window.open('https://addons.mozilla.org/en-US/firefox/search/?platform=' + bowser.osname + '&q=lifescope', '_blank');
          newWindow.focus();
        }
      }
    }
  }
</script>

