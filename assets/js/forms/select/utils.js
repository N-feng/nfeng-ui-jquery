let utils = {
    selectToDiv(str) {
        // select-option 转 ul-li
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
    },
    selectToObject() {
        // select-option 转 object-data
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
    },
    objectToSelect(data) {
        // object-data 转 select-option
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
    },
    maxItemAlert() {
        // 超出限制提示
        let self = this;
        let $alert = this.$container.find('.select-alert');
        clearTimeout(this.maxItemAlertTimer);

        if ($alert.length === 0) {
            $alert = $('<div class="select-alert"></div>');
            $alert.html('最多可选择' + this.config.limit + '个');
        }

        this.$container.append($alert);
        this.maxItemAlertTimer = setTimeout(function () {
            self.$container.find('.select-alert').remove();
        }, 1000);
    }
};

module.exports = utils;