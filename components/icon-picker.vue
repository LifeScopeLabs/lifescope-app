<template>
  <div class="icon-picker">
    <div class="options">
      <i class="far fa-circle" v-on:click="$store.state.tempSearch.icon = 'far fa-circle'"></i>
      <i class="fas fa-tag" v-on:click="$store.state.tempSearch.icon = 'fas fa-tag'"></i>
      <i class="fas fa-square" v-on:click="$store.state.tempSearch.icon = 'fas fa-square'"></i>
      <i class="fas fa-circle" v-on:click="$store.state.tempSearch.icon = 'fas fa-circle'"></i>
      <i class="fas fa-star" v-on:click="$store.state.tempSearch.icon = 'fas fa-star'"></i>
      <i class="fas fa-certificate" v-on:click="$store.state.tempSearch.icon = 'fas fa-certificate'"></i>
      <i class="fas fa-check" v-on:click="$store.state.tempSearch.icon = 'fas fa-check'"></i>
      <i class="fas fa-user" v-on:click="$store.state.tempSearch.icon = 'fas fa-user'"></i>
      <i class="fas fa-users" v-on:click="$store.state.tempSearch.icon = 'fas fa-users'"></i>
      <i class="fas fa-at" v-on:click="$store.state.tempSearch.icon = 'fas fa-at'"></i>
      <i class="fas fa-chart-bar" v-on:click="$store.state.tempSearch.icon = 'fas fa-bar-chart'"></i>
      <i class="fas fa-bell" v-on:click="$store.state.tempSearch.icon = 'fas fa-bell'"></i>
      <i class="fas fa-briefcase" v-on:click="$store.state.tempSearch.icon = 'fas fa-briefcase'"></i>
      <i class="far fa-calendar-alt" v-on:click="$store.state.tempSearch.icon = 'far fa-calendar-alt'"></i>
      <i class="fas fa-camera-retro" v-on:click="$store.state.tempSearch.icon = 'fas fa-camera-retro'"></i>
      <i class="fas fa-code" v-on:click="$store.state.tempSearch.icon = 'fas fa-code'"></i>
      <i class="far fa-copy" v-on:click="$store.state.tempSearch.icon = 'fas fa-copy'"></i>
      <i class="fas fa-utensils" v-on:click="$store.state.tempSearch.icon = 'fas fa-utensils'"></i>
      <i class="fas fa-desktop" v-on:click="$store.state.tempSearch.icon = 'fas fa-desktop'"></i>
      <i class="far fa-file-code" v-on:click="$store.state.tempSearch.icon = 'far fa-file-code'"></i>
      <i class="far fa-file-image" v-on:click="$store.state.tempSearch.icon = 'far fa-file-image'"></i>
      <i class="far fa-file-alt" v-on:click="$store.state.tempSearch.icon = 'far fa-file-alt'"></i>
      <i class="fas fa-film" v-on:click="$store.state.tempSearch.icon = 'fas fa-film'"></i>
      <i class="fas fa-filter" v-on:click="$store.state.tempSearch.icon = 'fas fa-filter'"></i>
      <i class="fas fa-gamepad" v-on:click="$store.state.tempSearch.icon = 'fas fa-gamepad'"></i>
      <i class="fas fa-glass-martini" v-on:click="$store.state.tempSearch.icon = 'fas fa-glass-martini'"></i>
      <i class="fas fa-globe" v-on:click="$store.state.tempSearch.icon = 'fas fa-globe'"></i>
      <i class="fas fa-hashtag" v-on:click="$store.state.tempSearch.icon = 'fas fa-hashtag'"></i>
      <i class="fas fa-headphones" v-on:click="$store.state.tempSearch.icon = 'fas fa-headphones'"></i>
      <i class="fas fa-heart" v-on:click="$store.state.tempSearch.icon = 'fas fa-heart'"></i>
      <i class="fas fa-heartbeat" v-on:click="$store.state.tempSearch.icon = 'fas fa-heartbeat'"></i>
      <i class="fas fa-history" v-on:click="$store.state.tempSearch.icon = 'fas fa-history'"></i>
      <i class="fas fa-home" v-on:click="$store.state.tempSearch.icon = 'fas fa-home'"></i>
      <i class="far fa-image" v-on:click="$store.state.tempSearch.icon = 'far fa-image'"></i>
      <i class="fas fa-inbox" v-on:click="$store.state.tempSearch.icon = 'fas fa-inbox'"></i>
      <i class="fas fa-map-marker" v-on:click="$store.state.tempSearch.icon = 'fas fa-map-marker'"></i>
      <i class="fas fa-dollar-sign" v-on:click="$store.state.tempSearch.icon = 'fas fa-dollar-sign'"></i>
      <i class="fas fa-music" v-on:click="$store.state.tempSearch.icon = 'fas fa-music'"></i>
      <i class="fas fa-paw" v-on:click="$store.state.tempSearch.icon = 'fas fa-paw'"></i>
      <i class="fas fa-phone" v-on:click="$store.state.tempSearch.icon = 'fas fa-phone'"></i>
      <i class="fas fa-puzzle-piece" v-on:click="$store.state.tempSearch.icon = 'fas fa-puzzle-piece'"></i>
      <i class="far fa-smile" v-on:click="$store.state.tempSearch.icon = 'far fa-smile'"></i>
      <i class="fas fa-futbol" v-on:click="$store.state.tempSearch.icon = 'fas fa-futbol'"></i>
      <i class="fas fa-comment-dots" v-on:click="$store.state.tempSearch.icon = 'fas fa-comment-dots'"></i>
      <i class="far fa-thumbs-up" v-on:click="$store.state.tempSearch.icon = 'far fa-thumbs-up'"></i>
      <i class="fas fa-tree" v-on:click="$store.state.tempSearch.icon = 'fas fa-tree'"></i>
      <i class="fas fa-trophy" v-on:click="$store.state.tempSearch.icon = 'fas fa-trophy'"></i>
      <i class="fas fa-tv" v-on:click="$store.state.tempSearch.icon = 'fas fa-tv'"></i>
      <i class="fas fa-video" v-on:click="$store.state.tempSearch.icon = 'fas fa-video'"></i>
      <i class="fas fa-wrench" v-on:click="$store.state.tempSearch.icon = 'fas fa-wrench'"></i>
    </div>

    <div id="clear-icon" v-on:click="$store.state.tempSearch.icon = ''">
      <i class="fas fa-times-circle" ></i> <span>Clear icon</span>
    </div>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        icon: this.$store.state.tempSearch.icon || ''
      }
    }
  }
</script>
