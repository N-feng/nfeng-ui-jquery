let View = {
    show() {
        this.$selectChoose.addClass('active');
        this.$container.find('.select-dropdown').slideDown(100);
        this.$container.addClass('is-focus');
    },
    hide() {
        // this.$selectChoose.removeClass('active');
        this.$container.find('.select-dropdown').fadeOut(100);
        this.$container.removeClass('is-focus');
    }
};

module.exports = View;