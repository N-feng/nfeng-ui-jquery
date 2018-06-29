let defaults = {
    container: 'body',
    display: false,
    template: '<div class="overlay"></div>',
};

let action = {
    show () {
        let $context = this.$context;
        let $overlay = $context.data('overlay');

        $context.append($overlay);
    },
    hide () {
        let $context = this.$context;
        let $overlay = $context.data('overlay');

        $overlay.remove();
        $context.removeData('overlay');
    }
};

function Overlay(options) {
    let config = this.config = $.extend({}, defaults, options);
    let $context = this.$context = this instanceof $ ? this : $('body');

    // overlay 模板
    let overlayStr = config.template;

    // 显示overlay的时候，将 $overlay存入作用域元素中
    let $overlay = $context.data('overlay') || $(overlayStr);
    $context.data('overlay', $overlay);

    // 显示 or 隐藏
    if(config.display) {
        action.show.call(this);
    } else {
        action.hide.call(this);
    }
}

function Constructor(options) {
    let config = {};
    if (typeof options === "boolean") {
        config['display'] = options;
    }
    return new Overlay(config, this)
}

$.fn.overlay = Constructor;

module.exports = {
    overlay: Constructor
};