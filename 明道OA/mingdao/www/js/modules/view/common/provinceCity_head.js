define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var queryMap = parseURL();
	var provinceId = queryMap.get('provinceId');
	var cityId = queryMap.get('cityId');
	var title = queryMap.get('title');
	var uuid = queryMap.get('uuid');
	showOkBtn = function() {
		$('#okBtn').show();
	};
	loadWebview = function() {
		var item = plus.webview.create('provinceCity_provinceItem.html?provinceId=' + provinceId + '&cityId=' + cityId + '&uuid=' + uuid, 'provinceCity_provinceItem', {
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
			$userInfo.removeItem('itemJsonData');
			$windowManager.close('slide-out-right');
		});
		$common.touchSE($('#backAction'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				$userInfo.removeItem('itemJsonData');
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
				var itemWindow = $windowManager.getById('provinceCity_cityItem');
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