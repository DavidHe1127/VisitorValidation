var global = (function() {
	$.optionBar.applyProperties({
		backgroundColor : Alloy.Globals.Platform.isiOS7Plus ? "#FFFFFF" : Alloy.Globals.Colors.DEFAULT_THEME_GREEN
	});
	var visitorHelper = require("helper/visitor_helper");
	
	//preload();
	
	return {
		visitorHelper : visitorHelper,
		eventHelper : require("helper/event_helper"),
		mVisitor : visitorHelper.createVisitorModel(),
		ticketing : require("Ticketing"),
		todayEvent : null,
		dataManager : require("data_manager")
	};
})();
/*
 * textfield return event handlers
 */
function onLNavBtnClick() {
}

function onLastnameReturn(e) {
	$.first_name.focus();
}

function onContactReturn(e) {
	$.email.focus();
}

function blurTextfield(e) {
	e.source.blur();
}

function onTableClick(e) {
	var id = e.source.id;
	if (id === "visitor_type" || id === "purpose" || id === "title" || id === "proof_of_id") {
		loadOptions(e);
	} else if (id === "event") {
		showPopover({
			"children" : loadEvents(),
			"onTableClick" : function(selected) {
				e.source.value = selected;
			},
			"title" : "Event"
		});
	}
}

function showPopover(payload) {
	var popover = Alloy.createController("popover", payload);
	popover.show();
}

function onOptionBarClick(e) {
	if (e.index === 0) {//reset
		onReset();
	} else if (e.index === 1) {//send
		onSubmit();
	}
}

function onSubmit() {
	updateVisitorDetail();
	if (global.visitorHelper.isEventSet(global.mVisitor)) {
		processXation();
	} else {
		global.todayEvent = global.eventHelper.createTodayEveIfNotExist();
		useTodayEvent();
		processXation();
	}
}

function onReset() {
	var ad = Ti.UI.createAlertDialog({
		title : "Warning",
		message : "Do you wish to reset visitor details?",
		buttonNames : ["Yes", "No"]
	});
	ad.addEventListener("click", function(e) {
		if (e.index === 0) {
			reset();
		}
	});
	ad.show();
}

function loadEvents() {
	var cEvent = Alloy.createCollection("event", {});
	return cEvent.getDetailByColumn("name");
}

function loadOptions(e) {
	showPopover({
		"children" : Alloy.Globals.Setting.get(e.source.id),
		"onTableClick" : function(selected) {
			e.source.value = selected;
		},
		"title" : L(e.source.id)
	});
}

/*
 * grouped tf utilities
 */
function reset(args) {
	$.title.value = $.last_name.value = $.first_name.value = $.visitor_type.value = $.organization.value = $.proof_of_id.value = $.email.value = $.contact.value = $.purpose.value = $.event.value = '';
	global.visitorHelper.reset(global.mVisitor);
}

function processXation(args) {
	if (global.visitorHelper.isVisitorValid(global.mVisitor)) {
		saveVisitor();
	}
}

function saveVisitor() {
	global.mVisitor.set({
		"passcode" : global.ticketing.getNext()
	});
	global.visitorHelper.persistVisitor(global.mVisitor);
	Alloy.Globals.UI.alert({
		"title" : "Success",
		"message" : "Passcode is " + global.mVisitor.get("passcode"),
		"buttons" : [{
			"title" : L("ok"),
			"cbFunc" : showLabel
		}]
	});
}

function useTodayEvent() {
	global.mVisitor.set({
		"event_id" : global.todayEvent.get("id")
	});
}

function updateVisitorDetail() {
	global.mVisitor.set({
		"last_name" : $.last_name.value,
		"first_name" : $.first_name.value,
		"visitor_type" : $.visitor_type.value,
		"organization" : $.organization.value,
		"proof_of_id" : $.proof_of_id.value,
		"title" : $.title.value,
		"purpose" : $.purpose.value,
		"visitor_type" : $.visitor_type.value,
		"email" : $.email.value,
		"contact" : $.contact.value,
		"event_id" : global.eventHelper.fetchEveIdByName($.event.value)
	});
}

function showLabel() {
	var jVisitor = global.mVisitor.toJSON();
	jVisitor["sign_in_at"] = Alloy.Globals.utils.formatDateOrTime(jVisitor["sign_in_at"], "DATE|TIME", true);
	
	Alloy.createController("visitor/visitor_create_label", {
		"visitor" : jVisitor,
		"onClose" : reset
	}).getView().open();
}
//************************************** NOTES **********************************************
/*
 [INFO] :   success
 [INFO] :   {"type":"POST","headers":{"X_VR_REST_API_KEY_V1":"399C74494BA54417863
 650BCD2A418DA","Content-Type":"application/json"},"isJSON":true,"method":"POST",
 "timeout":20000,"url":"https://logisapp.herokuapp.com/vr/api/v1//entry/54080e733
 bc314fd0f000005/single/create"}
 [INFO] :   "{\"_id\":\"5412d660ff827e6f1b000001\",\"arrival_time\":\"12th Septem
 ber 2014 9:17 pm\",\"created_at\":\"2014-09-12T21:17:52+10:00\",\"departure_time
 \":\"14th September 2014 9:17 pm\",\"event_id\":\"54080e733bc314fd0f000005\",\"f
 irst_name\":\"David\",\"last_name\":\"He\",\"organization\":\"Island Pacific\",\
 "pass_code\":null,\"passcode\":\"abc123\",\"pdf_path\":null,\"proof_of_id\":\"Dr
 iver License\",\"purpose\":\"Meeting\",\"title\":\"Mr.\",\"updated_at\":\"2014-0
 9-12T21:17:52+10:00\",\"visitor_type\":\"None\",\"vr_entry_id\":\"54080e733bc314
 fd0f000005\"}"
 *
 *
 */
function preload() {
	$.title.value = "Mr.";
	$.last_name.value = "Tester";
	$.first_name.value = "Test";
	$.visitor_type.value = "Contractor";
	$.organization.value = "NBA";
	$.proof_of_id.value = "Driver License";
	$.purpose.value = "Dlivery";
	$.contact.value = "0544872216";
	$.email.value = "ggg@test.com.au";
	
}