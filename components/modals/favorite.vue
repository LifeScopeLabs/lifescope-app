<template>
  <div class="content padded">
    <h3 class="align-center">Favorite Your Search</h3>

    <div class="data">
      <i></i>
      <div class="text-box flex-grow">
        <input type="text" name="search-name" placeholder="Name the current search" />
      </div>
    </div>

    <div class="selectors">
      <div class="label">Icon</div>
      <icon-picker></icon-picker>
      <div class="label">Color</div>
      <color-picker></color-picker>
    </div>

    <div class="buttons">
      <div>
        {% if not hideDelete %}
        <button class="danger" data-action="delete">
          <span>Delete</span>
        </button>
        {% endif %}
        {% if not hideUnfavorite %}
        <button data-action="unfavorite">
          <span>Unfavorite</span>
        </button>
        {% endif %}
      </div>

      <div>
        <button data-action="cancel">
          <span>Cancel</span>
        </button>
        <button data-action="save">
          <span>Save</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import ColorPicker from '../color-picker';
  import IconPicker from '../icon-picker';

  export default {
    data: function(context) {
      return {

      };
    },
    components: [
      IconPicker,
      ColorPicker
    ],
    props: [
      'search'
    ]
  }
</script>
