<template>
  <div class="color-picker">
    <div class="preview">
      <label for="color-edit" v-bind:style="{'background-color': $store.state.tempSearch.icon_color}"></label>
      <input id="color-edit" type="text" maxlength="7" autocomplete="off" spellcheck="off" v-model="$store.state.tempSearch.icon_color">
      <span></span>
    </div>
    <div class="options">
      <div class="gray" style="background-color: #b6bbbf" v-on:click="$store.state.tempSearch.icon_color = '#b6bbbf'"></div>
      <div class="green" style="background-color: #61bd4f" v-on:click="$store.state.tempSearch.icon_color = '#61bd4f'"></div>
      <div class="yellow" style="background-color: #f2d600" v-on:click="$store.state.tempSearch.icon_color = '#f2d600'"></div>
      <div class="orange" style="background-color: #ffab4a" v-on:click="$store.state.tempSearch.icon_color = '#ffab4a'"></div>
      <div class="red" style="background-color: #eb5a46" v-on:click="$store.state.tempSearch.icon_color = '#eb5a46'"></div>
      <div class="purple" style="background-color: #a232cb" v-on:click="$store.state.tempSearch.icon_color = '#a232cb'"></div>
      <div class="blue" style="background-color: #0079bf" v-on:click="$store.state.tempSearch.icon_color = '#0079bf'"></div>
      <div class="light-blue" style="background-color: #00c2e0" v-on:click="$store.state.tempSearch.icon_color = '#00c2e0'"></div>
      <div class="light-green" style="background-color: #51e898" v-on:click="$store.state.tempSearch.icon_color = '#51e898'"></div>
      <div class="pink" style="background-color: #ff80ce" v-on:click="$store.state.tempSearch.icon_color = '#ff80ce'"></div>
      <div class="black" style="background-color: #4d4d4d" v-on:click="$store.state.tempSearch.icon_color = '#4d4d4d'"></div>
    </div>
  </div>
</template>

<script>
  export default {
    data: function() {
      return {
        icon_color: this.$store.state.tempSearch.icon_color || ''
      };
    }
  }
</script>
