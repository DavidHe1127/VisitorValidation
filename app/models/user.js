exports.definition = {
	config : {
		"columns" : {
			"id" : "INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE",
			"first_name" : "TEXT",
			"surname" : "TEXT",
			"email" : "TEXT",
			"company" : "TEXT",
			"intended_usage" : "TEXT",
			"auth_token" : "TEXT",
			"sign_out_at" : "TEXT",
			"_id" : "TEXT"
		},
		"defaults" : {
			"id" : "",
			"first_name" : "",
			"surname" : "",
			"email" : "",
			"company" : "",
			"intended_usage" : "",
			"auth_token" : "",
			"sign_out_at" : "",
			"_id" : ""
		},
		"adapter" : {
			"type" : "sql",
			"collection_name" : "users",
			"idAttribute" : "id",
			"db_name" : "visitorRegistration",
			"db_file" : "/visitorRegistration.sqlite"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			register : function(args) {
				var attrList = ["first_name", "surname", "email", "company", "intended_usage"], request = Alloy.Globals._.pick(this.toJSON(), attrList), url = Alloy.CFG.SERVER_URL.BASE + "user/create";

				var xhr = new Alloy.Globals.XHR({
					onload : args.onload,
					onerror : args.onerror,
					type : "POST",
					url : url
				});

				xhr.send(request);
			},
			signIn : function(args) {
				var url = Alloy.CFG.SERVER_URL.BASE + "tokens/create";

				var xhr = new Alloy.Globals.XHR({
					onload : args.onload,
					onerror : args.onerror,
					type : "POST",
					url : url
				});

				xhr.send(args.xData);
			},
			signOut : function(args) {
				var url = Alloy.CFG.SERVER_URL.BASE + "tokens/destroy";

				var xhr = new Alloy.Globals.XHR({
					onload : args.onload,
					onerror : args.onerror,
					type : "POST",
					url : url,
					headers : {
						"X_VR_AUTH_TOKEN" : this.get("auth_token")
					}
				});

				xhr.send();
			},
			getFullName : function() {
				var m = this;
				return m.get("first_name") + ' ' + m.get("surname");
			},
			resetUponQuit : function() {
				var m = this;
				m.set({
					"sign_out_at" : Alloy.Globals.moment().format("MMMM Do YYYY hh:mm:ss"),
					"_id" : '',
					"auth_token" : ''
				});
				m.save();
			},
			exhibitionAttr : ["first_name", "surname", "email", "company", "intended_usage"]
		});

		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
			getOnboardUser : function() {
				var c = this;
				var table = c.config.adapter.collection_name;
				c.fetch({
					"query" : "SELECT * FROM " + table + " WHERE auth_token <> ''"
				});

				return c.at(0);
			},
			getLastActiveUser : function() {
				var c = this;
				var table = c.config.adapter.collection_name;
				c.fetch({
					"query" : "SELECT * FROM " + table + " WHERE sign_out_at IN (SELECT MAX(sign_out_at) FROM " + table + ")"
				});

				return c.at(0);
			},
			ifExist : function(email) {
				var c = this;
				var table = c.config.adapter.collection_name;
				c.fetch({
					"query" : {
						"statement" : ["SELECT * FROM", table, "WHERE email = ?"].join(' '),
						"params" : [email]
					},
					"success" : function(e) {
					},
					"error" : function(e) {
					}
				});

				if (c.length > 0) {
					return c.at(0).get("id");
				}
			}
		});

		return Collection;
	}
};
