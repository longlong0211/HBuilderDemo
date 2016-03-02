define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var currentWindow;
	var nextIndex = 0;
	onRefresh = function() {
		nextIndex = 0;
		$('.workData').attr('nextIndex', 0);
		window.setTimeout(function() {
			loadData(function() {
				currentWindow.endPullToRefresh();
			});
		}, 500);
	};
	pullToRefreshEvent = function() {
		currentWindow = $windowManager.current();
		currentWindow.setPullToRefresh({
			support: true,
			height: "50px",
			range: "200px",
			contentdown: {
				caption: "下拉可以刷新"
			},
			contentover: {
				caption: "释放立即刷新"
			},
			contentrefresh: {
				caption: "正在刷新..."
			}
		}, onRefresh);
	};
	bindEvent = function() {
		var shareUL = $('.list[dir="share"]', '.workData');
		if (shareUL) {
			$common.touchSME($('li', shareUL),
				function(startX, startY, endX, endY, event, startTouch, o) {},
				function(startX, startY, endX, endY, event, moveTouch, o) {}, function(startX, startY, endX, endY, event, o) {
					if (startX == endX && startY == endY) {
						if (!$(o).hasClass('active')) {
							var reqId = $(o).attr('reqId');
							if (reqId) {
								$(o).addClass('active');
								window.setTimeout(function() {
									$(o).removeClass('active');
									$windowManager.create('req_viewHead', '../req/viewHead.html?reqId=' + reqId + '&from=share', false, true, function(show) {
										show();
									});
								}, 100);
							}
						}
					}
				});
			document.addEventListener("plusscrollbottom", function() {
				var next = $('.workData').attr('nextIndex');
				if (next) {
					if (next > 0) {
						nextIndex = next;
						$nativeUIManager.watting('正在加载更多...');
						$('.workData').attr('nextIndex', 0);
						window.setTimeout(function() {
							loadData(function() {
								$nativeUIManager.wattingClose();
							}, true);
						}, 500);
					}
				}
			});
		}
	};
	loadData = function(callback,append) {
		if (!callback) {
			$nativeUIManager.watting('加载中...');
		}
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/screen/share/data',
			dataType: 'json',
			data: {
				oaToken: $userInfo.get('token'),
				start: nextIndex > 0 ? nextIndex : ''
			},
			success: function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var dataList = jsonData['dataList'];
						var sb = new StringBuilder();
						if (dataList && $(dataList).size() > 0) {
							var batchFlag = false;
							sb.append(String.formatmodel($templete.getWorkDataCardStart(), {
								dir: 'share'
							}));
							$(dataList).each(function(i, o) {
								var desc = '<span class="name width-48">' + o['userName'] + '</span> <span class="t_wait">于</span> ' + o['dateTime'] +
									' <span class="t_wait">发起</span> ';
								desc += '由 <span class="name width-48">' + o['ownerName'] + '</span> 传阅到您';
								sb.append(String.formatmodel($templete.getWorkData(batchFlag, 'N'), {
									applyName: o['applyName'] + ' <span class="t_wait">[' + o['reqNo'] + ']</span>',
									desc: desc,
									uid: o['reqId'],
									reqId: o['reqId'],
									quickPreview: 'N',
									backYn: o['backYn']
								}));
							});
							sb.append(String.formatmodel($templete.getWorkDataCardEnd(), {}));
						} else {
							sb.append(String.formatmodel($templete.getBankData(), {
								img: '../../img/nodata.png'
							}));
						}
						if (append) {
							$('.workData').append(sb.toString());
						} else {
							$('.workData').empty().append(sb.toString());
						}
						nextIndex=0;
						$('.workData').attr('nextIndex', 0);
						var page = jsonData['page'];
						if (page) {
							if (page['hasNextPage'] == true) {
								$('.workData').attr('nextIndex', page['nextIndex']);
							}
						}
						bindEvent();
						pullToRefreshEvent();
						if (!callback) {
							$nativeUIManager.wattingClose();
						}
						if (typeof callback == 'function') {
							callback();
						}
					} else {
						if (!callback) {
							$nativeUIManager.wattingTitle('未知错误');
						} else {
							$nativeUIManager.watting('未知错误');
						}
						window.setTimeout(function() {
							$nativeUIManager.wattingClose();
							if (typeof callback == 'function') {
								callback();
							}
						}, 1500);
					}
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				if (!callback) {
					$nativeUIManager.wattingTitle('未知错误');
				} else {
					$nativeUIManager.watting('未知错误');
				}
				window.setTimeout(function() {
					$nativeUIManager.wattingClose();
					if (typeof callback == 'function') {
						callback();
					}
				}, 1500);
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