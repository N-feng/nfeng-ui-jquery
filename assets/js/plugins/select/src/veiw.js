let View = {
    show() {
        this.$selectChose.addClass('active');
        this.$container.find('.select-dropdown').slideDown(100);
        this.$container.addClass('is-focus');
    },
    hide() {
        // this.$selectChose.removeClass('active');
        this.$container.find('.select-dropdown').fadeOut(100);
        this.$container.removeClass('is-focus');
    }
};
module.exports = View;