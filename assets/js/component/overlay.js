let utils = require('../base/utils');
let defaults = {
    container: 'body',
    display: false,
};

function Overlay(options) {
    this.config = $.extend({}, defaults, options);
    if (this.config.display) {
        this.show();
    }
}

Overlay.prototype.show = function () {
    let config = this.config;
    let $selector = this.$selector = $(this.create());
    $selector.appendTo(config.container);
    $selector.attr('style', 'opacity: 1;visibility: visible;');
};

Overlay.prototype.hide = function () {
    let $selector = this.$selector;
    $selector.removeAttr('style');
    $selector.off(utils.transitionEnd);
    utils.transitionEndShim($selector, function () {
        $selector.remove();
    }, false);
};

Overlay.prototype.create = function () {
    let template = '<div class="overlay"></div>';
    return template;
};

function Constructor(options) {
    options = options || {};
    if (typeof options === "string") {
        options = {
            display: options
        };
    }
    return new Overlay(options, this)
}

$.fn.overlay = Constructor;

module.exports = {
    overlay: Constructor
};