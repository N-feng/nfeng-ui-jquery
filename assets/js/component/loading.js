let defaults = {
    container: 'body',
    display: false,
    type: true,
    shadow: true,
    template: '<div class="ball-clip-rotate"><div></div></div>',
    src: 'http://img.yi114.com/201571121314_382.gif',
};

function Loading(options) {
    this.config = $.extend({}, defaults, options);
    this.$selector = $(this.create());
    this.$overlay = $.overlay({
        container: this.config.container
    });
    if (this.config.display) {
        this.show();
    }
}

Loading.prototype.show = function () {
    let config = this.config;
    let $selector = this.$selector;
    let $overlay = this.$overlay;

    $selector.appendTo(config.container);
    $selector.removeClass('hide');

    if (config.shadow) {
        $overlay.show();
    }
};

Loading.prototype.hide = function () {
    let $selector = this.$selector;
    let $overlay = this.$overlay;

    $selector.remove();
    $overlay.hide();
};

Loading.prototype.create = function () {
    let config = this.config;
    let template = '<div class="loading hide">{{hook}}</div>'.replace('{{hook}}', config.type ? config.template : '<img src="' + config.src + '" />');
    return template;
};

function Constructor(options, type) {
    let config = options;
    if (typeof options === 'boolean') {
        options = {};
        options['display'] = config;
    }
    if (typeof type === 'boolean') {
        options['type'] = type;
    }
    return new Loading(options, this);
}

$.fn.loading = Constructor;

module.exports = {loading: Constructor};
