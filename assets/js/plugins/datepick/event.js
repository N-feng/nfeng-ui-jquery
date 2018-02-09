let Utils = require('./utils');
let Event = {
    updateDateView: function (date, event, $selector) {
        event && event.preventDefault();
        let _this = this;
        let _date = date || _this._d;

        _this.update(_date);
        _this.renderDate(_date, $selector);
        _this.showDateView(_date);
    },
    updateMonthView: function (date, event) {
        event && event.preventDefault();
        let _this = this;
        let _date = date || _this._d;

        _this.update(_date);
        _this.renderMonth(_date);
        _this.showMonthView(_date);
    },
    updateYearView(date, event) {
        event && event.preventDefault();
        let _this = this;
        let _date = date || _this._d;
        _this.update(_date);
        _this.renderYear(_date);
        _this.showYearView(_date);
    },
    updateDecadeView(date, event) {
        event && event.preventDefault();
        let _this = this;
        let _date = date || _this._d;
        _this.update(_date);
        _this.renderDecade(_date);
        _this.showDecadeView(_date);
    },
    selectDecade: function (event) {
        event && event.preventDefault();
        let _this = this;
        let config = _this.config;
        let el = event.target;
        let $td = $(el).parent('td');
        let _date = new Date($td.attr('title'));

        _this.update(_date);
        _this.renderYear(_date);
        _this.showYearView(_date);
    },
    selectYear(event) {
        event && event.preventDefault();
        let _this = this;
        let config = _this.config;
        let el = event.target;
        let $td = $(el).parent('td');
        let _date = new Date($td.attr('title'));
        _this.update(_date);
        _this.renderMonth(_date);
        if (_this.config.type === 'year') {
            Event.checked.call(_this, event, config.format.substring(0, 4));
            _this.hide();
        } else {
            _this.showMonthView(_date);
        }
    },
    selectMonth: function (event) {
        event && event.preventDefault();
        let _this = this;
        let config = _this.config;
        let el = event.target;
        let $td = $(el).parent('td');
        let date = new Date($td.attr('title'));

        _this.update(date);
        _this.renderDate(date);
        if (_this.config.type === 'month') {
            Event.checked.call(_this, event, config.format.substring(0, 7));
            _this.config.selectMonth();
            _this.hide();
        } else {
            _this.showDateView();
        }
    },
    selectDay: function (event) {
        event && event.preventDefault();
        let _this = this;
        let config = _this.config;
        let el = event.target;
        let $td = $(el).parent('td');
        let date = new Date($td.attr('title'));

        _this.update(date);
        _this.renderDate(date);
        if (_this.config.type === 'date') {
            Event.checked.call(_this, event, config.format.substring(0, 10));
            _this.config.weeks(Utils.iso8601Week(date));
            _this.hide();
        }
    },
    checked: function (event, fmt) {
        let _this = this;
        _this.value = $(event.target).parent('td').attr('title');
        _this.$el.val(fmt ? Utils.format(_this.value, fmt) : _this.value);
        // $(document).trigger('click.datepick')
    }
};

module.exports = Event;
