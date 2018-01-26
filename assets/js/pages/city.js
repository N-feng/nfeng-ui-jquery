;
(function() {

    var $multiCheckInput = $('.multiCheckInput');

    if ($multiCheckInput.length === 0) {
        return;
    }

    var layerCity = $.fn.layer({
        id: '#layerCity',
        vertical: false,
        cache: true,
        offsetWidth: '800',
        offsetHeight: '100%',
        confirmCall: function(deferred) {
            deferred.hideLayer();
        }
    });

    var multiCheck = $.fn.multiCheck({
        container: '#layerCity .layer-content',
        dataType: cityData,
        confirmCall: function(target, name, value) {
            target.find('[role="text"]').val(value);
            target.find('[role="name"]').val(name);
        }
    });

    $('body').on('click', '.multiCheckInput', function(event) {
        event.preventDefault();
        var $text = $(this).find('[role="text"]');
        multiCheck.initialization($text.val(), $(this));
        layerCity.showLayer();
    });

    // 填充默认值
    $.each($('.multiCheckInput').find('[role="text"]'), function(index, value) {
        var $this = $(this);

        if($this.val() === '') {
            return;
        }

        var $value = $.parseJSON($this.val());
        var _arr = [];

        $.each($value, function(key, val) {
            $.each(val, function(key2, val2) {
                $.each(cityData, function(index, item) {
                    if (parseInt(item.id) === val2) {
                        _arr.push(item.name);
                    }
                })
            });
        });
        $this.siblings('[role="name"]').val(_arr.join(';'));
    });

}());