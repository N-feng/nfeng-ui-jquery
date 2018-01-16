;
(function ($, window) {

    function multiCheck(config) {

        var defaults = {
            container: 'body',
            dataType: '',
            confirmCall: function() {}
        };

        this.config = $.extend(defaults, config);

        this.init();
        this.event();

    }

    multiCheck.prototype.init = function() {
        var self = this;
        self.wrapItems();
        self.buildControls();
        self.buildButtons();
    };

    multiCheck.prototype.wrapItems = function() {
        var self = this;
        var config = self.config;
        var DATA = config.dataType;
        var html = self.htmlCityGenerate(DATA) || '';
        var title = '城市限制';
        self.$multiCheck = $('<div/>', {
            'class': 'multiCheck'
        });
        self.$header = $('<div/>', {
            'class': 'multiHeader',
            'html': '<h4>' + title + '</h4>'
        });
        self.$body = $('<div/>', {
            'class': 'multiBody'
        });
        self.$multiBox =$('<div/>', {
            'class': 'multiBox',
            'html':  html
        });
        self.$footer = $('<div/>', {
            'class': 'multiFooter'
        });
        $(config.container).append(self.$multiCheck);
        self.$multiCheck.append(self.$header);
        self.$multiCheck.append(self.$body);
        self.$multiCheck.append(self.$footer);
        self.$body.append(self.$multiBox);
    };

    /*===========生成 省市 html============*/
    multiCheck.prototype.htmlCityGenerate = function (data) {
        var self = this;
        var _str = '';
        var _letter=[];
        $.each(data, function(key, val) {
            if (val.parentId === '100000') {
                var lv2Str = '';

                $.each(data, function(key2, val2) {
                    if (val2.parentId === val.id) {
                        lv2Str += '<label class="lv-2"><input type="checkbox" data-pid="' + val2.parentId + '" data-name="' + val2.shortName + '" data-value="' + val2.id + '" data-letter="'+ val2.letter+'">' + val2.shortName + '</label>';
                        _letter.push(val2.letter);
                    }
                });

                _str += '<div class="checkbox"><label class="lv-1"><input type="checkbox" data-name="' + val.shortName + '" data-value="' + val.id + '" data-letter="'+ val.letter+'">' + val.shortName + '</label>' + lv2Str + '</div>';
                _letter.push(val.letter);
            }

        });

        _str = self.htmlLetter(_letter)+_str;

        return _str;
    };

    /*===========拼接letter html============*/
    multiCheck.prototype.htmlLetter = function(str) {
        var self = this;
        var templeArr = [];
        var arr = [];
        var _html = '';
        $.each(str, function(index, val) {
            if(!templeArr[val]&&val){
                arr.push(val);
                templeArr[val]=true;
            }
        });
        arr=arr.sort();
        $.each(arr, function(index, val) {
            _html += '<span>'+val+'</span>';
        });
        return '<div class="letterBox"><span role="showAllLetter">全部</span>'+_html+'</div>';
    };

    // 检查JSON (输出 已选择的值的数组
    multiCheck.prototype.checkedToJson = function () {
        var self = this;
        var data = self.$multiBox.find('input:checked');
        var globalArr = [];
        if (data.length === 0) {
            return '';
        }

        data.each(function(index, el) {
            var $el = $(el);
            var _pid = $el.attr('data-value');
            var tmpStr = '';
            var tmpArr = [];
            var tmpArr2 = self.$multiBox.find('input[data-pid="' + _pid + '"]:checked');

            tmpStr += '\"' + _pid + '\":[';

            if ($el.data('pid') === undefined) {
                $.each(tmpArr2, function(index2, el2) {
                    tmpArr.push(parseInt($(el2).data('value'), 10));
                });
                tmpStr += tmpArr.join(',');
                tmpStr += ']';
                globalArr.push(tmpStr);
            }
        });

        return '{' + globalArr.join(',') + '}';
    };

    //转换 名字 (输出 目前选择的选项的名字
    multiCheck.prototype.convertName = function () {
        var self = this;
        var config = self.config;
        var total = self.$multiBox.find('.lv-2').length;
        var _arr = [];
        $.each(self.$multiBox.find('.lv-2 input:checked'), function(index, el) {
            _arr.push($(el).data('name'));
        });

        return _arr.length === total ? (config === 'tag' ? '所有标签' : '所有城市') : (_arr.length > 14 ? _arr.slice(0, 15).join(';') + ' ...' : _arr.join(';'));
    };

    // 初始化 (输入页面已有数据,目标  保存目标到self  选择输入数据的选项
    multiCheck.prototype.initialization = function (data, $target) {
        var self = this;
        self.$target = $target;
        self.$clearAll.trigger('click');
        if (!data) {
            return false;
        }
        var initData = $.parseJSON(data);
        $.each(initData, function(key, val) {
            $.each(val, function(key2, val2) {
                var $target = self.$multiBox.find('.lv-2').find('input[data-value="' + val2 + '"]');
                $target.prop('checked', true).trigger('change');
            });
        });
    };

    /*===========反向选择============*/
    multiCheck.prototype.operateReverse = function (el) {
        var self = this;
        $.each(el, function(index, el) {
            $(el).prop('checked', !el.checked);
        });
        $.each(self.$multiBox.find('.lv-1'), function(index, _el) {
            var isChecked = $(_el).siblings('.lv-2').find('input:checked').length ? true : false;
            $(_el).find('input').prop('checked', isChecked);
        });
    };

    /*===========二级全空============*/
    multiCheck.prototype.isAllUnChecked = function (obj) {
        var len = obj.find('.lv-2 input').length;
        return obj.find('.lv-2 input').not(':checked').length === len ? true : false;
    };

    /*===========拼音匹配============*/
    multiCheck.prototype.matchLetter = function (el, $parent) {
        var templeArr = [];
        var letter = el.text();
        var $lv1 = $parent.find('.lv-1 input');
        $parent.find('.checkbox label').removeClass('hide');
        /*===========显示全部============*/
        if(el.attr('role')==='showAllLetter'){
            return false;
        }
        /*===========匹配省份============*/
        $.each($lv1,function(index, _el) {
            var _letter=$(_el).data('letter');
            if(letter!=_letter){
                templeArr.push($(_el));
            }
        });
        /*===========遍历不匹配的省份============*/
        $.each(templeArr,function(index, _el) {
            var isChecked=false;
            var $lv2=_el.parents('.checkbox').find('.lv-2 input');
            $.each($lv2,function(index, _el) {
                var _letter=$(_el).data('letter');
                if(letter===_letter){
                    isChecked=true;
                }else{
                    $(_el).parents('.lv-2').addClass('hide');
                }
            });
            if(!isChecked){
                _el.parents('.lv-1').addClass('hide');
            }
        });
    };

    multiCheck.prototype.buildControls = function() {
        var self = this;
        self.$selectAll = $('<label/>',{
            'role': 'selectAll',
            'html': '<input type="checkbox" id="selectAll">全选'
        });
        self.$selectReverse = $('<label/>', {
            'role': 'selectReverse',
            'html': '<input type="checkbox" id="selectReverse">反选'
        });
        self.$clearAll = $('<a/>',{
            'role': 'clearAll',
            'html': '全部清空',
            'href': 'javascript:;'
        });
        self.$header.append(self.$clearAll);
        self.$header.append(self.$selectReverse);
        self.$header.append(self.$selectAll);
    };

    multiCheck.prototype.buildButtons = function() {
        var self = this;
        self.$confirm = $('<button/>', {
            'role': 'confirm',
            'class': 'btn-confirm',
            'html': '保存'
        });
        self.$cancel = $('<button/>', {
            'class': 'btn-close',
            'html': '返回'
        });
        self.$footer.append(self.$confirm);
        self.$footer.append(self.$cancel);
    };

    multiCheck.prototype.event = function() {
        var self = this;
        var config = self.config;
        /*===========全选============*/
        self.$selectAll.on('click',function(event){
            self.$multiBox.find('.checkbox label').not('.hide').find('input').prop('checked', true);
        });
        /*===========反选============*/
        self.$selectReverse.on('change', function(event) {
            self.operateReverse(self.$multiBox.find('.lv-2').not('.hide').find('input'));
        });
        /*===========全部清空============*/
        self.$clearAll.on('click', function(event) {
            event.preventDefault();
            self.$multiCheck.find('input:checkbox').prop('checked',false);
        });
        /*===========点击拼音匹配城市============*/
        self.$multiBox.on('click', '.letterBox span', function(event) {
            $(this).addClass('active').siblings('span').removeClass('active');
            self.matchLetter($(this), self.$multiBox);
        });
        /*===========点击一级============*/
        self.$multiBox.on('change', '.lv-1 input', function(event) {
            var $context = $(this).parents('.checkbox');
            var $inputs = $context.find('.lv-2').not('.hide').find('input');
            $inputs.prop('checked', this.checked);

        });
        /*===========点击二级============*/
        self.$multiBox.on('change', '.lv-2 input', function(event) {
            var $context = $(this).parents('.checkbox');
            var $parent = $context.find('.lv-1 input');
            if (this.checked) {
                $parent[0].checked = true;
            }
            if (self.isAllUnChecked($context)) {
                $parent[0].checked = false;
            }
        });
        /*===========保存============*/
        self.$confirm.on('click', function(event) {
            if(self.$target!==undefined) {
                var $target = self.$target;
                var $name = self.convertName();
                var $value = self.checkedToJson();
                config.confirmCall($target,$name,$value);
            }
        });
    };

    //-----------工厂模式-------------//
    $.fn.multiCheck = function(config) {
        return new multiCheck(config);
    };

})(jQuery, window);