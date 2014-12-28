var global = (function() {
	return {
		"day_from" : new Date().toISOString(),
		"day_to" : new Date().toISOString()
	};
})();

function onCalendarClick(e) {
	var txtFieldId = e.source.id + "_field";

	if (OS_IOS) {
		var datePickerWin = Alloy.createController("ios_date_time_picker", {
			date : $[txtFieldId].value,
			title : L(e.source.id),
			cbFunc : function(cbArgs) {
				$[txtFieldId].value = cbArgs.dateTimeStr;
				global[e.source.id] = cbArgs.dateTimeObj;
			},
			type : "DATE"
		}).getView().open();
	}
}

function resetDate() {
	global.day_to = global.day_from = new Date().toISOString();
	$.day_from_field.value = $.day_to_field.value = Alloy.Globals.moment(new Date()).format("Do MMMM YYYY");
}

function onRNavButtonClick() {
	var result = findVisitor();

	if (result.length > 0) {
		Alloy.Globals.currTab.open(Alloy.createController("visitor/visitor_enquiry", {
			"cVisitor" : result
		}).getView());
	} else {
		alert(L("no_result_found"));
	}
}

function findVisitor() {
	var visitorHelper = require("helper/visitor_helper");
	var dayFromQuery = Alloy.Globals.utils.formatDateOrTime(global["day_from"], "DATE");
	var dayToQuery = Alloy.Globals.utils.formatDateOrTime(global["day_to"], "DATE");

	return visitorHelper.fetchVisitorByDateRange(dayFromQuery, dayToQuery);
}

function onWinOpen() {
	resetDate();
}
