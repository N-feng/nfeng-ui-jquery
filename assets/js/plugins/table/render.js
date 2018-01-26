let Utils = require('./utils');

function Render (config) {
	this.config = config;
	this.renderInit();
};

Render.prototype.renderInit = function () {
	if (this.config.tableLock === 'true') {
		this.renderTableFixed();
		this.renderTableHeaderLock();
	}
	if (this.config.tableEdit === 'true') {
		this.renderTableTdEdit();
	}
	if (this.config.tableAjax === 'true') {
		this.renderTableBodyAmount();
	}
	if (this.config.tableCollapsed === 'true') {
		this.renderTableCollapsed();
	}
}

// 渲染固定表格
Render.prototype.renderTableFixed = function () {
	let _this = this;
	let $selector = _this.$selector;

	let $tableFixed = _this.$tableFixed = $([
			'<div class="table-fixed hide">',
				'<div class="table-header">',
					'<table class="table table-striped table-bordered table-hover table-data">',
					'</table>',
				'</div>',
				'<div class="table-body scroll-hide">',
					'<table class="table table-striped table-bordered table-hover table-data">',
					'</table>',
				'</div>',
			'</div>'
		].join(''));

	$selector.append($tableFixed);
}

// 渲染头部表格 锁
Render.prototype.renderTableHeaderLock = function () {
	let _this = this;
	let $tableHeader = _this.$tableHeader;

	let html = '<div class="lock uk-icon-lock" title="固定列"></div>';

	$.each($tableHeader.find('th'), function (index, item) {
		$(item).append(html);
	});
}

// 分割表格
Render.prototype.splitTable = function (event) {
	let _this = this;
	let $selector = _this.$selector;
	let $tableHeader = _this.$tableHeader;
	let $tableBody = _this.$tableBody;
	let $tableFixed = _this.$tableFixed;
	let $target = $(event.target);
	let $th = $target.parent('th');
	let thIndex = $th.index();

	// 清空固定表格
	$tableFixed.find('.table-header').find('table').html('');
	$tableFixed.find('.table-body').find('table').html('');

	// 复制tableHeader thead
	let htmlThead = Utils.getTableFixedThead($tableHeader, thIndex);
	$tableFixed.find('.table-header').find('table').append(htmlThead);

	// 复制tableBody tbody
	let htmlTbody = Utils.getTableFixedTBody($tableBody, thIndex);
	$tableFixed.find('.table-body').find('table').append(htmlTbody);

	// 复制colgroup 到各表
	let htmlColgroup = Utils.getTableHeaderColgroup($tableHeader, thIndex); 
	$tableFixed.find('table').prepend(htmlColgroup);

	// 显示tableFixed width
	let tableFixedWidth = Utils.getTableFixedWidth($tableHeader, thIndex);
	_this.showTableFixed(tableFixedWidth);
}

Render.prototype.renderTableTdEdit = function () {
	let _this = this;
	let $tableBody = _this.$tableBody;

	$.each($tableBody.find('.table-edit-text'), function (index, item) {
		let $target = $(item);
		let maxlength = $target.attr('data-maxlength') ? $target.attr('data-maxlength') : 7;
		$target.after('<div class="table-edit-input hide"><input type="text" class="form-control" style="height:18px;margin:-1px 0;padding: 0 7px;" maxlength="'+maxlength+'"></div>');
	});
}

Render.prototype.renderTableBodyAmount = function () {
	let _this = this;
	let $tableBody = _this.$tableBody;
	let config = _this.config;
	let _url = config.tableAjaxUrl;

	$.ajax({
		url: _url,
		type: 'get'
	}).then(function (res) {
		$tableBody.find('table').prepend(res);
		config.tableAjaxSuccess.call(_this);
	})
}

Render.prototype.renderTableCollapsed = function () {
	let _this = this;
	let $tableBody = _this.$tableBody;

	$.each($tableBody.find('.table-collapsed'), function (index, item) {
		let $target = $(item);
		$target.after('<span class="loading"></span>');
		$target.after('<span class="table-expanded hide"></span>');
	});
}

Render.prototype.sortRender = function (sortJson) {
	let _this = this;
	let $tableBody = _this.$tableBody;
	let $tbody = $tableBody.find('tbody');
	let $tr = $tableBody.find('tr');
	let html = $tbody.clone().html('');
	$.each(sortJson, function (index, item) {
		html.append($tr.eq(item.index).clone());
	})
	$tbody.replaceWith(html);
}

module.exports = Render