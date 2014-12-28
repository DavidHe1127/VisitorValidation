exports.definition = {
	config : {
		"columns" : {
			"id" : "INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE",
			"name" : "TEXT",
			"create_at" : "TEXT",
			"start_at" : "TEXT",
			"end_at" : "TEXT",
			"host" : "TEXT",
			"note" : "TEXT",
			"_id" : "TEXT",
			"code" : "TEXT",
			"contact" : "TEXT",
			"type" : "TEXT",
			"synced" : "INTEGER",
			"user_id" : "INTEGER NOT NULL FOREIGN KEY(user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE"
		},
		"defaults" : {
			"id" : "",
			"name" : new Date().toLocaleDateString(),
			"create_at" : new Date().toISOString(),
			"start_at" : new Date().toISOString(),
			"end_at" : new Date().toISOString(),
			"host" : "",
			"note" : "",
			"_id" : "",
			"code" : "N/A",
			"contact" : "",
			"synced" : "0",
			"user_id" : "",
			"type" : "custom"
		},
		"adapter" : {
			"type" : "sql",
			"collection_name" : "events",
			"idAttribute" : "id",
			"db_name" : "visitorRegistration",
			"db_file" : "/visitorRegistration.sqlite"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			isEveValid : function(mandatoryAttr) {
				var eachAttr = "";
				var self = this;

				var allHasValue = mandatoryAttr.every(function(name) {
					var hasValue = !Alloy.Globals.utils.S.isBlank(self.get(name));
					eachAttr = name;
					return hasValue;
				});
				if (!allHasValue) {
					return eachAttr;
				}
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
			},
			getDetailByColumn : function(attr) {
				var c = this;
				var table = c.config.adapter.collection_name;
				c.fetch({
					"query" : "SELECT * FROM " + table
				});
				alert("new push");

				var set = c.map(function(m) {
					return m.get(attr);
				});

				return set;
			}
		});

		return Collection;
	}
};
