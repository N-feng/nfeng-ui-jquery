require.config({
    paths: {
        "text": './static/js/requirejs-text/text'
    }
});

require([
<<<<<<< HEAD:static/main.js
    '../router/index',
    // 'text!../view/layouts/header.html',
    // 'text!../view/layouts/sidebar.html'
=======
    './router/index',
    'text!./view/layouts/header.html',
    'text!./view/layouts/sidebar.html'
>>>>>>> gh-pages:static/js/main.js
], function (router, header, sidebar) {
    // $('.header').html(header);
    // $('.sidebar').html(sidebar);
});