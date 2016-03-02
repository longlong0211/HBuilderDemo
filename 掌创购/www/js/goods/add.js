//$(function () { plusReady(); })

var _currentuser, _goodsId, _currentdate, _windowWidth = $(window).width();
// 商品管理添加、修改
function plusReady() {
    _goodsId = getUrlParam("id");

    var currentdate = new Date();
    _currentdate = currentdate.getFullYear() + "-" + currentdate.getMonth() + "-" + currentdate.getDate();

    // 6 3 16
    _currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
    //{ "id": 98, "name": "13019643846", "email": "", "nick": "小猪猪", "real_name": "", "avatar_id": 447, "code": "044A", "id_no": "330184198802153325", "id_pic1": 0, "id_pic2": 0, "id_pic3": 0, "user_type": 2, "status": 1, "auth_status": 1, "parent_id": 2, "remark": "", "created_at": "2015-07-01 03:39:36", "updated_at": "2015-07-15 21:33:39", "setpaypass": 0, "token": "OTh8JDJ5JDEwJHFxTEw1Q3NFNXhGZFlhTjY3bkpTYWVGUWlqNFE4OS9VVEdxaXJYTHZFQURXTG5saUVaN1BDfA==", "account": { "id": 98, "user_id": 98, "used": "0.00", "all": "37907.45", "cash": "0.00", "card": "0.00", "coin": "0.00", "pos": "37907.45", "frozen": "1500.00" }, "store": { "id": 96, "user_id": 98, "pcate_id": 1, "category_id": 12, "prov_id": 31, "city_id": 383, "area_id": 3230, "dist_id": 12, "store_lng": 120.17177575863, "store_lat": 30.255947419181, "store_name": "小猪猪", "store_phone": "0571-85870359", "store_address": "上城区吴山路39号杭州湖滨银泰in77-C3区1楼", "store_license": 0, "store_pic": 97, "store_intro": "", "store_hours": "周一至周五 9:00 ~ 22:00", "store_capita": 0, "reviews": 1, "store_score": 3, "online_pay_fee": 3, "offline_pay_fee": 2, "coin_pay_fee": 15, "trade_fee": 15, "agent_fee": 0, "agent_tz_fee": 0.03, "agent_to_fee": 0.04, "zypos_settle": 7, "trade_zy_fee": "0.00", "agent_zy_fee": "0.00", "is_takeaway": 1, "is_noreserve": 1, "is_refund": 1, "collectes": 0, "store_views": 942, "store_sn": "80100003", "store_pause": 1, "deleted_at": null, "created_at": "2015-07-01 03:39:36", "updated_at": "2015-07-17 18:11:13" }, "address": null };

    $("#pagetitle").text(_goodsId ? "修改商品" : "添加商品");
    // 获取商品详情,编辑商品
    if (_goodsId) {
        getGoodsDetail();
    }

    //上传图片事件
    uploadImage();

    //添加商品事件
    managerGoods();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}

// 上传图片
function uploadImage() {
    //选择时间
    $("#end_time").on("click", function (event) {
        event.preventDefault();
        plus.nativeUI.pickDate(function (e) {
            var d = e.date;
            $("#end_time").val(d.Format('yyyy-MM-dd'));
        }, function (e) {
            console.log("未选择日期：" + e.message);
        }, { title: "请选择到期时间", minDate: new Date() });
    });

    //取消上传
    $("#cancel").on("click", function () {
        $("#heisebg").removeClass("heisebg").addClass("heisebghid");
    });
    //从相册中选择上传
    $("#album").on("click", function () {
        plus.gallery.pick(
            function (path) {
                uploadFile(path);
            },
            function (e) {
                console.log(e);
            },
            { filter: "image" }
        );
    });

    //调用相机拍摄并上传
    $("#camera").on("click", function () {
        var cmr = plus.camera.getCamera(1);
        if (null != cmr) {
            //拍照
            cmr.captureImage(function (p) {
                plus.io.resolveLocalFileSystemURL(p,
                function (entry) {
                    var path = "file://" + entry.fullPath;
                    uploadFile(path);
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

    // 上传图片
    function uploadFile(path) {
        var type = plus.storage.getItem("upload_goods_image");
        //选择成功
        $("#heisebg").removeClass("heisebg").addClass("heisebghid");
        $("#waitingupload").removeClass("heisebghid").addClass("heisebg");

        //https://github.com/think2011/localResizeIMG3
        // 压缩图片
        lrz(path, {
            width: 500,
            quality: 0.7,
            done: function (results) {
                $.ajax({
                    type: "POST",
                    url: configManager.RequstUrl + "api/common/base64upload",
                    async: true,
                    data: { base64: results.base64, size: results.base64.length, dir: "goods" }
                }).done(function (data) {
                    if (data.state != "success") { console.log(data.message); return; }
                    var src = configManager.goodsImgurl.format(data.id, "") + _windowWidth * 0.98 + '-200';
                    if ("addspic" == type) {
                        var sImageStr = "<img width='" + _windowWidth * 0.98 + "px' height='200px' onclick='javascript:$(this).remove();' class='spic' title='{0}' src='{1}'>";
                        $("#addspic").before(sImageStr.format(data.id, src));
                    }
                    if ("addbpic" == type) {
                        var bImageStr = "<img width='" + _windowWidth * 0.98 + "px' height='200px' id='bpic' title='{0}' src='{1}'/>";
                        $("#addbpic").html(bImageStr.format(data.id, src));
                    }
                    $("#waitingupload").removeClass("heisebg").addClass("heisebghid");
                }).fail(function () {
                    plus.nativeUI.toast("上传失败！");
                    $("#waitingupload").removeClass("heisebg").addClass("heisebghid");
                });
            }
        });
    }

    //图文消息
    $("#addspic").on("click", function () {
        if (5 > $(".spic").length) {
            $("#heisebg").removeClass("heisebghid").addClass("heisebg");
            plus.storage.setItem("upload_goods_image", "addspic");
        }
    });


    //商品大图
    $("#btnaddpic").on("click", function () {
        $("#heisebg").removeClass("heisebghid").addClass("heisebg");
        plus.storage.setItem("upload_goods_image", "addbpic");
    });

    // 
    $("input[name=type]").on("click", function () {

        if (["1", "2"].indexOf($(this).val()) > -1) {
            $("#gourpgoodslimit").show();
            //$("#div_market_price").show();
            $(".presell").show();
            //团购
            if ("1" == $(this).val()) {
                $("#div_price label").html("促销价：");
            }
            //预售
            if ("2" == $(this).val()) {
                $("#div_price label").html("预售价：");
            }
            //普通
        } else {
            $("#gourpgoodslimit").hide();
            //$("#div_market_price").hide();
            $("#div_price label").html("价格：");
        }
    });

    // 本单详情
    $("#goodscontentinput").on("click", function () {
        var textbox = plus.webview.create("../../common/textbox.html", "../../common/textbox.html", {}, { textboxid: "goodscontent", textboxvalue: $("#goodscontent").val() });
        textbox.show("slide-in-right");
    });

    // 本单详情
    $("#noticeinput").on("click", function () {
        var textbox = plus.webview.create("../../common/textbox.html", "../../common/textbox.html", {}, { textboxid: "notice", textboxvalue: $("#notice").val() });
        textbox.show("slide-in-right");
    });

}

// 添加商品
function managerGoods() {
    $("#addgoods").on("click", function () {
        if ("" == $("#title").val().trim()) {
            plus.ui.alert("请输入商品名称", function () { }, configManager.alerttip, configManager.alertCtip);
            return false;
        }
        if (!is_positiveinteger($("#stock").val().trim())) {
            plus.ui.alert("库存请输入正整数", function () { }, configManager.alerttip, configManager.alertCtip);
            return false;
        }
        //      if (0 > $(".spic").length) {
        //          plus.ui.alert("请上传商品图片", function () { }, configManager.alerttip, configManager.alertCtip);
        //          return false;
        //      }
        //      if (0 > $("#bpic").length) {
        //          plus.ui.alert("请上传商品大图", function () { }, configManager.alerttip, configManager.alertCtip);
        //          return false;
        //      }

        var goods = {};
        goods.type = $("input[name='type']:checked").val().trim();
        if ("" == $("#price").val().trim()) {
            plus.ui.alert("请输入商品价格", function () { }, configManager.alerttip, configManager.alertCtip);
            return false;
        }
        //if( ["1","2"].indexOf(goods.type) > -1 ){
        if ("" == $("#market_price").val().trim()) {
            plus.ui.alert("输入商品原价", function () { }, configManager.alerttip, configManager.alertCtip);
            return false;
        }
        goods.market_price = $("#market_price").val().trim();
        //}
        goods.price = $("#price").val().trim();
        goods.title = $("#title").val().trim();
        goods.pic = $("#bpic").attr("title");
        //团购商品，预售商品
        if (["1", "2"].indexOf(goods.type) > -1) {
            goods.pics = [];
            $.each($(".spic"), function (i, item) {
                goods.pics.push($(item).attr("title"));
            });
            if ("" != $("#goodscontent").val().trim()) {
                goods.content = $("#goodscontent").val().trim();
            }
            if ("" != $("#notice").val().trim()) {
                goods.notice = $("#notice").val().trim();
            }
            goods.stock = $("#stock").val().trim();
            //团购商品
            if (["1"].indexOf(goods.type) > -1) {
                goods.any_time_refund = $("input[name='any_time_refund']:checked").val();
                goods.over_time_refund = $("input[name='over_time_refund']:checked").val();
                goods.end_time = $("#end_time").val() ? $("#end_time").val() : _currentdate;
            }
        }

        var postdata = { "userid": _currentuser.id, "token": _currentuser.token, "goods": goods };
        var postUrl = "api/goods/add";
        if (_goodsId) {
            postdata["goodsid"] = _goodsId;
            postUrl = "api/goods/update";
        }
        $.ajax({
            type: "POST",
            url: configManager.RequstUrl + postUrl,
            async: true,
            data: postdata,
            beforeSend: function () { $("#waitingupload").removeClass("heisebghid").addClass("heisebg"); }
        }).done(function (data) {
            $("#waitingupload").removeClass("heisebg").addClass("heisebghid");
            if ("success" == data.state) {
                plus.nativeUI.alert(data.message, function () {
                    plus.webview.currentWebview().opener().evalJS("receiveAddEvent()");
                    plus.webview.currentWebview().close();
                });
            }
            else {
                var msg = data.message + ": ";
                if (data.hasOwnProperty("errors")) {
                    for (var i in data.errors) {
                        msg += data.errors[i] + "; ";
                    }
                }
                plus.ui.alert(msg, function () { }, configManager.alerttip, configManager.alertCtip);
            }
        });
    });
}

// 获取商品详情
function getGoodsDetail() {
    $("#addgoods").val("保存修改");
    $.ajax({
        type: 'Get',
        url: configManager.RequstUrl + "api/goods/info?isedit=1&goods=" + _goodsId
    }).done(function (data) {
        if (data.state != "success") { console.log(data.message); return; }
        var goods = data.data;

        $("input[name='type'][value=" + goods.goods_type + "]").click();
        $("#title").val(goods.title);
        $("#market_price").val(goods.market_price);
        $("#price").val(goods.price);

        var addbpicsrc = configManager.goodsImgurl.format(goods.pic, "") + _windowWidth * 0.98 + '-200';
        var bImageStr = "<img width='" + _windowWidth * 0.98 + "px' height='200px'id='bpic' title='{0}' src='{1}'/>";
        $("#addbpic").html(bImageStr.format(goods.pic, addbpicsrc));

        //团购商品，预售商品
        if ([1, 2].indexOf(goods.goods_type) > -1) {
            if (goods.pics) {
                $(".rztupian").height(140 * goods.pics.length);
                for (var i = 0; i < goods.pics.length; i++) {
                    var picid = goods.pics[i];
                    var addspicsrc = configManager.goodsImgurl.format(picid, "") + '500-200';
                    var sImageStr = "<img width='" + _windowWidth * 0.98 + "px' height='200px' onclick='javascript:$(this).remove();' class='spic' title='{0}' src='{1}'>";
                    $("#addspic").before(sImageStr.format(picid, addspicsrc));
                }
            }

            if ("" != goods.content) {
                $("#goodscontent").val(goods.content);
                $("#goodscontentinput").val(convertStr(goods.content));
            }
            if ("" != goods.notice) {
                $("#notice").val(goods.notice);
                $("#noticeinput").val(convertStr(goods.notice));
            }
            $("#stock").val(goods.stock);
            //团购商品
            if (1 == goods.goods_type) {
                $("input[name='any_time_refund'][value=" + goods.any_time_refund + "]").click();
                $("input[name='over_time_refund'][value=" + goods.over_time_refund + "]").click();
                $("#end_time").val((goods.end_time) ? new Date(goods.end_time).Format("yyyy-MM-dd") : "0000-00-00");
            }
        }
    });
}

// 获取文本内容
function getMessage(id, value) {
    $("#" + id).val(value);
    $("#" + id + "input").val(convertStr(value));
}

// 处理字符串过长情况
function convertStr(str) {
    if (str && str.length > 12) {
        return str.substr(0, 10) + "...";
    }

    return str;
}

