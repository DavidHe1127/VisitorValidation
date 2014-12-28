function onSwtChange(e) {
	if (!Alloy.Globals.utils.S.isBlank(e.itemId)) {
		Alloy.Globals.Setting.set(e.itemId, e.source.value);
	}

	// var dm = require("data_manager");
	// dm.syncOfflineData();
}

