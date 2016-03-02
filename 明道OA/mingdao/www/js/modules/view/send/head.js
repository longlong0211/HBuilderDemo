define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');

	loadApply = function(typeId) {
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/common/applyList',
			dataType: 'json',
			data: {
				oaToken: $userInfo.get('token'),
				typeId: typeId
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$userInfo.put('applyJsonData', JSON.stringify(jsonData));
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
		$common.touchSE($('span', '.apps_title'), function(event, startTouch, o) {
			if (!$(o).hasClass('active')) {
				$(o).addClass('active');
			}
		}, function(event, o) {
			if ($(o).hasClass('active') && !$(o).hasClass('current')) {
				var typeId = $(o).attr('uid');
				var typeName = $(o).attr('name');
				$('#typeName').attr('typeId', typeId).text(typeName);
				$nativeUIManager.watting('加载中...');
				window.setTimeout(function() {
					$('span', '.apps_title').removeClass('current');
					$(o).addClass('current');
					loadApply(typeId);
					$(o).removeClass('active')
				}, 500);
			} else {
				window.setTimeout(function() {
					$(o).removeClass('active')
				}, 100);
			}
		});
	};
	loadData = function() {
		$nativeUIManager.watting('加载中...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/common/applyType',
			dataType: 'json',
			data: {
				oaToken: $userInfo.get('token')
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var typeList = jsonData['typeList'];
						if (typeList && $(typeList).size() > 0) {
							var sb = new StringBuilder();
							$(typeList).each(function(i, o) {
								sb.append(String.formatmodel($templete.getApplyTypeItem(), {
									id: o['id'],
									name: o['name'].substring(0, 2)
								}));
							});
							$('.apps_title').empty().append(sb.toString());
							bindEvent();
							var firstObj = $('span', '.apps_title').first();
							if (firstObj) {
								$('#typeName').attr('typeId', $(firstObj).attr('uid')).text($(firstObj).attr('name'));
							}
							window.setTimeout(function() {
								$(firstObj).addClass('current');
								loadApply($(firstObj).attr('uid'));
							}, 500);
						}
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
		var apply = $windowManager.getById('send_apply');
		if (apply) {
			apply.close();
		}
		var apply = plus.webview.create('apply.html', 'send_apply', {
			top: "85px",
			bottom: "0px",
			scrollIndicator: 'vertical'
		});
		apply.addEventListener("loaded", function() {
			$windowManager.current().append(apply);
		}, false);
	};
	plusReady = function() {
		loadData();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});