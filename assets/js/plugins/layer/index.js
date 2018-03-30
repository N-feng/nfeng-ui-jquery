let commonUtils = require('../../base/utils');
let Utils = require('./utils');
let View = require('./view');
let Event = require('./event');
let defaults = {
    container: 'body',
    boxType: 'layer',
    content: '',
    dynamic: false,
    animateEnterClass: 'slideDown-enter-active',
    animateLeaveClass: 'slideDown-leave-active',
    hideClass: 'hide',
    offsetWidth: 'auto',
    offsetHeight: 'auto',
    allHandle: '.btn-all',
    reverHandle: '.btn-rever',
    confirmHandle: '.btn-confirm',
    closeHandle: '.btn-close',
    confirmCall: function () {
    }
};
let EVENT_SPACE = {
    click: 'click.layer'
};

function Layer(options, selector) {
    this.$selector = $(selector);
    this.config = $.extend({}, defaults, options);
    //创建遮罩层
    this.$backdrop = $('<div class="layer-backdrop"></div>');
    this.init();
}

$.extend(Layer.prototype, View);

Layer.prototype.init = function () {
    let _this = this;
    let config = _this.config;
    let template = Utils.createTemplate(config);
    let $selector = _this.$selector = _this.$selector.length ? _this.$selector : $(template);
    let $content = $selector.find('.' + config.boxType + '-content');
    let layerWidth = Number($selector.data('width')) || config.offsetWidth;
    let layerHeight = Number($selector.data('height')) || config.offsetHeight;

    if (!config.dynamic) {
        $selector.appendTo(config.container);
    }

    $content.css({
        width: layerWidth,
        height: layerHeight
    });
    config.width = $selector.width();
    $selector.addClass('hide');
    $selector.data('layer', _this);
    _this.bindEvent();

};

Layer.prototype.bindEvent = function () {
    let _this = this;
    let $selector = _this.$selector;
    let config = _this.config;

    $selector.on(EVENT_SPACE.click, function (event) {
        event.stopPropagation();
    });

    $selector.on(EVENT_SPACE.click, config.allHandle, function (event) {
        Event.selectAll.call(_this, event);
    });

    $selector.on(EVENT_SPACE.click, config.reverHandle, function (event) {
        Event.selectRever.call(_this, event);
    });

    $selector.on(EVENT_SPACE.click, config.closeHandle, $.proxy(_this.hideDialog, _this));

    // $(config.container).on(EVENT_SPACE.click, function (event) {
    //   if(_this.$selector.hasClass(config.hideClass)
    //     && $(event.target)[0] === $(config.target)[0]) {
    //     _this.showDialog();
    //   } else {
    //     _this.hideDialog();
    //   }
    // });
    //
    // commonUtils.animateEndShim(_this.$selector, function () {
    //   if (_this.$selector.hasClass(config.animateLeaveClass)) {
    //     _this.$selector
    //       .removeClass(config.animateLeaveClass)
    //       .addClass(config.hideClass);
    //   }
    // });

};

module.exports = {
    layer: function (options) {
        return new Layer(options, this);
    }
};