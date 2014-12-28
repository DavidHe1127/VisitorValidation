var global = (function() {
	var mUser = Alloy.Globals.UserHelper.fetchOnboardUser();

	$.index.setTitle(mUser.getFullName());

	var data = [];

	mUser.exhibitionAttr.forEach(function(attr) {
		data.push({
			"properties" : $.createStyle({
				"classes" : ["ListViewItemDetail"]
			}),
			"title" : {
				"text" : L(attr)
			},
			"value" : {
				"text" : mUser.get(attr)
			}
		});
	});

	$.lstSec.setItems(data);

	return {
		mUser : mUser
	};

})();

function onLNavBtnClick() {
	$.index.close();
}

function onRNavBtnClick() {
	Alloy.Globals.UI.actInd.show("Please wait...");

	global.mUser.signOut({
		onload : function(reply) {
			Alloy.Globals.UI.actInd.hide();
			global.mUser.resetUponQuit();
			Alloy.Globals.UI.alert({
				"title" : "Operation Done",
				"message" : reply.message,
				"buttons" : [{
					"title" : "Ok",
					"cbFunc" : function() {
						Alloy.Globals.tabGroup.close();
					}
				}]
			});
		},
		onerror : function(reply) {
			if (reply.code == 403) {
				Alloy.Globals.tabGroup.close();
			}
		}
	});
}
