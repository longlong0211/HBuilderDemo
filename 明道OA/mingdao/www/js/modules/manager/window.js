define(function(require, exports, module) {
	var newWindow = null;
	exports.create = function(windowID, windowURL, showType, delay, callback) {
		if (newWindow) {
			return;
		}
		if (window.plus) {
			var _showType = 'slide-in-right';
			if (showType) {
				_showType = showType;
			}
			windowURL = encodeURI(windowURL);
			newWindow = plus.webview.create(windowURL, windowID, {
				scrollIndicator: 'none',
				scalable: false
			});
			if (newWindow) {
				var showTimes = 300;
				if (_showType == 'none') {
					showTimes = 0;
				}
				if (!delay) {
					plus.webview.show(newWindow, _showType, showTimes)
					setTimeout(function() {
						newWindow = null;
					}, 300);
				} else {
					newWindow.addEventListener('loaded', function() {
						if (!callback) {
							if (newWindow) {
								plus.webview.show(newWindow, _showType, showTimes)
								setTimeout(function() {
									newWindow = null;
								}, 300);
							}
						} else {
							if (typeof callback == 'function') {
								callback(function() {
									if (newWindow) {
										plus.webview.show(newWindow, _showType, showTimes)
										setTimeout(function() {
											newWindow = null;
										}, 300);
									}
								});
							}
						}

					}, false);
				}
			}
		}
	};
	exports.load = function(url, callback) {
		if (window.plus && url) {
			plus.webview.currentWebview().loadURL(url);
			if (typeof callback == 'function') {
				plus.webview.currentWebview().addEventListener('loaded', function() {
					callback(plus.webview.currentWebview());
				}, false);
			}
		}
	};
	exports.reload = function(flag) {
		if (window.plus) {
			plus.webview.currentWebview().reload(flag);
		}
	};
	exports.visible = function(visibleFlag) {
		if (window.plus) {
			plus.webview.currentWebview().setContentVisible(visibleFlag);
		}
	};
	exports.close = function(hideType) {
		if (window.plus) {
			var _hideType = 'slide-in-left';
			if (hideType) {
				_hideType = hideType;
			}
			plus.webview.close(plus.webview.currentWebview(), _hideType);
		}
	};
	exports.all = function() {
		if (window.plus) {
			return plus.webview.all();
		}
	};
	exports.back = function() {
		if (window.plus) {
			plus.webview.currentWebview().back();
		}
	};
	exports.append = function(appendWindow) {
		if (window.plus) {
			plus.webview.currentWebview().append(appendWindow);
		}
	};
	exports.current = function() {
		if (window.plus) {
			return plus.webview.currentWebview();
		}
	};
	exports.getById = function(id) {
		if (window.plus) {
			return plus.webview.getWebviewById(id);
		}
	};
	exports.parent = function() {
		if (window.plus) {
			return plus.webview.currentWebview().parent();
		}
	};
	exports.opener = function() {
		if (window.plus) {
			return plus.webview.currentWebview().opener();
		}
	};
	exports.title = function() {
		if (window.plus) {
			return plus.webview.currentWebview().getTitle();
		}
	};
	exports.loadedEvent = function(loadedCallback) {
		if (window.plus) {
			plus.webview.currentWebview().addEventListener("loaded", function() {
				if (typeof loadedCallback == 'function') {
					loadedCallback();
				}
			}, false);
		}
	};
	exports.getLaunchWindowId = function() {
		var lunchWindow = plus.webview.getLaunchWebview();
		return lunchWindow.id;
	};
	exports.getLaunchWindow = function() {
		var lunchWindow = plus.webview.getLaunchWebview();
		return lunchWindow;
	};
	exports.getLastWindow = function() {
		var windowList = exports.all();
		if (windowList) {
			var windowObj = windowList[windowList.length - 1];
			if (windowObj) {
				return windowObj;
			}
		}
	};
	exports.getCurrentWindowIds = function() {
		var windowList = exports.all();
		var currentWindowIds = '';
		if (windowList) {
			for (var i = 0; i < windowList.length; i++) {
				var windowObj = windowList[i];
				if (windowObj) {
					var winID = windowObj.id;
					if (winID) {
						currentWindowIds += winID + ',';
					}
				}
			}
		}
		return currentWindowIds;
	};
	exports.closeAll = function(ignoreID) {
		var windowList = exports.all();
		var launchId=exports.getLaunchWindowId();
		if (windowList&&launchId) {
			for (var i = 0; i < windowList.length; i++) {
				var windowObj = windowList[i];
				if (windowObj) {
					var winID = windowObj.id;
					if (winID) {
						if (winID != launchId) {
							var flag = false;
							if (ignoreID) {
								if (ignoreID.indexOf(winID) != -1) {
									flag = true;
								}
							}
							if (!flag) {
								windowObj.hide();
								windowObj.close();
							}
						}
					}
				}
			}
		}
	};
});