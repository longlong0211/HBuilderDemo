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
		var reqUL = $('.list[dir="req"]', '.workData');
		if (reqUL) {
			$common.touchSME($('li', reqUL),
				function(startX, startY, endX, endY, event, startTouch, o) {},
				function(startX, startY, endX, endY, event, moveTouch, o) {}, function(startX, startY, endX, endY, event, o) {
					if (startX == endX && startY == endY) {
						if (!$(o).hasClass('active')) {
							var reqId = $(o).attr('reqId');
							if (reqId) {
								$(o).addClass('active');
								window.setTimeout(function() {
									$(o).removeClass('active');
									$windowManager.create('req_viewHead', '../req/viewHead.html?reqId=' + reqId + '&from=req', false, true, function(show) {
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
	loadData = function(callback, append) {
		if (!callback) {
			$nativeUIManager.watting('加载中...');
		}
		$.ajax({
			type: 'POST',
			url: $common.getRestApiURL() + '/screen/req/data',
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
								dir: 'req'
							}));
							$(dataList).each(function(i, o) {
								var desc = '<span class="t_wait">于</span> ' + o['dateTime'] +
									' <span class="t_wait">发起</span> ';
								desc += '已被';
								if (o['type'] == "task") {
									desc += ' <span class="name width-48">' + o['taskName'] + '</span>';
									if (o['applyResult'] == "1") {
										desc += ' <span class="t_croose">通过</span>';
									} else if (o['applyResult'] == "2") {
										desc += ' <span class="t_veto">否决</span>';
									} else if (o['applyResult'] == "3") {
										desc += ' <span class="t_veto">撤销</span>';
									}
								} else if (o['type'] == "manage") {
									desc += ' <span class="name width-48">' + o['manageName'] + '</span>';
									desc += ' <span class="t_croose">处理</span>';
								}
								sb.append(String.formatmodel($templete.getWorkData(batchFlag, 'N'), {
									applyName: o['applyName'] + ' <span class="t_wait">[' + o['reqNo'] + ']</span>',
									desc: desc,
									uid: o['id'],
									reqId: o['id'],
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