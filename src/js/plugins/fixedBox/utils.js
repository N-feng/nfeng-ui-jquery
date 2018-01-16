let fixedBoxUtils = {
	createTemplate: function () {
		return `<div class="fixed-box">
			<div class="fixed-content">${this.config.content}</div>
		</div>`;
	}
}

module.exports = fixedBoxUtils 
