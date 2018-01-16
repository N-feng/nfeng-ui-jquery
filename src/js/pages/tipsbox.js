;
(function() {

    // $('.tipsbox').on('mouseover', function() {
    //     var $this = $(this);
    //     $this.children('.tipsbox-content').show();
    // });

    // $('.tipsbox').on('mouseleave', function() {
    //     var $this = $(this);
    //     $this.children('.tipsbox-content').hide();
    // });

    $(document).on('click', function(event) {
        var $this = $(event.target);
        if ($this.hasClass('tipsbox-trigger') && $this.siblings('.tipsbox-content').hasClass('tipsbox-hidden')) {
            $('.tipsbox-content').addClass('tipsbox-hidden fade-leave').removeClass('fade-enter');
            $this.siblings('.tipsbox-content').removeClass('tipsbox-hidden fade-leave').addClass('fade-enter');

            // 边缘检测
            if ($this.siblings('.tipsbox-content').offset().top + $this.siblings('.tipsbox-content').height() - $this.parents('.table-wrap').offset() ? $this.parents('.table-wrap').offset().top : 0 > $this.parents('.table-wrap').height() && $this.siblings('.tipsbox-content').height() > 38) {
                $this.siblings('.tipsbox-content').addClass('tipsbox-end');
            }
        } else {
            $('.tipsbox-content').addClass('tipsbox-hidden fade-leave').removeClass('fade-enter');
        }
    });

    // $('.tipsbox-content').on('click', function(event) {
    //     if(!($(event.target).hasClass('btn-confirm')||$(event.target).hasClass('btn-close'))) {
    //         event.stopPropagation();
    //     }
    // });

    // $('.btn-all').on('click', function() {
    //     var $this = $(this);
    //     var $context = $this.parents('[role="document"]');
    //     $context.find('.checkbox label').find('input').prop('checked', true);
    // });

    // $('.btn-rever').on('click', function() {
    //     var $this = $(this);
    //     var $context = $this.parents('[role="document"]');
    //     $.each($context.find('.checkbox label').find('input'), function(index, el) {
    //         $(el).prop('checked', !el.checked);
    //     });
    // });

}());