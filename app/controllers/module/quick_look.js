var Browser = require("ti.quicklook");
/**
 * @namespace global
 * @property {function}  onClose - to invoke when quick look is closed
 * @property {function}  onPrintSuccess - to invoke when printing is done
 * @property {function}  onPrintFailure - to invoke when printing is failed
 */
var args = arguments[0] || {};

function onLNavBtnClick() {
	$.navWin.close();
	//args.onClose && args.onClose();
}

function onRNavBtnClick() {
	//print left unimplemented
}

/**
 * @public
 *
 * @param {string} filePath - file path
 */
exports.load = function(filePath) {
	var badge = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, filePath);
	if (badge.exists()) {
		$.wrapper.add(Browser.createView({
			data : [badge.nativePath]
		}));
	} else {
		throw "Unable to open designated file";
	}
};
