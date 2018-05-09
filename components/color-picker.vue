<template>
  <div class="color-picker">
    <div class="preview">
      <label for="color-edit" v-bind:style="{'background-color': $store.state.tempSearch.icon_color}"></label>
      <input id="color-edit" type="text" maxlength="7" autocomplete="off" spellcheck="off" v-model="$store.state.tempSearch.icon_color" v-on:change="checkColor" v-on:keyup="checkColor" v-on:paste="checkColor">
      <span v-if="invalidColor === true">Invalid</span>
    </div>
    <div class="options">
      <div class="gray" style="background-color: #b6bbbf" v-on:click="updateColor('#b6bbbf')"></div>
      <div class="green" style="background-color: #61bd4f" v-on:click="updateColor('#61bd4f')"></div>
      <div class="yellow" style="background-color: #f2d600" v-on:click="updateColor('#f2d600')"></div>
      <div class="orange" style="background-color: #ffab4a" v-on:click="updateColor('#ffab4a')"></div>
      <div class="red" style="background-color: #eb5a46" v-on:click="updateColor('#eb5a46')"></div>
      <div class="purple" style="background-color: #a232cb" v-on:click="updateColor('#a232cb')"></div>
      <div class="blue" style="background-color: #0079bf" v-on:click="updateColor('#0079bf')"></div>
      <div class="light-blue" style="background-color: #00c2e0" v-on:click="updateColor('#00c2e0')"></div>
      <div class="light-green" style="background-color: #51e898" v-on:click="updateColor('#51e898')"></div>
      <div class="pink" style="background-color: #ff80ce" v-on:click="updateColor('#ff80ce')"></div>
      <div class="black" style="background-color: #4d4d4d" v-on:click="updateColor('#4d4d4d')"></div>
    </div>
  </div>
</template>

<script>
  const HEX_COLOR_PATTERN = '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$';

  export default {
    data: function() {
      return {
        invalidColor: false
      }
    },
    methods: {
      checkColor: function() {
        this.$data.invalidColor = !this.$store.state.tempSearch.icon_color.match(HEX_COLOR_PATTERN);
      },
      updateColor(color) {
        this.$store.state.tempSearch.icon_color = color;

        this.checkColor();
      }
    }
  }
</script>
