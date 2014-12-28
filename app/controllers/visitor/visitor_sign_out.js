var args = arguments[0] || {};
var visitorHelper = require("helper/visitor_helper");

function onReturn(e) {
	var val = e.source.value;
	var mVisitor = visitorHelper.fetchVisitorByPasscode(val);

	if (mVisitor) {
		openVisitorDetailWin(mVisitor);
	} else if (Alloy.Globals.utils.S.isBlank(val)) {

	} else {
		Alloy.Globals.UI.alert({
			"title" : L("error"),
			"message" : String.format(L("not_exist"), L("visitor")),
			"buttons" : [{
				"title" : L("try_again"),
				"cbFunc" : function() {
					$.passcode.focus();
				}
			}, {
				"title" : "Cancel"
			}]
		});
	}
}

function openVisitorDetailWin(mVisitor) {
	var allowSignOut = !visitorHelper.hasVisitorGone(mVisitor);

	if (allowSignOut) {
		Alloy.Globals.currTab.open(Alloy.createController("visitor/visitor_detail", {
			"visitorId" : mVisitor.get("id"),
			"visitorFullname" : mVisitor.getFullName(),
			"allowSignOut" : allowSignOut
		}).getView());
	} else {
		Alloy.Globals.UI.alert({
			"title" : L("warning"),
			"message" : "Visitor already signed out",
			"buttons" : [{
				"title" : L("ok"),
				"cbFunc" : function() {
					$.passcode.focus();
				}
			}]
		});
	}
}

function onWinFocus() {
	setTimeout(function() {
		$.passcode.focus();
	}, 500);
}