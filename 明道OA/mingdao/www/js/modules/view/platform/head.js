define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	bindEvent = function() {
		$common.touchSE($('#infoAction'), function(event, startTouch, o) {}, function(event, o) {
			$windowManager.create('logout', '../logout.html', false, true, function(show) {
				show();
			});
		});
	};
	loadWebview = function() {
		var worklist = plus.webview.create("list.html", "platform_list", {
			top: "80px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		worklist.addEventListener("loaded", function() {
			$windowManager.current().append(worklist);
		}, false);
	}
	plusReady = function() {
		loadWebview();
		bindEvent();
		$('#userImg').attr('src', $userInfo.get('userImg'));
		$('#userName').text($userInfo.get('userName'));
		$('#companyName').text($userInfo.get('companyName'));
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});