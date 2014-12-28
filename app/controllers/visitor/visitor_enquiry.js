var global = (function(args) {
	var data = [];

	args.cVisitor.map(function(vM) {
		data.push({
			"properties" : $.createStyle({
				classes : ["APP_LIST_OVERVIEW_ITEM"],
				itemId : vM.get("id"),
				searchableText : vM.getFullName() + " " + vM.get("passcode")
			}),
			"title" : {
				"text" : vM.getFullName()
			},
			"subtitle" : {
				"text" : Alloy.Globals.utils.formatDateOrTime(vM.get("sign_in_at"), "DATE|TIME", true)
			},
			"side_note" : {
				"text" : vM.get("passcode")
			}
		});
	});

	$.lstSec.setItems(data);
	
})(arguments[0] || {});

function onLstClick(e) {
	var item = e.section.getItemAt(e.itemIndex);
	openDetailWin(item.properties.itemId, item.title.text);
}

function onLNavBtnClick() {
	$.index.close();
}

function openDetailWin(visitorId, visitorFullname) {
	var w = Alloy.createController("visitor/visitor_detail", {
		"visitorId" : visitorId,
		"visitorFullname" : visitorFullname
	}).getView();

	Alloy.Globals.currTab.open(w);
}
