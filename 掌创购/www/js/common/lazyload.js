; (function ($) {
    $.fn.extend({
        lazyload: function (Options) {
            var gThis = $(this),
                win = $(window),

                throttle = function (fn, delay) {    //函数节流，【执行函数，延迟时间】
                    var timer,
                        startTime = new Date();

                    return function () {
                        clearTimeout(timer);

                        if (!delay && new Date() - startTime > 100) {    //没有延迟，并判断延迟滚动时间的必须的时间
                            startTime = new Date();
                            fn()

                        } else if (delay) {
                            timer = setTimeout(function () {
                                startTime = new Date();
                                fn()
                            }, delay)
                        }
                    }
                },

                settings = $.extend({
                    effect: 'fadeIn',
                    fadeTime: 600,
                    delay: 400
                }, Options);

            loading();    //开始便加载已经出现在可视区的图片
            win.on('scroll.lazyload', throttle(loading, settings.delay));

            function loading() {
                if (!gThis.length) return win.off('scroll.lazyload');    //当所有的图片都加载完，移除窗口滚动事件

                gThis.each(function () {
                    var _this = $(this),
                        top = win.scrollTop(),
                        imgTop = _this.offset().top,
                        imgHeight = _this.outerHeight(true);
                    var tempsrc = _this.attr('src');
                    if (tempsrc != null && tempsrc != "" && tempsrc.indexOf('defaultpic.jpg') < 0) {
                        return;
                    }

                    var preheight = 400;
                    var ispre = ((top + win.height() > imgTop - preheight) && (imgTop - preheight + imgHeight > top));
                    if ((top + win.height() > imgTop && imgTop + imgHeight > top) || ispre) {
                        gThis = gThis.not(_this);    //删除jQuery选择好的元素集合中已经被加载的图片元素

                        var dSrc = _this.attr('data-src');
                        //                      if (tempsrc.length == 1) { }
                        $(new Image()).prop('src', dSrc).load(function () {    //替换图片URL
                            _this.attr('src', dSrc);
                            //                        settings.effect == 'fadeIn' && _this.css('opacity', 0).animate({ opacity: 1 }, settings.fadeTime)
                        })
                    }
                })
            }

            return $(this)
        }
    })
})(jQuery);