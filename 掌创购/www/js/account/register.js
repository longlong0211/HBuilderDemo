//$(function () { Init(); });
function plusReady() {
    Init();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

function Init() {
    // 获取参数
    var code = getUrlParam("code");
    var invateUserType = getUrlParam("type"); //"3EDF" ;
    wait = configManager.senddelay;
    // 用户类型 1：普通用户； 2：商家； 3：商家子账号； 4：代理； 5：代理子账号； 6：后台管理人员
    // 只能注册会员不能商家入住
    //  console.log("invateUserType="+invateUserType);
    //  console.log("isonlyRegisterAccount="+isonlyRegisterAccount);

    //暂时关闭商家入驻功能
    //var isonlyRegisterAccount = ( (null != invateUserType) && (["1","2","3"].indexOf(invateUserType) > -1));
    var isonlyRegisterAccount = true;
    PaintPage(isonlyRegisterAccount, code);
    BindEvent(isonlyRegisterAccount);

    if (!isonlyRegisterAccount) {
        //类目
        getCategory(0);
        bindSubcagegory();

        //区域
        getProv();
        bindCity();
        bindArea();
        bindDistrict();

        //图片
        bindUpdaloadPic();
    }
}

function PaintPage(isonlyRegisterAccount, barcode) {
    var html = [];

    //暂时关闭商家入驻功能
    /*
    html.push("<div class='zcqh'><a tip='account' class='tabcurrent' name='regtab'>会员注册</a>");

	if (!isonlyRegisterAccount) {
		html.push("<a tip='shop' name='regtab'>入驻店铺</a>");
	}
	html.push("</div>");
    $("#tabitem").html(html.join(""));
    */
    html = [];
    html.push("<div class='dengluym'><div class='dlnr'>");
    html.push("<p><input id='name' type='tel' placeholder='请输入手机号码' value='' class='dlsjh'></p>");
    html.push("<p><input type='password' id='password' placeholder='请输入密码' value='' class='dlmm'></p>");

    html.push("<p class='zcyzm'><b>验证码</b>");
    html.push("<input type='tel' style='width:100px; height:24px;' id='validatecode' placeholder='请输入验证码' value=''>");
    html.push("<input id='sendvalidatecode' value='获取验证码' type='button' style='font-weight:bold;height:34px;width:6em;font-size:1.2em;background:#ff6634;color:#fff;border-radius:6px;line-height:normal; border:none; margin-left:5px; margin-top:2px;'/>");
    html.push("<input id='hidvalidatecode' type='hidden' value='' />");
    html.push("<input id='hidvalidatemobile' type='hidden' value='' />");
    html.push("</p>");

    html.push("<p class='zcyzm'><b>邀请码</b><input id='shopcode' placeholder='请输入邀请码' style='width:195px; height:24px;' value=''></p>");
    html.push("<p class='zcxy' style='text-align:center'><label><input id='checkaggree' type='checkbox' value='1' />同意</label><span id='agreement'>《掌创购用户注册协议》</span></p>");
    html.push("</div></div>");
    $("#accountregister").html(html.join("")); html = [];
    if (barcode) { $("#shopcode").val(barcode).attr("readonly", "readonly"); }

    if (!isonlyRegisterAccount) {
        html.push("<div class='dengluym'><div class='dlnr'>");
        html.push("<p><input type='tel' placeholder='请输入手机号码' id='name' value='' class='dlzh'></p>");
        html.push("<p><input placeholder='请输入密码' id='password' type='password' value='' class='dlmm'></p>");
        html.push("<p><input placeholder='请输入店铺名称' id='store_name' value='' class='dldpm1'></p>");
        html.push("<p><input placeholder='请输入地址' id='store_address' value='' class='dladdress'></p>");
        html.push("<p><input type='tel' placeholder='联系电话' id='store_phone' value='' class='dllxdh'></p>");
        html.push("<p><input placeholder='负责人姓名' id='real_name' value='' class='dlfzr'></p>");
        html.push("<p><input placeholder='请输入身份证号' id='id_no' value='' class='dldz'></p>");
        html.push("<p><input placeholder='营业时间' id='store_hours' value='' class='dlfzr'></p>");
        html.push("<div class='login-select-wrap'><ul>");
        html.push("<li> <label class='label'>主营类目：</label><span> <select id='category'><option value='0'>请选择</option></select><i class=\"angle right icon\"></i> <select id='subcategory'><option value='0'>请选择</option></select></span></li>");

        html.push("<li> <label class='label'>外卖支持：</label><span> <input name='is_takeaway' type='radio' value='1' id='itakeaway_1' /><label for='itakeaway_1'>支持</label>  <input name='is_takeaway' checked='checked' type='radio' value='0' id='itakeaway_0' /><label for='itakeaway_0'>不支持</label>  </span></li>");
        html.push("<li> <label class='label'>免预约：</label><span> <input name='is_noreserve' id='noreserve_1' type='radio' value='1' /><label for='noreserve_1'>支持</label> <input name='is_noreserve' checked='checked' id='noreserve_0' type='radio' value='0' /><label for='noreserve_0'>不支持</label></span></li>");
        html.push("<li> <label class='label'>随时退：</label><span> <input name='is_refund' id='refund_1' type='radio' value='1' /><label for='refund_1'>支持</label> <input name='is_refund' id='refund_0' checked='checked' type='radio' value='0' /><label for='refund_0'>不支持</label></span></li>");

        html.push("<li><label class='label'>所在省份：</label><span><select style='width:100%' id='prov'><option value='0'>请选择</option></select></span></li>");
        html.push("<li><label class='label'>所在城市：</label><span><select style='width:100%' id='city'><option value='0'>请选择</option></select></span></li>");
        html.push("<li><label class='label'>所在区县：</label><span><select style='width:100%' id='area'><option value='0'>请选择</option></select></span></li>");
        html.push("<li><label class='label'>所属商圈：</label><span><select style='width:100%' id='dist'><option value='0'>请选择</option></select></span></li>");
        html.push("<li><label>店铺介绍：</label><span> <textarea id='store_intro'></textarea></span></li>");
        html.push("</ul></div>");
        html.push("<div class='zcsctu'>");
        html.push("<input type='hidden' id='hid_store_pic' /><span><a id='pick_store_pic'><img src='../../images/rz7.jpg' /></a></span><p>店铺照片点击上传图片（1张）</p>");
        html.push("</div>");
        html.push("<div class='zcsctu'><span><a id='pick_id_pic'><img src='../../images/rz7.jpg' /></a></span><p>负责人身份证（正反面、本人手持）点击上传图片（共3张）</p></div>");
        html.push("<div class='zcsctu'><span><a id='pick_store_license'><img src='../../images/rz7.jpg' /></a></span><p>营业执照点击上传图片<b>（可选）</b></p></div>");

        //银行
        html.push("<div class='zcjsyhxx'><h2>结算银行信息</h2>");
        html.push("<p><input type='tel' id='cardno' placeholder='卡号' /></p>");
        html.push("<p><input id='branch' placeholder='开户支行' /></p>");
        html.push("<p><input id='person' placeholder='姓名（开户人必须是负责人）' /></p>");
        html.push("</div>");

        //添加验证码
        html.push("<p class='zcyzm'><b>验证码</b>");
        html.push("<input type='tel' style='width:100px; height:24px;line-height: normal;' id='validatecode' placeholder='请输入验证码' value=''>");
        html.push("<input id='sendvalidatecode' value='获取验证码' type='button' style='font-weight:bold;height:34px;width:6em;font-size:1.2em;background:#ff6634;color:#fff;border-radius:6px;line-height:normal; border:none; margin-left:5px; margin-top:2px;'/>");
        html.push("<input id='hidvalidatecode' type='hidden' value='' />");
        html.push("<input id='hidvalidatemobile' type='hidden' value='' />");
        html.push("</p>");

        html.push("<p class='zcyzm'><b>代理商编码</b><input id='agentcode' placeholder='请输入代理商编码' value=''></p>");
        html.push("<p class='zcxy' style='text-align:center'><label><input id='checkaggree' type='checkbox' value='' />同意</label><span  id='agreement'>《掌创购用户注册协议》</span></p>");
        html.push("</div></div>");
        $("#shopregister").html(html.join(""));
        if (barcode) { $("#agentcode").val(barcode).attr("readonly", "readonly"); }
    }

    $("#save").html("<div class='dlkuang'><p class='dlan'><a id='saveInfo'>完成注册</a></p></div>");
}

function BindEvent(isonlyRegisterAccount) {


    $("#accountregister").on("click", "#sendvalidatecode", function () {

        //  	console.log("#accountregister #name = " + $("#accountregister #name").val());
        //  	return false;    	
        change_code(this,
        			$("#accountregister #name"),
        			$("#accountregister #hidvalidatecode"),
        			$("#accountregister #hidvalidatemobile"));

    });

    $("#shopregister").on("click", "#sendvalidatecode", function () {

        //  	console.log("#shopregister #hidvalidatecode=" + $("#shopregister #name").val() );
        //  	return false;

        change_code(this,
        			$("#shopregister #name"),
        			$("#shopregister #hidvalidatecode"),
        			$("#shopregister #hidvalidatemobile"));

    });

    //用户注册协议
    $("#accountregister").on("click", "#agreement", function () {
        clicked("agreement.html?mark=protocol", false, false, "slide-in-right");
    });
    //商户注册协议
    $("#shopregister").on("click", "#agreement", function () {
        clicked("agreement.html?mark=agreement", false, false, "slide-in-right");
    });

    // 切换
    $("a[name=regtab]").on("click", function () {
        var tab = $(this).attr("tip");
        $("a[name=regtab][class=tabcurrent]").removeClass("tabcurrent");
        if (tab == "account") {
            $(this).addClass("tabcurrent");
            $("#accountregister").show();
            $("#shopregister").hide();
        } else {
            $(this).addClass("tabcurrent");
            $("#shopregister").show();
            $("#accountregister").hide();
        }
        //try { myScroll.refresh(); } catch (err) { }
    });

    //注册事件
    $("#saveInfo").on("click", function (event) {
        if ($("#accountregister").is(':visible')) {
            saveAccount();
        } else {
            bindEntering();
        }
    });
}

// 保存普通会员
function saveAccount() {
    if ("" == $("#accountregister #name").val().trim()) {

        plus.nativeUI.alert("请输入手机号");
        return false;
    }
    if (!isPhone($("#accountregister #name").val().trim())) {
        plus.ui.alert("请输入正确的手机号", function () { }, configManager.alerttip, configManager.alertCtip);
        return false;
    }
    if ("" == $("#accountregister #password").val()) {

        plus.nativeUI.alert("请输入密码");
        return false;
    }
    if ("" == $("#accountregister #validatecode").val()) {

        plus.nativeUI.alert("请输入验证码");
        return false;
    }
    if (!is_positiveinteger($("#accountregister #validatecode").val())) {
        plus.ui.alert("请输入正确验证码", function () { }, configManager.alerttip, configManager.alertCtip);
        return false;
    }
    if ($("#accountregister #hidvalidatecode").val() != $("#accountregister #validatecode").val()) {

        plus.nativeUI.alert("验证码错误，请重新发送");
        return false;
    }
    if ($("#accountregister #name").val().trim() != $("#accountregister #hidvalidatemobile").val()) {
        plus.nativeUI.alert("你输入的手机号不一致");
        return false;
    }
    if (!$("#accountregister #checkaggree").is(":checked")) {

        plus.nativeUI.alert("请同意注册协议");
        return false;
    }


    plus.nativeUI.showWaiting();
    //调用注册接口
    $.ajax({
        type: 'POST',
        url: configManager.RequstUrl + 'api/user/createuser',
        data: {
            "name": $("#accountregister #name").val(),
            "password": $("#accountregister #password").val(),
            "code": $("#accountregister #shopcode").val()
        }
    }).done(function (data) {
        if ("success" == data.state) {
            if (!data.token || data.token.trim() == "") {
                plus.nativeUI.alert("注册失败（无效Token）");
                return;
            }
            //plus.storage.setItem(storageManager.user, JSON.stringify(data.user));
            //          
            //var mainview = plus.webview.getWebviewById(pageName.main);
            //mainview.show();
            //plus.webview.getWebviewById(pageName.mine).reload(false);
            //mainview.evalJS("init()");
            plus.ui.alert(data.message, function () { plus.webview.currentWebview().close(); }, configManager.alerttip, configManager.alertCtip);

        }
        else {
            plus.nativeUI.alert(data.message);
        }

    }).always(function () {
        plus.nativeUI.closeWaiting();
    });
}

//初始化数据
function getCategory(p) {
    $.ajax({
        type: "GET",
        url: configManager.RequstUrl + "/api/common/category",
        data: { "parent": p, "defaultVal": 0 },
    }).done(function (data) {
        if ("success" == data.state) {
            $.each(data.data, function (i, item) {
                $("#category").append("<option value='" + item.id + "'>" + item.name + "</option>");
            });
        } else {
            plus.nativeUI.alert(data.message);
        }
    });
}

function bindSubcagegory() {
    $("#category").on("change", function () {
        $("#subcategory option[value!=0]").remove();
        if ($(this).val().trim() > 0) {
            $.ajax({
                type: "GET",
                url: configManager.RequstUrl + "/api/common/category",
                data: { "parent": $(this).val().trim(), "defaultVal": 0 },
            }).done(function (data) {
                if ("success" == data.state) {
                    $.each(data.data, function (i, item) {
                        $("#subcategory").append("<option value='" + item.id + "'>" + item.name + "</option>");
                    });
                } else {
                    plus.nativeUI.alert(data.message);
                }
            });
        }
    });
}

function getProv() {
    $.ajax({
        type: "GET",
        url: configManager.RequstUrl + "/api/common/placeopts",
        data: { "parent": 1, "defaultVal": 0 },
    }).done(function (data) {
        if ("success" == data.state) {
            $("#prov").empty().append(data.html);
        }
        else {
            plus.nativeUI.alert(data.message);
        }
    });
}

function bindCity() {
    $("#prov").on("change", function () {
        if ($(this).val().trim() > 0) {
            $.ajax({
                type: "GET",
                url: configManager.RequstUrl + "/api/common/placeopts",
                data: { "parent": $(this).val().trim(), "defaultVal": 0 },
            }).done(function (data) {
                if ("success" == data.state) {
                    $("#city").html(data.html);
                    $("#area").html("<option value='0'>请选择</option>");
                    $("#dist").html("<option value='0'>请选择</option>");
                }
            });
        }
        else {
            $("#city option[value != 0]").remove();
            plus.nativeUI.alert(data.message);
        }
    });
}

function bindArea() {
    $("#city").on("change", function () {
        if ($(this).val().trim() > 0) {
            $.ajax({
                type: "GET",
                url: configManager.RequstUrl + "/api/common/placeopts",
                data: { "parent": $(this).val().trim(), "defaultVal": 0 },
            }).done(function (data) {
                if ("success" == data.state) {
                    $("#area").html(data.html);
                    $("#dist").html("<option value='0'>请选择</option>");
                }
                else {
                    $("#area option[value != 0]").remove();
                    plus.nativeUI.alert(data.message);
                }
            });
        }
        else {
            $("#area option[value != 0]").remove();
        }
    });
}

function bindDistrict() {
    $("#area").on("change", function () {
        if ($(this).val().trim() > 0) {
            $.ajax({
                type: "GET",
                url: configManager.RequstUrl + "/api/common/placeopts",
                data: { "parent": $(this).val().trim(), "field": "area_id", "model": "district" }
            }).done(function (data) {
                if ("success" == data.state) {
                    $("#dist").html(data.html);
                }
                else {
                    $("#dist option[value != 0]").remove();
                    plus.nativeUI.alert(data.message);
                }
            });
        }
        else {
            $("#dist option[value != 0]").remove();
        }
    });
}

//图片类型
function bindUpdaloadPic() {

    //店铺照片
    $("#pick_store_pic").on("click", function () {
        if (0 == $("#store_pic").length) {
            plus.storage.setItem("register_upimage_type", "pick_store_pic");
            popupUp();
        }
    });
    //身份证
    $("#pick_id_pic").on("click", function () {
        if (3 > $(".id_pic").length) {
            plus.storage.setItem("register_upimage_type", "pick_id_pic");
            popupUp();
        }
    });
    //营业执照
    $("#pick_store_license").on("click", function () {
        if (0 == $("#store_license").length) {
            plus.storage.setItem("register_upimage_type", "pick_store_license");
            popupUp();
        }
    });

    //从相册中选择上传
    $("#album").on("click", function () {
        var type = plus.storage.getItem("register_upimage_type");
        uploadFromAlbum(type);
    });

    //调用相机拍摄并上传
    $("#camera").on("click", function () {
        var type = plus.storage.getItem("register_upimage_type");
        uploadFromCamera(type);
    });

    //取消上传
    $("#cancel").on("click", function () {
        $("#heisebg").removeClass("heisebg").addClass("heisebghid");
    });
}


function popupUp(type) {
    $("#heisebg").removeClass("heisebghid").addClass("heisebg");
}
function closePoput() {
    $("#heisebg").removeClass("heisebg").addClass("heisebghid");
}
//从相册上传
function uploadFromAlbum(type) {
    var dirtype = "";
    if ("pick_store_license" == type || "pick_id_pic" == type) {
        dirtype = "auth";
    }
    if ("pick_store_pic" == type) {
        dirtype = "store";
    }
    plus.gallery.pick(
        function (path) { uploadImage(path); },
        function (e) { console.log(e); },
        { filter: "image" }
    );
}

//从摄像头中拍照
function uploadFromCamera(type) {
    var dirtype = "";
    if ("pick_store_license" == type || "pick_id_pic" == type) {
        dirtype = "auth";
    }
    if ("pick_store_pic" == type) {
        dirtype = "store";
    }

    var cmr = plus.camera.getCamera(1);
    if (null != cmr) {
        //拍照
        cmr.captureImage(function (p) {
            plus.io.resolveLocalFileSystemURL(
        	p,
        	function (entry) { uploadImage("file://" + entry.fullPath); },
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

}

function uploadImage(path) {
    //选择成功
    $("#heisebg").removeClass("heisebg").addClass("heisebghid");
    $("#waitingupload").removeClass("heisebghid").addClass("heisebg");

    var task = plus.uploader.createUpload(configManager.RequstUrl + "api/common/upload",
        { method: "POST", blocksize: 102400, priority: 100 },
        function (upload, status) {
            // 上传完成
            if (status == 200) {

                var data = JSON.parse(upload.responseText);

                //                      console.log("data=" + upload.responseText);

                if ("pick_store_license" == type) {
                    var src = configManager.RequstUrl + "img/auth-" + data.id + "/40-40";
                    $('#pick_store_license').parent().parent().find('p').hide();
                    $("#pick_store_license").parent().before(
                        "<div onclick='javascript:$(this).remove();' class=\"zctudw\"><b><i class=\"remove circle icon\"></i></b><img title='" + data.id + "' id='store_license' src='" + src + "'></div>"
                        );
                }
                if ("pick_id_pic" == type) {
                    var src = configManager.RequstUrl + "img/auth-" + data.id + "/40-40";
                    $('#pick_id_pic').parent().parent().find('p').hide();
                    $("#pick_id_pic").parent().before("<div onclick='javascript:$(this).remove();' class=\"zctudw\"><b><i class=\"remove circle icon\"></i></b><img title='" + data.id + "' class='id_pic' src='" + src + "'></div>");
                }
                if ("pick_store_pic" == type) {
                    var src = configManager.RequstUrl + "img/store-" + data.id + "/40-40";
                    $('#pick_store_pic').parent().parent().find('p').hide();
                    $("#pick_store_pic").parent().before("<div onclick='javascript:$(this).remove();' class=\"zctudw\"><b><i class=\"remove circle icon\"></i></b><img title='" + data.id + "' id='store_pic'  src='" + src + "'></div>");
                }

                $("#waitingupload").removeClass("heisebg").addClass("heisebghid");

            } else {
                console.log("Upload failed: " + status);
            }

        }
    );
    task.addFile(path, { key: "file" });
    task.addData("dir", dirtype);
    task.start();
}


function bindEntering() {
    if ("" == $("#shopregister #name").val().trim()) {
        plus.nativeUI.alert("请输入账号");
        return false;
    }
    if (!isPhone($("#shopregister #name").val())) {
        plus.nativeUI.alert("帐号请输入手机号");
        return false;
    }
    if ("" == $("#shopregister #password").val().trim()) {
        plus.nativeUI.alert("请输入密码");
        return false;
    }
    if (!isPasswd($("#shopregister #password").val().trim())) {
        plus.nativeUI.alert("密码必须由6到15位数字或字母组成");
        return false;
    }
    if ("" == $("#shopregister #store_name").val().trim()) {
        plus.nativeUI.alert("请输入店铺名称");
        return false;
    }
    if ("" == $("#shopregister #store_address").val().trim()) {
        plus.nativeUI.alert("请输入地址");
        return false;
    }
    if (10 > $("#shopregister #store_address").val().length) {
        plus.nativeUI.alert("请输入合适的地址，地址长度大于10个字");
        return false;
    }
    if ("" == $("#shopregister #store_phone").val().trim()) {
        plus.nativeUI.alert("请输入联系电话");
        return false;
    }
    if ("" == isPhone($("#shopregister #store_phone").val().trim())) {
        plus.nativeUI.alert("请输入正确的联系电话");
        return false;
    }
    if ("" == $("#shopregister #real_name").val().trim()) {
        plus.nativeUI.alert("负责人姓名");
        return false;
    }
    if ("" == $("#shopregister #id_no").val().trim()) {
        plus.nativeUI.alert("请身份证号");
        return false;
    }
    if (!isIDno($("#shopregister #id_no").val().trim())) {
        plus.nativeUI.alert("请输入正确的身份证号");
        return false;
    }
    if ("" == $("#shopregister #store_hours").val().trim()) {
        plus.nativeUI.alert("请输入营业时间");
        return false;
    }
    if (0 == $("#shopregister #category option").length || 0 == $("#shopregister #category").val().trim()) {
        plus.nativeUI.alert("请选择主营类目");
        return false;
    }
    if (0 == $("#shopregister #subcategory option").length || 0 == $("#shopregister #subcategory").val().trim()) {
        plus.nativeUI.alert("请选择主营类目 - 二级类目");
        return false;
    }
    if (0 == $("#shopregister #prov option").length || 0 == $("#shopregister #prov").val().trim()) {
        plus.nativeUI.alert("请选择所在省");
        return false;
    }
    if (0 == $("#shopregister #city option").length || 0 == $("#shopregister #city").val().trim()) {
        plus.nativeUI.alert("请选择所在市");
        return false;
    }
    if (0 == $("#shopregister #area option").length || 0 == $("#shopregister #area").val().trim()) {
        plus.nativeUI.alert("请选择所在县");
        return false;
    }
    if ("" == $("#shopregister #store_intro").val().trim()) {
        plus.nativeUI.alert("请输入店铺介绍");
        return false;
    }
    if (0 == $("#shopregister #store_pic").length) {
        plus.nativeUI.alert("请选择店铺图片");
        return false;
    }
    if (3 > $("#shopregister .id_pic").length) {
        plus.nativeUI.alert("请选择身份证图片（正反面、本人手持）");
        return false;
    }
    if ("" == $("#shopregister #cardno").val().trim()) {
        plus.nativeUI.alert("请输入银行卡号");
        return false;
    }
    if (!cardCheck($("#shopregister #cardno").val().trim())) {
        plus.nativeUI.alert("银行卡号未能通过验证");
        return false;
    }
    if ("" == $("#shopregister #branch").val().trim()) {
        plus.nativeUI.alert("请输入开户支行");
        return false;
    }
    if ("" == $("#shopregister #person").val().trim()) {
        plus.nativeUI.alert("请输入银行卡姓名");
        return false;
    }
    if ("" == $("#shopregister #validatecode").val()) {

        plus.nativeUI.alert("请输入验证码");
        return false;
    }
    if (!is_positiveinteger($("#shopregister #validatecode").val())) {
        plus.ui.alert("请输入正确验证码", function () { }, configManager.alerttip, configManager.alertCtip);
        return false;
    }
    if ($("#shopregister #hidvalidatecode").val() != $("#shopregister #validatecode").val()) {
        plus.nativeUI.alert("验证码错误，请重新发送");
        return false;
    }
    if ($("#shopregister #name").val().trim() != $("#shopregister #hidvalidatemobile").val()) {
        plus.nativeUI.alert("你输入的手机号不一致");
        return false;
    }
    if (!$("#shopregister #checkaggree").is(":checked")) {

        plus.nativeUI.alert("请同意注册协议");
        return false;
    }

    //	console.log("user");

    var user = {};
    user.name = $("#shopregister #name").val().trim();
    user.password = $("#shopregister #password").val().trim();
    user.id_pic1 = $($("#shopregister .id_pic")[0]).attr("title");
    user.id_pic2 = $($("#shopregister .id_pic")[1]).attr("title");
    user.id_pic3 = $($("#shopregister .id_pic")[2]).attr("title");
    user.real_name = $("#shopregister #real_name").val().trim();
    user.id_no = $("#shopregister #id_no").val().trim();
    user.code = $("#agentcode").val();

    var store = {};
    store.store_name = $("#shopregister #store_name").val().trim();
    store.pcate_id = $("#shopregister #category").val().trim();
    store.category_id = $("#shopregister #subcategory").val().trim();
    store.prov_id = $("#shopregister #prov").val().trim();
    store.city_id = $("#shopregister #city").val().trim();
    store.area_id = $("#shopregister #area").val().trim();
    store.dist_id = $("#shopregister #dist").val().trim();
    store.store_address = $("#shopregister #store_address").val().trim();
    store.store_phone = $("#shopregister #store_phone").val().trim();
    store.store_hours = $("#shopregister #store_hours").val().trim();

    store.is_takeaway = $("#shopregister input[name='is_takeaway']:checked").val();
    store.is_noreserve = $("#shopregister input[name='is_noreserve']:checked").val();
    store.is_refund = $("#shopregister input[name='is_refund']:checked").val();

    store.store_pic = $("#shopregister #store_pic").attr("title");
    store.store_license = $("#shopregister #store_license").attr("title");
    store.store_intro = $("#shopregister #store_intro").val().trim();

    //	console.log("store");

    var card = {};
    card.cardno = $("#shopregister #cardno").val().trim();
    card.person = $("#shopregister #person").val().trim();
    card.branch = $("#shopregister #branch").val().trim();

    //	console.log("card");

    var postdata = { "user": user, "store": store, "card": card };

    //	console.log("postdata = " + postdata);


    plus.nativeUI.showWaiting();
    $.ajax({
        type: 'POST',
        url: configManager.RequstUrl + "api/user/createstore",
        data: postdata,
    }).done(function (data) {
        if ("success" == data.state) {
            //          console.log("商家注册：" + data.user.name);
            if (!data.user.token || data.user.token.trim() == "") { plus.nativeUI.alert("注册失败（无效Token）"); return; }
            plus.storage.setItem(storageManager.user, JSON.stringify(data.user));
            plus.ui.alert(data.message, function () {
                //          	clicked("../home/home.html", false, false, "pop-in");
                plus.webview.getWebviewById(pageName.mine).reload(false);
                var mainview = plus.webview.getWebviewById(pageName.main);
                mainview.evalJS("gohome()");
            }, configManager.alerttip, configManager.alertCtip);
        }
        else {
            plus.nativeUI.alert(data.message);
        }
    }).fail(function () {
        plus.nativeUI.alert(errorMessage.interface);
    }).always(function () {
        plus.nativeUI.closeWaiting();
    });
}

/*
 * obj 			: 发送按钮，是一个超链接
 * name			: 要发送验证码的手机号
 * hidobj 		: 隐藏域，存放验证码
 * hidmobile	: 隐藏域，存放填写接口返回的手机号
 */
function change_code(obj, nameobj, hidobj, hidmobile) {
    var name = "";
    if ("" == $(nameobj).val()) {
        plus.ui.alert("请输入手机号码", function () { }, configManager.alerttip, configManager.alertCtip);
        return false;
    }
    else if (!isTelephone($(nameobj).val())) {
        plus.ui.alert("请输入正确的手机号", function () { }, configManager.alerttip, configManager.alertCtip);
        return false;
    }
    else {
        name = $(nameobj).val();
    }

    time(obj, nameobj, hidobj, hidmobile);

    $.ajax({
        type: "GET",
        url: configManager.RequstUrl + "api/user/sendcode?mobile=" + name,
        async: true
    }).done(function (data) {
        if ("success" == data.state) {
            $(hidobj).val(data.code);
            $(hidmobile).val(data.mobile);
        }
    });
}
var wait;
function time(obj, nameobj, hidobj, hidmobile) {
    if (wait == 0) {
        $(obj).attr('disabled', false);
        $(obj).css("background", "#FF6634");
        $(obj).css("color", "#fff");
        $(obj).val("获取验证码");
        wait = configManager.senddelay;
        $(obj).unbind();
        $(obj).on("click", function () {
            change_code(obj, nameobj, hidobj, hidmobile);
        });
    } else {
        $(obj).attr('disabled', true);
        $(obj).css("background", "#DDDDDD");
        $(obj).css("color", "#ff6633");
        $(obj).val(wait + "s");
        wait--;
        setTimeout(function () { time(obj, nameobj, hidobj, hidmobile); }, 1000);
    }
}





