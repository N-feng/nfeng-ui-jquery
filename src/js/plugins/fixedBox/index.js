let Utils = require('./utils');
let View = require('./view');
let Event = require('./event');
let defaults = {
	container : 'body',
	height 	  : 'auto',
	hideClass : 'hide'
};

let EVENT_SPACE = {
	scroll : 'scroll.fixedBox'
};

function fixedBox (options, selector) {
	let _this = this;
	_this.$selector = $(selector);
	_this.config = $.extend({}, defaults, options);
	_this.init();
}

$.extend(fixedBox.prototype, View);

$.extend(fixedBox.prototype, Event);

fixedBox.prototype.init = function () {
	let _this = this;
	let config = _this.config;
	let template = Utils.createTemplate.call(_this);
	let $selector = _this.$selector = _this.$selector.length ? _this.$selector : $(template);
	let $content = _this.$selector.find('.fixed-content');
	let _width = Number($selector.data('width')) || config.width;
	let _height = Number($selector.data('height')) || config.height;

	$selector.appendTo(config.container);
	$content.css({
		height : _height 
	});
	_this.top = _this.config.target.offset().top;
	$selector.addClass(config.hideClass);
	$selector.data('fixedBox', _this);
	_this.bindEvent();
};

fixedBox.prototype.bindEvent = function () {
	let _this = this;
	let config = _this.config;
	
	$(config.container).on(EVENT_SPACE.scroll, $.proxy(_this.scrollJudge, _this));
};

module.exports = {
	fixedBox: function (options) {
		return new fixedBox(options, this);
	}
}