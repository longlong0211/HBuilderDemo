//$(function () { plusReady(); })

if (window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}

var _currentuser;

function plusReady() {
	_currentuser = userLogin();
	InitPage();
	bindEvent();
}


function InitPage(pendstyle) {
	if (!pendstyle) {
		generatedCount = 1;
	}
	var pagenum = 10;
	var pagecount = generatedCount;
	if ("refresh" == pendstyle) {
		pagecount = 1;
		pagenum = (pagenum * generatedCount);
	}

	var postdata = {
		"userid": _currentuser.id,
		"token": _currentuser.token,
		"limit": pagenum,
		"page": pagecount
	};
	if ("" != $("#searchtext").val().trim()) {
		postdata["name"] = $("#searchtext").val().trim();
	}

	$.ajax({
		type: "POST",
		url: configManager.RequstUrl + "api/agent/storelist",
		data: postdata,
		async: true
	}).done(function(data) {
		if ("success" != data.state) {
			plus.ui.alert(data.message, function() {}, configManager.alerttip, configManager.alertCtip);
			return;
		}

		var agents = data.data;
		$("#agentcount").text(agents.storecount);
		$("#cashcount").text(agents.cashcount);
		var html = [];
		$.each(agents.list, function(i, agent) {
			html.push('<div class="item-01-wrap bottom-line p-r">');
			html.push('<ul class="item-01-block">');

			var src = configManager.storeImgurl.format(agent.store.store_pic, "");
			html.push('<li class="img-part"><img width="75" height="53" src="' + src + '"> </li>');
			html.push('<li class="tips-part2"><p>支付收益：<em class="fc-org">' + agent.count.cashcount + '</em></p></li>');
			html.push('<li class="text-part85-100"><h2>' + agent.store.store_name + '</h2><h2>' + agent.store.store_address.substr(0, 8) + '...</h2></li>');

			html.push('</ul>');
			html.push('<div class="off-left-tips1"></div>');
			html.push('</div>');
		});

		if ("append" == pendstyle) {
			// 无效加载
			if (html.length == 0) {
				generatedCount = generatedCount - 1;
			}
			$("#agentlist").append($(html.join("")));
		} else {
			if (html.length == 0) {
				html.push("<div style='vertical-align: middle;text-align: center;padding-top: 30%;'>没有代理商家</div>");
			}
			$("#agentlist").html(html.join(""));
		}

    try { myScroll.refresh(); } catch (err) { }

	});

}

function bindEvent() {
	// 搜索
	$("#btnsearch").on("click", function() {
		InitPage();
	});
}


var myScroll, pullDownEl, pullDownOffset, pullUpEl, pullUpOffset, generatedCount = 1;

function loaded() {
	pullDownEl = document.getElementById('pullDown');
	pullDownOffset = pullDownEl.offsetHeight;
	pullUpEl = document.getElementById('pullUp');
	pullUpOffset = pullUpEl.offsetHeight;

	myScroll = new iScroll('wrapper', {
		useTransition: false,
		topOffset: pullDownOffset,
		onRefresh: function() {
			if (pullDownEl.className.match('loading')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉即可刷新';
			} else if (pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = '';
			}
		},
		onScrollMove: function() {
			if (this.y > 5 && !pullDownEl.className.match('flip')) {
				pullDownEl.className = 'flip';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '松开刷新...';
				this.minScrollY = 0;
			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
				pullDownEl.className = '';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉即可刷新...';
				this.minScrollY = -pullDownOffset;
			} else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				pullUpEl.className = 'flip';
				if (isDisplayPullUp()) {
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
				}
				this.maxScrollY = this.maxScrollY;
			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
				pullUpEl.className = '';
				if (isDisplayPullUp()) {
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
				}
				this.maxScrollY = pullUpOffset;
			}
		},
		onScrollEnd: function() {
			if (pullDownEl.className.match('flip')) {
				pullDownEl.className = 'loading';
				pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
				pullDownAction();
			} else if (pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				if (isDisplayPullUp()) {
					pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
					pullUpAction();
				}				
			}
		}
	});

	setTimeout(function() {
		document.getElementById('wrapper').style.left = '0';
	}, 800);
}

function isDisplayPullUp() {
	// 屏幕高度 - 滚动Div面高度 - 上拉Div在滚动Div位置
	return ($(window).height() - $("#wrapper").offset().top - $("#pullUp").position().top) < 0;
}

document.addEventListener('touchmove', function(e) {
	e.preventDefault();
}, false);

document.addEventListener('DOMContentLoaded', function() {
	setTimeout(loaded, 200);
}, false);

// 下拉
function pullDownAction() {
		setTimeout(function() {
			generatedCount = 1;
			InitPage("refresh");
		}, 1500);
	}
	// 上滑

function pullUpAction() {
	setTimeout(function() {
		generatedCount = generatedCount + 1;
		InitPage("append");
	}, 1500);
}