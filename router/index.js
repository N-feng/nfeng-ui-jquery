define(['require', './routes'], function(require, routes) {
    var AppRouter = Backbone.Router.extend({
        current: null,
        routes: {
            "*actions" : "defaultRoute"
        },
        defaultRoute : function(actions){
            var url = MatchTheRouting(routes, actions);  
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

function MatchTheRouting (routes, actions) {
    let url, parentName, childrenName;
    // 匹配一级栏目
    for (let i in routes) {
        if(routes[i].path === actions) {
            url = routes[i].component;
        }
        // 匹配二级栏目
        for (let j in routes[i]['children']) {
            if (routes[i].path + '/' + routes[i]['children'][j].path === actions) {
                url = routes[i]['children'][j].component;
                parentName = routes[i].name;
                childrenName = routes[i]['children'][j].name;
            }
        }
    }
    // 匹配当前路由的父对象
    let obj = routes.find(obj => obj.name === parentName);
    let title = '<h3 class="title">'+childrenName+'</h3>';
    let tpl = title + '<ul class="breadcrumb mr15"><li><a href="#/public/index">index</a></li>';

    // 匹配不成功返回错误页面
    if (!obj) {
        $('.content-title').html('<h3 class="title">ERROR</h3>');
        return;
    }

    for (let k in obj.children) {
        if (obj.children[k].name == childrenName) {
            tpl += '<li>'+obj.children[k].name+'</li>';
        } else {
            tpl += '<li><a href="#/'+ parentName + '/' + obj.children[k].path +'">'+obj.children[k].name+'</a></li>';
        }
    }
    tpl += '</ul>';
    $('.content-title').html(tpl);

    return url;
}