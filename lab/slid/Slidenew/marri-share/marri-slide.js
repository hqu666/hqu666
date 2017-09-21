(function ($) {
    var setCount = 2;
    var stackCount = 4;
    var isReload = false;
    var settings;
    var count = 0;
    var maxId = 0;

    $.fn.slideshow = function (options) {
        settings = $.extend({
            'debug': true,
            'ceremonyId': '',
            'token': '',
            'span': {
                'animation': 10000
            }
        }, options);

        settings.debug = false;

        _log('> marri-slide loaded');
        var promise = initialize();
        promise.done(function () {
            dataQueueing();
            //pushNewImages();
            //dataBind()
            setTimeout(function () {
                dataBind()
            }, 3000);
            if (settings.debug) {
                displayCenterPoint();
            }
        });
    };

    var initialize = function () {
        _log('>> initialize begin');
        var defer = $.Deferred();
        clearLocalStorage();

        $.ajaxSetup({cache: false}); // cache off
        $.ajax({
            url: "/" + settings.ceremonyId + "/slideshow/init/token:" + settings.token + "/",
            dataType: "json"
        }).done(function (data) {
            _log('initialize success.');
            _log('response data : ');
            _log(data);
            setLocalStorage(data);
        }).fail(function (data) {
            _log('initialize failed.');
        }).always(function () {
            defer.resolve();
        });
        _log('>> initialize ended.');
        return defer.promise(); // プロミスを作って返す
    };

    /*
     * localStorage削除
     */
    function clearLocalStorage() {
        localStorage.removeItem('all-keys'); // 現時点でのイメージリスト(id)
        localStorage.removeItem('update-keys'); // 割り込み用のイメージリスト(id)
        localStorage.removeItem('queue'); // キューに入っているイメージ情報(id, url, ...)
        localStorage.removeItem('displayed'); // 表示されているイメージ情報(id, url, ...)
        localStorage.removeItem('resent-update');
        _log('>>> local storage cleared');
    }

    /*
     * localStorage初期化
     */
    function setLocalStorage(data) {
        localStorage.setItem("all-keys", JSON.stringify(data.ids));

        var maxId;
        if($.cookie('slideshow.max-id') != null) {
            maxId = $.cookie('slideshow.max-id');
            $.removeCookie('slideshow.max-id');

            if(typeof(maxId) == "undefined") {
                var images = data.ids;
                images.sort();
                maxId = images[images.length - 1];
            }
        } else {
            var images = data.ids;
            images.sort();
            maxId = images[images.length - 1];
        }

        localStorage.setItem("maxid", maxId);
        localStorage.setItem("update-keys", null);
        localStorage.setItem("queue", null);
        localStorage.setItem("displayed", null);
        localStorage.setItem("resent-update", new Date());
        _log('>>> local storage initialized');
    }

    function dataQueueing() {
        var queue = [];

        if (localStorage.getItem("queue") != "null") {
            queue = JSON.parse(localStorage.getItem("queue"));
        }
        if (queue == null) { queue = []; }

        if (queue.length >= stackCount) {
            _log('[QUEUE] queueing process skipped.');
            localStorage.setItem("queue.status", "stopped");
            pushNewImages();
            setTimeout(function () {
                dataQueueing()
            }, 500);
            return;
        }
        localStorage.setItem("queue.status", "running");

        var images = JSON.parse(localStorage.getItem("all-keys"));
        var newImages = [];
        if (localStorage.getItem("update-keys") != "null") {
            newImages = JSON.parse(localStorage.getItem("update-keys"));
        }
        if (newImages == null) { newImages = []; }

        var photos = [];
        while (photos.length < setCount) {
            if (newImages.length > 0) {
                photos.push(popNewImages(newImages));
            } else {
                photos.push(popBaseImages(images));
            }
        }

        //var tmpPhoto = photos;
        photos = $.grep(photos, function(e){return e !== null;});

        localStorage.setItem("photos", JSON.stringify(photos));
        _log("[QUEUE] append new item.");
        _log("  > " + photos);

        $.ajax({
            type: "POST",
            url: "/" + settings.ceremonyId + "/slideshow/get/token:" + settings.token + "/",
            data: JSON.stringify(photos),
            contentType: 'application/json',
            dataType: "json"
        }).done(function (data) {
            queue = JSON.parse(localStorage.getItem("queue"));
            if( queue == null ) { queue = []; }
            //if($.isEmptyObject(queue)) { queue = []; }

            $.each(data, function (i, photo) {
                $.preloadImages(photo.image);
                queue.push(photo);
            });
            localStorage.setItem("queue", JSON.stringify(queue));
            localStorage.setItem("queue.count", queue.length);

            if($.isEmptyObject(queue)) {
                setTimeout(function () {
                    dataQueueing()
                }, 300);
                return;
            }

            pushNewImages();
        }).fail(function (data) {
        }).always(function () {
            setTimeout(function () {
                dataQueueing()
            }, 7000);
        });
    }

    function pushNewImages() {
        $.ajaxSetup({cache: false});

        var maxId = localStorage.getItem("maxid");
        var newImages = [];
        if (localStorage.getItem("update-keys") != "null") {
            newImages = JSON.parse(localStorage.getItem("update-keys"));
        }
        if(newImages == null) { newImages = []; }

        $.ajax({
            type: "POST",
            url: "/" + settings.ceremonyId + "/slideshow/update/token:" + settings.token + "/",
            data: {"last": maxId},
            dataType: "json"
        }).done(function (data) {
            if (data.update) {
                newImages = data.update;
                //$.merge(newImages, data.update);
            }
            //$.unique(newImages);

            localStorage.setItem("update-keys", JSON.stringify(newImages));
            localStorage.setItem("resent-update", new Date());
        }).fail(function (data) {
        }).always(function () {
        });
    }

    //function updateImageList() {
    //    var imagesJson = localStorage.getItem("all-keys");
    //    $.ajax({
    //        type: "POST",
    //        url: "/" + settings.ceremonyId + "/slideshow/sync/token:" + settings.token + "/",
    //        data: imagesJson,
    //        dataType: "json"
    //    }).done(function (data) {
    //        $.unique(data);
    //        localStorage.setItem("all-keys", JSON.stringify(data));
    //    }).fail(function (data) {
    //    });
    //
    //    var images = JSON.parse(localStorage.getItem("all-keys"));
    //    images.sort();
    //    maxId = images[images.length - 1];
    //    //localStorage.setItem("maxid", maxId);
    //
    //}

    function popNewImages(images) {
        var imageId = null;
        if (images.length > 0) {
            imageId = images[0];
            images.splice(0, 1);
            localStorage.setItem("update-keys", JSON.stringify(images));
            localStorage.setItem("maxid", imageId);
        }
        return imageId;
    }

    function popBaseImages(images) {
        var imageId = null;
        if (images.length > 0) {
            imageId = images[0];
            images.splice(0, 1);
            localStorage.setItem("all-keys", JSON.stringify(images));
        }
        return imageId;
    }

    //function pushBaseImages(images) {
    //    var allImages = JSON.parse(localStorage.getItem("all-keys"));
    //    var imageId = null;
    //    for (i = 0; i < images.length; i++) {
    //        allImages.push(images[i]);
    //    }
    //    $.unique(allImages);
    //    localStorage.setItem("all-keys", JSON.stringify(allImages));
    //
    //    updateImageList();
    //}

    function dataBind() {

        if(isReload) { return; }

        var allImages = JSON.parse(localStorage.getItem("all-keys"));
        var queue = [];
        if (localStorage.getItem("queue") != "null") {
            queue = JSON.parse(localStorage.getItem("queue"));
        }

        if (queue.length <= 0) {
            if ($.isEmptyObject(allImages)) {
                $.cookie('slideshow.max-id', localStorage.getItem("maxid"));
                isReload = true;
                $("#bg-video").fadeTo(5000,0.0, function(){
                    window.location.reload();
                })

            }
            setTimeout(function () {
                dataBind();
            }, 500);
            return;
        }

        var nextImages = [];
        while (nextImages.length < setCount) {
            nextImages.push(queue[0]);
            queue.splice(0, 1);
        }

        var ids = [];
        $.each(queue, function(i, photo) {
            ids.push(photo.photoid);
        });
        localStorage.setItem("queue.ids", ids);
        localStorage.setItem("queue", JSON.stringify(queue));
        localStorage.setItem("displayed", JSON.stringify(nextImages));

        var data = {images: nextImages};

        var template = Hogan.compile($('.templateResult').text());

        if (!$.isEmptyObject(nextImages)) {
            var nU = Math.floor(new Date().getTime() / 1000);
            var ids = [null, null];
            var md5val;
            $.each(data.images, function(i) {
                md5val = CryptoJS.MD5(this.id + nU).toString();
                ids[i] = "#"+md5val;
                this.md5 = md5val;
            });

            $('#slide-data').append(template.render(data));
            slideIn(ids[0], ids[1]);
        }

        setTimeout(function () {
            dataBind();
        }, 8000);
    }

    function slideIn(id1, id2) {
        if(id1) {
            _log(id1);
            slideAnimation($(id1), 0);
        }
        if(id2) {
            _log(id2);
            slideAnimation($(id2), 1);
        }
    }

    function displayCenterPoint() {
        var w = $(window).width();
        var h = $(window).height();

        var x = w / 2;
        var y = h / 2;


        $("body").css("margin", 0);
        $("#horizontal").remove();
        $("body").append("<div id='horizontal' style='background-color: red; width: " + w + "px; height: 1px; margin: 0; top: " + y + "px; left: 0; position: fixed; z-index: 99999'></div>");
        $("#vertical").remove();
        $("body").append("<div id='vertical' style='background-color: red; width: 1px; height: " + h + "px; margin: 0; top: 0; left: " + x + "px; position: fixed; z-index: 99999'></div>");
        $("#vertical-1").remove();
        $("body").append("<div id='vertical-1' style='background-color: red; width: 1px; height: " + h + "px; margin: 0; top: 0; left: " + x / 2 + "px; position: fixed; z-index: 99999'></div>");
        $("#vertical-2").remove();
        $("body").append("<div id='vertical-2' style='background-color: red; width: 1px; height: " + h + "px; margin: 0; top: 0; left: " + (x + x / 2) + "px; position: fixed; z-index: 99999'></div>");


        $("#vertical-1-1").remove();
        $("body").append("<div id='vertical-1-1' style='background-color: OrangeRed; width: 1px; height: " + h + "px; margin: 0; top: 0; left: " + ( x - x / 10) + "px; position: fixed; z-index: 99999'></div>");

        $("#vertical-1-2").remove();
        $("body").append("<div id='vertical-1-2' style='background-color: OrangeRed; width: 1px; height: " + h + "px; margin: 0; top: 0; left: " + ( x / 2 + x / 20) + "px; position: fixed; z-index: 99999'></div>");

        $("#vertical-1-3").remove();
        $("body").append("<div id='vertical-1-3' style='background-color: OrangeRed; width: 1px; height: " + h + "px; margin: 0; top: 0; left: " + ( x / 10) + "px; position: fixed; z-index: 99999'></div>");

        $("#vertical-2-1").remove();
        $("body").append("<div id='vertical-2-1' style='background-color: OrangeRed; width: 1px; height: " + h + "px; margin: 0; top: 0; left: " + ( x + x / 6) + "px; position: fixed; z-index: 99999'></div>");

        $("#vertical-2-2").remove();
        $("body").append("<div id='vertical-2-2' style='background-color: OrangeRed; width: 1px; height: " + h + "px; margin: 0; top: 0; left: " + ( x + x / 2 - x / 20) + "px; position: fixed; z-index: 99999'></div>");
    }

    function resizeImage(img, w, h) {
        var imgHeight = img.height();
        var imgWidth = img.width();
        // むりやり
        imgHeight = img.data('height');
        imgWidth = img.data('width');

        var ratio;
        var tempHeight;
        var tempWidth;

        tempHeight = h;
        ratio = tempHeight / imgHeight;
        tempWidth = imgWidth * ratio;

        imgHeight = tempHeight;
        imgWidth = tempWidth;

        tempWidth = w;
        //tempWidth = (imgWidth > w) ? w : w;

        if (imgWidth > tempWidth) {
            ratio = tempWidth / imgWidth;
            tempHeight = imgHeight * ratio;

            _log("  resize height: " + tempHeight + "px");
            _log("  resize width : " + tempWidth + "px");

            imgHeight = tempHeight;
            imgWidth = tempWidth;
        }

        imgHeight *= 0.9;
        imgWidth *= 0.9;

        return {width: imgWidth, height: imgHeight};
    }

    function getWindowParameter() {
        var w = $(window).width(); // current window size - width
        var h = $(window).height(); // current window size - height
        var x = w / 2; // current center position - x
        var y = h / 2; // current center position - y
        return {w: w, h: h, x: x, y: y};
    }

    function getImageSize(images) {
        var h = images.height();
        var w = images.width();
        return {height: h, width: w};
    }

    function getParameters(image, _side) {
        var side = _side || 0;
        var windowInfo = getWindowParameter();
        var imageInfo = getImageSize(image);
        var params = {
            left: {
                init: {
                    //left: ( windowInfo.w / 2 ) - (imageInfo.width * 0.4 / 2)
                    //left: ( windowInfo.x ) - ( windowInfo.x / 7  )
                    left: ( windowInfo.x ) - ( windowInfo.x / 10 )
                },
                begin: {
                    left: ( windowInfo.x / 2 ) + ( windowInfo.x / 20 ),
                    rotate: "-5deg"
                },
                middle: {
                    left: ( windowInfo.x / 2 ),
                    rotate: "-5deg"
                },
                end: {
                    //left: -( windowInfo.x / 2  ) ,
                    //left: ( windowInfo.x / 2 ) - ( windowInfo.x / 7 ) ,
                    left: ( windowInfo.x / 10 ) + ( windowInfo.x / 20 ),
                    rotate: "-5deg"
                }
            },
            right: {
                init: {
                    //left: ( windowInfo.w / 2 ) + (imageInfo.width * 0.4 / 2)
                    left: (windowInfo.x) + ( windowInfo.x / 6)
                },
                begin: {
                    left: (windowInfo.x) + ( windowInfo.x / 2 ) - ( windowInfo.x / 20 ),
                    rotate: "5deg"
                },
                middle: {
                    left: (windowInfo.w / 2) + ( windowInfo.x / 2 ),
                    rotate: "5deg"
                },
                end: {
                    left: (windowInfo.w / 2) + ( windowInfo.x / 2 ) + ( windowInfo.x / 7 ),
                    rotate: "5deg"
                }
            }
        };

        var param;
        if (side == 0) {
            param = params.left;
        } else {
            param = params.right;
        }

        return param;
    }

    /*
     @var side 0: left, 1: right
     */
    function slideAnimation(image, side) {
        var objWindow = $(window);
        var w = objWindow.width(); // current window size - width
        var h = objWindow.height(); // current window size - height
        var x = w / 2; // current center position - x
        var y = h / 2; // current center position - y

        //var image = $("#image1");

        var winfo = getWindowParameter();
        var param = getParameters(image, side);
        var obj = resizeImage(image, winfo.w / 2, winfo.h);

        //image.css({height: obj.height, width: obj.width});

        //var imgHeightResize = image.height();
        //var imgWidthResize = image.width();
        var imgHeightResize = obj.height;
        var imgWidthResize = obj.width;

        var scale;

        image.css({
            display: 'block',
            opacity: 0.0,
            height: obj.height,
            width: obj.width,
            marginLeft: -(imgWidthResize / 2),
            marginTop: -(imgHeightResize / 2),
            left: param.init.left,
            top: y,
            position: "absolute",
            '-webkit-backface-visibility': 'hidden'
        }).animate(
            {
                opacity: 1.0,
                left: param.begin.left
            },
            {
                duration: 7000,
                easing: 'easeOutCubic',
                step: function (now, x) {
                    if (x.prop == 'opacity') {
                        //scale = 0.4 + now * 0.5;
                        scale = now;
                        image.css({
                            transform: 'scale(' + scale + ') rotate(' + param.middle.rotate + ')',
                            '-webkit-transform': 'scale(' + scale + ') rotate(' + param.middle.rotate + ')',
                            '-moz-transform': 'scale(' + scale + ') rotate(' + param.middle.rotate + ')',
                            '-o-transform': 'scale(' + scale + ') rotate(' + param.middle.rotate + ')',
                            '-ms-transform': 'scale(' + scale + ') rotate(' + param.middle.rotate + ')',
                            '-webkit-backface-visibility': 'hidden'
                        });
                    }
                },
                complete: function () {

                    image.animate(
                        {
                            opacity: 0.0,
                            left: param.end.left
                            //left: 0
                        },
                        {
                            duration: 2000,
                            easing: 'easeInQuart',
                            step: function (now, x) {

                                //scale = now;
                                if (x.prop == 'opacity') {

                                    image.css({
                                        transform: 'scale(' + scale + ') rotate(' + param.end.rotate + ')',
                                        '-webkit-transform': 'scale(' + scale + ') rotate(' + param.end.rotate + ')',
                                        '-moz-transform': 'scale(' + scale + ') rotate(' + param.end.rotate + ')',
                                        '-o-transform': 'scale(' + scale + ') rotate(' + param.end.rotate + ')',
                                        '-ms-transform': 'scale(' + scale + ') rotate(' + param.end.rotate + ')',
                                        '-webkit-backface-visibility': 'hidden'
                                    });
                                    scale = 2 - now;
                                }
                            },
                            complete: function () {
                                //image.css('display', 'none');
                                image.remove();
                                setTimeout(function () {
                                    image.remove();
                                }, 1000);
                            }

                        }
                    );


                }
            }
        );
    }

    var timer = false;
    $(window).resize(function () {
        if (timer !== false) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            _log('resized');
        }, 200);
    });

    $.preloadImages = function () {
        for (var i = 0; i < arguments.length; i++) {
            _log('preload : ' + arguments[i]);
            jQuery("<img>").attr("src", arguments[i]);
        }
    };

    function _log(val) {
        (settings.debug) ? console.log(val) : null;
    }

})(jQuery);
