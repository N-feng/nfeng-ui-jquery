let commonUtils = require('../../base/utils');
let View = {
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
        commonUtils.transitionEndShim($message, function () {
            $(this).removeClass('zoomTop-enter-active');
        });
    },
    errorPrompt: function (msg) {
        if (window.console) {
            console.warn(msg)
        } else {
            throw msg
        }
    }
};
module.exports = View;