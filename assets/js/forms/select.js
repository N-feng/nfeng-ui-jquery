let utils = require('../base/utils');
let defaults = {
    filterable: false,
    container: 'body',
    placeholder: '请选择',
    disabled: '',
    name: '',
    data: [],
    limit: 0,
    change: function () {}
};

let KEY_CODE = {
    up    : 38,
    down  : 40,
    enter : 13
};

// select-option 转 ul-li
function selectToDiv(str) {
    let result = str || '';
    result = result.replace(/<select[^>]*>/gi, '<ul>').replace('</select', '</ul');
    result = result.replace(/<\/optgroup>/gi, '');
    result = result.replace(/<optgroup[^>]*>/gi, function (matcher) {
        let groupName = /label="(.[^"]*)"(\s|>)/.exec(matcher);
        let groupId = /data\-group\-id="(.[^"]*)"(\s|>)/.exec(matcher);
        return '<li class="select-group" data-group-id="' + groupId[1] + '">' + groupName[1] + '</li>';
    });
    result = result.replace(/<option(.*?)<\/option>/gi, function (matcher) {
        let value = /value="?([\w\u4E00-\u9FA5\uF900-\uFA2D]+)"?/.exec(matcher);
        let name = />(.*)<\//.exec(matcher);
        let isSelected = matcher.indexOf('selected') > -1 ? " dropdown-choose" : "";
        let isDisabled = matcher.indexOf('disabled') > -1 ? " disabled" : "";
        let className = 'select-item' + isSelected + isDisabled;
        return '<li class="' + className + '" data-value="' + value[1] + '">' + name[1] + '</li>';
    });
    return result;
};

// select-option 转 object-data
function selectToObject() {
    var result = [];
    this.$select.find('option').each(function (index, item) {
        let obj = {};
        let $option = $(item);
        let $optgroup = $option.parent('optgroup');
        if ($optgroup.length) {
            obj.groupId = $optgroup.data('groupId');
            obj.groupName = $optgroup.attr('label');
        }
        obj.value = $option.prop('value');
        obj.text = $option.text();
        obj.disabled = $option.prop('disabled');
        obj.selected = $option.prop('selected');
        result.push(obj);
    });
    return result;
};

// object-data 转 select-option
function objectToSelect(data) {
    let map = {};
    let result = '';
    let selectAmount = 0;

    $.each(data, function (index, item) {
        // disable 权重高于 selected
        let hasGroup = item.groupId;
        let isDisabled = item.disabled ? ' disabled' : '';
        let isSelected = item.selected && !isDisabled ? ' selected' : '';

        let temp = '<option' + isDisabled + isSelected + ' value="' + item.value + '">' + item.text + '</option>';

        if (isSelected) {
            selectAmount++;
        }

        // 判断是否有分组
        if (hasGroup) {
            if (map[item.groupId]) {
                map[item.groupId] += temp;
            } else {
                //  &nfeng& just a separator
                map[item.groupId] = item.groupName + '&nfeng&' + temp;
            }
        } else {
            map[index] = temp;
        }
    });

    $.each(map, function (index, item) {
        let option = item.split('&nfeng&');
        // 判断是否有分组
        if (option.length === 2) {
            let groupName = option[0];
            let items = option[1];
            result += '<optgroup label="' + groupName + '" data-group-id="' + index + '">' + items + '</optgroup>';
        } else {
            result += item;
        }
    });

    return [result, selectAmount];
};

let action = {
    show() {
        // this.$selectChoose.addClass('active');
        this.$container.find('.select-dropdown').slideDown(100);
        this.$container.addClass('is-focus');
    },
    hide() {
        this.$selectChoose.removeClass('active');
        this.$container.find('.select-dropdown').fadeOut(100);
        this.$container.removeClass('is-focus');
    },
    singleChoose(event) {
        event.preventDefault();
        let self = this;
        let $target = $(event.target);
        let value = $target.data('value');
        let hasSelected = $target.hasClass('selected');

        self.selectName = [];

        if ($target.hasClass('selected')) {
            return false;
        }

        this.$selectDropDown.find('li').not($target).removeClass('selected');

        $target.toggleClass('selected');
        $.each(this.config.data, function (index, item) {
            item.selected = false;
            if (item.value == value) {
                item.selected = hasSelected ? 0 : 1;
                if (item.selected) {
                    let i = '<i class="del" data-value="' + item.value + '"></i>';
                    let span = '<span class="select-choose-item">' + item.text + i + '</span>';
                    self.selectName.push(span);
                }
            }
        });

        this.$select.find('option[value="' + value + '"]').prop('selected', true);
        self.selectName.push('<span class="placeholder">' + this.placeholder + '</span>');
        this.$selectChooseList.html(self.selectName.join(''));

        this.config.change.call(this, value, $target.text());
        this.$hiddenInput.val(value);
        this.$hiddenInput.trigger('change');
        action.hide.call(this);
    },
    multiChoose(event) {
        event.preventDefault();
        let self = this;
        let $target = $(event.target);
        let value = $target.data('value');
        let hasSelected = $target.hasClass('selected');
        let selectedValue = [];

        if (hasSelected) {
            $target.removeClass('selected');
            this.selectAmount--;
        } else {
            if (this.config.limit == 0 || this.selectAmount < this.config.limit) {
                $target.addClass('selected');
                this.selectAmount++;
            } else {
                Utils.maxItemAlert.call(this);
                return false;
            }
        }

        self.selectName = [];

        $.each(this.config.data, function (key, item) {
            if (item.value == value) {
                item.selected = hasSelected ? false : true;
            }
            if (item.selected) {
                let i = '<i class="del el-icon-circle-close" data-value="' + item.value + '"></i>';
                let span = '<span class="select-choose-item">' + item.text + i + '</span>';
                self.selectName.push(span);
                selectedValue.push(item.value);
            }
        });

        this.$select.find('option[value="'+value+'"]').prop('selected', hasSelected ? false : true);

        this.$selectChooseList.find('.select-choose-item').remove();
        this.$selectChooseList.prepend(self.selectName.join(''));
        this.$hiddenInput.val(selectedValue.join(','));
        this.config.change.call(this, value, $target.text());
    },
    clearAll() {
        this.$selectChooseList.find('.del').each(function (index, item) {
            $(item).trigger('click.select');
        });
        return false;
    },
    del(event) {
        let self = this;
        let $target = $(event.target);
        let value = $target.data('value');
        let selectedValue = [];
        // 2017-03-23 15:58:50 测试
        // 10000条数据测试删除，耗时 ~3ms
        $.each(self.selectName, function (index, item) {
            if (item.indexOf('data-value="' + value + '"') !== -1) {
                self.selectName.splice(index, 1);
                return false;
            }
        });

        $.each(this.config.data, function (index, item) {
            if (item.value == value) {
                item.selected = false;
                return false;
            }
        });

        $.each(this.config.data, function (key, item) {
            if (item.selected) {
                selectedValue.push(item.value);
            }
        });

        this.selectAmount--;
        this.$container.find('[data-value="' + value + '"]').removeClass('selected');
        this.$container.find('[value="' + value + '"]').prop('selected', false).removeAttr('selected');
        this.$hiddenInput.val(selectedValue.join(','));
        $target.closest('.select-choose-item').remove();
        return false;
    },
    control(event) {
        let keyCode = event.keyCode;
        let KC = KEY_CODE;
        let index = 0;
        let direct;
        let itemIndex;
        let $items;
        if (keyCode === KC.down || keyCode === KC.up) {

            // 方向
            direct = keyCode === KC.up ? -1 : 1;
            $items = this.$container.find('.select-item').not('.disabled');
            itemIndex = $items.index(this.$container.find('.focus'));

            // 初始
            if (itemIndex === -1) {
                index = direct + 1 ? -1 : 0;
            } else {
                index = itemIndex;
            }

            // 确认位序
            index = index + direct;

            // 最后位循环
            if (index === $items.length) {
                index = 0;
            }

            $items.removeClass('focus');
            $items.eq(index).addClass('focus');
            event.preventDefault();
        }
    },
    choose (event) {
        let keyCode = event.keyCode;
        let KC = KEY_CODE;
        if (keyCode === KC.enter) {
            this.$container.find('.focus').trigger('click.select');
        }
    },
    search: utils.throttle(function (event) {
        let result = [];
        let $target = $(event.target);
        let value = $target.val();
        let $selectEmpty = $('<li>').addClass('select-empty').text('无匹配数据');

        if (event.keyCode > 36 && event.keyCode < 41) {
            return;
        }

        $.each(this.config.data, function (index, item) {
            if (item.text.toLowerCase().indexOf(value) > -1 || item.value == value) {
               result.push(item);
            }
        });

        this.$selectDropDown.find('ul').html(Utils.selectToDiv(Utils.objectToSelect(result)[0]) || $selectEmpty);

    }, 300),
}

let Render = {
    renderInit() {
        this.initSelectchoose();
        this.initSelectDropDown();
    },
    initSelectchoose() {
        this.$selectChoose = $('<a class="select-choose">');
        this.$selectChoose.addClass(this.disabled);
        this.$hiddenInput = $('<input type="hidden">');
        this.$hiddenInput.attr('name', this.name);
        this.$select.removeAttr('name');
        this.$selectChoose.append(this.$hiddenInput);
        this.$container.append(this.$selectChoose);
        this.renderSelectchoose();
    },
    renderSelectchoose() {
        let isShowClose = this.$select.attr('clearable') == '' ? true : false;
        let $placeholder = $('<span class="placeholder">').html(this.placeholder);
        this.$selectChooseList = $('<span class="select-choose-list">');
        this.$selectChooseList.append($placeholder);
        this.$selectChoose.append('<span class="input-suffix">' +
            '<i class="input-icon el-icon-arrow-down"></i>' +
            (isShowClose ? '<i class="input-icon el-icon-circle-close clearAll"></i>' : '') +
            '</span>').append(this.$selectChooseList);
        this.$container.addClass(isShowClose ? 'is-show-close' : '');
    },
    initSelectDropDown() {
        this.$selectDropDown = $('<div class="select-dropdown">');
        this.$container.append(this.$selectDropDown);
        this.renderSelectDropDown();
    },
    renderSelectDropDown() {
        let outerHTML = this.$select.prop('outerHTML');
        let template = selectToDiv(outerHTML);
        let arrow = '<span class="arrow"></span>';
        if (this.filterable) {
            let $selectSearch = $('<div class="select-search">');
            let $input = $('<input class="form-control sm search" placeholder="请输入搜索">');
            $selectSearch.append($input);
            this.$selectDropDown.append($selectSearch);
        }
        this.$selectDropDown.append(template);
        this.$selectDropDown.append(arrow);
    }
};
// let View = require('./veiw');
// let Event = require('./event');

function Select(options, selector) {
    this.config = $.extend({}, defaults, options);
    this.$select = $(selector).wrapAll('<div class="select"></div>');
    this.$container = $(selector).parent('.select');
    this.isSingleSelect = !this.$select.prop('multiple');
    this.config.limit = parseInt(this.$select.attr('limit') || 0);
    this.name = this.$select.prop('name') || this.config.name;
    this.placeholder = this.$select.attr('placeholder') || this.config.placeholder;
    this.filterable = (this.$select.attr('filterable') == '' ? true : false) || this.config.filterable;
    this.disabled = this.$select.attr('disabled') || this.config.disabled;
    this.readonly = this.$select.attr('readOnly') || this.config.readonly;
    this.selectName = [];
    this.selectAmount = 0;
    this.init(options);
}

$.extend(Select.prototype, Render);

// $.extend(Select.prototype, View);

Select.prototype.init = function () {
    this.$select.hide();
    if (this.config.data.length === 0) {
        this.config.data = selectToObject.call(this);
        this.selectAmount = objectToSelect(this.config.data)[1];
    }
    if (!this.isSingleSelect) {
        this.$container.addClass('is-multiple');
    }
    this.renderInit();
    // disabled权重高于readonly
    this.changeStatus(this.disabled ? 'disabled' : this.readonly ? 'readonly' : false);
};

Select.prototype.bindEvent = function () {
    let chooseHandle = $.proxy(this.isSingleSelect ? action.singleChoose : action.multiChoose, this);
    this.$container.on('click.select', '.select-item:not(.disabled)', chooseHandle);
    this.$container.on('click.select', '.select-choose:not(.disabled)', $.proxy(action.show, this));
    this.$container.on('click.select', '.clearAll', $.proxy(action.clearAll, this));
    this.$container.on('click.select', '.del', $.proxy(action.del, this));
    this.$container.on('keyup.select', '.search', $.proxy(action.search, this));
    this.$selectChoose.on('keydown.select', $.proxy(action.control, this));
    this.$selectChoose.on('keyup.select', $.proxy(action.choose, this));
};

Select.prototype.unbindEvent = function () {
    this.$container.off('click.select', '.select-item:not(.disabled)');
    this.$container.off('click.select', '.select-choose:not(.disabled)');
    this.$container.off('click.select', '.clearAll');
    this.$container.off('click.select', '.del');
    this.$container.off('keyup.select', '.search');
    this.$selectChoose.off('keydown.select');
    this.$selectChoose.off('keyup.select');
};

Select.prototype.changeStatus = function (status) {
    if (status == 'readonly') {
        this.unbindEvent();
    } else if (status == 'disabled') {
        this.$select.prop('disabled', true);
        this.$selectChoose.addClass('disabled');
        this.unbindEvent();
    } else {
        this.$select.prop('disabled', false);
        this.$selectChoose.removeClass('disabled');
        this.bindEvent();
    }
};

Select.prototype.destory = function () {
    this.$container.children().not('select').remove();
    this.$select.show().attr('name', this.name);
};

$('body').on('click.select', function (event) {
   let $target =  $(event.target);
   if (!$target.parents('.select').length) {
       $('.select-dropdown').fadeOut(100);
       $('.select').removeClass('is-focus');
       $('.select-choose').removeClass('active');
   }
});

module.exports = {
    select: function (options) {
        return this.each(function (index, el) {
            $(el).data('select', new Select(options, el));
        });
    }
};