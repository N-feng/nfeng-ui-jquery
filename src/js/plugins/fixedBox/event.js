let Event = {
	scrollJudge: function () {
		let _this = this;
		let config = _this.config;
		
		config.target.offset().top < 0 ? _this.show.call(_this) : _this.hide.call(_this);
	}
}

module.exports = Event
