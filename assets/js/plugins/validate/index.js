let Utils = require('./utils')
let View = require('./view')
let Event = require('./event')
let defaults = {
	collections  	  : [],
	strategy 	 	  : Utils.GLOB_STRATEGY,
	errorClass 	 	  : '.validate-error',
	infoClass 	 	  : '.validate-info',
	successClass 	  : '.validate-success',
	animateEnterClass : 'zoomTop-enter-active'
}

let EVENT_SPACE = {
	event  : 'event.validate',
	change : 'change.validate',
	blur   : 'blur.validate'
}

function Validate (options, selector) {
	let _this = this;
	_this.$selector = $(selector);
	_this.config = $.extend(true, {}, defaults, options);
	_this.cache = {};
	_this.errors = {};
	_this.init();
}

$.extend(Validate.prototype, Utils);

$.extend(Validate.prototype, View);

$.extend(Validate.prototype, Event);

Validate.prototype.init = function () {
	let _this = this;
	let config = _this.config;
	if (config.collections.length === 0) {
		return false;
	}
	_this.add();
}

Validate.prototype.add = function (config) {
	let _this = this;
	let collections = config || _this.config.collections;

	for (let i in collections) {
		let target = _this.$selector.find('[data-required="' + collections[i].required + '"]');
		let msg = "cannot find element by data-required=\"" + collections[i].required + "\"";
		target.length ? _this.mapping(collections[i]) : _this.errorPrompt(msg);
	}

	if (config) {
		$.merge(_this.config.collections, config);
	}

	_this.bindEvent();
}

Validate.prototype.mapping = function (collection) {
	let $dom = this.$selector.find('[data-required=' + collection.required + ']');

	let $context = $dom.parents(collection.context).eq(0);
	let msg = "{context:\"" + collection.context + "\"} is invalid, it may prevent the triggering event";
	$context.length ? '' : this.errorPrompt(msg);

	if (this.cache[collection.required]) {
		return false;
	}

	$.extend(true, this.cache, (function () {
		let item = {};
		item[collection.required] = {
			matches    : {},
			self 	   : $dom,
			context    : $context,
			infoMsg    : collection.infoMsg || '',
			collection : collection
		}
		$.extend(true, item[collection.required].matches, collection.matches);
		return item;
	}()));
}

Validate.prototype.bindEvent = function () {
	let _this = this;
	let $selector = _this.$selector;
	let handleArr = _this.hander.call(_this);
	let changeHandleArr = ['select-one', 'select-multiple', 'radio', 'checkbox', 'file'];

	$.each(handleArr, function (index, item) {
		let $target = $selector.find(item);
		let type, requiredName;

		if ($target[0] === void 0) {
			return;
		}

		type = $target[0].type;

		requiredName = item.replace('[', '').replace(']', '').split('=')[1];

		if ($target.data(EVENT_SPACE.event)) {
			return;
		}

		if ($.inArray(type, changeHandleArr) !== -1) {
			$target.on(EVENT_SPACE.change, { self: _this }, _this.changeEmitter)
			$target.data(EVENT_SPACE.event, true);
			return;
		}

		if (!_this.cache[requiredName].collection.unblur) {
			$target.on(EVENT_SPACE.blur, $.proxy(_this.blurEmitter, _this));
		}

	});
};

Validate.prototype.verify = function(glob, eventName) {
	let $this = $(this);
	let collection = glob.cache[$this.data('required')];
	let matches = collection.matches;
	let status = false;

	$.each(matches, function(name, params) {
		let result = glob.config.strategy[name].call(collection, params);
		status = result === void(0) ? 1 : 2;
		$this.data('validataStatus', status);
		glob.message(status, collection, name);
		return status === 2 ? false : true;
	});

	$this.trigger('validate.' + eventName, collection);

	return status;
};

module.exports = {
	Validate: function (options) {
		return new Validate(options, this);
	}
}