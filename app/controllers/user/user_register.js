var global = (function(arg) {

	return {
		from : {
			onClose : arg.onClose,
			passInputCheck : arg.passInputCheck
		},
		anim : require("alloy/animation"),
		newUser : Alloy.Globals.UserHelper.createUserModel(),
		CacheHelper : require("helper/cache_helper")
	};
})(arguments[0] || args);

function onSubmit() {
	if (global.from.passInputCheck($.email, $.first_name, $.surname)) {
		register();
	}
}

function onChosenOption(selected) {
	$.intended_usage.value = selected;
	if ($.intended_usage.value === "Commercial") {
		global.anim.fadeIn($.company, 1000, function() {
			$.company.opacity = 1;
		});
	} else if ($.intended_usage.value === "Private") {
		global.anim.fadeOut($.company, 1000, function() {
			$.company.opacity = 0;
		});
	}
}

function showSignInWin() {
	$.index.close({
		transition : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT
	});
}

function onOptionBtnClick() {
	var popover = Alloy.createController("popover", {
		"children" : Alloy.CFG.INTENDED_USAGE,
		"onTableClick" : onChosenOption,
		"title" : "Intended Usage"
	});
	popover.show();
}

function register() {
	Alloy.Globals.UI.actInd.show("Please wait...");

	global.newUser.set({
		"email" : $.email.value,
		"first_name" : $.first_name.value,
		"surname" : $.surname.value,
		"company" : $.company.value,
		"intended_usage" : $.intended_usage.value
	});

	global.newUser.register({
		onload : onRegisterSuccess,
		onerror : onRegisterFailure
	});

	//test purpose
	//onRegisterSuccess();
}

function onRegisterFailure(e) {
	Alloy.Globals.UI.actInd.hide();
	global.CacheHelper.remove("TEMP_USR");
}

function onRegisterSuccess() {
	Alloy.Globals.UI.actInd.hide();

	global.CacheHelper.setData("TEMP_USR", global.newUser, true);

	Alloy.Globals.UI.alert({
		"title" : "Please Note",
		"message" : "Account created, password sent to " + global.newUser.get("email"),
		"buttons" : [{
			"title" : "Ok",
			"cbFunc" : function() {
				showSignInWin();
			}
		}]
	});
}

function onWinClose() {
	global.from.onClose && global.from.onClose(getRequiredUser());
}

function getRequiredUser() {
	var onBoardUsr = Alloy.Globals.UserHelper.fetchOnboardUser();
	var tempUsr = global.CacheHelper.getData("TEMP_USR");
	if (tempUsr) {
		return tempUsr;
	} else if (onBoardUsr) {
		return onBoardUsr;
	} else {
		return Alloy.Globals.UserHelper.createUserModel();
	}
}

//******************************************* Test ************************************************
function x(c) {
	Ti.API.info(JSON.stringify(c));
}