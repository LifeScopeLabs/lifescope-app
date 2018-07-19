<template>
</template>

<script>
  export default {
    layout: 'shared',
    asyncData({ store }) {
      store.state.mode = 'shared';
      store.state.pageName = 'explorer';
    }
  }
</script>
