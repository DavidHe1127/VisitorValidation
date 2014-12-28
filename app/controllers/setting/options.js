var args = arguments[0] || {};

$.index.setTitle(L(args.type));

var OptionHelper = require("helper/option_helper");
var optionHelper = new OptionHelper(args.type);

$.optionList.init({
	"name" : L(args.type),
	"list" : optionHelper.buildOptionList(),
	"onDelete" : function(item) {
		optionHelper.remove(item);
	}
});

function onRNavBtnClick() {
	$.optionList.addNew(function(item) {
		optionHelper.add(item);
	});
}

function onLNavBtnClick() {
	$.index.close();
}