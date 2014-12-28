var global = (function(arg) {

	$.index.setTitle(arg.selectedEvent.get("name"));
	
	var eventHelper = require("helper/event_helper");
	var data = [];
	var visibleAttr = eventHelper.getRequestAttr();

	visibleAttr.forEach(function(attr) {
		data.push({
			"properties" : $.createStyle({
				"classes" : ["ListViewItemDetail"]
			}),
			"title" : {
				"text" : L(attr)
			},
			"value" : {
				"text" : function() {
					if (attr === "start_at" || attr === "end_at") {
						return Alloy.Globals.utils.formatDateOrTime(arg.selectedEvent.get("create_at"), "TIME", true);
					} else if (attr === "create_at") {
						return Alloy.Globals.utils.formatDateOrTime(arg.selectedEvent.get("create_at"), "DATE", true);
					} else {
						return arg.selectedEvent.get(attr);
					}
				}()
			}
		});
	});

	$.lstSec.setItems(data);

})(arguments[0] || {});

function onLNavBtnClick() {
	$.index.close();
}
