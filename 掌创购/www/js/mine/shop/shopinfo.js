function plusReady() {
    // 获取当前用户
    var currentuser = JSON.parse(plus.storage.getItem(storageManager.user));
    var storeinfo = currentuser.store;
//  console.log(plus.storage.getItem(storageManager.user));
    $("#storename").text(storeinfo.store_name);
    $("#editshopinfo").on("click", function () { clicked("editshopinfo.html", false, false, "slide-in-right"); });
    $("#bbnone").on("click", function () { clicked("shopbarcode.html", false, false, "slide-in-right"); });
}
if (window.plus) {
    plusReady();
} else {
    document.addEventListener('plusready', plusReady, false);
}
