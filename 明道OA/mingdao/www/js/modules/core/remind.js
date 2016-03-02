define(function(require, exports, module) {
	var $laCommon = require('core/la_common');
	var $userInfo = require('core/userInfo');
	menuREQ = function() {
		if ($userInfo.isSupport()) {
			var mobileObj = false;
			$laCommon.switchOS(function() {
				mobileObj = $('#menuRemindIOS');
			}, function() {
				mobileObj = $('#menuRemind');
			});
			if (parseInt($userInfo.get('reqHistoryCount')) > 0) {
				$('li[dir="history"]', mobileObj).find('em').text($userInfo.get('reqHistoryCount')).show();
			} else {
				$('li[dir="history"]', mobileObj).find('em').text(0).hide();
			}
			if (parseInt($userInfo.get('reqConfirmCount')) > 0) {
				$('li[dir="confirm"]', mobileObj).find('em').text($userInfo.get('reqConfirmCount')).show();
			} else {
				$('li[dir="confirm"]', mobileObj).find('em').text(0).hide();
			}
		}
	};
	menuTASK = function() {
		if ($userInfo.isSupport()) {
			var mobileObj = false;
			$laCommon.switchOS(function() {
				mobileObj = $('#menuRemindIOS');
			}, function() {
				mobileObj = $('#menuRemind');
			});
			if (parseInt($userInfo.get('taskApprove')) > 0) {
				$('li[dir="ing"]', mobileObj).find('em').text($userInfo.get('taskApprove')).show();
			} else {
				$('li[dir="ing"]', mobileObj).find('em').text(0).hide();
			}
		}
	};
	menuMANAGE = function() {
		if ($userInfo.isSupport()) {
			var mobileObj = false;
			$laCommon.switchOS(function() {
				mobileObj = $('#menuRemindIOS');
			}, function() {
				mobileObj = $('#menuRemind');
			});
			if (parseInt($userInfo.get('manageExecute')) > 0) {
				$('li[dir="ing"]', mobileObj).find('em').text($userInfo.get('manageExecute')).show();
			} else {
				$('li[dir="ing"]', mobileObj).find('em').text(0).hide();
			}
		}
	};
	home = function() {
		if ($userInfo.isSupport()) {
			if (parseInt($userInfo.get('reqCount')) > 0) {
				$('li[dir="req"]', '#headerUL').find('.count').text($userInfo.get('reqCount'));
				$('li[dir="req"]', '#headerUL').addClass('hastips');
			} else {
				$('li[dir="req"]', '#headerUL').find('.count').text('0');
				$('li[dir="req"]', '#headerUL').removeClass('hastips');
			}
			if (parseInt($userInfo.get('taskApprove')) > 0) {
				$('li[dir="task"]', '#headerUL').find('.count').text($userInfo.get('taskApprove'));
				$('li[dir="task"]', '#headerUL').addClass('hastips');
			} else {
				$('li[dir="task"]', '#headerUL').find('.count').text('0');
				$('li[dir="task"]', '#headerUL').removeClass('hastips');
			}
			if (parseInt($userInfo.get('manageExecute')) > 0) {
				$('li[dir="manage"]', '#headerUL').find('.count').text($userInfo.get('manageExecute'));
				$('li[dir="manage"]', '#headerUL').addClass('hastips');
			} else {
				$('li[dir="manage"]', '#headerUL').find('.count').text('0');
				$('li[dir="manage"]', '#headerUL').removeClass('hastips');
			}
		}
	};
	refreshAll = function(type) {
		if (type) {
			if (type == 'REQ') {
				menuREQ();
			} else if (type == 'TASK') {
				menuTASK();
			} else if (type == 'MANAGE') {
				menuMANAGE();
			}else if (type == 'HOME') {
				home();
			}
		}
	};
	badgeNumber = function() {
		var reqCount = parseInt($userInfo.get('reqCount'));
		var taskApprove = parseInt($userInfo.get('taskApprove'));
		var manageExecute = parseInt($userInfo.get('manageExecute'));
		var tipCount = reqCount + taskApprove + manageExecute;
		if (tipCount > 0) {
			plus.runtime.setBadgeNumber(tipCount);
		} else {
			plus.runtime.setBadgeNumber(0);
		}
	};
	exports.refreshRequest = function() {
		if ($userInfo.isSupport()) {
			$.ajax({
				type: 'POST',
				url: $laCommon.getRestApiURL() + "/wf/req/refreshTip",
				dataType: 'json',
				data: {
					'laToken': $userInfo.get('laAccessToken')
				},
				success: function(jsonData) {
					if (jsonData) {
						if (jsonData['result'] == '0') {
							$userInfo.put('reqCount', jsonData['reqCount']);
							$userInfo.put('reqHistoryCount', jsonData['reqHistoryCount']);
							$userInfo.put('reqConfirmCount', jsonData['reqConfirmCount']);
							$userInfo.put('taskApprove', jsonData['taskApprove']);
							$userInfo.put('manageExecute', jsonData['manageExecute']);
						}
					}
				},
				error: function(jsonData) {

				}
			});
		}
	};
	exports.refresh = function(type) {
		if ($userInfo.isSupport()) {
			refreshAll(type);
			$laCommon.switchOS(function() {
				badgeNumber();
			}, function() {});
		}
	};
});