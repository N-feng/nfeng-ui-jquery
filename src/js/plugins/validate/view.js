module.exports = {
	message: function (status, cache, matchesName) {
		let className, contextClass, msg, $target, $msgEl, errors = this.errors;

		switch (status) {
			case 0: 
				className = this.config.infoClass;
				msg = cache.infoMsg;
				break;
			case 1:
				className = this.config.successClass;
				msg = '';
				break;
			case 2: 
				className = this.config.errorClass;
				msg = cache.matches[matchesName].errMsg;
				break;
		}

		errors[cache.collection.required] = status === 2 ? msg : '';

		if (!this.config.errorClass) {
			return false;
		}
		contextClass = ['info', 'success', 'error'];
		$msgEl = this.config.globalMessage ? $(this.config.globalMessage) : cache.context;
		className = className.replace(/\./g, ' ').slice(1);
		$msgEl.removeClass('validate-conetext-info validate-context-success validate-context-error')
			.addClass('validate-context-' + contextClass[status]).find('.validate-message').remove();
		$target = $('<div class="validate-message ' + ('.' + className === this.config.errorClass ? className + ' zoomTop-enter' : className) + '">' + msg + '</div>');
		$msgEl.append($target);
		console.log('.' + className === this.config.errorClass)
		
		let errorClass = this.config.errorClass;
		let animateEnterClass = this.config.animateEnterClass;

		$msgEl.find(errorClass).addClass(animateEnterClass)
		setTimeout(function () {
			$msgEl.find(errorClass).removeClass('zoomTop-enter')

			setTimeout(function () {
				$msgEl.find(errorClass).addClass('zoomTop-enter')
			}, 3000)
		}, 300);
	},
    errorPrompt: function (msg) {
    	if (window.console === 0) {
    		console.warn(msg)
    	} else {
    		throw msg
    	};
    }
}