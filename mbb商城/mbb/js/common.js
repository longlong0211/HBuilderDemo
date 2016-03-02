(function(a) {
	a.initGlobal({
		optimize: true,
		swipeBack: true
	});
	a.constMap = {
		ROOT_PATH: "http://wx.chaoyingyue.com/ECMobile/?url=",
		SERVER_HOST: "http://wx.chaoyingyue.com"
	};
	a.html = function(c, b) {
		document.getElementById(c).innerHTML = b
	};
	a.val = function(c, b) {
		document.getElementById(c).value = b
	};
	a.set = function(e, b, d) {
		var c = document.getElementById(e);
		if (c) {
			if (b == "innerHTML") {
				c.innerHTML = d
			} else {
				if (b = "value") {
					c.value = d
				} else {
					c.setAttribute(b, d)
				}
			}
		}
	};
	a.get = function(d, b) {
		var c = document.getElementById(d);
		if (c) {
			if (b == "value") {
				return c.value
			} else {
				return c.getAttribute(b)
			}
		}
		return false
	};
	a.writeJson = function(b) {
		return JSON.stringify(b)
	};
	a.readJson = function(b) {
		return JSON.parse(b)
	};
	a.isEmptyObject = function(c) {
		for (var b in c) {
			return false
		}
		return true
	};
	a.getEcshopData = function(b) {
		if (!b.succeed) {
			return {
				data: {},
				status: {
					succeed: 0,
					error_desc: b.error_desc
				}
			}
		}
		if (b.retval && b.retval.status && b.retval.status.error_code == 100) {
			window.localStorage.removeItem("user")
		}
		return b.retval
	};
	a.sendRequest = function(e, h, i) {
		var b = h.config || {};
		if (typeof h.config != "undefined") {
			delete h.config
		}
		var d = {
			type: "POST",
			silence: false,
			error_show: true
		};
		for (var f in d) {
			if (b[f] != undefined) {
				d[f] = b[f]
			}
		}
		var g = {};
		var c = plus.webview.currentWebview();
		a.ajax({
			url: e,
			data: h,
			type: d.type,
			dataType: "json",
			timeout: 10000,
			beforeSend: function() {
				console.log(c.id + ":" + d.type + " " + e + " start");
				if (!d.silence) {
					plus.nativeUI.showWaiting("数据加载中，请稍后...", {
						modal: false
					})
				}
			},
			error: function(k, l, j) {
				if (!d.silence) {
					plus.nativeUI.closeWaiting()
				}
				console.log(c.id + ":" + l + " " + e + " failed, error: " + l + ", " + j + ", " + k.responseText);
				if (d.error_show) {
					if (l == "abort") {
						l = "网络连接失败"
					} else {
						if (l == "timeout") {
							l = "网络连接超时"
						}
					}
					if (j == null) {
						j = ""
					}
				}
				g = {
					success: 0,
					error_desc: l + (j ? +", " + j : "")
				};
				i(a.getEcshopData(g))
			},
			success: function(j, l, k) {
				if (!d.silence) {
					plus.nativeUI.closeWaiting()
				}
				console.log(c.id + ":" + l + " " + e + " end");
				g.succeed = 1;
				g.retval = j;
				i(a.getEcshopData(g))
			}
		})
	};
	a.addListenerBySelector = function(b, f, e, d) {
		var g = (d || document).querySelectorAll(b);
		for (var c = 0; c < g.length; c++) {
			g[c].addEventListener(f, e, false)
		}
	};
	a.toast = function(c, d) {
		if (a.os.plus) {
			plus.nativeUI.toast(c, {
				verticalAlign: "bottom"
			});
			setTimeout(function() {
				if (d) {
					d()
				}
			}, 2000)
		} else {
			var b = document.createElement("div");
			b.classList.add("mui-toast-container");
			b.innerHTML = '<div class="mui-toast-message">' + c + "</div>";
			document.body.appendChild(b);
			setTimeout(function() {
				if (d) {
					d()
				}
				document.body.removeChild(b)
			}, 2000)
		}
	}
})(mui);

function getCachedUser(e) {
	var b = window.localStorage.getItem("user");
	if (b) {
		console.log("get cached user: " + b);
		var c = JSON.parse(b);
		var a = mui.now();
		if (c.expire && c.expire > a) {
			if (e) {
				c.expire = a + 15 * 60 * 1000;
				window.localStorage.setItem("user", JSON.stringify(c))
			}
			return c
		}
		window.localStorage.removeItem("user")
	}
	return false
}

function updateCachedUser() {
	var b = window.localStorage.getItem("user");
	if (b) {
		var c = JSON.parse(b);
		var a = mui.now();
		c.expire = a + 15 * 60 * 1000;
		window.localStorage.setItem("user", JSON.stringify(c))
	}
}

function ormatDate(c, d) {
	var b = new Date(c * 1000);
	var a = b.getFullYear() + "-" + fixZero(b.getMonth() + 1, 2) + "-" + fixZero(b.getDate(), 2);
	a += d == "long" ? " " + fixZero(b.getHours(), 2) + ":" + fixZero(b.getMinutes(), 2) + ":" + fixZero(b.getSeconds(), 2) : "";
	return a
}

function fixZero(b, e) {
	var f = "" + b;
	var a = f.length;
	var d = "";
	for (var c = e; c-- > a;) {
		d += "0"
	}
	return d + f
}

function copyToClip(e) {
	if (mui.os.android) {
		var c = plus.android.importClass("android.content.Context");
		var a = plus.android.runtimeMainActivity();
		var d = a.getSystemService(c.CLIPBOARD_SERVICE);
		plus.android.invoke(d, "setText", e);
		console.log("复制到剪贴板：" + e)
	} else {
		if (mui.os.ios) {
			var b = plus.ios.importClass("UIPasteboard");
			var f = b.generalPasteboard();
			f.setValueforPasteboardType(e, "public.utf8-plain-text");
			console.log("复制到剪贴板：" + e)
		}
	}
}

function getShortUrl(a, c) {
	var b = "http://api.t.sina.com.cn/short_url/shorten.json?source=3213676317&url_long=";
	mui.sendRequest(b + escape(a), {
		config: {
			type: "GET"
		}
	}, function(d) {
		c(d)
	})
}

function loadImg(e, d) {
	var c = "_downloads/image/" + md5(e) + ".jpg";
	var a = plus.io.convertLocalFileSystemURL(c);
	var b = new Image();
	b.src = a;
	b.onload = function() {
		console.log("已存在==" + c);
		d(mui.os.ios ? c : a)
	};
	b.onerror = function() {
		console.log("不存在==" + c);
		var f = plus.downloader.createDownload(e, {
			filename: c,
			timeout: 10,
			retry: 2
		}, function(h, g) {
			console.log("下载回调status==" + g + "-->" + c);
			if (g == 200) {
				d(mui.os.ios ? c : a)
			} else {
				delFile(c);
				h.abort()
			}
		});
		f.start()
	}
}

function delFile(a) {
	plus.io.resolveLocalFileSystemURL(a, function(b) {
		b.remove(function(c) {
			console.log("文件删除成功==" + a)
		}, function(c) {
			console.log("文件删除失败=" + a)
		})
	})
}

function isWxInstalled() {
	if (mui.os.ios) {
		var a = plus.ios.import("WXApi");
		return a.isWXAppInstalled()
	}
	return true
}
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "")
};
String.prototype.ltrim = function() {
	return this.replace(/(^\s*)/g, "")
};
String.prototype.rtrim = function() {
	return this.replace(/(\s*$)/g, "")
};