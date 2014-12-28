var preload = {
	actInd : Alloy.createWidget("nl.fokkezb.loading"),
	// toasty : Alloy.createWidget("toasty", {
		// animation : "fade",
		// type : "alert",
		// duration : 2000,
		// font : {
			// fontSize : 11,
			// fontWeight : "bold",
			// fontFaimly : "Arial"
		// },
		// width : 250,
		// height : 150
	// })
};

var internal = {
	toastyMsgLst : {
		"NO_NETWORK_CONN" : "No network connection",
		"OPERATION_FAILED" : "Operation failed",
		"NO_SERVER_CONN" : "Server communication error"
	}
};

/*
 * Build and show alert dialog
 *
 * @param {opts}
 *{
 * 	title : "Note",
 *  message : "Please enter password",
 *  buttons : [{
 * 	  title : "OK",
 * 	  cbFunc : function(e) {}
 * }, {
 * 	  title : "Cancel",
 * 	  cbFunc : function(e) {}
 * }]
 *}
 */
exports.alert = function(opts) {
	if (Alloy.Globals._.isString(opts)) {
		alert(opts);
	} else if (Alloy.Globals._.isObject(opts)) {
		var defaults = {
			"title" : "Alert",
			"persistent" : true,
			"buttonNames" : ["OK"]
		};

		/*
		 * set buttons
		 */
		if (opts.buttons) {
			defaults["buttonNames"] = [];

			opts.buttons.forEach(function(ele, i, arr) {
				defaults["buttonNames"][i] = ele["title"];
				if (ele.title.indexOf("ancel") > -1) {
					defaults["cancel"] = i;
				}
			});
		}

		var combined = Alloy.Globals._.extend(defaults, opts);
		var alertDialog = Ti.UI.createAlertDialog(combined);

		/*
		 * set event handlers
		 */
		if (opts.buttons) {
			alertDialog.addEventListener("click", function(e) {
				opts.buttons[e.index]["cbFunc"] && opts.buttons[e.index]["cbFunc"](e);
			});
		}
		alertDialog.show();
	}
};

/*
 * roulette - indicates a http request in progress
 */
exports.actInd = function() {
	return {
		show : function(msg, cancelable) {
			if (!preload.actInd.visible) {
				preload.actInd.show(msg, cancelable);
			}
		},
		hide : function() {
			preload.actInd.hide();
		}
	};
}();

/*
 * A variety of message boxes
 */
exports.toasty = function() {
	return {
		alarm : function(title, message) {
			if (message) {
				preload.toasty.show({
					"title" : internal.toastyMsgLst[title] || "Error",
					"message" : message
				});
			} else {
				preload.toasty.show({
					"title" : "Error",
					"message" : internal.toastyMsgLst[title]
				});
			}
		},
		confirm : function(title, message) {
			if (message) {
				preload.toasty.show({
					"title" : internal.toastyMsgLst[title] || "Confirm",
					"message" : message,
					"type" : "confirm"
				});
			} else {
				preload.toasty.show({
					"title" : "Confirm",
					"message" : internal.toastyMsgLst[title],
					"type" : "confirm"
				});
			}
		}
	};
}();

/*
 * Fonts
 */
exports.fonts = {
	"S" : {
		"fontFamily" : "Arial",
		"fontWeight" : "normal",
		"fontSize" : 15
	},
	"M" : {
		"fontFamily" : "Arial",
		"fontWeight" : "normal",
		"fontSize" : 18
	},
	"LR" : {
		"fontFamily" : "Arial",
		"fontWeight" : "normal",
		"fontSize" : 21
	},
	"XL" : {
		"fontFamily" : "Arial",
		"fontWeight" : "normal",
		"fontSize" : 30
	}
};