;
(function() {

    var $form = $('#formLine');

    $('.btn-list-delete').on('click', function(event) {
        var $this = $(this);
        var _url = $this.attr('data-url');
        var tips = $this.data('tips') || '您是否要删除这条记录';
        $.alert({
            title: '',
            content: tips,
            type: 'confirm',
            confirm: function(deferred) {
                $.loading(true, true);
                $.ajax({
                    url: _url,
                    type: 'POST',
                    data: {
                        "_csrf": $('meta[name="csrf-token"]').attr('content')
                    }
                }).fail(function(err) {
                    $.loading(false);
                    if ($.inArray(parseInt(err.status), [302, 200]) === -1) {
                        var res = $.parseJSON(err.responseText);
                        if (!res.status) {
                            $.tip({
                                text: res.info,
                                timeout: 2000,
                                status: false
                            });
                        }
                    }
                });
                deferred.hideAlert();
            }
        });
        return false;
    });

    // $('.J-search').on('submit', function(event) {
    //     event.preventDefault();
    //     var $this = $(this);
    //     var $val = $this.find('.bootstrap-date').val();

    //     $('#formLine').find('[name="range"]').val($val);
    //     $('#formLine').trigger('submit.echarts');
    // });

}());