var args = arguments[0] || {};

if (Alloy.Globals._.isArray(args.children)) {
	var dataLst = args.children.map(function(child) {
		return {
			"title" : child
		};
	});

	$.popupLst.setData(dataLst);
}

$.popupLst.addEventListener("click", function(e) {
	$.popover.hideMe();
	args.onTableClick && args.onTableClick(e.row.title);
});

exports.show = function() {
	$.popover.init({
		title : args.title,
		disableBackshadeClose : false,
		view : $.popupLst
	});
	$.popover.showMe();
};

