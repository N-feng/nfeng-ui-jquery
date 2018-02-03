define(['require', './routes'], function(require, routes) {
    var AppRouter = Backbone.Router.extend({
        current: null,
        routes: {
            "*actions" : "defaultRoute"
        },
        defaultRoute : function(actions){
            var url = routes[actions];
            var defaultUrl = 'text!../' + url + '.html';
            var errorUrl = 'text!../view/public/error.html';
            var str = url ? defaultUrl : errorUrl;
            require([str], function (template) {
                if (this.current != null) {
                    this.current.remove();
                    this.current = null;
                }
                var $dom = $("<div>", {
                    class: 'content-wrapper',
                    html: template
                });
                $('.content').append($dom);
                this.current = $dom;
            });
        }
    });
    new AppRouter();
    Backbone.history.start();
});