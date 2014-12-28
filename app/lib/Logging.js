/*
 * Log outputs from the console for debugging purpose
 */
var Logging = function() {

	function i(msg, tag, serialize) {
		print(msg, tag, serialize, function(log) {
			Ti.API.info(log);
		});
	}

	function w(msg, tag, serialize) {
		print(msg, tag, serialize, function(log) {
			Ti.API.warn(log);
		});
	}

	function print(msg, tag, serialize, printer) {
		if (msg && tag && serialize) {
			printer(tag + " : " + JSON.stringify(msg));
		} else if (msg && tag) {
			printer(tag + " : " + msg);
		} else if (msg) {
			printer(msg);
		}
	}

	return {
		i : i,
		w : w
	};

}();

module.exports = Logging;
