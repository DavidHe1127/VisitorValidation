var args = arguments[0] || {};
var duration = (OS_IOS) ? 200 : 1000;
var anim = require('alloy/animation');

//add child views to controller if they exist
if (args.children) {

	_.each(args.children, function(child) {
		// fix: https://jira.appcelerator.org/browse/TC-3583
		if (!child) {
			return;
		}

		$.contents.add(child);
	});
}

var disableBackshadeClose = false;
$.init = function(args) {
	if (!args)
		args = {};
	if (args.disableBackshadeClose)
		disableBackshadeClose = true;
	$.title.text = (args.title) ? args.title : '';
	if (args.showLeftNavButton) {
		$.leftnavbutton.text = (args.leftNavButtonTitle) ? args.leftNavButtonTitle : '';
		$.leftnavbutton.visible = true;
		$.leftnavbutton.addEventListener('click', function(e) {
			e.bubbles = false;
			e.cancelBubble = true;
			if (args && args.view && args.view.children) {
				var kids = args.view.children;
				if (kids && kids.length) {
					for (var i = 0, j = kids.length; i < j; i++) {
						try {
							kids[i].blur();
						} catch(err) {
						}
					}
				}
			}
			if ( typeof args.leftNavCallback == 'function') {
				args.leftNavCallback();
			}
			$.hideMe();
		});
	}
	if (args.showRightNavButton) {
		$.rightnavbutton.text = (args.rightNavButtonTitle) ? args.rightNavButtonTitle : '';
		//$.rightnavbutton.visible = true;
		$.rightnavbutton.addEventListener('click', function(e) {
			e.bubbles = false;
			e.cancelBubble = true;
			if (args && args.view && args.view.children) {
				var kids = args.view.children;
				if (kids && kids.length) {
					for (var i = 0, j = kids.length; i < j; i++) {
						try {
							kids[i].blur();
						} catch(err) {
						}
					}
				}
			}
			args.rightNavCallback();
			$.hideMe();
		});
	}
	if (args.view) {
		$.contents.add(args.view);
	}
	if (args.duration) {
		duration = args.duration;
	}
	if (args.openCallback && typeof args.openCallback === 'function') {
		//add a callback function when this opens
		$.popover.addEventListener('open', function(e) {
			e.bubbles = false;
			e.cancelBubble = true;
			args.openCallback();
		});
	}

	if (args.closeCallback && typeof args.closeCallback === 'function') {
		//add a callback function when this closes
		$.popover.addEventListener('close', function(e) {
			e.bubbles = false;
			e.cancelBubble = true;
			args.closeCallback();
		});
	}
};

if (OS_IOS) {
	var shadowOffset = Ti.UI.createAnimation({
		transform : Ti.UI.create2DMatrix().translate(3, 3),
		duration : 1
	});
	$.shadow.animate(shadowOffset);
}

if (OS_IOS) {
	var showAnim = Titanium.UI.createAnimation({
		opacity : 1,
		duration : duration
	}), hideAnim = Titanium.UI.createAnimation({
		// closes quicker than opens
		opacity : 0,
		duration : duration / 2
	});

}
$.popover.addEventListener('click', function(e) {
	if (e.source.id == 'backshade' && !disableBackshadeClose) {
		$.hideMe();
	}
});

$.hideMe = function() {
	anim.fadeOut($.popover, duration, function() {
		$.popover.close();
	});
};

$.showMe = function(theArgs) {
	var args = theArgs || {};
	if (args.view) {
		try {
			$.contents.removeAllChildren();
		} catch(err) {
			alert(JSON.stringify(err));
		}
		$.contents.add(args.view);
	}
	$.popover.opacity = 0;
	$.popover.open();
	if (OS_IOS) {
		$.popover.animate(showAnim);
	} else {
		$.popover.opacity = 1;
	}
};

