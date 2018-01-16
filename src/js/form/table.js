;
(function() {

    if(!$('.J-table-wrap').length) {return;}

    // 计算表格高度
    function getTbodyMaxHeight () {
        var headerHeight = $('.header').height();
        var contentPaddingTop = parseInt($('.content').css('padding-top'));
        var breadcrumbOuterHeight = $('.breadcrumb').outerHeight(true);
        var formSearchHeight = $('.form-horizontal').outerHeight();
        var captionHeight = $('.caption').outerHeight();

        var iboxContentTheadHeight = $('.ibox-content').find('thead').outerHeight();
        var iboxContentPaddingTop = parseInt($('.ibox-content').css('padding-top'));
        var iboxContentBorderWidth = parseInt($('.ibox-content').css('border-top-width')) + parseInt($('.ibox-content').css('border-bottom-width'));

        var windowHeight = $(window).height();
        var iboxContent = iboxContentTheadHeight + iboxContentPaddingTop + iboxContentBorderWidth + 1;
        var iboxContentOther = headerHeight + contentPaddingTop + breadcrumbOuterHeight + formSearchHeight + captionHeight;

        var tbodyMaxHeight = windowHeight - iboxContent - iboxContentOther;
        return tbodyMaxHeight;
    }

    let table = $('.J-table-wrap').NUI('table', {
        maxHeight: getTbodyMaxHeight(),
        // switchLock: true,
        childrenClass: '.lv-1',
        tableAjaxSuccess: function () {
            scrollbar.destroy();
            this.updateBodyMaxHeight(getTbodyMaxHeight());
            scrollbar.init();
        },
        tableCollBeforeSend: function (trIndex, event) {
            let _this = this;
            let $tableFixed = _this.$tableFixed;
            let $tableBody = _this.$tableBody;
            if ($tableFixed.find('tbody').find('tr').eq(trIndex).find('.loading').length) {
              $tableFixed.find('tbody').find('tr').eq(trIndex).find('.loading').loading(true, true);
            }
            $tableBody.find('tbody').find('tr').eq(trIndex).find('.loading').loading(true, true);
        },
        tableCollSuccess: function (trIndex, event) {
            let _this = this;
            let $tableFixed = _this.$tableFixed;
            let $tableBody = _this.$tableBody;
            if ($tableFixed.find('tbody').find('tr').eq(trIndex).find('.loading').length) {
              $tableFixed.find('tbody').find('tr').eq(trIndex).find('.loading').loading(false);
            }
            $tableBody.find('tbody').find('tr').eq(trIndex).find('.loading').loading(false);
        }
    });

    let scrollbar = $('.J-scrollbar').NUI('scrollbar', {
        autoScrollHeight: false
    });

    $(window).resize(function () {
        table.updateBodyMaxHeight(getTbodyMaxHeight());
        table.showTableFixed();
        scrollbar.updateSize();
    });

}());