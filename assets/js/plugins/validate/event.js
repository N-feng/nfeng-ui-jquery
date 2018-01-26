let Event = {
    hander: function () {
    	let queue = [];
    	let collections = this.cache;
    	for (var name in collections) {
    		queue.push('[data-required=' + name + ']');
    	}
    	return queue;
    },
    changeEmitter: function (event) {
    	let _this = event.data.self;
    	_this.verify.call(this, _this, 'change');
    },
	blurEmitter: function (event) {
		let _this = this;
        let $this = $(event.target);
        let requiredName = $this.data('required');
        let delay = _this.cache[requiredName].collection.delay;
        if (delay) {
            clearTimeout($this.data('delay'));
            $this.data('delay', setTimeout(function () {
                _this.verify(_this, 'blur');
            }));
            return false;
        }

        _this.verify.call(event.target, _this, 'blur');
	}
}

module.exports = Event
