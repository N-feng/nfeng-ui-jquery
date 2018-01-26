let Render = {
  renderSelect: function () {
    let _this = this;
    let $container = _this.$container;
    let $select = _this.$select;
    let template = _this.createTemplate.call(_this).replace('{{ul}}', _this.selectToDiv($select.prop('outerHTML')));
    
    $container.append(template).find('ul').removeAttr('style class');
  
    _this.$choseList = $container.find('.dropdown-chose-list');
  
    if (!_this.isLabelMode) {
      _this.$choseList.html($('<span class="placeholder"></span>').text(_this.placeholder));
    }
  
    _this.$choseList.prepend(_this.name.join(''));
  
  }
}

module.exports = Render