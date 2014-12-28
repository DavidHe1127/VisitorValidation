module.exports = function() {

	var eventHelper = require("helper/event_helper");
	var visitorHelper = require("helper/visitor_helper");

	Ti.App.addEventListener("data_manager:syncvisitor", syncOfflineVisitor);

	function deleteExpiredData() {
		var db = require("db");
		db.open();
		db.execute("DELETE FROM visitors WHERE date(sign_in_at) <= date('now', '-3 day')");
		db.execute("DELETE FROM events WHERE date(create_at) <= date('now', '-3 day')");
		db.close();
	}

	(function() {
		var timer = require("ti.mely").createTimer();
		timer.addEventListener("onIntervalChange", syncOfflineData);
		timer.start({
			interval : 3600 * 1000,
			debug : true
		});
	})();

	function syncOfflineData() {
		deleteExpiredData();

		if (Alloy.Globals.utils.canUse("internet")) {
			syncOfflineEvent(syncOfflineVisitor);
		}
	}

	function syncOfflineEvent(follower) {
		var cEvent = eventHelper.fetchUnsyncedEvent();
		if (cEvent.length > 0) {
			tryNextOne(0);
		} else {
			follower();
		}

		function tryNextOne(i) {
			if (cEvent.length === 0) {
				Ti.App.fireEvent("data_manager:syncvisitor", {});
				return;
			}

			var mEvent = cEvent.pop();

			eventHelper.createEvent({
				"mEvent" : mEvent,
				"onload" : function(reply) {
					mEvent.save({
						"_id" : reply["_id"],
						"synced" : 1
					});

					tryNextOne(i++);
				},
				"onerror" : function() {

				}
			}, Alloy.Globals.UserHelper.fetchOnboardUser().get("auth_token"));
		}

	}

	function syncOfflineVisitor() {
		var cVisitor = visitorHelper.fetchUnsyncedVisitor();
		var events = [];

		if (cVisitor.length > 0) {
			var visitorGroup = visitorHelper.useHostId(Alloy.Globals._.groupBy(visitorHelper.toJSON(cVisitor), "event_id"));
			//keys is an array of event_id
			events = Object.keys(visitorGroup);
			tryNextOne();
		}

		function tryNextOne() {
			if (events.length === 0) {
				return;
			}
			var eventId = events.pop();
			var visitors = visitorGroup[eventId];

			visitorHelper.syncVisitor({
				"eventId" : eventId,
				"visitors" : visitors,
				"onload" : function(reply) {
					var result = parseResult(reply);
					if (result) {
						visitors.forEach(function(visitor, index) {
							visitorHelper.createVisitorModel(visitor).save({
								"_id" : result[index]["_id"],
								"synced" : 1
							});
						});
					}
					tryNextOne();
				},
				"onerror" : function() {

				}
			}, Alloy.Globals.UserHelper.fetchOnboardUser().get("auth_token"));
		}

	}

	function parseResult(reply) {
		if (reply.hasOwnProperty("results") && reply.results.length > 0) {
			return reply["results"];
		}
	}

	return {
		deleteExpiredData : deleteExpiredData,
		syncOfflineData : syncOfflineData
	};

}();

