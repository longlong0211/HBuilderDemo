define(function(require, exports, module) {
	var $common = require('core/common');
	var $userInfo = require('core/userInfo');
	var $templete = require('core/templete');
	var $nativeUIManager = require('manager/nativeUI');
	var $windowManager = require('manager/window');
	var $controlWindow = require('manager/controlWindow');
	buildData = function(jsonData) {
		if (jsonData) {
			var commentsList = jsonData['commentsList'];
			if (commentsList && $(commentsList).size() > 0) {
				var sb=new StringBuilder();
				$(commentsList).each(function(i, o) {
					var state = o['state'];
					if (state) {
						if (state == 'wait') {
							state = 'color-a';
						}
						var typeName='';
						var type = o['type'];
						if (type) {
							if(type=='task'){
								typeName='审批人';
							}else if(type=='manage'){
								typeName='经办人';
							}
							sb.append(String.formatmodel($templete.getApproveComments(o['content']),{
								typeName:typeName,
								state:state,
								nodeUserName:o['nodeUserName'],
								desc:o['desc'],
								dateTime:o['dateTime'],
								useTime:o['useTime']
							}));
						}
					}
				});
				$('ul','.time_line').append(sb.toString());
			}

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