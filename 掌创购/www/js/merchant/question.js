// 霸王餐活动


function plusReady() {
    bindEvent();
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}


function bindEvent() {
    // 选择
    $("input[type=radio]").on("click", function () {
        if ($(this).val() != "1") {
            // 错误答案标红
            $("label[for=" + $(this).attr('id') + "]").css({ "color": "red", "border-bottom": "thin dashed red" });
        } else {
            // 正确答案清空错误样式
            $(this).parents("div[class=bwwt]").find("label").attr("style", "");
        }
    })

    // 提交
    $("#submit").on("click", function () {
        var hasError = false;
        // 答题未完成
        if ($("input[type=radio]:checked").length < 7) {
            plus.nativeUI.alert("答题未完成！");
            return;
        }

        // 错误
        $("label[for^=radio]").each(function () {
            if ($(this).attr("style") && $(this).attr("style").indexOf("red") > 0) {
                hasError = true;
                plus.nativeUI.alert("您的选择错误，请重新选择");
                return;
            }
        });

        if (!hasError) {
            // 跳转到报名页
            var currentview = plus.webview.currentWebview();
            var joinPage = plus.webview.create("join.html", "join.html", {}, { lunchid: currentview.lunchid, goodsid: currentview.goodsid, price: currentview.price, is_paybycard: currentview.is_paybycard });
            joinPage.show("slide-in-right", 300, function () { currentview.close(); });
        }
    })

    // 返回
    $("#back").on("click", function () {
        // 未完成问卷返回上一步
        plus.webview.currentWebview().close();
    })
}

