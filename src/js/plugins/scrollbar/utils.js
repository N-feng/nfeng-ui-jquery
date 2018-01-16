module.exports = {
	isScrollOverlaysContent: function (browser) {
		let scrollSize = this.getBrowserScrollSize(browser, true);
		return !(scrollSize.height || scrollSize.width);
	},
	getBrowserScrollSize: function (browser, actualSize) {
		if (browser.webkit && !actualSize) {
			return {
				height: 0,
				widht: 0
			}
		}
		if (!browser.data.outer) {
			let css = {
				"border": "none",
				"box-sizing": "content-box",
				"height": "200px",
				"margin": "0",
				"padding": "0",
				"width": "200px"
			};
			browser.data.inner = $('<div>').css($.extend({}, css));
			browser.data.outer = $('<div>').css($.extend({
				"left": "-1000px",
				"overflow": "scroll",
				"position": "absolute",
				"top": "-1000px"
			}, css)).append(browser.data.inner).appendTo('body');
		}

		browser.data.outer.scrollLeft(1000).scrollTop(1000);

		return {
			"height": Math.ceil((browser.data.outer.offset().top - browser.data.inner.offset().top) || 0),
			"width": Math.ceil((browser.data.outer.offset().left - browser.data.inner.offset().left) || 0)
		};
	}
}