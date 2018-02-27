let multiUtils = require('./utils')
let Render = require('./render')
let View = require('./view')
let Event = require('./event')
let Utils = require('../../base/utils')
let isSafari = (function () {
  let ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('safari') !== -1) {
    return ua.indexOf('chrome') > -1 ? false : true;
  }
})();
let defaults = {
  searchable        : true,
  input             : '<input type="text" maxLength="20" placeholder="搜索关键词或ID">',
  data              : [],
  limitCount        : Infinity,
  hideClass         : 'hide',
  animateEnterClass : 'slideDown-enter-active',
  animateLeaveClass : 'slideDown-leave-active',
  choice            : function () {}
}
let ENP = {
  click   : 'click.multiSelect',
  focus   : 'focus.multiSelect',
  keydown : 'keydown.multiSelect',
  keyup   : 'keyup.multiSelect'
}

function multiSelect (options, selector) {
  let _this = this
  _this.$select = $(selector).wrapAll('<div class="dropdown-multiple"></div>');
  _this.$container = $(selector).parent('.dropdown-multiple');
  _this.placeholder = _this.$select.attr('placeholder');
  _this.config = $.extend({}, defaults, options);
  _this.isLabelMode = _this.config.multipleMode === 'label';
  _this.name = [];
  _this.isSingleSelect = !_this.$select.prop('multiple');
  _this.init();
}

$.extend(multiSelect.prototype, multiUtils);

$.extend(multiSelect.prototype, Render);

$.extend(multiSelect.prototype, View);

$.extend(multiSelect.prototype, Event);

multiSelect.prototype.init = function () {
  let _this = this;
  let _config = _this.config;
  let $container = _this.$container;
  _this.$select.hide();

  if (_config.data.length === 0) {
    _config.data = _this.selectToObject(_this.$select);
  }
  let processResult = _this.objectToSelect(_config.data);
  _this.name = processResult[1];
  _this.selectAmount = processResult[2];
  _this.$select.html(processResult[0]);
  _this.renderSelect();
  _this.changeStatus(_config.disabled ? 'disabled' : _config.readonly ? 'readonly' : false);
}

multiSelect.prototype.changeStatus = function (status) {
  let _this = this;
  if (status === 'readonLy') {
    _this.unbindEvent();
  } else if (status === 'disabled') {
    _this.$select.prop('disabled', true);
    _this.unbindEvent();
  } else {
    _this.$select.prop('disabled', false);
    _this.bindEvent();
  }
}

multiSelect.prototype.bindEvent = function () {
  let _this = this;
  let config = _this.config;
  let $container = _this.$container;
  let openHandle = isSafari ? ENP.click : ENP.focus;

  $container.on(ENP.click, function (event) { event.stopPropagation(); });
  $container.on(ENP.click, '.del', $.proxy(_this.del, _this));

  if(_this.isLabelMode) {} else {
    $container.on(openHandle, '.dropdown-display', $.proxy(_this.show, _this));
    $container.on(openHandle, '.dropdown-clear-all', $.proxy(_this.clearAll, _this));
  }

  $container.on(ENP.keyup, 'input', $.proxy(this.search, _this));

  $container.on(ENP.click, '[tabindex]', $.proxy(_this.isSingleSelect ? _this.singleChoose : _this.multiChoose, _this));

  $(config.container).on(ENP.click, function (event) {
    _this.hide();
  });

  Utils.animateEndShim($container.find('.dropdown-main'), function () {
    if ($container.find('.dropdown-main').hasClass(config.animateLeaveClass)) {
      $container.find('.dropdown-main')
        .removeClass(config.animateLeaveClass)
        .addClass(config.hideClass);
    }
  });

}

$(document).on(ENP.click, function (event) {
  let $target = $(event.target);
  if ($('.dropdown-single,.dropdown-multiple,.dropdown-multiple-label').find('.dropdown-main').hasClass('slideDown-enter-active')) {
    $('.dropdown-single,.dropdown-multiple,.dropdown-multiple-label').find('.dropdown-main').removeClass('slideDown-enter-active').addClass('slideDown-leave-active');
  }
});

module.exports = {
	multiSelect: function (options) {
		return this.each(function (index, el) {
			$(el).data('multiSeletct', new multiSelect(options, el));
		});
	}
}