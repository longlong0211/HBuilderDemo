define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $windowManager = require('manager/window');
	var $nativeUIManager = require('manager/nativeUI');
	bindEvent = function() {
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
	};
	loadMDReg = function() {
		$nativeUIManager.watting('请稍等...', false);
		var regWindow = plus.webview.create("http://www.mingdao.com/m/default.htm?s=oa.mingdao.com", "md_reg", {
			top: "45px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		regWindow.addEventListener("loaded", function() {
			$windowManager.current().append(regWindow);
			$nativeUIManager.wattingClose();
		}, false);
	};
	plusReady = function() {
		bindEvent();
		loadMDReg();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});