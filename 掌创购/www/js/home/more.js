function plusReady() {
    // 解决部分魅族，大神手机某项页面不执行PlusReady方法
    var pages = JSON.parse(plus.storage.getItem(storageManager.exctPlusReadyPages));
    pages.push(pageName.more);
    plus.storage.setItem(storageManager.exctPlusReadyPages, JSON.stringify(pages));
    
    init();
    bindEvent();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}


function init() {
	plus.runtime.getProperty(plus.runtime.appid,function(infor){
		$("#cur_version").html(infor.version);
	});
}

function bindEvent() {
    //	//用户协议
    //	$("#userprotocol").on("click", function(){
    //		clicked("../account/agreement.html?mark=agreement",false,false,"slide-in-right");
    //	});
    //注册协议
    $("#regisgerprotocol").on("click", function () {
        var page = "../account/agreement.html?mark=protocol";
        var user = JSON.parse(plus.storage.getItem(storageManager.user));
        if ('' != user && null != user && null != user.user_type && ([2, 3].indexOf(user.user_type) > -1)) {
            page = "../account/agreement.html?mark=agreement";
        }
        clicked(page, false, false, "slide-in-right");
    });
    //问题指南
    $("#guide").on("click", function () {
        clicked("../account/agreement.html?mark=guide", false, false, "slide-in-right");
    });
    //分享返利
    $("#about").on("click", function () {
        clicked("../account/agreement.html?mark=about", false, false, "slide-in-right");
    });

    //添加图片
    $("#addimage").on("click", function () {
        $("#heisebg").removeClass("heisebghid").addClass("heisebg");
    });
    //取消
    $("#cancel").on("click", function () {
        $("#heisebg").removeClass("heisebg").addClass("heisebghid");
    });

    //相册选择
    $("#album").on("click", function () {
        plus.gallery.pick(
            function (path) { uploadImage(path); },
            function (e) { console.log(e); },
            { filter: "image" }
        );
    });

    //摄像头拍照
    $("#camera").on("click", function () {
        var cmr = plus.camera.getCamera(1);
        if (null != cmr) {
            //拍照
            cmr.captureImage(function (p) {
                plus.io.resolveLocalFileSystemURL(p,
                function (entry) { uploadImage("file://" + entry.fullPath); },
                function (e) { plus.nativeUI.alert(e.message); });
            },
            function (e) { },
            { filename: "_doc/camera/" });

        }
        else {
            plus.nativeUI.alert("没有找到摄像头");
        }

    });

    $("#sendfeed").on("click", function () {

        //		alert("aa");
        //		return false;

        if ("" == $("#conent").val().trim()) {
            plus.ui.alert("请填写反馈内容", function () { }, configManager.alerttip, configManager.alertCtip);
            return false;
        }
        var user = JSON.parse(plus.storage.getItem(storageManager.user));
        var postdata = {};
        if (null != user && user.id > 0) {
            postdata.userid = user.id;
        }

        postdata.content = $("#conent").val().trim();

        var pics = [];
        $.each($(".feedimg"), function (i, img) {
            pics.push($(this).attr("id"));
        });
        postdata.pics = pics;

        //		console.log(JSON.stringify(postdata));

        $.ajax({
            type: "POST",
            url: configManager.RequstUrl + "api/common/feed",
            async: true,
            data: postdata
        }).done(function (data) {
            //			console.log(JSON.stringify(data));
            plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
            if ("success" == data.state) {
                $("#conent").val("");
                $(".feedimg").remove();
            }
        });
    });

}

function uploadImage(path) {
    plus.nativeUI.showWaiting("  请稍后...  ");
    //上传图片
    var task = plus.uploader.createUpload(configManager.RequstUrl + "api/common/upload",
        { method: "POST", blocksize: 102400, priority: 100 },
        function (upload, status) {
            // 上传完成
            if (status == 200) {
                var data = JSON.parse(upload.responseText);
                var src = configManager.feedImgurl.format(data.id, "120-80");
                $("#addimage").before('<img id="' + data.id + '" class="feedimg" onclick="javascript:$(this).remove();" src="' + src + '">');
                plus.nativeUI.closeWaiting();
            } else {
                console.log("Upload failed: " + status);
            }
        }
    );
    task.addFile(path, { key: "file" });
    task.addData("dir", "store");
    task.start();
}




