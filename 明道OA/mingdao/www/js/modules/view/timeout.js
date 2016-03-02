define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $authorize = require('core/authorize');
	var $windowManager = require('manager/window');
	plusReady = function() {
		if ($userInfo.isAuthorize()) {
			$authorize.login($userInfo.get('companyId'), $userInfo.get('account'), $userInfo.get('password'), function() {
				$windowManager.load('home.html');
			}, function() {
				$windowManager.load('login.html');
			});
		} else {
			$windowManager.load('login.html');
		}
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});