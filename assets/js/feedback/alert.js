let defaults = {
    container: 'body',
    obj: '.alert',
    content: '',
    duration: 1000,
    status: 'info',
    callback: null,
    icon: true,
};

function Alert(options) {
    let config = this.config = $.extend({}, defaults, options);
    let callerStyle = config.obj.charAt(0) === '#' ? 'id' : 'class';
    this.$selector = $(config.obj).length === 0 ? $('<div ' + callerStyle + '="' + config.obj.slice(1) + '"/>').appendTo(config.container) : $(config.obj);
    this.show();
}

Alert.prototype.show = function () {
    let config = this.config;
    let $selector = this.$selector;

    $selector.html(this.create());
    clearTimeout($selector.data('count'));
    $selector.data('count', setTimeout(function () {
        $selector.find('.alert-context').addClass('hide');
        config.callback(this);
    }, config.duration))
};

Alert.prototype.create = function () {
    let iconClass = {
        info: 'el-icon-info',
        success: 'el-icon-success',
        warning: 'el-icon-warning',
        error: 'el-icon-error',
    };
    let config = this.config;
    let _icon = '<i class="' + iconClass[config.status] + ' mr10"></i>';
    let _content = '<span class="alert-text">' + config.content + '</span>';
    let template = '<div class="alert-context ' + config.status + '">' + (config.icon ? _icon : '') + _content + '</div>';
    return template;
};

module.exports = {
    alert: function (options) {
        return new Alert(options);
    }
};