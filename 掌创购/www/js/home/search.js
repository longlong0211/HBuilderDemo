var _currentcityInfo;
var _searchfromMerchant;
function plusReady() {
    _searchfromMerchant = ("g" != getUrlParam("f"));
    // 当前城市
    _currentcityInfo = JSON.parse(plus.storage.getItem(storageManager.currentcity));
    //初始化页面
    InitPage();
    BindEvent();

    var searchtext = (_searchfromMerchant) ? plus.storage.getItem(storageManager.searchtext) : plus.storage.getItem(storageManager.groupbysearchtext);
    $("#searchvalue").val(searchtext);
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}


function InitPage() {
    // 搜索热词
    $.ajax({
        type: "GET",
        url: configManager.RequstUrl + "api/common/keywords?city=" + _currentcityInfo.id + "&limit=10",
        async: true,
    }).done(function (data) {
        if ("success" != data.state) { console.log(data.message); return false; }
        var html = [];
        html.push("<ul class='search-list-block '>");
        for (var i = 0; i < data.data.length; i++) {
            html.push("<li name='word'><a>" + data.data[i].word + "</a></li>");
        }
        html.push("</ul>");

        $("#hotwordlist").html(html.join(""));
    });
}

// 搜索
function search(text) {
    try {
        var searchtext = $("#searchvalue").val();
        if (text) { searchtext = text; }

        if (_searchfromMerchant) {
            if (!searchtext || searchtext == "") {
                plus.storage.removeItem(storageManager.searchtext);
            } else {
                plus.storage.setItem(storageManager.searchtext, searchtext);
            }

            // 通知商家列表页更新
            plus.webview.getWebviewById(pageName.main).evalJS("redirect('footermerchant')");
            var targepage = plus.webview.getWebviewById(pageName.merchant);
            if (targepage) {
                plus.webview.getWebviewById(pageName.merchant).evalJS("receiveSearchEvent()");
            }
        } else {
            if (!searchtext || searchtext == "") {
                plus.storage.removeItem(storageManager.groupbysearchtext);
            } else {
                plus.storage.setItem(storageManager.groupbysearchtext, searchtext);
            }

            // 通知团购列表页更新
            plus.webview.currentWebview().opener().evalJS("receiveSearchEvent()");
        }

        plus.webview.currentWebview().close();
    } catch (err) {
        console.log("缓存：放入搜索条件失败");
    }
}


function BindEvent() {
    // 键盘搜索
    $(document).keydown(function (e) {
        if (e.keyCode == 13) {
            search();
        }
    });

    $("#btnsearch").on("click", function () { search(); });

    // 选中某个热词
    $("#hotwordlist").on("click", "li[name=word]", function () {
        var text = $(this).find('a').text();
        search(text);
    });

    // 回退
    $("#back").on("click", function () {
        var searchtext = $("#searchvalue").val();
        if (!searchtext || searchtext.trim() == "") {
            var cachetext = (_searchfromMerchant ? plus.storage.getItem(storageManager.searchtext) : plus.storage.getItem(storageManager.groupbysearchtext));
            if (cachetext) {
                if (_searchfromMerchant) {
                    plus.storage.removeItem(storageManager.searchtext);
                } else {
                    plus.storage.removeItem(storageManager.groupbysearchtext);
                }

                search();
            }
        }

        back();
    });
}








