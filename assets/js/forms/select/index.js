let Render = require('./render');
let View = require('./veiw');
let Event = require('./event');
let Utils = require('./utils');
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

$.extend(Select.prototype, View);

Select.prototype.init = function () {
    this.$select.hide();
    if (this.config.data.length === 0) {
        this.config.data = Utils.selectToObject.call(this);
        this.selectAmount = Utils.objectToSelect(this.config.data)[1];
    }
    if (!this.isSingleSelect) {
        this.$container.addClass('is-multiple');
    }
    this.renderInit();
    // disabled权重高于readonly
    this.changeStatus(this.disabled ? 'disabled' : this.readonly ? 'readonly' : false);
};

Select.prototype.bindEvent = function () {
    let chooseHandle = $.proxy(this.isSingleSelect ? Event.singleChoose : Event.multiChoose, this);
    this.$container.on('click.select', '.select-item:not(.disabled)', chooseHandle);
    this.$container.on('click.select', '.select-choose:not(.disabled)', $.proxy(this.show, this));
    this.$container.on('click.select', '.clearAll', $.proxy(Event.clearAll, this));
    this.$container.on('click.select', '.del', $.proxy(Event.del, this));
    this.$container.on('keyup.select', '.search', $.proxy(Event.search, this));
    this.$selectChoose.on('keydown.select', $.proxy(Event.control, this));
    this.$selectChoose.on('keyup.select', $.proxy(Event.choose, this));
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