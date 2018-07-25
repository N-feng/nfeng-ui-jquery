require.config({
    paths: {
        "text": './static/js/requirejs-text/text'
    }
});

require([
    './router/index',
    'text!./view/base/layouts/header.html',
    'text!./view/base/layouts/sidebar.html',
    'text!./view/base/layouts/breadcrumb.html',
], function (router, header, sidebar, breadcrumb) {
    $('.header').html(header);
    $('.sidebar').html(sidebar);
    // $('.breadcrumb').html(breadcrumb);
});