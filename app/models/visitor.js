exports.definition = {
	config : {
		"columns" : {
			"id" : "INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE",
			"passcode" : "TEXT",
			"title" : "TEXT",
			"last_name" : "TEXT",
			"first_name" : "TEXT",
			"visitor_type" : "TEXT",
			"organization" : "TEXT",
			"proof_of_id" : "TEXT",
			"purpose" : "TEXT",
			"sign_in_at" : "TEXT",
			"sign_out_at" : "TEXT",
			"contact" : "TEXT",
			"email" : "TEXT",
			"synced" : "INTEGER",
			"_id" : "TEXT",
			"event_id" : "INTEGER NOT NULL FOREIGN KEY(event_id) REFERENCES events(id) ON UPDATE CASCADE ON DELETE CASCADE",
			"user_id" : "INTEGER NOT NULL FOREIGN KEY(user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE"
		},
		"defaults" : {
			"id" : "",
			"passcode" : "",
			"title" : "",
			"last_name" : "",
			"first_name" : "",
			"visitor_type" : "",
			"organization" : "",
			"proof_of_id" : "",
			"contact" : "",
			"email" : "",
			"purpose" : "",
			"sign_in_at" : "",
			"sign_out_at" : "",
			"synced" : "0",
			"_id" : "",
			"event_id" : "",
			"user_id" : ""
		},
		"adapter" : {
			"type" : "sql",
			"collection_name" : "visitors",
			"idAttribute" : "id",
			"db_name" : "visitorRegistration",
			"db_file" : "/visitorRegistration.sqlite"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			getFullName : function() {
				return this.get("first_name") + " " + this.get("last_name");
			}
		});
		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
			fetch : function(params, notByUser) {
				if (!notByUser) {
					Alloy.Globals.utils.appendUsrId(params);
				}

				Backbone.Collection.prototype.fetch.call(this, params);
			}
		});
		return Collection;
	}
};
