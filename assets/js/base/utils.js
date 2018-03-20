module.exports = {
    ievs : (function getInternetExplorerVersion() {
        var rv = null, ua, re;
        if (navigator.appName === 'Microsoft Internet Explorer') {
            ua = navigator.userAgent;
            re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) !== null)
                rv = parseFloat(RegExp.$1);
        } else if (navigator.appName === 'Netscape') {
            ua = navigator.userAgent;
            re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) !== null)
                rv = parseFloat(RegExp.$1);
        }
        return parseInt(rv);
    })(),
    animateEnd    : 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
    transitionEnd : 'webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd',
    isPlaceholder : function () {
        var input = document.createElement('input');
        return 'placeholder' in input;
    },
    throttle : function (func, wait, options) {
        var context, args, result;
        var timeout = null;
        // 上次执行时间点
        var previous = 0;
        if (!options) options = {};
        // 延迟执行函数
        var later = function () {
            // 若设定了开始边界不执行选项，上次执行时间始终为0
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function () {
            var now = new Date().getTime();
            // 首次执行时，如果设定了开始边界不执行选项，将上次执行时间设定为当前时间。
            if (!previous && options.leading === false) previous = now;
            // 延迟执行时间间隔
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            // 延迟时间间隔remaining小于等于0，表示上次执行至此所间隔时间已经超过一个时间窗口
            // remaining大于时间窗口wait，表示客户端系统时间被调整过
            if (remaining <= 0 || remaining > wait) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
                //如果延迟执行不存在，且没有设定结尾边界不执行选项
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    },
    debounce : function (func, wait, immediate) {
        var timeout, args, context, timestamp, result;

        var later = function () {
            var last = new Date().getTime() - timestamp;
            if (last < wait && last > 0) {
                timeout = setTimeout(later, wait - last);
            } else {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                }
            }
        };

        return function () {
            context = this;
            args = arguments;
            timestamp = new Date().getTime();
            var callNow = immediate && !timeout;
            if (!timeout) timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
                context = args = null;
            }

            return result;
        };
    },
    scrollBarWidth : (function () {
        var scrollbarWidth;
        var $scrollDiv = $('<div/>');
        $scrollDiv.css({
            'width'    : 100,
            'height'   : 100,
            'overflow' : 'scroll',
            'position' : 'absolute',
            'top'      : -9999
        });
        $('html').append($scrollDiv);
        scrollbarWidth = $scrollDiv[0].offsetWidth - $scrollDiv[0].clientWidth;
        $scrollDiv.remove();
        return scrollbarWidth;
    }()),
    animateEndShim : function (el, fn, animateDisable) {
        if (this.ievs < 10 || animateDisable) {
            fn();
        } else {
            el.on(this.animateEnd, fn);
        }
    },
    transitionEndShim : function (el, fn, animateDisable) {
        if (this.ievs < 10 || animateDisable) {
            fn();
        } else {
            el.on(this.transitionEnd, fn);
        }
    },
    extend : function (out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];

            if (!obj) {
                continue;
            }
            obj.hasOwnProperty = obj.hasOwnProperty || Object.prototype.hasOwnProperty;
            //Object.prototype.hasOwnProperty.call(window, key)
            for (var key in obj) {

                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object') {
                        out[key] = this.extend(out[key], obj[key]);
                    } else {
                        out[key] = obj[key];
                    }
                }
            }
        }

        return out;
    }
};
