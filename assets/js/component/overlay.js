let commonUtils = require('../base/utils');
function Overlay(options) {
    // 默认配置
    var defaults = {
        display     : false,
        template    : '<div class="overlay"></div>',
        animateDisable : false,
    };

    // 判断是临时配置还是自定义配置
    var isTempConfig = typeof options === 'object';
    // 是否全局模式
    var isGlobal = this instanceof $;
    // 作用域元素
    var $context = $('body');

    var config = $.extend(defaults, isTempConfig ? options : {});

    // 若非全局模式，给作用域元素相对定位
    if (isGlobal) {
        $context = this;
        // $context.css('position', 'relative');
    }

    // 若options不为配置对象
    if (!isTempConfig && typeof options !== void 0) {
        config.display = options;
    }

    var $overlay = $(config.template);

    // 显示 or 隐藏
    if (options) {
        $context.data('overlay', $overlay).append($overlay);
        //插入-遮罩-显示动画
        $overlay.attr('style', 'opacity: 1;visibility: visible;');
    } else {
        $context.data('overlay').remove();
        $overlay.removeAttr('style');
        commonUtils.transitionEndShim($overlay, function() {
            $overlay.remove();
        },config.animateDisable);
    }

}

$.fn.overlay = Overlay;

module.exports = { overlay: Overlay };