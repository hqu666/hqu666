//背景設定////////////////////////////////////////////////////////////////// 
/**
 * 式場設定・スライドショー・背景設定で指定された背景の反映
 *   [marri-slide-wall.js]
 * */   
function bgWall() {
    var dbMsg = "[bgWall]";

    parentOj = document.getElementById("newimg_div"); //Canvasの親ノード
    //        ElementRequestFullscreen(this);                             //document.getElementById("canvas_bace")だとFailed to execute 'requestFullscreen' on 'Element': API can only be initiated by a user gesture.
//        var ceremonies_slide_bg = ceremonies_slide_bg * 1;             //$data['ceremony']['ceremonies_slide_bg'] * 1; //☆*1で演算して数値化
    dbMsg = dbMsg + ",ceremonies_slide_bg= " + ceremonies_slide_bg;
    if (!isReload) {
        switch (ceremonies_slide_bg) {
            case 0:
            case 1:
            case 8:
            case 9:
                $('#bg_video').css({'display': 'none'});
                document.fgColor = "#00FF00"; //bodyプロパティ        http://www.tagindex.com/javascript/page/color1.html
                break;
            default:
            case 2:
                $('#canvas_aria').css({'display': 'none'});
                document.fgColor = "#000000";
                break;
        }
        switch (ceremonies_slide_bg) {
            case 0:
            case 1:
                dbMsg = dbMsg + ":オリジナル壁紙"
                img_obj = null;
                wallDraw(b_bgv); //キャンバスに静止画読み込み
                break;
            case 8:
                dbMsg = dbMsg + ":紺背景"
                nowColor = '#000030'; //紺塗り  ☆rgb(0, 2, 40)；fireFoxだと設定できても変更できない(FOで止まる) 
                document.body.style.background = nowColor;
                break;
            case 9:
                dbMsg = dbMsg + ":黒背景"
                nowColor = '#000000';
                document.body.style.background = nowColor;
                break;
            default:
            case 2:
                dbMsg = dbMsg + ":marri-shareムービー"
                haikeiHenkou(b_bgv);
                break;
        }
        if (useBGAnime) {
            effectInit();
        } else {
            mainLoopStart() //スライドショースタート
        }
    }
    myLog(dbMsg);
}                                               //指定された壁紙を設定,effectInitを経てストックループスタート

var wallFO_count = 0;
function wallFO() {                        //http://www5e.biglobe.ne.jp/access_r/hp/javascript/js_018.html
    var dbMsg = "[wallFO](" + wallFO_count + ")";
    try {
        var ua = window.navigator.userAgent.toLowerCase();
        var ver = window.navigator.appVersion.toLowerCase();
        dbMsg = dbMsg + ",ua=" + ua + ",ver=" + ver;
        if (ua.indexOf('firefox') != -1) {//&& ua.indexOf('chrome') == -1
            window.location.reload(); //再読み込み
        } else {
            var time = setTimeout(wallFO, 25);
            var nowColor = document.body.style.background;
            dbMsg = dbMsg + ",nowColor=" + nowColor;
            var nextColer = "";
            if (nowColor.match('rgb')) {
                var color = new RGBColor(nowColor)
                nowColor = color.toHex();       //rgbTo16(nowColor);
                dbMsg = dbMsg + ">>" + nowColor;
                //              var rCol = nowColor.s('rgb')
            }
            //            else{
            for (var i = 0, len = nowColor.length; i < len; i++) {
                var c = nowColor.charAt(i);
                if (c == "#" || c == "F" || c == "f") {
                } else if (c == "0" || c == "1" || c == "2" || c == "3" || c == "4" || c == "5" || c == "6" || c == "7" || c == "8") {
                    c = c * 1 + 1;
                } else if (c == "9") {
                    c = "a";
                } else if (c == "A" || c == "a") {
                    c = "c";
                } else if (c == "B" || c == "b") {
                    c = "c";
                } else if (c == "C" || c == "c") {
                    c = "d";
                } else if (c == "D" || c == "d") {
                    c = "e";
                } else if (c == "E" || c == "e") {
                    c = "f";
                }
                nextColer = nextColer + c;
            }
            //        }
            dbMsg = dbMsg + ",nextColer=" + nextColer;
            document.body.style.backgroundColor = nextColer;
            if (nextColer == "#FFFFFF" || nextColer == "#ffffff") {
                clearTimeout(time);
                window.location.reload(); //再読み込み
            } else {
                wallFO_count++;
            }
            dbMsg = dbMsg + ",FO終了";
        }
        myLog(dbMsg);
    } catch (e) {
        console.log(dbMsg);
        window.location.reload(); //再読み込み
    }
}                                               //body着色による単色背景からFOしてリロード

rgbTo16 = function (col) {
    return "#" + col.match(/\d+/g).map(function (a) {
        return ("0" + parseInt(a).toString(16)).slice(-2)
    }).join("");
}                                                                           //http://d.hatena.ne.jp/DECKS/20100907/1283843862

/**
 * 自動フルスクリーン       保留2017/03/08
 * */
function ElementRequestFullscreen(element) {
    var dbMsg = "[ElementRequestFullscreen]element=" + element;
    var list = [
        "requestFullscreen",
        "webkitRequestFullScreen",
        "mozRequestFullScreen",
        "msRequestFullscreen"
    ];
    var i;
    var num = list.length;
    dbMsg = dbMsg + ",num=" + num + "件";
    for (i = 0; i < num; i++) {
        if (element[list[i]]) {
            dbMsg = dbMsg + "(" + i + ")list[" + element[list[i]];
            element[list[i]]();
            return true;
        }
    }
    myLog(dbMsg);
    return false;
}

function wallDraw(file_name) {
    var dbMsg = "[slidenew.index.wallDraw]";
    dbMsg = dbMsg + "src=" + file_name;
    winW = $(window).width();
    winH = $(window).height() + 20; //タイトルバー分？加算
    dbMsg = dbMsg + "[" + winW + "×" + winH + "]";
    $('#canvas_aria').attr("width", (winW + 20) + 'px').attr("height", (winH + 20) + 'px').css({'display': 'inline'}); //main.cssの対策              
    my_canvas = document.getElementById('canvas_aria');
    ctx = my_canvas.getContext('2d'); //☆ページロード直後は非表示なのでサイズプロパティーは取れない
    dbMsg = dbMsg + ",my_canvas" + my_canvas + ",ctx=" + ctx;
    var rStr = "ご利用のブラウザは画像編集機能を";
    if (!my_canvas || !ctx) {
        rStr = rStr + "ご利用頂けません。最新のGoogle Chromeをご利用頂くか、ペイントツールで加工してから選択してください。";
        alert(rStr);
        return false;
    } else {
        rStr = rStr + "ご利用頂けます。\n編集するファイルをアップロードして下さい。";
        $('.moto_info').text(rStr);
    }
    if ($data['ceremony']['ceremonies_slide_bg'] != 2) {                        //ムービーでなければ
        $('#canvas_bace').css("display", "inline-block"); //背景Canvasを表示
        shit_x = 0;
        shit_ｙ = 0;
        resize_w = winW;
        resize_h = winH; //チャンバス内の描画領域
    }
    if (img_obj && (ceremonies_slide_bg == 0 || ceremonies_slide_bg == 1)) {                        //20161118;
        showImage();
    } else {
        img_obj = new Image(); // Imageオブジェクトを生成 
        img_obj.src = file_name; //オブジェクトにデータの読み込み
    }
    //        myLog(dbMsg);
    img_obj.onload = function () {
        dbMsg = dbMsg + "\n[slidenew.index.onload]";
        ctx.clearRect(0, 0, my_canvas.width, my_canvas.height);
        $('#canvas_bace').css("display", "inline-block");
        img_w = img_obj.naturalWidth; // 画像のサイズ
        img_h = img_obj.naturalHeight; //width() / height()でも[810×1080]、
        dbMsg = dbMsg + "、イメージ[" + img_w + "×" + img_h + "]"; //イメージ[874×621]
        aria_w = $('#canvas_aria').width();
        aria_h = $('#canvas_aria').height();
        dbMsg = dbMsg + " , エリア[" + aria_w + "×" + aria_h + "]"; //エリア[916×941]
        var scale_x = aria_w / img_w;
        var scale_y = aria_h / img_h;
        dbMsg = dbMsg + " , scale_x=" + scale_x + ",scale_y" + scale_y; //、scale_x=1.0480549199084668,scale_y1.5152979066022545
        scale_xy = scale_x;
        if (scale_x < scale_y) {
            scale_xy = scale_y;
        }
        dbMsg = dbMsg + "、スケール=" + scale_xy; //スケール=1.5152979066022545
        cyouhen = img_w;
        tanpen = img_h;
        if (img_w < img_h) {
            cyouhen = img_h;
            tanpen = img_w;
            //       moto_tate = true;
            dbMsg = dbMsg + "縦長"; //読み込み前は高さが取れない
        }
        ctx_w = ctx.canvas.width; //  canvas#canvas_aria
        ctx_h = ctx.canvas.height;
        dbMsg = dbMsg + "読み込み前[" + ctx_w + "×" + ctx_h + "]"; //読み込み前[916×941]=offsetWidth=clientWidth=scroll 
        offset_top = ctx.canvas.offsetTop;
        offset_left = ctx.canvas.offsetLeft;
        dbMsg = dbMsg + ",offse(" + offset_top + "," + offset_left + ")"; //,offse(-16,0)
        offset_width = ctx.canvas.offsetWidth
        offset_height = ctx.canvas.offsetHeight;
        resize_w = img_w * scale_xy;
        resize_h = img_h * scale_xy; //チャンバス内の描画領域
        dbMsg = dbMsg + ",>リサイズ>[" + resize_w + "×" + resize_h + "]"; //、>リサイズ>[1324.3703703703704×941]、canvas_aria変更[1324.3703703703704×941]、
        shit_x = ctx_w - resize_w;
        dbMsg = dbMsg + "、シフト(" + shit_x;
        if (shit_x < 0) {
            shit_x = shit_x / 2;
            dbMsg = dbMsg + ">横移動>" + shit_x;
        }
        shit_ｙ = ctx_h - resize_h; // Math.subtract(ctx_h , resize_h);
        dbMsg = dbMsg + "," + shit_ｙ;
        if (shit_ｙ < 0) {
            shit_ｙ = shit_ｙ / 2;
            dbMsg = dbMsg + ">縦移動>" + shit_ｙ;
        }
        dbMsg = dbMsg + ",resize_now=" + resize_now; //シフト(-408.37037037037044,0)
        if (resize_now) {                                     //リドロウ以降に画面サイズが変わった
            ctx.globalAlpha = 1.0; //背景の透明化
            ctx.drawImage(img_obj, shit_x, shit_ｙ, resize_w, resize_h); //書き込み
            effectInit();

        } else {
            ctx.globalAlpha = 0.0; //背景の透明化
            startFadeIn();
        }
    }                                                                                       //onload
    img_obj.onerror = function () {                                         //2016/11/18;画像が読み込めなければ
        dbMsg = dbMsg + "\n[slidenew.index.onerror]";
        haikeiHenkou('/files/background.mp4'); //背景をビデオに変更
    }
    //           myLog(dbMsg);
}

//////////////////////////////////
function haikeiHenkou(set_val) {
    var dbMsg = "[Slidenew.index.ctp.haikeiHenkou;背景変更]" + set_val;
    var target = document.getElementById("bg_video");
    var b_src = target.src;
    dbMsg = dbMsg + "," + b_src + "から変更";
    //     myLog(target);
    if (set_val.match('mp4')) {
        $('#canvas_bace').css({"display": "none"});
        target.src = set_val;
        $("#bg_video").fadeTo(2000, 1.0, function () {}); //duration;フェードするアニメーション時間  , opacity;変化させる不透明度を0～1の値  [,easing;アニメーションの変化の種類],callback
        isVideo = true;
    } else {                     /// if (set_val.match('pic')) 
        $('#bg_video').css({"display": "none"});
        $('#canvas_bace').css({"display": "block"});
        wallDraw(set_val); //キャンバスに静止画読み込み
        isVideo = false;
    }
    b_bgv = set_val;
    //    myLog(dbMsg);
}                                                                        //背景変更

function settingHanei() {
    var dbMsg = "[settingHanei]設定反映";
    var s_anime = document.menuForm.animeMenu.value;
    dbMsg = dbMsg + ",b_anime=" + b_anime + ">>" + s_anime
    var a_bgv = document.menuForm.bgMenu.value;
    dbMsg = dbMsg + ",b_bgv=" + b_bgv + ">>" + a_bgv;
    //     myLog(dbMsg);
}

function pouseAnime() {
    var dbMsg = "[pouseAnime]now_setting=" + now_setting;
    dbMsg = dbMsg + ",isVideo=" + isVideo;
    var bgvideo = document.getElementById("bg_video");
    //      myLog(bgvideo);
    var video_souce = document.getElementById("video_souce").src;
    dbMsg = dbMsg + ",video_souce.src=" + video_souce;
    if (now_setting) {
        if (video_souce != "") {
            bgvideo.pause();
        }
        now_setting = false
    } else {
        if (video_souce != "") {
            bgvideo.play();
        }
        now_setting = true
    }
    //     myLog(dbMsg);
}
/////http://jsdo.it/riku5160/yMcw
var fadeTimer; // alphaBar;
// キャンバスに背景を書き出すためのユーティリティ関数
function showImage() {
    var tag = "[showImage]";
    var dbMsg = tag;
    ctx.clearRect(0, 0, my_canvas.width, my_canvas.height);
    dbMsg = dbMsg + "[" + resize_w + "×" + resize_h + "]";
    myLog(dbMsg);
    ctx.drawImage(img_obj, shit_x, shit_ｙ, resize_w, resize_h); //書き込み
}

function startFadeIn() {
    var tag = "[startFadeIn]";
    var dbMsg = tag;
    stopAnimation();
    dbMsg = dbMsg + "globalAlpha=" + ctx.globalAlpha;
    fadeTimer = setInterval(function () {
        if (0.98 < ctx.globalAlpha) {                   //0.05秒×100
            ctx.globalAlpha = 1.0;
            stopAnimation();
        } else {
            ctx.globalAlpha += 0.01;
            showImage();
        }
    }, 50); // 50ミリ秒ごとにキャンバスを再描画
    //    myLog(dbMsg);
}                                           // フェードインボタンを押された際の処理

function fadeOut() {
    var tag = "[fadeOut]";
    var dbMsg = tag;
    if (isVideo == false) {
        stopAnimation();
        // 200ミリ秒ごとにキャンバスを再描画
        fadeTimer = setInterval(function () {
            if (ctx.globalAlpha < 0.02) {
                ctx.globalAlpha = 0;
                stopAnimation();
                window.location.reload(); //再読み込み
            } else {
                ctx.globalAlpha -= 0.01;
            }
            showImage();
            //        alphaBar.value = ctx.globalAlpha;
        }, 50);
    }
    //   myLog(dbMsg);
}                                               // オリジナル壁紙をFOしてリロード

function stopAnimation() {
    var tag = "[stopAnimation]";
    var dbMsg = tag;
    if (fadeTimer) {
        clearInterval(fadeTimer);
        fadeTimer = null;
    }
    //      myLog(dbMsg);
}                                         // アニメーションを停止するためのユーティリティ関数
