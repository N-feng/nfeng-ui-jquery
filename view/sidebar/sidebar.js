define(function(require) {
    var template = require("text!./sidebar.html");

    var View = Backbone.View.extend({
        el: '.sidebar',
        template: _.template(template),
        events: {
            'click.backbone': 'open'
        },
        initialize: function() {
            this.render();
        },
        render: function() {
            this.$el.html(this.template());
        },
        open: function(e) {
            $('.treeview-menu').find('li').removeClass('active');
            $(e.target).parent('li').addClass('active');
        }
    });

    var view = new View();
});