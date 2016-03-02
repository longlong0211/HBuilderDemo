define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	loadApply = function() {
		var applyJsonData = JSON.parse($userInfo.get('applyJsonData'));
		if (applyJsonData) {
			var applyList = applyJsonData['applyList'];
			if (applyList && $(applyList).size() > 0) {
				var count = $(applyList).size();
				var sb = new StringBuilder();
				$(applyList).each(function(i, applyObj) {
					var odd = (i % 3);
					if (odd == 0) {
						sb.append('<tr>\n');
					}
					sb.append(String.formatmodel($templete.getApplyItem(), {
						'id': applyObj['id'],
						'applyName': applyObj['applyName'],
						'applyIco': applyObj['applyIco']
					}));
					if (odd == 2) {
						sb.append('</tr>\n');
					} else {
						if (i == count - 1) {
							sb.append('</tr>\n');
						}
					}
				});
				$('.form_table').empty().append(sb.toString());
				bindEvent();
			}
		}
	};
	bindEvent = function() {
		$common.touchSME($('td', '.form_table'),
			function(startX, startY, endX, endY, event, startTouch, o) {},
			function(startX, startY, endX, endY, event, moveTouch, o) {}, function(startX, startY, endX, endY, event, o) {
				if (startX == endX && startY == endY) {
					if (!$(o).hasClass('active')) {
						var payYn = $userInfo.get('payYn');
						var diffDay = $userInfo.get('diffDay');
						var tryDay = $userInfo.get('tryDay');
						var over = true;
						if (payYn == 'N') {
							if (tryDay) {
								tryDay = parseInt(tryDay);
								if (tryDay >= 0) {
									over = false;
								}
							}
						} else if (payYn == 'Y') {
							if (diffDay) {
								diffDay = parseInt(diffDay);
								if (diffDay >= 0) {
									over = false;
								}
							}
						}
						if (!over) {
							var applyId = $(o).attr('uid');
							if (applyId) {
								$(o).addClass('active');
								window.setTimeout(function() {
									$(o).removeClass('active');
									$windowManager.create('apply_head', '../apply/head.html?applyId=' + applyId, false, true, function(show) {
										show();
									});
								}, 100);
							}
						}else{
							if(payYn=='Y'){
								$nativeUIManager.alert('提示', '您的明道OA已到期,暂时不能提交新的申请', 'OK', function() {});
							}else if(payYn=='N'){
								$nativeUIManager.alert('提示', '您的明道OA已试用结束,暂时不能提交新的申请', 'OK', function() {});
							}
						}
					}
				}
			});
	};
	plusReady = function() {
		loadApply();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});