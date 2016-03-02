//$(function() {	plusReady();})

function plusReady() {
    var currentuser = JSON.parse(plus.storage.getItem(storageManager.user));

    if (currentuser.barcode) {
        try {
            plus.io.resolveLocalFileSystemURL(currentuser.barcode, function (entry) {
                var filepath = plus.io.convertLocalFileSystemURL(currentuser.barcode);
                $("#personbarcode").html("<img src='" + filepath + "'>");
            }, function (e) {
                CreateUserBarCode(currentuser);
            });
        } catch (err) {
            CreateUserBarCode(currentuser);
        }
    } else {
        CreateUserBarCode(currentuser);
    }
}

if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}


// 生产用户唯一标识二维码
function CreateUserBarCode(currentuser) {
    $.ajax({
        type: 'Get',
        async: false,
        url: configManager.RequstUrl + 'api/common/qrcode?type=login&code=' + currentuser.code
    }).done(function (data) {
        if (data.state != "success") {
            console.log(data.message);
            return;
        }

        $("#personbarcode").html("<img src='" + data.uri + "'>");

        // 下载本地
        var dtask = plus.downloader.createDownload(data.uri, {}, function (d, status) {
            // 下载完成
            if (status == 200) {
                currentuser.barcode = d.filename;
                plus.storage.setItem(storageManager.user, JSON.stringify(currentuser));
            } else {

            }
        });
        dtask.start();
    });
}