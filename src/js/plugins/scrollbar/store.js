module.exports = {
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

		_this.showScrolls();
	}
}