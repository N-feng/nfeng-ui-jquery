let Event = {
	selectAll: function (event) {
		event && event.preventDefault();
		let _this = this;
		let $selector = _this.$selector;
		$selector.find('.checkbox label').find('input').prop('checked', true);
	},
	selectRever: function (event) {
		event && event.preventDefault();
		let _this = this;
		let $selector = _this.$selector;
		$selector.find('.checkbox label').find('input').each(function (index, el) {
			$(el).prop('checked', !el.checked);
		});
	}
}

module.exports = Event
