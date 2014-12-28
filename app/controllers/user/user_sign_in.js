var global = (function(arg) {
	var mUser = Alloy.Globals.UserHelper.fetchLastActiveUser() || Alloy.createModel("user");

	return {
		anim : require("alloy/animation"),
		CacheHelper : require("helper/cache_helper"),
		mUser : mUser
	};

})(arguments[0] || {});

/**
 * UI event handler
 *
 */
function updateFormDetail(mUser) {
	if (mUser) {
		var email = mUser.get("email");

		if (email.trim().length === 0) {
			resetFormDetails();
		} else {
			$.email.setValue(email);
			$.usr_name.setText(mUser.getFullName());
			focusWithDelay($.password);
		}
	}
}

function resetFormDetails() {
	$.email.value = "";
	$.password.value = "";
	$.usr_name.text = "Welcome";
	focusWithDelay($.email);
}

function onSignInClick() {
	if (passInputCheck($.email, $.password)) {
		Alloy.Globals.UI.actInd.show("Please wait...");
		global.mUser.signIn({
			onload : onUsrSignInSuccess,
			xData : {
				"password" : function() {
					if (ENV_DEV) {
						return setPassword($.email.value);
					} else if (DIST_ADHOC || ENV_TEST) {
						return $.password.value;
					}
				}(), /*setPassword($.email.value)*/
				"email" : $.email.value
			}
		});
	}
}

function onWinOpen() {
	Ti.App.addEventListener("PORTAL_WIN_REFOCUS", onWinRefocus);
	updateFormDetail(global.mUser);
}

function onWinRefocus() {
	updateFormDetail(global.mUser);
}

function onWinClose() {
	Ti.App.removeEventListener("PORTAL_WIN_REFOCUS", onWinRefocus);
}

function showSignUpWin() {
	if (OS_IOS) {
		blur();

		Alloy.createController("user/user_register", {
			"onClose" : onUsrSignUpWinClose,
			"passInputCheck" : passInputCheck
		}).getView().open({
			"transition" : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
		});
	}
}

function blur() {
	$.email.blur();
	$.password.blur();
}

function onUsrSignUpWinClose(newUser) {
	if (newUser) {
		updateFormDetail(newUser);
	} else {
		focusWithDelay($.email);
	}
}

function onEmailBlur(e) {
	var input = e.source.value.trim();
	var savedUser = Alloy.Globals.UserHelper.fetchUserByEmail(input);

	if (savedUser) {
		$.usr_name.text = savedUser.getFullName();
	} else {
		$.usr_name.text = "Welcome";
	}
}

function openMain() {
	Alloy.createController("main", {}).getView().open();
}

/*
 * business logic event handler
 */
function onUsrSignInSuccess(reply) {
	global.mUser.set(reply);
	var userId = Alloy.Globals.UserHelper.ifUserExist(reply.email);
	if (userId) {
		global.mUser.save({
			"id" : userId
		});
	} else {
		Alloy.Globals.UserHelper.saveUser(reply);
	}
	global.CacheHelper.remove("TEMP_USR");
	Alloy.Globals.UI.actInd.hide();
	openMain();
}

function focusWithDelay(textfield) {
	if (!$.signInPanel.visible) {
		$.signInPanel.show();
	}

	setTimeout(function() {
		textfield.focus();
	}, 500);
}

function passInputCheck() {
	var checkList = Alloy.Globals.utils.arrayPayload(arguments);
	var isPass = true;

	checkList.forEach(function(item) {
		if (isPass) {
			if (item.id && item.id === "email") {
				if (!Alloy.Globals.utils.isValid("email", item.value)) {
					alert("Invalid email address");
					isPass = false;
				}
			} else {
				if (Alloy.Globals.utils.S.isBlank(item.value)) {
					alert(item.hintText + " cannot be empty");
					isPass = false;
				}
			}
		}
	});

	return isPass;
}

//********************************************* Test *******************************************************************
/*
 * sign in reply
 *
 * "{\"_id\":\"53d3080f72c33c544b000001\",\"account_verified\":true,\"au
 th_token\":\"6a0260bf4507dae68bc9dedd563c1c20\",\"company\":\"LogisApp\",\"creat
 ed_at\":\"2014-07-26T01:44:47Z\",\"email\":\"jialhe85@gmail.com\",\"first_name\"
 :\"David\",\"intended_usage\":\"Private\",\"role\":\"basic\",\"surname\":\"He\",
 \"updated_at\":\"2014-08-02T12:08:11Z\",\"verification_code\":\"\"}"
 *
 *
 * var newEvent = {
 "_id": "543dd19d958dcaba70000002",
 "code": "SYS_DEF_DEV",
 "contact": "",
 "created_at": "2014-10-15T12:45:01+11:00",
 "date": "2014-10-15",
 "end_time": null,
 "host": "",
 "name": "SYS_DEF_DEV",
 "note": "",
 "start_time": null,
 "type": null,
 "updated_at": "2014-10-15T12:45:01+11:00",
 "vr_user_id": "53d3080f72c33c544b000001"
 };
 *
 */
function setPassword(email) {
	if (email === "jialhe85@gmail.com") {
		return "Ltq3dT";
	} else if (email === "tracyguan108@gmail.com") {
		return "DawKct";
	}
}