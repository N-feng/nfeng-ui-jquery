/**
 * 拿到url上的参数
 * 调用：$.getHash(url);
 */

var urlHelper = {

    // 获取单个参数
    // demo: getParam('query','https://juejin.im/search?query=hello&time=2017-11-12')
    // output: "hello"
    /**
     * [getParam ]
     * @param  {String} name
     * @param  {String} url   [default:location.href]
     * @return {String|Boolean}
     */
    getParam: function (name, url) {
        if (typeof name !== 'string') return false;
        if (!url) url = window.location.href;
        // 当遇到name[xx]时，对方括号做一下转义为 name\[xxx\]，因为下面还需要使用name做正则
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        var results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    },

    // 设置单个参数
    // demo: setParam('query','world','https://juejin.im/search?query=hello&time=2017-11-12')
    // output: "https://juejin.im/search?query=world&time=2017-11-12"
    /**
     * [setParam 设置单个参数]
     * @param {String} name
     * @param {String|Number} val
     * @return {String|Boolean}
     */
    setParam: function (name, val, url) {
        if (typeof name !== 'string') return false;
        if (!url) url = window.location.href;
        var _name = name.replace(/[\[\]]/g, '\\$&');
        var value = name + '=' + encodeURIComponent(val);
        var regex = new RegExp(_name + '=[^&]*');
        var urlArr = url.split('#');
        var result = '';

        if (regex.exec(url)) {
            result = url.replace(regex, value);
        } else {
            result = urlArr[0] + '&' + value + (urlArr[1] || '');
        }

        return result
    },

    // 移除单个参数
    // demo: removeParam('query','https://juejin.im/search?query=hello&time=2017-11-12')
    // output: "https://juejin.im/search?time=2017-11-12"
    /**
     * [removeParam 移除单个参数]
     * @param  {String} name
     * @param  {String} url   [default:location.href]
     * @return {String|Boolean}
     */
    removeParam: function (name, url) {
        if (typeof name !== 'string') return false;
        if (!url) url = window.location.href;
        var urlparts = url.split('?');
        var prefix = encodeURIComponent(name + '=');
        var pars = urlparts[1].split(/[&;]/g);
        var i = 0, len = pars.length;

        for (; i < len; i++) {
            if (encodeURIComponent(pars[i]).lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        url = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');

        return url;
    },

    // 获取多个参数
    // demo: getParams('query time','https://juejin.im/search?query=hello&time=2017-11-12')
    // output: {query: "hello", time: "2017-11-12"}
    /**
     * [getParams 获取多个参数]
     * @param  {String} names [多个用空格分割]
     * @param  {String} url   [default:location.href]
     * @return {[String|Boolean]}
     */
    getParams: function (names, url) {
        if (typeof name !== 'string') return false;
        var names = names.split(' ');
        var result = {};
        var i = 0,
            len = names.length;
        if (names.length === 0) return false;
        for (; i < len; i++) {
            result[names[i]] = getParam(names[i], url);
        }
        return result;
    },

    // 设置多个参数
    // demo: setParams({a:111,b:222,query:'world'},'https://juejin.im/search?query=hello&time=2017-11-12')
    // output: "https://juejin.im/search?query=world&time=2017-11-12&a=111&b=222"
    /**
     * [setParams 设置多个参数]
     * @param {Object} obj
     * @param  {String} url   [default:location.href]
     * @return {[String|Boolean]}
     */
    setParams: function (obj, url) {
        var result = url || '';
        if (Object.prototype.toString.call(obj) !== '[object Object]') return false;
        for (var name in obj) {
            result = setParam(name, obj[name], result);
        }
        return result;
    },

    // 移除多个参数
    // demo: removeParams('query time','https://juejin.im/search?query=hello&time=2017-11-12')
    // output: "https://juejin.im/search"
    /**
     * [removeParams 移除多个参数]
     * @param  {String} names [多个用空格分割]
     * @param  {String} url   [default:location.href]
     * @return {[String|Boolean]}
     */
    removeParams: function (names, url) {
        var result = url || '';
        var names = names.split(' ');
        var i = 0,
            len = names.length;
        if (names.length === 0) return false;

        for (; i < len; i++) {
            result = removeParam(names[i], result);
        }
        return result;
    },

    // url hash 操作
    /**
     * [getHash 方法]
     * @param  {[String]} url [default:location.href]
     * @return {[String]}
     */
    getHash: function (url) {
        return decodeURIComponent(url ? url.substring(url.indexOf('#') + 1) : window.location.hash.substr(1));
    },
    /**
     * [setHash 方法]
     * @param {String} hash
     */
    setHash: function (hash) {
        window.location.replace('#' + encodeURIComponent(hash));
    },
    /**
     * [removeHash 方法]
     */
    removeHash: function () {
        window.location.replace('#', '');
    }

};

// $.fn.getParam = urlHelper.getParam;
// $.fn.getHash = urlHelper.getHash;

module.exports = urlHelper;
