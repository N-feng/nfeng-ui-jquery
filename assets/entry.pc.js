require("./sass/style.scss");

var NUI = {};

// 注入到jQuery原型对象
$.each([
	require('./js/plugins/datepick'),
	require('./js/plugins/multiSelect'),
	require('./js/plugins/layer'),
	require('./js/plugins/validate'),
	require('./js/plugins/fixedBox'),
	require('./js/plugins/scrollbar'),
	require('./js/plugins/table'),
	require('./js/plugins/navmenu')		// 菜单
], function (index, component) {
	if (typeof component === 'object' && !NUI[component]) {
		$.extend(NUI, component);
	}
});

// 注入到jQuery全局对象
$.each([
	require('./js/base/pubsub'),
	require('./js/component/loading'),		// 加载
	require('./js/base/urlHelper'),		// 拿url参数
	require('./js/component/message'),		// 提示
    require('./js/component/tooltip')
], function (index, component) {
	$.extend(component);
});

// 调用插件
$.fn.NUI = function () {
	var arg = arguments;
	var component = NUI[arguments[0]];
	if (component) {
		arg = Array.prototype.slice.call(arg, 1);
		return component.apply(this, arg);
	} else {
		$.error('Method ' + arguments[0] + ' does not exist on jQuery.NUI Plugin');
		return this;
	}
};

require('./js/component/table');
require('./js/plugins/datepick');

require('./js/component/layer');

require('./js/pages/echarts');
require('./js/pages/select');
require('./js/pages/tipsbox');
require('./js/pages/owl');
require('./js/pages/datepicker');
require('./js/pages/multiCheck');
require('./js/pages/global');
require('./js/pages/city');
require('./js/pages/index');

require('../static/js/demo');
