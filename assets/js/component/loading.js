/**
 * loading 组件
 * @param {Boolean}     display  	    显示或隐藏 true/false
 * @param {String} 	    type 		    选择 css 或 img
 * @param {String}      animateHtml     穿入的css动画,type为css有效
 * @param {String}      src             图片地址，type不为css有效
 * @param {Boolean} 	shadow          是否显示阴影
 *
 * log
 * 2017-03-24 移除 $.loadingConfig 参数，降低complexity
 */
function createTemplate(config, isGlobal) {
    // loading 模板
    var loadingStr = config.template;

    // 是否需要遮罩
    // loadingStr += config.shadow ? '<div class="loading-backdrop" ' + (isGlobal ? 'style="position:absolute;"' : '') + '></div>' : '';
    loadingStr = loadingStr.replace('{{hook}}', config.type ? config.animateHtml : '<img src="' + config.src + '" />');

    return loadingStr;

}


function Loading(options, type) {
    // 默认配置
    var defaults = {
        display     : false,
        type        : true,
        shadow      : true,
        animateHtml : '<div class="ball-clip-rotate"><div></div></div>',
        src         : 'http://img.yi114.com/201571121314_382.gif',
        template    : '<div class="loading">{{hook}}</div>'
    };

    // 判断是临时配置还是自定义配置
    var isTempConfig = typeof options === 'object';
    // 是否全局模式
    var isGlobal = this instanceof $;
    // 作用域元素
    var $context = $('body');

    $.extend(defaults, isTempConfig ? options : {});

    // 若非全局模式，给作用域元素相对定位
    if (isGlobal) {
        $context = this;
        $context.css('position', 'relative');
    }

    // 快捷切换css3 or image
    if (type !== undefined) {
        defaults.type = type;
    }

    // 若options不为配置对象
    if (!isTempConfig && typeof options !== void 0) {
        defaults.display = options;
    }

    var $loading = $(createTemplate(defaults, isGlobal));

    // 显示 or 隐藏
    if (defaults.display) {
        $context.data('loading', $loading).append($loading);
        if (defaults.shadow) {
            $context.overlay(true);
        }
    } else {
        $context.data('loading').remove();
        $context.overlay(false);
    }
}

$.fn.loading = Loading;

module.exports = { loading: Loading };
