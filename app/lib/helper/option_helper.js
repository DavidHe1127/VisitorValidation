function OptionHelper(type) {
	this.type = type;
	this.defaults = Alloy.Globals.Setting.getDefaults(this.type);
}

OptionHelper.prototype.add = function(item) {
	var curr = this.fetchAll();
	if (this.notExist(item)) {
		curr.push(item);
		Alloy.Globals.Setting.set(this.type, curr);
	}
};

OptionHelper.prototype.fetchAll = function() {
	return Alloy.Globals.Setting.get(this.type);
};

OptionHelper.prototype.buildOptionList = function() {
	var options = this.fetchAll();
	var self = this;

	return options.map(function(option) {
		return {
			"title" : option,
			"removable" : self.canRemove(option)
		};
	});
};

OptionHelper.prototype.remove = function(item) {
	var curr = this.fetchAll();
	var index = curr.indexOf(item);
	if (index > -1) {
		curr.splice(index, 1);
		Alloy.Globals.Setting.set(this.type, curr);
	}
};

OptionHelper.prototype.canRemove = function(item) {
	return !(this.defaults.indexOf(item) > -1);
};

OptionHelper.prototype.notExist = function(item) {
	return this.fetchAll().indexOf(item) === -1;
};

module.exports = OptionHelper;
