let utils = require('./utils');

let Render = {
    renderInit() {
        this.initHiddenInput();
        this.initSelectChose();
        this.initSelectDropDown();
    },
    initHiddenInput() {
        this.$hiddenInput = $('<input type="hidden">');
        this.$container.append(this.$hiddenInput);
        this.renderHiddenInput();
    },
    renderHiddenInput() {
        this.$hiddenInput.attr('name', this.name);
        this.$select.removeAttr('name');
    },
    initSelectDropDown() {
        this.$selectDropDown = $('<div class="select-dropdown">');
        this.$container.append(this.$selectDropDown);
        this.renderSelectDropDown();
    },
    renderSelectDropDown() {
        let outerHTML = this.$select.prop('outerHTML');
        let template = utils.selectToDiv.call(this, outerHTML);
        let arrow = '<span class="arrow"></span>';
        if (this.filterable) {
            let $selectSearch = $('<div class="select-search">');
            let $input = $('<input class="form-control form-control-sm search" placeholder="请输入搜索">');
            $selectSearch.append($input);
            this.$selectDropDown.append($selectSearch);
        }
        this.$selectDropDown.append(template);
        this.$selectDropDown.append(arrow);
    },
    initSelectChose() {
        this.$selectChose = $('<div class="select-chose">');
        this.$selectChose.addClass(this.$select.attr('disabled'));
        this.$container.append(this.$selectChose);
        this.renderSelectChose();
    },
    renderSelectChose() {
        let isShowClose = this.$select.attr('clearable') == '' ? true : false;
        let $placeholder = $('<span class="placeholder">').html(this.placeholder);
        this.$selectChoseList = $('<span class="select-chose-list">');
        this.$selectChoseList.append($placeholder);
        this.$selectChose.append('<span class="input-suffix">' +
                '<i class="input-icon el-icon-arrow-down"></i>' +
                (isShowClose ? '<i class="input-icon el-icon-circle-close clearAll"></i>' : '') +
            '</span>').append(this.$selectChoseList);
        this.$container.addClass(isShowClose ? 'is-show-close' : '');
    }
};

module.exports = Render;