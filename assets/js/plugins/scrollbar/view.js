module.exports = {
	showWrapper: function () {
		let _this = this;
		let $selector = _this.$selector;
		let position = $selector.css('position') == 'absolute' ? 'absolute' : 'relative';
		_this.wrapper.css({
			'position': position,
			'overflow': 'hidden'
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
	}
}