define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	buildData = function(jsonData) {
		if (jsonData) {
			$('#userName').text(jsonData['userName']);
			$('#reqNo').text(jsonData['reqNo']);
			$('#sendDate').text(jsonData['sendDate']);
			var reqViewDataSb = new StringBuilder();
			var rowDataArray = jsonData['rowDataArray'];
			if (rowDataArray && $(rowDataArray).size() > 0) {
				$(rowDataArray).each(function(i, o) {
					var controlType = o['controlType'];
					if (controlType) {
						if (controlType != 'userName' && controlType != 'requisitionDate') {
							var preFlag = false;
							if (controlType == 'text') {
								preFlag = true;
							}
							reqViewDataSb.append(String.formatmodel($templete.getReqViewRowData(preFlag), {
								label: o['label'],
								value: o['value']
							}));
						}
					}
				});
				$('#reqViewData').empty().append(reqViewDataSb.toString());
			}
			var reqViewDetailDataSb = new StringBuilder();
			var detailArray = jsonData['detailArray'];
			if (detailArray && $(detailArray).size() > 0) {
				$(detailArray).each(function(i, o) {
					var label = o['label'];
					var itemArray = o['itemArray'];
					if (itemArray && $(itemArray).size() > 0) {
						$(itemArray).each(function(ii, itemDataArray) {
							var detailDataSb = new StringBuilder();
							if (itemDataArray && $(itemDataArray).size() > 0) {
								$(itemDataArray).each(function(jj, itemDataObj) {
									detailDataSb.append(String.formatmodel($templete.getReqViewRowData(), {
										label: itemDataObj['label'],
										value: itemDataObj['value']
									}));
								});
							}
							reqViewDetailDataSb.append(String.formatmodel($templete.getReqViewDetailData(detailDataSb.toString()), {
								label: '明细' + (ii + 1)
							}));
						});
					}
				});
				$('#reqDataContainer').append(reqViewDetailDataSb.toString());
			}
			$('section', '#reqDataContainer').last().css('paddingBottom', '0px');
		}
	};
	loadData = function(jsonData) {
		buildData(jsonData);
	};
	plusReady = function() {
		loadData(JSON.parse($userInfo.get('reqJsonData')));
	};
	if (window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", plusReady, false);
	}
});