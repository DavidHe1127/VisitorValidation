/** Date and time picker window (iOS ONLY)
 *
 * @param {title} [string] - nav win title
 * @param {cbFunc} [function] - the callback function
 * @param {type} [string] - TIME/DATE/DATETIME default is datetime
 */

var global = (function(args) {
	$.rooWin.setTitle(args.title);

	if (args.type) {
		if (args.type === "TIME") {
			$.picker.type = Ti.UI.PICKER_TYPE_TIME;
		} else if (args.type === "DATE") {
			$.picker.type = Ti.UI.PICKER_TYPE_DATE;
		} else {
			$.picker.type = Ti.UI.PICKER_TYPE_DATE_AND_TIME;
		}
	}

	return {
		from : {
			onClose : args.cbFunc,
			title : args.title
		},
		selectedDateTime : formatDates(new Date(), args.type),
		dateObj : new Date()
	};

})(arguments[0] || {});

function onRNavBtnClick() {
	$.nav.close();
}

function onPickerChange(e) {
	var selected = new Date(e.value);
	global.selectedDateTime = formatDates(selected);
	global.dateObj = e.value;
	Ti.API.info(global.selectedDateTime);
}

function onWinClose() {
	global.from.onClose({
		"dateTimeStr" : global.selectedDateTime,
		"dateTimeObj" : global.dateObj
	});
}

function onLNavBtnClick() {
	var now = new Date();
	$.picker.setValue(now);
	global.selectedDateTime = formatDates(now);
	Ti.API.info(global.selectedDateTime);
}

function formatDates(raw, type) {
	if (!formatDates.type) {
		formatDates.type = type;
	}

	switch(formatDates.type) {
		case "DATE" :
			return Alloy.Globals.moment(raw).format("Do MMMM YYYY");
		case "TIME" :
			return Alloy.Globals.moment(raw).format("h:mm a");
		default:
			return Alloy.Globals.moment(raw).format("Do MMMM YYYY h:mm a");
	}
}
