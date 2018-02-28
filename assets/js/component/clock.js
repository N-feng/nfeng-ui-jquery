function Clock(options) {
    options = options || {};
    return new ClockConstructor(options);
}

var ClockConstructor = function (options) {
    this.options = null;
    this.$template = null;
    this.timer = null;
    this.init(options);
};

ClockConstructor.DEFAULT = {
    container : '.clock',
};

ClockConstructor.prototype = {
    getDefault() {
        return ClockConstructor.DEFAULT;
    },
    getOptions(options) {
        return $.extend({}, this.getDefault(), options);
    },
    getTemplate() {
        this.$template = $('<div class="dial">\n' +
            '    <div class="dot"></div>\n' +
            '    <div class="sec-hand"></div>\n' +
            '    <div class="sec-hand shadow"></div>\n' +
            '    <div class="min-hand"></div>\n' +
            '    <div class="min-hand shadow"></div>\n' +
            '    <div class="hour-hand"></div>\n' +
            '    <div class="hour-hand shadow"></div>\n' +
            '    <span class="twelve">12</span>\n' +
            '    <span class="three">3</span>\n' +
            '    <span class="six">6</span>\n' +
            '    <span class="nine">9</span>\n' +
            '    <span class="diallines"></span>\n' +
            '    <div class="date"></div>\n' +
            '</div>');

        return this.$template;
    },
    showDiallines() {
        // var dialLines = document.getElementsByClassName('diallines');
        //
        // for (var i = 1; i < 60; i++) {
        //     dialLines[i] = $(dialLines[i-1]).clone()
        //         .insertAfter($(dialLines[i-1]));
        //     $(dialLines[i]).css('transform', 'rotate(' + 6 * i + 'deg)');
        // }

        for (var i = 1; i < 60; i++) {
            $($('.diallines').eq(i - 1)).clone()
                .insertAfter($('.diallines').eq(i - 1))
                .css('transform', 'rotate(' + 6 * i + 'deg)');
        }
    },
    showDate() {
        var date = new Date();
        var day = date.getDate();
        $('.date').text(day);
    },
    init(options) {
        this.options = this.getOptions(options);

        this.getTemplate().appendTo(this.options.container);
        this.showDiallines();
        this.showDate();
        this.startTimer();
    },
    tick() {
        var date = new Date();
        var seconds = date.getSeconds();
        var minutes = date.getMinutes();
        var hours = date.getHours();

        var secAngle = seconds * 6;
        var minAngle = minutes * 6 + seconds * (360/3600);
        var hourAngle = hours * 30 + minutes * (360/720);

        $('.sec-hand').css('transform', 'rotate(' + secAngle + 'deg)');
        $('.min-hand').css('transform', 'rotate(' + minAngle + 'deg)');
        $('.hour-hand').css('transform', 'rotate(' + hourAngle + 'deg)');

    },
    startTimer() {
        this.timer = setInterval(this.tick, 100)
    }
};

module.exports = {
  clock: Clock
};