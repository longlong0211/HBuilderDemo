define(function(require, exports, module) {
	var $windowManager = require('manager/window');
	var $nativeUIManager = require('manager/nativeUI');
	var $userInfo = require('core/userInfo');
	var executeFlag = false;
	bindClick = function(callback) {
		plus.push.addEventListener("click", function(msg) {
			if (!executeFlag) {
				executeFlag = true;
				if (msg.payload) {
					$nativeUIManager.watting('正在进行跳转', false);
					window.setTimeout(function() {
						$nativeUIManager.wattingClose();
						var jsonData = false;
						if (typeof(msg.payload) == "string") {
							jsonData = JSON.parse(msg.payload);
						} else {
							jsonData = msg.payload['payload'];
							jsonData = JSON.parse(jsonData);
						}
						var COUNT = jsonData['remind']['C'];
						var TYPE = jsonData['action']['T'];
						var ID = jsonData['action']['U'];
						var REQ_ID = jsonData['action']['R'];
						COUNT = parseInt(COUNT);
						if (COUNT > 0) {
							plus.runtime.setBadgeNumber(COUNT);
						} else {
							plus.runtime.setBadgeNumber(0);
						}
						if (typeof callback == 'function') {
							callback(TYPE, ID, REQ_ID);
						}
					}, 1000);
				}
			}
			window.setTimeout(function() {
				plus.push.remove(msg);
				executeFlag = false;
			}, 5000);
		}, false);
	};
	bindReceive = function(receiveCallback) {
		plus.push.addEventListener("receive", function(msg) {
			if (!executeFlag) {
				executeFlag = true;
				if (msg.payload) {
					var jsonData = false;
					if (typeof(msg.payload) == "string") {
						jsonData = JSON.parse(msg.payload);
					} else {
						jsonData = msg.payload['payload'];
						if (!jsonData) {
							jsonData = msg.payload;
						}
					}
					var COUNT = jsonData['remind']['C'];
					COUNT = parseInt(COUNT);
					if (COUNT > 0) {
						plus.runtime.setBadgeNumber(COUNT);
						if (typeof receiveCallback == 'function') {
							receiveCallback();
						}
					} else {
						plus.runtime.setBadgeNumber(0);
					}
				}
				window.setTimeout(function() {
					executeFlag = false;
				}, 5000);
			}
		});
	};
	exports.pushInfo = function() {
		return plus.push.getClientInfo();
	};
	exports.connect = function(callback, receiveCallback) {
		bindClick(callback);
		bindReceive(receiveCallback);
	};
});