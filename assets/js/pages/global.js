(function() {

  var dynamicLayer = $.fn.layer({
    id: '#dynamicLayer',
    vertical: false,
    cache: true,
    successCall: function(res) {
      this.find('.layer-content').html(res);
      $.pub('dynamicShow', [this]);
    },
    confirmCall: function(e, target, deferred) {
      this.find('form').trigger('submit');
      deferred.hideLayer();
    }
  });

  $('[data-trigger="dynamic"]').on('click', function(event) {
    var $this = $(this);
    dynamicLayer.ajaxLoad($this.attr('data-url'));
  });

  // Usage method
  // <div class="layer-box hide" id="dynamicLayer" data-width="800" data-method="get" data-datatype="html">
  //     <div class="layer-content"></div>
  // </div>

}());

(function() {

  if ($('#fieldLayer').length === 0) {
    return;
  }

  var fieldLayer = $.fn.layer({
    id: '#fieldLayer',
    vertical: false,
    cache: true,
    confirmCall: function(deferred) {
      deferred.hideLayer();
    }
  });

  $('[data-trigger="fieldLayer"]').on('click', function(event) {
    var $this = $(this);
    fieldLayer.showLayer();
  });

}());