module.exports = {
	ievs: (function getInternetExplorerVersion() {
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
	animateEnd	  : 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
	transitionEnd : 'webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd',
	animateEndShim: function (el, fn, animateDisable) {
		if (this.ievs < 10 || animateDisable) {
			fn();
		} else {
			el.on(this.animateEnd, fn);
		}
	},
	transitionEndShim: function (el, fn, animateDisable) {
		if (this.ievs < 10 || animateDisable) {
			fn();
		} else {
			el.on(this.transitionEnd, fn);
		}
	},
	throttle: function (func, wait, options) {
		var context, args, result;
		var timeout = null;
		var previous = 0;
		if (!options) options = {};
		var later = function () {
			previous = options.leading === false ? 0 : new Date().getTime();
			timeout = null;
			result = func.apply(context, args);
			if (!timeout) context = args = null;;
		};
		return function () {
			var now = new Date().getTime();
			if (!previous && options.leading === false) previous = now;
			var remaining = wait - (now - previous);
			context = this;
			args = arguments;
			if (remaining <= 0 || remaining > wait) {
				clearTimeout(timeout);
				timeout = null;
				previous = now;
				result = func.apply(context, args);
				if (!timeout) context = args = null;
			} else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		}
	}
}