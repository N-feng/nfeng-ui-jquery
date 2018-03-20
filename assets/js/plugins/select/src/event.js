let utils = require('../../../base/utils');
let Utils = require('./utils');
let Event = {
    singleChoose(event) {
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
                    let span = '<span class="select-chose-item">' + item.text + i + '</span>';
                    self.selectName.push(span);
                }
            }
        });

        this.$select.find('option[value="' + value + '"]').prop('selected', true);
        self.selectName.push('<span class="placeholder">' + this.placeholder + '</span>');
        this.$selectChoseList.html(self.selectName.join(''));

        this.config.change.call(this, value, $target.text());
        this.$hiddenInput.val(value);
        this.hide();
    },
    multiChoose(event) {
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
                let span = '<span class="select-chose-item">' + item.text + i + '</span>';
                self.selectName.push(span);
                selectedValue.push(item.value);
            }
        });

        this.$select.find('option[value="'+value+'"]').prop('selected', hasSelected ? false : true);

        this.$selectChoseList.find('.select-chose-item').remove();
        this.$selectChoseList.prepend(self.selectName.join(''));
        this.$hiddenInput.val(selectedValue.join(','));
        this.config.change.call(this, value, $target.text());
    },
    clearAll() {
        this.$selectChoseList.find('.del').each(function (index, item) {
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
        $target.closest('.select-chose-item').remove();
        return false;
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
};
module.exports = Event;