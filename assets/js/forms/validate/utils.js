let Utils = {
	GLOB_STRATEGY: {
        isNonEmpty: function(value) {
            // 是否为空
            if ($.trim(value).length === 0) {
                return false;
            }
        },
        isEmail: function(value) {
            //是否为邮箱
            if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(value)) {
                return false;
            }
        },
        between: function(value, params) {
            var length = value.length;
            var min = params.range[0];
            var max = params.range[1];
            if (length < min || length > max) {
                return false;
            }
        },
        isChecked: function() {
            //至少选中一项 radio || checkbox
            var result = void(0);
            this.each(function(index, el) {
                result = el.checked;
                return result ? false : true;
            });
            return result ? void(0) : false;
        },
        minLength: function(params) {
            //大于
            if (this.self[0].value.length < params.minLength) {
                return false;
            }
        },
        maxLength: function(params) {
            //小于
            if (this.self[0].value.length < params.maxLength) {
                return false;
            }
        },
        birthdayRange: function(params) {
            //生日范围
            var val = this.self[0].value;
            var min = params.range[0];
            var max = params.range[1];
            if (val < min || val > max) {
                return false;
            }
        },
        isBirthday: function(params) {
            //是否为生日
            if (!/^[1-9]\d{3}([-|\/|\.])?((0\d)|([1-9])|(1[0-2]))\1(([0|1|2]\d)|([1-9])|3[0-1])$/.test(this.self[0].value)) {
                return false;
            }
        },
        isMobile: function(params) {
            //是否为手机号码
            if (!/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(this.self[0].value)) {
                return false;
            }
        },
        //纯英文
        onlyEn: function(params) {
            if (!/^[A-Za-z]+$/.test(this.self[0].value)) {
                return false;
            }
        },
        //纯中文
        onlyZh: function(params) {
            if (!/^[\u4e00-\u9fa5]+$/.test(this.self[0].value)) {
                return false;
            }
        },
        //非整数
        notInt: function(params) {
            if (/^[0-9]*$/.test(this.self[0].value)) {
                return false;
            }
        },
        //数字包含小数
        onlyNum: function(params) {
            if (!/^[0-9]+([.][0-9]+){0,1}$/.test(this.self[0].value)) {
                return false;
            }
        },
        onlyInt: function(value) {
            //整数
            if (!/^[0-9]*$/.test(value)) {
                return false;
            }
        },
        //昵称
        isNickname: function(params) {
            if (!/^[A-Za-z0-9_\-\u4e00-\u9fa5]{2,20}$/i.test(this.self[0].value)) {
                return false;
            }
        }
    }
}

module.exports = Utils;