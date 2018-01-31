define(function(require) {
    var template = require("text!./index.html");
    var View = Backbone.View.extend({
        el: '.sidebar',
        template: _.template(template),
        events: {
            'click.backbone': 'open'
        },
        initialize: function() {
            this.render();
            this.sidebarActive();
        },
        render: function() {
            this.$el.html(this.template());
        },
        open: function(e) {
            $('.treeview-menu').find('li').removeClass('active');
            $(e.target).parent('li').addClass('active');
        },
        sidebarActive: function () {
            // page reload sidebar active
            var str = '[href="#'+$.getHash(window.location.href)+'"]';
            $(str).parent('li').addClass('active');
        }
    });
    var view = new View();
});