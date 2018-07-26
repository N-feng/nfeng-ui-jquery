require.config({
    paths: {
        "text": './static/js/requirejs-text/text'
    }
});

require([
    './router/index',
    'text!./view/layouts/header.html',
    'text!./view/layouts/sidebar.html',
    'text!./view/layouts/breadcrumb.html',
], function (router, header, sidebar, breadcrumb) {
    $('.header').html(header);
    $('.sidebar').html(sidebar);
    // $('.breadcrumb').html(breadcrumb);
});