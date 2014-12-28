var settings = {
	"purpose" : ["Conference", "Meeting", "Building Maintenance", "Delivery", "Other"],
	"visitor_type" : ["Visitor", "Contractor"],
	"proof_of_id" : ["Driver License", "Permit Number"],
	"title" : ["Mr.", "Mrs.", "Miss", "Ms.", "Dr."],
	"build_label" : false,
	"version" : 0.1
};

var Session = require("Session");
var session = new Session("setting");

/*
 * Utility methods
 */
function getCachedSettings() {
	return session.get("APP_SETTINGS");
}

function loadSettings(newSettings) {
	session.set("APP_SETTINGS", newSettings || settings);
}

function needUpdate() {
	return getCachedSettings().version < settings.version;
}

function internalSet(obj, path, value) {
	path = path.split('.');

	for (var i = 0; i < path.length - 1; i += 1) {
		obj = obj[path[i]];
	}

	obj[path[path.length - 1]] = value;

}

function update() {
	var cachedSettings = getCachedSettings();
	var latestVersion = settings.version;

	var newest = Alloy.Globals.utils.merge(settings, cachedSettings);
	newest.version = latestVersion;

	Alloy.Globals.Log.i("VERSION UPDATED FROM " + cachedSettings.version + " TO " + newest.version);
	Alloy.Globals.Log.i(newest);

	loadSettings(newest);
}

/*
 * Public
 */
exports.set = function(path, value) {
	var schema = getCachedSettings();

	Alloy.Globals.Log.i("BEFORE SET");
	Ti.API.info(schema);

	internalSet(schema, path, value);

	Alloy.Globals.Log.i("AFTER SET");
	Ti.API.info(schema);

	loadSettings(schema);
};

exports.get = function(path) {
	var cache = getCachedSettings();

	if (cache) {
		if (path) {
			path.split('.').forEach(function(p) {
				cache = cache[p];
			});
			return cache;
		} else {
			return cache;
		}
	}
};
exports.load = function() {
	if (!getCachedSettings()) {
		Alloy.Globals.Log.i("LOAD SETTINGS FIRST TIME");
		loadSettings();
	} else {
		needUpdate() && update();
	}
};
exports.getDefaults = function(path) {
	var locals = settings;
	
	if (path) {
		path.split('.').forEach(function(p) {
			locals = locals[p];
		});
		return locals;
	} else {
		return locals;
	}
};

/*
 * mandatory methods for using shredder to clean up cache
 */
exports.GC = function() {
	session.remove("APP_SETTINGS");
};

exports.getNS = function() {
	return "APP_SETTINGS";
};
