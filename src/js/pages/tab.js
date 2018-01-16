;
(function() {

    var $form = $('#formMap');

    $('.tab-2').on('click', 'a', function() {
        var $this = $(this);
        var distribution = $this.data('distribution');
        $this.addClass('active').siblings('a').removeClass('active');
        $form.find('[name="distribution"]').val(distribution);
        $form.trigger('submit');
    });

    $('.tab-2').on('change', '[type="radio"]', function() {
        var $this = $(this);
        var value = $this.val();
        $form.find('[name="type"]').val(value);
        $form.trigger('submit');
    });

}());