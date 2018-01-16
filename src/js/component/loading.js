let defaults = {
  display: false,
  type: 'ios',
  text: false,
  shadow: true,
  iosTemplate: iosTemplate
};

function Loading(options, type) {
  let _this = this;
  let _config = $.extend({}, defaults, options);
  let isGlobal = this instanceof $;
  let $context = $('body');
  let $loading = $('<div/>',{class: _config.type + 'Template'}).html(_config[_config.type + 'Template'](_config));

  options !== void 0 ? _config.display = options : '';
  if (isGlobal) {
    $context = this;
    $context.css('position', 'relative');
  }
  if (_config.display) {
    $context.data('loading', $loading).append($loading);
  } else {
    $context.data('loading').remove();
  }
}

function iosTemplate(config) {
  var loadingStr = `<div class="ios-loading"  ${config.shadow ? '' : 'style="background-color: transparent;"'}>
  <div class=indicator ${config.text ? '' : 'style="height: 55px;"'}>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
    <div class="segment"></div>
  </div>
  ${config.text ? '<span>Loading...</span>' : ''}
</div>`;
  return loadingStr;
}

$.fn.loading = Loading;

module.exports = { loading: Loading };