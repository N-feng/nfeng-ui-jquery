module.exports = {
	// 更新 body-table 尺寸
	updateBodyMaxHeight: function (height) {
		let _this = this;
		let config = _this.config;
		let maxHeight = height || config.maxHeight;
		let $tableBody = _this.$tableBody;

		if (!maxHeight) {return;}
		$tableBody.css({
			'max-height': maxHeight
		});
	},
	// 展示 、 刷新  fixed-table  尺寸
	showTableFixed: function (tableFixedWidth) {
		let _this = this;
		let config = _this.config;
		let $tableHeader = _this.$tableHeader;
		let $tableBody = _this.$tableBody;
		let $tableFixed = _this.$tableFixed;

		let maxHeight = $tableBody.height();
		let maxWidth = $tableBody.width();

		if (tableFixedWidth) {
			$tableFixed.css('max-width', maxWidth > tableFixedWidth ? tableFixedWidth : maxWidth);
		}

		if ($tableFixed && $tableFixed.find('tr').length) {
			$tableFixed.removeClass('hide');
			$tableFixed.find('.table-body').css('max-height', maxHeight);
			$tableFixed.find('.table-body').scrollTop($tableBody.scrollTop());
		}
			
	},
	showAdjective: function (event) {
		let _this = this;
		let $target = $(event.target);
		let url = $target.data('url');

		console.log(url)
	},
	showEditInput: function (value, event) {
		let _this = this;
		let $target = $(event.target);

		$target.addClass('hide');
		$target.siblings('.table-edit-input').removeClass('hide');
		$target.siblings('.table-edit-input').find('input').val(value).trigger('focus.table');
	},
	showEditText: function (value, event) {
		let _this = this;
		let $target = $(event.target);
		let $input = $target.parent('.table-edit-input');
		let $text = $input.siblings('.table-edit-text');

		$input.addClass('hide');
		$text.removeClass('hide');
		$text.text(value);
	},
	// 显示已展开按钮
	showExpanded: function (trIndex, event) {
		let _this = this;
		let config = _this.config;
    let $tableFixed = _this.$tableFixed;
    let $tableBody = _this.$tableBody;

		$tableFixed.find('tbody').find('tr').eq(trIndex).find('.table-collapsed').addClass('hide');
		$tableBody.find('tbody').find('tr').eq(trIndex).find('.table-collapsed').addClass('hide');

		$tableFixed.find('tbody').find('tr').eq(trIndex).find('.table-expanded').removeClass('hide');
		$tableBody.find('tbody').find('tr').eq(trIndex).find('.table-expanded').removeClass('hide');

		$tableFixed.find('tbody').find('tr').eq(trIndex).nextUntil('tr'+config.childrenClass).removeClass('hide');
		$tableBody.find('tbody').find('tr').eq(trIndex).nextUntil('tr'+config.childrenClass).removeClass('hide');
	},
	// 隐藏未展开按钮
	hideCollapsed: function (trIndex, event) {
    let _this = this;
    let $tableFixed = _this.$tableFixed;
    let $tableBody = _this.$tableBody;

		$tableFixed.find('tbody').find('tr').eq(trIndex).find('.table-collapsed').addClass('hide');
		$tableBody.find('tbody').find('tr').eq(trIndex).find('.table-collapsed').addClass('hide');
	},
	// 显示未展开按钮
	showCollapsed: function (trIndex, event) {
		let _this = this;
		let config = _this.config;
    let $tableFixed = _this.$tableFixed;
    let $tableBody = _this.$tableBody;

		$tableFixed.find('tbody').find('tr').eq(trIndex).find('.table-collapsed').removeClass('hide');
		$tableBody.find('tbody').find('tr').eq(trIndex).find('.table-collapsed').removeClass('hide');

		$tableFixed.find('tbody').find('tr').eq(trIndex).find('.table-expanded').addClass('hide');
		$tableBody.find('tbody').find('tr').eq(trIndex).find('.table-expanded').addClass('hide');

		$tableFixed.find('tbody').find('tr').eq(trIndex).nextUntil('tr'+config.childrenClass).addClass('hide');
		$tableBody.find('tbody').find('tr').eq(trIndex).nextUntil('tr'+config.childrenClass).addClass('hide');
	},
	// 显示排序按钮
	sortView: function (event) {
		let $target = $(event.target);
		let $th = $target.parent('th');
		
		if ($th.hasClass('sorting')) {
			$th.removeClass('sorting').addClass('sorting_asc');
		} else if ($th.hasClass('sorting_asc')) {
			$th.addClass('sorting_desc').removeClass('sorting_asc');
		} else if ($th.hasClass('sorting_desc')) {
			$th.addClass('sorting_asc').removeClass('sorting_desc');
		}

		$th.siblings().removeClass('sorting_asc sorting_desc').addClass('sorting');
	}
}