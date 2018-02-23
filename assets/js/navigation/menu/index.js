var commonUtils = require('../../common/utils');

var ENP = {
    click: 'click.menu',
    mouseover: 'mouseover.menu',
    mouseleave: 'mouseleave.menu'
};

function Menu(options, selector) {
    var defaults = {
        mode: 'vertical',
        container: 'body',
        trigger: 'click',
        closeHandle: '.menu-close',
        openHandle: '.menu-open',
        hideClass     	  : 'hide',
        animateEnterClass : 'slideDown-enter-active',
        animateLeaveClass : 'slideDown-leave-active'
    };
    var _this = this;
    _this.config = $.extend({}, defaults, options);
    _this.$el = $(selector);

    _this.init();
}

Menu.prototype.init = function () {
    var _this = this;

    _this.showActive();
    _this.bindEvent();
};

Menu.prototype.showActive = function () {
    var url = window.location.href;
    var str = '#' + $.getHash(url);
    var $target = $("[href='"+str+"']");

    $target.addClass('active');
    $target.parents('.menu-sub').siblings('.menu-title').addClass('active');
};

Menu.prototype.bindEvent = function () {
    var _this = this;
    var config = _this.config;
    config.mode === 'vertical' ? _this.bindVerticalEvent() : _this.bindHorizontalEvent();

    // 点击菜单active 变化
    _this.$el.on(ENP.click, '.menu-item', function () {
        _this.$el.find('.menu-title, .menu-item').removeClass('active');
        $(this).addClass('active');
        $(this).parents('.menu-sub').siblings('.menu-title').addClass('active');
    });
};

// 垂直菜单绑定事件
Menu.prototype.bindVerticalEvent = function () {
    var _this = this;
    var config = _this.config;

    // 菜单收起、展开按钮操作
    $(config.container).on(ENP.click, config.closeHandle, function (event) {
        _this.$el.addClass('menu-collapse');
        $(event.target).addClass('active').siblings('button').removeClass('active');
        _this.$el.find('.menu-sub').slideUp();
    });
    $(config.container).on(ENP.click, config.openHandle, function () {
        _this.$el.removeClass('menu-collapse');
        $(event.target).addClass('active').siblings('button').removeClass('active');
        _this.$el.find('.menu-open').siblings('.menu-sub').slideDown();
    });

    // 展开菜单绑定事件
    _this.$el.on(ENP.click, '.menu-title', function () {
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
    _this.$el.on(ENP.mouseover, '.menu-title', function () {
       if (!_this.$el.hasClass('menu-collapse')) {
           return false;
       }
       $(this).addClass('menu-mouseover');
    });
    _this.$el.on(ENP.mouseleave, '.menu-title', function () {
        if (!_this.$el.hasClass('menu-collapse')) {
            return false;
        }
        $(this).removeClass('menu-mouseover');
    });
    _this.$el.on(ENP.mouseover, '.menu-sub' , function () {
        if (!_this.$el.hasClass('menu-collapse')) {
            return false;
        }
        $(this).siblings('.menu-title').addClass('menu-mouseover');
    });
    _this.$el.on(ENP.mouseleave, '.menu-sub' , function () {
        if (!_this.$el.hasClass('menu-collapse')) {
            return false;
        }
        $(this).siblings('.menu-title').removeClass('menu-mouseover');
    });
};

// 水平菜单绑定事件
Menu.prototype.bindHorizontalEvent = function () {
    var _this = this;
    var config = _this.config;
    var $context = _this.$el.find('.menu-sub');

    // 鼠标放在菜单效果
    _this.$el.on(ENP.mouseover, 'li', function () {
        $(this).find('.menu-sub').removeClass(config.hideClass).addClass(config.animateEnterClass).removeClass(config.animateLeaveClass);
        $(this).find('.menu-title').addClass('menu-open');
    });

    // 鼠标离开菜单效果
    _this.$el.on(ENP.mouseleave, 'li', function () {
        $(this).find('.menu-sub').removeClass(config.animateEnterClass).addClass(config.animateLeaveClass);
        $(this).find('.menu-title').removeClass('menu-open');
    });

    // 动画结束事件绑定
    commonUtils.animateEndShim($context, function () {
        if ($context.hasClass(config.animateLeaveClass)) {
            $context.removeClass(config.animateLeaveClass).addClass(config.hideClass);
        }
    });
};

module.exports = {
    menu: function (options) {
        return this.each(function (index, el) {
            $(el).data('menu', new Menu(options, el));
        });
    }
};