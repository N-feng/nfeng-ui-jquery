let Render = require('./render');
let View = require('./veiw');
let Event = require('./event');
let Utils = require('./utils');
let defaults = {
    container: 'body',
    placeholder: '请选择',
    filterable: false,
    name: '',
    data: [],
    limit: 0,
    change: function () {}
};

function Select(options) {
    return this.each(function (index, el) {
        $(el).data('select', new SelectConstructor(options, el));
    });
}

function SelectConstructor(options, selector) {
    this.config = $.extend({}, defaults, options);
    this.$select = $(selector).wrapAll('<div class="select"></div>').hide();
    this.$container = $(selector).parent('.select');
    this.isSingleSelect = !this.$select.prop('multiple');
    this.config.limit = parseInt(this.$select.attr('limit') || 0);
    this.name = this.$select.prop('name') || this.config.name;
    this.placeholder = this.$select.attr('placeholder') || this.config.placeholder;
    this.filterable = (this.$select.attr('filterable') == '' ? true : false) || this.config.filterable;
    this.selectName = [];
    this.selectAmount = 0;
    this.init(options);
}

$.extend(SelectConstructor.prototype, Render);

$.extend(SelectConstructor.prototype, View);

$.extend(SelectConstructor.prototype, {
    init() {
        if (this.config.data.length === 0) {
            this.config.data = Utils.selectToObject.call(this);
            this.selectAmount = Utils.objectToSelect(this.config.data)[1];
        }
        if (!this.isSingleSelect) {
            this.$container.addClass('is-multiple');
        }
        this.renderInit();
        this.bindEvent();
    },
    bindEvent() {
        this.$container.on('click.select', '.select-item:not(.disabled)', $.proxy(this.isSingleSelect ? Event.singleChoose : Event.multiChoose, this));
        this.$container.on('click.select', '.select-chose:not(.disabled)', $.proxy(this.show, this));
        this.$container.on('click.select', '.clearAll', $.proxy(Event.clearAll, this));
        this.$container.on('click.select', '.del', $.proxy(Event.del, this));
        this.$container.on('keyup.select', '.search', $.proxy(Event.search, this));
    }
});

$('body').on('click.select', function (event) {
   let $target =  $(event.target);
   if (!$target.parents('.select').length) {
       $('.select-dropdown').fadeOut(100);
       $('.select').removeClass('is-focus');
       $('.select-chose').removeClass('active');
   }
});

module.exports = Select;