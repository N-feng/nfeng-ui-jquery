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

let ENP = {
	resize: 'resize.scrollbar'
}

function isScrollOverlaysContent(browser) {
	let scrollSize = getBrowserScrollSize(browser, true);
	return !(scrollSize.height || scrollSize.width);
};

function getBrowserScrollSize(browser, actualSize) {
	if (browser.webkit && !actualSize) {
		return {
			height: 0,
			widht: 0
		}
	}
	if (!browser.data.outer) {
		let css = {
			"border": "none",
			"box-sizing": "content-box",
			"height": "200px",
			"margin": "0",
			"padding": "0",
			"width": "200px"
		};
		browser.data.inner = $('<div>').css($.extend({}, css));
		browser.data.outer = $('<div>').css($.extend({
			"left": "-1000px",
			"overflow": "scroll",
			"position": "absolute",
			"top": "-1000px"
		}, css)).append(browser.data.inner).appendTo('body');
	}

	browser.data.outer.scrollLeft(1000).scrollTop(1000);

	return {
		"height": Math.ceil((browser.data.outer.offset().top - browser.data.inner.offset().top) || 0),
		"width": Math.ceil((browser.data.outer.offset().left - browser.data.inner.offset().left) || 0)
	};
};

let action = {
	updateScrolls: function () {
		let _this = this;
		let config = _this.config;
		let $selector = _this.$selector;
		let wrapper = _this.wrapper;
		let scrolls = {x: _this.scrollx, y: _this.scrolly};

		$.each(scrolls, function (direction, scroll) {
			let cssOffset = (direction === 'x') ? 'left' : 'top';
			let cssOuterSize = (direction === 'x') ? 'outerWidth' : 'outerHeight';
			let cssScrollSize = (direction === 'x') ? 'scrollWidth' : 'scrollHeight';
			let cssSize = (direction === 'x') ? 'width' : 'height';

			let $size = scroll.scroll.size;

			let offset = parseInt($selector.css(cssOffset), 10) || 0;
			let size = $selector.prop(cssScrollSize);
			let visible = ((direction === 'x') ? wrapper.width() : wrapper.height()) + offset;
			let scrollSize = $size[cssOuterSize]() + (parseInt($size.css(cssOffset), 10) || 0);

			scroll.offset = offset;
			scroll.size = size;
			scroll.visible = visible;
			scroll.scrollbarSize = parseInt(scrollSize * visible / size, 10);
			scroll.kx = ((scrollSize - scroll.scrollbarSize) / (size - visible)) || 1;
			// scroll.maxScrollOffset = size - visible;
		});

		action.showScrolls.call(_this);
	},
	showWrapper: function () {
		let _this = this;
		let $selector = _this.$selector;
        let position = $selector.css('position') == 'absolute' ? 'absolute' : 'relative';
        let width = $selector.width();
		_this.wrapper.css({
			'position': position,
            'overflow': 'hidden',
            'width': width + 'px',
		});
	},
	showContent: function () {
		let _this = this;
		let config = _this.config;
		let $selector = _this.$selector;

		let offset = parseInt($selector.css('top'), 10) || 0;
		let visible = _this.wrapper.height() + offset;
		let size = $selector.prop('scrollHeight');

		if ($selector.is('textarea') || size < visible) {
			_this.content.css({
				"height": (visible + config.browser.scroll.height) + 'px',
				"max-height": "none"
			});
		} else {
			_this.content.css({
				"max-height": (visible + config.browser.scroll.height) + 'px'
			});
		}
	},
	showScrolls: function () {
		let _this = this;
		let config = _this.config;
		let scrolls = {x: _this.scrollx, y: _this.scrolly};

		$.each(scrolls, function (direction, scroll) {
			let cssSize = (direction === 'x') ? 'width' : 'height';

			if (config.autoScrollSize) {
				scroll.scroll.bar.css(cssSize, scroll.scrollbarSize + 'px');
			}
		});
	},
	roll: function () {
		let _this = this;
		let $selector = _this.$selector;
		let left = $selector.scrollLeft() * _this.scrollx.kx + 'px';
		let top = $selector.scrollTop() * _this.scrolly.kx + 'px';

		_this.scrollx.isVisible && _this.scrollx.scroll.bar.css('left', left);
		_this.scrolly.isVisible && _this.scrolly.scroll.bar.css('top', top);
	}
};

let render = {
	renderWrapper: function () {
		let _this = this;
		let $selector = _this.$selector;

		_this.wrapper = $('<div>')
			.addClass($selector.attr('class'))
			.addClass('scroll-wrapper')
			.insertBefore($selector).append($selector);

		if ($selector.is('textarea')) {
			_this.content = $('<div>').insertBefore($selector).append($selector);
			_this.content.addClass('scroll-content');
			_this.wrapper.addClass('scroll-textarea');
			$selector.removeClass().addClass('scroll-hide');
		} else {
			_this.content = $selector.removeClass().addClass('scroll-content scroll-hide');
		}
	},
	renderScrolls: function () {
		let _this = this;
		let $selector = _this.$selector;
		let scrolls = {x: _this.scrollx, y: _this.scrolly};

		$.each(scrolls, function(direction, scroll) {
			let size = direction == "x" ? $selector.prop('scrollWidth') : $selector.prop('scrollHeight');
			let visible = direction == "x" ? _this.wrapper.width() : _this.wrapper.height();
			let scrollClass = 'scroll-visible';

			scroll.scroll = render.scrollTemplate.call(_this).addClass('scroll-' + direction);
			scroll.isVisible = (size - visible) > 1;
			if (scroll.isVisible) {
				scroll.scroll.addClass(scrollClass);
			}
		});
	},
	scrollTemplate: function () {
		let _this = this;
		let $selector = _this.$selector;
		let scroll = $([
			'<div class="scroll-element">',
				'<div class="scroll-outer">',
					'<div class="scroll-size"></div>',
					'<div class="scroll-track"></div>',
					'<div class="scroll-bar"></div>',
				'</div>',
			'</div>'
		].join('')).appendTo(_this.wrapper);
		$.extend(scroll, {
			bar: scroll.find('.scroll-bar'),
			size: scroll.find('.scroll-size'),
			track: scroll.find('.scroll-track')
		});
		return scroll;
	}
}

function scrollbar (options, selector) {
	let _this = this;
	_this.$selector = $(selector);
	_this.config = $.extend({}, defaults, options);
	_this.namespace = '.scrollbar_' + _this.config.browser.data.index++;
	_this.scrollx = {};
	_this.scrolly = {};

	if (!_this.config.browser.scroll) {
		_this.config.browser.overlay = isScrollOverlaysContent(_this.config.browser);
		_this.config.browser.scroll = getBrowserScrollSize(_this.config.browser);
	}

	_this.init();

	_this.$selector.data(_this.config.browser.data.name, this);
}

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
		render.renderWrapper.call(_this);
		action.showWrapper.call(_this);
		action.showContent.call(_this);

		render.renderScrolls.call(_this);
		action.updateScrolls.call(_this);

		_this.bindEvent();
	}
		
};

scrollbar.prototype.bindEvent = function () {
	let _this = this;
	let $selector = _this.$selector;
	let namespace = _this.namespace;
	let scrolls = {x: _this.scrollx, y: _this.scrolly};

	$selector.on('scroll' + namespace, $.proxy(action.roll, _this));
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
		action.showContent.call(_this);
	}
	action.updateScrolls.call(_this);
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
