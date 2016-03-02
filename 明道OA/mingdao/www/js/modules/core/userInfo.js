define(function(require, exports, module) {
	exports.isSupport = function(localStorageJson) {
		return window.localStorage;
	};
	exports.putJson = function(localStorageJson) {
		if (window.localStorage) {
			if (localStorageJson) {
				for (var key in localStorageJson) {
					if(typeof localStorageJson[key]=='object'){
						localStorage.setItem(key, JSON.stringify(localStorageJson[key]));
					}else{
						localStorage.setItem(key, localStorageJson[key].toString());
					}
				}
			}
		}
	};
	exports.put = function(key, value) {
		if (window.localStorage) {
			localStorage.setItem(key, value);
		}
	};
	exports.removeItem = function(key) {
		if (window.localStorage) {
			localStorage.removeItem(key);
		}
	};
	exports.get = function(key) {
		if (window.localStorage) {
			return $.trim(localStorage.getItem(key));
		}
	};
	exports.isAuthorize = function() {
		var flag = false;
		if (window.localStorage) {
			var authorize = localStorage.getItem('authorize');
			if (authorize && authorize == '0') {
				var account = localStorage.getItem('account');
				var password = localStorage.getItem('password');
				var companyId = localStorage.getItem('companyId');
				if (account && password&&companyId) {
					if ($.trim(account).length > 0 && $.trim(password).length > 0&&$.trim(companyId).length > 0) {
						flag = true;
					}
				}
			}
		}
		return flag;
	};
	exports.isAuthorizeDay = function() {
		var flag = false;
		if (window.localStorage) {
			var authorizeDay = localStorage.getItem('authorizeDay');
			if (authorizeDay && authorizeDay == '1') {
				flag=true;
			}
		}
		return flag;
	};
});
