define(['./routes'], function(routes) {
    var AppRouter = Backbone.Router.extend({
        state: null,
        current: null,
        initialize: function(routes) {
            var router = this;
            _.each(routes, function(val, key) {
                var param_keys = key.split('/:');
                var name = param_keys.shift();
                router.route(key, name, function() {
                    router.state = '';
                    var params = _.object(param_keys, arguments);
                    router.complieOuter(val, params);
                });
            });
        },
        execute: function(callback, args) {
            callback.apply(this, args);
        },
        complieOuter: function(val, params) {
            var router = this;
            require([val], function (view) {});
        }
    });

    var app_router = new AppRouter(routes);
    Backbone.history.start();
});