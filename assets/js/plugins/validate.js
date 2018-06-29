let utils = require('../base/utils');

let GLOB_STRATEGY = {
    isNonEmpty: function(value) {
        // 是否为空
        if ($.trim(value).length === 0) {
            return false;
        }
    },
    isEmail: function(value) {
        //是否为邮箱
        if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(value)) {
            return false;
        }
    },
    between: function(value, params) {
        var length = value.length;
        var min = params.range[0];
        var max = params.range[1];
        if (length < min || length > max) {
            return false;
        }
    },
    isChecked: function() {
        //至少选中一项 radio || checkbox
        var result = void(0);
        this.each(function(index, el) {
            result = el.checked;
            return result ? false : true;
        });
        return result ? void(0) : false;
    },
    minLength: function(params) {
        //大于
        if (this.self[0].value.length < params.minLength) {
            return false;
        }
    },
    maxLength: function(params) {
        //小于
        if (this.self[0].value.length < params.maxLength) {
            return false;
        }
    },
    birthdayRange: function(params) {
        //生日范围
        var val = this.self[0].value;
        var min = params.range[0];
        var max = params.range[1];
        if (val < min || val > max) {
            return false;
        }
    },
    isBirthday: function(params) {
        //是否为生日
        if (!/^[1-9]\d{3}([-|\/|\.])?((0\d)|([1-9])|(1[0-2]))\1(([0|1|2]\d)|([1-9])|3[0-1])$/.test(this.self[0].value)) {
            return false;
        }
    },
    isMobile: function(params) {
        //是否为手机号码
        if (!/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(this.self[0].value)) {
            return false;
        }
    },
    //纯英文
    onlyEn: function(params) {
        if (!/^[A-Za-z]+$/.test(this.self[0].value)) {
            return false;
        }
    },
    //纯中文
    onlyZh: function(params) {
        if (!/^[\u4e00-\u9fa5]+$/.test(this.self[0].value)) {
            return false;
        }
    },
    //非整数
    notInt: function(params) {
        if (/^[0-9]*$/.test(this.self[0].value)) {
            return false;
        }
    },
    //数字包含小数
    onlyNum: function(params) {
        if (!/^[0-9]+([.][0-9]+){0,1}$/.test(this.self[0].value)) {
            return false;
        }
    },
    onlyInt: function(value) {
        //整数
        if (!/^[0-9]*$/.test(value)) {
            return false;
        }
    },
    //昵称
    isNickname: function(params) {
        if (!/^[A-Za-z0-9_\-\u4e00-\u9fa5]{2,20}$/i.test(this.self[0].value)) {
            return false;
        }
    }
};

// let View = require('./view');
// let Event = require('./event');
let defaults = {
    strategy: GLOB_STRATEGY
};

let EVENT_SPACE = {
    change: 'change.validate',
    blur: 'blur.validate'
};

let action = {
    message ($context, status, message) {
    	let contextClass = ['info', 'success', 'error'][status];
        let $message = $('<div class="form-message">');

        if ($context.hasClass('is-' + contextClass)) {
            $context.find('.form-message').html(message);
            return;
        }

        $context.removeClass('is-info is-success is-error').addClass('is-' + contextClass);
        $context.find('.form-message').remove();
        $context.append($message);
        $message.html(message).addClass(contextClass + ' zoomTop-enter zoomTop-enter-active');
        setTimeout(function () {
            $message.removeClass('zoomTop-enter');
        }, 100);
        utils.transitionEndShim($message, function () {
            $(this).removeClass('zoomTop-enter-active');
        });
    },
    errorPrompt: function (msg) {
        if (window.console) {
            console.warn(msg)
        } else {
            throw msg
        }
    },
    emitter (event) {
        let $target = $(event.target);
        let name = $target.attr('name');
        this.verify.call(this, name);
    },
};

function Validate (options, selector) {
    this.config = $.extend(true, {}, defaults, options);
    this.$selector = $(selector);
    this.bindEvent();
}

Validate.prototype.constructor = Validate;

Validate.prototype.bindEvent = function () {
    let self = this;

    // 检测哪些字段需要验证  Check which fields need validation.
    $.each(this.config.collections, function (index, item) {
        if (!$('[name="' + item.name + '"]').length) {
            action.errorPrompt("validate:cannot find element by name=\"" + item.name + "\"");
        }
        if (item.required) {
            let trigger = EVENT_SPACE[item.trigger];
            let target = '[name="' + item.name + '"]';
            self.$selector.on(trigger, target, $.proxy(action.emitter, self))
        }
    });
};

Validate.prototype.verify = function (fieldName) {
    let self = this;
    let collections = {}, status = false, message = '';

    $.each(this.config.collections, function (index, item) {
        if (item.name === fieldName) {
            collections = item;
            return false;
        }
    });

    let $target = this.$selector.find('[name="' + collections.name + '"]');
    let $context = $target.parents(collections.context).eq(0);
    let value = $target.val();
    let strategy;

    if (collections.matches === void (0)) {
        action.errorPrompt("validate:cannot find collections by name=\"" + fieldName + "\"");
        return false;
    }

    $.each(collections.matches, function (index, item) {
        strategy = self.config.strategy[index];
        if (strategy === void (0)) {
            action.errorPrompt("validate:cannot find strategy by name=\"" + index + "\"");
            return false;
        }
        let result = strategy.call($target, value, item);
        status = result === void (0) ? 1 : 2;
        if (status === 2) {
            message = item.errMsg;
            return false;
        }
    });

    if (strategy) {
        action.message($context, status, message);
    }

    return status;
};

Validate.prototype.batch = function () {
    let self = this;
    let status = [];

    $.each(this.config.collections, function (index, item) {
        let result = self.verify(item.name);
        status.push(result);
    });

    return $.inArray(2, status) === -1 ? true : false;
};

Validate.prototype.resetField = function () {
    this.$selector[0].reset();
    $.each(this.config.collections, function (index, item) {
        $('[name="' + item.name + '"]')
            .parents(item.context)
            .removeClass('is-info is-success is-error').find('.form-message').remove();
    })
};

module.exports = {
    validate: function (options) {
        return new Validate(options, this);
    }
};