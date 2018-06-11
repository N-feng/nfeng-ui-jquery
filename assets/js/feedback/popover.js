let IUI_UTILS = require('../base/utils');

var template = '<div class="IUI-popover-container">{{header}}{{content}}</div>';

var defaults = {
    handle: '[data-popover]', //绑定监听对象
    container: 'body', //全局作用域
    direction: 'down-center',
    compiler: null, //有无模板引擎
    header: '' //标题
};

// matrix : 
// 0 => 参照物x,
// 1 => 参照物y,
// 2 => 参照物w,
// 3 => 参照物h,
// 4 => 模板w,
// 5 => 模板h,
// 6 => 作用域元素x,
// 7 => 作用域元素y
// 8 => scrollTop
var tplDir = {
    left: function(matrix) {
        return matrix[0] - matrix[4] - matrix[6] - 20;
    },
    right: function(matrix) {
        return matrix[0] + matrix[2] * 2 - matrix[6] + 20;
    },
    up: function(matrix) {
        return matrix[1] - matrix[5] - matrix[7] - 20;
    },
    down: function(matrix) {
        return matrix[1] + matrix[3]  - matrix[7] + 20;
    }
};

var arrowDir = {
    left: function(matrix) {
        return matrix[0]  - matrix[6];
    },
    right: function(matrix) {
        return matrix[0] + matrix[2]*2 - matrix[4]  - matrix[6];
    },
    center: function(matrix) {
        return matrix[0] + matrix[2] - (matrix[4]/2)  - matrix[6];
    },
    top: function(matrix) {
        return matrix[1] - matrix[7];
    },
    bottom: function(matrix) {
        return matrix[1] + matrix[3] - matrix[5] - matrix[7];
    },
    middle: function(matrix) {
        return matrix[1]+ (matrix[3]/2) - (matrix[5]/2) - matrix[7];
    }
};

function Popover(config) {
    this.$selector = $(config.handle);
    this.$container = $(config.container);
    this.config = config;
    this.init();
}

Popover.prototype.init = function() {
    var _this = this;

    // show
    _this.$container.on('click.popover', _this.config.handle, function(event) {
        var $this = $(this);
        var eventSpace = $this.data('popoverid') ? ('.popover-' + $this.data('popoverid')) : '.popover';

        if ($this.hasClass('popover-active')) {
            _this.hide($this.removeClass('popover-active').data('template'));
            return false;
        } else {
            $this.addClass('popover-active');
        }

        $.pub('before' + eventSpace, [_this, $this]);
        $('body').trigger('click.popover');
        _this.show($this);
        $.pub('after' + eventSpace, [_this, $this]);
        event.stopPropagation();
    });

    // hide
    $('body').on('click.IUI-popover', function(event) {
        var $this = $(this);
        if (($(event.target).closest('.IUI-popover-container').length === 0)) {
            $this.trigger('hide.popover', [_this]);
            _this.hide();
        }
    });

};

// 获取调用者的位置
Popover.prototype.getEmitterPos = function(emitter) {
    var $emitter = emitter;
    var pos = $emitter[0].getBoundingClientRect();
    var emitterPosX = pos.left;
    var emitterPosY = pos.top;
    var emitterWidth = $emitter.outerWidth() / 2;
    var emitterHeight = $emitter.outerHeight();
    return [emitterPosX, emitterPosY, emitterWidth, emitterHeight];
};

// 填充内容
Popover.prototype.fillContent = function(emitter) {
    var _this = this;
    var config = _this.config;
    var $emitter = emitter;
    var header = $emitter.attr('data-ppHeader') || config.header;
    var str = $emitter.attr('data-popover');
    var isEl = str.indexOf('##') === 0;
    var $content = isEl ? str.slice(2, str.length) : $(str);

    var _template = template.replace('{{header}}', header ? '<div class="popover-header">' + header + '</div>' : '');

    if (!isEl && emitter.data('data') && config.compiler) {
        _template = _template.replace('{{content}}', config.compiler($content.html(), $emitter));
    } else {
        _template = _template.replace('{{content}}', isEl ? '<div class="popover-content">' + $content + '</div>' : $content.html());
    }

    return _template;

};

Popover.prototype.getPosition = function($target, $template) {
    let self = this;
    let config = self.config;
    // 父类、作用域矩形集合
    let ctxPos = $(config.container)[0].getBoundingClientRect();
    // target矩形集合
    let targetMatrix = self.getEmitterPos($target);
    // 模板矩形集合
    let tmpWidth = $template.outerWidth();
    let tmpHeight = $template.outerHeight();
    // 组合矩形集合
    let matrix = targetMatrix.concat([tmpWidth, tmpHeight, ctxPos.left, ctxPos.top]);
    // 判断目标方向
    let dirName = $target.attr('data-ppDirect') || config.direction;
    let customDir = dirName.split('-');
    let index = 'left right'.indexOf(customDir[0]) !== -1 ? 0 : 1;

    let position = [];
    position[index] = tplDir[customDir[0]](matrix);
    position[index ? 0 : 1] = arrowDir[customDir[1]](matrix);
    position[2] = dirName;
    return position;
};


Popover.prototype.show = function(emitter) {
    var _this = this;
    var config = _this.config;
    var $emitter = emitter;
    var content = _this.fillContent($emitter);
    var $template = $(content);
    var $body = $('body');

    $emitter.data('template', $template);
    _this.$container.data('popoverInit', _this.$container.css('position')).css({ 'position': 'relative' });
    $template.addClass('popover-show').appendTo(config.container);

    let position = _this.getPosition(emitter, $template);
    $template.css({
        'left': position[0] + _this.$container.scrollLeft() + $body.scrollLeft(),
        'top': position[1] + _this.$container.scrollTop() + $body.scrollTop()
    }).addClass('popover-in '+position[2]);

};

Popover.prototype.hide = function(target) {
    var _this = this;
    var $target = target || $('.IUI-popover-container');
    var $container = _this.$container;

    if (!target) {
        $('[data-popover]').removeClass('popover-active');
    }

    $container.css('position', $container.data('popoverInit'));

    IUI_UTILS.transitionEndShim($target.removeClass('popover-in'), function() {
        $target.remove();
    });

};

module.exports = {
    popover: function(config) {
        return new Popover($.extend({}, defaults, config));
    }
};
