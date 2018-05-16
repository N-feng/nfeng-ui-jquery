let defaults = {
    container : 'body',
    type: 'info',
    iconClass: '',
    customClass: '',
    duration: 3000,
    message: '',
    showClose: false,
    center: false,
    onClose: null,
    animateEnterClass : 'message-fade-enter',
    animateLeaveClass : 'message-fade-leave-active',
    icon: true,
};

function Message (options) {
    //生成一个随机5位数，作为id
    let msgId = 'msgId-';
    do {
        msgId += ~~(Math.random() * 100000)
    } while (document.getElementById(msgId));
    this.msgId = msgId;
    this.closed = false;
    this.timer = null;

    this.config = $.extend({}, defaults, options);
    this.$selector = $(this.create());
    this.show();
    this.event();
}

Message.prototype.event = function () {
    let self = this;
    let $selector = this.$selector;
    $selector.on('transitionend', function () {
        if ($selector.hasClass('message-fade-leave-active')) {
            $selector.remove();
        }
    });
    // 点击取消,关闭按钮
    $selector.on('touchstart.message click.message', '.message-close', function () {
        self.hide();
    });
    // 鼠标hover事件
    $selector.hover(function () {
        self.clearTimer();
    }, function () {
        self.startTimer();
    });
};

Message.prototype.show = function () {
    let config = this.config;
    let $selector = this.$selector;

    $selector.appendTo(config.container);
    $selector.addClass('message-fade-enter');
    // 出现时动画,必须要用异步的方法移除类，而且时间必须大于0，否则可能不会有出现动画
    setTimeout(function () {
        $selector.removeClass('message-fade-enter');
    }, 100);
    this.startTimer();
};

Message.prototype.hide = function () {
    // 关闭即销毁
    let config = this.config;
    let $selector = this.$selector;
    this.closed = true;
    if (typeof config.onClose === 'function') {
        config.onClose(this);
    }
    //消失动画结束后销毁
    $selector.addClass('message-fade-leave-active');
};

Message.prototype.startTimer = function () {
    let self = this;
    let config = this.config;
    let duration = config.duration;
    if (duration > 0) {
        this.timer = setTimeout(function () {
            if (!self.closed) {
                self.hide();
            }
        }, duration);
    }
};

Message.prototype.clearTimer = function () {
    clearTimeout(this.timer);
};

Message.prototype.create = function () {
    let iconClass = {
        info: 'el-icon-info',
        success: 'el-icon-success',
        warning: 'el-icon-warning',
        error: 'el-icon-error',
    };
    let config = this.config;
    let _icon = '<i class="message-icon ' + (config.iconClass ? config.iconClass : iconClass[config.type]) + ' mr10"></i>';
    let _content = '<div class="message-content">' + (config.message || '') + '</div>';
    let _closeBtn = '<a href="javascript:;" class="message-close icon-close pull-right"></a>';
    let _main = (config.icon ? _icon : '') + _content + (config.showClose ? _closeBtn : '');
    let template = '<div class="message ' + config.type
        + (config.customClass ? ' ' + config.customClass : '')
        + (config.center ? ' is-center' : '') + '" id="' + this.msgId + '">'
        + _main + '</div>';
    return template;
};

function Constructor(options) {
    options = options || {};
    if (typeof options === "string") {
        options = {
            message: options
        };
    }
    return new Message(options);
}

module.exports = {
    message: Constructor
};