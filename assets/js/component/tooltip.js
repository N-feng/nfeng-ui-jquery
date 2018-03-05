function Tooltip(options) {
    return new TooltipConstructor(options);
}

function TooltipConstructor(options, selector) {
    this.options = null;
    this.$selector = $(selector);
    this.init(options);
}

TooltipConstructor.DEFAULT = {
    container: 'body',
    handle: '[content]',
    offsetX: 10,
    offsetY: 10,
    duration: 100
};

// 位置计算
TooltipConstructor.PositionCalc = {
    left(bcr, template) {
        let srcX = bcr.left;
        let srcY = bcr.top;
        let srcH = bcr.height;
        let destW = template.outerWidth();
        let destH = template.outerHeight();
        return [srcX - destW - this.options.offsetX, srcY + ((srcH - destH) / 2)];
    },
    right(bcr, template) {
        let srcX = bcr.left;
        let srcY = bcr.top;
        let srcW = bcr.width;
        let srcH = bcr.height;
        let destH = template.outerHeight();
        return [srcX + srcW + this.options.offsetX, srcY + ((srcH - destH) / 2)];
    },
    top(bcr, template) {
        let srcX = bcr.left;
        let srcY = bcr.top;
        let srcW = bcr.width;
        let destW = template.outerWidth();
        let destH = template.outerHeight();
        return [(srcW / 2) + srcX - (destW / 2), srcY - destH - this.options.offsetY];
    },
    bottom(bcr, template) {
        let srcX = bcr.left;
        let srcY = bcr.top;
        let srcW = bcr.width;
        let srcH = bcr.height;
        let destW = template.outerWidth();
        return [(srcW / 2) + srcX - (destW / 2), srcY + srcH + this.options.offsetY];
    }
};

TooltipConstructor.prototype = {
    getDefault() {
        return TooltipConstructor.DEFAULT;
    },
    getOptions(options) {
        return $.extend({}, this.getDefault(), options);
    },
    getTemplate() {
        //生成一个随机5位数，作为id
        let tooltipId = 'tooltip-';
        do {
            tooltipId += ~~(Math.random() * 100000)
        } while (document.getElementById(tooltipId));
        let text = $(event.target).attr('content') || '';
        let direct = $(event.target).attr('placement') || 'left';
        let $template = $('<div class="tooltip" id="' + tooltipId + '">');
        $template.html(text);
        $template.addClass('tooltip-' + direct);
        $(event.target).attr('aria-describedby', tooltipId);
        return $template;
    },
    getPosition() {
        let tooltipId = $(event.target).attr('aria-describedby');
        let $template = $('#'+tooltipId);
        let direct = $(event.target).attr('placement') || 'left';
        let bcr = event.target.getBoundingClientRect();
        let pos = TooltipConstructor.PositionCalc[direct].call(this, bcr, $template);
        $template.css({'left': pos[0], 'top': pos[1]});
    },
    showTemplate() {
        let $target = $(event.target);
        let tooltipId = $target.attr('aria-describedby');
        let $template = $('#'+tooltipId);
        $template.addClass('tooltip-show');
    },
    init(options) {
        this.options = this.getOptions(options);
        $(this.options.container).on('mouseenter.tooltip', this.options.handle, $.proxy(this.show, this));
        $(this.options.container).on('mouseleave.tooltip', this.options.handle, $.proxy(this.hide, this));
        $(this.options.container).on('mouseenter.tooltip', '.tooltip', $.proxy(this.clearTimer, this));
        $(this.options.container).on('mouseleave.tooltip', '.tooltip', $.proxy(this.startTimer, this));
    },
    show() {
        let $target = $(event.target);
        let $parents = $target.parents(this.options.container);
        let disabled = $target.data('disabled');
        let text = $target.attr('content');
        if (!$target.attr('aria-describedby')&&text) {
            this.getTemplate().appendTo($parents);
        }
        if (!disabled) {
            this.getPosition();
            this.showTemplate();
        }
    },
    hide() {
        let $target = $(event.target);
        let tooltipId = $target.attr('aria-describedby');
        let $template = $('#'+tooltipId);
        let timer = $target.data('timer');
        let duration = this.options.duration;
        if (duration > 0) {
            timer = setTimeout(function () {
                $template.removeClass('tooltip-show');
            }, duration);
            $target.data('timer', timer);
        }
    },
    startTimer() {
        let $template = $(event.target);
        let id = $template.attr('id');
        let $target = $('[aria-describedby="'+id+'"]');
        let timer = $target.data('timer');
        let duration = this.options.duration;
        if (duration > 0) {
            timer = setTimeout(function () {
                $template.removeClass('tooltip-show');
            }, duration);
            $target.data('timer', timer);
        }
    },
    clearTimer() {
        let $template = $(event.target);
        let id = $template.attr('id');
        let $target = $('[aria-describedby="'+id+'"]');
        let timer = $target.data('timer');
        clearTimeout(timer);
    }
};

module.exports = {
    tooltip: Tooltip
};
