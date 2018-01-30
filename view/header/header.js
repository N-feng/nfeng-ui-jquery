define(function(require) {
    // var base = require('base');
    // console.log(base)
    var headerTemplate = require("text!./header.art");
    // console.log(sibarTemplate)

    var HeaderView = Backbone.View.extend({
        el: '.header',
        template: _.template(headerTemplate),
        initialize: function() {
            this.render();
        },
        render: function() {
            this.$el.html(this.template());
        }
    });

    var headerView = new HeaderView();
});