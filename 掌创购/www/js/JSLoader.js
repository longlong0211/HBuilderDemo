/*
*JS文件动态加载工具(2011-12-12)
*/
var JSLoader = {
    scripts: {
        jquery: "http://appstatic.o2abc.com/js/config.js"
    },
    browser: {
        ie: /msie/.test(window.navigator.userAgent.toLowerCase()),
        moz: /gecko/.test(window.navigator.userAgent.toLowerCase()),
        opera: /opera/.test(window.navigator.userAgent.toLowerCase()),
        safari: /safari/.test(window.navigator.userAgent.toLowerCase())
    },
    call: (function () {
        function hasFile(tag, url) {
            var contains = false;
            var files = document.getElementsByTagName(tag);
            var type = tag == "script" ? "src" : "href";
            for (var i = 0, len = files.length; i < len; i++) {
                if (files[i].getAttribute(type) == url) {
                    contains = true;
                    break;
                }
            }
            return contains;
        }
        function fileExt(url) {
            var att = url.split('.');
            var ext = att[att.length - 1].toLowerCase();
            return ext;
        }
        function loadFile(element, callback, parent) {
            var p = parent && parent != undefined ? parent : "head";
            document.getElementsByTagName(p)[0].appendChild(element);
            if (callback) {
                //ie
                if (JSLoader.browser.ie) {
                    element.onreadystatechange = function () {
                        if (this.readyState == 'loaded' || this.readyState == 'complete') {
                            callback();
                        }
                    };
                } else if (JSLoader.browser.moz) {
                    element.onload = function () {
                        callback();
                    };
                } else {
                    callback();
                }
            }
        }
        function loadCssFile(files, callback) {
            if (!files || files.length == 0) { return; }
            var urls = files && typeof (files) == "string" ? [files] : files;
            for (var i = 0, len = urls.length; i < len; i++) {
                var cssFile = document.createElement("link");
                cssFile.setAttribute('type', 'text/css');
                cssFile.setAttribute('rel', 'stylesheet');
                cssFile.setAttribute('href', "http://appstatic.o2abc.com/V1/css/" + urls[i]);
                if (!hasFile("link", urls[i])) {
                    loadFile(cssFile, callback);
                }
            }
        }
        function loadScript(files, callback, parent) {
            var urls = files && typeof (files) == "string" ? [files] : files;
            for (var i = 0, len = urls.length; i < len; i++) {
                var script = document.createElement("script");
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('src', "http://appstatic.o2abc.com/V1/js/" + urls[i]);
                if (!hasFile("script", urls[i])) {
                    loadFile(script, callback, parent);
                }
            }
        }
        function includeFile(options) {
            var r = options;
            //如果传入的是文件名列表则转化为对应的对象
            if (typeof (options) == "string") {
                var cssFiles = [], scripts = [];
                var files = options.split(',');
                for (var i = 0, len = files.length; i < len; i++) {
                    var ext = fileExt(files[i]);
                    switch (ext) {
                        case "css":
                            cssFiles.push(files[i]);
                            break;
                        case "js":
                            scripts.push(files[i]);
                            break;
                    }
                }
                r.cssFiles = cssFiles;
                r.scripts = scripts;
            }
            //首先加载css，再次加载script
            loadCssFile(r.cssFiles, function () {
                //加载预备script
                //loadScript(JSLoader.scripts.jquery, function () {

                //});

            });

            //加载页面所需的script
            loadScript(r.scripts, null, "head");


        }
        return { include: includeFile };
    })()
};
/*
* 供外部调用接口
* include("1.css,2.css,3.js,4.css...");
* include({cssFiles:[], scripts:[]})
*/
var include = function (options) {
    JSLoader.call.include(options);
}