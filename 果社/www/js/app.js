(function($, owner) {
	owner.login = function(loginInfo, callback) {

		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';

		mui.ajax('http://www.guoshe.cc/tools/usermsg.ashx?action=user_login&account=' + loginInfo.account + '&password=' + loginInfo.password, {
			//	  	        data: {
			//                  "account": loginInfo.account,
			//                  "password": loginInfo.password
			//              },
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if (data.status == 1) {
					var state = owner.getState();
					state.account = loginInfo.account;
					state.token = "token123456789";
					owner.setState(state);
					var regInfo = {
						account: loginInfo.account,
						password: loginInfo.password
					};
					var users = JSON.parse(localStorage.getItem('$users') || '[]');
					users.push(regInfo);
					localStorage.setItem('$users', JSON.stringify(users));

					return callback();
				} else {
					return callback(data.msg);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log(type);
			}
		});
	};
	
	owner.loginwx = function(loginInfo, callback) {

		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';

		mui.ajax('http://www.guoshe.cc/tools/usermsg.ashx?action=user_loginapp&nickname=' + loginInfo.nickname +'&unionid='+ loginInfo.account+'&openid=' + loginInfo.openid+ '&sex=' + loginInfo.sex+ '&headimgurl=' + loginInfo.headimgurl, {
			//	  	        data: {
			//                  "account": loginInfo.account,
			//                  "password": loginInfo.password
			//              },
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) { 
				if (data.status == 1) {
					var state = owner.getState();
					state.account = loginInfo.account;
					state.token = "token123456789";
					owner.setState(state);
					var regInfo = {
						nickname: loginInfo.nickname,
						headimgurl: loginInfo.headimgurl,
						account: loginInfo.account,
						password: loginInfo.openid
					};
					var users = JSON.parse(localStorage.getItem('$users') || '[]');
					users.push(regInfo);
					localStorage.setItem('$users', JSON.stringify(users)); 
					return callback(); 
				} else
				{ 
					 return callback(data.msg); 
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log(type);
			}
		});
	};
	
	
	
	owner.reg = function(regInfo, callback) {
		localStorage.clear();
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		regInfo.telephone = regInfo.telephone || '';
		regInfo.txtCode = regInfo.txtCode || '';
		if (regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if (regInfo.telephone.length < 11) {
			return callback('电话最短需要 11个字符');
		}

		mui.ajax('http://www.guoshe.cc/tools/usermsg.ashx?action=user_register', {
			data: {
				"account": regInfo.account,
				"password": regInfo.password,
				"telephone": regInfo.telephone,
				"txtCode": regInfo.txtCode,
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if (data.status == 1) {
					
					//注册成功直接登录
                    var state = owner.getState();
					state.account = regInfo.account;
					state.token = "token123456789";
					owner.setState(state);
					var regInfo = {
						account: regInfo.account,
						password: regInfo.password
					};
					var users = JSON.parse(localStorage.getItem('$users') || '[]');
					users.push(regInfo);
					localStorage.setItem('$users', JSON.stringify(users));

					mui.toast(data.msg);
					plus.nativeUI.toast('注册成功！');
					plus.webview.getWebviewById("reg").close();
					return callback();
				} else {
					console.log(data.status);
					mui.toast(data.msg);
					return callback(data.msg);
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				console.log("ddd");
				console.log(type);
				console.log(errorThrown);
				plus.nativeUI.toast(err);
			}
		});


		return callback();
	};
	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		owner.setState(state);
		return callback();
	};
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
		var settings = owner.getSettings();
		settings.gestures = '';
		owner.setSettings(settings);
	};
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
}(mui, window.app = {}));