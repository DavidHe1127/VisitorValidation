var global = (function(args) {

	var eventHelper = require("helper/event_helper");

	return {
		codeLst : $.cEvent.getDetailByColumn("code"),
		hasNewEvent : false,
		newEvent : {},
		from : {
			"onAddEventWinClose" : args.onAddEventWinClose
		},
		eventHelper : eventHelper,
		mEvent : eventHelper.createEventModel()
	};
})(arguments[0] || args);

function onWinClose() {
	if (global.hasNewEvent) {
		global.from.onAddEventWinClose && global.from.onAddEventWinClose(global.mEvent.get("id"));
	}
}

function onLNavBtnClick() {
	$.eventWin.close();
}

function onNoteReturn(e) {
	$.note.blur();
}

function onContactReturn(e) {
	$.note.focus();
}

function onHostReturn(e) {
	$.contact.focus();
}

function onCodeReturn(e) {
	$.name.focus();
}

function onNameReturn(e) {
	$.name.blur();
}

function onRNavBtnClick() {
	createNewEvent();
}

function onTableClick(e) {
	if (OS_IOS) {
		var tfId = e.source.id,
		    type = "";
		if (tfId === "end_at" || tfId === "start_at") {
			type = "TIME";
		} else if (tfId === "create_at") {
			type = "DATE";
		}
		if (type) {
			var datePickerWin = Alloy.createController("ios_date_time_picker", {
				date : e.source.value,
				title : e.source.hintText,
				cbFunc : function(cbArgs) {
					//TODO should return full timestamp string only and format it accordingly
					e.source.value = cbArgs.dateTimeStr;
					global.mEvent.set(type, cbArgs.dateTimeObj.toISOString());
				},
				type : type
			}).getView().open();
		}
	}
}

function createNewEvent() {
	updateEventDetail();
	if (global.eventHelper.isEveValid(global.mEvent)) {
		saveEvent();
		EOS();
	}
}

/*
 * grouped tf return event handlers
 */
function saveEvent() {
	global.mEvent.save();
	global.hasNewEvent = true;
}

function updateEventDetail() {
	global.mEvent.set({
		"note" : $.note.value,
		"contact" : $.contact.value,
		"host" : $.host.value,
		"name" : $.name.value,
		"code" : $.code.value
	});
}

function EOS() {
	$.eventWin.close();
	Alloy.Globals.UI.alert({
		"message" : "Event has been created"
	});
}

//************************************* Test ***************************************************************************
/*
 * var res = {
 "_id" : "53fad037ccce327f26000001",
 "code" : "123",
 "contact" : "0432226655",
 "created_at" : "2014-08-25T15:57:11+10:00",
 "date" : "2014-08-14",
 "end_time" : null,
 "host" : "US",
 "name" : null,
 "note" : "dunk",
 "start_time" : null,
 "type" : "nba",
 "updated_at" : "2014-08-25T15:57:11+10:00",
 "vr_user_id" : "53d3080f72c33c544b000001"
 };
 */