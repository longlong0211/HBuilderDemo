
var _currentuser;
var _opearindex = -1;// 是否更新
function plusReady() {
    getUserInfo();
    bindEvent();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}


//var jqXHR 
function getUserInfo() {	
	_currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
	
    //商户显示“更新消息手机”
    if (2 == _currentuser.user_type) { $("#p_msgMobile").show() };
    //是否显示退出登录
    if (_currentuser) { $("#qucik").show(); }
    $("#user_image").attr("src", configManager.avatarImgurl.format(_currentuser.avatar_id, "150-150"));
    $("#nick").html(_currentuser.nick);
    $("#real_name").html(_currentuser.real_name);
    $("#name").html(_currentuser.name);

    var auth_status = "1" == _currentuser.auth_status ? "已认证" : "未认证";
    $("#auth_status").html(auth_status);
}

// 绑定事件
function bindEvent() {
    //退出登录 
    $("#qucik").on("click", function () {
        // 清空当前用户信息
        plus.storage.removeItem(storageManager.user);
        plus.storage.removeItem(storageManager.cart);
        plus.webview.getWebviewById(pageName.mine).evalJS("receivePersonEvent(1)");
        back();
    });

    // 点击认证
    $("#real_name_link,#authentication_link").on("click", function () {
        clicked("unautherized.html", false, false, 'slide-in-right');
    });

    //点击上传头像
    $("#user_image").on("click", function () {
        $("#heisebg").removeClass("heisebghid").addClass("heisebg");
        //上传图片时遮罩挡住下面导航栏了
        $("#heisebg").css("z-index", "9999");
        $("#footer").css("z-index", "0");
    });

    // 取消
    $("#cancel").on("click", function () {
        $("#heisebg").removeClass("heisebg").addClass("heisebghid");
    })

    //从相册中选择上传
    $("#album").on("click", function () {
        plus.gallery.pick(
			function (path) {
			    uploadimg(path);
			},
			function (e) {
			},
			{ filter: "image" }
		);
    });

    //调用摄像头拍照并上传
    $("#camera").on("click", function () {
        var cmr = plus.camera.getCamera(1);
        if (null != cmr) {
            //拍照
            cmr.captureImage(function (p) {
                plus.io.resolveLocalFileSystemURL(
	        	p,
	        	function (entry) {
	        	    uploadimg("file://" + entry.fullPath);
	        	},
		        function (e) {
		            plus.ui.alert(e.message, function () { }, configManager.alerttip, configManager.alertCtip);
		        }
		        );
            },
		    function (e) { },
		    { filename: "_doc/camera/" });
        }
        else {
            plus.ui.alert("没有找到摄像头", function () { }, configManager.alerttip, configManager.alertCtip);
        }

    });

    // 回退
    $("#back").on("click", function () {
        plus.webview.getWebviewById(pageName.mine).evalJS("receivePersonEvent(" + _opearindex + ")");
        plus.webview.currentWebview().close();
    });
}

// 上传图片
function uploadimg(path) {
    $("#heisebg").removeClass("heisebg").addClass("heisebghid");
    //拍照成功
    plus.nativeUI.showWaiting("  更新中...  ");
    //https://github.com/think2011/localResizeIMG3
    // 压缩图片
    lrz(path, {
        width: 300,
        height: 300,
        quality: 0.7,
        done: function (results) {
            // 上传图片
            $.ajax({
                type: "POST",
                url: configManager.RequstUrl + "api/common/base64upload",
                async: true,
                data: { base64: results.base64, size: results.base64.length, dir: "avatar" }
            }).done(function (data) {
                if (data.state != "success") { console.log(data.message); return; }
                var avatarpicid = data.id;

                // 更新用户头像               
                $.ajax({
                    type: "POST",
                    url: configManager.RequstUrl + "/api/user/updateavatar",
                    data: { "userid": _currentuser.id, "avatar": avatarpicid, "token": _currentuser.token }
                }).done(function (data) {
                    if (data.state != "success") { plus.nativeUI.closeWaiting(); console.log(data.message); return; }

                    _currentuser.avatar_id = avatarpicid;
                    plus.storage.setItem(storageManager.user, JSON.stringify(_currentuser));
                    $("#user_image").attr("src", configManager.RequstUrl + "img/avatar-" + avatarpicid + "/150-150");
                    plus.nativeUI.closeWaiting();
                    _opearindex = 0;
                });

            }).fail(function () {
                plus.nativeUI.toast("上传失败！");
                plus.nativeUI.closeWaiting();
            });
        }

    });
}

// 实名认证
function receiveUnAuthEvent() {
    _currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
    $("#real_name").html(_currentuser.real_name);
    var auth_status = "1" == _currentuser.auth_status ? "已认证" : "未认证";
    $("#auth_status").html(auth_status);
}


