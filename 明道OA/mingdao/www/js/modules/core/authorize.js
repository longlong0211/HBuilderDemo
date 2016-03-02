define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $windowManager = require('manager/window');
	var $nativeUIManager = require('manager/nativeUI');
	var $webSQLManager = require('manager/webSQL');
	var $pushManager = require('manager/push');
	var $controlWindow = require('manager/controlWindow');
	checkTimeout = function(callback) {
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/authorize/timeout',
			dataType: 'json',
			data: {
				'oaToken': $userInfo.get('token'),
				appCheck: '1215'
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '-2') {
						if (typeof callback == 'function') {
							callback();
						}
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if (typeof callback == 'function') {
					callback();
				}
			}
		});
	}
	exports.login = function(companyId, account, password, successCallback, errorCallback) {
		var pushInfo = $pushManager.pushInfo();
		var deviceToken = pushInfo['token'];
		var clientId = pushInfo['clientid']
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/authorize/login',
			dataType: 'json',
			data: {
				companyId: companyId,
				account: account,
				password: password,
				deviceToken: deviceToken,
				clientId: clientId,
				osName: plus.os.name
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						$userInfo.putJson(jsonData);
						$userInfo.put('account', account);
						$userInfo.put('password', password);
						if (typeof successCallback == 'function') {
							successCallback(jsonData);
						}
					} else {
						if (typeof errorCallback == 'function') {
							errorCallback(jsonData['message']);
						}
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if (typeof errorCallback == 'function') {
					errorCallback('网络错误');
				}
			}
		});
	};
	exports.validate = function(account, password, successCallback, errorCallback) {
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/common/authorize/companyList',
			dataType: 'json',
			data: {
				account: account,
				password: password
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						if (typeof successCallback == 'function') {
							successCallback(jsonData);
						}
					} else if (jsonData['result'] == '1') {
						if (typeof errorCallback == 'function') {
							errorCallback(jsonData['message']);
						}
					} else {
						if (typeof errorCallback == 'function') {
							errorCallback('unkown');
						}
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if (typeof errorCallback == 'function') {
					errorCallback('network');
				}
			}
		});
	};
	exports.logout = function() {
		if ($userInfo.isAuthorize()) {
			$nativeUIManager.watting('正在登出...', false);
			window.setTimeout(function() {
				$.ajax({
					type: 'POST',
					url: $common.getRestApiURL() + '/common/authorize/quit',
					dataType: 'json',
					data: {
						oaToken: $userInfo.get('token')
					},
					success: function(jsonData) {
						if (jsonData) {
							if (jsonData['result'] == '0') {
								if (window.plus) {
									plus.runtime.setBadgeNumber(0);
									plus.push.clear();
									$userInfo.removeItem('password');
									$userInfo.removeItem('companyCount');
									$controlWindow.lunchWindowShow();
									$windowManager.getLaunchWindow().loadURL('login.html');
									$controlWindow.activeWindowClose();
									$nativeUIManager.wattingClose();
								}
							} else {
								$nativeUIManager.wattingTitle('错误,请稍后再试');
								window.setTimeout(function() {
									$nativeUIManager.wattingClose();
								}, 1500);
							}
						}
					},
					error: function(jsonData) {
						$nativeUIManager.wattingTitle('错误,请稍后再试');
						window.setTimeout(function() {
							$nativeUIManager.wattingClose();
						}, 1500);
					}
				});
			}, 1000);
		}
	};
	exports.timeout = function() {
		checkTimeout(function() {
			$controlWindow.lunchWindowShow();
			$windowManager.getLaunchWindow().loadURL('timeout.html');
			$windowManager.closeAll();
		});
	};
});