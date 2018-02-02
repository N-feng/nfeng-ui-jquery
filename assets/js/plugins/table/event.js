let Utils = require('./utils');
let Event = {
	// 选择锁定
	selectThLock: function (event) {
		let _this = this;
		let config = _this.config;

		_this.splitTable(event);
	},
	// 选择解锁
	selectThUnlock: function (event) {
		let _this = this;
		let $tableFixed = _this.$tableFixed;

		let $target = $(event.target);
		// console.log($target)
		let thIndex = $target.parent('th').index();
		let thLength = $target.parent('th').parent('tr').find('th').length;

		let width = 0;
		for (let i = 0; i < thIndex; i++) {
			width += $target.parent('th').parent('tr').find('th').eq(i).outerWidth();
		}

		$tableFixed.css('max-width', width);
		
		// $.each($tableFixed.find('tr'), function (index, item) {
		// 	$(item).find('td').slice(thIndex, thLength).remove();
		// 	$(item).find('th').slice(thIndex, thLength).remove();
		// });
	},
	// 显示同行
	mouseoverTr: function (event) {
		let _this = this;
		let $tableBody = _this.$tableBody;
		let $tableFixed = _this.$tableFixed;

		let $target = $(event.target);
		let index;

		if ($target.is('td')) {
			index = $target.parent().index();
			$tableBody.find('tbody').find('tr').eq(index).addClass('active');
			$tableFixed ? $tableFixed.find('tbody').find('tr').eq(index).addClass('active') : '';
		} else {
			index = $target.parentsUntil('tr').parent().index();
			$tableBody.find('tbody').find('tr').eq(index).addClass('active');
			$tableFixed ? $tableFixed.find('tbody').find('tr').eq(index).addClass('active') : '';
		}
	},
	// 隐藏同行
	mouseleaveTr: function (event) {
		let _this = this;
		let $tableBody = _this.$tableBody;
		let $tableFixed = _this.$tableFixed;

		let $target = $(event.target);
		let index;

		if ($target.is('td')) {
			index = $target.parent().index();
			$tableBody.find('tbody').find('tr').eq(index).removeClass('active');
			$tableFixed ? $tableFixed.find('tbody').find('tr').eq(index).removeClass('active') : '';
		} else {
			index = $target.parentsUntil('tr').parent().index();
			$tableBody.find('tbody').find('tr').eq(index).removeClass('active');
			$tableFixed ? $tableFixed.find('tbody').find('tr').eq(index).removeClass('active') : '';
		}
	},
	editInputBlur: function (event) {
		event && event.preventDefault();
		let _this = this;
		let $target = $(event.target);
		let value = $target.val();
		let $text = $target.parent('.table-edit-input').siblings('.table-edit-text');
		let json = JSON.parse($text.attr('data-params'));
		let _url = $text.attr('data-url');
		let str = '';

		json['value'] = value;

		// 必须参数demo:<span class="table-edit-text" data-url="" data-params="{}">num like: 9999</span>
		if (_url === '') {
            let valueText = Utils.commafy(parseInt(value)) === '' ? '-' : Utils.commafy(parseInt(value));
            _this.showEditText(valueText, event);
            return;
		}
		
		$.ajax({
			url: _url,
			type: 'post',
			data: json,
			dataType: 'json'
		}).then(function (res) {
			if (res.status) {
				let valueText = Utils.commafy(parseInt(value)) === '' ? '-' : Utils.commafy(parseInt(value));
				_this.showEditText(valueText, event);
			} else {
				_this.showEditText('error', event);
			}
		});
	},
	sortFn: function (event, isDown) {
		event && event.preventDefault();
		let _this = this;
		let $tableBody = _this.$tableBody;
		let $tr = $tableBody.find('tr');
		let $th = $(event.target).parent('th');
		let index = $th.attr('data-index') - 1;
		let sortJson = [];
		// 切换class
		_this.sortView.call(_this, event);
		// 渲染排序所需的json
		$.each($tr, function (_index, el) {
			let _temp = {};
			_temp.index = _index;
			if ($th.attr('data-commafy') === 'true') {
				_temp.value = $(el).find('td').eq(index).text().trim();
			} else {
				_temp.value = $(el).find('td').eq(index).text().trim();
			}
			sortJson.push(_temp);
		});
		// 排序
		sortJson = Utils.order(sortJson, 'value', isDown);
		// 渲染排序好的html
		_this.sortRender.call(_this, sortJson);

		// 固定表格还没渲染
	},
	collapsed: function (event) {
		event && event.preventDefault();
		let _this = this;
		let config = _this.config;
    let $tableFixed = _this.$tableFixed;
    let $tableBody = _this.$tableBody;
    
		let $target = $(event.target);
		let _url = $target.attr('data-url');
		let $tr = $target.parent('td').parent('tr');
		let trIndex = $tr.index();

		config.tableCollBeforeSend.call(_this, trIndex, event);
		_this.hideCollapsed.call(_this, trIndex, event);

		if ($tr.nextUntil('tr'+config.childrenClass).length) {
			config.tableCollSuccess.call(_this, trIndex, event);
			_this.showExpanded.call(_this, trIndex, event);
			return false;
		}

		$.ajax({
			url: _url,
			type: 'get'
		}).then(function (res) {
			if (res.status) {
				$tableFixed.find('tbody').find('tr').eq(trIndex).after(res.html);
				$tableBody.find('tbody').find('tr').eq(trIndex).after(res.html);
				config.tableCollSuccess.call(_this, trIndex, event);
				_this.showExpanded.call(_this, trIndex, event);
			}
		});
	},
	expanded: function (event) {
		event && event.preventDefault();
		let _this = this;
		let $target = $(event.target);
		let $tr = $target.parent('td').parent('tr');
		let trIndex = $tr.index();

		_this.showCollapsed.call(_this, trIndex, event);
	}
}

module.exports = Event
