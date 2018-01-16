;
(function() {

    if(!$('.bootstrap-date').length && !$('.bootstrap-date-month').length) {
        return;
    }

    var month = {
        '-1': '十一月',
        '0': '十二月',
        '1': '一月',
        '2': '二月',
        '3': '三月',
        '4': '四月',
        '5': '五月',
        '6': '六月',
        '7': '七月',
        '8': '八月',
        '9': '九月',
        '10': '十月',
        '11': '十一月',
        '12': '十二月'
    }

    var THeMonthBeforeLast = month[moment().month() - 1];
    var LastMonth = month[moment().month()];
    var CurrentMonth = month[moment().month() + 1];
    var obj = {};
    obj[THeMonthBeforeLast] = [moment([moment().years(), 0, 1]).month(moment().month() - 2), moment([moment().years(), 0, 31]).month(moment().month() - 2)];
    obj[LastMonth] = [moment([moment().years(), 0, 1]).month(moment().month() - 1), moment([moment().years(), 0, 31]).month(moment().month() - 1)];
    obj[CurrentMonth] = [moment([moment().years(), moment().month(), 1]), moment().subtract('days', 1)];

    // 填充时间
    $('[data-name="today"]').attr('data-value',moment().format('YYYY-MM-DD') + ' 至 ' + moment().format('YYYY-MM-DD'));
    $('[data-name="yesterday"]').attr('data-value',moment().subtract('days', 1).format('YYYY-MM-DD') + ' 至 ' + moment().subtract('days', 1).format('YYYY-MM-DD'));
    $('[data-name="sevenday"]').attr('data-value',moment().subtract('days', 6).format('YYYY-MM-DD') + ' 至 ' + moment().format('YYYY-MM-DD'));
    $('[data-name="thirtyday"]').attr('data-value',moment().subtract('days', 29).format('YYYY-MM-DD') + ' 至 ' + moment().format('YYYY-MM-DD'));

    $('[data-name="THeMonthBeforeLast"]').text(THeMonthBeforeLast).attr('data-value', moment([moment().years(), 0, 1]).month(moment().month() - 2).format('YYYY-MM-DD') + ' 至 ' + moment([moment().years(), 0, 31]).month(moment().month() - 2).format('YYYY-MM-DD'));
    $('[data-name="LastMonth"]').text(LastMonth).attr('data-value', moment([moment().years(), 0, 1]).month(moment().month() - 1).format('YYYY-MM-DD') + ' 至 ' + moment([moment().years(), 0, 31]).month(moment().month() - 1).format('YYYY-MM-DD'));
    $('[data-name="CurrentMonth"]').text(CurrentMonth).attr('data-value', moment([moment().years(), moment().month(), 1]).format('YYYY-MM-DD') + ' 至 ' + moment().subtract('days', 1).format('YYYY-MM-DD'));

    function activeTime (val) {
        var $btn = $('[data-value="'+ val +'"]');
        $('.btn-time').children().removeClass('btn-primary').addClass('btn-default');
        if($btn.length === 0) {
            $('[data-name="custom"]').removeClass('btn-default').addClass('btn-primary');
        } else {
            $btn.removeClass('btn-default').addClass('btn-primary');
        }
    }

    activeTime($('.bootstrap-date').val());

    $.each($('.bootstrap-date'), function() {
        var $this = $(this);
        $this.daterangepicker({
            // autoApply:true,
            autoUpdateInput: false,
            ranges: {
                //'最近1小时': [moment().subtract('hours',1), moment()],
                '今日': [moment().startOf('day'), moment().endOf('day')],
                '昨日': [moment().subtract('days', 1).startOf('day'), moment().subtract('days', 1).endOf('day')],
                '最近7日': [moment().subtract('days', 6).startOf('day'), moment().endOf('day')],
                '最近30日': [moment().subtract('days', 29).startOf('day'), moment().endOf('day')]
            },
            // timePicker: true,
            // timePicker24Hour: true,
            // timePickerIncrement: 30,
            locale: {
                // format: 'YYYY-MM-DD HH:mm',
                format: 'YYYY-MM-DD',
                applyLabel: '确定',
                cancelLabel: '清除',
                fromLabel: '起始时间',
                toLabel: '结束时间',
                customRangeLabel: '自定义',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                firstDay: 0,
                separator: ' 至 '
            },
            opens: 'left',
            singleDatePicker: $this.attr('data-singleDatePicker') ? true : false
        });
    });

    $.each($('.bootstrap-date-month'), function() {
        var $this = $(this);
        $this.daterangepicker({
            // autoApply:true,
            autoUpdateInput: false,
            ranges: obj,
            // timePicker: true,
            // timePicker24Hour: true,
            // timePickerIncrement: 30,
            locale: {
                // format: 'YYYY-MM-DD HH:mm',
                format: 'YYYY-MM-DD',
                applyLabel: '确定',
                cancelLabel: '清除',
                fromLabel: '起始时间',
                toLabel: '结束时间',
                customRangeLabel: '自定义',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                firstDay: 0,
                separator: ' 至 '
            },
            opens: 'left',
            singleDatePicker: $this.attr('data-singleDatePicker') ? true : false
        });
    });

    // 选择组件上选择时间的回调函数
    $('.bootstrap-date, .bootstrap-date-month').on('apply.daterangepicker', function(ev, picker) {
        var $this = $(this);
        if ($this.attr('data-singleDatePicker')) {
            $(this).val(picker.startDate.format('YYYY-MM-DD'));
        } else if (!$this.hasClass('single')) {
            $(this).val(picker.startDate.format('YYYY-MM-DD') + ' 至 ' + picker.endDate.format('YYYY-MM-DD'));
            activeTime(picker.startDate.format('YYYY-MM-DD') + ' 至 ' + picker.endDate.format('YYYY-MM-DD'));
        }
        $('.form-time').trigger('submit');
    });
    $('.bootstrap-date, .bootstrap-date-month').on('cancel.daterangepicker', function(ev, picker) {
        var $this = $(this);
        $this.val('');
    });

    // 表单外围填值、提示
    $('.btn-time').find('button').on('click', function(event) {
        var $this = $(event.target);
        $('.bootstrap-date, .bootstrap-date-month').val($this.attr('data-value'));
        $('.btn-time').children().removeClass('btn-primary').addClass('btn-default');
        $this.removeClass('btn-default').addClass('btn-primary');
        $('.form-time').trigger('submit');
    });

}());