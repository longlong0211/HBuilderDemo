define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	bindEvent = function() {
		$common.touchSME($('li', '.attachment_list'),
			function(startX, startY, endX, endY, event, startTouch, o) {},
			function(startX, startY, endX, endY, event, moveTouch, o) {}, function(startX, startY, endX, endY, event, o) {
				if (startX == endX && startY == endY) {
					if ($(o).hasClass('attView')) {
						if (!$(o).hasClass('choose')) {
							$(o).addClass('choose');
							window.setTimeout(function() {
								$(o).removeClass('choose');
								$userInfo.put('attData_fileName', $(o).attr('fileName'));
								$userInfo.put('attData_url', $(o).attr('url'));
								$userInfo.put('attData_type', $(o).attr('type'));
								$windowManager.create('req_attView', 'attView.html', false, true, function(show) {
									show();
								});
							}, 100);
						}
					} else {
						$nativeUIManager.alert('提示', '该文档类型无法再手机端查看', 'OK');
					}
				}
			});
	};
	buildData = function(jsonData) {
		var att = jsonData['att'];
		var sb = new StringBuilder();
		if (att) {
			var reqAtt = att['reqAtt'];
			if (reqAtt && $(reqAtt).size() > 0) {
				$(reqAtt).each(function(i, o) {
					var icon_postfix = o['postfix'];
					if (icon_postfix == 'jpeg' || icon_postfix == 'jpg' || icon_postfix == 'gif' || icon_postfix == 'bmp' || icon_postfix == 'png') {
						icon_postfix = 'img';
					}
					var pos = o['postfix'];
					var viewAction = 'No_click';
					if (pos == 'doc' || pos == 'docx' || pos == 'xls' || pos == 'xlsx' || pos == 'ppt' || pos == 'pptx' || pos == 'pdf') {
						viewAction = 'attView';
					}
					if (icon_postfix == 'img') {
						viewAction = 'attView';
					}
					sb.append(String.formatmodel($templete.getAttItem(), {
						fileKey: o['fileKey'],
						icon_postfix: icon_postfix,
						fileName: o['fileName'],
						postfix: o['postfix'],
						userName: o['userName'],
						url: o['url'],
						viewAction: viewAction
					}));
				});
			}
			$('.attachment_list').empty().append(sb.toString());
			bindEvent();
		}
	};
	loadData = function() {
		$nativeUIManager.watting('加载中...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/common/buildAtt',
			dataType: 'json',
			data: {
				oaToken: $userInfo.get('token'),
				attData: $userInfo.get('attData'),
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						buildData(jsonData);
						$nativeUIManager.wattingClose();
					} else {
						$nativeUIManager.wattingTitle('未知错误');
						window.setTimeout(function() {
							$nativeUIManager.wattingClose();
						}, 1500);
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$nativeUIManager.wattingTitle('未知错误');
				window.setTimeout(function() {
					$nativeUIManager.wattingClose();
				}, 1500);
			}
		});
	};
	plusReady = function() {
		loadData();
		$common.androidBack(function() {
			$userInfo.removeItem('attData_fileName');
			$userInfo.removeItem('attData_url');
			$userInfo.removeItem('attData_type');
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
				$windowManager.close('slide-out-right');
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