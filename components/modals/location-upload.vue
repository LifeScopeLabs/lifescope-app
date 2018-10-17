<template>
	<div class="content padded upload">
		<div class="flexbox flex-end">
			<i class="close-button fas fa-times-circle" v-on:click="$emit('close')"></i>
		</div>

		<h3 class="align-center">Upload Location History</h3>

		<h4 class="align-center">This operation may take a few minutes depending on your network speed and size of Location file. Please be patient.</h4>

		<div class="body flexbox flex-column flex-x-center">
			<div class="paragraph flexbox flex-column flex-x-center" style="margin-bottom: 15px;">
				<h3>Google</h3>
				<div>
					<ol>
						<li>Go to <a href="https://takeout.google.com/settings/takeout" target="_blank">Google Takeout</a>. Unselect every product, then select 'Location History'. Make sure it's in 'JSON format', then click the Next button at the bottom.</li>
						<li>Choose whatever file type and archive size you would like, as well as the delivery method of your choice, then click the Create Archive button.</li>
						<li>When the archive is created, download it to your device. Open the .zip/.tgz file with some sort of archive management software, and inside that file navigate to Takeout -> Location History.</li>
						<li>There should be one or more .json files in this folder. Extract these files to somewhere such as your Documents or Downloads folder.</li>
						<li>Click on 'Choose File' below, then navigate to one of the files you just extracted and select that. Click the Submit button.</li>
						<li>If there was more than one file with Location data, repeat the above step for each file.</li>
					</ol>
				</div>
			</div>
		</div>

		<form class="flexbox flex-column flex-x-center" id="location-file" action="/locations/upload_file" method="POST" v-on:submit.self.prevent="uploadFile">
			<input type="file" name="spec" accept=".json"/>
			<div class="errorlist hidden">Error uploading location file. Check that this is a valid file of location data and is in JSON format.</div>
			<button class="primary" v-bind:class="{ hidden: $data.uploading === true }" type="submit">Submit</button>
			<i class="fas fa-spin fa-spinner" v-bind:class="{ hidden: $data.uploading === false }"></i>
		</form>
	</div>
</template>

<script>
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
					data: file
				})
					.done(function(data) {
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
