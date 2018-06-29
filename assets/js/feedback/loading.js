let defaults = {
    container: 'body',
    display: false,
    type: true,
    shadow: true,
    animateHtml: '<div class="ball-clip-rotate"><div></div></div>',
    src: 'http://img.yi114.com/201571121314_382.gif',
    template: '<div class="loading">{{hook}}</div>',
};

let action = {
    show () {
        let config = this.config;
        let $context = this.$context;
        let $loading = $context.data('loading');

        $context.append($loading);

        // 是否需要遮罩
        if(config.shadow) {
            $.overlay(true);
        }
    },
    hide () {
        let config = this.config;
        let $context = this.$context;
        let $loading = $context.data('loading');

        $loading.remove();
        $context.removeData('loading');

        if(config.shadow) {
            $.overlay(false);
        }
    },
}

function Loading(options) {
    let config = this.config = $.extend({}, defaults, options);
    let $context = this.$context = this instanceof $ ? this : $('body');

    // loading 模板
    let loadingStr = config.template;
    loadingStr = loadingStr.replace('{{hook}}', config.type ? config.animateHtml : '<img src="' + config.src + '" />');

    // 显示loading的时候，将 $loading存入作用域元素中
    let $loading = $context.data('loading') || $(loadingStr);
    $context.data('loading', $loading);

    // 显示 or 隐藏
    if(config.display) {
        action.show.call(this);
    } else {
        action.hide.call(this);
    }
}

function Constructor(options, type) {
    let config = {};
    if (typeof options === 'boolean') {
        config['display'] = options;
    }
    if (typeof type === 'boolean') {
        config['type'] = type;
    }
    return new Loading(config, this);
}

$.fn.loading = Constructor;

module.exports = {loading: Constructor};
