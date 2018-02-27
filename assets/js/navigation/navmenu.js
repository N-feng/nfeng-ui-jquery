var commonUtils = require('../common/utils');

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
    getDefault: function () {
        return MenuConstructor.DEFAULT;
    },
    getOptions: function (options) {
        return $.extend({}, this.getDefault(), options);
    },
    init: function (options) {
        this.config = this.getOptions(options);
        this.showActive();
        this.bindEvent();
    },
    showActive: function () {
        var url = window.location.href;
        var str = '#' + $.getHash(url);
        var $target = $("[href='"+str+"']");

        $target.addClass('active');
        $target.parents('.menu-sub').siblings('.menu-title').addClass('active');
    },
    bindEvent: function () {
        var _this = this;
        var config = _this.config;
        config.mode === 'vertical' ? _this.bindVerticalEvent() : _this.bindHorizontalEvent();

        // 点击菜单active 变化
        _this.$el.on('click.menu', '.menu-item', function () {
            _this.$el.find('.menu-title, .menu-item').removeClass('active');
            $(this).addClass('active');
            $(this).parents('.menu-sub').siblings('.menu-title').addClass('active');
        });
    },
    // 垂直菜单绑定事件
    bindVerticalEvent: function () {
        var _this = this;
        var config = _this.config;

        // 菜单收起、展开按钮操作
        $(config.container).on('click.menu', config.closeHandle, function (event) {
            _this.$el.addClass('menu-collapse');
            $(event.target).addClass('active').siblings('button').removeClass('active');
            _this.$el.find('.menu-sub').slideUp();
            _this.$el.children('li').children('.menu-item').children('span').addClass('tooltip tooltip-right fade-in-linear-enter');
        });
        $(config.container).on('click.menu', config.openHandle, function () {
            console.log('what?');
            _this.$el.removeClass('menu-collapse');
            $(event.target).addClass('active').siblings('button').removeClass('active');
            _this.$el.find('.menu-open').siblings('.menu-sub').slideDown();
            _this.$el.children('li').children('.menu-item').children('span').removeClass('tooltip tooltip-right fade-in-linear-enter');
            _this.$el.find('.menu-mouseover').removeClass('menu-mouseover');
        });

        // 展开菜单绑定事件
        _this.$el.on('click.menu', '.menu-title', function () {
            if (_this.$el.hasClass('menu-collapse')) {
                return false;
            }
            if ($(this).hasClass('menu-open')) {
                $(this).siblings('.menu-sub').slideUp();
            } else {
                $(this).siblings('.menu-sub').slideDown();
            }
            $(this).toggleClass('menu-open');
        });
        // 收起菜单绑定事件
        _this.$el.on('mouseenter.navmenu', '.menu-title', function () {
            if (!_this.$el.hasClass('menu-collapse')) {
                return false;
            }
            $(this).addClass('menu-mouseover');
            $(this).siblings('.menu-sub').addClass(config.animateVerticalEnterClass).addClass(config.animateVerticalEnterActiveClass);
            var self = this;
            setTimeout(function () {
                $(self).siblings('.menu-sub').removeClass(config.animateVerticalEnterClass).on('transitionend', function () {
                    $(this).removeClass(config.animateVerticalEnterActiveClass);
                });
            }, 100);
        });
        _this.$el.on('mouseleave.menu', '.menu-title', function () {
            if (!_this.$el.hasClass('menu-collapse')) {
                return false;
            }
            $(this).removeClass('menu-mouseover');
        });
        // 收起菜单的二级栏目绑定事件
        _this.$el.children('li').children('.menu-item').on('mouseenter.menu', function () {
            if (!_this.$el.hasClass('menu-collapse')) {
                return false;
            }
            var self = this;
            var $span = $(self).find('span');
            $(self).addClass('menu-mouseover');
            setTimeout(function () {
                $span.removeClass('fade-in-linear-enter');
            }, 100);
        });
        _this.$el.children('li').children('.menu-item').on('mouseleave.menu', function () {
            if (!_this.$el.hasClass('menu-collapse')) {
                return false;
            }
            var self = this;
            var $span = $(self).find('span');
            setTimeout(function () {
                $span.addClass('fade-in-linear-enter');
            }, 100);
        });
        _this.$el.on('mouseover.menu', '.menu-sub' , function () {
            if (!_this.$el.hasClass('menu-collapse')) {
                return false;
            }
            $(this).siblings('.menu-title').addClass('menu-mouseover');
        });
        _this.$el.on('mouseleave.menu', '.menu-sub' , function () {
            if (!_this.$el.hasClass('menu-collapse')) {
                return false;
            }
            $(this).siblings('.menu-title').removeClass('menu-mouseover');
        });
    },
    // 水平菜单绑定事件
    bindHorizontalEvent: function () {
        var _this = this;
        var config = _this.config;
        var $context = _this.$el.find('.menu-sub');

        // 鼠标放在菜单效果
        _this.$el.on('mouseover.menu', 'li', function () {
            $(this).find('.menu-sub').removeClass(config.hideClass).addClass(config.animateEnterClass).removeClass(config.animateLeaveClass);
            $(this).find('.menu-title').addClass('menu-open');
        });

        // 鼠标离开菜单效果
        _this.$el.on('mouseleave.menu', 'li', function () {
            $(this).find('.menu-sub').removeClass(config.animateEnterClass).addClass(config.animateLeaveClass);
            $(this).find('.menu-title').removeClass('menu-open');
        });

        // 动画结束事件绑定
        commonUtils.animateEndShim($context, function () {
            if ($context.hasClass(config.animateLeaveClass)) {
                $context.removeClass(config.animateLeaveClass).addClass(config.hideClass);
            }
        });
    }
};

module.exports = {
    menu: Menu
};