var shares = null, bhref = false;
// H5 plus事件处理
function plusReady() {
    updateSerivces();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener("plusready", plusReady, false);
}
/**
 * 更新分享服务
 */
function updateSerivces() {
    plus.share.getServices(function (s) {
        shares = {};
        for (var i in s) {
            var t = s[i];
            shares[t.id] = t;
        }
    }, function (e) {
        console.log("获取分享服务列表失败：" + e.message);
    });
}

/**
   * 分享操作
   * @param {String} id
   */
function shareAction(id, ex) {
    var s = null;
    if (!id || !(s = shares[id])) {
        return;
    }
    if (s.authenticated) {
        shareMessage(s, ex);
    } else {
        console.log("---未授权---");
        s.authorize(function () {
            shareMessage(s, ex);
        }, function (e) {
            console.log("认证授权失败：" + e.code + " - " + e.message);
        });
    }
}
/**
   * 发送分享消息
   * @param {plus.share.ShareService} s
   */
function shareMessage(s, ex) {
    var msg = { content: sharecontent, extra: { scene: ex } };
    if (bhref) {
        msg.href = sharehref;
        if (sharehrefTitle && sharehrefTitle != "") {
            msg.title = sharehrefTitle;
        }
        if (sharehrefDes && sharehrefDes != "") {
            msg.content = sharehrefDes;
        }
        msg.thumbs = ["_www/logo.png"];
    } else {

        if (sharepic) {
            msg.pictures = [sharepic];
        }
    }
    console.log(JSON.stringify(msg));
    s.send(msg, function () {
        console.log("分享到\"" + s.description + "\"成功！ ");
    }, function (e) {
        console.log("分享到\"" + s.description + "\"失败: " + e.code + " - " + e.message);
    });
}
/**
 * 解除所有分享服务的授权
 */
function cancelAuth() {
    try {
        for (var i in shares) {
            var s = shares[i];
            if (s.authenticated) {
            }
            s.forbid();
        }
        // 取消授权后需要更新服务列表
        updateSerivces();
    } catch (e) { plus.nativeUI.alert(e); }
}

//短信
function sendSms() {
    var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
    msg.to = [];
    msg.body = sharecontent;
    plus.messaging.sendMessage(msg, function () {console.log("短信发送成功！") }, function (error) {console.log("短信发送失败！")  });
}

// 使用图片分享
function sharePicture(url) {
    plus.io.resolveLocalFileSystemURL(url, function (entry) {
        sharepic = entry.toLocalURL();
        //pic.realUrl = url;
        console.log(sharepic);
    }, function (e) {
        console.log("读取Logo文件错误：" + e.message);
    });
}

var sharecontent = "分享经济 智慧理财";
var sharehref = "分享经济 智慧理财";
var sharehrefTitle = "分享经济 智慧理财";
var sharehrefDes = "分享经济 智慧理财";
var bhref = false;
var sharepic = "";
// 打开分享
function shareShow(conteent, barcode, shareitem) {
    sharecontent = "吃喝玩乐找优惠，就上掌创购，消费等同理财，稳赚金币";

    // 短信
    if (shareitem == -1) {
        sharecontent = "我用的掌创购app，吃喝玩乐很实惠哦，快来看看吧。http://www.o2abc.com/download";
        sendSms();
        return;
    }

    // 分享
    plus.io.resolveLocalFileSystemURL(barcode, function (entry) {
        sharepic = entry.toLocalURL();
        var ids = [{ id: "weixin", ex: "WXSceneSession" }, { id: "weixin", ex: "WXSceneTimeline" }, { id: "sinaweibo" }, { id: "tencentweibo" }];
        var bts = [{ title: "发送给微信好友" }, { title: "分享到微信朋友圈" }, { title: "分享到新浪微博" }];
        if (plus.os.name == "iOS") {
            ids.push({ id: "qq" });
            bts.push({ title: "分享到QQ" });
        }

        if (shareitem < 0 || shareitem > ids.length) { return; }

        shareAction(ids[shareitem].id, ids[shareitem].ex);

    }, function (e) {
        console.log("读取Logo文件错误：" + e.message);
    });



}
