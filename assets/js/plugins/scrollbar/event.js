let Event = {
	roll: function () {
		let _this = this;
		let $selector = _this.$selector;
		let left = $selector.scrollLeft() * _this.scrollx.kx + 'px';
		let top = $selector.scrollTop() * _this.scrolly.kx + 'px';

		_this.scrollx.isVisible && _this.scrollx.scroll.bar.css('left', left);
		_this.scrolly.isVisible && _this.scrolly.scroll.bar.css('top', top);
	}
}

module.exports = Event
