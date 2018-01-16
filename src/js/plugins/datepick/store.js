function Store(date) {
	let _this = this;
	_this.defaults = {
		// 今天
    _d  : new Date(date || new Date()),
    // 明天
    _nd : _this.modifyDate(_this._d, 1),
    // 下个月
    _nM : _this.modifyMonth(_this._nd, 1),
    // 明年
    _nY : _this.modifyYear(_this._nd, 1),
    // 昨天
    _pd : _this.modifyDate(_this._d, -1),
    // 上个月
    _pM : _this.modifyMonth(_this._pd, -1),
    // 上一年
    _pY : _this.modifyYear(_this._pd, -1)
	}
	_this.update(date)
}

Store.prototype.update = function (date) {
	let _this = this
	_this._d = new Date(date);
	_this._nd = _this.modifyDate(_this._d, 1);
	_this._nM = _this.modifyMonth(_this._nd, 1);
	_this._nY = _this.modifyYear(_this._nd, 1);
	_this._pd = _this.modifyDate(_this._d, -1);
	_this._pM = _this.modifyMonth(_this._pd, -1);
	_this._pY = _this.modifyYear(_this._d, -1);
}

Store.prototype.modifyDate = function (date, num) {
	let initDate = new Date(date)
	return new Date(initDate.setDate(initDate.getDate() + num))
}

Store.prototype.modifyMonth = function (date, num) {
	let initDate = new Date(date)
	return new Date(initDate.setMonth(initDate.getMonth() + num))
}

Store.prototype.modifyYear = function (date, num) {
	let initDate = new Date(date)
	return new Date(initDate.setFullYear(initDate.getFullYear() + num))
}

module.exports = Store