define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	buildReqData = function(o) {
		var dataView = new StringBuilder();
		var rowDataArray = o['rowDataArray'];
		if (rowDataArray && $(rowDataArray).size() > 0) {
			dataView.append(String.formatmodel($templete.getWorkDataViewTitle(), {
				title: '单据信息'
			}));
			dataView.append('<table>\n');
			$(rowDataArray).each(function(j, dataObj) {
				var controlType = dataObj['controlType'];
				if (controlType) {
					if (controlType != 'userName' && controlType != 'requisitionDate') {
						var preFlag = false;
						if (controlType == 'text') {
							preFlag = true;
						}
						dataView.append('<tr>\n');
						dataView.append('<th>' + dataObj['label'] + ':</th>\n');
						if (preFlag) {
							dataView.append('<td><pre>' + dataObj['value'] + '</pre></td>\n');
						} else {
							dataView.append('<td>' + dataObj['value'] + '</td>\n');
						}
						dataView.append('</tr>\n');
					}
				}
			});
			dataView.append('</table>\n');
		}

		var detailArray = o['detailArray'];
		if (detailArray && $(detailArray).size() > 0) {
			$(detailArray).each(function(j, dataObj) {
				var label = dataObj['label'];
				var itemArray = dataObj['itemArray'];
				if (itemArray && $(itemArray).size() > 0) {
					$(itemArray).each(function(ii, itemDataArray) {
						dataView.append(String.formatmodel($templete.getWorkDataViewTitle(), {
							title: '明细' + (ii + 1)
						}));
						dataView.append('<table>\n');
						var detailDataSb = new StringBuilder();
						if (itemDataArray && $(itemDataArray).size() > 0) {
							$(itemDataArray).each(function(jj, itemDataObj) {
								dataView.append('<tr>\n');
								dataView.append('<th>' + itemDataObj['label'] + ':</th>\n');
								dataView.append('<td>' + itemDataObj['value'] + '</td>\n');
								dataView.append('</tr>\n');
							});
						}
						dataView.append('</table>\n');
					});
				}
			});
		}
		return dataView.toString();
	};
	loadResult = function() {
		var resultJsonData = JSON.parse($userInfo.get('resultJsonData'));
		if (resultJsonData) {
			var sb = new StringBuilder();
			var reqList = resultJsonData['reqList'];
			if (reqList && $(reqList).size() > 0) {
				var reqCount = resultJsonData['reqCount'];
				sb.append(String.formatmodel($templete.getWorkType(), {
					dir: 'req',
					typeCount: reqCount,
					typeText: '申请'
				}));
				sb.append(String.formatmodel($templete.getWorkDataCardStart(), {
					dir: 'req'
				}));
				$(reqList).each(function(i, o) {
					var dataView = buildReqData(o['data']);
					if(dataView){
						dataView=$templete.getWorkDataViewSearch(dataView);
					}
					var desc = '<span class="name width-48">' + o['userName'] + '</span> <span class="t_wait">于</span> ' + o['dateTime'] +
						' <span class="t_wait">发起</span> ';
					sb.append(String.formatmodel($templete.getWorkData(false, 'N',dataView), {
						applyName: o['applyName'] + ' <span class="t_wait">[' + o['reqNo'] + ']</span>',
						desc: desc,
						uid: o['id'],
						reqId: o['id'],
						quickPreview: 'N',
						backYn: 'N'
					}));
				});
				sb.append(String.formatmodel($templete.getWorkDataCardEnd(), {}));
			}
			var taskList = resultJsonData['taskList'];
			if (taskList && $(taskList).size() > 0) {
				var taskCount = resultJsonData['taskCount'];
				sb.append(String.formatmodel($templete.getWorkType(), {
					dir: 'task',
					typeCount: taskCount,
					typeText: '审批'
				}));
				sb.append(String.formatmodel($templete.getWorkDataCardStart(), {
					dir: 'task'
				}));
				$(taskList).each(function(i, o) {
					var dataView = buildReqData(o['data']);
					if(dataView){
						dataView=$templete.getWorkDataViewSearch(dataView);
					}
					var desc = '<span class="name width-48">' + o['userName'] + '</span> <span class="t_wait">于</span> ' + o['dateTime'] +
						' <span class="t_wait">发起</span> ';
					sb.append(String.formatmodel($templete.getWorkData(false, 'N',dataView), {
						applyName: o['applyName'] + ' <span class="t_wait">[' + o['reqNo'] + ']</span>',
						desc: desc,
						uid: o['id'],
						reqId: o['reqId'],
						quickPreview: 'N',
						backYn: 'N'
					}));
				});
				sb.append(String.formatmodel($templete.getWorkDataCardEnd(), {}));
			}
			var manageList = resultJsonData['manageList'];
			if (manageList && $(manageList).size() > 0) {
				var manageCount = resultJsonData['manageCount'];
				sb.append(String.formatmodel($templete.getWorkType(), {
					dir: 'manage',
					typeCount: manageCount,
					typeText: '经办'
				}));
				sb.append(String.formatmodel($templete.getWorkDataCardStart(), {
					dir: 'manage'
				}));
				$(manageList).each(function(i, o) {
					var dataView = buildReqData(o['data']);
					if(dataView){
						dataView=$templete.getWorkDataViewSearch(dataView);
					}
					var desc = '<span class="name width-48">' + o['userName'] + '</span> <span class="t_wait">于</span> ' + o['dateTime'] +
						' <span class="t_wait">发起</span> ';
					sb.append(String.formatmodel($templete.getWorkData(false, 'N',dataView), {
						applyName: o['applyName'] + ' <span class="t_wait">[' + o['reqNo'] + ']</span>',
						desc: desc,
						uid: o['id'],
						reqId: o['reqId'],
						quickPreview: 'N',
						backYn: 'N'
					}));
				});
				sb.append(String.formatmodel($templete.getWorkDataCardEnd(), {}));
			}
			
			var shareList = resultJsonData['shareList'];
			if (shareList && $(shareList).size() > 0) {
				var shareCount = resultJsonData['shareCount'];
				sb.append(String.formatmodel($templete.getWorkType(), {
					dir: 'share',
					typeCount: shareCount,
					typeText: '传阅'
				}));
				sb.append(String.formatmodel($templete.getWorkDataCardStart(), {
					dir: 'share'
				}));
				$(shareList).each(function(i, o) {
					var dataView = buildReqData(o['data']);
					if(dataView){
						dataView=$templete.getWorkDataViewSearch(dataView);
					}
					var desc = '<span class="name width-48">' + o['userName'] + '</span> <span class="t_wait">于</span> ' + o['dateTime'] +
						' <span class="t_wait">发起</span> ';
					sb.append(String.formatmodel($templete.getWorkData(false, 'N',dataView), {
						applyName: o['applyName'] + ' <span class="t_wait">[' + o['reqNo'] + ']</span>',
						desc: desc,
						uid: o['id'],
						reqId: o['reqId'],
						quickPreview: 'N',
						backYn: 'N'
					}));
				});
				sb.append(String.formatmodel($templete.getWorkDataCardEnd(), {}));
			}
			$('.searchData').empty().append(sb.toString());
			bindEvent();
		}
	};
	bindEvent = function() {
		var reqUL = $('.list[dir="req"]', '.searchData');
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
		}
		var taskUL = $('.list[dir="task"]', '.searchData');
		if (taskUL) {
			$common.touchSME($('li', taskUL),
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
		}
		var manageUL = $('.list[dir="manage"]', '.searchData');
		if (manageUL) {
			$common.touchSME($('li', manageUL),
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
		}
	};
	plusReady = function() {
		loadResult();
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});