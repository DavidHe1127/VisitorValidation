function onTabGroupFocus(e) {
	Alloy.Globals.tabGroup = $.main;
	if (e.tab) {
		Alloy.Globals.currTab = e.tab;
	}
}

function onTabGroupClose() {
	if (Alloy.Globals.UserHelper.fetchLastActiveUser()) {
		var portalWin = Alloy.createController("user/user_sign_in", {}).getView();
		portalWin.addEventListener("open", function() {
			refocusPortalWin();
		});
		portalWin.open();
	} else {
		refocusPortalWin();
	}
}

function refocusPortalWin() {
	Ti.App.fireEvent("PORTAL_WIN_REFOCUS", {});
}
