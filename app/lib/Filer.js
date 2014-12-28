/*
 * Utility class to process file operations
 */
var Filer = function() {

	function write(content, fileFullName, append) {
		try {
			var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileFullName);
			f.write(content, append || false);
		} catch(e) {
			Alloy.Globals.Log.i(e, "failed to write to file", true);
		}

	}

	function getFile(fileFullName) {
		var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileFullName);
		if (f.exists()) {
			return f;
		}
	}

	return {
		write : write,
		getFile : getFile
	};

}();

module.exports = Filer;
