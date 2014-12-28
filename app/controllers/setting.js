var global = (function(args) {
	return {
		anim : require("alloy/animation")
	};
})(arguments[0] || args);

function onRNavBtnClick() {
	var profileWin = Alloy.createController("user/user_profile").getView();
	Alloy.Globals.currTab.open(profileWin);
}

function onListClick(e) {
	if (OS_IOS) {
		$.lst.deselectItem(e.sectionIndex, e.itemIndex);
	}
	var item = e.section.getItemAt(e.itemIndex);

	if (item.properties.detWinPath) {
		var root = Alloy.createController(item.properties.detWinPath, {
			"type" : item.properties.itemId
		}).getView();
		Alloy.Globals.currTab.open(root);
	}
}

/*
 * itemId is the path of parameter in setting object
 */
$.lstSec.setItems([{
	"properties" : $.createStyle({
		"apiName" : "ListItem",
		"itemId" : "build_label"
	}),
	"title" : {
		text : "Build Label",
		font : Alloy.Globals.UI.fonts.S
	},
	"toggle" : {
		value : Alloy.Globals.Setting.get("build_label")
	}
}, {
	"properties" : {
		"itemId" : "purpose",
		"detWinPath" : "setting/options",
		"accessoryType" : Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
	},
	"title" : {
		text : L("purpose")
	},
	"template" : "LIST_ITEM_ACCESSORY"
}, {
	"properties" : {
		"itemId" : "visitor_type",
		"detWinPath" : "setting/options",
		"accessoryType" : Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
	},
	"title" : {
		text : L("visitor_type")
	},
	"template" : "LIST_ITEM_ACCESSORY"
}, {
	"properties" : {
		"itemId" : "proof_of_id",
		"detWinPath" : "setting/options",
		"accessoryType" : Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
	},
	"title" : {
		text : L("proof_of_id")
	},
	"template" : "LIST_ITEM_ACCESSORY"
}, {
	"properties" : {
		"itemId" : "event",
		"detWinPath" : "event/event",
		"accessoryType" : Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
	},
	"title" : {
		text : "Event"
	},
	"template" : "LIST_ITEM_ACCESSORY"
}]);
