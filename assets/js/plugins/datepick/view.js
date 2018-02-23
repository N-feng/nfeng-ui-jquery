module.exports = {
    showMonthView: function () {
        let _this = this;
        let config = _this.config;
        _this.currentView = 'month';
        _this.$dateView.addClass(config.hideClass);
        _this.$yearView.addClass(config.hideClass);
        _this.$monthView.removeClass(config.hideClass);
        _this.$decadeView.addClass(config.hideClass);
        _this.renderHeader();
    },
    showDateView: function () {
        let _this = this;
        let config = _this.config;
        _this.currentView = 'date';
        _this.$dateView.removeClass(config.hideClass);
        _this.$yearView.addClass(config.hideClass);
        _this.$monthView.addClass(config.hideClass);
        _this.$decadeView.addClass(config.hideClass);
        _this.renderHeader();
    },
    showYearView() {
        let _this = this;
        let config = _this.config;
        _this.currentView = 'year';
        _this.$dateView.addClass(config.hideClass);
        _this.$monthView.addClass(config.hideClass);
        _this.$yearView.removeClass(config.hideClass);
        _this.$decadeView.addClass(config.hideClass);
        _this.renderHeader();
    },
    showDecadeView() {
        let _this = this;
        let config = _this.config;
        _this.currentView = 'decade';
        _this.$dateView.addClass(config.hideClass);
        _this.$monthView.addClass(config.hideClass);
        _this.$yearView.addClass(config.hideClass);
        _this.$decadeView.removeClass(config.hideClass);
        _this.renderHeader();
    },
    show: function () {
        let _this = this;
        let matrix = _this.$el[0].getBoundingClientRect();
        let _x = matrix.left;
        let _y = matrix.top + matrix.height;
        _this.$container.css({
            left: _x,
            top: _y
        }).removeClass('datepick-hidden').addClass('slideDown-enter-active').removeClass('slideDown-leave-active');
    },
    hide: function () {
        let _this = this;
        let config = _this.config;
        _this.$container.removeClass(config.animateEnterClass).addClass(config.animateLeaveClass);
    }
};
