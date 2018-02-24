function Tooltip(options) {
    options = options || {};
    let handle = options.handler || '[data-tooltip]';
    $(handle).each(function (index, selector) {
        new TooltipConstructor(options, selector);
    });
}

function TooltipConstructor(options, selector) {
    this.options = null;
    this.$selector = $(selector);
    this.$template = null;
    this.tooltipId = null;
    this.timer = null;
    this.init(options);
}

TooltipConstructor.DEFAULT = {
    container: 'body',
    offsetX: 10,
    offsetY: 10,
    onClose: null,
    animateEnterClass: 'zoom-big-fast-enter',
    animateEnterActiveClass: 'zoom-big-fast-enter-active',
    animateLeaveClass: 'zoom-big-fast-leave zoom-big-fast-leave-active',
    duration: 300,
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
    up(bcr, template) {
        let srcX = bcr.left;
        let srcY = bcr.top;
        let srcW = bcr.width;
        let destW = template.outerWidth();
        let destH = template.outerHeight();
        return [(srcW / 2) + srcX - (destW / 2), srcY - destH - this.options.offsetY];
    },
    down(bcr, template) {
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
        let tooltipId = 'tooltipId-';
        do {
            tooltipId += ~~(Math.random() * 100000)
        } while (document.getElementById(tooltipId));
        this.tooltipId = tooltipId;
        let tooltipOptions = (this.$selector.data('tooltipOptions') || '|').split('|');
        let text = this.$selector.data('tooltip') || '';
        let direct = tooltipOptions[0] || 'left';
        let size = tooltipOptions[1] || 'small';

        this.$template = $('<div class="tooltip" id="' + this.tooltipId + '">');
        this.$template.html(text);
        this.$template.addClass('tooltip-' + direct + ' tooltip-' + size);

        // 鼠标hover事件
        let self = this;
        this.$template.hover(function () {
            self.clearTimer();
        }, function () {
            self.startTimer();
        });

        return this.$template;
    },
    getPosition() {
        let tooltipOptions = (this.$selector.data('tooltipOptions') || '|').split('|');
        let direct = tooltipOptions[0] || 'left';
        let bcr = this.$selector[0].getBoundingClientRect();
        let pos = TooltipConstructor.PositionCalc[direct].call(this, bcr, this.$template);
        this.$template.css({'left': pos[0], 'top': pos[1]});
    },
    showTemplate() {
        // 出现时动画,必须要用异步的方法移除类，而且时间必须大于0，否则可能不会有出现动画
        let self = this;
        self.$template.addClass(self.options.animateEnterClass);
        setTimeout(function () {
            self.$template.addClass(self.options.animateEnterActiveClass).on('animationend', function () {
                self.$template.removeClass(self.options.animateEnterActiveClass).removeClass(self.options.animateEnterClass);
            });
        }, 300);
    },
    init(options) {
        this.options = this.getOptions(options);

        this.$selector.on('mouseenter.tooltip', $.proxy(this.show, this));
        this.$selector.on('mouseleave.tooltip', $.proxy(this.hide, this));
    },
    show() {
        this.clearTimer();
        if(!this.$template) {
            this.getTemplate().appendTo(this.options.container);
            this.getPosition();
            this.showTemplate();
        }
    },
    hide() {
        this.startTimer();
    },
    // 关闭即销毁
    close() {
        let self = this;
        if (typeof this.options.onClose === 'function') {
            this.options.onClose(this);
        }
        if(!this.$template) {
            return false;
        }
        //消失动画结束后销毁
        this.$template.addClass(this.options.animateLeaveClass).on('animationend', function () {
            self.$template.remove();
            self.$template = null;
        });
    },
    startTimer() {
        let self = this;
        let duration = self.options.duration;
        if (duration > 0) {
            self.timer = setTimeout(function () {
                self.close();
            }, duration);
        }
    },
    clearTimer() {
        clearTimeout(this.timer);
    }
};

module.exports = {
    tooltip: Tooltip
};
