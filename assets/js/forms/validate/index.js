let Utils = require('./utils');
let View = require('./view');
let Event = require('./event');
let defaults = {
    strategy: Utils.GLOB_STRATEGY
};
let EVENT_SPACE = {
    change: 'change.validate',
    blur: 'blur.validate'
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
            View.errorPrompt("validate:cannot find element by name=\"" + item.name + "\"");
        }
        if (item.required) {
            let trigger = EVENT_SPACE[item.trigger];
            let target = '[name="' + item.name + '"]';
            self.$selector.on(trigger, target, $.proxy(Event.emitter, self))
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
        View.errorPrompt("validate:cannot find collections by name=\"" + fieldName + "\"");
        return false;
    }

    $.each(collections.matches, function (index, item) {
        strategy = self.config.strategy[index];
        if (strategy === void (0)) {
            View.errorPrompt("validate:cannot find strategy by name=\"" + index + "\"");
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
        View.message($context, status, message);
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