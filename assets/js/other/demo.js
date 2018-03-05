;
(function () {
    $('body').on('mouseenter.demo', '.demo-block-control', function () {
        let self = this;
        let $span = $(self).find('span');
        let $i = $(self).find('i');
        $span.addClass('text-slide-enter').removeClass('hide');
        $i.addClass('hovering');
        setTimeout(function () {
            $span.removeClass('text-slide-enter');
        }, 100);
    });
    $('body').on('mouseleave.demo', '.demo-block-control', function () {
        let self = this;
        let $span = $(self).find('span');
        let $i = $(self).find('i');
        $span.addClass('hide');
        $i.removeClass('hovering');
    });
    $('body').on('click.demo', '.demo-block-control', function () {
        let $meta = $(this).siblings('.meta');
        if (parseInt($meta.css('height')) === 1) {
            $meta.css('height', $meta.find('.highlight').height());
        } else {
            $meta.css('height', '0');
        }
    });
}());