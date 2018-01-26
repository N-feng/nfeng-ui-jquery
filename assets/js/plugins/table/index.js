let Utils = require('./utils');
let View = require('./view');
let Event = require('./event');
let Render = require('./render');

// event name space 
let ENP = {
	mouseover: 'mouseover.table',
	mouseleave: 'mouseleave.table',
	scroll: 'scroll.table',
	click: 'click.table',
	blur: 'blur.table'
}

function table (options, selector) {
	let defaults = {
		maxHeight: false,
		tableLock: $(selector).attr('data-tableLock') || 'true',
		tableEdit: $(selector).attr('data-tableEdit') || 'false',
		tableSort: $(selector).attr('data-tableSort') || 'false',
		tableAjax: $(selector).attr('data-tableAjax') || 'false',
		tableAjaxUrl: $(selector).attr('data-tableAjaxUrl') || '',
		tableCollapsed: $(selector).attr('data-tableCollapsed') || '',
		childrenClass: '.children-class',
		tableAjaxSuccess: function () {},
		tableCollBeforeSend: function () {},
		tableCollSuccess: function () {}
	}
	let _this = this;
	_this.$selector = $(selector);
	_this.config = $.extend({}, defaults, options);

	_this.$tableHeader = _this.$selector.find('.table-header');
	_this.$tableBody = _this.$selector.find('.table-body');

	Render.call(_this, _this.config);
	
	_this.init();
}

// 继承方法
$.extend(table.prototype, View);

// $.extend(table.prototype, Event);

$.extend(table.prototype, Render.prototype);

// 初始化
table.prototype.init = function () {
	let _this = this;
	let config = _this.config;

	_this.updateBodyMaxHeight();

	_this.bindEvent();

	if (config.tableLock === 'true') {
		// _this.renderTableFixed();
		_this.bindEventTableFixed();
		// _this.renderTableHeaderLock();
	}
}

// 绑定事件
table.prototype.bindEvent = function () {
	let _this = this;
	let config = _this.config;
	let $selector = _this.$selector;
	let $tableHeader = _this.$tableHeader;
	let $tableBody = _this.$tableBody;

	$tableBody.on(ENP.scroll, function (event) {
		$tableHeader.scrollLeft($(this).scrollLeft());
	});

	if (config.tableLock === 'true') {
		$tableHeader.on(ENP.mouseover, 'th', function (event) { $(this).addClass('active') });
		$tableHeader.on(ENP.mouseleave, 'th', function (event) { $(this).removeClass('active') });

		$tableHeader.on(ENP.click, '.lock', $.proxy(_this.splitTable, _this));
	}

	$selector.on(ENP.mouseover, 'tbody tr', function (event) {
		Event.mouseoverTr.call(_this, event);
	});
	$selector.on(ENP.mouseleave, 'tbody tr', function (event) {
		Event.mouseleaveTr.call(_this, event);
	});

	// 展开、收起  二级列表
	$selector.on(ENP.click, '.J-collapsed', $.proxy(_this.showAdjective, _this));

	// 表格 单个td 可编辑
	if (config.tableEdit === 'true') {
		$selector.on(ENP.click, '.table-edit-text', function (event) {
			let $target = $(event.target);
			let text = $target.text();
			_this.showEditInput(Utils.delcommafy(text), event);
		});
		$selector.on(ENP.blur, '.table-edit-input', function (event) {
			Event.editInputBlur.call(_this, event);
		});
	}

	// 表格 排序功能开启
	if (config.tableSort === 'true') {
		$selector.on(ENP.click, '.sorting .table-sort, .sorting_desc .table-sort', function (event) {
			Event.sortFn.call(_this, event, false);
		});
		$selector.on(ENP.click, '.sorting_asc .table-sort', function (event) {
			Event.sortFn.call(_this, event, true);
		});
	}

	// 表格 展开功能开启
	if (config.tableCollapsed === 'true') {
		$selector.on(ENP.click, '.table-collapsed', function (event) {
			Event.collapsed.call(_this, event);
		});
		$selector.on(ENP.click, '.table-expanded', function (event) {
			Event.expanded.call(_this, event);
		});
	}
		
};

// 绑定固定表格事件
table.prototype.bindEventTableFixed = function () {
	let _this = this;

	let $tableHeader = _this.$tableHeader;
	let $tableBody = _this.$tableBody;
	let $tableFixed = _this.$tableFixed;

	$tableFixed.find('.table-body').on(ENP.mouseover, function () {
		$tableFixed.find('.table-body').on(ENP.scroll, function () {
			$tableBody.scrollTop($(this).scrollTop());
		});
		$tableBody.off(ENP.scroll);
	});

	$tableBody.on(ENP.mouseover, function () {
		$tableBody.on(ENP.scroll, function (event) {
			$tableHeader.scrollLeft($(this).scrollLeft());
			$tableFixed.find('.table-body').scrollTop($(this).scrollTop());
		});
		$tableFixed.find('.table-body').off(ENP.scroll);
	});

	$tableFixed.on(ENP.mouseover, 'th', function (event) { $(this).addClass('active') });
	$tableFixed.on(ENP.mouseleave, 'th', function (event) { $(this).removeClass('active') });

	$tableFixed.on(ENP.click, '.unlock', function (event) {
		Event.selectThUnlock.call(_this, event);
	});
}

module.exports = {
	table: function (options) {
		return new table(options, this);
	}
}
