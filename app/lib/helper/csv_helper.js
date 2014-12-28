/*
 * Helper utility class to build csv content
 */
var CSV = function() {
	function buildCsvStream(source, needTitle) {
		var titleLn = "";
		if (needTitle) {
			titleLn = addCR(buildTitleLine(Object.keys(source)));
		}
		var contentLn = buildContentLine(source);
		return titleLn + contentLn;
	}

	function buildTitleLine(keyArr) {
		return keyArr.join(',');
	}

	function buildContentLine(obj) {
		return Alloy.Globals._.values(obj).join(',');
	}

	function addCR(str) {
		return str + "\n";
	}

	return {
		buildCsvStream : buildCsvStream
	};
}();

module.exports = CSV;