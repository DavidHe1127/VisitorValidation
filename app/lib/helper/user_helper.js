var UserHelper = function() {

	function createUserCollection(args) {
		return Alloy.createCollection("user", args || {});
	}

	function createUserModel(args) {
		return Alloy.createModel("user", args || {});
	}

	function fetchLastActiveUser(args) {
		var cUser = createUserCollection(args);
		return cUser.getOnboardUser() || cUser.getLastActiveUser() || null;
	}

	function fetchOnboardUser() {
		var cUser = createUserCollection();
		return cUser.getOnboardUser();
	}

	function ifUserExist(email) {
		var tempCUser = createUserCollection();
		return tempCUser.ifExist(email);
	}

	function saveUser(details) {
		createUserModel(details).save();
	}

	function isUserOnboard(user) {
		return user.get && !Alloy.Globals.utils.S.isBlank(user.get("auth_token"));
	}

	function fetchUserByEmail(email) {
		var cUser = createUserCollection();
		cUser.fetch();
		return cUser.where({
		"email" : email
		})[0];
	}

	function buildOnboardUserSqlParam() {
		return "user_id = " + fetchOnboardUser().get("id");
	}

	/**
	 * @desc functions below are used to destroy any cached data being held by this singleton
	 */
	function getNS() {
		return "user";
	}

	function GC() {
	}

	return {
		createUserModel : createUserModel,
		buildOnboardUserSqlParam : buildOnboardUserSqlParam,
		fetchLastActiveUser : fetchLastActiveUser,
		fetchOnboardUser : fetchOnboardUser,
		fetchUserByEmail : fetchUserByEmail,
		ifUserExist : ifUserExist,
		isUserOnboard : isUserOnboard,
		saveUser : saveUser,
		getNS : getNS,
		GC : GC
	};

}();

module.exports = UserHelper;
