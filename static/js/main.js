require.config({
    paths: {
        "text": './static/js/requirejs-text/text'
    }
});

require([
    './router/index',
    'text!./view/base/layouts/header.html',
    'text!./view/base/layouts/sidebar.html'
], function (router, header, sidebar) {
    $('.header').html(header);
    $('.sidebar').html(sidebar);
});