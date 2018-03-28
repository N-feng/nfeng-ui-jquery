let utils = require('./utils');

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
        let template = utils.selectToDiv.call(this, outerHTML);
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

module.exports = Render;