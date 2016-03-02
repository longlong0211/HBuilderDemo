// 下载wgt文件
function downWgt(wgtUrl) {
    // 是否升级包
    var iswgtPackage = (wgtUrl.indexOf('.wgt') > 0);
    var packageType = wgtUrl.substr(wgtUrl.lastIndexOf('.') + 1);
    if (packageType == "ipa") {
        installIpa();
        return;
    }

    plus.nativeUI.showWaiting(" 下载中... ");
    plus.downloader.createDownload(wgtUrl, { filename: "_doc/update/" }, function (d, status) {
        if (status == 200) {
            console.log("下载wgt成功：" + d.filename);
            if (packageType == "wgt") {
                installWgt(d.filename);
            } else if (packageType == "apk") {
                installApk(d.filename);
            }
        } else {
            console.log("下载wgt失败！");
            plus.nativeUI.closeWaiting();
            plus.nativeUI.alert("下载失败！");
        }

    }).start();
}

// 更新应用资源
function installWgt(path) {
    plus.nativeUI.showWaiting(" 更新中... ");
    plus.runtime.install(path, {}, function () {
        plus.nativeUI.closeWaiting();
        console.log("安装wgt文件成功！");
        plus.nativeUI.toast("更新完成！");
        plus.runtime.restart();
    }, function (e) {
        plus.nativeUI.closeWaiting();
        console.log("安装wgt文件失败[" + e.code + "]：" + e.message);
        plus.nativeUI.alert("更新失败[" + e.code + "]：" + e.message);
    });
}

// 安装android包
function installApk(path) {
    try {
        plus.runtime.openFile(path, {}, function (e) { plus.nativeUI.alert("更新失败[" + e.code + "]：" + e.message); });
        plus.runtime.quit();
    } catch (e) {
        plus.nativeUI.alert("更新失败：" + e.message);
    }
}

// 安装IOS包
function installIpa() {
    try {
        plus.nativeUI.closeWaiting();
        plus.nativeUI.alert("为了给您带来更好体验，请更新此版本，谢谢您的支持! \ntip: 退出应用，查看更新进度 ", function () {
            plus.runtime.openURL("itms-services://?action=download-manifest&url=https://dn-eclanp.qbox.me/app.plist");
        }, "重要提示");
    } catch (e) {

    }

}