let commonUtils = require('../../base/utils');

function Menu(options) {
    return this.each(function (index, el) {
        $(el).data('menu', new MenuConstructor(options, el));
    });
}

function MenuConstructor(options, selector) {
    this.config = null;
    this.$el = $(selector);
    this.init(options);
}

MenuConstructor.DEFAULT = {
    mode: 'vertical',
    container: 'body',
    trigger: 'click',
    closeHandle: '.menu-close',
    openHandle: '.menu-spread',
    hideClass: 'hide',
    animateEnterClass: 'slideDown-enter-active',
    animateLeaveClass: 'slideDown-leave-active',
    animateVerticalEnterClass: 'zoom-in-left-enter',
    animateVerticalEnterActiveClass: 'zoom-in-left-enter-active'
};

MenuConstructor.prototype = {
    getDefault() {
        return MenuConstructor.DEFAULT;
    },
    getOptions(options) {
        return $.extend({}, this.getDefault(), options);
    },
    init(options) {
        this.config = this.getOptions(options);
        this.showActive();
        this.bindEvent();
    },
    showActive() {
        let url = window.location.href;
        let str = '#' + $.getHash(url);
        let $target = $("[href='"+str+"']");

        $target.addClass('active');
        $target.parents('.menu-popup').siblings('.menu-item').addClass('active');
    },
    bindEvent() {
        let _this = this;
        let config = _this.config;
        config.mode === 'vertical' ? _this.bindVerticalEvent() : '';
        config.mode === 'horizontal' ? _this.bindHorizontalEvent() : '';
        config.mode === 'inline' ? _this.bindInlineEvent() : '';

        // 点击菜单active 变化
        _this.$el.on('click.menu', '.menu-item', function () {
            if ($(this).siblings('.menu-popup').length) {
                $(this).toggleClass('menu-open');
            } else {
                _this.$el.find('.menu-item').removeClass('active').children('span').removeClass('active');
                $(this).addClass('active').children('.menu-item').addClass('active');
                $(this).parents('.menu-popup').siblings('.menu-item').addClass('active');
            }
        });

        // 菜单收起、展开按钮操作
        $(config.container).on('click.menu', config.closeHandle, function (event) {
            _this.$el.removeClass('menu-vertical').addClass('menu-inline');
            _this.$el.find('.menu-popup').slideUp();
            _this.$el.find('.menu-open').removeClass('menu-open');
            _this.unbindEvent();
            _this.bindInlineEvent();
            $(event.target).addClass('active').siblings('button').removeClass('active');
        });
        $(config.container).on('click.menu', config.openHandle, function () {
            _this.$el.removeClass('menu-inline').addClass('menu-vertical');
            // _this.$el.find('.menu-open').siblings('.menu-sub').slideDown();
            // _this.$el.children('li').children('.menu-item').children('span').removeClass('tooltip tooltip-right fade-in-linear-enter');
            // _this.$el.find('.menu-mouseover').removeClass('menu-mouseover');
            _this.unbindEvent();
            _this.bindVerticalEvent();
            $(event.target).addClass('active').siblings('button').removeClass('active');
        });
    },
    unbindEvent() {
        this.$el.find('li').unbind('mouseenter').unbind('mouseleave');
        this.$el.find('.menu-popup, span').off(commonUtils.transitionEnd);
    },
    // 水平菜单绑定事件
    bindHorizontalEvent() {
        this.$el.find('li').hover(function () {
            $(this).children('.menu-popup').fadeIn();
            $(this).children('.menu-item').addClass('hover');
        }, function() {
            $(this).children('.menu-popup').fadeOut();
            $(this).children('.menu-item').removeClass('hover');
        });
        // commonUtils.animateEndShim(this.$el.find('.menu-popup'), function () {
        //     if ($(this).hasClass('slideDown-leave-active')) {
        //         $(this).removeClass('slideDown-leave-active').addClass('hide');
        //     }
        // });
    },
    // 垂直菜单绑定事件
    bindVerticalEvent() {
        this.$el.on('click.menu', '.menu-item', function () {
            $(this).siblings('.menu-popup').slideToggle();
        })
    },
    // 内嵌菜单绑定事件
    bindInlineEvent() {
        this.$el.children('li').hover(function () {
            let self = this;
            if ($(self).children('.menu-popup').length) {
                $(self).children('.menu-item').addClass('hover');
                $(self).children('.menu-popup').removeClass('hide').addClass('zoom-in-left-enter zoom-in-left-enter-active');
                setTimeout(function () {
                    $(self).children('.menu-popup').removeClass('zoom-in-left-enter');
                }, 100);
            } else {
                $(self).children('.menu-item').addClass('hover');
                $(self).children('.menu-item').children('span').addClass('menu-item hover').addClass('zoom-in-left-enter zoom-in-left-enter-active');
                setTimeout(function () {
                    $(self).children('.menu-item').children('span').removeClass('zoom-in-left-enter');
                }, 100);
            }
        }, function () {
            if ($(this).children('.menu-popup').length) {
                $(this).children('.menu-popup').addClass('zoom-in-left-enter');
                $(this).children('.menu-item').removeClass('hover');
            } else {
                $(this).children('.menu-item').removeClass('hover');
                $(this).children('.menu-item').children('span').removeClass('menu-item hover');
                $(this).children('.menu-item').children('span').addClass('zoom-in-left-enter');
            }
        });
        this.$el.find('.menu-popup li').hover(function () {
            let self = this;
            if ($(self).children('.menu-popup').length) {
                $(self).children('.menu-popup').removeClass('hide').addClass('zoom-in-left-enter zoom-in-left-enter-active');
                $(self).children('.menu-item').addClass('hover');
                setTimeout(function () {
                    $(self).children('.menu-popup').removeClass('zoom-in-left-enter');
                }, 100);
            }
        }, function () {
            $(this).children('.menu-popup').addClass('zoom-in-left-enter');
            $(this).children('.menu-item').removeClass('hover');
        });
        commonUtils.transitionEndShim(this.$el.find('.menu-popup'), function () {
            if ($(this).hasClass('zoom-in-left-enter')) {
                $(this).removeClass('zoom-in-left-enter-active zoom-in-left-enter').addClass('hide');
            }
        });
        commonUtils.transitionEndShim(this.$el.children('li').children('.menu-item').children('span'), function () {
            if ($(this).hasClass('zoom-in-left-enter')) {
                $(this).removeClass('zoom-in-left-enter-active zoom-in-left-enter');
            }
        });
    }
};

module.exports = {
    menu: Menu
};