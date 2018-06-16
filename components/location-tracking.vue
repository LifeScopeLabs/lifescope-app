<template>
  <div></div>
</template>

<script>
  import locationRecordOne from '../apollo/mutations/location-record-one.gql';
  import userOne from '../apollo/queries/user-one.gql';

  export default {
    beforeMount: async function() {
      let self = this;

      if (this.$store.getters.authenticated === true) {
        let userResult = await this.$apollo.query({
          query: userOne
        });

        this.$store.state.userOne = userResult.data.userOne;

        if(process.client && this.$store.state.userOne.location_tracking_enabled) {
          navigator.geolocation.getCurrentPosition(async function(position) {
            let longitude = position.coords.longitude;
            let latitude = position.coords.latitude;
            let datetime = moment().utc(position.coords.timestamp).toDate();

            let result = await self.$apollo.mutate({
              mutation: locationRecordOne,
              variables: {
                geo_format: 'lat_lng',
                longitude: longitude,
                latitude: latitude,
                datetime: datetime
              }
            });
          });
        }
      }
    },
  }
</script>
