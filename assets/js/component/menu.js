;(function(){

    $('.treeview').on('click', 'a', function() {
        var $this = $(this);
        if ($this.parent().hasClass('menu-open') && !$('body').hasClass('sidebar-collapse')) {
            $this.parent().removeClass('menu-open');
            $this.siblings('.treeview-menu').slideUp('normal', function () {
                $this.siblings('.treeview-menu').hide();
            });
        } else {
            $this.parent().addClass('menu-open');
            $this.siblings('.treeview-menu').slideDown();
        }
    });

    $('#J-navSide-hide').on('click', function () {
        $('.skin-blue').toggleClass('sidebar-collapse');
    });

    // $('.wrapper').scroll(function () {
    //     $target = $('.main-sidebar');
    //     if ($(this).scrollTop() > 50) {
    //         $target.addClass('fixed');
    //         $('body').addClass('sidebar-collapse');
    //      } else {
    //         $target.removeClass('fixed');
    //         $('body').removeClass('sidebar-collapse');
    //      }
    // });
    
}());