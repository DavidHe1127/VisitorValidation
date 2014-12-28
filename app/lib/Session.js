/*
 *
 * Similar to its counterpart in PHP. It allows for persist, fetch and delete manipulations
 * It is beyond the device power cycle and only eliminated as app is deleted
 *
 */
/*
 *
 * Similar to its counterpart in PHP. It allows for persist, fetch and delete manipulations
 * It is beyond the device power cycle and only eliminated as app is deleted
 *
 */

function Session(ns) {
	if (Alloy.CFG.ns.indexOf(ns) === -1) {
		throw "pre-register ns required";
	}
	this.ns = ns + ':';
}

Session.prototype.get = function(key) {
	return Ti.App.Properties.getObject(this.ns + key, undefined);
};

Session.prototype.set = function(key, value) {
	(key && value) && Ti.App.Properties.setObject(this.ns + key, value);
};

Session.prototype.listKeys = function() {
	return Ti.App.Properties.listProperties();
};

Session.prototype.blowup = function() {
	this.listKeys().forEach(function(ele) {
		Ti.API.info("Key removed : " + ele);
		Ti.App.Properties.removeProperty(ele);
	});
};

Session.prototype.unset = function(key) {
	key && Ti.App.Properties.hasProperty(this.ns + key) && Ti.App.Properties.setObject(this.ns + key, {});
};

Session.prototype.remove = function(key) {
	key && Ti.App.Properties.hasProperty(this.ns + key) && Ti.App.Properties.removeProperty(this.ns + key);
};

module.exports = Session;