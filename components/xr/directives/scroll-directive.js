import Vue from 'vue';

Vue.directive('scroll-on-insert', {
    inserted: function (el) {
        var parent = el.parentElement;
        parent.scrollTop = parent.scrollHeight - parent.clientHeight;
    }
});
