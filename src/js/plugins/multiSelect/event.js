let utils = require('../../common/utils')
let action = {
  singleChoose: function (event) {
    let _this = this;
    let _config = _this.config;
    let $container = _this.$container;
    let $select = _this.$select;
    let $target = $(event.target);
    let value = $target.data('value');
    let hasSelected = $target.hasClass('dropdown-chose');

    _this.name = [];

    if ($target.hasClass('dropdown-chose')) {
      return false;
    }

    $container.removeClass('active').find('li').not($target).removeClass('dropdown-chose');

    $target.toggleClass('dropdown-chose');

    $.each(_config.data, function (key, item) {
      item.selected = false;
      if ('' + item.id === '' + value) {
        item.selected = hasSelected ? 0 : 1;
        if (item.selected) {
          _this.name.push(`<span class="dropdown-selected">${item.name}</i></span>`);
        }
      }
    });

    $select.find('option[value="' + value + '"]').prop('selected', true);

    _this.name.push(`<span class="placeholder">${_this.placeholder}</span>`);

    _this.$choseList.html(_this.name.join(''));
    _this.hide();
  },
  multiChoose: function (event) {
    let _dropdown = this;
    let _config = _dropdown.config;
    let $select = _dropdown.$select;
    let $target = $(event.target);
    let value = $target.data('value');
    let hasSelected = $target.hasClass('dropdown-chose');
    let selectedName = [];

    if (hasSelected) {
      $target.removeClass('dropdown-chose');
      _dropdown.selectAmount--;
    } else {
      if (_dropdown.selectAmount < _config.limitCount) {
        $target.addClass('dropdown-chose');
        _dropdown.selectAmount++;
      } else {
        _dropdown.maxItemAlert.call(_dropdown);
        return false;
      }
    }

    _dropdown.name = [];

    $.each(_config.data, function (key, item) {
      if (('' + item.id) === ('' + value)) {
        item.selected = hasSelected ? false : true;
      }
      if (item.selected) {
        selectedName.push(item.name);
        _dropdown.name.push(`<span class="dropdown-selected">${item.name}<i class="del" data-id="${item.id}"></i></span>`);
      }
    });

    $select.find('option[value="' + value + '"]').prop('selected', hasSelected ? false : true);

    _dropdown.$choseList.find('.dropdown-selected').remove();
    _dropdown.$choseList.prepend(_dropdown.name.join(''));
    _dropdown.$container.find('.dropdown-display').attr('title', selectedName.join(','))
    _config.choice.call(_dropdown, event);

  },
  search: utils.throttle(function (event) {

    let _dropdown = this;
    let _config = _dropdown.config;
    let $container = _dropdown.$container;
    let $input = $(event.target);
    let intputValue = $input.val();
    let data = _dropdown.config.data;
    let result = [];

    if (event.keyCode > 36 && event.keyCode < 41) {
      return;
    }

    $.each(data, function (key, value) {
      if (value.name.toLowerCase().indexOf(intputValue) > -1 || ('' + value.id) === '' + intputValue) {
        result.push(value);
      }
    });

    $container.find('ul').html(_dropdown.selectToDiv(_dropdown.objectToSelect(result)[0]) || _config.searchNoData);

  }, 300)
}

module.exports = action