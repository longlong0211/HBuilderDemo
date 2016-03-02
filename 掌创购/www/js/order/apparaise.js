//$(document).ready(function () {
//  plusReady();
//});
function plusReady() {
      var user = userLogin();
      var id = getUrlParam("id");
//	var user = {"id":294,"name":"13761195711","email":"","nick":"掌创0294","real_name":"","avatar_id":0,"code":"050E","id_no":null,"id_pic1":null,"id_pic2":null,"id_pic3":null,"user_type":1,"status":1,"auth_status":0,"parent_id":2,"remark":null,"created_at":"2015-07-01 03:44:40","updated_at":"2015-07-19 20:50:42","setpaypass":1,"token":"Mjk0fCQyeSQxMCRRR2xqVFlBUDJRci9tbDFkbno4WDNPdGk3dGxsSS5uVnlja1ZFVFZxN0E4M3dtVE14SExsR3wxMzljYTIzNTY5MmVhMTkxMDhhZTIxNjVlYmMwMzkzOQ==","account":{"id":294,"user_id":294,"used":"416.84","all":"19595.16","cash":"10000.00","card":"9595.16","coin":"4044.00","pos":"0.00","frozen":"0.00"},"address":{"id":2,"user_id":294,"prov_id":0,"city_id":0,"area_id":0,"address":"ok","is_default":1,"created_at":"2015-07-13 21:46:33","updated_at":"2015-07-14 09:48:17"}};
//	var id = 114;
    //初始化页面
    InitPage(user, id);
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}


function InitPage(user, id) {
    $.ajax({
        type: "POST",
        url: configManager.RequstUrl + "api/order/info",
        async: true,
        data: { "userid": user.id, "token": user.token, "orderid": id }
    }).done(function (data) {
        if ("success" == data.state) {
            PrintPage(user, data.data);
            BindEvent(user, data.data);
        } else {
//          plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
        }
    });
}

function PrintPage(user, order) {
	
//	console.log(JSON.stringify(order));
	
    var html = [], src = "";

//  html.push('<div class="item-01-wrap reviews-wrap">');
//  html.push('<h2 class="t-c">成交时间：' + order.created_at + '</h2><h3 style="font-size:1em">评价宝贝</h3>');
//  $.each(order.goods, function (i, goods) {
//      src = configManager.goodsImgurl.format(goods.goods_pic, "76-77");
//
//      html.push('<div  name="goodsh3" tip="' + goods.id + '">');
//      html.push('<div  class="reviews-comm-tit">');
//      html.push('<img src="' + src + '" width="56" height="57"/>');
//      html.push('<span>' + goods.goods_title + '</span>');
//      html.push('</div>');
//      html.push('<h3 style="font-size:1em"><span style="float: right;">');
//      for (var i = 0; i < 5; i++) {
//          html.push('<a><img name="goodsscoreimg" id="' + i.toString() + '" src="../../../images/star-off-big.png"/></a>');
//      }
//      html.push('</span>描述相符</h3>');
//
//      html.push('<ul>');
//      html.push('<li class="line"><input id="comment" type="text" style="font-size:0.8em"  class="base-text-inp" placeholder="写点评价对吧，对其他小伙伴帮助很大"/></li>');
//      html.push('<li class="reviews-add-img"><a id="add_review_img"><img src="../../../images/rz7.jpg" width="50" height="50"/></a></li>');
//      html.push('</ul>');
//      html.push('</div>');
//
//  });
//  html.push('</div>');
    
    html.push('<div class="tips-text-block"><h2 style="font-size:1.1em">给店铺评分</h2></div>');
    
    //服务态度
    html.push('<div class="item-02-wrap"><div class="float-info-block"><label style="font-size:1em">服务态度</label><span><div id="store_score">');
    for (var j = 0; j < 5; j++) {
        html.push('<a class="score"><img name="storescoreimg" id="' + j.toString() + '" src="../../../images/star-off-big.png"/></a>')
    }
    html.push('</div></span></div></div>');
    //描述相符
//  html.push('<div class="item-02-wrap"><div class="float-info-block"><label style="font-size:1em">描述相符</label><span><div id="goods_score">');
//  for (var j = 0; j < 5; j++) {
//      html.push('<a class="score"><img name="goodsscoreimg" id="' + j.toString() + '" src="../../../images/star-off-big.png"/></a>')
//  }
//  html.push('</div></span></div></div>');

    html.push('<div class="item-02-wrap"><ul>');
    html.push('<li class="line"><input id="comment" type="text" style="font-size:0.8em"  class="base-text-inp" placeholder="写点评价对吧，对其他小伙伴帮助很大"/></li>');
    html.push('<li class="reviews-add-img"><a id="add_review_img"><img src="../../../images/rz7.jpg" width="50" height="50"/></a></li>');
    html.push('</ul></div>');
    
    html.push('<div class="item-02-wrap"><div class="float-info-block"><label style="font-size:1em">匿名评价</label><span><a id="anonymous" class="reviews-off-btn f-r"></a> </span></div>	</div>');
    html.push('<div class="item-02-wrap"><input type="button" id="addreview" class="base-btn-inp t-c" value="发表评价"/></div>');


    $("#content").html(html.join(""));
}

function BindEvent(user, order) {

    //点击评分图片
    $("#content").on("click", "img[name=goodsscoreimg],img[name=storescoreimg]", function () {
        var id = $(this).attr("id");
        var selected = $(this).attr("src").indexOf('-on-') > 0;
        var src = "../../../images/" + (selected ? "star-off-big.png" : "star-on-big.png");
        $(this).parent().parent().find("img:eq(" + id + ")").attr("src", src);
        $(this).parent().parent().find("img:gt(" + id + ")").attr("src", "../../../images/star-off-big.png");
        $(this).parent().parent().find("img:lt(" + id + ")").attr("src", "../../../images/star-on-big.png");
    });

    //是否匿名评价
    $("#content").on("click", "#anonymous", function () {
        var selected = $(this).hasClass("reviews-on-btn");
        $(this).removeClass(selected ? "reviews-on-btn" : "reviews-off-btn");
        var newclass = selected ? "reviews-off-btn" : "reviews-on-btn";
        $(this).addClass(newclass);

    })

    //点击弹出摄像或相册
    $("#add_review_img").on("click", function () {
        if ($(".goods_review_pic").length < 5) {
            $("#heisebg").removeClass("heisebghid").addClass("heisebg");
        }
    });
    //取消
    $("#cancel").on("click", function () {
        $("#heisebg").removeClass("heisebg").addClass("heisebghid");
    });
    //从相册中选择图片并上传
    $("#album").on("click", function () {

        plus.gallery.pick(
            function (path) {
                $("#heisebg").removeClass("heisebg").addClass("heisebghid");
                $("#waitingupload").removeClass("heisebghid").addClass("heisebg");
                var task = plus.uploader.createUpload(configManager.RequstUrl + "/api/common/upload",
                    { method: "POST", blocksize: 102400, priority: 100 },
                    function (upload, status) {
                        // 上传完成
                        if (status == 200) {
                            var data = JSON.parse(upload.responseText);
                            var src = configManager.storeImgurl.format(data.id, "");
                            //显示
                            $("#add_review_img").before('<a class="goods_review_pic"><img title="' + data.id + '" src="' + src + '"></a>');
                            //去除上传进度
                            $("#waitingupload").removeClass("heisebg").addClass("heisebghid");
                        } else {
                            console.log("Upload failed: " + status);
                        }
                    }
                );
                task.addFile(path, { key: "file" });
                task.addData("dir", "review");
                task.start();
            },
            function (e) {
                console.log(e);
            },
            { filter: "image" }
        );

    });
    //摄像头拍照
    $("#camera").on("click", function () {


        var cmr = plus.camera.getCamera(1);
        if (null != cmr) {
            //拍照
            cmr.captureImage(function (p) {
                plus.io.resolveLocalFileSystemURL(
                p,
                function (entry) {
                    $("#heisebg").removeClass("heisebg").addClass("heisebghid");
                    $("#waitingupload").removeClass("heisebghid").addClass("heisebg");
                    //上传图片
                    var task = plus.uploader.createUpload(configManager.RequstUrl + "/api/common/upload",
                        { method: "POST", blocksize: 102400, priority: 100 },
                        function (upload, status) {
                            // 上传完成
                            if (status == 200) {
                                var data = JSON.parse(upload.responseText);
                                var src = configManager.storeImgurl.format(data.id, "");
                                //显示
                                $("#add_review_img").before('<a onclick="javascript:remove(this);" class="goods_review_pic"><img title="' + data.id + '" src="' + src + '"></a>');
                                //去除上传进度提示
                                $("#waitingupload").removeClass("heisebg").addClass("heisebghid");
                            } else {
                                console.log("Upload failed: " + status);
                            }
                        }
                    );
                    task.addFile("file://" + entry.fullPath, { key: "file" });
                    task.addData("dir", "store");
                    task.start();

                },
                function (e) { plus.nativeUI.alert(e.message); }
                );
            },
            function (e) { },
            { filename: "_doc/camera/" });

        }
        else {
            plus.ui.alert("没有找到摄像头", function () { }, configManager.alerttip, configManager.alertCtip);
        }

    });

    //提交评价

    $("#content").on("click", "#addreview", function () {

//      var goodsreviews = [];
//      var goodsh3 = $("#content div[name=goodsh3]");
//      var goods_score = [];
        //商品评价
//      $.each(goodsh3, function (i, goods) {
//          var review = {};
//
//          review.id = $(this).attr("tip");
//
//          var $score_img = $("img[src$='star-on-big.png']");
//          if (1 > $(this).find($score_img).length) {
//              goods_score.push((i + 1).toString());
//          }
//          review.score = $(this).find($score_img).length;
//
//
//
//          if ("" != $(this).find("#comment").val()) {
//              review.comment = $(this).find("#comment").val();
//          }
//
//
//          review.pics = [];
//          var imgs = $(this).find(".goods_review_pic img");
//          if (0 < imgs.length) {
//
//              $.each(imgs, function (i, img) {
//                  review.pics.push($(this).attr('title'));
//              });
//
//          }
//          goodsreviews.push(review);
//
//      });


//      if (goods_score.length > 0) {
//          plus.ui.alert("请给第" + goods_score.join(",").toString() + "个商品评分", function () { }, configManager.alerttip, configManager.alertCtip);
//          return false;
//      }

        if (1 > $("#store_score img[src$='star-on-big.png']").length) {
            plus.ui.alert("请给店铺服务态度评分", function () { }, configManager.alerttip, configManager.alertCtip);
            //alert("请给店铺评分");
            return false;
        }
//      if (1 > $("#goods_score img[src$='star-on-big.png']").length) {
//          plus.ui.alert("请给店铺评分", function () { }, configManager.alerttip, configManager.alertCtip);
//          //alert("请给店铺评分");
//          return false;
//      }
        if("" == $("#comment").val().trim()){
        	plus.ui.alert("写点评价吧，对其他小伙伴帮助很大", function () { }, configManager.alerttip, configManager.alertCtip);
        	return false;
        }
        var pics = [];
		var imgs = $(".goods_review_pic img");		
        if (0 < imgs.length) {
        	console.log(imgs.length);
        	$.each(imgs, function(i,img) {
        		console.log($(this).attr("title"));
        		pics.push($(this).attr("title"));
        	});
        }
        
        
        var store_score = $("#store_score img[src$='star-on-big.png']").length;
        //var goods_score = { "score": $("#goods_score img[src$='star-on-big.png']").length };
        var comment = $("#comment").val().trim();
        var anonymous = $("#anonymous").hasClass("reviews-on-btn") ? 1 : 0;
		
		//var store = { "score":goods_score, "pics":pics, "comment":comment };
		
        var postdata = {
            "userid": user.id,
            "order": order.id,
            "store": { "score":store_score, "pics":pics, "comment":comment },
            "anonymous": anonymous,
            "token": user.token
        }

        console.log(JSON.stringify(postdata));
        //return false;

        $.ajax({
            type: "POST",
            url: configManager.RequstUrl + "api/order/review",
            async: true,
            data: postdata,
            beforeSend:function(){ $("#waitingupload").removeClass("heisebghid").addClass("heisebg"); }
        }).done(function (data) {
        	$("#waitingupload").removeClass("heisebg").addClass("heisebghid");
            if ("success" == data.state) {
                plus.ui.alert(data.message, function () {
                    var opener = plus.webview.currentWebview().opener();
                    opener.evalJS("paintOrderList('refresh')");
                	plus.webview.currentWebview().close();
                }, configManager.alerttip, configManager.alertCtip);
            } else {
                plus.ui.alert(data.message, function () { }, configManager.alerttip, configManager.alertCtip);
            }
        });
    });

}
