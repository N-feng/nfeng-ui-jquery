let Utils = {
	// 获取tableFixed thead
	getTableFixedThead: function ($tableHeader, thIndex) {
		let html = '<thead><tr>';
		$.each($tableHeader.find('th').slice(0, thIndex + 1), function (index, item) {
			html += '<th class="sorting">'+
						$(item).html()+
						'<div class="unlock uk-icon-unlock">'+
						'</div>'+
					'</th>';
		});
		html += '</tr></thead>';
		return html;
	},
	// 获取tableFixed tbody
	getTableFixedTBody: function ($tableBody, thIndex) {
		let html = '<tbody>';
		$.each($tableBody.find('tr'), function (index, item) {
			html += '<tr class="'+$(item).attr('class')+'">';
			$.each($(item).find('td').slice(0, thIndex + 1), function (key, value) {
				if ($(value).html() === '') {
					html += '<td>&nbsp;</td>';
				} else {
					html += '<td>'+$(value).html()+'</td>';
				}
			});
			html += '</tr>';
		});
		html += '</tbody>';
		return html;
	},
	// 获取tableFixed colgroup
	getTableHeaderColgroup: function ($tableHeader, thIndex) {
		let html = '<colgroup>';
		for (let i = 0; i < thIndex + 1; i++) {
			html += '<col style="width: '+ $tableHeader.find('th').eq(i).outerWidth() +'px;">';
		}
		html += '</colgroup>';
		return html;
	},
	// 获取tableFixed width
	getTableFixedWidth: function ($tableHeader, thIndex) {
		let width = 0;
		for (let i = 0; i < thIndex + 1; i++) {
			width += $tableHeader.find('th').eq(i).outerWidth();
		}
		return width;
	},
	/**
	 * 数字格式转换成千分位
	 *@param{Object}num
	 */
	commafy: function (num){
		if ((num+"").trim() == "") {
	    return "";
	  }
	  if (isNaN(num)){
	    return "";
	  }
		num = num + "";
    var re = /(-?\d+)(\d{3})/;
    while (re.test(num)){
      num = num.replace(re,"$1,$2")
    }
	  return num;
	},
	/**
	 * 去除千分位
	 *@param{Object}num
	 */
	delcommafy: function (num){
	  return num.replace(/,/gi,'');
	},
	// desc降序
	order: function (arr, key, desc) {
		var orderfn;
    if (arr.length < 2) {
      return;
    }
    if (isNaN(arr[0][key])) {
      //字符串类型
      orderfn = this.orderString;
    } else {
      //数字类型
      orderfn = this.orderNumber;
    }
    arr.sort(function (a, b) {
      var _a = a[key], _b = b[key];
      if (desc) {
        _a = b[key];
        _b = a[key];
      }
      return orderfn(_a, _b);
    });
    return arr;
	},
	//数字排序
  orderNumber: function (a, b) {
    return a - b;
  },
	//字符串排序
  orderString: function (a, b) {
    var titleA = a.toLowerCase(), titleB = b.toLowerCase();
    if (titleA < titleB) return -1;
    if (titleA > titleB) return 1;
    return 0;
  }
}

module.exports = Utils