define(function (require) {
  var Backbone = require('backbone');
  var $ = require('jquery');

  var ModalView = Backbone.View.extend({
    el: '#modal_container',
    events: {
      'keypress': 'hide',
    },
    initialize: function(){

    },
    show: function (title, content) {
      this.$('#modal_label').html(title);
      this.$('#modal_content').html(content);
      this.$el.modal('show');
    },
    hide: function (e) {
      if (e.which === 13){
        this.$el.modal('hide');
        this.$('#modal_label').html('');
        this.$('#modal_content').html('');
      }
    }
  });

  return ModalView;
});