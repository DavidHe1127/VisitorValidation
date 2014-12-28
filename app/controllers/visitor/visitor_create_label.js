var global = (function(args) {
	
	$.vLabel.init(args.visitor);
	
	return {
		"payload" : {
			"onClose" : args.onClose
		}
	};

})(arguments[0] || {});


function onLNavBtnClick() {
	$.navWin.close();
}

function onRNavBtnClick() {
	alert("No purchased printer...");
}

function onWinClose() {
	global.payload.onClose && global.payload.onClose();
}
