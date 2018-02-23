let commonUtils = require('../../common/utils');
let Utils = require('./utils');
let Store = require('./store');
let Render = require('./render');
let View = require('./view');
let Event = require('./event');

// event name space
let ENP = {
	click : 		'click.datepick',
	focus : 		'focus.datepick',
	mouseover:  'mouseover.datepick',
	mouseleave: 'mouseleave.datepick'
};

function datepick(options, selector) {
	let defaults = {
        container         : 'body',
		initDate      	  : new Date(),
		currentView   	  : 'date',
		currentToday      : true,
		type          	  : $(selector).data('type') || 'month',    //  week,  month,  year
		minDate		  	  : '1990-00-00',
		maxDate		  	  : '2019-10-10',
		format		  	  : 'YYYY-MM-DD hh:mm:ss',
		locales		  	  : {
			weekName   	  : ['日', '一', '二', '三', '四', '五', '六'],
			monthName 	  : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
		},
		hideClass     	  : 'datepick-hidden',
		animateEnterClass : 'slideDown-enter-active',
		animateLeaveClass : 'slideDown-leave-active',
		range : $(selector).data('range') || false,
		selectMonth: function () {},
		weeks: function () {}
	}
	let _this = this;
	_this.$el = $(selector);
	_this.config = $.extend({}, defaults, options);

	// _this.value = new Date(_this.$el[0].value).toString() === 'Invalid Date' ? _this.config.initDate : new Date(_this.$el[0].value);
	_this.currentView = _this.config.currentView;
	Store.call(_this, _this.config.initDate);
	Render.call(_this, _this.config);

	_this.init();
}

datepick.prototype = Object.create(Store.prototype);

$.extend(datepick.prototype, Render.prototype);

$.extend(datepick.prototype, View);

datepick.prototype.constructor = datepick;

datepick.prototype.init = function () {
	let _this = this;

	_this.bindEvent();
	_this.bindEventHeader();
	_this.bindEventBody();
};

datepick.prototype.bindEvent = function () {
	let _this = this;
	let $context = _this.$container;
	let config = _this.config;

	_this.$container.on(ENP.click, function (event) {
		event.stopPropagation();
	});

	_this.$el.on(ENP.click, function (event) {
		if ($context.hasClass(config.hideClass) && $(event.target)[0] === _this.$el[0]) {
			_this._d = new Date(this.value).toString() === 'Invalid Date' ? _this.config.initDate : new Date(this.value);
			let mode = {
				date   : 'updateDateView',
				month  : 'updateMonthView',
				year   : 'updateYearView'
			}
			Event[mode[config.type]].call(_this, this.value, event);
			_this.show();
		}
	});

	// 鼠标放到表单的时候icon交互
	_this.$el.on(ENP.mouseover, function () {
		if($(this).val()) {
			$(this).addClass('active');
			_this.$clear.removeClass('hide');
		}
	});

	_this.$el.on(ENP.mouseleave, function () {
		$(this).removeClass('active');
	});

	_this.$clear.on(ENP.mouseover, function () {
		_this.$el.addClass('active');
	});

	_this.$clear.on(ENP.mouseleave, function () {
		_this.$el.removeClass('active');
	});

	_this.$clear.on(ENP.click, function () {
		_this.$el.val('');
		_this.$el.attr('data-value', '');
		_this.value = '';
		_this.$clear.addClass('hide');
	});

	commonUtils.animateEndShim($context, function () {
		if ($context.hasClass('slideDown-leave-active')) {
			$context.removeClass('slideDown-leave-active').addClass('datepick-hidden');
		}
	});
};

datepick.prototype.bindEventHeader = function () {
  let _this = this;
  let $context = _this.$container;

	$context.on(ENP.click, '.btn-next-month', function (event) {
    event.preventDefault();
    Event.updateDateView.call(_this, _this._nM, event);
  });

  $context.on(ENP.click, '.btn-prev-month', function (event) {
    event.preventDefault();
    Event.updateDateView.call(_this, _this._pM, event);
  });

	$context.on(ENP.click, '.btn-next-year', function(event) {
		event.preventDefault();
		let currentView = _this.currentView;
		if (currentView === 'year') {
			let rangeYear = Utils.getRangeYear(_this._d)
			let nextTenYear = new Date(new Date().setFullYear(rangeYear[0] + 10))
			Event.updateYearView.call(_this, nextTenYear, event)
		} else {
			Event[currentView === 'date' ? 'updateDateView' : 'updateMonthView'].call(_this, _this._nY, event)
		}
	});

	$context.on(ENP.click, '.btn-prev-year', function (event) {
		event.preventDefault();
		let currentView = _this.currentView;
		if (currentView === 'year') {
			let rangeYear = Utils.getRangeYear(_this._d)
			let prevTenYear = new Date(new Date().setFullYear(rangeYear[0] - 10))
			Event.updateYearView.call(_this, prevTenYear, event)
		} else {
			Event[currentView === 'date' ? 'updateDateView' : 'updateMonthView'].call(_this, _this._pY, event);
		}
	});

	$context.on(ENP.click, '.btn-next-decade', function(event) {
		event.preventDefault();
		let currentView = _this.currentView;
		let rangeYear = Utils.getRangeYear(_this._d);
		let nextHundredYear = new Date(new Date().setFullYear(rangeYear[0] + 100));
		Event.updateDecadeView.call(_this, nextHundredYear, event);
	});

	$context.on(ENP.click, '.btn-prev-decade', function (event) {
		event.preventDefault();
		let currentView = _this.currentView;
		let rangeYear = Utils.getRangeYear(_this._d);
		let prevHundredYear = new Date(new Date().setFullYear(rangeYear[0] - 100));
		Event.updateDecadeView.call(_this, prevHundredYear, event);
	});

	$context.on(ENP.click, '.btn-call-month', function (event) {
    event.preventDefault();
    Event.updateMonthView.call(_this, _this._d, event);
  });

  $context.on(ENP.click, '.btn-call-year', function (event) {
    event.preventDefault();
    Event.updateYearView.call(_this, _this._d, event);
  });

  $context.on(ENP.click, '.btn-call-decade', function (event) {
    event.preventDefault();
    Event.updateDecadeView.call(_this, _this._d, event);
  });
};

datepick.prototype.bindEventBody = function () {
  let _this = this;
  let $context = _this.$container;

	$context.on(ENP.click, '.datepick-date td:not(.disabled) a', $.proxy(Event.selectDay, _this));
	$context.on(ENP.click, '.datepick-month td:not(.disabled) a', $.proxy(Event.selectMonth, _this));
	$context.on(ENP.click, '.datepick-year td:not(.disabled) a', $.proxy(Event.selectYear, _this));
	$context.on(ENP.click, '.datepick-decade td:not(.disabled) a', $.proxy(Event.selectDecade, _this));
};

$('body').on(ENP.click, function (event) {
	let $target = $(event.target);
	if ($target.data().datepick) {
		$target.data().datepick.$container.siblings('.datepick-container').removeClass('slideDown-enter-active').addClass('datepick-hidden');
	} else {
		$.each($('.datepick-container'), function (index, item) {
			if (!$(item).hasClass('datepick-hidden')) {
				$(item).removeClass('slideDown-enter-active').addClass('slideDown-leave-active');
			}
		});
	}
});

module.exports = {
	datepick: function (options) {
		return this.each(function (index, el) {
			$(el).data('datepick', new datepick(options, el));
		});
	}
};