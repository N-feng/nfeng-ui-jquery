define(function(require) {
    // var base = require('base');
    // console.log(base)
    var sidebarTemplate = require("text!./sidebar.art");
    // console.log(sibarTemplate)

    var SideBarView = Backbone.View.extend({
        el: '.sidebar',
        template: _.template(sidebarTemplate),
        initialize: function() {
            this.render();
        },
        render: function() {
            this.$el.html(this.template());
        }
    });

    var sideBarView = new SideBarView();
});