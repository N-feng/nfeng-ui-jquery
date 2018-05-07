/**
 * dialog 组件
 * @version 3.0.1
 * @param {String}      title 标题                   默认为空
 * @param {String}      content 内容                 默认为空
 * @param {String}      confirmText                 确定按钮文本
 * @param {String}      cancelText                  取消按钮文本
 * @param {Boolean}     closeBtn                    是否开启关闭按钮
 * @param {Boolean}     shadow                      是否开启点击阴影关闭
 * @param {String}      type                        可选择 dialog 或 confirm，区别在于有无【取消按钮】
 * @param {String}      status                      状态类，如 success , error , warning , info
 * @param {Function}    before                      回调函数 - 弹出前
 * @param {Function}    confirm                     回调函数 - 点击确认按钮后触发
 * @param {Function}    cancel                      回调函数 - 点击取消按钮后触发
 *
 *
 * @param $.dialog({options});
 */

let commonUtils = require('../base/utils');
module.exports = {
    dialog : function (options) {
        var scrollBarWidth = commonUtils.scrollBarWidth;
        var $body = $('body');

        var defaults = {
            title       : '',
            content     : '',
            confirmText : '确定',
            cancelText  : '取消',
            closeBtn    : false,
            shadow      : true,
            type        : 'confirm',
            status      : 'default',
            keyboard    : true,
            before      : function () { },
            confirm     : function () { },
            cancel      : function () { }
        };


        var config = $.extend({}, defaults, options);

        var container = create();
        /**
         * [deferred description]
         * @type {Object}
         * @description 在回调函数中使用
         */
        var deferred = {
            showDialog : function () {
                show(container);
            },
            hideDialog : function () {
                hide(container);
            },
            target : container
        };

        if (!$.dialogBackdrop) {
            $.dialogBackdrop = $('<div class="dialog-backdrop"></div>');
            $body.append($.dialogBackdrop);
        }


        if (config.shadow) {
            $body.on('touchstart.dialog click.dialog', '.dialog-container', function (event) {
                event.preventDefault();
                hide(container);
            });
        }

        $body.on('touchstart.dialog click.dialog', '.dialog-main', function (event) {
            event.stopPropagation();
        });

        // 点击确认按钮
        container.on('touchstart.dialog click.dialog', '.dialog-confirm', function () {

            if (config.type === 'dialog') {

                if (config.cancel.call(this, deferred) === false) {
                    return false;
                }

                hide(container);

                return false;
            }

            if (config.confirm.call(this, deferred) === false) {
                return false;
            }

        });

        // 点击取消、关闭按钮
        container.on('touchstart.dialog click.dialog', '.dialog-cancel,.dialog-close', function () {
            if (config.cancel.call(this, deferred) === false) {
                return false;
            }

            hide(container);
        });



        if (config.keyboard) {

            $(document).off('keyup.dialog').on('keyup.dialog', function (event) {
                // keyCode => esc
                if (event.keyCode === 27) {
                    container.find('.dialog-cancel,.dialog-close').trigger('click.dialog');
                }
                // keyCode => enter
                if (event.keyCode === 13) {
                    container.find('.dialog-confirm').trigger('click.dialog');
                }
            });
        }


        /**
         * [show description]
         * @param  {jQuery object} target 需要显示的对象
         */
        function show(target) {
            var screenH = document.documentElement.clientHeight;
            var GtIE10 = document.body.style.msTouchAction === undefined;
            target.find('.dialog-main').off(commonUtils.animateEnd);
            $.dialogBackdrop.off(commonUtils.transitionEnd);
            //当body高度大于可视高度，修正滚动条跳动
            //tmd,>=ie10的滚动条不需要做此修正
            if ($('body').height() > screenH & GtIE10) {
                $body.css({ 'border-right': scrollBarWidth + 'px transparent solid', 'overflow': 'hidden' });
            }

            target.removeClass('hide');
            $.dialogBackdrop.attr('style', 'opacity: 1;visibility: visible;');
            target.find('.dialog-main').addClass('dialog-opening');
            target.focus();
            commonUtils.animateEndShim(target.find('.dialog-main'), function () {
                target.find('.dialog-main').removeClass('dialog-opening');
            });
        }
        /**
         * [hide description]
         * @param  {jQuery object} target 需要隐藏的对象
         */
        function hide(target) {
            $([$body, target]).off('touchstart.dialog click.dialog');
            target.addClass('dialog-closing');
            $.dialogBackdrop.removeAttr('style');
            // console.log('hidetrigger')
            commonUtils.transitionEndShim($.dialogBackdrop, function () {
                // console.log(target)
                target.remove();
                $body.removeAttr('style');
            });
        }
        /**
         * [create description]
         * @return {string} 拼接html
         */
        function create() {
            var isConfirm = config.type === 'confirm';

            var _closeBtn = '<span class="dialog-close"></span>';

            var _confirmBtn = '<a href="javascript:;" class="dialog-confirm">' + config.confirmText + '</a>';

            var _cancelBtn = '<a href="javascript:;" class="dialog-cancel">' + config.cancelText + '</a>';

            var _header = '<div class="dialog-header">' + (config.title || '') + (config.closeBtn ? _closeBtn : '') + '</div>';

            var _content = '<div class="dialog-content">' + (config.content || '') + '</div>';

            var _footer = '<div class="dialog-footer">' + (isConfirm ? (_confirmBtn + _cancelBtn) : _confirmBtn.replace('dialog-confirm', 'dialog-cancel')) + '</div>';

            var _main = _header + _content + _footer;

            var $container = $('<div class="dialog-container hide" tabindex="10"><div class="dialog-main ' + config.status + '">' + _main + '</div></div>');

            $body[0].appendChild($container[0]);

            return $container;
        }

        if (config.before.call(this, deferred) === false) {
            return false;
        }

        show(container);

    }
};