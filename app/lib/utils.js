/** @access private */
var local = {
	/*
	 * Add zeros according the required length
	 *
	 * @param {integer} [num] - number
	 * @param {integer} [count] - the length of digits
	 * @returns {String} - Returns the new string with added zeros
	 */
	zeroPad : function(num, count) {
		var numZeropad = num + '';
		while (numZeropad.length < count) {
			numZeropad = "0" + numZeropad;
		}
		return numZeropad;
	},
	hasNetwork : function() {
		return Titanium.Network.getOnline();
	},
	expr : {
		urlParam : / *\{[^}]*\} */g //values will populate at {param1}...{param2}
	}
};

//***************************************************** @public - all exported methods ****************************************

/*
 * Generates the unique id
 *
 * @returns {String} - Returns unique id
 */
exports.guid = function() {
	var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16 | 0,
		    v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
	return guid;
};

/*
 * Can use something
 *
 * @param {String} [key] - event
 *
 */
exports.canUse = function(key) {
	var dict = {
		"email" : Ti.UI.createEmailDialog().isSupported() && local.hasNetwork(),
		"internet" : local.hasNetwork()
	};
	return dict[key];
};

/*
 * Is new api supported
 *
 * @param {String} [key] - api name
 *
 */
exports.allow = function(key) {
	var list = [];
	if (OS_ANDROID && Ti.Platform.Android.API_LEVEL > 11) {
		list = ["searchView", "actionBar"];
	}
	return list.indexOf(key) > -1;
};

/*
 * A collection of validation rules
 *
 * @param {String} [name] - validation name
 * @param {String} [val] - value needs to be validated
 *
 * @returns {Boolean} - whether pass the validation
 */
exports.isValid = function(name, val) {
	var dict = {
		"qty" : function(val) {
			var compare = Number(val);
			return 100001 > compare && compare > 0;
		},
		"email" : function(val) {
			var atpos = val.indexOf("@");
			var dotpos = val.lastIndexOf(".");
			if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= val.length) {
				return false;
			} else {
				return true;
			}
		}
	};

	return dict[name](val);
};

/*
 * Populate value
 *
 * @param {String} [url] - the url
 * @param {Array} [paramArr] - the array of parameters
 */
exports.parameterize = function(url, paramArr) {
	var i = 0;

	result = url.replace(local.expr.urlParam, function(match) {
		return match = paramArr[i++];
	});

	return result;
};

/*
 * Generate date
 *
 * @param {String} [dateStr] - date string formatted in DD/MM/YYYY
 */
exports.getDate = function(dateStr) {
	var formattedStr = dateStr.replace(/-/g, "/");
	var arr = formattedStr.split("/");
	var date = new Date(arr[2], arr[1] - 1, arr[0]);
	return Alloy.Globals._.isDate(date) ? date : new Date();
};

/*
 * Resolve
 *
 * @param {String} [path] - lookup chain
 * @param {Object} [obj] - target object to look through
 * @param {Anytype} [defaults] - return this value if lookup failed
 */
exports.resolve = function(path, obj, defaults) {
	if (path && Alloy.Globals._.isObject(obj)) {
		path.split('.').forEach(function(p) {
			if (obj[p] || obj[p] == 0) {
				obj = obj[p];
			} else {
				obj = defaults || false;
			}
		});
		return obj;
	} else {
		return defaults || false;
	}
};

/*
 * JSON parse
 *
 * @param {unknown type} [o] - variable to be evaluated
 *
 *  return {json} - json object
 */
exports.parseJSON = function(o) {
	try {
		var val = JSON.parse(o);
	} catch (e) {
		return false;
	}

	if (val) {
		Alloy.Globals.Log.i("result @parseJSON");
		Alloy.Globals.Log.i(val);
	}

	return val;
};

/*
 * Set all payload arguments into an array
 *
 * @param {Argument} [args] - arguments list
 *
 * @return {Array} - payload arguments
 */
exports.arrayPayload = function(args) {
	return Array.prototype.slice.call(args, 0);
};

/*
 * Merge two settings
 *
 * @param {Object} [latest] - the latest setting
 * @param {Object} [old] - the old setting
 *
 * @return {Object} - the merging result
 */
exports.merge = function(latest, old) {
	for (var p in old) {
		if (old.hasOwnProperty(p)) {
			try {
				// Property in destination object set; update its value.
				if (old[p].constructor === Object) {
					latest[p] = merge(latest[p], old[p]);
				} else {
					latest[p] = old[p];
				}
			} catch(e) {
				// Property in destination object not set; create it and set its value.
				Ti.API.info(e);
				latest[p] = old[p];
			}
		}
	}
	return latest;
};

/*
 * Borrowed useful String helper functions from StringJS and alloy built-in string library
 */
exports.S = function() {
	return {
		isBlank : function(s) {
			return s === null || s === undefined ? !0 : /^[\s\xa0]*$/.test(s);
		},
		ucfirst : function(text) {
			if (!text)
				return text;
			return text[0].toUpperCase() + text.substr(1);
		}
	};
}();

/*
 * Return UUID (iOS ONLY NOW)
 */
exports.uuid = function() {
	if (OS_IOS) {
		if (!local.hasOwnProperty("iOSUUID")) {
			local.iOSUUID = require("com.joseandro.uniqueids");
		}
		return local.iOSUUID.getUUID;
	} else if (OS_ANDROID) {
		return Titanium.Platform.id;
	}
};

/**
 * Format date and time
 *
 * @param {date} date - date object
 * @param {string} type - DATE/TIME
 * @param {boolean} ifDisplay - true if for display or false for request
 *
 * @return {string} formatted date/time
 *
 */
exports.formatDateOrTime = function(date, type, ifDisplay) {
	if (date) {
		var moment = require("alloy/moment");
		if (ifDisplay) {
			if (type === "DATE") {
				return moment(date).format("Do MMMM YYYY");
			} else if (type === "TIME") {
				return moment(date).format("h:mm A");
			} else if (type === "DATE|TIME") {
				return moment(date).format("Do MMMM YYYY, HH:mm");
			}
		} else {
			if (type === "DATE") {
				return moment(date).format("YYYY-MM-DD");
			} else if (type === "TIME") {
				return moment(date).format("HH:mm");
			}
		}
	} else {
		return "";
	}
};

/**
 * Build user id
 *
 * @param {object} param
 * @param {string} param.query - sql
 * @param {string} param.query.statement - sql
 * @param {string} param.query.params - parameters
 *
 */
exports.appendUsrId = function(params) {
	if (!params) {
		return;
	}
	var usrId = Alloy.Globals.UserHelper.fetchOnboardUser().get("id");

	if (params.hasOwnProperty("query")) {
		if (Alloy.Globals._.isString(params.query)) {
			if (params["query"].toLowerCase().indexOf("where") > -1) {
				params.query += " AND user_id = " + usrId;
			} else {
				params.query += " WHERE user_id = " + usrId;
			}
		} else {
			if (Alloy.Globals._.isObject(params.query)) {
				if (params["query"]["statement"].toLowerCase().indexOf("where") > -1) {
					params.query.statement += " AND user_id = " + usrId;
				} else {
					params.query.statement += " WHERE user_id = " + usrId;
				}
			}
		}
	}
};
//============================== NOT USED ==============================================================================