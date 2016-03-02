define(function(require, exports, module) {
	var $windowManager = require('manager/window');
	var $keyManager = require('manager/key');
	var $nativeUIManager = require('manager/nativeUI');
	var $controlWindow = require('view/controlWindow');
	var $userInfo = require('core/userInfo');
	var onReadCallback = false;
	var againBackbutton = false;
	var backTimes = 0;
	var backPass = false;
	exports.androidBack = function(callback) {
		exports.switchOS(function() {}, function() {
				$keyManager.backButton(function() {
					if (typeof callback == 'function') {
						callback();
					}
				});
			});
	};
	
	exports.hasNetwork = function() {
		if (!plus.networkinfo) {
			return true;
		}
		var type = plus.networkinfo.getCurrentType(),
			networkInfo = plus.networkinfo;
		return type == networkInfo.CONNECTION_ETHERNET || type == networkInfo.CONNECTION_WIFI || type == networkInfo.CONNECTION_CELL2G || type == networkInfo.CONNECTION_CELL3G || type == networkInfo.CONNECTION_CELL4G;
	};
	exports.getRestApiURL = function() {
		return "http://oa.mingdao.com";
	};
	exports.switchOS = function(IOS, ANDROID) {
		switch (plus.os.name) {
			case 'Android':
				ANDROID();
				break;
			case 'iOS':
				IOS();
				break;
			default:
				return;
				break;
		}
	};
	exports.touchM = function(elements, moveFunction) {
		if (elements) {
			$(elements).each(function(i, o) {
				$(o).off('touchmove').on('touchmove', function() {
					var moveTouch = event.touches[0];
					if (typeof moveFunction == 'function') {
						moveFunction(moveTouch, o);
					}
				});
			});
		}
	};
	exports.touchSE = function(elements, startFunction, endFunction) {
		if (elements) {
			$(elements).each(function(i, o) {
				$(o).off('touchstart').on('touchstart', function() {
					var startTouch = event.touches[0];
					if (typeof startFunction == 'function') {
						startFunction(event, startTouch, o);
					}
					$(o).off('touchend').on('touchend', function() {
						if (typeof endFunction == 'function') {
							endFunction(event, o);
						}
					});
				});
			});
		}
	};
	exports.touchSME = function(elements, startFunction, moveFunction, endFunction) {
		if (elements) {
			$(elements).each(function(i, o) {
				$(o).off('touchstart').on('touchstart', function() {
					var startTouch = event.touches[0];
					var startX = startTouch.pageX;
					var startY = startTouch.pageY;
					var endX = startX;
					var endY = startY;
					if (typeof startFunction == 'function') {
						startFunction(startX, startY, endX, endY, event, startTouch, o);
					}
					$(o).off('touchmove').on('touchmove', function() {
						var moveTouch = event.touches[0];
						endX = moveTouch.pageX;
						endY = moveTouch.pageY;
						if (typeof moveFunction == 'function') {
							moveFunction(startX, startY, endX, endY, event, moveTouch, o);
						}
					});
					$(o).off('touchend').on('touchend', function() {
						x = endX - startX;
						y = endY - startY;
						if (typeof endFunction == 'function') {
							endFunction(startX, startY, endX, endY, event, o);
						}
						$(o).off('touchmove');
					});
				});
			});
		}
	};
	exports.refreshToken = function (callbackAction) {
        $.ajax({
            type: 'POST',
            url: exports.getRestApiURL()+'/common/common/refreshTokenId',
            dataType: 'json',
            async:false,
            success: function (jsonData) {
                if (jsonData) {
                    if (jsonData['result'] == '0') {
                        //var token = 'org\\.guiceside\\.web\\.jsp\\.taglib\\.Token';
                        var tokenId = jsonData['tokenId'];
                        //$('#' + token).val(tokenId);
                        if (callbackAction && typeof  callbackAction == 'function') {
                            callbackAction(tokenId);
                        }
                    }
                }
            },
            error: function (jsonData) {
            }
        });
    };
});