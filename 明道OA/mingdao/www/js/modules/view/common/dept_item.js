define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var queryMap = parseURL();
	var currentId = queryMap.get('id');
	var uuid = queryMap.get('uuid');
	getCurrentId = function() {
		var current = '';
		if ($('li.choosed', '#itemUL').size() > 0) {
			var li = $('li.choosed', '#itemUL');
			if (li) {
				current = $(li).attr('value');
				var applyEdit = $windowManager.getById('apply_edit');
				if (applyEdit) {
					applyEdit.evalJS('setSelectDeptItem("' + uuid + '","' + current + '","' + current + '")');
				}
			}
		} else {
			var applyEdit = $windowManager.getById('apply_edit');
			if (applyEdit) {
				applyEdit.evalJS('setSelectDeptItem("' + uuid + '","","")');
			}
		}
		var selectHead = $windowManager.opener();
		if (selectHead) {
			selectHead.close('slide-out-right');
		}

	};
	loadData = function() {
		$nativeUIManager.watting('正在加载部门...');
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/common/deptAll',
			dataType: 'json',
			data: {
				'oaToken': $userInfo.get('token')
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var deptList = jsonData['deptList'];
						if (deptList && $(deptList).size() > 0) {
							var sb = new StringBuilder();
							$(deptList).each(function(i, dept) {
								sb.append(String.formatmodel($templete.getSelectItemItem(false), {
									itemValue: dept['name'],
									itemName: dept['name']
								}));
							});
							$('#itemUL').empty().append(sb.toString());
							if (currentId) {
								$('li[value="' + currentId + '"]', '#itemUL').addClass('choosed');
							}
							bindEvent();
							window.setTimeout(function() {
								$nativeUIManager.wattingClose();
							}, 500);
						}
					} else {
						$nativeUIManager.wattingTitle('发生错误,请稍后重试');
						window.setTimeout(function() {
							$nativeUIManager.wattingClose();
						}, 1000);
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				$nativeUIManager.wattingTitle('发生错误,请稍后重试');
				window.setTimeout(function() {
					$nativeUIManager.wattingClose();
				}, 1000);
			}
		});
	};
	bindEvent = function() {
		$common.touchSME($('li', '#itemUL'),
			function(startX, startY, endX, endY, event, startTouch, o) {},
			function(startX, startY, endX, endY, event, moveTouch, o) {}, function(startX, startY, endX, endY, event, o) {
				if (startX == endX && startY == endY) {
					if (!$(o).hasClass('active')) {
						if (!$(o).hasClass('choosed')) {
							$('li', '#itemUL').removeClass('choosed');
							$(o).addClass('choosed');
						} else {
							$(o).removeClass('choosed');
						}
						window.setTimeout(function() {
							$(o).removeClass('active');
						}, 100);
					}
				}
			});
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