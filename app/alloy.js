Alloy.Globals = {
	_ : require("alloy/underscore")._,
	moment : require("alloy/moment"),
	currTab : null,
	tabGroup : null,
	Log : require("Logging"),
	utils : require("utils"),
	Setting : require("setting"),
	Colors : require("Colors").Colors,
	UI : require("Control"),
	XHR : require("Http"),
	Platform : {
		W : Ti.Platform.displayCaps.platformWidth,
		H : Ti.Platform.displayCaps.platformHeight,
		isiOS7Plus : function() {
			if (Titanium.Platform.name === "iPhone OS") {
				var version = Titanium.Platform.version.split('.');
				var major = parseInt(version[0], 10);
				if (major >= 7) {
					return true;
				}
			}
			return false;
		}()
	},
	UserHelper : require("helper/user_helper")
};

/*
 * user register screen params
 */
Alloy.Globals.Platform.RegisterScreen = {
	"GAP" : (Alloy.Globals.Platform.W - 50 * 2 - 30 * 2) / 3,
};

/*
 * load settings
 */
Alloy.Globals.Setting.load();

/*
 * set backgroundcolor if it is ios7+
 */
if (Alloy.Globals.Platform.isiOS7Plus) {
	Ti.UI.backgroundColor = "#E5E4E2";
}
//************************************************ Test *******************************************************