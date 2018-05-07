<template>
  <div class="icon-picker">
    <div class="options">
      <i class="fa fa-circle-o" v-on:click="$store.state.tempSearch.icon = 'fa fa-circle-o'"></i>
      <i class="fa fa-tag" v-on:click="$store.state.tempSearch.icon = 'fa fa-tag'"></i>
      <i class="fa fa-square" v-on:click="$store.state.tempSearch.icon = 'fa fa-square'"></i>
      <i class="fa fa-circle" v-on:click="$store.state.tempSearch.icon = 'fa fa-circle'"></i>
      <i class="fa fa-star" v-on:click="$store.state.tempSearch.icon = 'fa fa-star'"></i>
      <i class="fa fa-certificate" v-on:click="$store.state.tempSearch.icon = 'fa fa-certificate'"></i>
      <i class="fa fa-check" v-on:click="$store.state.tempSearch.icon = 'fa fa-check'"></i>
      <i class="fa fa-user" v-on:click="$store.state.tempSearch.icon = 'fa fa-user'"></i>
      <i class="fa fa-users" v-on:click="$store.state.tempSearch.icon = 'fa fa-users'"></i>
      <i class="fa fa-at" v-on:click="$store.state.tempSearch.icon = 'fa fa-at'"></i>
      <i class="fa fa-bar-chart" v-on:click="$store.state.tempSearch.icon = 'fa fa-bar-chart'"></i>
      <i class="fa fa-bell" v-on:click="$store.state.tempSearch.icon = 'fa fa-bell'"></i>
      <i class="fa fa-briefcase" v-on:click="$store.state.tempSearch.icon = 'fa fa-briefcase'"></i>
      <i class="fa fa-calendar" v-on:click="$store.state.tempSearch.icon = 'fa fa-calendar'"></i>
      <i class="fa fa-camera-retro" v-on:click="$store.state.tempSearch.icon = 'fa fa-camera-retro'"></i>
      <i class="fa fa-code" v-on:click="$store.state.tempSearch.icon = 'fa fa-code'"></i>
      <i class="fa fa-copy" v-on:click="$store.state.tempSearch.icon = 'fa fa-copy'"></i>
      <i class="fa fa-cutlery" v-on:click="$store.state.tempSearch.icon = 'fa fa-cutlery'"></i>
      <i class="fa fa-desktop" v-on:click="$store.state.tempSearch.icon = 'fa fa-desktop'"></i>
      <i class="fa fa-file-code-o" v-on:click="$store.state.tempSearch.icon = 'fa fa-file-code-o'"></i>
      <i class="fa fa-file-image-o" v-on:click="$store.state.tempSearch.icon = 'fa fa-file-image-o'"></i>
      <i class="fa fa-file-text-o" v-on:click="$store.state.tempSearch.icon = 'fa fa-file-text-o'"></i>
      <i class="fa fa-files-o" v-on:click="$store.state.tempSearch.icon = 'fa fa-files-o'"></i>
      <i class="fa fa-film" v-on:click="$store.state.tempSearch.icon = 'fa fa-film'"></i>
      <i class="fa fa-filter" v-on:click="$store.state.tempSearch.icon = 'fa fa-filter'"></i>
      <i class="fa fa-gamepad" v-on:click="$store.state.tempSearch.icon = 'fa fa-gamepad'"></i>
      <i class="fa fa-glass" v-on:click="$store.state.tempSearch.icon = 'fa fa-glass'"></i>
      <i class="fa fa-globe" v-on:click="$store.state.tempSearch.icon = 'fa fa-globe'"></i>
      <i class="fa fa-hashtag" v-on:click="$store.state.tempSearch.icon = 'fa fa-hashtag'"></i>
      <i class="fa fa-headphones" v-on:click="$store.state.tempSearch.icon = 'fa fa-headphones'"></i>
      <i class="fa fa-heart" v-on:click="$store.state.tempSearch.icon = 'fa fa-heart'"></i>
      <i class="fa fa-heartbeat" v-on:click="$store.state.tempSearch.icon = 'fa fa-heartbeat'"></i>
      <i class="fa fa-history" v-on:click="$store.state.tempSearch.icon = 'fa fa-history'"></i>
      <i class="fa fa-home" v-on:click="$store.state.tempSearch.icon = 'fa fa-home'"></i>
      <i class="fa fa-image" v-on:click="$store.state.tempSearch.icon = 'fa fa-image'"></i>
      <i class="fa fa-inbox" v-on:click="$store.state.tempSearch.icon = 'fa fa-inbox'"></i>
      <i class="fa fa-map-marker" v-on:click="$store.state.tempSearch.icon = 'fa fa-map-marker'"></i>
      <i class="fa fa-usd" v-on:click="$store.state.tempSearch.icon = 'fa fa-usd'"></i>
      <i class="fa fa-music" v-on:click="$store.state.tempSearch.icon = 'fa fa-music'"></i>
      <i class="fa fa-paw" v-on:click="$store.state.tempSearch.icon = 'fa fa-paw'"></i>
      <i class="fa fa-phone" v-on:click="$store.state.tempSearch.icon = 'fa fa-phone'"></i>
      <i class="fa fa-puzzle-piece" v-on:click="$store.state.tempSearch.icon = 'fa fa-puzzle-piece'"></i>
      <i class="fa fa-smile-o" v-on:click="$store.state.tempSearch.icon = 'fa fa-smile-o'"></i>
      <i class="fa fa-soccer-ball-o" v-on:click="$store.state.tempSearch.icon = 'fa fa-soccer-ball'"></i>
      <i class="fa fa-commenting-o" v-on:click="$store.state.tempSearch.icon = 'fa fa-commenting-o'"></i>
      <i class="fa fa-thumbs-o-up" v-on:click="$store.state.tempSearch.icon = 'fa fa-thumbs-o-up'"></i>
      <i class="fa fa-tree" v-on:click="$store.state.tempSearch.icon = 'fa fa-tree'"></i>
      <i class="fa fa-trophy" v-on:click="$store.state.tempSearch.icon = 'fa fa-trophy'"></i>
      <i class="fa fa-tv" v-on:click="$store.state.tempSearch.icon = 'fa fa-tv'"></i>
      <i class="fa fa-video-camera" v-on:click="$store.state.tempSearch.icon = 'fa fa-video-camera'"></i>
      <i class="fa fa-wrench" v-on:click="$store.state.tempSearch.icon = 'fa fa-wrench'"></i>
    </div>

    <div id="clear-icon" v-on:click="$store.state.tempSearch.icon = ''">
      <i class="fa fa-times-circle" ></i> <span>Clear icon</span>
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
