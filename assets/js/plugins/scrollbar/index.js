let commonUtils = require('../../base/utils');
let Utils = require('./utils');
let Store = require('./store');
let Render = require('./render');
let View = require('./view');
let Event = require('./event');
let ENP = {
	resize: 'resize.scrollbar'
}
let defaults = {
	browser: {
		data: {
			index: 0,
			name: 'scrollbar'
		},
		macosx: /mac/i.test(navigator.platform),
		mobile: /android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent),
		overlay: null,
		scroll: null,
		scrolls: [],
		webkit: /webkit/i.test(navigator.userAgent) && !/edge\/\d+/i.test(navigator.userAgent)
	},
	autoScrollSize: true,
	ignoreMobile: false,
	onScroll: null,
	autoScrollHeight: true
}

function scrollbar (options, selector) {
	let _this = this;
	_this.$selector = $(selector);
	_this.config = $.extend({}, defaults, options);
	_this.namespace = '.scrollbar_' + _this.config.browser.data.index++;
	_this.scrollx = {};
	_this.scrolly = {};

	if (!_this.config.browser.scroll) {
		_this.config.browser.overlay = Utils.isScrollOverlaysContent(_this.config.browser);
		_this.config.browser.scroll = Utils.getBrowserScrollSize(_this.config.browser);
	}

	_this.init();

	_this.$selector.data(_this.config.browser.data.name, this);
}

$.extend(scrollbar.prototype, Store);

$.extend(scrollbar.prototype, Render);

$.extend(scrollbar.prototype, View);

$.extend(scrollbar.prototype, Event);

scrollbar.prototype.init = function () {
	let _this = this;
	let config = _this.config;
	let $selector = _this.$selector;
	let browser = config.browser;
	let offset = {x: _this.scrollx, y: _this.scrolly};
	let namespace = _this.namespace;

	if ((browser.mobile && config.ignoreMobile)
		|| (browser.overlay && config.ignoreOverlay)
		|| (browser.macosx && !browser.webkit)
		) {
		return false;
	}

	if (!_this.wrapper) {
		_this.renderWrapper();
		_this.showWrapper();
		_this.showContent();

		_this.renderScrolls();
		_this.updateScrolls();

		_this.bindEvent();
	}
		
};

scrollbar.prototype.bindEvent = function () {
	let _this = this;
	let $selector = _this.$selector;
	let namespace = _this.namespace;
	let scrolls = {x: _this.scrollx, y: _this.scrolly};

	$selector.on('scroll' + namespace, $.proxy(_this.roll, _this));
	$.each(scrolls, function (direction, scroll) {
		let scrollOffset = (direction === 'x') ? 'scrollLeft' : 'scrollTop';
		scroll.scroll.bar.on('mousedown' + namespace, function (event) {
			let eventPosition = event[(direction === 'x') ? 'pageX' : 'pageY'];
			let initOffset = $selector[scrollOffset]();
			scroll.scroll.bar.addClass('active');

			$(document).on('mousemove' + namespace, function (event) {
				event && event.preventDefault();
				let diff = parseInt((event[(direction === 'x') ? 'pageX' : 'pageY'] - eventPosition) / scroll.kx, 10);
				$selector[scrollOffset](initOffset + diff);
			});
		
			$(document).on('blur' + namespace, function () {
				$(document).add('body').off(namespace);
				scroll.scroll.bar.removeClass('active');
			});

			$(document).on('mouseup' + namespace, function () {
				$(document).add('body').off(namespace);
				scroll.scroll.bar.removeClass('active');
			});
		});
	});
};

scrollbar.prototype.updateSize = function () {
	let _this = this;
	let scrolls = {x: _this.scrollx, y: _this.scrolly};
	let config = _this.config;

	if (!_this.wrapper) {return;}
	if (config.autoScrollHeight) {
		_this.content.removeAttr('style');
		_this.showContent();
	}
	_this.updateScrolls();
	$.each(scrolls, function (direction, scroll) {
		let size = scroll.size;
		let visible = scroll.visible;
		let scrollClass = 'scroll-visible';

		scroll.isVisible = (size - visible) > 1;
		if (scroll.isVisible) {
			scroll.scroll.addClass(scrollClass);
		} else {
			scroll.scroll.removeClass(scrollClass);
		}
	});
}

scrollbar.prototype.destroy = function () {
	let _this = this;
	let $selector = _this.$selector;

	if (!_this.wrapper) {return;}

	let scrollLeft = $selector.scrollLeft();
	let scrollTop = $selector.scrollTop();
	let wrapperClass = _this.wrapper.attr('class');
	let namespace = _this.namespace;

	$selector.insertBefore(_this.wrapper)
		.removeAttr('style')
		.removeClass().addClass(wrapperClass).removeClass('scroll-wrapper scroll-textarea')
		.off(namespace)
		.scrollLeft(scrollLeft)
		.scrollTop(scrollTop);

	_this.scrollx.scroll.removeClass('scroll-visible').find('div').andSelf().off(namespace);
	_this.scrolly.scroll.removeClass('scroll-visible').find('div').andSelf().off(namespace);

	_this.wrapper.remove();
	_this.wrapper = undefined;
}

module.exports = {
	scrollbar: function (options) {
		return new scrollbar(options, this);
	}
}
