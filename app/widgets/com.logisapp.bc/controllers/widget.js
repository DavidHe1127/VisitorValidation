// var benCoding = {
	// PDF : require("bencoding.pdf")
// };

/**
 * @public
 *
 * @param {object} visitor
 *        {string} visitor.passcode
 * 		  {string} visitor.organization
 * 		  {string} visitor.first_name
 * 		  {string} visitor.last_name
 * 		  {string} visitor.visitor_type
 *        {string} visitor.purpose
 */
$.init = function(visitor) {
	if (visitor) {
		$.barcode.text = $.barcode.barcode = visitor["passcode"];
		$.type.text = visitor["visitor_type"];
		$.company.text = visitor["organization"];
		$.name.text = visitor["first_name"] + ' ' + visitor["last_name"];
		$.datetime.text = visitor["sign_in_at"];
		$.purpose.text = visitor["purpose"];
	}
};

$.generate = function() {
	$.wrapper.toImage(function(e) {
		try {
			saveImgToFile(e.blob);
			//buildPDF(e.blob);
		} catch(e) {
			alert(e);
		}
	}, true);
};

// function buildPDF(imgBlob) {
	// var pdfBlob = benCoding.PDF.createConverters().convertImageToPDF(imgBlob, 150);
	// var pdfFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "new_visitor.pdf");
	// if (pdfFile.exists()) {
		// pdfFile.deleteFile();
	// }
	// pdfFile.write(pdfBlob);
// }

function saveImgToFile(imgBlob) {
	var target = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "new_visitor.png");
	if (target.exists()) {
		target.deleteFile();
	}
	target.write(imgBlob);
}

function loadPasscode() {
	Ti.App.fireEvent("app:barcode", {
		"barcode" : $.barcode.barcode
	});
}