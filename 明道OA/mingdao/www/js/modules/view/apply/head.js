define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var queryMap = parseURL();
	var applyId = queryMap.get('applyId');
	loadData = function() {
		$nativeUIManager.watting('加载中...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/wf/req/layout',
			dataType: 'json',
			data: {
				oaToken: $userInfo.get('token'),
				applyId: applyId
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$('#applyName').text(jsonData['applyName']);
						$userInfo.put('layoutJsonData', JSON.stringify(jsonData));
						loadWebview();
						$nativeUIManager.wattingClose();
					} else {
						$nativeUIManager.wattingTitle('未知错误');
						window.setTimeout(function() {
							$nativeUIManager.wattingClose();
						}, 1500);
					}
				}
			},
			error: function(jsonData) {
				$nativeUIManager.wattingTitle('未知错误');
				window.setTimeout(function() {
					$nativeUIManager.wattingClose();
				}, 1500);
			}
		});
	};
	loadWebview = function() {
		var edit = plus.webview.create('edit.html', 'apply_edit', {
			top: "45px",
			bottom: "60px",
			scrollIndicator: 'vertical'
		});
		edit.addEventListener("loaded", function() {
			$windowManager.current().append(edit);
		}, false);
	};
	plusReady = function() {
		loadData();
		$common.androidBack(function() {
			$nativeUIManager.confirm('提示', '你确定放弃填写?' + $('#applyName').text(), ['确定', '取消'], function() {
				$userInfo.removeItem('layoutJsonData');
				$controlWindow.sendWindowShow();
				$windowManager.close('slide-out-right');
			}, function() {});
		});
		$common.touchSE($('#backAction'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				$nativeUIManager.confirm('提示', '你确定放弃填写?' + $('#applyName').text(), ['确定', '取消'], function() {
					$userInfo.removeItem('layoutJsonData');
					$controlWindow.sendWindowShow();
					$windowManager.close('slide-out-right');
				}, function() {});
				window.setTimeout(function(){
					$(o).removeClass('active');
				},100);
			}
		});

		$common.touchSE($('#saveAction'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active')) {
				var editWindow = $windowManager.getById('apply_edit');
				if (editWindow) {
					editWindow.evalJS('sendApply()');
				}
				window.setTimeout(function() {
					$(o).removeClass('active');
				}, 100);
			}
		});

		$controlWindow.sendWindowHide();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});