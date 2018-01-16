let multiUtils = {
  selectToDiv: function (str) {
    let result = str || '';
    result = result.replace(/<select[^>]*>/gi, '<ul>').replace('</select','</ul');
    result = result.replace(/<\/optgroup>/gi, '');
    result = result.replace(/<optgroup[^>]*>/gi, function(matcher) {
      let groupName = /label="(.[^"]*)"(\s|>)/.exec(matcher);
      let groupId = /data\-group\-id="(.[^"]*)"(\s|>)/.exec(matcher);
      return '<li class="dropdown-group" data-group-id="'+groupId[1] || ''+'">'+groupName[1] || ''+'</li>';
    });
    result = result.replace(/<option(.*?)<\/option>/gi, function (matcher) {
      let value = /value="?([\w\u4E00-\u9FA5\uF900-\uFA2D]+)"?/.exec(matcher);
      let name = />(.*)<\//.exec(matcher);
      let isSelected = matcher.indexOf('selected') > -1 ? true : false;
      let isDisabled = matcher.indexOf('disabled') > -1 ? true : false;
      // return `<li ${isDisabled ? ' disabled' : ' tabindex="0"'} data-value="${value[1] || ''}" class="dropdown-option ${isSelected ? 'dropdown-chose' : ''}">${name[1] || ''}</li>`;
      return '<li '+(isDisabled ? " disabled" : " tabindex='0'")+' data-value="'+value[1]+'" class="dropdown-option'+(isSelected ? " dropdown-chose" : "")+'">'+name[1]+'</li>'
    });
    return result;
  },
  createTemplate: function () {
    let isLabelMode = this.isLabelMode;
    let searchable = this.config.searchable;
    let templateSearch = searchable ? `<span class="dropdown-search">${this.config.input}</span>` : '';
    return isLabelMode ?
      `<div class="dropdown-display-label">
        <div class="dropdown-chose-list">${templateSearch}</div>
      </div>
      <div class="dropdown-main ${this.config.hideClass}">{{ul}}</div>` :
      `<a href="javascript:;" class="dropdown-display">
        <span class="dropdown-chose-list"></span>
        <a href="javascript:;" class="dropdown-clear-all">\xD7</a>
      </a>
      <div class="dropdown-main ${this.config.hideClass}">${templateSearch}{{ul}}</div>`;
  },
  selectToObject: function (el) {
    let $select = el;
    let result = [];
    function readOption(key, el) {
      let $option = $(el);
      this.id = $option.prop('value');
      this.name = $option.text();
      this.disabled = $option.prop('disabled');
      this.selected = $option.prop('selected');
    }
    $.each($select.children(), function (key, el) {
      let tmp = {};
      let tmpGroup = {};
      let $el = $(el);
      if (el.nodeName === 'OPTGROUP') {
        tmpGroup.groupId = $el.data('groupId');
        tmpGroup.groupName = $el.attr('label');
        $.each($el.children(), $.proxy(readOption, tmp));
        $.extend(tmp, tmpGroup);
      } else {
        $.each($el, $.proxy(readOption, tmp));
      }
      result.push(tmp);
    });
    return result;
  },
  objectToSelect: function (data) {
    let map = {};
    let result = '';
    let name = [];
    let selectAmount = 0;
    if (!data || !data.length) {
      return false;
    }
    $.each(data, function (index, val) {
      let hasGroup = val.groupId;
      let isDisabled = val.disabled  ? ' disabled' : '';
      let isSelected = val.selected && !isDisabled ? ' selected' : '';
      let temp = `<option${isDisabled}${isSelected} value="${val.id}">${val.name}</option>`;
      if (isSelected) {
        name.push(`<span class="dropdown-selected">${val.name}<i class="del" data-id="${val.id}"></i></span>`);
        selectAmount++;
      }
      if (hasGroup) {
        if (map[val.groupId]) {
          map[val.grounpId] += temp;
        } else {
          map[val.groupId] = val.groupName + '&janking&' + temp;
        }
      } else {
        map[index] = temp;
      }
    });
    $.each(map, function (index, val) {
      let option = val.split('&janking&');
      if (option.length === 2) {
        let groupName = option[0];
        let items = option[1];
        result += `<optgroup label="${groupName}" data-group-id="${index}">${items}</optgroup>`;
      } else {
        result += val;
      }
    });
    return [result, name, selectAmount];
  },
  maxItemAlert: function () {
    let _dropdown = this;
    let _config = _dropdown.config;
    let $el = _dropdown.$el;
    let $alert = $el.find('.dropdown-maxItem-alert');
    clearTimeout(_dropdown.maxItemAlertTimer);

    if ($alert.length === 0) {
      $alert = $(`<div class="dropdown-maxItem-alert">最多可选择${_config.limitCount}个</div>`);
    }

    $el.append($alert);
    _dropdown.maxItemAlertTimer = setTimeout(function () {
      $el.find('.dropdown-maxItem-alert').remove();
    }, 1000);
  }
}

module.exports = multiUtils