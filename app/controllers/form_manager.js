var args = arguments[0] || {};
var focusableTfs = [];
var allTfs = [];
/*
 **
 * 
 * @param {array} param - sections {sectionTitle : "section 1", rows : [see below]}
 *
 * ============================= row =====================================================
 * @param {string} hintText - The color of car
 * @param {array} options - ['Mr.', 'Mrs.', 'Miss']
 * @param {string} timestampType - 'DATE'/'TIME'/'DATE_TIME'
 * @param {string} id - row control id
 * @param {boolean} selector - true/false true -> if true use either options/timestampType
 * @param {boolean} disableEditing - true/false
 * =======================================================================================
 *
 * Sample row Input
 * [{
 * hintText : "Name",
 * id : "name"
 * },
 * {
 * 	hintText : "Title",
 *  options : ["Mr.", "Mrs.", "Miss"],
 *  selector : true,
 *  id : "title"
 * },
 * {
 * 	hintText : "Start Time",
 *  timestampType : "DATE_TIME",
 *  selector : true,
 *  id : "start time"
 * }]
 *
 */
exports.init = function(param) {
	if (isPayloadValid(param)) {
		var allSections = param.map(function(sectionData) {
			var section = buildTableSection(sectionData.sectionTitle);
			sectionData.rows.forEach(function(rowData) {
				if (isRowParamValid(rowData)) {
					var tf = buildTextfield(rowData);
					if (tf.editable) {
						focusableTfs.push(rowData.id);
					}
					var row = buildRow(rowData);
					row.add(tf);
					allTfs.push(tf);
					section.add(row);
				}
			});
			return section;
		});

		$.form.setSections(allSections);
	}
};

function isRowParamValid(rowParam) {
	if (rowParam.hasOwnProperty("options") && rowParam.hasOwnProperty("timestampType")) {
		throw "Options OR timestampType, CANNOT set both";
	} else {
		return true;
	}
}

function isPayloadValid(payload) {
	return payload && Alloy.Globals._.isArray(payload) && payload.length > 0;
}

function buildRow(rowData) {
	return $.UI.create("TableViewRow", {
		"backgroundColor" : "#FFFFFF",
		"selector" : rowData.selector,
		"options" : rowData.options,
		"timestampType" : rowData.timestampType,
		"hint" : rowData.hintText
	});
}

function buildTableSection(title) {
	return $.UI.create("TableViewSection", {
		"headerTitle" : title || ""
	});
}

function buildTextfield(rowControl) {
	var tf = $.UI.create("TextField", {
		"classes" : ["input"],
		"id" : rowControl.id,
		"hintText" : rowControl.hintText,
		"editable" : !rowControl.disableEditing
	});

	tf.addEventListener("return", onReturn);
	
	return tf;
}

function onTableClick(e) {
	var showOptions = e.row.selector && e.row.options;
	var showDateTime = e.row.selector && e.row.timestampType;

	if (showOptions) {
		showPopover({
			"children" : e.row.options,
			"onTableClick" : function(selected) {
				e.source.value = selected;
			},
			"title" : e.row.hint
		});
	} else if (showDateTime) {
		if (OS_IOS) {
			var datePickerWin = Alloy.createController("ios_date_time_picker", {
				"title" : e.row.hint,
				"cbFunc" : function(cbArgs) {
					e.source.value = cbArgs.dateTimeStr;
				},
				"type" : e.row.timestampType
			}).getView().open();
		}
	}
}

function showPopover(payload) {
	var popover = Alloy.createController("popover", payload);
	popover.show();
}

function onReturn(e) {
	var currIndex = focusableTfs.indexOf(e.source.id);

	if (focusableTfs[currIndex + 1]) {
		if (nextTfId) {
			$[nextTfId].focus();
		} else {
			//last tf
			e.source.blur();
		}
	}
}

exports.reset = function() {
	allTfs.forEach(function(tf) {
		tf.value = "";
	});
}; 