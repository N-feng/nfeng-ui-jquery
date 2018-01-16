;
(function () {
	$('.datepick').NUI('datepick', {
		// format: 'YYYY/MM/DD',
		selectMonth: function () {
			$('.form-time').trigger('submit');
		},
		weeks: function (weeks) {
			// console.log(weeks)
		}
	});
}());