var conn = null;
var dbs = {
	"default" : "visitorRegistration"
};

exports.open = function(dbName) {
	var db = (dbName || dbs["default"]);

	try {
		conn = Titanium.Database.install(db + ".sqlite", db);
	} catch(e) {
		Ti.API.info("DB OPEN Failed [ERROR] : " + e);
	}

	if (conn !== null) {
		conn.execute("PRAGMA foreign_keys = ON");
	}
};

exports.execute = function(sql, args) {
	var resultSet;
	Ti.API.info("sql : " + sql + " [" + args + "]");
	if ( args instanceof Array) {
		args.unshift(sql);
		resultSet = Function.apply.call(conn.execute, conn, args);
	} else if (args == null) {
		resultSet = conn.execute(sql);
	} else {
		resultSet = conn.execute(sql, args);
	}

	if (resultSet == undefined) {
		return;
	}

	var items = [];
	var colNum = resultSet.fieldCount;

	while (resultSet.isValidRow()) {
		var obj = {};
		for (var i = 0; i < colNum; i++) {
			var colName = resultSet.fieldName(i).toLowerCase();
			obj[colName] = resultSet.field(i);
		}
		items.push(obj);
		resultSet.next();
	}
	resultSet.close();

	return items;
};

exports.close = function() {
	if (conn) {
		conn.close();
	}
};

exports.getRowsModified = function() {
	return conn.getRowsAffected();
};
