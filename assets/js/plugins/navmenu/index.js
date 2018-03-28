let defaults = {
    mode: 'vertical',
    container: 'body',
    trigger: 'click',
    closeHandle: '.menu-close',
    openHandle: '.menu-spread'
};

function Menu(options, selector) {
    this.config = null;
    this.$el = $(selector);
    this.init(options);
}

Menu.prototype.init = function (options) {
    this.config = $.extend({}, defaults, options);
    this.showActive();
    this.bindEvent();
};

Menu.prototype.showActive = function () {
    let url = window.location.href;
    let str = '#' + $.getHash(url);
    let $target = $("[href='"+str+"']");
    $target.addClass('active');
    $target.parents('.menu-popup').removeClass('hide');
    $target.parents('.menu-popup').siblings('.menu-item').addClass('active menu-open');
};

Menu.prototype.bindEvent = function () {
    let _this = this;
    let config = _this.config;
    config.mode === 'vertical' ? _this.bindVerticalEvent() : '';
    config.mode === 'horizontal' ? _this.bindHorizontalEvent() : '';
    config.mode === 'inline' ? _this.bindInlineEvent() : '';
    // 点击菜单active 变化
    _this.$el.on('click.menuActive', '.menu-item', function () {
        if ($(this).siblings('.menu-popup').length) {
            $(this).toggleClass('menu-open');
        } else {
            _this.$el.find('.menu-item').removeClass('active').children('span').removeClass('active');
            $(this).addClass('active').children('.menu-item').addClass('active');
            $(this).parents('.menu-popup').siblings('.menu-item').addClass('active');
        }
    });
    // 菜单收起、展开按钮操作
    $(config.container).on('click.menu', config.closeHandle, function () {
        if(_this.$el.hasClass('menu-vertical')) {
            _this.$el.removeClass('menu-vertical').addClass('menu-inline');
            $(event.target).addClass('active').siblings('button').removeClass('active');
            _this.$el.find('[content]').data('disabled', false);
            _this.unbindEvent();
            _this.bindInlineEvent();
        }
    });
    $(config.container).on('click.menu', config.openHandle, function () {
        if(_this.$el.hasClass('menu-inline')) {
            _this.$el.removeClass('menu-inline').addClass('menu-vertical');
            $(event.target).addClass('active').siblings('button').removeClass('active');
            _this.$el.find('[content]').data('disabled', true);
            _this.unbindEvent();
            _this.bindVerticalEvent();
        }
    });
};

Menu.prototype.unbindEvent = function () {
    this.$el.find('li').unbind('mouseenter').unbind('mouseleave');
    this.$el.off('click.menuSlide');
};

Menu.prototype.bindHorizontalEvent = function () {
    // 水平菜单绑定事件
    this.$el.find('li').hover(function () {
        $(this).children('.menu-popup').fadeIn();
        $(this).children('.menu-item').addClass('hover');
    }, function() {
        $(this).children('.menu-popup').fadeOut();
        $(this).children('.menu-item').removeClass('hover');
    });
};

Menu.prototype.bindVerticalEvent = function () {
    // 垂直菜单绑定事件
    this.$el.on('click.menuSlide', '.menu-item', function () {
        $(this).siblings('.menu-popup').slideToggle();
    })
};

Menu.prototype.bindInlineEvent = function () {
    // 内嵌菜单绑定事件
    this.$el.find('li').hover(function () {
        $(this).children('.menu-popup').fadeIn();
        $(this).children('.menu-item').addClass('hover');
    }, function() {
        $(this).children('.menu-popup').fadeOut();
        $(this).children('.menu-item').removeClass('hover');
    });
};

module.exports = {
    menu: function (options) {
        return this.each(function (index, el) {
            $(el).data('menu', new Menu(options, el));
        });
    }
};