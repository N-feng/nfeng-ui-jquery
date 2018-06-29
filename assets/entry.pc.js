"use strict";
require("./sass/style.scss");

var NUI;
NUI = {};

// 注入到jQuery全局对象
$.each([
    require("./js/base/pubsub"),			// 订阅发布
    require("./js/base/urlHelper"),			// 拿url参数
    require('./js/feedback/alert'),         // 警告
    require('./js/feedback/dialog'),        // 对话框
    require("./js/feedback/loading"),		// 加载
    require("./js/feedback/message"),		// 信息
    require('./js/feedback/overlay'),      	// 蒙层
    require('./js/feedback/popover'),       // 泡泡框
    require('./js/feedback/tooltip'),		// 文字提示
    require("./js/other/clock"),			// 时钟
    require("./js/other/parallax"),			// 3d视差
], function (index, component) {
    $.extend(component);
});

// 注入到jQuery原型对象
$.each([
    require("./js/base/ajaxForm"),          // 整个表单提交
    require("./js/forms/select"),			// 选择器
    require("./js/forms/validate"),			// 验证
    require("./js/plugins/datepick"),		// 时间选择控件
    require("./js/plugins/layer"),			// 弹层
    require("./js/plugins/scrollbar"),      // 模拟滚动条
    require("./js/plugins/table"),          // 表单
    require("./js/plugins/navmenu"),		// 菜单
], function (index, component) {
    if (typeof component === "object" && !NUI[component]) {
        $.extend(NUI, component);
    }
});

// 调用插件
$.fn.NUI = function () {
    var arg = arguments;
    var component = NUI[arguments[0]];
    if (component) {
        arg = Array.prototype.slice.call(arg, 1);
        return component.apply(this, arg);
    } else {
        $.error("Method " + arguments[0] + " does not exist on jQuery.NUI Plugin");
        return this;
    }
};

require("./js/pages/global");