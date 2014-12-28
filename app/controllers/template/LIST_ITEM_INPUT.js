function onInputReturn(e) {
	if (!Alloy.Globals.utils.S.isBlank(e.itemId)) {
		Alloy.Globals.Setting.set(e.itemId, e.source.value);
	}
}

