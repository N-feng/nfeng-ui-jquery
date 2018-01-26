module.exports = {
  showLayer: function (cutto) {
    let _this = this;
  },
  showDialog: function () {
    let _this = this;
    let config = _this.config;
    let $target = $(config.target)[0];
    let matrix = $target.getBoundingClientRect();
    let triangleHeight = _this.$selector.find('.triangle').height();
    let _x = matrix.left - config.width + $target.offsetWidth;
    let _y = matrix.top + matrix.height + triangleHeight;
    _this.$selector.css({
      left  : _x,
      right : 'auto',
      top   : _y
    }).removeClass(config.hideClass)
    .addClass(config.animateEnterClass)
    .removeClass(config.animateLeaveClass);

    // _this.bindEvent();
  },
  hideDialog: function () {
    let _this = this;
    let config = _this.config;
    _this.$selector
        .removeClass(config.anmateEnterClass)
        .addClass(config.animateLeaveClass);
  }
}