let utils = require('../base/utils');
let defaults = {
    container: 'body',
    title: '',
    content: '',
    confirmText: '确定',
    cancelText: '取消',
    closeBtn: true,
    shadow: true,
    type: 'confirm',
    status: 'default',
    keyboard: true,
    before: function () {},
    confirm: function () {},
    cancel: function () {}
};

function Dialog(options) {
    this.config = $.extend({}, defaults, options);
    this.$selector = $(this.create());
    this.$overlay = $.overlay({
        container: this.config.container
    });
    this.init();
}

Dialog.prototype.init = function () {
    let config = this.config;
    let $selector = this.$selector;

    $selector.appendTo(config.container);
    this.event();
};

Dialog.prototype.event = function () {
    let self = this;
    let config = this.config;
    let $selector = this.$selector;

    if (config.shadow) {
        $selector.on('touchstart.dialog click.dialog', function (event) {
            event.preventDefault();
            self.hide();
        });
    }

    // 不再派发事件。
    $selector.on('touchstart.dialog click.dialog', '.dialog-main', function (event) {
        event.stopPropagation();
    });

    // 点击确认按钮
    $selector.on('touchstart.dialog click.dialog', '.dialog-confirm', function () {
        config.confirm(self);
        self.hide();
    });

    // 点击取消,关闭按钮
    $selector.on('touchstart.dialog click.dialog', '.dialog-cancel,.dialog-close', function () {
        config.cancel(self);
        self.hide();
    });

    // 键盘事件 27 => esc 13 => enter
    if (config.keyboard) {
        $selector.on('keyup.dialog', function (event) {
            if (event.keyCode === 27) {
                $selector.find('.dialog-cancel,.dialog-close').trigger('click.dialog');
            }
            if (event.keyCode === 13) {
                $selector.find('.dialog-confirm').trigger('click.dialog');
            }
        });
    }

    // 动画结束事件
    utils.animateEndShim($selector.find('.dialog-main'), function () {
        if ($(this).hasClass('dialog-opening')) {
            $(this).removeClass('dialog-opening');
        } else {
            $(this).removeClass('dialog-closing');
            $selector.addClass('hide');
        }
    });
};

Dialog.prototype.show = function () {
    let config = this.config;
    let $selector = this.$selector;

    config.before(this);
    $selector.removeClass('hide');
    $selector.find('.dialog-main').addClass('dialog-opening');
    $selector.focus();

    if (config.shadow) {
        $.overlay(true);
    }
};

Dialog.prototype.hide = function () {
    let $selector = this.$selector;

    $selector.find('.dialog-main').addClass('dialog-closing');
    $.overlay(false);
};

Dialog.prototype.create = function () {
    let config = this.config;
    let isConfirm = config.type === 'confirm';
    let _title = '<div class="pull-left"><span class="dialog-title">' + config.title + '</span></div>';
    let _closeBtn = '<div class="pull-right"><a href="javascript:;" class="dialog-close icon-close"></a></div>';
    let _header = '<div class="dialog-header clearfix">' + _title + (config.closeBtn ? _closeBtn : '') + '</div>';
    let _content = '<div class="dialog-content">' + (config.content || '') + '</div>';
    let _confirmBtn = '<a href="javascript:;" class="btn btn-primary btn-sm dialog-confirm">' + config.confirmText + '</a>';
    let _cancelBtn = '<a href="javascript:;" class="btn btn-default btn-sm dialog-cancel">' + config.cancelText + '</a>';
    let _footer = '<div class="dialog-footer">' + _confirmBtn + (isConfirm ? _cancelBtn : '') + '</div>';
    let _main = _header + _content + _footer;
    let template = '<div class="dialog-container hide" tabindex="10"><div class="dialog-main ' + config.status + '">' + _main + '</div></div>';
    return template;
};

module.exports = {
    dialog: function (options) {
        return new Dialog(options);
    }
};