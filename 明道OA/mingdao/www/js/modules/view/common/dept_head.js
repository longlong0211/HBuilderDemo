define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var queryMap = parseURL();
	var currentId = queryMap.get('id');
	var title = queryMap.get('title');
	var uuid = queryMap.get('uuid');
	loadWebview = function() {
		var item = plus.webview.create('dept_item.html?id=' + currentId + '&uuid=' + uuid, 'dept_item', {
			top: "45px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		item.addEventListener("loaded", function() {
			$windowManager.current().append(item);
		}, false);
	};
	plusReady = function() {
		loadWebview();
		$('#selectName').text(title);
		$common.androidBack(function() {
			$windowManager.close('slide-out-right');
		});
		$common.touchSE($('#backAction'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				$windowManager.close('slide-out-right');
				$(o).removeClass('active');
			}
		});
		$common.touchSE($('#okBtn'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				var itemWindow = $windowManager.getById('dept_item');
				if (itemWindow) {
					itemWindow.evalJS('getCurrentId()');
				}
				$(o).removeClass('active');
			}
		});
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});