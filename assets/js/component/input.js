function Input(options) {
    return new InputConstructor(options);
}

function InputConstructor(options) {
    this.options = null;
    this.init(options);
}

InputConstructor.DEFAULT = {
    container: 'body',
    handle: '.input',
};

InputConstructor.prototype = {
    getDefault() {
        return InputConstructor.DEFAULT;
    },
    getOptions(options) {
        return $.extend({}, this.getDefault(), options);
    },
    init(options) {
        this.options = this.getOptions(options);
        $(this.options.handle).on('keydown.input', 'input', $.proxy(this.showclear, this));
        $(this.options.handle).on('click.input', '.anticon-cross-circle', $.proxy(this.valueclear, this));
        $(this.options.handle).each(this.showicon);
    },
    showicon(index, item) {
        let $input = $(item).children('input');
        let suffixName = $input.attr('suffix-icon');
        let prefixName = $input.attr('prefix-icon');
        if (suffixName) {
            $(item).addClass('input-suffix');
            $input.after('<i class="'+suffixName+'"></i>');
        }
        if(prefixName) {
            $(item).addClass('input-prefix')
            $input.before('<i class="'+prefixName+'"></i>');
        }
    },
    showclear(event) {
        let $target = $(event.target);
        let $parent = $target.parent('.input');
        if ($target.attr('clearable') == '' && !$target.siblings('.anticon-cross-circle').length) {
            $parent.addClass('input-clear');
            $target.after('<i class="anticon anticon-cross-circle"></i>');
        }
    },
    valueclear(event) {
        let $target = $(event.target);
        $target.siblings('input').val('').focus();
        $target.remove();
    }
};

module.exports = {
    input: Input
};