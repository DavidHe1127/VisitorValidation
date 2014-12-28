var global = {};

function onOptionDelete(e) {
	try {
		global.onDelete(e.itemId);
	} catch(e) {
		Ti.API.warn(e, "delete failed", true);
	}
}

function isPayloadValid(v) {
	return Alloy.Globals._.isObject(v);
}

function hasValidList(v) {
	return Alloy.Globals._.isArray(v) && v.length > 0;
}

function isEmptyString(s) {
	return s === null || s === undefined ? !0 : /^[\s\xa0]*$/.test(s);
}

function ifExist(text) {
	return global.list.some(function(option) {
		return option.title === text;
	});
}

function buildList(options) {
	$.lstSec.setItems(options.map(function(option) {
		return {
			"properties" : {
				"title" : option.title,
				"canEdit" : option.removable,
				"itemId" : option.title
			}
		};
	}));
}

function onListClick(e) {
	if (OS_IOS) {
		$.lst.deselectItem(e.sectionIndex, e.itemIndex);
	}
}

/**
 * sample param
 *
 * payload.list = [{title : 'a', removable : true}, {title : 'b', removable : false}]
 * payload.name = "purpose"
 * payload.onDelete = function() {}
 *
 */
$.init = function(payload) {
	if (isPayloadValid(payload) && hasValidList(payload.list)) {
		buildList(payload.list);
		global.list = payload.list;
		global.name = payload.name || "option";
		global.onDelete = payload.onDelete ||
		function() {
		};
	}
};

$.addNew = function(onAdd) {
	var dialog = Ti.UI.createAlertDialog({
		title : String.format(L("add_new"), L(global.name)),
		style : Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
		buttonNames : ["Ok", "Cancel"],
		cancel : 1
	});
	dialog.addEventListener('click', function(e) {
		if (e.index === 0 && !isEmptyString(e.text) && !ifExist(e.text)) {
			$.lstSec.appendItems([{
				"properties" : {
					"title" : e.text,
					"canEdit" : true,
					"itemId" : e.text
				}
			}]);

			onAdd && onAdd(e.text);
			global.list.push({
				"removable" : true,
				"title" : e.text
			});
		}
	});
	dialog.show();
}; 