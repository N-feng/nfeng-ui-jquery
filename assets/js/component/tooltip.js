let defaults = {
    container: 'body',
    handle: '[content]',
    offsetX: 10,
    offsetY: 10,
    duration: 100
};

// 位置计算
let positionCalc = {
    left: function (options, template) {
        let _this = this;
        let srcX = options.left;
        let srcY = options.top;
        let srcH = options.height;
        let destW = template.outerWidth();
        let destH = template.outerHeight();
        return [srcX - destW - _this.config.offsetX, srcY + ((srcH - destH) / 2)];
    },
    right: function (options, template) {
        let _this = this;
        let srcX = options.left;
        let srcY = options.top;
        let srcW = options.width;
        let srcH = options.height;
        let destH = template.outerHeight();
        return [srcX + srcW + _this.config.offsetX, srcY + ((srcH - destH) / 2)];
    },
    top: function (options, template) {
        let _this = this;
        let srcX = options.left;
        let srcY = options.top;
        let srcW = options.width;
        let destW = template.outerWidth();
        let destH = template.outerHeight();
        return [(srcW / 2) + srcX - (destW / 2), srcY - destH - _this.config.offsetY];
    },
    bottom: function (options, template) {
        let _this = this;
        let srcX = options.left;
        let srcY = options.top;
        let srcW = options.width;
        let srcH = options.height;
        let destW = template.outerWidth();
        return [(srcW / 2) + srcX - (destW / 2), srcY + srcH + _this.config.offsetY];
    }
};

function Tooltip(options) {
    this.config = $.extend({}, defaults, options);
    this.event();
}

Tooltip.prototype.event = function () {
    let self = this;
    let config = this.config;

    // 鼠标进入按钮的时候触发
    $(config.container).on('mouseenter.tooltip', config.handle, function (event) {
        let $target = $(event.target);
        let id = $target.attr('aria-describedby');
        let $template;
        if (!id) {
            //生成一个随机5位数，作为id
            let tooltipId = 'tooltip-';
            do {
                tooltipId += ~~(Math.random() * 100000)
            } while (document.getElementById(tooltipId));
            $target.attr('aria-describedby', tooltipId);
            $template = $(self.create(event)).appendTo(config.container);
        } else {
            $template = $('#' + id);
        }
        self.show($target, $template);
    });

    // 鼠标离开按钮的时候触发
    $(config.container).on('mouseleave.tooltip', config.handle, function (event) {
        let $target = $(event.target);
        let id = $target.attr('aria-describedby');
        let $template = $('#' + id);
        self.hide($target, $template);
    });

    // 鼠标进入模板的时候触发
    $(config.container).on('mouseenter.tooltip', '.tooltip', function (event) {
        let $template = $(event.target);
        let id = $template.attr('id');
        let $target = $('[aria-describedby="' + id + '"]');
        self.show($target, $template);
    });

    // 鼠标离开模板的时候触发
    $(config.container).on('mouseleave.tooltip', '.tooltip', function (event) {
        let $template = $(event.target);
        let id = $template.attr('id');
        let $target = $('[aria-describedby="' + id + '"]');
        self.hide($target, $template);
    });
};

Tooltip.prototype.show = function ($target, $template) {
    let direct = $target.attr('placement') || 'left';
    let bcr = $target[0].getBoundingClientRect();
    let pos = positionCalc[direct].call(this, bcr, $template);
    let disabled = $target.data('disabled');
    let timer = $target.data('timer');
    clearTimeout(timer);
    if (!disabled) {
        $template.addClass('tooltip-show').css({'left': pos[0], 'top': pos[1]});
    }
};

Tooltip.prototype.hide = function ($target, $template) {
    let config = this.config;
    let timer = $target.data('timer');
    let duration = config.duration;
    if (duration > 0) {
        timer = setTimeout(function () {
            $template.removeClass('tooltip-show');
        }, duration);
        $target.data('timer', timer);
    }
};

Tooltip.prototype.create = function (event) {
    let tooltipId = $(event.target).attr('aria-describedby');
    let content = $(event.target).attr('content') || '';
    let direct = $(event.target).attr('placement') || 'left';
    let template = '<div class="tooltip tooltip-' + direct + '" id="' + tooltipId + '">' + content + '</div>';
    return template;
};

module.exports = {
    tooltip: function (options) {
        return new Tooltip(options);
    }
};
