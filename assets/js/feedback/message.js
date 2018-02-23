function Message(options) {
    // 返回MessageConstructor实例
    return new MessageConstructor(options);
}

var MessageConstructor = function (options) {
    this.options = null;
    this.$element = null;
    this.msgId = null;
    this.closed = false;
    this.timer = null;
    this.init(options);
};

MessageConstructor.DEFAULT = {
    container : 'body',
    type: 'info',
    customClass: '',
    duration: 3000,
    message: '',
    showClose: false,
    onClose: null
};

MessageConstructor.prototype.getDefault = function () {
    return MessageConstructor.DEFAULT;
};

MessageConstructor.prototype.getOptions = function (options) {
    return $.extend({}, this.getDefault(), options);
};

MessageConstructor.prototype.init = function (options) {
    this.options = this.getOptions(options);
    //生成一个随机5位数，作为id
    var msgId = 'msgId-';
    do {
        msgId += ~~(Math.random() * 100000)
    } while (document.getElementById(msgId));
    this.msgId = msgId;
    this.customClass = this.options.customClass;
    this.type = this.options.type;
    this.message = this.options.message;
    var typeIcon = "";
    switch (this.type.toLowerCase()) {
        case 'info':
            typeIcon = "fa fa-info-circle";
            break;
        case 'success':
            typeIcon = "fa fa-info-circle"
            break;
        case 'warning':
            typeIcon = "fa fa-info-circle";
            break;
        case 'error':
            typeIcon = "fa fa-info-circle";
            break;
        default:
            throw new Error('类型必须为["info","success","warning","error"]其中之一')
            break;
    }
    var closeBtn = "";
    if (this.options.showClose) {
        closeBtn = '<div class="jq-message__closeBtn">&times;</div>'
    }
    var obj = $('<div class="message" id="' + msgId + '">');
    obj.appendTo(this.options.container);
    obj.html('<i class="' + typeIcon + '"></i>' +
        '<div class="message-content">' + this.message + '</div>');
    // var msg = '<div class="jq-message begin ' + this.customClass + '" id="' + msgId + '">' +
    //     '<i class="' + typeIcon + '"></i>' +
    //     '<div class="jq-message__group">' + this.message + '</div>' +
    //     closeBtn + '</div>';
    // $(this.options.container).append(msg);
    this.$element = obj;
};

module.exports = {
    message: Message
};