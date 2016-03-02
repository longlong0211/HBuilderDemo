define(function(require, exports, module) {
	var waitingObj = null;
	exports.pickDate = function(okCallback, cancelCallback, options) {
		if (window.plus) {
			plus.nativeUI.pickDate(function(e) {
				var date = e.date;
				if (typeof okCallback == 'function') {
					okCallback(date);
				}
			}, function(e) {
				if (typeof cancelCallback == 'function') {
					cancelCallback(e.message);
				}
			}, options);
		}
	};
	exports.pickTime = function(okCallback, cancelCallback, options) {
		if (window.plus) {
			plus.nativeUI.pickTime(function(e) {
				var date = e.date;
				if (typeof okCallback == 'function') {
					okCallback(date);
				}
			}, function(e) {
				if (typeof cancelCallback == 'function') {
					cancelCallback(e.message);
				}
			}, options);
		}
	};
	exports.toast = function(msg) {
		if (window.plus) {
			plus.nativeUI.toast(msg, {
				duration: 'short',
				align: 'center',
				verticalAlign: 'bottom'
			});
		}
	};
	exports.watting = function(msg, closeTimes) {
		if (waitingObj) { // 避免快速多次点击创建多个窗口
			return;
		}
		if (window.plus) {
			waitingObj = plus.nativeUI.showWaiting(msg);
			if (closeTimes) {
				closeTimes = parseInt(closeTimes);
				if (closeTimes > 0) {
					window.setTimeout(function() {
						if (waitingObj) {
							waitingObj.close();
							waitingObj = null;
						}
					}, closeTimes);
				}
			}
		}
	};
	exports.wattingTitle = function(msg) {
		if (window.plus) {
			if (waitingObj) {
				waitingObj.setTitle('    ' + msg + '    ');
			}
		}
	};
	exports.wattingClose = function() {
		if (window.plus) {
			if (waitingObj) {
				waitingObj.close();
				waitingObj = null;
			}
		}
	};
	exports.alert = function(title, msg, button, callback) {
		if (window.plus) {
			plus.nativeUI.alert(msg, function() {
				if (typeof callback == 'function') {
					callback();
				}
			}, title, button);
		}
	};
	exports.confirm = function(title, msg, button, okCallback, cancelCallback) {
		if (window.plus) {
			plus.nativeUI.confirm(msg, function(e) {
				if (e.index == 0) {
					if (typeof okCallback == 'function') {
						okCallback();
					}
				} else {
					if (typeof cancelCallback == 'function') {
						cancelCallback();
					}
				}
			}, title, button);
		}
	};
	exports.confactionSheetirm = function(title, cancelText, buttons, callback) {
		if (window.plus) {
			plus.nativeUI.actionSheet({
				title: title,
				cancel: cancelText,
				buttons: buttons
			}, function(e) {
				if (typeof callback == 'function') {
					callback(e.index);
				}
			});
		}
	};
});