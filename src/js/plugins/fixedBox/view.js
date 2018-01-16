module.exports = {
	show: function () {
		let _this = this;
		let config = _this.config;
		// let $target = $(config.target)[0];
		// let matrix = $target.getBoundingClientRect();
		// let _left = matrix.x;
		// let _right = $(window).width() - matrix.x - matrix.width;

		// _this.$selector.css({
		// 	left  : _left,
		// 	right : _right
		// }).removeClass(config.hideClass);
		_this.$selector.removeClass(config.hideClass);
	},
	hide: function () {
		let _this = this;
		let config = _this.config;

		_this.$selector.addClass(config.hideClass);
	}
}