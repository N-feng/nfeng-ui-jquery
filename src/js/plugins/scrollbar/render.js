let Render = {
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

			scroll.scroll = _this.scrollTemplate().addClass('scroll-' + direction);
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

module.exports = Render
