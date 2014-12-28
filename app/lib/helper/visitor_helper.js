var VisitorHandler = function() {

	//var request = ["passcode", "title", "first_name", "last_name", "visitor_type", "organization", "proof_of_id", "email", "contact", "purpose", "_id", "event_id", "sign_in_at", "sign_out_at"];
	var mandatoryAttr = ["first_name", "last_name", "event_id"];
	var details = ["passcode", "title", "first_name", "last_name", "visitor_type", "organization", "proof_of_id", "email", "contact", "purpose", "event_id", "sign_in_at", "sign_out_at"];
	var table = "visitors";

	/**
	 * @private
	 *
	 */
	function createVisitorModel(args) {
		var payload = args || {};
		payload["user_id"] = Alloy.Globals.UserHelper.fetchOnboardUser().get("id");
		return Alloy.createModel("visitor", payload);
	}

	function createVisitorCollection(args) {
		var payload = args || {};
		payload["user_id"] = Alloy.Globals.UserHelper.fetchOnboardUser().get("id");
		return Alloy.createCollection("visitor", payload);
	}

	/**
	 * @public
	 *
	 */
	function isVisitorValid(mVisitor) {
		var emptyAttr = "";
		var allHasValue = mandatoryAttr.every(function(attr) {
			var hasValue = !Alloy.Globals.utils.S.isBlank(mVisitor.get(attr));
			emptyAttr = attr;
			return hasValue;
		});
		if (allHasValue) {
			var email = mVisitor.get("email");
			if (!Alloy.Globals.utils.S.isBlank(email)) {
				if (Alloy.Globals.utils.isValid("email", email)) {
					return true;
				}
				emptyAttr = "email";
			} else {
				return true;
			}
		}

		alert(String.format(L("invalid"), L(emptyAttr)));
	}

	function hasVisitorGone(mVisitor) {
		return !Alloy.Globals.utils.S.isBlank(mVisitor.get("sign_out_at"));
	}

	function signOut(visitorId) {
		var mVisitor = fetchVisitorById(visitorId);
		mVisitor.set("sign_out_at", new Date().toISOString());
		mVisitor.set("synced", 0);
		mVisitor.save();

		return mVisitor.get("sign_out_at");
	}

	function fetchAllVisitor() {
		var cVisitor = createVisitorCollection();
		cVisitor.fetch({
			"query" : "SELECT * FROM visitors"
		});
		return cVisitor;
	}

	function fetchUnsyncedVisitor() {
		var cVisitor = createVisitorCollection();
		cVisitor.fetch({
			"query" : "SELECT * FROM visitors WHERE synced = '0'"
		});
		return cVisitor;
	}

	function fetchVisitorById(visitorId) {
		var mVisitor = createVisitorModel();
		mVisitor.fetch({
			"id" : visitorId
		});

		return mVisitor.get("passcode").length > 0 && mVisitor;
	}

	function fetchVisitorByDateRange(dayFrom, dayTo) {
		var cVisitor = createVisitorCollection();
		cVisitor.fetch({
			"query" : {
				"statement" : "SELECT * FROM visitors WHERE date(sign_in_at) BETWEEN ? AND ?",
				"params" : [dayFrom, dayTo]
			}
		});
		return cVisitor;
	}

	function fetchVisitorByPasscode(passcode) {
		var cVisitor = createVisitorCollection();

		cVisitor.fetch({
			"query" : {
				"statement" : "SELECT * FROM visitors WHERE passcode = ? AND date(sign_in_at) = date('now')",
				"params" : passcode
			}
		});

		if (cVisitor.length > 0) {
			return cVisitor.at(0);
		}
	}

	function isEventSet(mVisitor) {
		return !Alloy.Globals.utils.S.isBlank(mVisitor.get("event_id"));
	}

	function reset(mVisitor) {
		mVisitor.clear().set(mVisitor.defaults);
	}

	function syncVisitor(payload, auth_token) {
		var url = Alloy.CFG.SERVER_URL.BASE + "entry/{event_id}/single/creates.json";
		var paramedURL = Alloy.Globals.utils.parameterize(url, [payload.eventId]);
		var xhr = new Alloy.Globals.XHR({
			onload : payload.onload,
			onerror : payload.onerror,
			type : "POST",
			url : paramedURL,
			headers : {
				"X_VR_AUTH_TOKEN" : auth_token
			}
		});
		xhr.send({
			"vr_singles" : payload.visitors
		});
	}

	function persistVisitor(mVisitor) {
		mVisitor.set({
			"sign_in_at" : new Date().toISOString()
		});
		createVisitorModel(mVisitor.toJSON()).save();
	}

	/*
	 * internal helper functions
	 */
	function toJSON(cVisitor) {
		return cVisitor.map(function(mVisitor) {
			!mVisitor.get("_id") && mVisitor.unset("_id");
			mVisitor.unset("user_id");
			return mVisitor.toJSON();
		});
	}

	function useHostId(visitorGroup) {
		var eventHelper = require("helper/event_helper");
		var newJson = {};

		for (var key in visitorGroup) {
			if (visitorGroup.hasOwnProperty(key)) {
				newJson[eventHelper.fetchEveAttrById(key, "_id")] = visitorGroup[key];
			}
		}

		return newJson;
	}

	function createReadableJson(mVisitor) {
		var eventHelper = require("helper/event_helper");
		var newJson = {};

		details.forEach(function(attr) {
			var val = "";
			if (attr === "sign_in_at" || attr === "sign_out_at") {
				val = Alloy.Globals.utils.formatDateOrTime(mVisitor.get(attr), "DATE|TIME", true);
			} else if (attr === "event_id") {
				val = eventHelper.fetchEveAttrById(mVisitor.get("event_id"), "name");
			}
			newJson[attr] = val || mVisitor.get(attr);
		});

		return newJson;
	}

	return {
		syncVisitor : syncVisitor,
		createVisitorCollection : createVisitorCollection,
		createReadableJson : createReadableJson,
		fetchAllVisitor : fetchAllVisitor,
		fetchVisitorById : fetchVisitorById,
		fetchVisitorByPasscode : fetchVisitorByPasscode,
		fetchUnsyncedVisitor : fetchUnsyncedVisitor,
		fetchVisitorByDateRange : fetchVisitorByDateRange,
		createVisitorModel : createVisitorModel,
		isVisitorValid : isVisitorValid,
		hasVisitorGone : hasVisitorGone,
		isEventSet : isEventSet,
		persistVisitor : persistVisitor,
		reset : reset,
		signOut : signOut,
		useHostId : useHostId,
		toJSON : toJSON
	};

}();

module.exports = VisitorHandler;
