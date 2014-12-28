var global = (function(args) {

	var eventHelper = require("helper/event_helper");
	var cEvent = eventHelper.fetchEventList();
		
	var dataSet = cEvent.map(function(eve) {
		return {
			"properties" : $.createStyle({
				"classes" : ["APP_LIST_OVERVIEW_ITEM"],
				"itemId" : eve.get("code")
			}),
			"title" : {
				"text" : eve.get("name")
			},
			"subtitle" : {
				"text" : eve.get("code")
			},
			"side_note" : {
				"text" : Alloy.Globals.utils.formatDateOrTime(eve.get("create_at"), "DATE", true)
			}
		};
	});

	$.lstSec.setItems(dataSet);

	return {
		anim : require("alloy/animation"),
		cEvent : cEvent
	};

})(arguments[0] || {});

function onListClick(e) {
	if (OS_IOS) {
		$.lst.deselectItem(e.sectionIndex, e.itemIndex);
	}
	var selEveCode = $.lstSec.getItemAt(e.itemIndex)["properties"]["itemId"];
	openEventDetailWin(selEveCode);
}

function onLNavBtnClick() {
	$.index.close();
}

function onRNavBtnClick() {
	openAddEventWin();
}

function onEventDelete(e) {
}

function openAddEventWin() {
	Alloy.Globals.currTab.open(Alloy.createController("event/add_event", {
		"onAddEventWinClose" : onAddNewEvent
	}).getView());
}

function onAddNewEvent(newEventId) {
	var newEvent = Alloy.createModel("event", {});
	newEvent.fetch({
		"id" : newEventId
	});

	global.cEvent.add(newEvent);

	$.lstSec.appendItems([{
		"properties" : $.createStyle({
			"classes" : ["APP_LIST_OVERVIEW_ITEM"],
			"itemId" : newEvent.get("code")
		}),
		"title" : {
			"text" : newEvent.get("name")
		},
		"subtitle" : {
			"text" : newEvent.get("code")
		},
		"side_note" : {
			"text" : Alloy.Globals.utils.formatDateOrTime(newEvent.get("create_at"), "DATE", true)
		}
	}]);
}

function openEventDetailWin(selEveCode) {
	var mEve = global.cEvent.where({
		"code" : selEveCode
	});

	var eventDetailWin = Alloy.createController("event/event_detail", {
		"selectedEvent" : mEve[0]
	}).getView();
	Alloy.Globals.currTab.open(eventDetailWin);
}