define(function(require, exports, module) {
	var $common = require('core/common');
	var $nativeUIManager = require('manager/nativeUI');
	var $templete = require('core/templete');
	var checkInterval = 1000 * 60 * 60 * 24;
	checkUpdateData = function(j) {
		var curVer = plus.runtime.version;
		var inf = j[plus.os.name];
		if (inf) {
			var srvVer = inf['version'];
			if (compareVersion(curVer, srvVer)) {
				$('#updateContent', '#updateTip').append(String.formatmodel($templete.getUpdate(), inf));
				$('#updateTip').show();
				$('.mask').show();

				$common.touchSE($('#cancelUpdate'), function(event, startTouch, o) {
					$(o).addClass('current');
				}, function(event, o) {
					$(o).removeClass('current');
					$('#updateTip').hide();
					$('.mask').hide();
				});

				$common.touchSE($('#nowUpdate'), function(event, startTouch, o) {
					$(o).addClass('current');
				}, function(event, o) {
					$(o).removeClass('current');
					$('#updateTip').hide();
					$('.mask').hide();
					$common.switchOS(function(){
						plus.runtime.openURL(inf['url'], function() {
							$nativeUIManager.alert('更新失败', '抱歉服务器出现临时故障', '确认', false);
						});
					},function(){
						plus.runtime.openURL(inf['url'], function() {
							$nativeUIManager.alert('更新失败', '抱歉服务器出现临时故障', '确认', false);
						});
					});
				});
			}
		}
	};
	compareVersion = function(ov, nv) {
		if (!ov || !nv || ov == "" || nv == "") {
			return false;
		}
		var b = false, ova = ov.split(".", 4), nva = nv.split(".", 4);
		for (var i = 0; i < ova.length && i < nva.length; i++) {
			var so = ova[i], no = parseInt(so), sn = nva[i], nn = parseInt(sn);
			if (nn > no || sn.length > so.length) {
				return true;
			} else if (nn < no) {
				return false;
			}
		}
		if (nva.length > ova.length && 0 == nv.indexOf(ov)) {
			return true;
		}
	};

	exports.execute = function() {
		$.ajax({
			type : 'POST',
			url : $common.getRestApiURL() + '/common/common/update',
			dataType : 'json',
			success : function(jsonData) {
				if (jsonData) {
					if (jsonData['result'] == '0') {
						var update = jsonData['update'];
						if (update) {
							checkUpdateData(update);
						}
					}
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
			}
		});
	};
});
