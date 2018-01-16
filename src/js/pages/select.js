;(function(){

    $.sub('json_select',function(e, res, form, select){
        var id = form.val();
        select.html(jsonToSelect(res[id]));
    });

    function jsonToSelect(json) {
        var _html = '';
        _html = '<select>';
        $.each(json,function(key, value) {
            _html += '<option value="'+key+'">' + value + '</option>';
        });
        _html += '</select>';
        return _html;
    }

    // Usage method
    // $('#plan-plan_type').on("change",function(){
    //     var _this = $(this);
    //     $.pub('json_select',[typeName,_this,$('#plan-type_name')]);
    // });
    
}());