var EventHandler = function() {
	var request = ["code", "name", "create_at", "start_at", "end_at", "host", "contact", "note"],
	    mandatoryAttr = ["name"];

	/**
	 * @private
	 *
	 */
	function createEventModel(args) {
		var payload = args || {};
		payload["user_id"] = Alloy.Globals.UserHelper.fetchOnboardUser().get("id");
		return Alloy.createModel("event", payload);
	}

	function createEventCollection(args) {
		return Alloy.createCollection("event", args || {});
	}

	function buildxData(mEvent) {
		var xData = {};
		var json = mEvent.toJSON();

		request.forEach(function(attr) {
			if (attr === "create_at") {
				xData["created_at"] = Alloy.Globals.utils.formatDateOrTime(mEvent.get(attr), "DATE");
			} else if (attr === "start_at") {
				xData["start_time"] = Alloy.Globals.utils.formatDateOrTime(mEvent.get(attr), "TIME");
			} else if (attr === "end_at") {
				xData["end_time"] = Alloy.Globals.utils.formatDateOrTime(mEvent.get(attr), "TIME");
			} else {
				xData[attr] = mEvent.get(attr);
			}
		});

		return xData;
	}

	function getTodayEvent() {
		var cEvent = createEventCollection();
		cEvent.fetch({
			"query" : {
				"statement" : "SELECT * FROM events WHERE name = ?",
				"params" : new Date().toLocaleDateString()
			}
		});
		if (cEvent.length === 1) {
			return cEvent.at(0);
		}
	}

	/**
	 * @public
	 */
	function getRequestAttr() {
		return request;
	}

	function fetchUnsyncedEvent() {
		var cEvent = createEventCollection();
		cEvent.fetch({
			"query" : "SELECT * FROM events WHERE synced = '0'" 
		});
		return cEvent;
	}

	function isTodayEventSynced(mEvent) {
		return mEvent.get("synced") == 1;
	}

	function createTodayEveIfNotExist() {
		var todayEvent = getTodayEvent();
		if (!todayEvent) {
			var newTodayEvent = createEventModel();
			newTodayEvent.save();
			return newTodayEvent;
		} else {
			return todayEvent;
		}
	}

	function fetchEveIdByName(name) {
		var cEvent = createEventCollection();
		cEvent.fetch({
			"query" : {
				"statement" : "SELECT * FROM events WHERE name = ?",
				"params" : name
			}
		});
		if (cEvent.length === 1) {
			return cEvent.at(0).get("id");
		}
	}

	function fetchEveAttrById(id, attr) {
		var mEvent = createEventModel();
		mEvent.fetch({
			"id" : id
		});

		return mEvent.get(attr);
	}

	function isEveValid(mEvent) {
		var errorCode = mEvent.isEveValid(mandatoryAttr);
		if (errorCode) {
			alert(String.format(L("missing_input"), L(errorCode)));
		} else {
			return true;
		}
	}

	function createEvent(args, auth_token) {
		var url = Alloy.CFG.SERVER_URL.BASE + "entry/create";

		var xhr = new Alloy.Globals.XHR({
			onload : args.onload,
			onerror : args.onerror,
			type : "POST",
			url : url,
			headers : {
				"X_VR_AUTH_TOKEN" : auth_token
			}
		});

		xhr.send(buildxData(args.mEvent));
	}

	function fetchEventList() {
		var cEvent = createEventCollection();

		cEvent.fetch({
			"query" : "SELECT * FROM events"
		});

		return cEvent;
	}
	
	function fetchUsableEvent() {
		
	}

	return {
		isTodayEventSynced : isTodayEventSynced,
		createTodayEveIfNotExist : createTodayEveIfNotExist,
		isEveValid : isEveValid,
		createEvent : createEvent,
		createEventModel : createEventModel,
		fetchEveIdByName : fetchEveIdByName,
		fetchEventList : fetchEventList,
		fetchUnsyncedEvent : fetchUnsyncedEvent,
		fetchEveAttrById : fetchEveAttrById,
		getRequestAttr : getRequestAttr
	};

}();

module.exports = EventHandler;
