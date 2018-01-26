(function($, window) {

    /**
     utils：通用方法
     */

    var utils = {
        animateEnd: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
        transitionEnd: 'webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd',
        scrollBarWidth: (function() {
            var scrollbarWidth;
            var $scrollDiv = $('<div/>');
            $scrollDiv.css({
                'width': 100,
                'height': 100,
                'overflow': 'scroll',
                'position': 'absolute',
                'top': -9999
            });
            $('html').append($scrollDiv);
            scrollbarWidth = $scrollDiv[0].offsetWidth - $scrollDiv[0].clientWidth;
            $scrollDiv.remove();
            return scrollbarWidth;
        }())
    };

    var isIE = document.all && !window.atob;

    function animateEnd(el, fn) {
        if (isIE) {
            fn();
        } else {
            el.on(utils.animateEnd, fn);
        }
    };

    function transitionEnd(el, fn) {
        if (isIE) {
            fn();
        } else {
            el.on(utils.transitionEnd, fn);
        }
    }

    function layer(config) {

        var defaults = {
            container: 'body',
            shadow: true,
            confirmHandle: '.btn-confirm',
            closeHandle: '.btn-cancel,.btn-close',
            offsetWidth: 'auto',
            offsetHeight: 'auto',
            animateClass: 'fadeInDown',
            // showLayer ['fadeInDown','layer-opening']
            showCall: function() {},
            hideCall: function() {},
            cancelCall: function() {},
            confirmCall: function() {}
        };

        this.config = $.extend(defaults, config);
        this.init();
        this.event();

    }

    layer.prototype.init = function() {
        var self = this;

        self.wrapItems();
        self.appendContentSizes();

        self.$layerBox.data('layer', self);
    };

    layer.prototype.wrapItems = function() {
        var self = this;
        var config = self.config;
        
        if($(config.id).length === 0) {
            self.$layerBox = $('<div/>', {
                class: 'layer-box hide',
                id: config.id.replace('#','')
            });
            self.$content = $('<div/>', {
                class: 'layer-content'
            });
            $(config.container).append(self.$layerBox);
        } else {
            self.$layerBox = $(config.id);
            self.$content = self.$layerBox.find('.layer-content');
            config.dataType = self.$layerBox.attr('data-dataType') || 'html'
        }
        
        //创建遮罩层
        self.$backdrop = $('<div/>', {
            class: 'layer-backdrop'
        });
        self.$layerBox.append(self.$content);
        self.$content.html(config.content);
    };

    layer.prototype.appendContentSizes = function() {
        var self = this;
        var config = self.config;
        var layerWidth = Number(self.$layerBox.attr('data-width')) || config.offsetWidth;
        var layerHeight = Number(self.$layerBox.attr('data-height')) || config.offsetHeight;
        self.$content.css({
            width: layerWidth,
            height: layerHeight
        });
    };

    layer.prototype.showLayer = function(cutto) {
        var self = this;
        var config = self.config;
        var screenH = document.documentElement.clientHeight;
        var gtIE10 = document.body.style.msTouchAction === undefined;
        var scrollBarWidth = utils.scrollBarWidth;
        var isCutto = cutto;
        // 当body高度大于可视高度，修正滚动条跳动
        // >=ie10的滚动条不需要做此修正,tmd :(
        if ($('body').height() > screenH & (gtIE10)) {
            $('body').css({
                'border-right': scrollBarWidth + 'px transparent solid',
                'overflow': 'hidden'
            });
        }
        //显示层
        self.$layerBox.removeClass('hide');
        self.$content.off(utils.animateEnd);

        if (isCutto) {
            self.$content.removeClass('layer-opening');
        } else {
            //插入-遮罩-dom
            self.$layerBox.after(self.$backdrop);
            //插入-遮罩-显示动画
            self.$backdrop.attr('style', 'opacity: 1;visibility: visible;');
        }

        //插入-弹层-css3显示动画
        self.$content.addClass(config.animateClass);

        animateEnd(self.$content, function(event) {
            self.$content.removeClass(config.animateClass);
            //触发showCall回调
            config.showCall();
        });

        //插入-遮罩-dom
        self.$layerBox.after(self.$backdrop);
        //插入-遮罩-显示动画
        self.$backdrop.attr('style', 'opacity: 1;visibility: visible;');
    };

    layer.prototype.hideLayer = function(cutto) {
        var self = this;
        var config = self.config;
        var isCutto = cutto;
        var Q = $.Deferred();
        //插入-弹层-隐藏动画
        self.$content.off(utils.animateEnd);
        self.$content.addClass('layer-closing');
        if (!isCutto) {
            self.$backdrop.removeAttr('style');
            transitionEnd(self.$backdrop, function() {
                self.$backdrop.remove();
            });
        }
        animateEnd(self.$content, function(event) {
            self.$backdrop.remove();
            //插入-遮罩-隐藏动画
            self.$content.removeClass('layer-closing');
            //隐藏弹层
            self.$layerBox.addClass('hide');
            //触发hideCall回调
            config.hideCall();
            Q.resolve();
        });

        //恢复 body 滚动条
        $('body').removeAttr('style');
        return Q;
    };

    layer.prototype.cutTo = function(nextId, currentId) {
        var self = this;
        var nextLayer = $(nextId).data('layer');
        var currentLayer = (currentId ? $(currentId) : self.$layerBox).data('layer');
        currentLayer.hideLayer(true).done(function() {
            nextLayer.showLayer(true);
        });
    };

    layer.prototype.ajaxLoad = function(url) {
        var self = this;
        var config = self.config;
        var _url = url || '?';
        var _method = self.$layerBox.attr('data-method') || 'GET';
        var _dataType = config.dataType;
        var _this = this;

        if (config.cache && self.$layerBox.data('success')) {
            _this.showLayer();
            return false;
        }

        $.loading(true, true);
        self.$layerBox.data('success', 1);
        $.ajax({
            url: _url,
            type: _method,
            dataType: config.dataType,
            data: config.data
        }).then(function(res) {
            $.loading(false);
            config.successCall.apply(self.$layerBox, [res, this, self.$layerBox]);
            _this.showLayer();
        }, function(err) {
            $.loading(false);
            _this.hideLayer();
            config.errorCall.apply(self.$layerBox, [err, this, self.$layerBox]);
        });
    };

    layer.prototype.event = function() {
        var self = this;
        var config = self.config;

        // 阴影层事件
        self.$layerBox.on('click.layer', function(event) {
            if ($(event.target).is(self.$layerBox)) {
                if (!config.shadow) {
                    return false;
                }
                if ($('body').find('.layer-loading').length) {
                    return false;
                }
                self.hideLayer();
                config.cancelCall();
            }
        });

        //绑定关闭事件
        self.$layerBox.on('click.layer', config.closeHandle, function(event) {
            self.hideLayer();
            config.cancelCall();
            return false;
        });

        //确认事件
        self.$layerBox.on('click.layer', config.confirmHandle, function(event) {
            event.preventDefault();
            config.confirmCall(self);
        });

    };

    //-----------工厂模式-------------//

    $.fn.layer = function(config) {
        return new layer(config);
    };

})(jQuery, window);

;
(function () {

    if (!$('[data-trigger="multiDialog"]').length) {return;}
    
    var layer = $('.dialog-multi').NUI('Layer',{
        // dynamic: true,
        boxType             : 'dialog',
        content             : '<form class="form-horizontal">' + $('.tipsbox-content').html() + '</form>',
        target              : $('[data-trigger="multiDialog"]'),
        // offsetWidth : 800
    });

    // $('[data-trigger="multiDialog"]').on('click', function (event) {
    //     event.preventDefault();
    //     layer.showDialog(event);
    // });

}());