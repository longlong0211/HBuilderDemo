define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	loadData = function() {
		$('#attName').text($userInfo.get('attData_fileName'));
		var type = $userInfo.get('attData_type');
		if (type) {
			if (type == 'img') {
				$nativeUIManager.watting('正在加载图片 请等待...');
				var imgUrl = $userInfo.get('attData_url');
				imgReady(imgUrl, function() {}, function() {
					var imgViewWindow = plus.webview.create('attImgPreview.html', "imgView", {
						top: "50px",
						bottom: "0px",
						scalable: true
					});
					imgViewWindow.addEventListener("loaded", function() {
						$windowManager.current().append(imgViewWindow);
						$nativeUIManager.wattingClose();
					}, false);
				}, function() {
					$nativeUIManager.wattingTitle('图片加载失败');
					window.setTimeout(function() {
						$nativeUIManager.wattingClose();
					}, 1000);
				});
			} else {
				var type = $userInfo.get('attData_type');
				$nativeUIManager.watting('正在转换' + type + '文档 请等待...');
				var onlineURL = 'https://docview.mingdao.com/op/view.aspx?src=' + $userInfo.get('attData_url');
				var officeViewWindow = plus.webview.create(onlineURL, "officeView", {
					top: "50px",
					bottom: "0px",
					scrollIndicator: 'vertical'
				});
				officeViewWindow.addEventListener("loaded", function() {
					$windowManager.current().append(officeViewWindow);
					window.setTimeout(function() {
						$nativeUIManager.wattingClose();
					}, 1500);
				}, false);
			}
		}
	};
	plusReady = function() {
		loadData();
		$common.androidBack(function() {
			$userInfo.removeItem('attData_fileName');
			$userInfo.removeItem('attData_url');
			$userInfo.removeItem('attData_type');
			$controlWindow.attListWindowShow();
			$windowManager.close('slide-out-right');
		});
		$common.touchSE($('#backAction'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				$userInfo.removeItem('attData_fileName');
				$userInfo.removeItem('attData_url');
				$userInfo.removeItem('attData_type');
				$controlWindow.attListWindowShow();
				$windowManager.close('slide-out-right');
				$(o).removeClass('active');
			}
		});
		$controlWindow.attListWindowHide();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});