let Utils = require('./utils')

function Render(config) {
	this.config = config;
	this.$container = $('<div class="datepick-container datepick-hidden"></div>');
	this.$left = $('<div class="datapick-left"></div>');
	this.renderInit();
}

Render.prototype.renderInit = function () {
	this.renderIcon();
	this.initHeader();
	this.initDate();
	this.initMonth();
  	this.initYear();
  	this.initDecade();
	$(this.config.container).append(this.$container);
}

Render.prototype.renderIcon = function () {
	let _this = this;
	let $el = _this.$el;

	$el.after('<span class="datepick-icon"></span>');
	$el.after('<i class="anticon anticon-cross-circle datepick-clear"></i>');
	_this.$clear = $el.siblings('.datepick-clear').addClass('hide');
}

Render.prototype.initHeader = function () {
	this.$headerView = $('<div class="datepick-header"/>');
	this.$container.append(this.$headerView);
	this.renderHeader();
}

Render.prototype.renderHeader = function () {
	let currentView = this.currentView;
	let getRangeYear = Utils.getRangeYear(this._d);
	let getRangeDecade = Utils.getRangeDecade(this._d);
	let strCenter = {
		date   : '<a href="javascript:;" class="btn-call-year">'+this._d.getFullYear()+' 年</a>&nbsp;&nbsp;<a href="javascript:;" class="btn-call-month">'+(this._d.getMonth() + 1)+' 月</a>',
		month  : '<a href="javascript:;" class="btn-call-year">'+this._d.getFullYear()+' 年</a>',
		year   : '<a href="javascript:;" class="btn-call-decade">'+getRangeYear[0]+'年 ~ '+(getRangeYear[1]-2)+'年</a>',
		decade : getRangeDecade[0]+'年 ~ '+(getRangeDecade[1]-20)+'年',
		week   : '<a href="javascript:;" class="btn-call-year">'+this._d.getFullYear()+' 年</a>&nbsp;&nbsp;<a href="javascript:;" class="btn-call-month">'+(this._d.getMonth() + 1)+' 月</a>'
	}
	let yearControl = currentView === 'decade' ? 
		'<a href="javascript:;" class="btn-prev-decade"></a><a href="javascript:;" class="btn-next-decade"></a>' : 
		'<a href="javascript:;" class="btn-prev-year"></a><a href="javascript:;" class="btn-next-year"></a>';
	let monthControl = currentView === 'date' ? 
		'<a href="javascript:;" class="btn-prev-month"></a><a href="javascript:;" class="btn-next-month"></a>' : '';

	let templateHeader = yearControl + monthControl + '<div class="datepick-header-center">'+strCenter[currentView]+'</div>';
	this.$headerView.html(templateHeader);
  	this.$prevYear = this.$container.find('.btn-prev-year');
  	this.$nextYear = this.$container.find('.btn-next-year');
  	this.$prevMonth = this.$container.find('.btn-prev-month');
  	this.$nextMonth = this.$container.find('.btn-next-month');
}

Render.prototype.initDate = function () {
	this.$dateView = $('<table class="datepick-date"/>');
	this.$container.append(this.$dateView);
	this.renderDate(this.config.initDate);
}

Render.prototype.renderDate = function (date) {
	let _this = this;
	let _date = new Date(date);
	let month = _date.getMonth();
	let year = _date.getFullYear();
	let dates = Utils.calcAllDate(month, year);
	let str = '';
	let minDate = new Date(_this.config.minDate);
	let maxDate = new Date(_this.config.maxDate);

	// 星期渲染
	str += '<tr>'
	$.each(this.config.locales.weekName, function (index, value) {
    str += '<td data-id="' + index + '">' + value + '</td>'
  })
  str += '</tr>'

	$.each(dates, function (index, dateItem) {
		let isCurrentDate = Utils.isEqual(new Date(), dateItem) ? ' current-date' : '';
		let currentDate = Utils.format(dateItem, _this.config.format);
		let disabledDate = Utils.compare(dateItem, minDate) === -1 || Utils.compare(dateItem, maxDate) === 1 ? ' disabled' : '';
		let whichMonth = dateItem.getMonth() > month ? 'next-month' : dateItem.getMonth() < month ? 'prev-month' : 'current-month';
		let checked = Utils.isEqual(new Date(_this.value), dateItem) ? ' checked' : '';
		if (index % 7 === 0) {
			str += '<tr>'
		}
		str += '<td class="'+whichMonth+isCurrentDate+disabledDate+checked+'" title="'+currentDate+'"><a href="javascript:;">'+dateItem.getDate()+'</a></td>';
		if (index % 7 === 6) {
			str += '</tr>'
		}
	})

	this.$dateView.html('<tbody>' + str + '</tbody>');
}

Render.prototype.initMonth = function () {
	this.$monthView = $('<table class="datepick-month datepick-hidden"/>');
	this.$container.append(this.$monthView)
	this.renderMonth()
}

Render.prototype.renderMonth = function (date) {
	let _this = this;
	let str = '';
	let _date = new Date(date) || _this._d;
	let monthName = _this.config.locales.monthName;
	let minDate = new Date(_this.config.minDate);
	let maxDate = new Date(_this.config.maxDate);
	let value = new Date(_this.value);

	for (let i = 0; i < 12; i ++) {
		let thisDate = new Date(_date.setMonth(i));
		let currentDate = Utils.format(thisDate, _this.config.format);
		let disabledDate = Utils.compare(thisDate, minDate) === -1 || Utils.compare(thisDate, maxDate) === 1 ? 'disabled' : '';
		let isCurrentMonth = _this.config.currentToday && new Date().getMonth() === _date.getMonth() && new Date().getFullYear() === _date.getFullYear() ? ' current-month' : '';
		let checked = new Date(value).getMonth() === i && new Date(value).getFullYear() === _date.getFullYear() ? 'checked' : '';
		if (i % 3 === 0) {
			str += '<tr>'
		}
		str += '<td class="'+disabledDate+checked+isCurrentMonth+'" title="'+currentDate+'"><a href="javascript:;">'+monthName[i]+'</a></td>'
		if (i % 3 === 2) {
			str += '</tr>'
		}
	}

	this.$monthView.html('<tbody>' + str + '</tbody>');
}

Render.prototype.initYear = function () {
  this.$yearView = $('<table class="datepick-year datepick-hidden"/>');
  this.$container.append(this.$yearView)
  this.renderYear()
}

Render.prototype.renderYear = function (date) {
  let _this = this;
  let str = '';
  let _date = new Date(date) || _this._d;
  let currentYear = _date.getFullYear()
  let digitOfCurrentYear = Number((currentYear + '').split('').reverse()[0]);
  let startYear = currentYear - digitOfCurrentYear;
  let value = new Date(_this.value);

  for (let i = 0; i < 12; i++) {
    let year = startYear + i - 1;
    let isCurrentYear = _this.config.currentToday && new Date().getFullYear() === year ? ' current-year' : '';
    let currentYear = Utils.format(new Date(new Date().setFullYear(year)), _this.config.format);
    let checked = new Date(value).getFullYear() === year ? ' checked' : '';
    let lastyear = i === 0 || i === 11 ? ' last-year' : '';
    if (i % 3 === 0) {
      str += '<tr>'
    }
    str += '<td class="'+isCurrentYear+checked+lastyear+'" title="'+currentYear+'"><a href="javascript:;">'+year+'</a></td>'
    if (i % 3 === 2) {
      str += '</tr>'
    }
  }
  this.$yearView.html('<tbody>' + str + '</tbody>');
}

Render.prototype.initDecade = function () {
  this.$decadeView = $('<table class="datepick-decade datepick-hidden"/>');
  this.$container.append(this.$decadeView)
  this.renderDecade()
}

Render.prototype.renderDecade = function (date) {
  let _this = this;
  let str = '';
  let _date = new Date(date) || _this._d;
  let currentYear = _date.getFullYear();
  let digitOfCurrentYear = Number(currentYear.toString().substr(-2));
  let startYear = currentYear - digitOfCurrentYear;

  for (let i = 0; i < 12; i++) {
  	// 每个开始年份
    let decade = startYear + i * 10 - 10;
    let currentYear = Utils.format(new Date(new Date().setFullYear(decade + 1)), _this.config.format);
    let diff = new Date(_date).getFullYear() - decade;
    let checked = diff >= 0 && diff <= 9 ? ' checked' : '';
    let isCurrentDecade = _this.config.currentToday && new Date().getFullYear() - decade >= 0 && new Date().getFullYear() - decade <= 9 ? ' current-decade' : '';
    let decadeName = decade+'-'+(decade+9);
    let lastdecade = i === 0 || i === 11 ? ' last-decade' : '';
    if (i % 3 === 0) {
      str += '<tr>'
    }
    str += '<td class="'+isCurrentDecade+checked+lastdecade+'" title="'+currentYear+'"><a href="javascript:;">'+decadeName+'</a></td>'
    if (i % 3 === 2) {
      str += '</tr>'
    }
  }
  this.$decadeView.html('<tbody>' + str + '</tbody>');
}

module.exports = Render