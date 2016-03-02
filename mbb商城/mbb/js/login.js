var auths = {};

function initLoginAuth(a) {
	plus.oauth.getServices(function(e) {
		for (var f in e) {
			var d = e[f];
			auths[d.id] = d;
			console.log("已获取" + d.id + "登陆服务")
		}
		if (a) {
			a()
		}
	}, function(b) {
		mui.toast("获取登录认证失败：" + b.message)
	})
}

function checkLogin() {
	var e = (typeof arguments[0] == "undefined" || typeof arguments[0] == "object" || arguments[0] == 1);
	if (typeof user == "undefined") {
		window.user = false
	}
	if (!(user = getCachedUser())) {
		if (!e) {
			return false
		}
		var d = window.localStorage.getItem("login");
		if (d) {
			console.log("使用已保存的unionid登陆");
			var c = JSON.parse(d);
			if (c.unionid) {
				wxLogin(c)
			} else {
				wxLoginShow()
			}
		} else {
			mui.openWindow({
				id: "login.html",
				url: "login.html",
				waiting: {
					autoShow: true
				}
			})
		}
	}
	return true
}

function wxLogin(b) {
	mui.sendRequest(mui.constMap.ROOT_PATH + "/user/signin", {
		unionid: b.unionid,
		userinfo: b
	}, function(j) {
		if (!j.status.succeed) {
			window.localStorage.removeItem("user");
			window.localStorage.removeItem("login");
			var h = auths.weixin;
			if (h) {
				h.logout(function() {
					console.log('注销"' + h.description + '"成功')
				}, function(c) {
					console.log('注销"' + h.description + '"失败：' + erros.message)
				})
			}
			mui.alert(j.status.error_desc);
			return
		}
		j.data.expire = mui.now();
		j.data.expire += 15 * 60 * 1000;
		window.localStorage.setItem("user", JSON.stringify(j.data));
		window.localStorage.setItem("login", JSON.stringify(b));
		mui.toast("登陆成功");
		var g = plus.webview.getWebviewById("cart.html"),
			i = plus.webview.getWebviewById("home.html");
		mui.fire(g, "refresh", {
			action: "login"
		});
		mui.fire(i, "refresh", {
			action: "login"
		});
		var a = plus.webview.currentWebview();
		if (a.id == "login.html") {
			mui.back()
		}
	})
}

function wxLoginShow() {
	var b = auths.weixin;
	if (b) {
		b.login(function() {
			console.log("登录认证成功：");
			console.log(JSON.stringify(b.authResult));
			getWXUserinfo(b)
		}, function(a) {
			console.log("登录认证失败：");
			console.log("[" + a.code + "]：" + a.message);
			if (a.code != -2 && a.code != -100) {
				mui.alert("微信登陆失败，错误代码：" + a.code)
			}
		})
	} else {
		console.log("无效的登录认证通道！");
		mui.toast("无效的登录认证通道！")
	}
}

function getWXUserinfo(a) {
	console.log("----- 获取用户信息 -----");
	a.getUserInfo(function() {
		console.log("获取用户信息成功：");
		console.log(JSON.stringify(a.userInfo));
		wxLogin(a.userInfo)
	}, function(b) {
		console.log("获取用户信息失败：");
		console.log("[" + b.code + "]：" + b.message);
		mui.alert("获取用户信息失败！")
	})
}

function logout(c) {
	mui.sendRequest(mui.constMap.ROOT_PATH + "/user/logout", {}, function(a) {
		if (!a.status.succeed) {
			mui.alert(a.status.error_desc);
			return
		}
		window.localStorage.removeItem("user");
		window.localStorage.removeItem("login");
		var b = plus.webview.getWebviewById("cart.html"),
			f = plus.webview.getWebviewById("home.html");
		mui.fire(b, "refresh", {
			action: "logout"
		});
		mui.fire(f, "refresh", {
			action: "logout"
		});
		if (c) {
			c()
		}
		mui.toast("您已成功退出")
	});
	var d = auths.weixin;
	if (d) {
		d.logout(function() {
			console.log('注销"' + d.description + '"成功')
		}, function(a) {
			console.log('注销"' + d.description + '"失败：' + a.message)
		})
	}
};