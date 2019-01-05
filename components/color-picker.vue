<template>
  <div class="color-picker">
    <div class="preview">
      <label for="color-edit" v-bind:style="{'background-color': $store.state.tempSearch.icon_color}"></label>
      <input id="color-edit" type="text" maxlength="7" autocomplete="off" spellcheck="off" v-model="$store.state.tempSearch.icon_color" v-on:change="checkColor" v-on:keyup="checkColor" v-on:paste="checkColor">
      <span v-if="invalidColor === true">Invalid</span>
    </div>
    <div class="options">
      <div style="background-color: #a2b9bc" v-on:click="updateColor('#a2b9bc')"></div>
      <div style="background-color: #b2ad7f" v-on:click="updateColor('#b2ad7f')"></div>
      <div style="background-color: #878f99" v-on:click="updateColor('#878f99')"></div>
      <div style="background-color: #6b5b95" v-on:click="updateColor('#6b5b95')"></div>
      <div style="background-color: #feb236" v-on:click="updateColor('#feb236')"></div>
      <div style="background-color: #d64161" v-on:click="updateColor('#d64161')"></div>
      <div style="background-color: #ff7b25" v-on:click="updateColor('#ff7b25')"></div>
      <div style="background-color: #d6cbd3" v-on:click="updateColor('#d6cbd3')"></div>
      <div style="background-color: #eca1a6" v-on:click="updateColor('#eca1a6')"></div>
      <div style="background-color: #bdcebe" v-on:click="updateColor('#bdcebe')"></div>
      <div style="background-color: #ffef96" v-on:click="updateColor('#ffef96')"></div>
      <div style="background-color: #50394c" v-on:click="updateColor('#50394c')"></div>
      <div style="background-color: #fefbd8" v-on:click="updateColor('#fefbd8')"></div>
      <div style="background-color: #618685" v-on:click="updateColor('#618685')"></div>
      <div style="background-color: #36486b" v-on:click="updateColor('#36486b')"></div>
      <div style="background-color: #4040a1" v-on:click="updateColor('#4040a1')"></div>
      <div style="background-color: #c1502e" v-on:click="updateColor('#c1502e')"></div>
      <div style="background-color: #622569" v-on:click="updateColor('#622569')"></div>
      <div style="background-color: #c83349" v-on:click="updateColor('#c83349')"></div>
      <div style="background-color: #4d4d4d" v-on:click="updateColor('#4d4d4d')"></div>
      <div style="background-color: #ff80ce" v-on:click="updateColor('#ff80ce')"></div>
      <div style="background-color: #51e898" v-on:click="updateColor('#51e898')"></div>
      <div style="background-color: #00c2e0" v-on:click="updateColor('#00c2e0')"></div>
      <div style="background-color: #0079bf" v-on:click="updateColor('#0079bf')"></div>
      <div style="background-color: #a232cb" v-on:click="updateColor('#a232cb')"></div>
      <div style="background-color: #eb5a46" v-on:click="updateColor('#eb5a46')"></div>
      <div style="background-color: #b6bbbf" v-on:click="updateColor('#b6bbbf')"></div>
      <div style="background-color: #61bd4f" v-on:click="updateColor('#61bd4f')"></div>
      <div style="background-color: #f2d600" v-on:click="updateColor('#f2d600')"></div>
      <div style="background-color: #ffab4a" v-on:click="updateColor('#ffab4a')"></div>
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
