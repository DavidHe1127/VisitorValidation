/*
 * HttpClient
 *
 * @param {Object} [opts] :
 *
 * -onload : fired when connection succeeds
 * -onerror : fired when connection fails
 * -timeout : Timeout in milliseconds when the connection should be aborted
 * -headers : {
 * 	  key : value,
 * 	  key1 : value1
 * }
 * -type : PUT/POST/GET
 * -xData : JSON object message
 * -isJSON : json message in request body
 * -file : target local file
 *
 * sample invalid token response
 *
 * var errRes = {
 "responseText" : "{\"errors\":\"Invalid token.\",\"code\":403}",
 "status" : 403
 };
 *
 */

function interceptError(moreAction) {
	return function() {
		Alloy.Globals.UI.actInd.hide();
		var jReply = Alloy.Globals.utils.parseJSON(this.responseText) || {
			"code" : "Undefined",
			"error" : "Operation Failed"
		};

		Alloy.Globals.UI.alert({
			"title" : "Error " + jReply.code,
			"message" : jReply.error,
			"buttons" : [{
				"title" : "Ok",
				"cbFunc" : function() {
					moreAction && moreAction(jReply);
				}
			}]
		});
	};
}

function interceptSuccess(moreAction) {
	return function() {
		Alloy.Globals.UI.actInd.hide();
		var jReply = Alloy.Globals.utils.parseJSON(this.responseText);
		if (jReply) {
			moreAction && moreAction(jReply);
		} else {
			Alloy.Globals.UI.actInd.hide();
		}
	};
}

var defaults = {
	onload : function(e) {
		Ti.API.info("Done");
	},
	timeout : 20000,
	tracer : function(url, header, request) {
		Ti.API.info("$$$ Request URL ===> " + url);
		Ti.API.info("$$$ Request Data ===> " + JSON.stringify(request));
		Ti.API.info("$$$ Request Header ===> " + JSON.stringify(header));
	},
	isJSON : true
};

module.exports = function(args) {
	var xhr = null;
	var hdrs = {};
	var params = {};

	function init() {
		var whiteList = Alloy.Globals._.omit(args, "headers");
		params = Alloy.Globals._.extend(defaults, whiteList);
		params.onerror = interceptError(args.onerror);
		params.onload = interceptSuccess(args.onload);
		xhr = Titanium.Network.createHTTPClient(params);
		hdrs = Alloy.Globals._.extend({
			"X_VR_REST_API_KEY_V1" : "399C74494BA54417863650BCD2A418DA",
			"Content-Type" : "application/json"
		}, args.headers);
	}

	function send(requestData) {
		if (Alloy.Globals.utils.canUse("internet")) {
			xhr.open(params.type, params.url);
			if (hdrs) {
				for (var key in hdrs) {
					if (hdrs.hasOwnProperty(key)) {
						xhr.setRequestHeader(key, hdrs[key]);
					}
				}
			}
			defaults.tracer(params.url, hdrs, requestData);
			params.file && xhr.setFile(params.file);
			params.isJSON ? xhr.send(JSON.stringify(requestData)) : xhr.send(requestData);
		} else {
			alert(L("no_network"));
		}
	}

	function abort() {
		xhr.abort();
	}

	function getReadyState() {
		return xhr.readyState;
	}

	init();

	return {
		send : send,
		abort : abort,
		getReadyState : getReadyState
	};
};
