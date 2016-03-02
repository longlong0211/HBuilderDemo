function plusReady() {
    //初始化
    init();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}



var imageStr = "<div style='display:inline-block' onclick='javascript:$(this).remove();' class=\"zctudw\"><b style='margin-left:85px'><i class=\"remove circle icon\"></i></b><img style='width:90px;height:60px;' class='id_pic' title=\"{0}\"  src=\"{1}\"></div>";

function init() {
    var user = userLogin();
    $("#real_name").val(user.real_name);
    $("#id_no").val(user.id_no);
    var src = "";
    console.log(JSON.stringify(user));
    if (user.id_pic1 > 0) {

        src = configManager.authImgurl.format(user.id_pic1, "90-60");
        $("#addImage").parent().before(imageStr.format(user.id_pic1, src));
    }
    if (user.id_pic2 > 0) {
        src = configManager.authImgurl.format(user.id_pic2, "90-60");
        $("#addImage").parent().before(imageStr.format(user.id_pic2, src));
    }
    if (user.id_pic3 > 0) {
        src = configManager.authImgurl.format(user.id_pic3, "90-60");

        $("#addImage").parent().before(imageStr.format(user.id_pic3, src));
    }
    //添加图片
    $("#addImage").on("click", function () {
        if (3 > $(".id_pic").length) {
            $("#heisebg").removeClass("heisebghid").addClass("heisebg");
        }
    });

    $("#cancel").on("click", function () {
        $("#heisebg").removeClass("heisebg").addClass("heisebghid");
    });

    //从相册中上传
    $("#album").on("click", function () {
        plus.gallery.pick(
            function (path) {
                //选择成功
                $("#heisebg").removeClass("heisebg").addClass("heisebghid");
                $("#waitingupload").removeClass("heisebghid").addClass("heisebg");
                var task = plus.uploader.createUpload(configManager.RequstUrl + "/api/common/upload",
                    { method: "POST", blocksize: 102400, priority: 100 },
                    function (upload, status) {
                        // 上传完成
                        if (status == 200) {
                            var data = JSON.parse(upload.responseText);

                            var src = configManager.authImgurl.format(data.id, "90-60");

                            console.log("Upload success: responseText = " + upload.responseText + " src=" + src);
                            $("#addImage").parent().before(imageStr.format(data.id, src));
                            $("#waitingupload").removeClass("heisebg").addClass("heisebghid");
                        } else {
                            console.log("Upload failed: " + status);
                        }
                    }
                );
                console.log(path);
                task.addFile(path, { key: "file" });
                task.addData("dir", "auth");
                task.start();
            },
            function (e) {
                console.log(e);
            },
            { filter: "image" }
        );
    });


    $("#camera").on("click", function () {
        var cmr = plus.camera.getCamera(1);
        if (null != cmr) {
            //拍照
            cmr.captureImage(function (p) {
                plus.io.resolveLocalFileSystemURL(
	        	p,
	        	function (entry) {
	        	    //拍照成功
	        	    $("#heisebg").removeClass("heisebg").addClass("heisebghid");
	        	    $("#waitingupload").removeClass("heisebghid").addClass("heisebg");
	        	    //上传图片
	        	    var task = plus.uploader.createUpload(configManager.RequstUrl + "/api/common/upload",
						{ method: "POST", blocksize: 102400, priority: 100 },
						function (upload, status) {
						    // 上传完成
						    if (status == 200) {
						        var data = JSON.parse(upload.responseText);
						        var src = configManager.authImgurl.format(data.id, "90-60");
						        console.log("Upload success: responseText = " + upload.responseText + " src=" + src);

						        $("#addImage").parent().before(imageStr.format(data.id, src));

						        $("#waitingupload").removeClass("heisebg").addClass("heisebghid");
						    } else {
						        console.log("Upload failed: " + status);
						    }
						}
					);
	        	    console.log(entry.fullPath);
	        	    task.addFile("file://" + entry.fullPath, { key: "file" });
	        	    task.addData("dir", "store");
	        	    task.start();

	        	},
		        function (e) { plus.ui.alert(e.message, function () { }, configManager.alerttip, configManager.alertCtip); }
		        );
            },
		    function (e) { },
		    { filename: "_doc/camera/" });
        }
        else {
            plus.ui.alert("没有找到摄像头", function () { }, configManager.alerttip, configManager.alertCtip);
        }
    });

    //提交
    $("#commitauth").on("click", function () {
        if ("" == $("#real_name").val().trim()) {
            plus.nativeUI.alert("请填写真实姓名");
            return false;
        }
        if ("" == $("#id_no").val().trim()) {
            plus.nativeUI.alert("请填写身份证号");
            return false;
        }
        if (!isIDno($("#id_no").val())) {
            plus.nativeUI.alert("身份证号格式不正确");
            return false;
        }

        $.ajax({
            type: "POST",
            url: configManager.RequstUrl + "api/user/updateauth",
            async: true,
            data: {
                "userid": user.id,
                "token": user.token,
                "realname": $("#real_name").val().trim(),
                "idno": $("#id_no").val().trim(),
                "idpic1": $($(".id_pic")[0]).attr("title"),
                "idpic2": $($(".id_pic")[1]).attr("title"),
                "idpic3": $($(".id_pic")[2]).attr("title"),
            }
        }).done(function (data) {
            if ("success" == data.state) {
                //更新会话
                user.id_no = data.user.id_no;
                user.real_name = data.user.real_name;
                user.id_pic1 = data.user.id_pic1;
                user.id_pic2 = data.user.id_pic2;
                user.id_pic3 = data.user.id_pic3;
                plus.storage.setItem(storageManager.user, JSON.stringify(user));

                plus.nativeUI.alert(data.message, function () {
                    // 更新个信息
                    plus.webview.currentWebview().opener().evalJS("receiveUnAuthEvent()");
                    plus.webview.currentWebview().close();
                });
            }
            else {
                plus.nativeUI.alert(data.message);
            }
        });


    });



}