require.config({
    paths: {
        text: './static/requirejs-text/text'
    }
});
require([
    './view/header/header',
    './view/sidebar/index',
    './router/index',
]);