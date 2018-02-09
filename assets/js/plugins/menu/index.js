var ENP = {
    click: 'click.menu',
    mouseover: 'mouseover.menu',
    mouseleave: 'mouseleave.menu'
};

function Menu(options, selector) {
    var defaults = {
        trigger: 'click'
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
    config.trigger === 'click' ? _this.bindClickEvent() : '';
    config.trigger === 'hover' ? _this.bindHoverEvent() : '';

    // 点击菜单active 变化
    _this.$el.on(ENP.click, '.menu-item', function () {
        _this.$el.find('.menu-item').removeClass('active');
        $(this).addClass('active');
        $(this).parents('.menu-sub').siblings('.menu-title').addClass('active')
            .parent('li').siblings('li').find('.menu-title').removeClass('active');
    });
    _this.$el.on(ENP.click, '.menu-title', function () {
        _this.$el.find('.menu-item').removeClass('active');
        $(this).addClass('active');
        $(this).addClass('active')
            .parent('li').siblings('li').find('.menu-title').removeClass('active');
    });
};

Menu.prototype.bindClickEvent = function () {
    var _this = this;

    // 点击菜单标题展开内容
    _this.$el.on(ENP.click, '.menu-title', function () {
        if ($(this).hasClass('menu-open')) {
            $(this).siblings('.menu-sub').slideUp();
        } else {
            $(this).siblings('.menu-sub').slideDown();
        }
        $(this).toggleClass('menu-open');
    });
};

Menu.prototype.bindHoverEvent = function () {
    var _this = this;

    // 鼠标放在菜单效果
    _this.$el.on(ENP.mouseover, 'li', function () {
        $(this).find('.menu-sub').slideDown();
        $(this).find('.menu-title').addClass('menu-open');
    });

    // 鼠标离开菜单效果
    _this.$el.on(ENP.mouseleave, 'li', function () {
        $(this).find('.menu-sub').slideUp();
        $(this).find('.menu-title').removeClass('menu-open');
    });
};

module.exports = {
    menu: function (options) {
        return this.each(function (index, el) {
            $(el).data('menu', new Menu(options, el));
        });
    }
};