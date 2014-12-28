var global = (function(args) {

	$.index.setTitle(args.visitorFullname);

	if (args.allowSignOut) {
		var rNavBtn = $.UI.create("Button", {
			"width" : 25,
			"height" : 25,
			"backgroundImage" : "NONE",
			"image" : "images/nav_ico/signout.png"
		});

		rNavBtn.addEventListener("click", onRNavBtnClick);
		$.index.setRightNavButton(rNavBtn);
	}

	var visitorHelper = require("helper/visitor_helper");
	var mVisitor = visitorHelper.fetchVisitorById(args.visitorId);
	var readableJson = visitorHelper.createReadableJson(mVisitor);
	var data = [];

	for (var key in readableJson) {
		if (readableJson.hasOwnProperty(key)) {
			data.push({
				"properties" : $.createStyle({
				}),
				"title" : {
					"text" : L(key)
				},
				"value" : {
					"text" : readableJson[key]
				}
			});
		}
	}

	$.listSec.setItems(data);

	return {
		visitorHelper : visitorHelper,
		mVisitor : mVisitor
	};

})(arguments[0] || {});

function onLNavBtnClick() {
	$.index.close();
}

function onRNavBtnClick() {
	var signOutAt = global.visitorHelper.signOut(global.mVisitor.get("id"));
	Alloy.Globals.UI.alert({
		"title" : "Success",
		"message" : "Visitor sign out at " + Alloy.Globals.utils.formatDateOrTime(signOutAt, "DATE|TIME", true)
	});
	$.index.close();
}
