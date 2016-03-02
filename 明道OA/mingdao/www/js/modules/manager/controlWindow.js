define(function(require, exports, module) {
	var $windowManager = require('manager/window');
	exports.lunchWindowShow = function() {
		var lunchWindow = $windowManager.getLaunchWindow();
		if (lunchWindow) {
			if (!lunchWindow.isVisible()) {
				lunchWindow.show();
			}
		}
	};
	exports.lunchWindowHide = function() {
		var lunchWindow = $windowManager.getLaunchWindow();
		if (lunchWindow) {
			if (lunchWindow.isVisible()) {
				lunchWindow.hide();
			}
		}
	};
	exports.platformWindowHide = function() {
		var platformHeadWindow = $windowManager.getById('platform_head');
		var platformListWindow = $windowManager.getById('platform_list');
		if (platformHeadWindow) {
			if (platformHeadWindow.isVisible()) {
				platformHeadWindow.hide();
			}
		}
		if (platformListWindow) {
			if (platformListWindow.isVisible()) {
				platformListWindow.hide();
			}
		}
	};
	exports.platformWindowShow = function() {
		var platformHeadWindow = $windowManager.getById('platform_head');
		var platformListWindow = $windowManager.getById('platform_list');
		if (platformHeadWindow) {
			if (!platformHeadWindow.isVisible()) {
				platformHeadWindow.show();
			}
		}
		if (platformListWindow) {
			if (!platformListWindow.isVisible()) {
				platformListWindow.show();
			}
		}
	};
	exports.historyWindowHide = function(type) {
		var listTypeId = '';
		if (type) {
			if (type == 'req') {
				listTypeId = 'history_reqList';
			} else if (type == 'task') {
				listTypeId = 'history_taskList';
			} else if (type == 'manage') {
				listTypeId = 'history_manageList';
			} else if (type == 'share') {
				listTypeId = 'history_shareList';
			}
		}
		var historyHeadWindow = $windowManager.getById('history_head');
		var historyListWindow = $windowManager.getById(listTypeId);
		if (historyHeadWindow) {
			if (historyHeadWindow.isVisible()) {
				historyHeadWindow.hide();
			}
		}
		if (historyListWindow) {
			if (historyListWindow.isVisible()) {
				historyListWindow.hide();
			}
		}
	};
	exports.historyWindowShow = function(type) {
		var listTypeId = '';
		if (type) {
			if (type == 'req') {
				listTypeId = 'history_reqList';
			} else if (type == 'task') {
				listTypeId = 'history_taskList';
			} else if (type == 'manage') {
				listTypeId = 'history_manageList';
			} else if (type == 'share') {
				listTypeId = 'history_shareList';
			}
		}
		var historyHeadWindow = $windowManager.getById('history_head');
		var historyListWindow = $windowManager.getById(listTypeId);
		if (historyHeadWindow) {
			if (!historyHeadWindow.isVisible()) {
				historyHeadWindow.show();
			}
		}
		if (historyListWindow) {
			if (!historyListWindow.isVisible()) {
				historyListWindow.show();
			}
		}
	};
	exports.historyListWindowHide = function(type) {
		var listTypeId = '';
		if (type) {
			if (type == 'req') {
				listTypeId = 'history_reqList';
			} else if (type == 'task') {
				listTypeId = 'history_taskList';
			} else if (type == 'manage') {
				listTypeId = 'history_manageList';
			} else if (type == 'share') {
				listTypeId = 'history_shareList';
			}
		}
		var historyListWindow = $windowManager.getById(listTypeId);
		if (historyListWindow) {
			if (historyListWindow.isVisible()) {
				historyListWindow.hide();
			}
		}
	};
	exports.historyListWindowShow = function(type) {
		var listTypeId = '';
		if (type) {
			if (type == 'req') {
				listTypeId = 'history_reqList';
			} else if (type == 'task') {
				listTypeId = 'history_taskList';
			} else if (type == 'manage') {
				listTypeId = 'history_manageList';
			} else if (type == 'share') {
				listTypeId = 'history_shareList';
			}
		}
		var historyListWindow = $windowManager.getById(listTypeId);
		if (historyListWindow) {
			if (!historyListWindow.isVisible()) {
				historyListWindow.show();
			}
		}
	};
	exports.activeWindowClose = function() {
		var platformHeadWindow = $windowManager.getById('platform_head');
		var platformListWindow = $windowManager.getById('platform_list');
		var historyHeadWindow = $windowManager.getById('history_head');
		var historyReqListWindow = $windowManager.getById('history_reqList');
		var historyTaskListWindow = $windowManager.getById('history_taskList');
		var historyManageListWindow = $windowManager.getById('history_manageList');
		var historyShareListWindow = $windowManager.getById('history_shareList');
		var logoutWindow = $windowManager.getById('logout');
		if (platformHeadWindow) {
			platformHeadWindow.close();
		}
		if (platformListWindow) {
			platformListWindow.close();
		}
		if (historyHeadWindow) {
			historyHeadWindow.close();
		}
		if (historyReqListWindow) {
			historyReqListWindow.close();
		}
		if (historyTaskListWindow) {
			historyTaskListWindow.close();
		}
		if (historyManageListWindow) {
			historyManageListWindow.close();
		}
		if (historyShareListWindow) {
			historyShareListWindow.close();
		}
		if (logoutWindow) {
			logoutWindow.close();
		}
	};

	exports.attListWindowHide = function() {
		var attListWindow = $windowManager.getById('req_attList');
		if (attListWindow) {
			if (attListWindow.isVisible()) {
				attListWindow.hide();
			}
		}
	};
	exports.attListWindowShow = function() {
		var attListWindow = $windowManager.getById('req_attList');
		if (attListWindow) {
			if (!attListWindow.isVisible()) {
				attListWindow.show();
			}
		}
	};
	exports.sendWindowHide = function() {
		var sendHeadWindow = $windowManager.getById('send_head');
		var sendApplyWindow = $windowManager.getById('send_apply');
		if (sendHeadWindow) {
			if (sendHeadWindow.isVisible()) {
				sendHeadWindow.hide();
			}
		}
		if (sendApplyWindow) {
			if (sendApplyWindow.isVisible()) {
				sendApplyWindow.hide();
			}
		}
	};
	exports.sendWindowShow = function() {
		var sendHeadWindow = $windowManager.getById('send_head');
		var sendApplyWindow = $windowManager.getById('send_apply');
		if (sendHeadWindow) {
			if (!sendHeadWindow.isVisible()) {
				sendHeadWindow.show();
			}
		}
		if (sendApplyWindow) {
			if (!sendApplyWindow.isVisible()) {
				sendApplyWindow.show();
			}
		}
	};
	exports.sendApplyWindowHide = function() {
		var sendApplyWindow = $windowManager.getById('send_apply');
		if (sendApplyWindow) {
			if (sendApplyWindow.isVisible()) {
				sendApplyWindow.hide();
			}
		}
	};
	exports.sendApplyWindowShow = function() {
		var sendApplyWindow = $windowManager.getById('send_apply');
		if (sendApplyWindow) {
			if (!sendApplyWindow.isVisible()) {
				sendApplyWindow.show();
			}
		}
	};
	
	exports.searchWindowHide = function() {
		var searchHeadWindow = $windowManager.getById('search_head');
		var searchResultWindow = $windowManager.getById('search_result');
		if (searchHeadWindow) {
			if (searchHeadWindow.isVisible()) {
				searchHeadWindow.hide();
			}
		}
		if (searchResultWindow) {
			if (searchResultWindow.isVisible()) {
				searchResultWindow.hide();
			}
		}
	};
	exports.searchWindowShow = function() {
		var searchHeadWindow = $windowManager.getById('search_head');
		var searchResultWindow = $windowManager.getById('search_result');
		if (searchHeadWindow) {
			if (!searchHeadWindow.isVisible()) {
				searchHeadWindow.show();
			}
		}
		if (searchResultWindow) {
			if (!searchResultWindow.isVisible()) {
				searchResultWindow.show();
			}
		}
	};
});