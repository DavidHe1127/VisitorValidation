(function init() {
	if (Alloy.Globals.UserHelper.fetchOnboardUser()) {
		var tabGroup = Alloy.createController("main", {}).getView();
		tabGroup.open();
	} else {
		var portalWin = Alloy.createController("user/user_sign_in", {}).getView();
		portalWin.open();
	}
})();