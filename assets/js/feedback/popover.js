let utils = require('../base/utils');

let template = '<div class="popover-container"><div class="popover-content"></div></div>';

let defaults = {
    handle: '[data-popover]', //绑定监听对象
    container: 'body', //全局作用域
    direction: 'right-top',
    compiler: null, //有无模板引擎
    header: '', //标题
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
let tplDir = {
    left: function(matrix) {
        return matrix[0] - matrix[4] - matrix[6] - 10;
    },
    right: function(matrix) {
        return matrix[0] + matrix[2] * 2 - matrix[6] + 10;
    },
    up: function(matrix) {
        return matrix[1] - matrix[5] - matrix[7] - 10;
    },
    down: function(matrix) {
        return matrix[1] + matrix[3]  - matrix[7] + 10;
    }
};

let arrowDir = {
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

function Popover(options) {
    this.config = $.extend({}, defaults, options);
    this.$selector = $(this.config.handle);
    this.$container = $(this.config.container);
    this.event();
}

Popover.prototype.event = function() {
    let self = this;
    let config = self.config;

    // show
    self.$container.on('click.popover', config.handle, function(event) {
        $('body').trigger('click.popover');
        self.show(event);
        event.stopPropagation();
    });

    // hide
    $('body').on('click.popover', function(event) {
        if($(event.target).closest('.popover-container').length === 0) {
            self.hide();
        }
    });

};

// 获取调用者的位置
Popover.prototype.getEmitterPos = function(emitter) {
    let $emitter = emitter;
    let pos = $emitter[0].getBoundingClientRect();
    let emitterPosX = pos.left;
    let emitterPosY = pos.top;
    let emitterWidth = $emitter.outerWidth() / 2;
    let emitterHeight = $emitter.outerHeight();
    return [emitterPosX, emitterPosY, emitterWidth, emitterHeight];
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
    let dirName = $target.attr('placement') || config.direction;
    let customDir = dirName.split('-');
    let index = 'left right'.indexOf(customDir[0]) !== -1 ? 0 : 1;

    let position = [];
    position[index] = tplDir[customDir[0]](matrix);
    position[index ? 0 : 1] = arrowDir[customDir[1]](matrix);
    position[2] = dirName;
    return position;
};

Popover.prototype.getTemplate = function(event) {
    let self = this;
    let config = self.config;
    let $target = $(event.target);
    let $template;
    // 获取模板id
    let id = $target.attr('aria-describedby');
    if(!id) {
        // 生成一个随机5位数，作为id
        let popoverId = 'popoverId-';
        do {
            popoverId += ~~(Math.random() * 100000)
        } while (document.getElementById(popoverId));
        $target.attr('aria-describedby', popoverId);
        $template = $(template).appendTo(config.container);
        self.bindTemplate($template);
        // 填充内容、也可以放到外围每次都重新渲染，或者加其它判定条件
        self.fillTemplate($target, $template);
    } else {
        $template = $('#' + id);
    }
    
    return $template;
};

Popover.prototype.fillTemplate = function($target, $template) {
    let self = this;
    let config = self.config;
    let str = $target.attr('data-popover');
    let isEl = str.indexOf('##') === 0;
    let $content = isEl ? str.slice(2, str.length) : $(str);
    let header = $target.attr('title') || config.header;
    let eventSpace = $target.data('popoverid') ? ('.popover-' + $target.data('popoverid')) : '.popover';
    let id = $target.attr('aria-describedby');
    $template.attr('id', id);

    $.pub('before' + eventSpace, [self, $target]);

    if(header) {
        if($template.find('.popover-header').length) {
            $template.find('.popover-header').html(header);
        } else {
            $template.prepend($('<div class="popover-header">').html(header));
        }
    }

    if(!isEl && $target.data('data') && config.compiler) {
        $template.find('.popover-content').html(config.compiler($content.html(), $target));
    } else {
        $template.find('.popover-content').html(isEl ? $content : $content.html());
    }

    $.pub('after' + eventSpace, [self, $target]);
};

Popover.prototype.bindTemplate = function($template) {
    utils.transitionEndShim($template, function () {
        if(!$template.hasClass('popover-in')) {
            $template.removeClass('popover-show').addClass('hide');
        }
    })
};

Popover.prototype.show = function(event) {
    let self = this;
    let $target = $(event.target);
    let $template = self.getTemplate(event);
    let position = self.getPosition($target, $template);
    let $body = $('body');

    $template.addClass('popover-show').removeClass('hide');
    $template.css({
        'left': position[0] + self.$container.scrollLeft() + $body.scrollLeft(),
        'top': position[1] + self.$container.scrollTop() + $body.scrollTop(),
    }).addClass('popover-in '+position[2]);
    $template.siblings('.popover-container').removeClass('popover-in');
};

Popover.prototype.hide = function() {
  $('.popover-container').removeClass('popover-in');
};

module.exports = {
    popover: function(options) {
        return new Popover(options);
    }
};
