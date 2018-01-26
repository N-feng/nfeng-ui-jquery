let action = {
  del: function (event) {
    let _dropdown = this;
    let $target = $(event.target);
    let id = $target.data('id');
    $.each(_dropdown.name, function (key, value) {
      if (value.indexOf('data-id="' + id + '"') !== -1) {
        _dropdown.name.splice(key, 1);
        return false;
      }
    });

    $.each(_dropdown.config.data, function (key, item) {
      if (item.id === id) {
        item.selected = false;
        return false;
      }
    });

    _dropdown.selectedAmount--;
    _dropdown.$container.find('[data-value="' + id + '"]').removeClass('dropdown-chose');
    _dropdown.$container.find('[value="' + id + '"]').prop('selected', false).removeAttr('selected');
    $target.closest('.dropdown-selected').remove();

    return false;
  },
  show: function () {
    let _this = this;
    let config = _this.config;
    let $container = _this.$container;
    $container.find('.dropdown-main').removeClass(config.hideClass+' '+config.animateLeaveClass).addClass(config.animateEnterClass);
  },
  hide: function () {
    let _this = this;
    let config = _this.config;
    let $container = _this.$container;
    $container.find('.dropdown-main').removeClass(config.animateEnterClass).addClass(config.animateLeaveClass);
  },
  clearAll: function () {
    this.$choseList.find('.del').each(function (index, el) {
      $(el).trigger('click');
    });
    this.$container.find('.dropdown-display').removeAttr('title');
    return false;
  }
}
module.exports = action