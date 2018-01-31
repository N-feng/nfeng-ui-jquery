define(function(require) {
    var template = require("text!./index.html");

    var View = Backbone.View.extend({
        el: '.content-wrapper',
        template: _.template(template),
        initialize: function() {
            this.render();
        },
        render: function() {
            this.$el.html(this.template());
        }
    });

    // var view = new View();

    return View;
});