var args = arguments[0] || {};

$.emailDialog.subject = args.subject || "Visitor Sign-in";
$.emailDialog.toRecipients = [Alloy.Globals.Setting.get("email")];
$.emailDialog.barColor = "#E5E4E2";

if (args.attachment) {
	$.emailDialog.addAttachment(args.attachment);
}

$.emailDialog.addEventListener("complete", function(e) {
	if (e.result === e.source.SENT) {
		alert("Email sent");
		args.onComplete && args.onComplete();
	}
});

exports.open = function() {
	$.emailDialog.open();
};
