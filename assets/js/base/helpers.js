let propFix = {
    "tabindex"        : "tabIndex",
    "readonly"        : "readOnly",
    "for"             : "htmlFor",
    "class"           : "className",
    "maxlength"       : "maxLength",
    "cellspacing"     : "cellSpacing",
    "cellpadding"     : "cellPadding",
    "rowspan"         : "rowSpan",
    "colspan"         : "colSpan",
    "usemap"          : "useMap",
    "frameborder"     : "frameBorder",
    "contenteditable" : "contentEditable"
};

function isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]';
}

function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
}

function isLikeArray(obj) {
    return typeof obj !== 'undefined' && typeof obj.length === 'number';
}
function toNativeArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

function trim(str) {
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

function hasClass(element, className) {
    return element.className.indexOf(className) > -1;
}

function addClass(element, value) {
    var _this = isLikeArray(element) ? toNativeArray(element) : [element || ''];
    var elem, classNames, i, l, setClass, c, cl;
    var coreRspace = /\s+/;
    if (value && typeof value === "string") {
        classNames = value.split(coreRspace);
        for (i = 0, l = _this.length; i < l; i++) {
            elem = _this[i];
            if (elem.nodeType === 1) {
                if (!elem.className && classNames.length === 1) {
                    elem.className = value;
                } else {
                    setClass = " " + elem.className + " ";
                    for (c = 0, cl = classNames.length; c < cl; c++) {
                        if (setClass.indexOf(" " + classNames[c] + " ") < 0) {
                            setClass += classNames[c] + " ";
                        }
                    }
                    elem.className = trim(setClass);
                }
            }
        }
    }
    return _this;
}

function children(element) {
    var elem = element.nodeType === 1 ? element : '';
    var childrenArr = elem.children;
    var len = childrenArr.length;
    var resultArr = [];
    var i;
    for (i = 0; i < len; i++) {
        if (childrenArr[i].nodeType === 8) {
            continue;
        }
        resultArr.push(childrenArr[i]);
    }
    return resultArr;
}

function each(obj, callback) {
    var name, i = 0,
        length = obj.length,
        isObj = length === undefined || isArray(obj);

    if (isObj) {
        for (name in obj) {
            if (callback.call(obj[name], name, obj[name]) === false) {
                break;
            }
        }
    } else {
        for (; i < length;) {
            if (callback.call(obj[i], i, obj[i++]) === false) {
                break;
            }
        }
    }
}

function removeAttr(elem, value) {
    var propName, attrNames, name, isBool, i = 0;
    var coreRspace = /\s+/;
    if (value && elem.nodeType === 1) {

        attrNames = value.split(coreRspace);

        for (; i < attrNames.length; i++) {
            name = attrNames[i];

            if (name) {
                propName = propFix[name] || name;
                isBool = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i.test(name);

                if (!isBool) {
                    elem.setAttribute(name, '');
                }

                elem.removeAttribute(propName);

                // Set corresponding property to false for boolean attributes
                if (isBool && propName in elem) {
                    elem[propName] = false;
                }
            }
        }
    }
}

function indexOf(value, src) {
    return src.indexOf(value) !== -1;
}

!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
    WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
        var target = this;

        registry.unshift([target, type, listener, function (event) {
            event.currentTarget = target;
            event.preventDefault = function () { event.returnValue = false };
            event.stopPropagation = function () { event.cancelBubble = true };
            event.target = event.srcElement || target;

            listener.call(target, event);
        }]);

        this.attachEvent("on" + type, registry[0][3]);
    };

    WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
        var index = 0, len = registry.length, register;
        for (; index < len; index++) {
            register = registry[index]
            if (register[0] === this && register[1] === type && register[2] === listener) {
                return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
            }
        }
    };

    WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
        return this.fireEvent("on" + eventObject.type, eventObject);
    };
})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);

export default { isFunction, addClass, children, each, removeAttr, indexOf, hasClass }
