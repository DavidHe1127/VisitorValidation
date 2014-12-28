module.exports = function() {
	//"March 21, 2012"
	var Session = require("Session");
	var session = new Session("ticketing");

	var defaults = {
		"number" : 0,
		"today" : new Date().toLocaleDateString()
	};

	session.get("curr") || session.set("curr", defaults);

	function getNext() {
		var currentSetting = session.get("curr");

		if (currentSetting.today === new Date().toLocaleDateString()) {
			currentSetting.number = pad(Number(currentSetting.number) + 1);
			session.set("curr", currentSetting);
			return currentSetting.number;
		} else {
			session.unset("curr");
			var newSetting = Alloy.Globals._.clone(defaults);
			newSetting.number = pad(newSetting.number + 1);
			session.set("curr", newSetting);
			return newSetting.number;
		}
	}

	function pad(num) {
		var s = "000" + num;
		return s.substr(s.length - 4);
	}

	return {
		getNext : getNext
	};

}();
