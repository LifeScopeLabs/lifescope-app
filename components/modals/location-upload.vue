<template>
    <div class="content padded upload">
        <div class="flexbox flex-end">
            <i class="close-button fal fa-2x fa-times-circle"
               v-on:click="$emit('close')"
            ></i>
        </div>

        <span class="instructions">Upload Location History</span>

        <p>This operation may take several minutes.</p>

        <span class="instructions">Google</span>
        <ol>
            <li>
                Go to
                <a href="https://takeout.google.com/settings/takeout"
                   target="_blank"
                >
                    Google Takeout
                </a>
                and select 'Location History' with 'JSON format' and then click 'Create Archive'.
            </li>
            <li>Inside your archive navigate to Takeout -> Location History and extract these files.</li>
            <li>Click on 'Choose File' below, then navigate to one of the '.json' files you extracted.</li>
            <li>If there was more than one file with Location data, repeat for each file.</li>
        </ol>

        <span class="instructions">Facebook</span>
        <ol>
            <li>
                Go to
                <a href="https://www.facebook.com/settings?tab=your_facebook_information"
                   target="_blank"
                >
                    Facebook Information
                </a>
                and select 'Download Your Information'.
            </li>
            <li>Select 'Location' with 'JSON format' and then click the 'Create File'.</li>
            <li>Inside your archive navigate to Location History and extract these files.</li>
            <li>Click on 'Choose File' below, then navigate to one of the '.json' files you extracted.</li>
            <li>If there was more than one file with Location data, repeat for each file.</li>
        </ol>

        <span class="instructions">Other GeoJSON Sources</span>
        <p>This uploader should work for any GeoJson files with '.json' extension.</p>

        <form id="location-file"
              class="flexbox flex-column flex-x-center"
              action="/locations/upload_file"
              method="POST"
              v-on:submit.self.prevent="uploadFile"
        >
            <input type="file"
                   name="spec"
                   accept=".json"
                   class="inputfile"
            />
            <div class="errorlist hidden">
                Error uploading location file. Check that this is a valid file of location data and is in JSON format.
            </div>
            <button class="primary"
                    v-bind:class="{ hidden: $data.uploading === true }"
                    type="submit"
            >
                Submit
            </button>
            <i class="fal fa-2x fa-spin fa-spinner"
               v-bind:class="{ hidden: $data.uploading == false }"
            ></i>
        </form>
    </div>
</template>

<script>
    /* global $ */

	export default {
		data: function() {
			return {
				uploading: false
			};
		},
		methods: {
			uploadFile: function(e) {
				let file, self = this;

				let $formElem = $(e.srcElement);

				file = new FormData($formElem.get(0));

				this.$data.uploading = true;

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
						self.$data.uploading = false;

						self.$emit('close');
					})
					.fail(function() {
						self.$data.uploading = false;

						$formElem.find('.errorlist').removeClass('hidden');
					});
			}
		}
	}
</script>
