;
(function() {

    if (!$('.owl-carousel').length) {
        return;
    }

    $('.owl-carousel').owlCarousel({
        // margin: 30,
        nav: true,
        navText: ['<', '>'],
        responsive: {
            // 0: {
            //     items: 1
            // },
            // 600: {
            //     items: 3
            // },
            1000: {
                items: 6
            }
        }
    });

}());

;
(function() {

    if (!$('.owlSimple').length) {
        return;
    }

    function owlSimple(options) {
        var $this = $('.owlSimple');
        var pageIndex = 1;
        var maxLength = Math.ceil($('.owlSimple').find('li').length / options.items);
        $this.attr('data-pageIndex', pageIndex);
        $this.find('li').css({
            width: 100 / options.items + '%'
        });
        $this.find('li').css('display', 'none');
        for (var i = 0; i < options.items; i++) {
            $this.find('li').eq(i).css('display', 'block');
        }

        $this.find('.next').on('click', function() {
            if (pageIndex < maxLength) {
                pageIndex += 1;
                $this.attr('data-pageIndex', pageIndex);
                var index = $this.attr('data-pageIndex');

                $this.find('li').css('display', 'none');
                for (var j = 0; j < options.items; j++) {
                    $this.find('li').eq(j + options.items * (index - 1)).css('display', 'block');
                }
            }

        });
        $this.find('.prev').on('click', function() {
            if (pageIndex > 1) {
                pageIndex -= 1;
                $this.attr('data-pageIndex', pageIndex);
                var index = $this.attr('data-pageIndex');

                $this.find('li').css('display', 'none');
                for (var j = 0; j < options.items; j++) {
                    $this.find('li').eq(j + options.items * (index - 1)).css('display', 'block');
                }
            }
        });
    }

    owlSimple({
        items: 7
    });

    $('.owlSimple').find('li').on('click', function() {
        var $this = $(this);
        var type = $this.data('type');
        if (type !== undefined && !$this.hasClass('active')) {
            $('#formLine').find('[name="type"]').val(type);
            $('#formLine').trigger('submit.echarts');
        }
        $this.addClass('active').find('.fa-check-circle-o').removeClass('fa-check-circle-o').addClass('fa-check-circle');
        $this.siblings().removeClass('active').find('.fa-check-circle').removeClass('fa-check-circle').addClass('fa-check-circle-o');
    });


}());