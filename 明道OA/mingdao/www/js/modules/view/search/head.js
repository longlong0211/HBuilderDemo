define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	var $inputManager = require('manager/input');
	loadData = function() {
		$nativeUIManager.watting('正在搜索...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/screen/search',
			dataType: 'json',
			data: {
				oaToken: $userInfo.get('token'),
				keyword: $('#keyword').val()
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$userInfo.put('resultJsonData', JSON.stringify(jsonData));
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
	bindEvent = function() {
		$inputManager.forceCloseKeyboard();
		$('#keyword').off('blur').on('blur', function() {
			var keyword = $(this).val();
			if (keyword && $.trim(keyword).length > 0) {
				var ksArray = keyword.ToCharArray();
				var maxAsciiCode = 0;
				if (ksArray && $(ksArray).size() > 0) {
					$(ksArray).each(function(i, o) {
						if (o.charCodeAt() > maxAsciiCode) {
							maxAsciiCode = o.charCodeAt();
						}
					});
				}
				if (maxAsciiCode <= 122 && $.trim(keyword).length < 6) {
					$nativeUIManager.alert('提示', '请至少输入一个汉字或搜索关键字需大于6位', 'OK', function() {});
				} else {
					loadData();
				}
			}
		});
	};
	loadWebview = function() {
		var result = $windowManager.getById('search_result');
		if (result) {
			result.close();
		}
		result = plus.webview.create('result.html', 'search_result', {
			top: "45px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		result.addEventListener("loaded", function() {
			$windowManager.current().append(result);
		}, false);
	};
	plusReady = function() {
		bindEvent();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});