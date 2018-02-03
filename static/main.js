require.config({
    paths: {
        "text": './static/requirejs-text/text'
    }
});

require([
    '../router/index',
    // 'text!../view/layouts/header.html',
    // 'text!../view/layouts/sidebar.html'
], function (router, header, sidebar) {
    // $('.header').html(header);
    // $('.sidebar').html(sidebar);
});