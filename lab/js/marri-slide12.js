(function ($) {
    var debug_now = true;   //20170427;コミット時は false に  製作中は true
    var b_time;
    var b_bgv;
    var isStart = false;                 //既にloopは開始されている;slideStart()でtrueに
    var isReload = false;
    var winW, winH;
    var vanishingPoint; //消失点= Z = winW(写真を止めてみせるのはz=0)
    var vpPer; //原点から消失点までの角度     Math.atan(orgW / winW)
    var slideBgUrl;
    var ceremonies_slide_bg; //☆*1で演算して数値化
    var resize_now = false; //リドロウ以降に画面サイズが変わった
    var loadStart = 0;
    var loadTime = 0;
    var loadComp = false;
    //写真
    var stayScale = 0.7; //停止して表示させる時の表示枠中の比率☆長手方向と表示画面縦横いづれかの比率
    ////ここまでindexだった///////////////////////////////////////////////////////////
    var isReload = false;
    var settings;
    var count = 0;
    var maxId = 0;
    var newId = -1; //追加された写真のID

    var nowMaxId = -1;
    var isQueueing = false;                      //データ読み取り中
    var queueingCount = 0;                      //データが有るのにデーターが取得できなかった回数；正常に読み込みを開始したらリセット
    var queueingLimit = 50;                    //強制的にリロードを実施する限度値(3000ms*10回で30秒)
    //写真
    var nextImages = [];                                //ストック再生中の写真データ配列
    var isStock = false; //蓄積画像のアニメーション実行;slideAnimationの開始でtrue/終了でfalse
    var isStockEnd = true; //蓄積画像のアニメーションがFoまで完了している
    var remainCount = 0;           //表示待ち残数
    var totalClount = 0;            //Stock全数
    var newImg_ctx; //☆onloadから戻り値に渡す
    var setCount = 2; //何枚づつ表示させるか； dataQueueing , dataBind
    var stackCount = 4;
    var stayTime = 2000; //停止して表示させる時間[mS]
    var anime_time = 7000; //ストックアニメーション;フェードイン～停止;cssアニメーションに設定されていた秒数     7000>>5/8>5000
    var queuing_time = anime_time; //アニメーション送り
    var bind_time = anime_time + 1000; //データ読み込み
    var PhotAFRate = 30; //写真アニメーションのフレームレート               
    var scale_xy;
    var resize_w, resize_h; //チャンバス内の描画領域
    var select_ippenn, select_x, select_y;
    var reloadCount = 0;             //新着が届かなかったカウント
    var reloadLimit = 500;             //reloadCountがこの値に達した時、Stockが無ければリロード。Stockが有ればリロード前にStockアニメのn周分、info_bordを表示してからリロード
    var noArrivalLoopCount = 0;             //新着が届かなかったStockLoopのカウント
    var noArrivalLoopLimit = 10;             //reloadCountがこの値に達した時、Stockが無ければリロード。Stockが有ればリロード前にStockアニメのn周分、info_bordを表示してからリロード
    var stockID;                        //生成されたimgタグのID
    var leftCell;                       //2313;左のStock
    var rightCell;                       //2313;右のStock
    var cAdder = 0;                       //2313;タイル配列を行わない場合のダミーカウンタ;消込をユニーク名にする
    //スレッド管理///////////////////////////////////////////////////////////////////////////////////
    var timerArray = new Array();
    var pniArray = new Array();         //新着確認
    var dQArray = new Array();               //id-url引き当て処理
    var saArray = new Array();             //slideAnimation
    var reloadTArray = new Array();             //リロード処理の累積
    var newArrivalsArray = new Array();         //新着開始
    var caB2fArray = new Array();               //新着終了
    var effectTArray = new Array();             //effect

    var timerArray = new Array();       //2313/
    var leftZi2StayArray = new Array();       //2313/
    var rightZi2StayArray = new Array();    //2313/
    var leftZo2FoArray = new Array();    //2313/
    var rightZo2FoArray = new Array();    //2313/

    function stopNIAnimation(delArrey) {
        var tag = "[stopNIAnimation]";
        var dbMsg = tag + ",timerArray=" + delArrey.length + "スレッド稼働中";
        if (delArrey != null) {
            while (0 < delArrey.length) {                                       // if (0 < delArrey.length) { で先頭を一つだけ
                clearInterval(delArrey.shift());
            }
        }
        var dbMsg = dbMsg + ">稼働中>" + delArrey.length + "スレッド";
        // myLog(dbMsg);
    }
    //////////////////////////////////////////////////////////////////////////////////スレッド管理///
    /***
     * 順送り;initMe>bgWall>effectInit>mainLoopStart
     */
    $.fn.slideStart = function (options) {
        // function slideStart() {
        var dbMsg = "[slideStart]";
        settings = $.extend({
            'ceremonyId': '',
            'token': '',
            'ceremonies_slide_bg': '',
            'slideBgUrl': '',
            'span': {
                'animation': 10000
            }
        }, options);
        ceremonyId = settings.ceremonyId;
        token = settings.token;
        ceremonies_slide_bg = settings.ceremonies_slide_bg;
        if (ceremonies_slide_bg == 2) {
            ceremonies_slide_bg = "#f80087";
        }
        dbMsg = dbMsg + ",ceremonies_slide_bg=" + ceremonies_slide_bg;
        if (ceremonies_slide_bg) {
        } else {
            ceremonies_slide_bg = "#f80087";
        }
        slideBgUrl = settings.slideBgUrl;
        dbMsg = dbMsg + ",ceremonyId=" + ceremonyId + ",token=" + token;
        // dbMsg = dbMsg + ",slideBgUrl=" + slideBgUrl;
        b_bgv = '/files/background.mp4';
        if (slideBgUrl) {
            b_bgv = slideBgUrl;
            isVideo = false;
        } else {
            b_bgv = "";
            isVideo = false;
        }
        naPattern = -1;
        arrivalsArray = new Array();
        arrivalsIDArray = new Array();
        if (debug_now == true) {
            $("#count_moniter").css({ 'display': 'inline' });
        } else {
            $("#count_moniter").css({ 'display': 'none' });
        }
        naPattern = -1;
        var date = new Date();
        b_time = date.getTime();
        initMe();
        if ($.cookie('slideshow.reload_msg')) {
            dbMsg = dbMsg + ",前回の終了状況＝" + $.cookie("slideshow.reload_msg");
            $.removeCookie('slideshow.reload_msg');
        }
        if ($.cookie('slideshow.err_msg')) {
            dbMsg = dbMsg + "\nこのPCで発生したエラー＝" + $.cookie("slideshow.err_msg");
        }
        parentOj = document.getElementById("newimg_div"); //新着Canvasの親ノード
        myLog(dbMsg);
    };

    function initMe() {
        var dbMsg = "[initMe]";
        winW = $(window).width();
        winH = $(window).height();
        dbMsg = dbMsg + "[" + winW + "×" + winH + "]";

        vanishingPoint = winW;
        dbMsg = dbMsg + "（" + vanishingPoint + "×" + stayScale + ")/" + vanishingPoint;
        vpPer = Math.atan((vanishingPoint * stayScale) / vanishingPoint); //原点から消失点までの角度     Math.atan(orgW / winW)
        dbMsg = dbMsg + "=" + vpPer;

        photX = winW / 2 - winW / 10; //エフェクトに渡す逐次の座標情報
        photY = winH / 2 - winH / 10;
        photW = winW / 10;
        photH = winH / 10;
        resize_now = false;
        bgWall(winW, winH);                //背景設定後mainLoopStartへ
        // myLog(dbMsg);
    }
    /////marri-slide.jsから抜粋したアニメーション実行部分/////////////////////////////////////////////////////

    /**
     * $(document).ready終端から呼ばれる
     * 呼び出し元；bgWallで背景とeffectInitでエフェクトアニメの初期設定が終わった処で開始
     * */
    function mainLoopStart() {       //marri-slide.jsの$.fn.slideshow相当
        var dbMsg = "[mainLoopStart()]> slide loaded";
        clearLocalStorage();
        //org;    var promise = initialize(); //albumIdとphotosの配列をidsに取得し、localStorageに保存
        //              promise.done(function () {
        //                  pFunction();
        //             });  
    }

    /*
     * localStorageの各項目をremoveItem
     * 呼び出し元は　initialize
     */
    function clearLocalStorage() {
        var dbMsg = "[slidenew・clearLocalStorage]";
        try {
            localStorage.removeItem('all-keys');        // 現時点でのイメージリスト(id)             ☆リロード時でクリアしないとIEは安定しない？
            localStorage.removeItem('update-keys');      // 新着イメージリスト(id)
            localStorage.removeItem('queue'); // キューに入っているイメージ情報(id, url, ...)
            localStorage.removeItem('displayed'); // 表示されているイメージ情報(id, url, ...)
            localStorage.removeItem('resent-update');
            dbMsg = dbMsg + '>>> local storage cleared';
            //  myLog(dbMsg);
            initialize();
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；';
            myReload(dbMsg);
        }
    }                      //localStorageの各項目をremoveItem

    /**
     * albumIdとphotosの配列をidsに取得し、localStorageに保存
     * 呼び出し元はmainLoopStart()()
     * */
    var initialize = function () {
        var dbMsg = "[initialize]";
        dbMsg = dbMsg + '>> initialize begin;token=' + token;
        try {
            //    var defer = $.Deferred(); //非同期処理をうまく扱うための標準モジュール
            // clearLocalStorage()；
            $.ajaxSetup({ cache: false }); // cache off
            $.ajax({
                url: "/" + ceremonyId + "/slidenew/init/token:" + token + "/",
                dataType: "json"
            }).done(function (data) {                                               //tokenで渡されたceremonyidのalbumIdとphotosの配列をidsに入れてjson_encodeで返す
                dbMsg = dbMsg + '既に届いている全データ読み込み成功initialize success.response data';
                setLocalStorage(data); //key名"all-keys"で渡されたデータをlocalStorageに保存,最終のphot_IDをmaxidに登録
            }).fail(function (data) {
                dbMsg = dbMsg + '全データ読み込み失敗initialize failed.';
                //                            dbMsg = dbMsg + ">fail>" + data.responseText;
                if ($.cookie('slideshow.max-id') != null) {             //前回利用時に
                    if (0 < $.cookie('slideshow.max-id')) {               //データが有るのにfallss
                        dbMsg = dbMsg + ",前回最終=" + $.cookie('slideshow.max-id');
                        myLog(dbMsg);
                        // myReload(dbMsg);
                    }
                }
            }).always(function () {
                //        defer.resolve();
            });                                                                     //初回の全photID取得
            dbMsg = dbMsg + '>> initialize ended.';
            // myLog(dbMsg);
            //    return defer.promise(); // ogrプロミスを作って返す
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；';
            myReload(dbMsg);
        }
    };           //初回の全photID取得

    /* initializeで取得できたデータ(開始時のStock)をlocalStorage.に登録
     * @param data phot_IDの配列
     * key名"all-keys"で渡されたデータをlocalStorageに保存
     * 最終のphot_IDをmaxidに登録
     */
    function setLocalStorage(data) {
        var dbMsg = "[slidenew・setLocalStorage]";
        try {
            var cookieiD = -1;
            if ($.cookie('slideshow.max-id') != null) {                 //☆読み損ねるとnullのまま更新されなくなるので作り直し
                cookieiD = $.cookie('slideshow.max-id');                //20170315dell
                $("#max_id").text(cookieiD);
            }
            dbMsg = dbMsg + '、開始時点でcookieに記載されているID=' + cookieiD + '、type=' + typeof (cookieiD);         //有ればslideshow.max-id=33377;CakeCookie[auths]=Q2Fr....
            if ($.cookie('slideshow.no_arrival_loop_count') != null) {                 //☆読み損ねるとnullのまま更新されなくなるので作り直し
                noArrivalLoopCount = $.cookie('slideshow.no_arrival_loop_count');                //20170315dell
            }

            var upDateStr = "";
            var toDateStr = "";
            if ($.cookie('slideshow.update') != null) {                 //☆読み損ねるとnullのまま更新されなくなるので作り直し
                var upDate = $.cookie('slideshow.update');
                var date = new Date(upDate);
                upDateStr = date.toDateString();        //1490663904.	toDateString();                 //getFullYear();
                date = new Date();
                toDateStr = date.toDateString();
                $("#arrival_id").text("前回起動=" + upDateStr + ",今日は" + toDateStr);
            }
            images = data.ids;
            totalClount = 0;
            if (images != null) {
                if (0 < images.length) {
                    images.sort();
                    nowMaxId = images[images.length - 1];                   //org;maxId
                    dbMsg = dbMsg + '、images=' + images.toLocaleString() + ";" + images.length + "件,最終=" + nowMaxId;         //有ればslideshow.max-id=33377;CakeCookie[auths]=Q2Fr....
                    localStorage.setItem("all-keys", JSON.stringify(data.ids)); //同じオリジン(http://～ポート番号)の間で共有されるストレージに保存
                    if (cookieiD == null) {
                        cookieiD = nowMaxId;
                    } else if (cookieiD < nowMaxId) {
                        cookieiD = nowMaxId;
                    }
                    var b_totalClount = totalClount;
                    totalClount = images.length;
                    if (debug_now) {
                        noArrivalLoopLimit = 0;
                    } else if (totalClount < 11) {
                        noArrivalLoopLimit = 4;
                    } else if (totalClount < 21) {
                        noArrivalLoopLimit = 2;
                    } else if (totalClount < 41) {
                        noArrivalLoopLimit = 1;
                    } else if (totalClount < 81) {
                        noArrivalLoopLimit = 0;                             //reLoadJanctionから最終メッセージの呼び出し
                    }
                } else {
                    cookieiD = -1;
                    localStorage.setItem("all-keys", null);
                    totalClount = 0;
                }
            } else {                          //cookieが無い　もしくは　Stockが無ければ       if (cookieiD == -1 || 0 < images.length)
                cookieiD = -1;
                localStorage.setItem("all-keys", null);
                totalClount = 0;
            }

            dbMsg = dbMsg + ',読み込んだデータの最終=' + cookieiD;         //有ればslideshow.max-id=33377;CakeCookie[auths]=Q2Fr....
            $.removeCookie('slideshow.max-id');                 //org;強制的にmax-idを削除 ☆書き換わらないので必要
            $.cookie('slideshow.max-id', cookieiD);                        //-1のまま
            dbMsg = dbMsg + '、totalClount=' + b_totalClount + ">>" + totalClount + "件";

            if (totalClount == 0) {      // その日の初回動作;upDateStr != toDateStr      || upDateStr != null
                nowMaxId = -1;
                //                $.removeCookie('slideshow.max-id');
                $("#info_bord").css({ 'display': 'inline' });                     //投稿待ちインフォメーション
                fiElementById(document.getElementById("info_bord_bace"));
                isReload = true;
            } else {
                nowMaxId = cookieiD;
                $("#info_bord").css({ 'display': 'none' });
            }
            dbMsg = dbMsg + '、渡されたIdの最終=' + cookieiD;
            if ($.cookie('slideshow.update-keys')) {
                dbMsg = dbMsg + '前回残りの新着=' + JSON.parse($.cookie('slideshow.update-keys'));    //文字列に一旦変換する
                localStorage.setItem("update-keys", $.cookie('slideshow.update-keys'));
                dbMsg = dbMsg + 'update-keysへ' + JSON.parse(localStorage.getItem("update-keys"));
            } else {
                localStorage.setItem("update-keys", null);            //nullでは"[]"
                dbMsg = dbMsg + '前回残りの新着無し';    //文字列に一旦変換する
            }
            localStorage.setItem("maxid", cookieiD);
            localStorage.setItem("queue", null);
            localStorage.setItem("displayed", null);
            localStorage.setItem("resent-update", new Date());                      //読み込み時刻を現在に
            dbMsg = dbMsg + '>>> local storage initialized';
            $("#total_count").text(totalClount);
            myLog(dbMsg);
            pushNewImages();                                                    //新着確認開始
            pFunction();
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；' + e;
            myReload(dbMsg);
        }
    }                                 //key名"all-keys"で渡されたデータをlocalStorageに保存  と Stick0件時のメッセージ表示

    /**
     * slideshow/updateでlastで渡す最終のphot_idから遡って20件をupdate配列に取得し、localStorageにupdate-keysで保存。resent-updateを更新
     * slidenewController.phpのupdateで $photos = $this->Photo->getNewPhotoList($albumId, $lastId, 20);　と指定
     * dataQueueingから呼ばれる
     * */
    function pushNewImages() {
        var tag = "[pushNewImages]";
        var dbMsg = tag;
        try {
            var newImages = [];                                                 //新着配列
            if (localStorage.getItem("update-keys") != "null") {                //localStorageに読み込んでいる新着IDが有れば
                newImages = JSON.parse(localStorage.getItem("update-keys"));    //新着配列に転記
                dbMsg = dbMsg + ",処理中の新着=" + newImages;
            } else if (0 < totalClount && isReload) {
                dbMsg = dbMsg + ">>>リロード中 ";
                return;
            } else if (isArrival) {
                dbMsg = dbMsg + ">>>新着再生中 ";
            } else if (newImageReading) {
                dbMsg = dbMsg + ">>>新着確認中";
            } else {
                newImageReading = true;
                $.ajaxSetup({ cache: false });
                var maxId = localStorage.getItem("maxid");                          //これ以上のＩＤを新着とする閾値
                dbMsg = dbMsg + ",抽出上限;現在のmaxId=" + maxId;
                dbMsg = dbMsg + ",cookie=" + $.cookie('slideshow.max-id');
                dbMsg = dbMsg + "、通過している新着ID＝" + newId;
                if (maxId < newId) {
                    maxId = newId;
                }
                dbMsg = dbMsg + ">>" + maxId;
                var urlStr = "/" + ceremonyId + "/slidenew/update/token:" + token + "/";
                // dbMsg = dbMsg + ",urlStr=" + urlStr;
                $.ajax({
                    type: "POST",
                    url: urlStr,
                    data: { "last": maxId },
                    dataType: "json"
                }).done(function (data) {
                    // console.log(data);
                    if (data.update) {
                        if (totalClount == 0) {
                            farstArrival = true; //一通目
                        } else {
                            farstArrival = false; //一通目
                        }
                        dbMsg = dbMsg + ",一通目か=" + farstArrival;
                        dbMsg = dbMsg + ",ajaxの結果= " + data.update.length + "件=" + data.update[0] + "～" + data.update[data.update.length - 1];
                        var newImages = [];                                                 //新着配列
                        // if (localStorage.getItem("update-keys") != "null") {                //localStorageに読み込んでいる新着IDが有れば
                        //     var lsStr = JSON.parse(localStorage.getItem("update-keys"));
                        //     dbMsg = dbMsg + ",既存localStorage=" + lsStr;                //undefined?
                        //     newImages = JSON.parse(localStorage.getItem("update-keys")); //.splice(',');    //新着配列に転記   localStorage.getItem("update-keys")
                        // }
                        // if (newImages == null) {
                        //     newImages = [];
                        // }
                        // dbMsg = dbMsg + ",newImages=" + newImages.lenght + "件";                //undefined?

                        // var nArrival = data.update;
                        // if (0 < newImages.length) {
                        //     for (i = 0; i < newImages.length; i++) {
                        //         var chID = newImages[i];
                        //         dbMsg + "(" + i + ")" + chID;
                        //         var naIndex = nArrival.indexOf(chID);
                        //         dbMsg = dbMsg + "," + naIndex + "件目に有り";
                        //         if (naIndex < 0) {          //== -1では効かず
                        //             newImages.push(nArrival[naIndex]);
                        //             dbMsg = dbMsg + ">追加>" + newImages.lenght + "件" + newImages;
                        //         }
                        //     }
                        // } else {
                        dbMsg = dbMsg + ",ajaxの結果をそのまま転記"
                        newImages = data.update;
                        // }
                        if (newImages != null) {
                            dbMsg = dbMsg + ">>読み込み後の新着ID= " + newImages.length + "件=" + newImages[0] + "～" + newImages[newImages.length - 1];
                            localStorage.setItem("update-keys", JSON.stringify(newImages));
                            localStorage.setItem("resent-update", new Date());
                            dbMsg = dbMsg + ">update-keys>" + JSON.parse(localStorage.getItem("update-keys"));   //newImages.toLocaleString();
                            // newId = newImages[newImages.length - 1];                //読み込み終えた新着ID
                            // dbMsg = dbMsg + ",最終=" + newId;
                            // nowMaxId = newId;
                            // localStorage.setItem("maxid", newId);           //次の回周に反映されない？
                            // $.cookie('slideshow.max-id', newId);

                            dbMsg = dbMsg + ">>dataQueueing()へ";
                            nowMaxId = newId;
                            // console.log(localStorage);
                            $("#info_bord").css({ 'display': 'none' });                     //投稿待ちインフォメーション
                            isReload = false;
                            totalClount++;
                            reloadCount = 0;             //新着が届かなかったカウント
                            queueingCount = 0;
                        }

                        dataQueueing();                                                     //無いと止まる？
                    } else {
                        reloadCount++;
                        dbMsg = dbMsg + ">>新着無し" + reloadCount + "/" + reloadLimit + "回目";
                        if (totalClount == 0 && reloadLimit < reloadCount) {          //新着が届かなかったカウント
                            myLog(dbMsg);
                            reLoadJanction(dbMsg);
                        }
                    }
                }).fail(function (data) {
                    //                myLog(data.responseText);
                }).always(function () {
                    //                dataQueueing();                                                     //無いと止まる？
                });
                newImageReading = false;    //新着確認中
                // myLog(dbMsg);
                if (totalClount == 0 && reloadLimit < reloadCount) {          //新着が届かなかったカウント
                    isReload = false;
                    myLog(dbMsg);
                    reLoadJanction(dbMsg);
                } else {
                }
            }
            stopNIAnimation(pniArray);         //新着確認
            pniArray.push(setInterval(function () {//    setTimeout(function () {
                pushNewImages();
            }, 500));          // queuing_time * 2 >>20170415>>500に戻す
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；' + e;
            myReload(dbMsg);
        }
    }                                       //slidenew/updateでlastで渡す最終のphot_idから遡って20件をupdate配列に取得し、localStorageにupdate-keysで保存。resent-updateを更新

    /**
     * 渡された新着配列からの消込
     * 2313;照合削除に変更
     * @param {*} images 
     * @param {*} tID   照合するID  
     * canvas.onLoadで書き込みが成功したidを消込
     */
    function popNewImages2(images, tID) {
        var tag = "[popNewImages2]";
        var dbMsg = tag + ">新着>" + images.length + "件,url= " + images.toLocaleString() + "から" + tID + "の消込";
        var imageId = null;
        var delIndex = images.indexOf(tID);
        if (-1 < delIndex) {
            images.splice(delIndex, 1);
            localStorage.setItem("update-keys", JSON.stringify(images));
            dbMsg = dbMsg + ">localStorage>" + localStorage.getItem("update-keys");
            localStorage.setItem("maxid", imageId);
        }
        dbMsg = dbMsg + ">>" + images.length + "件,url= " + images.toLocaleString();
        myLog(dbMsg);
    }
    /**
     * 渡された新着配列からの消込
    
     * @param {*} images 
     */
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
    /**
     * 2312;新着用のID配列を作成し、ストックの末尾に追記しておく
     * */
    function readNewImages(images) {
        var tag = "[slidenew・readNewImages]";     //既存max＝" + nowMaxId;
        var maxId = nowMaxId;
        var dbMsg = tag + ",現在のmaxId=" + maxId;
        try {
            var wrArray = [];
            if (images != null) {
                dbMsg = dbMsg + ",images=" + images.length + "件/";     //既存max＝" + nowMaxId;
                if (0 < images.length) {
                    images.sort();
                    for (i = 0; i < images.length; i++) {
                        dbMsg = dbMsg + "(" + i + ")" + imageId;
                        var imageId = images[i];
                        dbMsg = dbMsg + ",localStorageに" + localStorage.getItem(imageId);
                        if (maxId < imageId) {
                            if (localStorage.getItem(imageId) == null) {                        //localStorageに登録されておらず
                                if (wrArray.indexOf(imageId) == -1) {                        //書き込み先にも該当するものが無ければ
                                    wrArray.push(imageId); //新着画像のID配列の末尾に要素を追加
                                    nowMaxId = imageId;
                                }
                            }
                        }
                    }
                    dbMsg = dbMsg + "；" + wrArray.length + "件,最終＝" + nowMaxId;
                }
            }
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；' + e;
            myReload(dbMsg);
        }
        myLog(dbMsg);
        return wrArray;
    }

    /**
     * オリジナルで promise.done(function () {の中にあった実行開始部分
     * */
    function pFunction() {
        dataQueueing(); //ID配列からURLを読み取り待ち行列を作成。行列がなくなるまでデータURLを送出。
        //        setTimeout(function () {          //orgは3秒ごとにurl取得後のアニメーション処理
        dbMsg = dbMsg + "[pFunction.setTimeout]";
        //            dbMsg = dbMsg + "=" + arrivalsArray.length + "件,localStorage=" + localStorage.length + "件";
        // myLog(dbMsg);
        dataBind()
        //        }, 3000);                       //org;3000
        isStart = true;
    }

    /**
     * return時の戻り先
     * */
    function dataQueueingStart() {
        dataQueueing();
    }

    /**
     * StockのID配列　もしくは　新着のID配列がなくなるまでURLを取得し、dataBindに送出
     * 呼び出し元
     * ①mainLoopStart()でpromise.done
     * ②pushNewImagesで新着が確認できた時
     * ③Stock時はreWritIsStock、新着時はnewImageWriteEndから戻る
     * org；0.5秒ごとのsetTimeout　、 initializeが正常終了後、$.fn.slidenewから呼ばれる
     * */
    function dataQueueing() {
        var dbMsg = "[dataQueueing]";
        //        dbMsg = dbMsg + ",queuing_time=" + queuing_time + "ms";
        try {
            dbMsg = dbMsg + ":" + tStamp();
            dbMsg = dbMsg + ",リトライ=" + queueingCount + "/" + queueingLimit;
            if (queueingLimit < queueingCount) {
                dbMsg + ">一定時間待ち>リロード";
                myLog(dbMsg);
                isQueueing = false;
                farstArrival = false;
                reLoadJanction(dbMsg);
                return;
            }
            var stockEnd = -1;
            var images = JSON.parse(localStorage.getItem("all-keys"));      //全データ
            if (isReload) {
                dbMsg = dbMsg + ">>>リロード中 ";
                return;
            } else if (isQueueing) {
                dbMsg = dbMsg + ">>データ読み取り中";
            } else if (isStock) {
                dbMsg = dbMsg + ">>>ストック再生中 ";
            } else if (isArrival) {
                dbMsg = dbMsg + ">>>新着再生中 ";
            } else if (totalClount == 0 && !farstArrival) {
                dbMsg = dbMsg + ">>>ストック無しで新着でもない"
            } else if (images == null && 0 < localStorage.getItem("maxid")) {           //localStorage.getItem("all-keys") == "null"
                dbMsg = dbMsg + ">>>再生終了 ";
                myLog(dbMsg);
                reLoadJanction(dbMsg);
            } else {
                var queue = [];
                localStorage.setItem("queue.status", "running");
                var newMax = 0;
                var nowMax = localStorage.getItem("maxid");
                // if (images == null && 0 < localStorage.getItem("maxid")) {           //localStorage.getItem("all-keys") == "null"
                //     dbMsg = dbMsg + ">>>再生終了 ";
                //     myLog(dbMsg);
                //     reLoadJanction(dbMsg);
                // }
                isQueueing = true; //データ読み取り中

                ////////////////前段////////5/8移動////////////////////////////////////////
                var newImages = [];                                             //新着配列
                if (localStorage.getItem("update-keys") != "null" &&
                    localStorage.getItem("update-keys") != null &&
                    localStorage.getItem("update-keys") != "[]") {            //5/8;Uncaught SyntaxError: Unexpected token u in JSON at position 0対策
                    bMsg = dbMsg + ",update-keys=" + localStorage.getItem("update-keys");
                    //  console.log(localStorage);
                    newImages = JSON.parse(localStorage.getItem("update-keys"));
                    bMsg = dbMsg + ",新着=" + newImages + "," + newImages.length + "件";
                    newImages.sort();                                       //0317;追越防止
                    newId = newImages[newImages.length - 1];                //読み込み終えた新着ID
                    dbMsg = dbMsg + ",最終=" + newId;
                    nowMaxId = newId;
                    localStorage.setItem("maxid", newId);           //pushNewImagesで反映されない？
                    $.cookie('slideshow.max-id', newId);
                }
                if (newImages == null) {
                    newImages = [];
                } else if (0 < newImages.length) {                                                            //if (0 < newImages.length) 
                    newMax = newImages[newImages.length - 1];                       //undefined
                    $("#arrival_id").text(newMax + "まで");
                    dbMsg = dbMsg + ",新着=" + newImages.length + "件,新着.maxid=" + newMax;
                }
                dbMsg = dbMsg + ",通過=" + newId + ",現在のlocalStoragemaxid=" + nowMax + ",一通目=" + farstArrival;
                var photos = [];            //urlを取得するID
                if (0 < newImages.length) {                       //最近追加が有れば         && newId < newMax && nowMax < newMax) || farstArrival
                    dbMsg = dbMsg + ",新着処理";
                    newId = newMax;
                    dbMsg = dbMsg + ">>" + newImages.toLocaleString();
                    dbMsg = dbMsg + "現在の最終=" + nowMaxId + ">新着>" + newImages[newImages.length - 1] + ";" + newImages.length + "件";
                    nowMaxId = newImages[newImages.length - 1];
                    arrivalsIDArray = arrivalsIDArray.concat(newImages);    //$.extend(true, [], newImages); //配列の要素コピー
                    dbMsg = dbMsg + ",arrivalsIDArray=" + arrivalsIDArray.toLocaleString() + ";" + arrivalsIDArray.length + "件";
                    photos = photos.concat(newImages);    //$.extend(true, [], newImages); //配列の要素コピー
                    dbMsg = dbMsg + ">photos=" + photos.toLocaleString() + ";" + photos.length + "件";
                } else {                                                            //ストックは        if(0 < images.length)
                    dbMsg = dbMsg + ",ストック処理";  //+ images.toLocaleString() + "で" + images.length + "件";
                    ////5/8移動//////前段////////////////////////////////////////////////
                    if (images != null) {
                        if (0 < images.length) {
                            images.sort();                                       //0317;追越防止
                        }
                        dbMsg = dbMsg + ">>残り" + images.length + "件";
                        stockEnd = images[images.length - 1];                         //newMax?
                        dbMsg = dbMsg + "、stock最終=" + stockEnd;
                        if (nowMax < stockEnd) {
                            nowMax = stockEnd;
                            localStorage.setItem("maxid", nowMax);
                        }
                        $("#max_id").text(nowMax);
                        $("#now_play_count").text(images.length);
                    }
                    $("#arrival_id").text("無し");
                    ////////////////前段////////////////////////////////////////////////
                    queueingCount = 0; //データが有るのにデーターが取得できなかった回数；正常に読み込みを開始したらリセット
                    if (localStorage.getItem("queue") != "null") {
                        queue = JSON.parse(localStorage.getItem("queue"));
                    }
                    if (queue == null) {
                        queue = [];
                    }
                    dbMsg = dbMsg + ",queue=" + queue.length + "/stack=" + stackCount;
                    if (queue.length >= stackCount) {
                        dbMsg = dbMsg + "queueing process skipped.url読み込みの上限値を超えている"
                        localStorage.setItem("queue.status", "stopped");
                        setTimeout(function () {
                            dataQueueing();             //　ogr;0.5秒ごとに再帰
                        }, 500);
                        return;   //orgはreturnだった
                    } else {
                        for (i = 0; i < setCount; i++) {                              //setCount=2件ごとに    Oorg; while (photos.length < setCount)
                            dbMsg = dbMsg + "(" + i + ")" + images[i];                  //課題；一枚しか無い時はここでundefined>>IEの空フレーム対策に
                            photos.push(images[i]); //ID格納        ORG;popBaseImages(images)
                        }
                    }
                }
                photos.sort();                                       //0317;追越防止
                dbMsg = dbMsg + ",photos=" + photos.toLocaleString() + "で" + photos.length + "件";
                photos = $.grep(photos, function (e) {                                  //再生待ちの配列からnullになっている要素を除去？
                    return e !== null;
                });
                localStorage.setItem("photos", JSON.stringify(photos)); //localStorageにkey名photosで最近追加を加えたphot_idの配列を登録
                // dbMsg = dbMsg + "[QUEUE] append new item."; //データが無い時はここまで
                dbMsg = dbMsg + ">ajax:" + tStamp();

                $.ajax({
                    type: "POST",
                    url: "/" + ceremonyId + "/slidenew/get/token:" + token + "/",
                    data: JSON.stringify(photos),
                    contentType: 'application/json',
                    dataType: "json"
                }).done(function (data) {  //phot_id配列で渡したSlideサイズ写真のurlをsetCountで指定した件数分、data配列に入れてjson_encodeで返す
                    if (data) {                                                     //スライド上映中に削除されると空配列が返される
                        reloadCount = 0;             //urlが届かなかったカウント
                        // dbMsg = dbMsg + ">新着" + arrivalsIDArray.length + "件,読込前queue=" + queue.length + "件";
                        var nextIds = data[0].photoid;
                        dbMsg = dbMsg + ">取得できたindexは(nextIds)" + nextIds;
                        // dbMsg = dbMsg + "stockE=" + stockEnd;
                        if (stockEnd < nextIds) {                 ///新着*******************//蓄積画像のアニメーション実行中でなければ        0 < arrivalsIDArray.length
                            isArrival = true;
                            dbMsg = dbMsg + "新着内容=" + arrivalsIDArray.toLocaleString();
                            var uKeys = [].concat(photos);
                            $.each(data, function (i, photo) {
                                dbMsg = dbMsg + "\n(" + i + ")";
                                nextIds = nextIds + photo.photoid + " , ";
                                dbMsg = dbMsg + ",photoid=" + photo.photoid + "をarrivalsIDArrayの " + arrivalsIDArray.indexOf(photo.photoid) + "番目に追加";
                                arrivalsArray.push(photo.image); //新着画像のURL配列の末尾に要素を追加
                                var delIndex = uKeys.indexOf(photo.photoid);
                                dbMsg = dbMsg + ",update-keys=" + uKeys + "の" + delIndex + "番目から";
                                uKeys.splice(delIndex, 1);
                                dbMsg = dbMsg + ">削除>" + uKeys;
                            });
                            dbMsg = dbMsg + ",残り" + uKeys.length + "件";
                            dbMsg = dbMsg + ",新着url" + arrivalsArray.length + "件";
                            // if (uKeys.length == 0) {
                            //     localStorage.setItem("update-keys", null);
                            // } else {
                            //     localStorage.setItem("update-keys", JSON.stringify(uKeys));
                            // }
                            // console.log(localStorage);
                            dbMsg = dbMsg + ",新着url= " + arrivalsArray.length + "件,update-keys= " + localStorage.getItem("update-keys");
                            // myLog(dbMsg);
                        } else {                //  新着中など処理重複時の読み込み防止        if (queue.length < setCount)
                            isStock = true;
                            dbMsg = dbMsg + ">ストック処理開始";
                            queue = JSON.parse(localStorage.getItem("queue"));
                            if (queue == null) {
                                queue = [];
                            }
                            $.each(data, function (i, photo) {                                  //これから表示する2件を一件づつ読みだす
                                dbMsg = dbMsg + "[" + i + "]photoid=" + photo.photoid; //+ "//newId=" + newId;
                                // $.preloadImages(photo.image); //imgタグにarguments配列で渡されたurlをセット
                                queue.push(photo); //再生し終えたデータを削除し
                            });
                            //    console.log(queue);
                            dbMsg = dbMsg + ",queue=" + queue.length + "件";// + queue[0].image;
                            leftCell = [];                       //2313;左のStock
                            rightCell = [];                          //2313;右のStock
                            cAdder++;
                            var cData = new Array(cAdder, 1, 0, 0, 72, 72, queue[0].image);                //rowPosition, colPosition, wrX, wrY, wrW, wrH,url
                            leftCell.push(cData);
                            if (queue[1]) {             //2件目；右側が有れば
                                // dbMsg = dbMsg + "と" + queue[1].image;
                                var rUrl = "";
                                if (queue[1].image) {
                                    rUrl = queue[1].image;
                                }
                                cData = new Array(cAdder, 3, winW / 2, winH, 72, 72, rUrl);                //rowPosition, colPosition, wrX, wrY, wrW, wrH
                                rightCell.push(cData);
                            } else {
                                rightCell = null;
                            }
                            localStorage.setItem("queue", JSON.stringify(queue)); //localStorageのqueue配列を更新
                            localStorage.setItem("queue.count", queue.length);
                            if ($.isEmptyObject(queue)) {
                                dbMsg = dbMsg + "、queue無し";
                                // stopNIAnimation(dQArray);         //id-url引き当て処理
                                dQArray.push(setInterval(function () {//    setTimeout(function () {
                                    dataQueueing();
                                }, 300));
                                return;
                            }
                        }
                        queueingCount = 0; //データが有るのにデーターが取得できなかった回数；正常に読み込みを開始したらリセット
                        dbMsg = dbMsg + "、dataBindへ";
                        // myLog(dbMsg);
                        dataBind();
                    } else {
                        dbMsg = dbMsg + "、再帰";
                        // myLog(dbMsg);
                        queueingCount++;                      //データが有るのにデーターが取得できなかった回数；正常に読み込みを開始したらリセット
                        setTimeout(function () {         //loop中に全消去などURLが取得できない場合
                            dataQueueing();
                        }, 3000);
                    }
                }).fail(function (data) {                                           //新着(特に一通目は)すべてのファイルが作成されるまでに時間が掛かりfailが発生する
                    dbMsg = dbMsg + ">fail>";   // + data.responseText;
                    queueingCount++;
                    queueingLimit = 60;
                    myLog(dbMsg);
                    setTimeout(function () {
                        dataQueueing();
                    }, 1000);
                }).always(function () {                                                 //常に
                    dbMsg = dbMsg + ":" + tStamp();
                    isQueueing = false;                      //データ読み取り中
                    if (reloadLimit < reloadCount) {           //正常にデータ取得できない回数で ||  (totalClount == 0 && )
                        dbMsg = dbMsg + "reload;" + reloadCount + "/" + reloadLimit + "でリロード開始";
                        // myLog(dbMsg);
                        reLoadJanction();                       //リロード処理
                    }
                    // if (isQueueing) {                                                       //処理中にデータを消された場合
                    //     dbMsg = dbMsg + "保留";
                    //     queueingCount++;
                    //     dbMsg = dbMsg + ".isQueueing＝" + isQueueing;
                    setTimeout(function () {
                        dataQueueing();
                    }, 1000);                   //org;7000
                    // }
                    myLog(dbMsg);
                });
            }
            myLog(dbMsg);
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；' + e;
            myReload(dbMsg);
        }
    }                                        //0.5秒ごとに最新の登録状況を確認しながら待ち行列を作成。行列がなくなるまでデータURLを送出。

    /**
     *実質再生ループ。ここから
     *localStorageが空になったらリロード処理
     * dataQueueing後、$.fn.slidenewから呼ばれる
     * */
    function dataBind() {
        var dbMsg = "[dataBind]";
        dbMsg = dbMsg + ":" + tStamp();
        try {
            var nextIds = "";
            // noArrivalLoopCount = 0;         //新着無しをリセット
            if (isReload) {
                dbMsg = dbMsg + ">>>既にリロード中 ";
                return;
                // } else if (isStock) {
                //     dbMsg = dbMsg + ">>>ストック再生中 ";
                // } else if (isArrival) {
                //     dbMsg = dbMsg + ">>>新着再生中 ";
            } else if (totalClount == 0 && farstArrival == false) {
                dbMsg = dbMsg + ">>>ストック無しで新着でもない"
                //            mainLoopStart()
                //            return;
            } else {
                var allImages = JSON.parse(localStorage.getItem("all-keys"));
                if (allImages != null) {
                    remainCount = allImages.length;
                    dbMsg = dbMsg + '、' + remainCount + "/" + totalClount + "件";
                } else {
                    remainCount = 0;
                }
                $("#now_play_count").text("表示待ち" + remainCount); //"表示待ち" + lcount
                $("#total_count").text(totalClount);
                var queue = [];                                         //ストックのurl
                if (localStorage.getItem("queue") != "null") {
                    queue = JSON.parse(localStorage.getItem("queue"));
                }
                dbMsg = dbMsg + '、開始時queue=' + queue.length + "件";
                if (reLoadMe(queue)) {
                    dbMsg = dbMsg + ">>isReload=" + isReload + ">>>リロード ";
                } else {
                    $("#arrival_total").text("皆様の投稿をお待ちしてます。");
                    $("#arrival_count").text("表示待ちの新着無し。");
                    if (0 < arrivalsArray.length) {                 ///新着*******************//蓄積画像のアニメーション実行中でなければ        let'sNote;20170308
                        if (farstArrival) {
                            $("#info_bord").css({ 'display': 'none' });
                        }
                        dbMsg = dbMsg + ">新着>" + arrivalsIDArray.length + "件,url= " + arrivalsIDArray.toLocaleString();
                        dbMsg = dbMsg + ",新着url= " + arrivalsArray.length;
                        isArrival = true;
                        newId = arrivalsIDArray[0]; //追加された写真のIDを取得
                        if (newId != undefined) {             //
                            $("#now_play_id").text(newId);
                            dbMsg = dbMsg + "<<追加>>；id" + newId;
                            $("#arrival_id").text(arrivalsIDArray.toString());
                            newImageWrite(); //新着処理スタート
                        }
                    } else if (queue[0]) {                                        ///ストック*************************************/
                        dbMsg = dbMsg + "、ストック再生";   // + queue.length + "件待ち";
                        nextImages = [];                                //ストック再生中の写真データ配列
                        while (nextImages.length < setCount) {              //setCount=2件をnextImagesに代入
                            if (queue[0]) {                                         //最後の1枚の2週目はnullになる
                                nextIds = nextIds + queue[0].photoid + ",";
                            }
                            nextImages.push(queue[0]);
                            queue.splice(0, 1);
                        }
                        $("#now_play_id").text(nextIds);
                        dbMsg = dbMsg + ",nextImages=" + nextImages.length + "件";
                        var ids = [];
                        $.each(queue, function (i, photo) {
                            ids.push(photo.photoid);
                            dbMsg = dbMsg + ",ids=" + ids[ids.length - 1];
                        });
                        localStorage.setItem("queue.ids", ids);
                        localStorage.setItem("queue", JSON.stringify(queue));
                        localStorage.setItem("displayed", JSON.stringify(nextImages)); //height:714,id:"5875c061e571e",image:"https:...,md5:"265043aab09687ef833d1615cd02ec85",photoid:"30594",width:1270
                        var data = { images: nextImages };
                        stockWrite();                //2313
                    }                                        ///ストック*************************************/
                }
            }
            myLog(dbMsg);
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；' + e;
            myReload(dbMsg);
        }
    }                                                   //実質再生ループ

    /**
     * リロードするか否かを判断してリロード
     * dataBindから呼ばれるメインルート
     * **/
    function reLoadMe(queue) {
        var dbMsg = "[slidenew・reLoadMe]";
        isReload = false;
        try {
            //        dbMsg = dbMsg + ",一通目=" + farstArrival;
            if (0 < queue.length) {             //再生する写真がなくなれば( allImages.length == 0 && )ではなく、処理する画像が途切れたら強制的に
                dbMsg = dbMsg + ">>queue=" + queue.length + "件処理中";
            } else if (farstArrival) {
                dbMsg = dbMsg + ">>一通目";
            } else if (isQueueing) {
                dbMsg = dbMsg + ">>データ読み取り中";
            } else if (0 < arrivalsIDArray.length) {
                dbMsg = dbMsg + ">>新着ID=" + arrivalsIDArray.length + "件処理中";
            } else if (0 < arrivalsArray.length) {
                dbMsg = dbMsg + ",url=" + arrivalsArray.length + "件";
            } else {
                var allImages = JSON.parse(localStorage.getItem("all-keys"));
                if (allImages) {
                    dbMsg = dbMsg + '、allImages=' + allImages.length + '=' + allImages[allImages.length - 1];
                    var allImagesLen = JSON.parse(localStorage.getItem("all-keys")).length;
                    dbMsg = dbMsg + ",処理待ちストック = " + allImagesLen + "件";
                    if (0 < allImagesLen) {
                        //                dataBind();
                        //                dataQueueing();
                    } else {
                        myLog(dbMsg);
                        isReload = reLoadJanction(dbMsg);
                    }
                } else {
                    myLog(dbMsg);
                    isReload = reLoadJanction(dbMsg);
                }
            }
        } catch (e) {
            dbMsg = dbMsg + "," + e;
            isReload = reLoadJanction(dbMsg);
        }
        dbMsg = dbMsg + ",isReload=" + isReload;
        // myLog(dbMsg);
        return isReload;
    }

    function reLoadJanction(lastMsg) {
        var dbMsg = "[reLoadJanction]";
        try {
            isReload = false;
            dbMsg = dbMsg + ",一通目=" + farstArrival + ",データ読み取り中=" + isQueueing + ",新着無し" + noArrivalLoopCount + "/" + noArrivalLoopLimit + "周目,isStock=" + isStock;
            if (farstArrival) {
                dbMsg = dbMsg + ",一通目";
            } else if (isStock) {
                dbMsg = dbMsg + ">>>ストック再生中 ";
            } else if (isQueueing) {
                dbMsg = dbMsg + ",データ読み取り中";
            } else if (noArrivalLoopLimit < noArrivalLoopCount) {           // ||  (totalClount == 0 && reloadLimit < reloadCount)
                dbMsg = dbMsg + ",新着無し" + noArrivalLoopCount + "/" + noArrivalLoopLimit + "周目,isStockEnd=" + isStockEnd + "、確認" + reloadCount + "/" + reloadLimit + "回,totalClount=" + totalClount + ",info_bord.info_bord=" + $("#info_bord").css('display');
                reloadMassage(lastMsg + dbMsg);
            } else if (totalClount == 0 && reloadLimit < reloadCount) {
                reloadCount = 0;
                noArrivalLoopCount = 0;
                myLog(dbMsg);
                reLoadJanction(dbMsg);
            } else {
                reloadCount = 0;
                isReload = true;
                $.cookie('slideshow.max-id', nowMaxId);              //setLocalStorage>>readNewImages        org  lsMax
                noArrivalLoopCount++;                               //新着が無い場合
                if (useBGAnime) {
                    $("#effectCa").fadeTo(2000, 0.0, function () {                  //デフォルトムービーを5秒でフェードアウトして
                        efffectStop();
                        dbMsg = dbMsg + "、effectTimer停止 ";
                        if (ceremonies_slide_bg == 2) {
                            if (lastMsg) {
                                myReload(lastMsg);
                            } else {
                                myReload(dbMsg);
                            }
                        } else {
                            $("#canvas_bace").fadeTo(2000, 0.0, function () {                  //デフォルトムービーを5秒でフェードアウトして
                                dbMsg = dbMsg + "、背景ＦＯ ";
                                if (lastMsg) {
                                    myReload(lastMsg);
                                } else {
                                    myReload(dbMsg);
                                }
                            });
                        }
                    });
                } else {
                    reLoadMe2();
                }
            }
            dbMsg = dbMsg + ",isReload=" + isReload;
            myLog(dbMsg);
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；';
            myReload(dbMsg);
        }
        return isReload;
    }

    function reloadMassage(lastMsg) {
        var dbMsg = "[reloadMassage]";
        dbMsg = dbMsg + ",isStockEnd=" + isStockEnd + ",info_bord.info_bordのdisplay=" + $("#info_bord").css('display');
        try {
            setTimeout(function () {
                reloadMassageBody(lastMsg)
            }, 2000);                                                                   //最後の写真のフェードアウト待ち
            dbMsg = dbMsg + ">>" + $("#info_bord").css('display');
            // myLog(dbMsg);
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；' + e;
            myReload(dbMsg);
        }
    }

    function reloadMassageBody(lastMsg) {
        var dbMsg = "[reloadMassageBody]";
        dbMsg = dbMsg + ",isStockEnd=" + isStockEnd + ",info_bord.info_bordのdisplay=" + $("#info_bord").css('display');
        $("#info_bord").css({ 'display': 'inline' });                     //投稿待ちインフォメーション
        fiElementById(document.getElementById("info_bord_bace"));
        setTimeout(function () {
            reloadCount = 0;
            noArrivalLoopCount = 0;
            reLoadJanction(lastMsg);
        }, (anime_time * 2));
        dbMsg = dbMsg + ">>" + $("#info_bord").css('display');
        //         myLog(dbMsg);
    }

    function reLoadMe2() {
        var dbMsg = "[reLoadMe2]";
        try {
            //     var slide_bg = $data['ceremony']['ceremonies_slide_bg']
            dbMsg = dbMsg + ",=" + ceremonies_slide_bg;
            if (ceremonies_slide_bg == '0' || ceremonies_slide_bg == '1') {
                fadeOut(); //2311;静止画を読み込んでいるCanvasのフェードアウト;デフォルトムービー指定ならメソッドに入らない
            } else if (ceremonies_slide_bg == '2') {
                $("#bg_video").fadeTo(5000, 0.0, function () {                  //デフォルトムービーを5秒でフェードアウトして
                    myReload(dbMsg);
                })
            } else {        // if (ceremonies_slide_bg > 7)
                myReload(dbMsg);
                // wallFO(dbMsg);
            }
            myLog(dbMsg);
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；';
            myReload(dbMsg);
        }
        return isReload;
    }

    /**
     *最終(最低限の)リロード処理 
     */
    function myReload(lastMsg) {
        var tag = "[myReload]";
        var dbMsg = tag + "呼び出し元＝" + lastMsg;
        try {
            $.cookie('slideshow.no_arrival_loop_count', noArrivalLoopCount);
            $.cookie('slideshow.update', new Date());
            localStorage.clear();                                                       //IEで必須？
            stopNIAnimation(effectTArray);              //effect
            stopNIAnimation(dQArray);         //id-url引き当て処理
            stopNIAnimation(pniArray);         //新着確認
            stopNIAnimation(saArray);          //slideAnimation
            stopNIAnimation(newArrivalsArray);          //新着開始
            stopNIAnimation(caB2fArray);                //新着終了
            stopNIAnimation(effectTArray);              //effect
            arrivalsArray = []; //新着画像のUrl配列
            _sakuras = []; //エフェクトオブジェクト個々のパラメータ配列
            effectImgS = []; //エフェクトオブジェクトを格納する配列；要素数はSAKURA_COUNTまで ; effectInitで初期化
            date = new Date();
            toDateStr = "起動時間 = " + loadTime + "mS;終了" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
            lastMsg = toDateStr + ";" + lastMsg;
            $.cookie("slideshow.reload_msg", lastMsg);
            makeLastCooki(lastMsg);
            if (arrivalsIDArray) {
                dbMsg = dbMsg + "新着の残り＝" + arrivalsIDArray.length + "件";
                if (0 < arrivalsIDArray.length) {
                    var slializeStr = JSON.stringify(arrivalsIDArray);      // JavaScript の値を JSON 文字列に//
                    dbMsg = dbMsg + "＝" + slializeStr;
                    $.cookie('slideshow.update-keys', slializeStr);
                }
            } else {
                if ($.cookie('slideshow.update-keys')) {
                    $.removeCookie('slideshow.update-keys')
                }
            }
            arrivalsIDArray = []; //新着画像のID配列

            myLog(dbMsg);
            window.location.reload(true); //trueでスーパーリロード；キャッシュに関係なく、すべてのリソースを取得し直し
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；' + e;
            myLog(dbMsg);
            window.location.reload(true);
        }
    }


    setOpacity = function (elm, opacity) {
        var tag = "[setOpacity]";
        var dbMsg = tag + ";opacity= " + opacity;
        try {
            elm.style.filter = 'alpha(opacity=' + (opacity * 10) + ')';
            elm.style.MozOpacity = opacity / 10;
            elm.style.opacity = opacity / 10;
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；';
            myReload(dbMsg);
        }
    }

    fadeSetTime = function (mode, elm) {
        var tag = "[fadeSetTime]";
        var dbMsg = tag;
        var that = this;
        var loopEnd = 10;
        var fadeTime = function (mode, elm) {
            var loopCnt = 0;
            var opacity = 10;
            var plusCnt = -1;
            if (mode == 'in') {
                opacity = 0;
                plusCnt = 1;
            }
            return function () {
                if (loopCnt < loopEnd) {
                    loopCnt += 1;
                    opacity = opacity + plusCnt;
                    dbMsg = dbMsg + "(" + loopCnt + "/" + loopEnd + ")opacity=" + opacity; //+ "/" + stayCount
                    //     myLog(dbMsg);
                    setTimeout(fadeTime, 100);
                    setOpacity(elm, opacity);
                }
            }
        }(mode, elm);
        //      myLog(dbMsg);
        fadeTime();
    };

    function fiElementById(elm) {
        var tag = "[fiElementById]";
        var dbMsg = tag;
        this.setOpacity(elm, 0);
        this.fadeSetTime('in', elm);
        //    myLog(dbMsg);
    }

    function efAriaFO() {
        var dbMsg = "[slidenew・efAriaFO]";
        try {
            var time = setTimeout(efAriaFO, 25);
            var elColored = document.getElementById('effectCa');

            dbMsg = dbMsg + ",nowColor=" + nowColor;
            var colors = nowColor.match(/\d+/g);
            dbMsg = dbMsg + ",colors=" + colors;
            var rC = colors[0] * 1 + 1;
            var gC = colors[1] * 1 + 1;
            var bC = colors[2] * 1 + 1;
            var nextColer = "rgb(" + rC + "," + gC + "," + bC + ")";
            nextColer = "'#" + rgbToHex(nextColer) + "'";
            dbMsg = dbMsg + ",nextColer=" + nextColer;
            myLog(dbMsg);
            document.getElementById("effectCa").style.backgroundColor = nextColer;
            if (nextColer == nextColer == "#FFFFFF" || nextColer == "#ffffff") {                 //if (nextColer == "#FFFFFF" || nextColer == "#ffffff")          nextColer == "rgb(255,255,255)"
                clearTimeout(time);
                myReload(dbMsg);
            }
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；';
            myReload(dbMsg);
        }
    }

    function rgbToHex(color) {
        var ret = /rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),?\s*([.\d]+)?\)/.exec(color);
        var rgbHex = '';
        try {
            for (var i = 1; i <= 3; i++) {
                var hex = Number(ret[i]).toString(16);
                rgbHex += (hex.length === 1) ? '0' + hex : hex;
            }
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；';
            myReload(dbMsg);
        }
        return rgbHex;
    }

    //2313/////////////////////////////////////////////////////////////////
    var blankParcent = 0;
    var blankCount = 0;
    var threePointMode = false;
    var isCellDrow = false;
    var blankAreaInfo = "";
    var divideEqually = 100;　 //分割数 
    var tileCell; //タイル個々のデータ配列
    var omitCount = 0;
    var colEnd = 0;
    var colCenter = 2;
    var rowEnd = 0
    var fleamWidth = 10; //フレーム幅
    /**
     * 当分割した升目を作成して比率取り/スライドショーへ
     * @param {*} divideEqually    　分割数 
     * https://techacademy.jp/magazine/5600
     */

    ///スライドショー////////////////////////////////////////////////////////////////////////////////////////////////////
    var cellCount = 0;
    var leftCell;
    var rightCell;

    /**
     * 書き込み可能な枠へ割付け
     * 
     */
    function assignment2Measure() {
        var tag = "[slide.assignment2Measure]";
        var dbMsg = tag + tileCell.length + "件";
        leftCell = [];
        rightCell = [];
        do {
            var cellDate = tileCell.splice(0, 1); //指定位置からいくつまで抜き出すか    http://qiita.com/takeharu/items/d75f96f81ff83680013f
            var rowPosition = cellDate[0][0];
            var colPosition = cellDate[0][1];
            var cellName = "R" + rowPosition + "C" + colPosition;
            dbMsg = dbMsg + "から" + cellName + "を";
            var wrX = cellDate[0][2];
            var wrY = cellDate[0][3];
            var wrW = cellDate[0][4];
            var wrH = cellDate[0][5];
            dbMsg = dbMsg + "," + cellName + "(" + wrX + "," + wrY + ")[" + wrW + "×" + wrH + "]";
            var cData = new Array(rowPosition, colPosition, wrX, wrY, wrW, wrH);
            if (colPosition <= colCenter) { //左側
                leftCell.push(cData);
            } else {
                rightCell.push(cData);
            }
            // if (thmbnails.length <= cellCount) {
            //     cellCount = 0;
            // } else {
            //     cellCount++;
            // }
        } while (0 < tileCell.length);
        dbMsg = tag + "左" + leftCell.length + "件、右＝" + rightCell.length + "件";
        myLog(dbMsg);
        if (0 < leftCell.length) {
            cellCount = 0;
            stockWrite();
        }
    } //書き込み可能な枠へ割付け;セル数分のループ

    /**
     * 左右に振り分けた配列からの書き出し
     */
    function stockWrite() {
        var tag = "[stockWrite]";
        var dbMsg = tag;         //"(" + cellCount + ")左" + leftCell.length + "件から";
        isStock = true; //蓄積画像のアニメーション実行中
        isStockEnd = false;                 //完了フラグoff
        isStayEnd = false; //画像のアニメーション静止終了
        // if (0 < leftCell.length) {
        // var targetNo = Math.floor(Math.random() * leftCell.length); // 最終からなら var trgetNo=rightCell.length - 1;
        // var lData = leftCell.splice(targetNo, 1);
        // dbMsg = dbMsg + ",R" + lData[0][0] + "C" + lData[0][1];
        // dbMsg = dbMsg + ">>" + leftCell.length + "件待機";
        if (leftCell) {//2313;左のStock//rowPosition, colPosition, wrX, wrY, wrW, wrH,url
            // var lData = [];
            // lData[0][0] = leftCell[0][0];            //row
            // lData[0][1] = lData[0][1];            //col
            // lData[0][2] =  lData[0][2];  //var wrX
            //  lData[0][3] =  lData[0][3];  //var wrY = cellDate[0][3];
            // lData[0][4] =  lData[0][4];  //var wrW = cellDate[0][4];
            // var wrH = cellDate[0][5];
            var thmSrc = leftCell[0][6];       //thmbnails[cellCount];
            // if (thmSrc) {
            //     cellCount++;
            // } else {
            //     thmSrc = thmbnails[0];
            //     cellCount = 1;
            // }
            // 

            // dbMsg = dbMsg + "thmSrc=" + thmSrc;         //+ ">>" + leftCell.length + "件";
            // myLog(dbMsg);
            makeACanvae(leftCell, thmSrc);
            // }
        }
    } //左に振り分けた配列からの書き出し

    function stockWriteRight() {
        var tag = "[slide.stockWriteRight]";
        var dbMsg = tag;        // + "(" + cellCount + ")右=" + rightCell.length + "件から";
        // if (0 < rightCell.length) {
        //     var targetNo = Math.floor(Math.random() * rightCell.length); // 最終からなら var trgetNo=rightCell.length - 1;
        //     var rData = rightCell.splice(targetNo, 1);
        //     dbMsg = dbMsg + ",R" + rData[0][0] + "C" + rData[0][1];
        //     dbMsg = dbMsg + ">>" + rightCell.length + "件待機";
        if (rightCell) {                        //2313;右のStock
            var thmSrc = rightCell[0][6];
            // if (thmSrc) {
            //     cellCount++;
            // } else {
            //     thmSrc = thmbnails[0];
            //     cellCount = 1;
            // }
            // dbMsg = dbMsg + "thmSrc=" + thmSrc;// + "、右=" + rightCell.length + "件";
            // myLog(dbMsg);
            makeACanvae(rightCell, thmSrc);
        }
        // }
    } //右に振り分けた配列からの書き出し

    /**
     * 左右それぞれのcanvasを作成
     * 止まった時の大きさはwightWidth、
     * 
     */
    function makeACanvae(cellData, thmSrc) {
        var tag = "[makeACanvae]";
        dbMsg = tag + ":" + tStamp();
        // var dbMsg = tag + "thmSrc=" + thmSrc;
        var rowPosition = cellData[0][0];
        var colPosition = cellData[0][1];
        var cellName = "R" + rowPosition + "C" + colPosition;
        var dbMsg = tag + cellName;
        var aCanvasName = cellName + "left";
        var rotate = -5;
        if (colCenter < colPosition) { //右側なら
            aCanvasName = cellName + "right";
            // wrStartX = wAriaWidth + fromCenterX;
            rotate = 5;
        }
        dbMsg = dbMsg + "=" + aCanvasName + "," + rotate + "°";
        // var wrX = cellData[0][2];
        // var wrY = cellData[0][3];
        // var wrW = cellData[0][4];
        // var wrH = cellData[0][5];
        // dbMsg = dbMsg + "," + cellName + "(" + wrX + "," + wrY + ")[" + wrW + "×" + wrH + "]";
        var parentOj = document.getElementById("newimg_div"); //idで親要素を取得          //http://unitopi.com/jquery-parent-child-3/
        var amimeCanvas = document.createElement("canvas"); //var newImg_canvas = orgCanvas.cloneNode(true); // 要素を複製 子孫ノードも複製する場合は true 、 node のみを複製する場合は false
        parentOj.appendChild(amimeCanvas); // 親ノードの末尾にクローンノードを追加
        amimeCanvas.setAttribute("id", aCanvasName); //       newImg_canvas.id = "canvas" + Nid; // クローンノードのID名を付け替え
        $("#" + amimeCanvas.id).attr("width", winW + 'px').attr("height", winH + 'px').css({ 'display': 'inline-block' }).css({ 'position': 'absolute' }).css({ 'background-color': 'transparent' }); //: ;
        amimeCtx = amimeCanvas.getContext('2d'); //☆ページロード直後は非表示なのでサイズプロパティーは取れない
        dbMsg = dbMsg + "追加したエレメント" + amimeCanvas.id;
        var img = new Image();
        img.src = thmSrc;
        // img.crossOrigin = "Anonymous"; //XAMPP必要；file;//ではcrossdomeinエラー発生
        // myLog(dbMsg);
        img.onload = function (event) {
            dbMsg = dbMsg + ":" + tStamp();
            var wAriaWidth = winW / 2; //書込み領域幅
            var wightWidth = wAriaWidth * 0.87; //目標サイズ  0.9だとはみ出す
            dbMsg = dbMsg + '\n' + tag + ".onload]C" + colPosition + ",Width=" + wightWidth;
            var dstWidth = this.width;
            var dstHeight = this.height;
            dbMsg = dbMsg + ",元[" + dstWidth + "×" + dstHeight + "]";
            var aCanvasWidth = wightWidth;          // = wAriaWidth;
            var aCanvasHeight = winH * 0.7;
            dbMsg = dbMsg + ",aCanvas[" + aCanvasWidth + "×" + aCanvasHeight + "]";
            var scaleWidth = dstWidth / aCanvasWidth;
            var scaleHeight = dstHeight / aCanvasHeight;
            var tile_bace_size = 100;   //document.getElementById("tile_bace_size"); //idで親要素を取得          //http://unitopi.com/jquery-parent-child-3/
            tileBaceSize = tile_bace_size.value * 1; //idで親要素を取得          //http://unitopi.com/jquery-parent-child-3/
            // dbMsg = dbMsg + ",枠サイズ" + tileBaceSize + "%";
            dbMsg = dbMsg + ",scale[" + scaleWidth + "×" + scaleHeight + "%]";  //更に" + tileBaceSize + "%";
            var endScale = 1 / scaleHeight;// * tileBaceSize / 100;
            if (scaleHeight < scaleWidth) {
                endScale = 1 / scaleWidth;// * tileBaceSize / 100;
            }
            dbMsg = dbMsg + "," + endScale + "%";
            dstWidth = dstWidth * endScale;
            dstHeight = dstHeight * endScale;
            dbMsg = dbMsg + ",dst[" + dstWidth + "×" + dstHeight + "]";
            var wrStartY = (winH - dstHeight) / 2;
            // var endScale = winW / 2 * 0.30;
            // var StrtScale = winW / 2 * 0.05;
            // if (dstWidth < dstHeight) {
            //     endScale = winH / 2 * 0.30;
            //     StrtScale = winH / 2 * 0.05;
            // }
            // dbMsg = dbMsg + ",ズームアップ⁼" + StrtScale + "～" + endScale;
            var fromCenterX = 25;                                       //重なり ;少ないほど重なる
            var wrStartX = (wrStartX = winW / 2 + fromCenterX) - winW / 40;            //右
            if (colPosition < colCenter) {
                wrStartX = ((winW / 2 - dstWidth) - fromCenterX) - winW / 40;          //左
            }
            dbMsg = dbMsg + ",(" + wrStartX + "," + wrStartY + ")";
            amimeCtx.clearRect(0, 0, aCanvasWidth, aCanvasHeight);
            amimeCtx.drawImage(this, wrStartX, wrStartY, dstWidth, dstHeight);
            dbMsg = dbMsg + "終了";
            dbMsg = dbMsg + ":" + tStamp();
            // myLog(dbMsg);
            amimeCtx.globalAlpha = 0.0;
            var imgObj = { ctx: amimeCtx, iObj: img, scale: endScale, x: wrStartX, y: wrStartY, w: dstWidth, h: dstHeight, rot: rotate, cell: cellData };
            // var imgObj = { ctx: amimeCtx, iObj: img, scale: endScale, x: wrStartX, y: wrStartY, w: dstWidth, h: dstHeight, rot: rotate, cell: cellData };
            zi2Stay(amimeCtx, imgObj, 0, 0);
            if (rightCell) {
                if (colPosition <= colCenter) {
                    stockWriteRight();
                }
            }
        }
    }

    /**
     * フェードインしながらズームアップして停止
     * ※zoomUp速度はupAlpha(透明度)に比例
     * ※拡大中の枠線は縮小率に比例
     * 回転       http://jsdo.it/tomozz/nV0E
     */
    function zi2Stay(wrCTX, imObj, aCount, dig) {
        var tag = "[slide.zi2Stay]";
        var dbMsg = tag + "(" + aCount + ")";
        dbMsg = dbMsg + "を" + wrCTX.canvas.id;
        var img = imObj.iObj;
        var biScale = imObj.scale;
        var wrStartX = imObj.x;
        var wrStartY = imObj.y;
        var dstWidth = imObj.w;
        var dstHeight = imObj.h;
        var rotate = imObj.rot;
        var cellData = imObj.cell;
        var rowPosition = cellData[0][0];
        var colPosition = cellData[0][1];
        var cellName = "R" + rowPosition + "C" + colPosition;
        dbMsg = dbMsg + cellName;
        var thiLate = 50;
        var nextStartCount = 25;                                //次のStockLoopに重ねる時間；短いほど重なりが長い
        var nextStartTime = stayTime - thiLate * nextStartCount;
        dbMsg = dbMsg + ",nextStartTime=" + nextStartTime;
        addPhotAria(wrCTX.canvas.id);                 //エフェクトに渡す写真ID
        ///zoomUp速度/////////////////////////////////////////////////////////////
        var nowAlpha = wrCTX.globalAlpha;
        var upAlpha = (1 - nowAlpha) / 30;
        if (upAlpha < 0.01) {
            upAlpha = 0.01;
        }
        ////////////////////////////////////////////////////////////zoomUp速度////
        var upDig = rotate * upAlpha;
        var nowScale = biScale * upAlpha;
        dbMsg = dbMsg + "最終(" + wrStartX + "," + wrStartY + ")" + dstWidth + "×" + dstHeight + "]Scale=Alpha" + biScale + "%";
        var wrObj = { ctx: wrCTX, iObj: img, scale: biScale, x: wrStartX, y: wrStartY, w: dstWidth, h: dstHeight, rot: rotate, cell: cellData };
        if (nextStartCount < aCount) { //停止時間40なら*50mSで2秒
            dbMsg = dbMsg + ":" + tStamp() + ",aCount=" + aCount;
            dbMsg = dbMsg + ">>次へ" + nextStartTime + "mS";
            if (colPosition <= colCenter) {
                rightZo2FoArray.push(setTimeout(function () {
                    zo2Fo(wrCTX, wrObj, 0, dig);
                }, nextStartTime));
                stopNIAnimation(rightZi2StayArray);
                dbMsg = dbMsg + ">>次へ";
                reWritIsStock();    //次をスタート
            } else {
                leftZo2FoArray.push(setTimeout(function () {
                    zo2Fo(wrCTX, wrObj, 0, dig);
                }, nextStartTime));
                stopNIAnimation(leftZi2StayArray);
                dbMsg = dbMsg + ">左終了";
                if (rightCell) {
                    dbMsg = dbMsg + ">右待ち";
                } else {
                    dbMsg = dbMsg + ">右無し>次へ";
                    reWritIsStock();    //次をスタート
                }
            }
            myLog(dbMsg);
            removePhotAria(wrCTX.canvas.id); //回避エリアの消去
        } else {
            wrCTX.globalAlpha += upAlpha;
            dbMsg = dbMsg + "、Alpha=" + wrCTX.globalAlpha;
            if ((1 - upAlpha) < wrCTX.globalAlpha) {
                wrCTX.globalAlpha = 1.0;
                aCount++;
            } else {
                dbMsg = dbMsg + "のスケール=" + wrCTX.globalAlpha + "(" + biScale + ")%";
                var nowWidth = dstWidth * wrCTX.globalAlpha;
                var nowHeight = dstHeight * wrCTX.globalAlpha;
                var dWidth = (dstWidth - nowWidth) / 2;
                var nowStartX = wrStartX + dWidth; //中心固定　wrStartX + (dstWidth - nowWidth) / 2;
                var dHeight = (dstHeight - nowHeight) / 2;
                var nowStartY = wrStartY + dHeight; //中心固定　 wrStartY + (dstHeight - nowHeight) / 2
                // var shifY = wrStartY;
                dbMsg = dbMsg + "で元座標(" + nowStartX + "、" + nowStartY + ")[" + nowWidth + "、" + nowHeight + "]";

                dbMsg = dbMsg + "のdig=" + dig + "°";
                dig = dig + upDig;
                if (colPosition <= colCenter) { //左側
                    if (dig < (-5 + upDig)) {
                        dig = -5;
                    }
                    nowStartX = nowStartX + dWidth; //中心に寄せる      ☆2では交差する
                    // shifY = shifY + 100;
                } else {
                    if ((5 - upDig) < dig) {
                        dig = 5;
                    }
                    nowStartX = nowStartX - dWidth;
                }
                // nowStartY =  nowStartY  + dHeight;
                dbMsg = dbMsg + ",x=" + nowStartX;
                dbMsg = dbMsg + ">>" + dig + "°";
                var rad = dig * Math.PI / 180; // 回転角度をラジアン値で設定
                dbMsg = dbMsg + "=" + rad + "red";
                // dbMsg = dbMsg + ",[Scale=" + biScale + "%,Start(" + wrStartX + "," + wrStartY + ")[" + dstWidth + "×" + dstHeight + "]";
                wrCTX.clearRect(0, 0, winW, winH); //wrCTX.canvas.height, wrCTX.canvas.width);
                var retObj = roteD(nowStartX, nowStartY, 0, 0, rad);//roteD(nowStartX, nowStartY, dstWidth, dstHeight, rad);      wrStartX, wrStartY,
                var dX = retObj.dX;  // var dX = nowStartX * Math.sin(rad); //dstWidth>>nowStartX
                var dY = retObj.dY;  // var dY = nowStartY * Math.sin(rad); //dstHeight
                dbMsg = dbMsg + "、移動(" + dX + "," + dY + ")";
                wrCTX.setTransform(Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), dX, -dY);    //-dY
                wrCTX.fillStyle = 'white';
                var drowWidth = fleamWidth * wrCTX.globalAlpha;
                wrCTX.fillRect(nowStartX - drowWidth, nowStartY - drowWidth, nowWidth + drowWidth * 2, nowHeight + drowWidth * 2);
                wrCTX.drawImage(img, nowStartX, nowStartY, nowWidth, nowHeight); //, wrStartX, wrStartY, dstWidth, dstHeight);  // nowStartX, nowStartY, nowWidth, nowHeight);
            }
            dbMsg = dbMsg + ">>[Scale=" + biScale + "%,Start(" + wrStartX + "," + wrStartY + ")[" + dstWidth + "×" + dstHeight + "]";
            wrObj = { ctx: wrCTX, iObj: img, scale: biScale, x: wrStartX, y: wrStartY, w: dstWidth, h: dstHeight, rot: rotate, cell: cellData };
            if (0.98 < wrCTX.globalAlpha && wrCTX.globalAlpha < 1) {
                myLog(dbMsg);
            }
            rewitePhotAria(); //回避エリアを更新
            if (colPosition <= colCenter) {
                rightZi2StayArray.push(setTimeout(function () {                  //setTimeoutは繰り返し使うと4msの遅延が発生が発生する；setInterval
                    zi2Stay(wrCTX, wrObj, aCount, dig);
                }, thiLate));
            } else {
                leftZi2StayArray.push(setTimeout(function () {
                    zi2Stay(wrCTX, wrObj, aCount, dig);
                }, thiLate));
            }
        }
    }

    /**
     * 傾きに対する補正
    */
    function roteD(nowStartX, nowStartY, dstWidth, dstHeight, rad) {
        var tag = "[roteD]";
        // var dbMsg = tag + "(" + nowStartX + "," + nowStartY + ")[" + dstWidth + "×" + dstHeight + "]" + rad + "rad";
        var dbMsg = tag + rad + "rad";
        var siftX = nowStartX + dstWidth;
        var siftY = nowStartY + dstHeight;
        dbMsg = dbMsg + ",sift(" + siftX + "," + siftY + ")";
        var dX = (nowStartX + dstWidth) * Math.sin(rad); //dstWidth>>nowStartX
        var dY = (nowStartY + dstHeight) * Math.tan(rad); //dstHeight
        dbMsg = dbMsg + ">>d(" + dX + "," + dY + ")";
        var retObj = { dX: dX, dY: dY };
        if (rad < -0.0859 || 0.0859 < rad) {
            // myLog(dbMsg);
        }
        return retObj;
    }

    function zo2Fo(wCTX, wObj, aCount, dig) {
        var tag = "[slide.zo2Fo]";
        var imObj = wObj.iObj;
        var dbMsg = tag;            // + "thmSrc=" + imObj.src;
        var img = imObj;
        var biScale = wObj.scale;
        var wrStartX = wObj.x;
        var wrStartY = wObj.y;
        var dstWidth = wObj.w;
        var dstHeight = wObj.h;
        // console.log(wObj.cell);
        var cellData = wObj.cell;
        var rowPosition = cellData[0][0];
        var colPosition = cellData[0][1];
        // var pearName =  cellData[0][7];
        var cellName = "R" + rowPosition + "C" + colPosition;
        dbMsg = dbMsg + "を" + cellName;
        var netxId = wCTX.canvas.id;
        dbMsg = dbMsg + "に" + netxId;
        var nowAlpha = wCTX.globalAlpha;
        var downAlpha = (1 - nowAlpha) / 10;
        if (downAlpha < 0.01) {
            downAlpha = 0.01;
        }
        dbMsg = dbMsg + "(" + aCount + ")downAlpha=" + downAlpha + ",現在=" + nowAlpha;
        // var wrObj = { ctx: wCTX, iObj: img, scale: biScale, x: wrStartX, y: wrStartY, w: dstWidth, h: dstHeight, cell: cellData };
        if (10 < aCount) { //透過後の経過時刻でリソース破棄；10なら*100mSで1秒；5を割ると消し損ねる
            // drowThumb(cellData, imObj.src);              //タイル並べ
            if (colCenter <= colPosition) { //右側
                stopNIAnimation(rightZo2FoArray);                   //setTimeoutスレッドの消去でアニメーション停止
            } else {
                stopNIAnimation(leftZo2FoArray);
            }
            dellElement(netxId, "newimg_div", rowPosition, colPosition);
            myLog(dbMsg);
        } else {
            wCTX.globalAlpha -= downAlpha;
            dbMsg = dbMsg + "、Alpha=" + wCTX.globalAlpha;
            if (wCTX.globalAlpha < 0.01) {
                wCTX.globalAlpha = 0;
                aCount++;
            } else {
                if (wCTX.globalAlpha < downAlpha * 2) {
                    wCTX.globalAlpha = 0;
                }
                var wScale = 1 + (1 - wCTX.globalAlpha);
                dbMsg = dbMsg + "のスケール=" + wScale + "(" + biScale + ")%";
                var nowWidth = dstWidth * wScale;
                var nowHeight = dstHeight * wScale;
                var dWidth = (dstWidth - nowWidth) / 2;
                var nowStartX = wrStartX + dWidth; //中心固定　wrStartX + (dstWidth - nowWidth) / 2;
                var dWHeight = (dstHeight - nowHeight) / 2;
                var nowStartY = wrStartY + dWHeight; //中心固定　 wrStartY + (dstHeight - nowHeight) / 2
                dbMsg = dbMsg + "で(" + nowStartX + "、" + nowStartY + ")[" + nowWidth + "、" + nowHeight + "]";

                dbMsg = dbMsg + "のdig=" + dig + "°";
                if (colPosition <= colCenter) { //左側
                    nowStartX = nowStartX + dWidth; //中心に寄せる      ☆2では交差する
                } else {
                    nowStartX = nowStartX - dWidth; //中心に寄せる      ☆2では交差する
                }
                dbMsg = dbMsg + ",x=" + nowStartX;
                dbMsg = dbMsg + ">>" + dig + "°";
                var rad = dig * Math.PI / 180; // 回転角度をラジアン値で設定
                dbMsg = dbMsg + "=" + rad + "red";
                // dbMsg = dbMsg + ",[Scale=" + biScale + "%,Start(" + wrStartX + "," + wrStartY + ")[" + dstWidth + "×" + dstHeight + "]";
                wCTX.clearRect(-200, -200, winW + 400, winH + 400);
                var retObj = roteD(wrStartX, wrStartY, 0, 0, rad);// roteD(nowStartX, nowStartY, dstWidth, dstHeight, rad);
                var dX = retObj.dX;  // var dX = nowStartX * Math.sin(rad); //dstWidth>>nowStartX
                var dY = retObj.dY;  // var dY = nowStartY * Math.sin(rad); //dstHeight
                dbMsg = dbMsg + "、移動(" + dX + "," + dY + ")";
                wCTX.setTransform(Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), dX, -dY);
                wCTX.fillStyle = 'white';
                wCTX.fillRect(nowStartX - fleamWidth, nowStartY - fleamWidth, nowWidth + fleamWidth * 2, nowHeight + fleamWidth * 2);
                wCTX.drawImage(img, nowStartX, nowStartY, nowWidth, nowHeight);

            }
            // dbMsg = dbMsg + ">>[Scale=" + biScale + "%,Start(" + wrStartX + "," + wrStartY + ")[" + dstWidth + "×" + dstHeight + "]";
            wrObj = { ctx: wCTX, iObj: img, scale: biScale, x: wrStartX, y: wrStartY, w: dstWidth, h: dstHeight, cell: cellData };
            if (colPosition <= colCenter) {
                rightZo2FoArray.push(setTimeout(function () {
                    zo2Fo(wCTX, wObj, aCount, dig);
                }, 50));
            } else {
                leftZo2FoArray.push(setTimeout(function () {
                    zo2Fo(wCTX, wObj, aCount, dig);
                }, 50));
            }
        }

    } //書き込み可能な枠へ割付け;セル数分のループ


    /**
     *  image.cssの中からグローバル変数を直接書き換える事が出来ないので関数化
     * **/
    function reWritIsStock() {
        var dbMsg = "[reWritIsStock]";
        // dbMsg = dbMsg + ",isStock=" + isStock;
        try {
            // if (isStock) {
            isStock = false; //蓄積画像のアニメーション終了
            var images = localStorage.getItem("all-keys");             //☆文字配列ではなく文字列になっている    Number()ではNaNになっている
            // dbMsg = dbMsg + ",images = " + images;
            if (images != null) {
                dbMsg = dbMsg + " = " + images.length + "文字から" + nextImages.length + "件を検索";
                if (10 < images.length) {                                            //(compliteID.length + 1)<
                    for (i in nextImages) {                                             //☆ var delPosition = images.indexOf(compliteID);  が正常動作しない
                        if (nextImages[i]) {                                 //上映中に削除されると'photoid' of undefined
                            if (nextImages[i].photoid) {                                 //上映中に削除されると'photoid' of undefined
                                var compliteID = '"' + nextImages[i].photoid + '",';        //☆セパレータの,までを対象とした
                                dbMsg = dbMsg + "(" + i + ")" + compliteID;                //'"' だと1と9　、  "'"だと-1
                                var delPosition = images.indexOf(compliteID);
                                dbMsg = dbMsg + "は" + delPosition + "番目";
                                if (delPosition < 0) {
                                    images = [];
                                } else {
                                    images = images.replace(compliteID, '');                //文字列になっているので置き換え処理
                                }
                            }
                        }
                    }
                } else {
                    images = [];
                }
            } else {
                images = [];
            }
            dbMsg = dbMsg + ">images>" + images.toLocaleString() + images.length + "文字";
            if (0 < images.length) {
                localStorage.setItem("all-keys", images);                   //JSON.stringify('[' + images + ']')
            } else {
                localStorage.setItem("all-keys", null);                   //JSON.stringify('[' + images + ']'
            }
            photAria = [];
            // if (debug_now) {
            //     delElement("testCa2");
            //     delElement("testCa1");
            // }
            // }
            dbMsg = dbMsg + ":" + tStamp();
            myLog(dbMsg);
            dataQueueing();                //dataQueueingStart();
            // return isStock;                 //呼び出し元に
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；';
            myReload(dbMsg);
        }
    }

    function dellElement(netxId, parent, rowPosition, colPosition) {
        var tag = "[slide.dellElement]";
        var dbMsg = tag + netxId + ",C" + colPosition;
        try {
            if (document.getElementById(netxId)) {
                dbMsg = dbMsg + "で" + netxId + "を削除";
                var aNode = document.getElementById(netxId);
                aNode.parentNode.removeChild(aNode);
            }
            if (colPosition < colCenter) { //右側
                netxId = "R" + rowPosition + "C3right";
                var parentOj = document.getElementById("newimg_div");
                if (document.getElementById(netxId)) {
                    dbMsg = dbMsg + "で" + netxId + "を削除";
                    var aNode = document.getElementById(netxId);
                    aNode.parentNode.removeChild(aNode);
                }
            }
        } catch (e) { }
        myLog(dbMsg);
    }

    function dellAllElement(parent, chaild) {
        var tag = "[slide.dellAllElement]";
        var dbMsg = tag + parent;
        try {
            var parentOj = document.getElementById(parent);
            while (parentOj.lastElementChild) { //消せなかったエレメントを
                dbMsg = dbMsg + ",残りの子エレメント=" + parentOj.lastElementChild.id;
                if (-1 < parentOj.lastElementChild.id.indexOf(chaild)) {
                    parentOj.removeChild(parentOj.lastElementChild); //削除
                }
            }

        } catch (e) { }
        myLog(dbMsg);
    }

    ///2312////////////////////////////////////////////////////////////////////////////////marri-slide.jsから抜粋したアニメーション実行部分////
    /**
     * 到着アニメに使用；ver2.0からはimgタグと置き換えてStockアニメーションでも使用する最上層Canvas
     * 指定されたURLの画像をnew_phot_ariaを複製し、幅もしくは高さいっぱいに描画
     * @param {URL} imgSrc 指定された画像のurl
     * @param {int} sNo 描画後の処理指定番号；末尾switch文のcaseに無い番号を指定すれば無効
     * @return {Context} ctx: newImg_ctx
     * @return {Context} iObj: newImg_obj
     * @return {int} scale:描画後の縮小率。 元scale_xy
     * @return {int} x:描画後のx座標。 元 newImg_shit_x
     * @return {int} y:描画後のx座標。 元 newImg_shit_y};
     * */
    function caDraw(imgSrc, nId, sNo) {
        var dbMsg = "[caDraw]";
        try {
            var cyouhen, tanpen;
            sinarioNo = sNo;                //arrival.js
            parentOj = document.getElementById('newimg_div');
            dbMsg = dbMsg + ",parentOj=" + parentOj;
            if (parentOj == null) {
                myLog(dbMsg);
                return;
            }
            dbMsg = dbMsg + "src=" + imgSrc;
            winW = $(window).width();
            winH = $(window).height(); //タイトルバー分？加算
            dbMsg = dbMsg + "[window;" + winW + "×" + winH + "]" + nId;
            var netxId = "canvas" + nId;
            if (document.getElementById(netxId)) {
                dbMsg = dbMsg + "既存の" + netxId + "を削除";
                //       myLog(dbMsg);
                var aNode = document.getElementById(netxId);
                aNode.parentNode.removeChild(aNode);
            }
            var newImg_canvas = document.createElement("canvas"); //var newImg_canvas = orgCanvas.cloneNode(true); // 要素を複製 子孫ノードも複製する場合は true 、 node のみを複製する場合は false
            parentOj.appendChild(newImg_canvas); // 親ノードの末尾にクローンノードを追加            
            newImg_canvas.setAttribute("id", netxId); //       newImg_canvas.id = "canvas" + Nid; // クローンノードのID名を付け替え
            dbMsg = dbMsg + "追加したエレメント" + newImg_canvas.id;
            newImg_canvas.setAttribute("width", winW + 'px');
            newImg_canvas.setAttribute("height", winH + 'px');
            newImg_canvas.setAttribute("display", 'inline-block');
            newImg_canvas.setAttribute("position", 'absolute');       // ☆   $("#" + newImg_canvas.id).attrが効かない
            newImg_ctx = newImg_canvas.getContext('2d'); //☆ページロード直後は非表示なのでサイズプロパティーは取れない
            var rStr = "ご利用のブラウザはスライドショーを";
            if (!newImg_canvas || !newImg_ctx) {
                rStr = rStr + "ご利用頂けません。別のブラウザでお試し下さい。";
                dbMsg = dbMsg + rStr;
                alert(rStr);
                return false;
            }
            var newImg_obj = new Image(); // Imageオブジェクトを生成
            newImg_obj.src = imgSrc; //オブジェクトにデータの読み込み
            myLog(dbMsg);
            newImg_obj.onload = function () {
                dbMsg = dbMsg + "\n[slidenew.index.caDraw.onload]";
                var scale_newImg, x_nIs, y_nIs; //☆onloadから戻り値に渡す
                var nWidth = newImg_obj.naturalWidth; // 画像の元サイズ
                var nHeight = newImg_obj.naturalHeight; //width() / height()でも[810×1080]、
                dbMsg = dbMsg + "、1295;渡されたイメージ[" + nWidth + "×" + nHeight + "]"; //イメージ[874×621]
                //     myLog(dbMsg);
                var scale_x = nWidth / winW; // aria_w / newImg_w / 4;
                var scale_y = nHeight / winH; // = aria_h / newImg_h / 4;
                dbMsg = dbMsg + " , scale_x=" + scale_x + ",scale_y" + scale_y; //、scale_x=1.0480549199084668,scale_y1.5152979066022545
                scale_newImg = scale_x;
                if (scale_y < scale_x) {
                    scale_newImg = scale_y;
                }
                dbMsg = dbMsg + "、スケール=" + scale_newImg; //スケール=1.5152979066022545
                var newImg_resize_w = nWidth * scale_newImg;
                var newImg_resize_h = nHeight * scale_newImg; //チャンバス内の描画領域
                cyouhen = newImg_resize_w;
                tanpen = newImg_resize_h;
                if (newImg_resize_w < newImg_resize_h) {
                    cyouhen = newImg_resize_h;
                    tanpen = newImg_resize_w;
                }
                dbMsg = dbMsg + ",>リサイズ>[" + newImg_resize_w + "×" + newImg_resize_h + "]";
                x_nIs = (winW - newImg_resize_w) / 2; //phot_ctx_w - newImg_resize_w;
                dbMsg = dbMsg + "、シフト(" + x_nIs;
                y_nIs = (winH - newImg_resize_h); // phot_ctx_h - newImg_resize_h;                  // Math.subtract(phot_ctx_h , newImg_resize_h);
                dbMsg = dbMsg + "," + y_nIs;
                var imgObj = { ctx: newImg_ctx, iObj: newImg_obj, scale: scale_newImg, x: x_nIs, y: y_nIs };
                dbMsg = dbMsg + "、1336;戻り値；scale=" + imgObj.scale_newImg + "%(" + imgObj.x_nIs + "," + imgObj.y_nIs + ")ctx=" + newImg_ctx.canvas.id + ",iObj=" + newImg_obj;
                dbMsg = dbMsg + ")sinarioNo=" + sinarioNo;
                switch (sinarioNo) {
                    case 1:
                        var lsStr = [];
                        lsStr = JSON.parse(localStorage.getItem("update-keys"));
                        dbMsg = dbMsg + ",localStorage.update-key.=" + lsStr + "中" + nId;
                        myLog(dbMsg);
                        popNewImages2(lsStr, nId);

                        newArrivals(imgSrc, imgObj); //到着して手前から奥へ飛行
                        break;
                    case 2:
                        caB2f(imgObj, 1, 0); //奥手からZoomIn
                        break;
                }
                myLog(dbMsg);
                return imgObj;
            }                                                                                       //onload

            newImg_obj.onerror = function () {                                         //2016/11/18;画像が読み込めなければ
                dbMsg = dbMsg + "\n[slidenew.index.caDraw.onerror]";
                myLog(dbMsg);
                return false;
            }
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；';
            myLog(dbMsg);
        }

    }                                         //新着用Canvasへの書き込み開始

    /**
     * ctxの実質描画 ;全体を消去して新規描画
     * @param {Contex} ctx 描画するキャンバスのコンテキスト
     * @param {Object} iObj 描画するイメージ
     * @param {int} targetX 描画を開始するx座標
     * @param {int} targetY 描画を開始するy座標
     * @param {int} targetW 描画する画像の幅
     * @param {int} targetH 描画する画像の高さ
     * */
    function reDrawiNewImg(ctx, iObj, targetX, targetY, targetW, targetH) {
        var tag = "[reDrawiNewImg]";
        try {
            var dbMsg = tag + ",target(" + targetX + " , " + targetY + ")[" + targetW + "×" + targetH + "]";
            dbMsg = dbMsg + ",ctx.canvas[" + ctx.canvas.width + "×" + ctx.canvas.height + "]";
            ctx.clearRect(-winW, -winH, winW * 2, winH * 2); //×ctx.canvas.width, ctx.canvas.heigh
            ctx.drawImage(iObj, targetX, targetY, targetW, targetH); //書き込み
            dbMsg = dbMsg + ",globalAlpha=" + ctx.globalAlpha;
            //     myLog(dbMsg);
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；';
            myReload(dbMsg);
        }
        return ctx;
    }                                               //新着用Canvasの書換え

    /**
     * 現在の透明度を読み取り透過減量
     * ※使用前に ctx.globalAlpha = 0; で透明化してスタート
     * @param {float} increase:透過率の増分値：適量は0.01～0.1
     * @param {Context} ctx;対象とするcanvasのコンテキスト
     * @param {Object} iObj;描画したイメージデータ
     * @param {int} targetX;再描画範囲の開始x座標
     * @param {int} targetY;再描画範囲の開始y座標
     * @param {int} targetW;再描画範囲の幅
     * @param {int} targetH;再描画範囲の高さ
     * @return {float} 終了後の透過率
     * */
    function caFadeIn(increase, ctx, iObj, targetX, targetY, targetW, targetH) {
        var tag = "[caFadeIn]";
        try {
            //        dbMsg = dbMsg + ">>(" + newImg_shit_x + "," + newImg_shit_y + ")";
            dbMsg = tag + "globalAlpha=" + ctx.globalAlpha;
            if ((1 - increase - 0.01) < ctx.globalAlpha) {                   //0.05秒×100/5
                ctx.globalAlpha = 1.0; //☆浮動小数になっているので整数が加算されなかった
                dbMsg = dbMsg + "----feedIn終了----";
            } else {
                ctx.globalAlpha += increase;
                reDrawiNewImg(ctx, iObj, targetX, targetY, targetW, targetH);
            }
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；';
            myReload(dbMsg);
        }
        return ctx.globalAlpha;
    }                                           // 登場時のフェードイン

    function caFadeOut(ctx, iObj, targetX, targetY, targetW, targetH) {
        var tag = "[caFadeOut]";
        try {
            dbMsg = tag + "globalAlpha=" + ctx.globalAlpha;
            if (ctx.globalAlpha < 0.1) {                   //0.05秒×100/5
                ctx.globalAlpha = 0; //☆浮動小数になっているので整数が加算されなかった
                dbMsg = dbMsg + "----feedIn終了----";
            } else {
                ctx.globalAlpha -= 0.05;
                ctx = reDrawiNewImg(ctx, iObj, targetX, targetY, targetW, targetH);
            }
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；';
            myReload(dbMsg);
        }
        return ctx;
    }
    //　/////////////////////////////////////////////////////////////　//
    function makeLastCooki(lastMsg) {
        var tag = "[makeLastCooki]";
        var dbMsg = tag + "呼び出し元＝" + lastMsg;
        try {
            if (lastMsg.match("エラー")) {
                $.cookie("slideshow.err_msg", lastMsg);
            }
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；' + e;
            myLog(dbMsg);
            window.location.reload(true);
        }
    }
    ////////////////////////////////////////////////////////////////////
    //背景設定[marri-slide-wall.js]//////////////////////////////////////////// 
    //        var ceremonies_slide_bg; //☆*1で演算して数値化
    var nowColor = '#000000';     //document.body.style.background;
    var efectOj; //efectCanvasの親ノード
    var effectTimer; //エフェクトのタイマースレッド
    var now_setting = false;
    var b_anime = false;
    var titolBottom = 0;
    var isVideo = false;
    var my_canvas, ctx;
    var img_w, img_h, img_obj;
    var aria_w, aria_h;
    var ctx_w, ctx_h;
    var offset_top, offset_left;
    var offset_width, offset_height;
    var cyouhen, tanpen;
    var x, y, relX, relY, objX, objY;

    /**
     * 式場設定・スライドショー・背景設定で指定された背景の反映
    * */
    function bgWall(winW, winH) {
        var dbMsg = "[bgWall]";
        try {
            dbMsg = dbMsg + "win[" + winW + "×" + winH + "]";   // clone.width = winW + 'px';       // clone.height = (winH + 30) + 'px';                //'100%';
            dbMsg = dbMsg + ",ceremonies_slide_bg= " + ceremonies_slide_bg;
            if (!isReload) {
                if (ceremonies_slide_bg == '2') {
                    $('#canvas_aria').css({ 'display': 'none' });
                    // document.fgColor = "#000000";
                } else {
                    $('#bg_video').css({ 'display': 'none' });
                }

                if (ceremonies_slide_bg == '0' || ceremonies_slide_bg == '1') {
                    dbMsg = dbMsg + ":オリジナル壁紙"
                    img_obj = null;
                    wallDraw(b_bgv, winW, winH); //キャンバスに静止画読み込み
                } else if (ceremonies_slide_bg == 2) {
                    dbMsg = dbMsg + ":marri-shareムービー"
                    haikeiHenkou(b_bgv);
                } else {
                    dbMsg = dbMsg + ":単色"
                    setBGColor(ceremonies_slide_bg);

                }
                dbMsg = dbMsg + "振り分け終了";
                // if (useBGAnime) {
                effectInit();
                // } else {
                //     mainLoopStart() //スライドショースタート
                // }
            }
            // myLog(dbMsg);
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；' + e;
            myReload(dbMsg);
        }
    }                                               //指定された壁紙を設定,effectInitを経てストックループスタート

    /**
     * 壁代わりの着色背景エレメントを作成する
     * @param {*} nowColor 
     */
    function setBGColor(nowColor) {                        //http://www5e.biglobe.ne.jp/access_r/hp/javascript/js_018.html
        var dbMsg = "[setBGColor]" + nowColor + "で";
        $('#bg_video').css({ 'display': 'none' }); //main.cssの対策 
        // $('#canvas_bace').css({ 'display': 'inline-block' }); //main.cssの対策 
        var boxes = document.getElementById("canvas_bace");     //要素を取得             canvas_aria
        if (document.getElementById('colorWall')) {
            boxes.removeChild(document.getElementById('colorWall'));
        }
        var clone = boxes.firstElementChild.cloneNode(true);      //「boxes」の要素の先頭にある子要素を複製（コピー）
        clone.id = "colorWall";
        clone.style.backgroundColor = nowColor;
        clone.style.width = '110vw';
        clone.style.height = '110vh';
        clone.style.margin = '-25px';               //-10では上辺に隙間が残る
        boxes.appendChild(clone);                                   //「boxes」の要素の最後尾に複製した要素を追加
        var clone = document.getElementById("colorWall");
        dbMsg = dbMsg + "," + clone.id + "作成";
        // myLog(dbMsg);
    }

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

    var wallCTX
    function wallDraw(file_name, winW, winH) {
        var dbMsg = "[wallDraw]";
        var boxes = document.getElementById("canvas_bace");     //親要素を取得             canvas_aria
        dbMsg = dbMsg + ",canvasWall=" + document.getElementById('canvasWall');
        if (document.getElementById('canvasWall')) {
            boxes.removeChild(document.getElementById('canvasWall'));
        }
        var clone = boxes.firstElementChild.cloneNode(true);      //「boxes」の要素の先頭にある子要素を複製（コピー）
        clone.id = "canvasWall";
        dbMsg = dbMsg + "win[" + winW + "×" + winH + "]";   // clone.width = winW + 'px';       // clone.height = (winH + 30) + 'px';                //'100%';
        if (winW == undefined) {
            winW = $(window).width();
            winH = $(window).height();
            dbMsg = dbMsg + ">>[" + winW + "×" + winH + "]";   // clone.width = winW + 'px';       // clone.height = (winH + 30) + 'px';                //'100%';
        }
        clone.style.width = (winW + 30) + 'px';          //'100%';
        clone.style.height = (winH + 30) + 'px';                //'100%';
        boxes.appendChild(clone);
        // $('#canvasWall')
        $('#canvasWall').attr("width", (winW + 30) + 'px').attr("height", (winH + 30) + 'px');//タイトルバー分？加算    .css({'width': 100 + '%'}).css({'height': 100 + '%'})では変形発生
        myLog(dbMsg);

        my_canvas = document.getElementById('canvasWall');
        wallCTX = my_canvas.getContext('2d');
        wallCTX.clearRect(0, 0, my_canvas.width, my_canvas.height);

        dbMsg = dbMsg + ",my_canvas" + my_canvas + ",wallCTX=" + wallCTX;
        var rStr = "ご利用のブラウザは画像編集機能を";
        if (!my_canvas || !wallCTX) {
            rStr = rStr + "ご利用頂けません。最新のGoogle Chromeをご利用頂くか、ペイントツールで加工してから選択してください。";
            alert(rStr);
            return false;
        } else {
            rStr = rStr + "ご利用頂けます。\n編集するファイルをアップロードして下さい。";
            $('.moto_info').text(rStr);
        }
        if (ceremonies_slide_bg != 2) {                        //ムービーでなければ
            $('#canvas_bace').css("display", "inline-block"); //背景Canvasを表示
            shit_x = 0;
            shit_ｙ = 0;
            resize_w = winW;
            resize_h = winH; //チャンバス内の描画領域
        }
        img_obj = new Image(); // Imageオブジェクトを生成 
        img_obj.src = file_name; //オブジェクトにデータの読み込み
        //    myLog(dbMsg);
        img_obj.onload = function () {
            dbMsg = dbMsg + "\n[wallDraw.onload]";
            $('#canvas_bace').css("display", "inline-block");
            img_w = img_obj.naturalWidth; // 画像のサイズ
            img_h = img_obj.naturalHeight; //width() / height()でも[810×1080]、
            dbMsg = dbMsg + "、イメージ[" + img_w + "×" + img_h + "]"; //イメージ[874×621]
            aria_w = $('#canvasWall').width();
            aria_h = $('#canvasWall').height();
            dbMsg = dbMsg + " , エリア[" + aria_w + "×" + aria_h + "]"; //エリア[916×941]
            var scale_x = aria_w / img_w;       //img_w / aria_w;   //
            var scale_y = aria_h / img_h;       //img_h / aria_h;       //
            dbMsg = dbMsg + " , scale_x=" + scale_x + ",scale_y=" + scale_y; //、scale_x=1.0480549199084668,scale_y1.5152979066022545
            scale_xy = scale_x;
            if (scale_x < scale_y) {
                scale_xy = scale_y;
            }
            dbMsg = dbMsg + "、スケール=" + scale_xy;
            cyouhen = img_w;
            tanpen = img_h;
            if (img_w < img_h) {
                cyouhen = img_h;
                tanpen = img_w;
                dbMsg = dbMsg + "縦長"; //読み込み前は高さが取れない
            }
            ctx_w = wallCTX.canvas.width; //  canvas#canvasWall
            ctx_h = wallCTX.canvas.height;
            dbMsg = dbMsg + "読み込み前[" + ctx_w + "×" + ctx_h + "]"; //読み込み前[916×941]=offsetWidth=clientWidth=scroll 
            resize_w = img_w * scale_xy;
            resize_h = img_h * scale_xy; //チャンバス内の描画領域
            dbMsg = dbMsg + ",>リサイズ>[" + resize_w + "×" + resize_h + "]";
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
            dbMsg = dbMsg + ">書込み>(" + shit_x + "," + shit_ｙ + ")[" + resize_w + "×" + resize_h + "]";
            wallCTX.drawImage(img_obj, shit_x, shit_ｙ, resize_w, resize_h); //          
            dbMsg = dbMsg + ",resize_now=" + resize_now; //シフト(-408.37037037037044,0)
            document.getElementById("canvasWall").style.opacity = 0.0;
            startFadeIn(wallCTX);
            myLog(dbMsg);
        }                                                                                       //onload
        img_obj.onerror = function () {                                         //2016/11/18;画像が読み込めなければ
            dbMsg = dbMsg + "\n[slidenew.index.onerror]";
            haikeiHenkou('/files/background.mp4'); //背景をビデオに変更
        }
    }

    //////////////////////////////////
    function haikeiHenkou(set_val) {
        var dbMsg = "[Slidenew.index.ctp.haikeiHenkou;背景変更]" + set_val;
        var target = document.getElementById("bg_video");
        var b_src = target.src;
        dbMsg = dbMsg + "," + b_src + "から変更";
        //     myLog(target);
        if (set_val.match('mp4')) {
            target.src = set_val;
            $("#bg_video").fadeTo(2000, 1.0, function () { }); //duration;フェードするアニメーション時間  , opacity;変化させる不透明度を0～1の値  [,easing;アニメーションの変化の種類],callback
            isVideo = true;
        } else {                     /// if (set_val.match('pic')) 
            $('#bg_video').css({ "display": "none" });
            wallDraw(set_val, winW, winH); //キャンバスに静止画読み込み
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
    function showImage(ctx) {
        var tag = "[showImage]";
        var dbMsg = tag;
        ctx.clearRect(0, 0, my_canvas.width, my_canvas.height);
        dbMsg = dbMsg + "[" + resize_w + "×" + resize_h + "]";
        myLog(dbMsg);
        ctx.drawImage(img_obj, shit_x, shit_ｙ, resize_w, resize_h); //書き込み
    }

    function startFadeIn(ctx) {
        var tag = "[startFadeIn]";
        var dbMsg = tag;
        stopAnimation();
        dbMsg = dbMsg + "globalAlpha=" + ctx.globalAlpha;
        fadeTimer = setInterval(function () {
            var opac = document.getElementById("canvasWall").style.opacity * 1;
            dbMsg = tag + ",opacity=" + opac;
            if (0.98 < opac) {                   //0.05秒×100 0.98 < ctx.globalAlpha
                opac = 1.0;
                stopAnimation();
            } else {
                opac += 0.1;
            }
            document.getElementById("canvasWall").style.opacity = opac;
            dbMsg = dbMsg + ">>" + opac;
            // myLog(dbMsg);
        }, 50); // 50ミリ秒ごとにキャンバスを再描画
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
    //背景設定//wall//////////////////////////////////////////////////////// 
    //花弁アニメーション////効果/////////////////////////////////////////
    var useBGAnime = true;
    var photAria = []; //回避領域
    var photID = -1, photX = photY = photZ = photW = photH = photT = 1; //エフェクトに渡す逐次の座標情報
    var effectCanvas;
    var effectContex;
    var SAKURA_COUNT = SAKURA_COUNT_DEFAULT = 600; //出現数の上限(FHDでの個数；画面サイズに応じて増減)　300＞20170415＞600
    var SAKURA_COUNT_Arrival = SAKURA_COUNT * 2; //新着時；風に流れてフレームアウトするオブジェクトの出現数
    var effctNowID = 0; //次のエフェクト番号
    var arrivalID = -1; //新着への切り替わり番号
    var IMG_SIZE = 30; //drawImageの初期サイズ；w,h org=15
    var endScale = 4.0; //最終倍率
    var _sakuras = []; //エフェクトオブジェクト個々のパラメータ配列
    var windRoots = []; //風の発生源、org;マウスポイント>>写真の位置？
    var effectImgS = []; //エフェクトオブジェクトを格納する配列；要素数はSAKURA_COUNTまで ; effectInitで初期化
    var effectFRate = 20;   //30＞20170415＞20
    var isStayEnd = true; //画像のアニメーション静止終了;trueは静止中；回避エリアの拡大/縮小に使用

    /**
     * エフェクト描画を消去し、再生成。
     * 呼び出し  bgWall終了後と$(window).resize [$(window).loadから継続して呼び出されるので、この一か所のみ]
     * */
    function effectInit() {
        var dbMsg = "[effect.effectInit]";
        try {
            efffectStop();
            var netxId = "effectCa";
            dbMsg = dbMsg + ",netxId=" + netxId;
            if (document.getElementById(netxId)) {
                dbMsg = dbMsg + "既存の" + netxId + "を削除";
                var delNode = document.getElementById(netxId);
                if (delNode) {
                    delNode.parentNode.removeChild(delNode); //特定の子要素削除
                }
            }

            effectCanvas = document.createElement("canvas");
            dbMsg = dbMsg + ",efectCanvas=" + effectCanvas;
            efectOj = document.getElementById("efect_div"); //efectCanvasの親ノード
            dbMsg = dbMsg + ",efectCanvasの親ノード=" + efectOj;
            efectOj.appendChild(effectCanvas); // 親ノードの末尾にクローンノードを追加
            effectCanvas.setAttribute("id", netxId); //       newImg_canvas.id = "canvas" + Nid; // クローンノードのID名を付け替え
            dbMsg = dbMsg + ",win[" + winW + "×" + winH + "]";
            //     $("#" + effectCanvas.id).css({ 'width': '100vw' }).css({ 'height': '100vh' })だと比率がすべて狂う  
            $("#" + effectCanvas.id).attr("width", (winW + 40) + "px").attr("height", (winH + 40) + "px").css({ 'margin-right': '20px' }).css({ 'display': 'inline' }).css({ 'position': 'fixed' }).css({ 'z-index': '10' }); //.css({ 'margin-top': '-20px' }) css({'width':'100%'})効かず               main.cssの対策   .attr("background-color", 'transparent')
            dbMsg = dbMsg + "追加したエレメント" + effectCanvas.id + ",[" + effectCanvas.width + "×" + effectCanvas.height + "]";
            effectContex = effectCanvas.getContext('2d'); //☆ページロード直後は非表示なのでサイズプロパティーは取れない
            dbMsg = dbMsg + ">effectContex>" + effectContex;
            var effImg = new Image();
            effImg.src = '/img/slide/light_mdl_blue.png';//image_url00;           gerbera_or
            dbMsg = dbMsg + ",IMAGE_URL=" + effImg.src;
            // myLog(dbMsg);
            effImg.onload = function () {
                var tag = "[effect.onload]";
                var dbMsg = tag + ",effectFRate=" + effectFRate;
                stopNIAnimation(effectTArray);              //effect
                effectTArray.push(effectTimer = setInterval(function () {          //org; setInterval(function () {
                    var tag = "[effectInit.onload.setInterval]";
                    var dbMsg = tag;
                    effectContex.clearRect(0, 0, winW * 1.1, winH * 1.1); //画面クリア   org;  _ctx.fillStyle = "rgba(0, 0, 0, 0.9)";で黒く塗り潰し
                    // rewitePhotAria(); //Stock時はこのループを利用して回避エリアを更新していた
                    var len = _sakuras.length;
                    for (var i = 0; i < len; ++i) {
                        dbMsg = tag + i + '/' + len + ')';
                        _sakuras[i] = effectFall(_sakuras[i]); //生成されたオブジェクトに次回描画の座標や大きさのパラメータを与える
                    }
                    removeEffectObje(); //_sakura配列要素の削除;表示エリアからはみ出したものを配列から削除
                }, 1000 / effectFRate)); //org;1000/60  effectPlay();                  //  effectImg.onload = play;
                effectImgS = new Array();
                var num = effectImgS.push(effImg);
                effectImgS = effectImgMake(effectImgS); //登場させる花の配列を作る
                SAKURA_COUNT = SAKURA_COUNT * winW / 1920; //オブジェクト数を戻す
                addEffectObje(); //_sakura配列要素の生成;(0,0)～(winW, winH;)の範囲に0～150%の大きさでランダムに傾いた花を生成
                dbMsg = dbMsg + "," + effectImgS.length + "番目の花を登録";
                dbMsg = dbMsg + ",isStart=" + isStart;
                if (!isStart) {             //まだスタートしていなければ
                    mainLoopStart() //スライドショースタート
                }
                //            myLog(dbMsg);
            }
            effImg.onerror = function () {                                         //2016/11/18;画像が読み込めなければ
                var dbMsg = dbMsg + "[effect.onerror]";
                makeLastCooki(dbMsg);
                return false;
            }
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；' + e;
            makeLastCooki(dbMsg);
        }
    }

    /**
     * タイマーリセット
     * effectInit前にスレッドの有無を確認して停止
     * */
    function efffectStop() {
        if (effectTimer) {                                                          //let'sNote;20170308
            clearInterval(effectTimer);
            effectTimer = null;
        }
    }

    /**
     * png画像からImageオブジェクトを生成
     * gerbera_marri-slide_orangeはeffectInitで初期値に設定
     * 
     * */
    function effectImgMake(effectImgS) {
        var tag = "[effect.effectImgMake]";
        var dbMsg = tag;
        try {
            for (var i = 0; i < 3; ++i) {
                var IMAGE_URL = '/img/slide/light_mdl_pink.png';//gerbera_pu
                switch (i) {
                    case 1:
                        IMAGE_URL = '/img/slide/light_mdl_white.png';//lily_wh
                        break;
                    case 2:
                        IMAGE_URL = '/img/slide/light_mdl_yellow.png';//lily_ye , rose_pi , rose_re
                        break;
                }
                var eImg = new Image();
                eImg.src = IMAGE_URL;
                var num = effectImgS.push(eImg);
                dbMsg = dbMsg + "," + effectImgS.length + "つ目の花を登録=" + IMAGE_URL;
            }
            // myLog(dbMsg);
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；' + e;
            makeLastCooki(dbMsg);
        }
        return effectImgS;
    }                      //登場させる花の配列を作る

    /**
     * 生成されたオブジェクトに再描画毎の座標や大きさのパラメータを与える
     * effectDraw　から_sakurasの枚数分、呼ばれる
     * _sakuras[]にrotationX～Z,
     * 移動量は.rest/10か1()
     * 呼び出し元　effectInit
     * */
    function effectFall(sakura) {
        var tag = "[effect.effectFall]";
        var dbMsg = tag;
        try {
            var idouMin = 1;
            sakura.lifeCount++; //生成されて書き直された回数
            dbMsg = dbMsg + "[" + sakura._id + ";arrival=" + arrivalID + "]" + sakura.lifeCount + "回目(" + sakura.x + "," + sakura.y + "," + sakura.z + ")";
            //回転///////////////////////////////////////////20170415;回転停止
            // if (sakura.rotationX < -80 || -20 < sakura.rotationX) {
            //     sakura.rotationVx = -1 * sakura.rotationVx; //-0.5～+0.5 
            // }
            // sakura.rotationX += sakura.rotationVx; // + Math.random() * 2;
            // if (sakura.rotationY < -80 || -20 < sakura.rotationY) {
            //     sakura.rotationVy = -1 * sakura.rotationVy;
            // }
            // sakura.rotationY += sakura.rotationVy; // + Math.random() * 2;
            // sakura.rotationZ += sakura.rotationVz; //x平面上の動き   sakura.rotationVz + Math.random() * 1;   
            ///////////////////////////////////////////回転//

            dbMsg = dbMsg + ">>(" + sakura.x + "," + sakura.y + "," + sakura.z + ")";
            var newImg_w = (0 - sakura.z) * Math.tan(vpPer) + IMG_SIZE; //http://keisan.casio.jp/exec/system/1161228779
            dbMsg = dbMsg + ",newImg_w=" + newImg_w;
            var scale = sakura.scaleX = sakura.scaleY = newImg_w / IMG_SIZE; // var scale = sakura.scaleX + 0.001; //基本的にサイズはづつ増加
            dbMsg = dbMsg + ",scale=" + sakura.scaleX * 100 + "%";
            //αの揺らぎ//////////////////////////////////////////////////////////////////////////////
            dbMsg = dbMsg + ",alpha=" + sakura.alpha;
            if (sakura.lifeCount < 30 && sakura.alpha < 1.0) {
                sakura.alpha = sakura.alpha + 0.1 + Math.random() / 10;
                if (0.98 < sakura.alpha) {
                    dbMsg = dbMsg + ">登場>" + sakura.alpha; //lifeCount = 17～26
                    //           myLog(dbMsg);
                    sakura.alufaPoint += 20;
                    sakura.alpha = 1.0;
                }
            } else if (50 < sakura.lifeCount && sakura.lifeCount < 150 && sakura.alufaPoint < sakura.lifeCount) {             //&& 0.5 < sakura.alpha  (40 < sakura.lifeCount && sakura.lifeCount < 80)
                //全体の半分だけ減光させ一度に暗くさせない
                sakura.alpha = sakura.alpha - Math.random() / 10;
                if (sakura.alpha < 0.55) {
                    dbMsg = dbMsg + ">減光>" + sakura.alpha; //lifeCount =53～ 79
                    //         myLog(dbMsg);
                    sakura.alpha = 0.5;
                    sakura.alufaPoint += 20;
                    sakura.lifeEnd = sakura.lifeCount + 50;
                }
            } else if (70 < sakura.lifeCount && sakura.lifeCount < 250 && sakura.alufaPoint < sakura.lifeCount) {                  //(120 < sakura.lifeCount && sakura.lifeCount < 180)   && sakura.alpha < 1.0
                sakura.alpha += 0.02; //sakura.alpha + Math.random() / 100;
                if (0.95 < sakura.alpha) {
                    dbMsg = dbMsg + ">再増光>" + sakura.alpha;
                    sakura.alpha = 1.0;
                    sakura.alufaPoint += 20;
                    sakura.lifeEnd = sakura.lifeCount + 50;
                }
            } else if (sakura.alufaPoint < sakura.lifeCount || (endScale - 1) < sakura.scaleX) {              //((endScale - 1) < sakura.scaleX) || 200 < sakura.lifeCount && 0.0 < sakura.alpha
                sakura.alpha = sakura.alpha * 0.90;
                if (sakura.alpha < 0.05) {
                    dbMsg = dbMsg + ">消失>" + sakura.alpha; //lifeCount =206～ 208
                    //        myLog(dbMsg);
                    sakura.alpha = 0;
                    sakura.lifeEnd = sakura.lifeCount + 10;
                }
            }

            //////////////////////////////////////////////////////////////////////////////αの揺らぎ//
            dbMsg = dbMsg + ",移動量(" + sakura.vx + " , " + sakura.vy + " , " + sakura.vz + ")";
            var testX = sakura.x + sakura.vx;
            var testY = sakura.y + sakura.vy;
            var testZ = sakura.z + sakura.vz;
            dbMsg = dbMsg + "元座標sakura(" + testX + " , " + testY + " , " + testZ + ")";
            var safePoint = setSafePosition(testX, testY, testZ); //回避エリア外ならそのままの座標が戻る☆zは範囲判定にのみ使う
            if (testX != safePoint.x || testY != safePoint.y) {           //x,y各座標の回避する距離が返されたら
                dbMsg = dbMsg + "回避先(" + safePoint.x + " , " + safePoint.y + " , " + safePoint.z + ")";
                var avoidanceX = (safePoint.x - testX) * (1 + Math.random()); //回避量 
                var avoidanceY = (safePoint.y - testY) * (1 + Math.random());
                dbMsg = dbMsg + "移動距離[" + avoidanceX + " , " + avoidanceY + "]";
                if (isArrival) {                                              //新着の軌道移動中は軌跡を残す；　isArrival01
                    avoidanceX = avoidanceX * 12; //回避量；衝突回避    12だと追い付かれてギトギト止まる　8だと飛び上がる
                    avoidanceY = avoidanceY * 12;
                    dbMsg = dbMsg + "加速[" + sakura.vx + " , " + sakura.vy + "]";
                    // if (sakura._id % 9 == 0 && safePoint.x < winW * 0.25 && safePoint.x < winW * 0.75 && safePoint.y < winH * 0.25 && safePoint.y < winH * 0.75) {
                    //     sakura.vz -= 0.1; //10では蹴散らされる
                    // }　　//20170415;大きさは変えない
                    //         myLog(dbMsg);
                } else {                        //Stockなどの通常動作は飛ぶような動きを抑える
                    avoidanceX = avoidanceX / 8;            //回避量；対象の上に載ってゆっくり外へ流す  　　2では遅れながらも回避
                    avoidanceY = avoidanceY / 8;
                }
                if (Math.abs(avoidanceX) < Math.abs(avoidanceY)) {  //移動量が少ない方向へ移動
                    sakura.vx = avoidanceX / effectFRate;
                    sakura.x += sakura.vx;
                } else {
                    sakura.vy = avoidanceY / effectFRate;
                    sakura.y += sakura.vy;
                }
            } else {                  //回避エリア外では減速 
                var fLimit = 0.7;     //減速閾値；0.5では止まって線上に並ぶ,2では表示域外に押し出される 1だと枠外に流出するもの多数
                var lLimit = 0.0005;     //減速閾値；0.005ではカクカク動く個体が出る0.001でも残る
                var speedUp = 1.2;
                var speedDoun = 0.8; //0.5だとカクカクした動きになる 
                dbMsg = dbMsg + "回避領域外；速度(" + sakura.vx;
                if (fLimit < Math.abs(sakura.vx)) {
                    sakura.vx = sakura.vx * speedDoun; //0.5だとカクカクした動きになる 
                    dbMsg = dbMsg + ">超過>" + sakura.vx;
                    //                myLog(dbMsg);
                } else if (Math.abs(sakura.vx) < lLimit) {
                    sakura.vx = sakura.vx * speedUp;
                }
                dbMsg = dbMsg + ",vy;" + sakura.vy;
                if (fLimit < Math.abs(sakura.vy)) {
                    sakura.vy = sakura.vy * speedDoun;
                    dbMsg = dbMsg + ">超過>" + sakura.vy + ")";
                    //                myLog(dbMsg);
                } else if (Math.abs(sakura.vy) < lLimit) {
                    sakura.vy = sakura.vy * speedUp;
                }
                //           var revarceAria = (Math.random() + 0.001) * 0.05;                  //反転エリア
                //            sakura.x += sakura.vx;
                //            if (sakura.x < winW * revarceAria || winW - (winW * revarceAria) < sakura.x) {
                //                sakura.vx = sakura.vx * -0.1;
                //            }
                //            sakura.y += sakura.vy;
                //            if (sakura.y < winH * revarceAria || winH - (winH * revarceAria) < sakura.y) {
                //                sakura.vy = sakura.vy * -0.1;
                //            }
                sakura.x += sakura.vx;
                sakura.y += sakura.vy;
            }
            dbMsg = dbMsg + "速度(" + sakura.vx + " , " + sakura.vy + ")";
            sakura.z += sakura.vz; //原点比例で移動

            dbMsg = dbMsg + ">>(" + sakura.x + "," + sakura.y + "," + sakura.z + ")";
            //                           myLog(dbMsg);
            drawSakuras(sakura);
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；' + e;
            makeLastCooki(dbMsg);;
        }
        return sakura;
    }                                                                           //花弁アニメーションの動き方

    /**
     * 渡されたビットマップを _sakurasの枚数分、個々にcanvas描画する
     * */
    function drawSakuras(sakura) {
        var tag = "[effect.drawSakuras]";
        var dbMsg = tag;
        try {
            dbMsg = tag + ";;" + sakura._id + "/" + _sakuras.length + "枚";
            dbMsg = dbMsg + "sakura(" + sakura.x + " , " + sakura.y + " , " + sakura.z + ")alpha=" + sakura.alpha + "%";
            var dispX = sakura.x; //(sakura.x - 250) / Math.max(sakura.z / 200, 0.001) * 500 / 200 + 250;
            var dispY = sakura.y; //(sakura.y - 250) / Math.max(sakura.z / 200, 0.001) * 500 / 200 + 250;
            dbMsg = dbMsg + "disp(" + dispX + " , " + dispY + ")";
            effectContex.translate(dispX, dispY);
            effectContex.scale(sakura.scaleX, sakura.scaleY);
            effectContex.rotate(sakura.rotationZ * Math.PI / 180);
            effectContex.transform(1, 0, 0, Math.sin(sakura.rotationX * Math.PI / 180), 0, 0);
            effectContex.translate(-dispX, -dispY);
            var wrX = dispX - IMG_SIZE / 2;
            var wrY = dispY - IMG_SIZE / 2
            var imgNo = sakura._id;
            imgNo = sakura._id % effectImgS.length;
            dbMsg = dbMsg + ',imgNo=' + imgNo + '/' + effectImgS.length;
            var effectImg = effectImgS[imgNo];
            if (effectImg) {
                effectContex.globalAlpha = sakura.alpha;
                effectContex.drawImage(effectImg, wrX, wrY, IMG_SIZE, IMG_SIZE);
                effectContex.setTransform(1, 0, 0, 1, 0, 0);
                effectContex.globalAlpha = 1;
            }
        } catch (e) {
            dbMsg = dbMsg + "で" + e;
            makeLastCooki(dbMsg);
        }
    }                                                                          //渡されたビットマップを _sakurasの枚数分、描画する

    //写真の連携////////////////////////////////////////////////////////
    /**
     * 写真表示エリアの取得
     * IDを受け取ってphotAria配列に加える
     * @param {String} id そのエレメントを識別できるID
     * */
    function addPhotAria(id) {                  //エフェクトに渡す写真ID
        var tag = "[effect.addPhotAria]";
        var dbMsg = tag;
        try {
            dbMsg = dbMsg + ",新着=" + isArrival;
            dbMsg = dbMsg + "," + photAria.length + "件有り";
            dbMsg = dbMsg + ",id=" + id;
            id = id.replace('.', '');
            dbMsg = dbMsg + ">>" + id;
            var photParam = {};
            photParam.id = id;
            photAria.push(photParam);
            dbMsg = dbMsg + ">>" + photAria.length + "件目";
            // myLog(dbMsg);
        } catch (e) {
            dbMsg = dbMsg + "で" + e;
            makeLastCooki(dbMsg);
        }
    }                           //写真表示エリアの取得

    function setStockPohotAria(id, tLeft, tTop, tWidth, tHight, tRotate) {                  //ストックループの回避エリア
        var tag = "[effect.setStockPohotAria]";
        var dbMsg = tag + id;
        var photParam = {};
        photParam.id = id;
        photParam.w = tWidth * 1.1;    //  * 1.1では枠内に残る　* 1.2では中心部が空洞化
        photParam.h = tHight * 1.1;    //
        photParam.t = winW; //200;
        photParam.x = tLeft; //ariaX - photParam.w / 2 - photParam.w * 0.002 - IMG_SIZE / 2;
        photParam.y = tTop;               //ariaY - photParam.h / 2 - photParam.h * 0.002 - IMG_SIZE / 2;
        photParam.z = 0;                //photZ; //-100;
        photParam.rotate = tRotate;
        dbMsg = dbMsg + ">>結果(" + photParam.x + "," + photParam.y + "," + photParam.z + ")[" + photParam.w + "×" + photParam.h + "×" + photParam.t + "]" + photParam.rotate + "°";
        photAria.push(photParam); //                        }
        testRect(photParam.x, photParam.y, photParam.w, photParam.h, photParam.rotate, 'orange', 99, 99);
        dbMsg = dbMsg + ">>" + photAria.length + "件目";
        // myLog(dbMsg);
    }

    function rewitePhotAria() {                                                 //新着の回避エリア
        var tag = "[effect.rewitePhotAria]";
        var dbMsg = tag;
        try {
            if (useBGAnime) {
                dbMsg = dbMsg + "," + photAria.length + "件有り";
                if (-1 < photAria.length) {
                    var photParam = {};
                    for (var i = 0; i < photAria.length; i++) {
                        var ariaID = photAria[i].id;
                        dbMsg = dbMsg + ",ariaID=" + ariaID;
                        // if (isArrival == true) {        //登場アニメーション    canvas
                        var chID = photID;
                        dbMsg = dbMsg + ",着信中ID=" + chID;
                        if (ariaID == chID) {
                            removePhotAria(chID); //回避エリアの消去
                            dbMsg = dbMsg + ">>現在(" + photX + "," + photY + "," + photZ + ")[" + photW + "," + photH + "," + photT + "]";
                            photParam = {};
                            photParam.id = chID;
                            photParam.x = photX; //エフェクトに渡す逐次の座標情報
                            photParam.y = photY;
                            if (photZ) {
                                photParam.z = photZ;
                            } else {
                                photParam.z = 0;
                            }
                            photParam.w = photW;
                            photParam.h = photH;
                            if (photT) {
                                photParam.t = photT;
                            } else {
                                photParam.t = photW;
                            }
                            photParam.rotate = 0;
                            dbMsg = dbMsg + ">>結果(" + photParam.x + "," + photParam.y + "," + photParam.z + ")[" + photParam.w + "," + photParam.h + "," + photParam.t + "]";
                            photAria.push(photParam);
                        }
                    }
                    testRect(photParam.x, photParam.y, photParam.w, photParam.h, photParam.rotate, 'orange', 99, 99);
                    dbMsg = dbMsg + ">>" + photAria.length + "件目";
                }
            }
            // myLog(dbMsg);
        } catch (e) {
            dbMsg = dbMsg + "で" + e;
            makeLastCooki(dbMsg);
        }
    }                           //写真表示エリアの取得

    /**
     * 写真エリアの破棄
     * */
    function removePhotAria(id) {                                               //回避エリアの消去
        var tag = "[effect.removePhotAria]";
        var dbMsg = tag;
        try {
            dbMsg = dbMsg + ",回避エリア= " + photAria.length + "件有り";
            if (-1 < photAria.length) {
                //      var bCount = photAria.length;
                for (var i = 0; i < photAria.length; i++) {
                    var retInt = photAria[i].id;
                    if (retInt == id) {
                        dbMsg = dbMsg + ",retInt=" + retInt;
                        var removed = photAria.splice(i, 1);
                        dbMsg = dbMsg + ",removed= " + removed + "," + photAria.length + "件";
                    }
                }
            }
            dbMsg = dbMsg + ",結果 " + photAria.length + "件";
            //      myLog(dbMsg);

            if (debug_now) {
                delElement("testCa2");
                delElement("testCa1");
            }
        } catch (e) {
            dbMsg = dbMsg + "で" + e;
            makeLastCooki(dbMsg);
        }
    }                                    // 写真エリアの破棄

    /**
     * 衝突回避
     * ・花弁の移動時、生成時に個々の花弁に対して回避できる座標を返す
     * ・エリア内なら元座標を返す
     * */
    function setSafePosition(testX, testY, testZ) {
        var tag = "[effect.setSafePosition]";
        var dbMsg = tag;
        dbMsg = dbMsg + "test(" + testX + "," + testY + "," + testZ + ")";
        var vX = testX; //       retX = testX;
        var vY = testY; //retY = testY;
        var vZ = testZ; //retY = testY;
        try {
            if (isStayEnd = true) {           //; //画像のアニメーション静止終了;trueは静止中；回避エリアの拡大/縮小に使用
                if (0 < testX && testX < winW && 0 < testY && testY < winH) {               //表示エリア内
                    var ariaEnd = photAria.length;
                    if (0 < ariaEnd) {                                               //回避すべき写真エリアが無ければ処理不要
                        for (var i = 0; i < ariaEnd; i++) {
                            dbMsg = dbMsg + "\n回避aria(" + i + "/" + ariaEnd + ")";
                            var ariaID = photAria[i].id;
                            dbMsg = dbMsg + "=" + ariaID;
                            var safeAria = 100; //回避範囲//50だと枠内に残る   
                            var motoX = photAria[i].x;
                            var ariaX = motoX - safeAria;
                            var ariaY = photAria[i].y - safeAria;
                            var ariaZ = photAria[i].z;
                            var ariaW = photAria[i].w + safeAria * 2;
                            var ariaH = photAria[i].h + safeAria * 2;
                            var ariaT = photAria[i].t;
                            var ariaDeg = photAria[i].rotate;
                            if (isArrival01 == false) {                                 //登場アニメーションの飛行部分実行中以外は
                                ariaX = ariaX + Math.random() * 20; //一定箇所に集まらないように乱数付与
                                ariaY = ariaY + Math.random() * 20;
                                ariaW = ariaW + Math.random() * 20;
                                ariaH = ariaH + Math.random() * 20; //*10では偏って線上に並んで枠が出来る
                            }
                            dbMsg = dbMsg + "(" + ariaX + "," + ariaY + "," + ariaZ + ")[" + ariaW + "×" + ariaH + "×" + ariaT + "]";
                            var ariaEX = ariaX + ariaW; //回避範囲の終端
                            var ariaEY = ariaY + ariaH;
                            var ariaEZ = ariaZ + ariaT;
                            dbMsg = dbMsg + "～(" + ariaEX + "," + ariaEY + "," + ariaEZ + ")]";
                            if ((ariaX < testX && testX < ariaEX) && (ariaY < testY && testY < ariaEY)) {              //写真エリア内に入って        
                                if (ariaZ < testZ && testZ < ariaEZ) {              //写真エリア内に入って      ariaZ < testZ && testZ < ariaEZ  
                                    vX = ariaX; // - testX;                                 //初期値はエリアの右へ回避      10 - 100 = -90 
                                    if (winW / 2 < testX) {                                 //画面の右半分なら                 testX = 1000 
                                        vX = ariaEX; // - testX;                         //右へ回避                        vX = 1660 
                                    }
                                    if (1 < photAria.length) {
                                        if (winW / 2 < (ariaX + ariaW / 2)) {                                 //エリアが画面の左半分で       ariaEX =960+700=1660
                                            if (testX < ariaEX) {                               //エリア内なら                 testX = 1000 
                                                vX = ariaEX; // - testX;                      //左へ回避                        vX = 1660 
                                            }
                                        } else {                                                  //エリアが画面の右半分で       ariaEX =100+700=800
                                            if ((ariaX + ariaW / 2) < testX) {                  //右エリア内の左側なら                 testX = 1000 
                                                vX = ariaX; // - testX;                      //左へ回避                        vX = 1660 
                                            }
                                        }
                                    }
                                    dbMsg = dbMsg + ",vX=" + vX;
                                    vY = ariaY; //初期値は上へ回避        10 - 100 = -90 
                                    dbMsg = dbMsg + ",vY= " + vY + ">" + ariaDeg + "°,エリア左端=" + motoX;
                                    var katamukiKasan = 0;
                                    if (ariaDeg != 0) {
                                        var katamukiKasan = (testX - motoX) * Math.tan(ariaDeg * (Math.PI / 180));
                                        dbMsg = dbMsg + ",傾き加算=" + katamukiKasan;
                                        vY = vY + katamukiKasan;
                                        dbMsg = dbMsg + ">" + vY;
                                    }
                                    if (ariaY + ariaH / 2 < testY) {                                 //画面の下半分なら　下へ回避       800 - 700 = 100 
                                        vY = ariaEY + katamukiKasan;
                                    }
                                    vZ = ariaZ; //初期値は奥へ回避
                                    dbMsg = dbMsg + ",移動先(" + vX + "," + vY + "," + vZ + ")]";
                                    // myLog(dbMsg);
                                    return { x: vX, y: vY, z: vZ };
                                }
                            }
                        }                   //for (var i = 0; i < ariaEnd; i++)
                    }
                }
            }
        } catch (e) {
            dbMsg = dbMsg + "で" + e;
            makeLastCooki(dbMsg);
        }
        return { x: vX, y: vY, z: vZ };
    }                         //衝突回避；渡された座標が表示エリア内なら回避できる座標を返す

    /**
     * _sakura配列要素の生成;(0,0)～(winW, winH;)の範囲に0～150%の大きさでランダムに傾いた花を生成
     * removeEffectObje, effectInit,から呼ばれる
     * */
    function addEffectObje() {
        var tag = "[effect.addEffectObje]";
        dbMsg = tag + ",isArrival=" + isArrival + ",開始時" + _sakuras.length + "枚";
        try {
            if (isArrival) {                                                        //着信時は
                if (SAKURA_COUNT < SAKURA_COUNT_Arrival) {
                    SAKURA_COUNT = SAKURA_COUNT_Arrival * winW / 1920; //オブジェクト数を増加
                }
            } else {
                var sCOUNT = SAKURA_COUNT_DEFAULT * winW / 1920; //オブジェクト数を戻す
                if (sCOUNT < SAKURA_COUNT) {                          //ストック再生時は
                    SAKURA_COUNT = SAKURA_COUNT_DEFAULT * winW / 1920; //オブジェクト数を戻す
                }
            }
            dbMsg = dbMsg + "/SAKURA_COUNT= " + SAKURA_COUNT;
            while (_sakuras.length < SAKURA_COUNT) {
                var sakura = {};
                sakura._id = effctNowID;
                if (isArrival) {                //新着状態に入ったら
                    if (arrivalID < 0) {
                        arrivalID = effctNowID; //新着への切り替わり番号
                        if (100000 < effctNowID) {
                            effctNowID = 0;
                        }
                    }
                } else {
                    arrivalID = -1;
                }
                effctNowID++; //次のエフェクト番号
                dbMsg = dbMsg + "(" + sakura._id + "/" + _sakuras.length + "枚";
                sakura.lifeCount = Math.random() * 100; //生成されて書き直された回数
                sakura.alufaPoint = sakura.lifeCount + 30 + (Math.random() * 10000) % 100; //次の明度可変ポイント
                sakura.lifeEnd = sakura.alufaPoint + 180;
                sakura.vPoint = (Math.random() * 10000) % 100; //明度可変ポイント
                dbMsg = dbMsg + ",alufaPoint= " + sakura.alufaPoint + " , " + sakura.vPoint;
                if (sakura._id % 20 == 0) {  //5個に一個を
                    sakura.z = 150;         //大きく   (Math.random() - 0.5) * 100 - 100; //50 ～　150
                } else {                    //その他は
                    sakura.z = 60;           //上記の1/4サイズ   (Math.random() - 0.5) * 100;// + 50; //org;50 ～　150
                }
                if (sakura._id % 4 == 0) {
                    if (isArrival) {
                        switch (naPattern) {
                            case 0:                                                     //下から上へ
                                sakura.x = (Math.random() - 0.5) * winW / 4 + winW / 2; //横中心        
                                sakura.y = (Math.random() - 0.5) * winH / 4 + winH * 0.75; //下半分
                                break;
                            case 1:                                                     //下から上へ
                                sakura.x = (Math.random() - 0.5) * winW / 4 + winW * 0.25; //左半分        
                                sakura.y = (Math.random() - 0.5) * winH / 4 + winH / 2; //縦半分
                                break;
                            case 2:                                                     //上から下へ
                                sakura.x = (Math.random() - 0.5) * winW / 4 + winW / 2; //横中心        
                                sakura.y = (Math.random() - 0.5) * winH / 4 + winH * 0.25; //上半分
                                break;
                            case 3:                                                     //左から右へ
                                sakura.x = (Math.random() - 0.5) * winW / 4 + winW * 0.75; //右半分        
                                sakura.y = (Math.random() - 0.5) * winH / 4 + winH / 2; //縦半分
                                break;
                            default:
                                sakura.x = (Math.random() - 0.5) * winW / 4 + photX + photW / 2; //写真中心         
                                sakura.y = (Math.random() - 0.5) * winH / 4 + photY + photH / 2; //
                                break;
                        }
                    } else {
                        sakura.x = Math.random() * winW; //発生領域は表示領域全体        
                        sakura.y = Math.random() * winH; //;0～1*500-500 ≒-499～500                        
                    }
                } else {
                    sakura.x = winW / 10 + Math.random() * (winW - winW / 20); //発生領域は表示領域全体        
                    sakura.y = winH / 10 + Math.random() * (winH - winH / 20); //;0～1*500-500 ≒-499～500 
                }                                                                   //半分の発生域を回避エリア周辺に集める
                //    myLog(dbMsg);
                sakura.rotationX = -80 + Math.random() * 20; //-80～-60          //org;Math.random() *360=0～360     ≒0～360
                sakura.rotationY = -80 + Math.random() * 20;
                sakura.rotationZ = Math.random() * 360;
                sakura.vx = (Math.random() - 0.5) * 0.5;                    //移動速度         * 0.1では移動しない  1では動き続ける
                sakura.vy = (Math.random() - 0.5) * 0.5;
                sakura.vz = -0.03 + (Math.random() - 0.5) / 10; //0.3 + 0.2 * Math.random();だと中心に向かって動く
                sakura.alpha = 0.05;
                dbMsg = dbMsg + ",発生点(" + sakura.x + "," + sakura.y + "," + sakura.z + ")";
                sakura.alphaV = 0.05;
                if (isArrival) {
                    var safePoint = setSafePosition(sakura.x, sakura.y, sakura.z);
                    if (sakura.x != safePoint.x || sakura.y != safePoint.y) {
                        dbMsg = dbMsg + ">回避>(" + safePoint.x + " , " + safePoint.y + ")";
                        var dx = safePoint.x - sakura.x;
                        var dy = safePoint.y - sakura.y;
                        if (dx < dy) {                                  //☆両方動かすと4隅に寄るので、xyどちらかにだけ移動して初期発生
                            sakura.y = safePoint.y;
                        } else {
                            sakura.x = safePoint.x;
                        }
                        dbMsg = dbMsg + ">変更結果>(" + sakura.x + " , " + sakura.y + ")";
                    }
                }
                dbMsg = dbMsg + ",scale=" + sakura.scaleX + "%";
                dbMsg = dbMsg + ",移動(" + sakura.vx + " , " + sakura.vy + ")"
                dbMsg = dbMsg + "(" + sakura.x + " , " + sakura.y + " , " + sakura.z + ")"

                sakura.rotationVx = sakura.rotationVy = sakura.rotationVz = (Math.random() - 0.5) * 2; //-0.5～+0.5             //org ; 7 - 10 * Math.random();=-3～7
                sakura.getAlpha = function () {
                    return sakura.alpha;
                }
                _sakuras.push(sakura);
            }
            dbMsg = dbMsg + ">>" + _sakuras.length + "件";
            //        myLog(dbMsg);
        } catch (e) {
            dbMsg = dbMsg + "で" + e;
            makeLastCooki(dbMsg);
        }
    }                                       //_sakura配列要素の生成;(0,0)～(winW, winH;)の範囲に0～150%の大きさでランダムに傾いた花を生成/addSakuraの入れ替え

    /**
     *  _sakura配列要素の削除;
     *  ・登場時；表示エリアからはみ出したものを配列から削除
     *  ・ストック；上記に加え設定した倍率になったもの
     *  　　　　　　それに達しない間はα値可変
     * */
    function removeEffectObje() {                       //_sakura配列要素の削除;表示エリアからはみ出したものを配列から削除
        var len = _sakuras.length;
        var tag = "[effect.removeEffectObje]isArrival=" + isArrival + ",開始時=" + len + "件";
        var dbMsg = tag;
        try {
            dbMsg = dbMsg + isArrival + ",開始時=" + len + "件";
            var b_Scale = (endScale - 2); //消失動作に切り替えるサイズendScale = 3　だと2
            for (var i = len; 0 <= i; i--) {
                dbMsg = tag + i + "/" + len + ")";
                var sakura = _sakuras[i];
                if (sakura) {
                    dbMsg = dbMsg + ";" + sakura._id + "(" + sakura.x + "," + sakura.y + ")win[" + winW + "×" + winH + "]" + sakura.scaleX + "%(" + b_Scale + ")";
                    if (sakura.x < 0 || winW < sakura.x || sakura.y < 0 || winH < sakura.y || //表示範囲からはみ出したもの
                        endScale < sakura.scaleX || //ストック時に指定倍率に達したもの
                        (sakura.lifeEnd < sakura.lifeCount) ||
                        (150 < sakura.lifeCount & sakura.alpha < 0.05) ||
                        (isArrival && 180 < sakura.lifeCount && sakura.alpha < 0.05) || //新着開始以降、以前からあるオブジェクトが指定倍率に達したもの   (sakura._id < arrivalID)
                        (isArrival && (500 < arrivalID && arrivalID < sakura._id) && 180 < sakura.lifeCount) ||
                        isNaN(sakura.x) || isNaN(sakura.y)) {                           //
                        var removed = _sakuras.splice(i, 1);
                        dbMsg = dbMsg + ",削除したid= " + removed[0]._id + "＞＞" + _sakuras.length + "件";
                    }
                    //                        myLog(dbMsg);
                }
            }
            dbMsg = dbMsg + ">削除残り>" + _sakuras.length + "件";
            addEffectObje(); //_sakura配列要素の生成;(0,0)～(winW, winH;)の範囲に0～150%の大きさでランダムに傾いた花を生成
            dbMsg = dbMsg + ">再作成>" + _sakuras.length + "件";
            //  myLog(dbMsg);
        } catch (e) {
            dbMsg = dbMsg + "で" + e;
            makeLastCooki(dbMsg);
        }
    }
    //花弁アニメーション////効果/////////////////////////////////////////
    ////新着/////////////////////////////////////////////
    var naPattern = -1; //アニメーションパターン；-1;終了、0;下-中央、1;左-中央、2;上-中央、3;右-中央、4;右下-左-右上、5;左下-右-左上、6;左上-右-左下、7;右上-左-右下
    var sinarioNo = -1;
    var arrivalsIDArray; //新着画像のID配列
    var arrivalsArray; //新着画像のUrl配列
    var isArrival = false; //登場アニメーション実行中;newImageWriteの開始でtrue/終了でfalse
    var isArrival01 = false; //登場アニメーションの飛行部分実行中
    var farstArrival = false; //一通目
    var newImageReading = false;    //新着確認中
    var parentOj; //Canvasの親ノード
    var newImg_fadeTimer; // 新着のタイマースレッド
    /**
     * 新着として登録されたPhot_iDの写真をスライドに表示
     * 新規追加ID;newIdを初期化（-1）
     * `@param {type} name description
     * */
    function newImageWrite() {
        var dbMsg = "[arrival.newImageWrite]";
        try {
            dbMsg = dbMsg + ",arrivalsArray=" + arrivalsArray.length + "件";
            $("#arrival_count").text("表示待ち" + arrivalsArray.length + "件");
            $("#arrival_total").text(arrivalsArray.length + "件"); //+ newImages.length + "件"
            if (0 < arrivalsArray.length) {                             //新着画像のID配列に要素が有れば
                isArrival = true; //登場アニメーション実行中
                newId = arrivalsIDArray[0]; //先頭要素を取得
                dbMsg = dbMsg + "、newId=" + newId;
                arrivalsIDArray.splice(0, 1);                            //arrivalsIDArray.shift(); //shift() 配列の先頭の要素を削除
                $("#arrival_id").text(newId + "/" + arrivalsIDArray.toString());
                $("#arrival_count").text("新着" + arrivalsArray.length + "件");
                $("#arrival_total").text(arrivalsArray.length + "件");
                var imageURL = arrivalsArray[0]; //先頭要素を取得
                dbMsg = dbMsg + "、imageURL=" + imageURL;
                arrivalsArray.splice(0, 1);                         //arrivalsArray.shift(); // 配列の先頭の要素を削除
                if (imageURL) {
                    dbMsg = dbMsg + ",パターン=" + naPattern;
                    dbMsg = dbMsg + "、残り" + arrivalsArray.length + "件";
                    // var nID = newId;    // + "in"
                    removeEffectObje(); //_sakura配列要素の削除;表示エリアからはみ出したものを配列から削除
                    photAria = [];
                    rewitePhotAria(); //回避エリアを更新
                    addEffectObje(); //花がなくなるタイミングが有るのでエフェクト再始動
                    myLog(dbMsg);
                    caDraw(imageURL, newId, 1); //    newArrivals(imageURL, imgObj);へ
                } else {
                    newImageWriteEnd()
                }
            } else {
                newImageWriteEnd()
            }
            // myLog(dbMsg);
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；';
            back2Main(dbMsg);
        }
    }

    function newImageWriteEnd() {
        var dbMsg = "[arrival.newImageWriteEnd]";
        try {
            dbMsg = dbMsg + "/登場アニメーション実行終了]arrivalsArray=" + arrivalsArray.length + "件"
            isArrival = false;
            // newId = -1; //処理が終われば初期化
            arrivalID = -1;
            if (arrivalsIDArray.length == 0) {                             //新着画像のID配列に要素が有れば
                arrivalsIDArray.pop(); // 配列の末尾の要素を削除       （指定位置を残すのは.slice( start, end ) ;）
                arrivalsIDArray.length = 0;
                arrivalsIDArray = [];
            }
            if (arrivalsArray.length == 0) {                             //新着画像のID配列に要素が有れば
                arrivalsArray.pop(); // 配列の末尾の要素を削除
                arrivalsArray.length = 0;
                arrivalsArray = [];
            }
            dbMsg = dbMsg + ">ID>" + arrivalsIDArray.length + "件、url>" + arrivalsArray.length + "件";
            // myLog(dbMsg);
            pushNewImages();                                                    //新着確認開始
            dataQueueingStart();
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；';
            back2Main(dbMsg);
        }
    }

    function back2Main(dbMsg) {
        makeLastCooki(dbMsg);
        arrivalsArray = [];
        pushNewImages();                                                    //新着確認開始
        dataQueueingStart();
    }

    /**
     * 新着～移動～消失
     * テストアルバム　AlNptPB4
     * 角度と高さから底辺と斜辺を計算   http://keisan.casio.jp/exec/system/1177477195
     * */
    function newArrivals(imageURL, imgObj) {
        var tag = "[arrival.newArrivals]";
        try {
            var dbMsg = tag;
            var tfEnd = false; //このfunctionの終了動作に入る
            var stayCount = 0;
            var endCount = 0; //stayTime / PhotAFRate; //   2000/ 30
            var dbMsg = dbMsg + ",停止指定" + stayTime + "ms=" + endCount + "カウント";
            var ctx = imgObj.ctx;
            var iObj = imgObj.iObj; //urlだけが入っている
            var orgW = iObj.naturalWidth;
            var orgH = iObj.naturalHeight;
            var scale_xy = imgObj.scale;
            var scaleWin = orgW * scale_xy / winW;
            var newImg_shit_x = imgObj.x;
            var newImg_shit_y = imgObj.y;
            var newImg_shit_z = -vanishingPoint; //画面幅分で始点～原点～消失点を変化させる
            var dbMsg = dbMsg + "作成したcanvas=" + ctx.canvas.id + "[" + orgW + "×" + orgH + "]" + scale_xy + "* 100%" + "[" + newImg_shit_x + "×" + newImg_shit_y + "]表示枠中= " + scaleWin;
            var startX = 0; //winW / 2; //画面に登場する時のp0X座標
            var startY = 0; //winH / 2; //画面に登場する時のp0Y座標
            var stopX = winW / 2; //画面x中心で高さ分上まで移動                        - (newImg_resize_h))
            var stopY = winH / 2; //画面x中心で高さ分上 winH / 2; //画面x中心で高さ分上まで移動                        - (newImg_resize_h))
            var reverceY = winH / 10; //xminiになるY座標
            var stepY = 1; //コントローラにするY座標
            var thX = 0; //上下パース時の上下辺の差
            var degreesXZ = 70; //フレームインする時のXZ角度
            var thY = 0; //左右パース時の左右辺の差
            var dYZShift = 0; //YZ軸角度の象限補正角度
            var degreesYZ = 70; //フレームインする時のYZ角度
            var lCount = 0;
            var isCenter = false; //中心到達;直線軌道の前/後半判定
            var isXReverce = false; //横移動の反転発生;旋回軌道の前/後半判定
            var isToEnd = false;
            var pMax = 6; //用意したパターンの最終caseNo 0～7-1
            // console.log(imgObj);
            if (pMax < naPattern) {
                //            naPattern = 0;
                naPattern = Math.floor(Math.random() * pMax + 1); //乱数生成;0～pMax
            } else {
                naPattern++;
            }                                                                       //パターン変更を0スタートの順送りにする場合
            if (debug_now) {
                naPattern = 5;          //naPattern = document.getElementById("aliveSel").value;              //1; //アニメーションパターン；-1;終了、0;左下から、1;左上から、2;右上から、3;右下から中央へ、4;右下-左-右上、5;左下-右-左上、6;左上-右-左下、7;右上-左-右下
                dbMsg = dbMsg + ">>" + naPattern;
            }

            dbMsg = dbMsg + ",パターン=" + naPattern;
            dbMsg = dbMsg + ",win[" + winW + "×" + winH + ";vpPer=" + vpPer + "度";
            dbMsg = dbMsg + ",Z=" + newImg_shit_z;
            var newScales = scaleOfZ(vpPer, orgW, orgH, newImg_shit_z);
            scale_xy = newScales.scale_xy; //  = newImg_resize_w / orgW; //1 / Math.max(newImg_shit_z / winW, 0.001);
            dbMsg = dbMsg + "で" + scale_xy + "* 100%";
            if (1.0 < scale_xy) {
                newImg_shit_z = -vanishingPoint / scale_xy; //画像幅が画面全幅に収まる奥行
                dbMsg = dbMsg + ">Z>" + newImg_shit_z;
                newScales = scaleOfZ(vpPer, orgW, orgH, newImg_shit_z);
                scale_xy = newScales.scale_xy; //  = newImg_resize_w / orgW; //1 / Math.max(newImg_shit_z / winW, 0.001);
                dbMsg = dbMsg + ">>" + scale_xy + "* 100%";
            }
            var newImg_resize_w = newScales.newImg_resize_w; //-newImg_shit_z * Math.tan(vpPer) + winW * Math.tan(vpPer);
            var newImg_resize_h = newScales.newImg_resize_h; // = orgH * scale_xy;
            dbMsg = dbMsg + ",初期[" + newImg_resize_w + "×" + newImg_resize_h + "]";
            switch (naPattern) {
                case 0:                                                             //左下から中央へ
                    startX = newImg_shit_x = -newImg_resize_w;
                    startY = newImg_shit_y = winH;
                    stopX = winW / 2;
                    stopY = winH / 2;
                    break;
                case 1:                                                             //左上から中央へ
                    startX = newImg_shit_x = -newImg_resize_w * 0.9;
                    startY = newImg_shit_y = -newImg_resize_h;
                    stopX = winW / 2;
                    stopY = winH / 2;
                    break;
                case 2:                                                             //右上から中央へ
                    startX = newImg_shit_x = winW;
                    startY = newImg_shit_y = -newImg_resize_h;
                    stopX = winW / 2;
                    stopY = winH / 2;
                    break;
                case 3:                                                             //右下から中央へ
                    startX = newImg_shit_x = winW - newImg_resize_w * 0.1;
                    startY = newImg_shit_y = winH;
                    stopX = winW / 2;
                    stopY = winH / 2;
                    break;
                case 4:                                                             //右下-左-右上
                case 7:                                                             //右上-左-右下
                    newImg_shit_x = winW - newImg_resize_w * 0.1; //0.7では中心到達が早すぎ,0.9では横長で初期動作が見えない
                    startX = winW; //画面に登場する時のp0X座標
                    stopX = winW / 50; //画面x中心で高さ分上まで移動                        - (newImg_resize_h))
                    break;
                case 5:                                                         //左下-右-左上、
                case 6:                                                         //左上-右-左下、
                    startX = newImg_shit_x = 0; // - newImg_resize_w * 0.9;
                    stopX = winW - winW / 10;
                    break;
            }                                                                       //初期値設定
            dbMsg = dbMsg + ",開始YZ(左右)=" + degreesYZ + " 度で幅" + newImg_resize_w + ",xZ(上下)=" + degreesXZ + " 度で,高さ" + newImg_resize_h + ";" + scale_xy + "*100%";
            switch (naPattern) {
                case 4:                                                             //右下-左-右上
                case 5:                                                         // 左下-右-左上、
                    stopY = winH / 10; //画面x中心で高さ分上 winH / 2; //画面x中心で高さ分上まで移動
                    reverceY = stopY + Math.sqrt(Math.abs(stopX - newImg_shit_x)); //xminiになるY座標
                    startY = stopY + (reverceY - stopY) * 2; //画面に登場する時のp0Y座標
                    stepY = (startY - stopY) / 75; //コントローラにするY座標;半周                          150では軽妙、100では遅すぎ 
                    newImg_shit_y = startY;
                    isCenter = false;
                    break;
                case 6:                                                         //左上-右-左下、
                case 7:                                                             //右上-左-右下
                    startY = winH / 10; //画面x中心で高さ分上 winH / 2; //画面x中心で高さ分上まで移動
                    reverceY = startY + Math.sqrt(Math.abs(stopX - newImg_shit_x)); //xminiになるY座標
                    stopY = startY + (reverceY - startY) * 2; //画面に登場する時のp0Y座標
                    stepY = (stopY - startY) / 75; //コントローラにするY座標;半周
                    newImg_shit_y = startY;
                    isCenter = false;
                    break;
            }                                       //旋回運動のy軸移動
            // if (3 < naPattern) {
            //     endCount = stayTime / PhotAFRate; //   2000/ 30
            dbMsg = dbMsg + ",軌道範囲(" + startX + "," + startY + ")反転(" + stopX + "," + reverceY + ")～(" + startX + "," + stopY + ")stepY=" + stepY;
            // } else {
            //     dbMsg = dbMsg + ",軌道範囲(" + startX + "," + startY + ")～stop(" + stopX + "," + stopY + ")";
            // }
            isArrival01 = true; //登場アニメーションの飛行部分実行中
            photAria = [];
            addPhotAria(ctx.canvas.id); //エフェクトに渡す写真情報
            ctx.globalAlpha = 0.8; //で透明化してスタート
            isStayEnd = false; //画像のアニメーション静止終了
            myLog(dbMsg);
            photID = ctx.canvas.id; //回避エリアに渡すID
            newArrivalsArray.push(newImg_fadeTimer = setInterval(function () {
                lCount++;
                dbMsg = tag + "," + lCount + ")前(" + Math.round(newImg_shit_x) + "," + Math.round(newImg_shit_y) + "," + Math.round(newImg_shit_z) + ")[w;" + Math.round(newImg_resize_w) + "×h;" + Math.round(newImg_resize_h) + "]";
                dbMsg = dbMsg + ",パターン=" + naPattern;
                var b_x = newImg_shit_x;
                var b_y = newImg_shit_y;
                var b_z = newImg_shit_z;
                var b_xEnd = newImg_shit_x + newImg_resize_w;
                var b_yEnd = newImg_shit_y + newImg_resize_h;
                var b_Width = newImg_resize_w;
                var b_hight = newImg_resize_h;
                dbMsg = dbMsg + "(" + Math.round(b_xEnd) + "," + Math.round(b_yEnd) + ")";
                var centerX = newImg_shit_x + newImg_resize_w / 2;
                var centerY = newImg_shit_y + newImg_resize_h / 2;
                dbMsg = dbMsg + ",center(" + centerX + "," + centerY + ")";
                scaleWin = newImg_resize_w / winW;
                dbMsg = dbMsg + ",scaleWin=" + scaleWin;
                dbMsg = dbMsg + ",元scale=" + scale_xy + "* 100%から";
                photZ = newImg_shit_z - vanishingPoint; //このfunctionでは軌跡を残すために手前から消失点までを完全に抜く
                photT = vanishingPoint * 2;
                if (endCount < stayCount || (PhotAFRate * 10) < lCount) {                         //終了処理  tfEnd発生後の待ちカウント  もしくは　異常事態で終端にたどり着けなければ10秒で中断
                    isArrival01 = false; //登場アニメーションの飛行部分実行中
                    dbMsg = dbMsg + "----消失終了----" + ctx.canvas.id + ",scale_xy=" + scale_xy * 100 + "%";
                    stopNIAnimation(newArrivalsArray);
                    ctx.globalAlpha = 1.0;
                    ctx.setTransform(1, 0, 0, 1, 0, 0); //setTransform;マトリックス変形 ctxのwidth×heightは変化しない
                    var rect = document.getElementById(ctx.canvas.id).getBoundingClientRect();
                    dbMsg = dbMsg + "ctx(" + rect.left + "," + rect.top + ")[" + rect.width + "×" + rect.height + "]";
                    // myLog(dbMsg);
                    if (3 < naPattern) {
                        newImg_shit_z = vanishingPoint * 0.9;
                        newScales = scaleOfZ(vpPer, orgW, orgH, newImg_shit_z);
                        newImg_resize_w = newScales.newImg_resize_w; //-newImg_shit_z * Math.tan(vpPer) + winW * Math.tan(vpPer);
                        scale_xy = newScales.scale_xy; //  = newImg_resize_w / orgW; //1 / Math.max(newImg_shit_z / winW, 0.001);
                        dbMsg = dbMsg + "で" + scale_xy * 100 + "%";
                        newImg_resize_h = newScales.newImg_resize_h; // = orgH * scale_xy;
                        newImg_shit_x = winW / 2 - newImg_resize_w / 2;
                        newImg_shit_y = winH / 2 - newImg_resize_h / 2;
                    }
                    imgObj = { ctx: ctx, iObj: iObj, scale: scale_xy, x: newImg_shit_x, y: newImg_shit_y, z: newImg_shit_z };
                    caB2f(imgObj, 1, 0); //奥手からZoomInにcanvasを渡す
                } else if (tfEnd) {                   // || winW < newImg_shit_x || (newImg_shit_x + newImg_resize_w) < 0 ||winH < newImg_shit_y || (newImg_shit_y + newImg_resize_h) < 0
                    dbMsg = dbMsg + "----停止----win[" + winW + "×" + winH + "]";
                    stayCount++;
                    dbMsg = dbMsg + ",stayCount=" + stayCount + "/" + endCount;
                    if (isCenter == true) {             //naPattern < 4 && 
                        newImg_shit_x = winW / 2 - newImg_resize_w / 2; //中心に戻す
                        newImg_shit_y = winH / 2 - newImg_resize_h / 2; //中心に戻す
                        dbMsg = dbMsg + ",センター補正(" + newImg_shit_x + "," + newImg_shit_y + "," + newImg_shit_z + ")";
                    }                               //直線軌道の終了前補正
                } else {
                    if (ctx.globalAlpha < 0.95) {
                        ctx.globalAlpha += 0.1; //caFadeIn(0.05, ctx, iObj, newImg_shit_x, newImg_shit_y, newImg_resize_w, newImg_resize_h);
                    }
                    isCenter = false;
                    //////各パターンの軌道/////////////////////////////////////////////////////////
                    switch (naPattern) {
                        case 0:                                                     //下から上へ
                            if (stopY < centerY - 10) {           //0 < newImg_resize_w && 0 < newImg_resize_h
                                if (newImg_shit_z < (vanishingPoint * 0.7)) {
                                    newImg_shit_z += vanishingPoint * 0.15; //奥へ            0.1では遅い
                                    degreesXZ -= degreesXZ / 16; //手前から奥へ倒す      /8では倒れすぎmin16度
                                    degreesYZ -= degreesYZ / 20; //手前から奥へ倒す                 //32では効果が薄い
                                    photT = 10;
                                } else {
                                    dbMsg = dbMsg + "----Z0経過----";
                                    newImg_shit_z += (vanishingPoint - newImg_shit_z) / 8; //5縮小不足
                                    degreesXZ += (90 - degreesXZ) / 8; //XY面平行に戻す
                                    degreesYZ += (90 - degreesYZ) / 8; //XY面平行に戻す
                                }
                                if (degreesXZ < 80) {             //stopY * 1.5 < newImg_shit_y
                                    newImg_shit_y -= (centerY - stopY) / 16; //上へ    /25では早い  /50では最初が見えない
                                } else {
                                    dbMsg = dbMsg + "----引き起こし済み----";
                                    newImg_shit_y -= (centerY - stopY) / 16; //上へ
                                }
                                isCenter = false;
                            } else {
                                dbMsg = dbMsg + "----Y中心到達----";
                                isCenter = true; //中心到達
                                tfEnd = true; //終了動作に入る
                                newImg_shit_y = centerY - newImg_resize_h / 2;
                            }                                                       //ZX軸
                            newImg_shit_x += (stopX - centerX) / 15; //右     25では行き過ぎて左右に振動  Math.sqrt(remain2Stop) * 0.4; //左開口の放物線   *0.7では到達しない
                            if (stopX < centerX - 15) {
                                newImg_shit_x = centerX - newImg_resize_w / 2;
                                dbMsg = dbMsg + "----x中心到達----";
                            }
                            break;
                        case 1:                                                     //左上から中央へ
                            if (centerX < stopX - 10) {
                                if (newImg_shit_z < (vanishingPoint * 0.7)) {
                                    newImg_shit_z += vanishingPoint * 0.15; //奥へ            0.1では遅い
                                    degreesXZ -= degreesXZ / 16; //手前から奥へ倒す      /8では倒れすぎmin16度
                                    degreesYZ -= degreesYZ / 20; //手前から奥へ倒す      /16ではp23反転　、　/32では効果が薄い
                                    photT = 10;
                                } else {
                                    dbMsg = dbMsg + "----Z0経過----";
                                    newImg_shit_z += (vanishingPoint - newImg_shit_z) / 8; //5縮小不足
                                    degreesXZ += (90 - degreesXZ) / 8; //XY面平行に戻す
                                    degreesYZ += (90 - degreesYZ) / 8; //XY面平行に戻す
                                }
                                if (degreesYZ < 80) {             //stopY * 1.5 < newImg_shit_y
                                    newImg_shit_x += winW / 180; //右移動     160では加速部が無い   240では面移動が長い
                                } else {
                                    dbMsg = dbMsg + "----引き起こし済み----";
                                    newImg_shit_x += (stopX - centerX) / 8; //4では早い /16では遅い
                                }
                            } else {
                                dbMsg = dbMsg + "----中心到達----";
                                isCenter = true; //中心到達
                                tfEnd = true; //終了動作に入る
                                newImg_shit_x = centerY - newImg_resize_w / 2;
                            }                                                       //ZX軸
                            newImg_shit_y += (stopY - centerY) / 15; //下     25では行き過ぎて左右に振動  Math.sqrt(remain2Stop) * 0.4; //左開口の放物線   *0.7では到達しない
                            if (stopY < centerY - 15) {
                                newImg_shit_y = centerY - newImg_resize_h / 2;
                                dbMsg = dbMsg + "----x中心到達----";
                            }
                            break;
                        case 2:                                                     //上から下へ
                            if (centerY < stopY - 10) {           //0 < newImg_resize_w && 0 < newImg_resize_h
                                if (newImg_shit_z < (vanishingPoint * 0.7)) {
                                    newImg_shit_z += vanishingPoint * 0.15; //奥へ            0.1では遅い
                                    degreesXZ -= degreesXZ / 16; //手前から奥へ倒す      /8では倒れすぎmin16度
                                    degreesYZ -= degreesYZ / 20; //手前から奥へ倒す      /16ではp23反転　、　/32では効果が薄い
                                    photT = 10;
                                } else {
                                    dbMsg = dbMsg + "----Z0経過----";
                                    newImg_shit_z += (vanishingPoint - newImg_shit_z) / 8; //5縮小不足
                                    degreesXZ += (90 - degreesXZ) / 8; //XY面平行に戻す
                                    degreesYZ += (90 - degreesYZ) / 8; //XY面平行に戻す
                                }
                                if (degreesXZ < 80) {             //stopY * 1.5 < newImg_shit_y
                                    newImg_shit_y += (stopY - centerY) / 16; //下へ    /25では早い  /50では最初が見えない
                                } else {
                                    dbMsg = dbMsg + "----引き起こし済み----";
                                    newImg_shit_y += (stopY - centerY) / 16; //下へ
                                }
                                isCenter = false;
                            } else {
                                dbMsg = dbMsg + "----Y中心到達----";
                                isCenter = true; //中心到達
                                tfEnd = true; //終了動作に入る
                                newImg_shit_y = centerY - newImg_resize_h / 2;
                            }
                            newImg_shit_x -= (centerX - stopX) / 15; //では進み過ぎ、30では届かず        Math.sqrt(remain2Stop) * 0.4; //左開口の放物線   *0.7では到達しない
                            if (centerX < stopX + 15) {
                                newImg_shit_x = centerX - newImg_resize_w / 2;
                                dbMsg = dbMsg + "----x中心到達----";
                            }
                            break;
                        case 3:                                                     //右下から中央へ
                            if (stopX < centerX - 10) {
                                if (newImg_shit_z < (vanishingPoint * 0.7)) {
                                    newImg_shit_z += vanishingPoint * 0.15; //奥へ            0.1では遅い
                                    degreesXZ -= degreesXZ / 16; //手前から奥へ倒す      /8では倒れすぎmin16度
                                    degreesYZ -= degreesYZ / 20; //手前から奥へ倒す      /16ではp23反転　、　/32では効果が薄い
                                    photT = 10;
                                } else {
                                    dbMsg = dbMsg + "----Z0経過----";
                                    newImg_shit_z += (vanishingPoint - newImg_shit_z) / 8; //5縮小不足
                                    degreesXZ += (90 - degreesXZ) / 8; //XY面平行に戻す
                                    degreesYZ += (90 - degreesYZ) / 8; //XY面平行に戻す
                                }
                                if (degreesYZ < 80) {             //stopY * 1.5 < newImg_shit_y
                                    newImg_shit_x -= winW / 180; //     160では加速部が無い   240では面移動が長い
                                } else {
                                    dbMsg = dbMsg + "----引き起こし済み----";
                                    newImg_shit_x -= (centerX - stopX) / 8; //4では早い /16では遅い  
                                }
                            } else {
                                dbMsg = dbMsg + "----中心到達----";
                                isCenter = true; //中心到達
                                tfEnd = true; //終了動作に入る
                                newImg_shit_x = centerY - newImg_resize_w / 2;
                            }                                                       //ZX軸
                            newImg_shit_y -= (centerY - stopY) / 15; //下     25では行き過ぎて左右に振動  Math.sqrt(remain2Stop) * 0.4; //左開口の放物線   *0.7では到達しない
                            if (centerY < stopY + 15) {
                                newImg_shit_y = centerY - newImg_resize_h / 2;
                                dbMsg = dbMsg + "----x中心到達----";
                            }
                            break;
                        case 4:                                                             //右下-左-右上
                        case 7:                                                             //右上-左-右下
                            // if (newImg_shit_x < winW) {           //左端が画面右へフレームアウトするまで
                            if (!isXReverce) {                                   //前半
                                if (newImg_shit_z < (vanishingPoint * 0.75)) {                     ///2では大きい
                                    newImg_shit_z += vanishingPoint * 0.3; //奥へ     0.25では大きくx中心に流れる。、0.4では下がり過ぎて戻りが出る
                                    degreesXZ -= degreesXZ / 10; //手前から奥へ倒す
                                    degreesYZ -= degreesYZ / 20; //手前から奥へ倒す      /16ではp23反転　、　/32では効果が薄い
                                    photT = 10;
                                } else {
                                    dbMsg = dbMsg + "----Z目標経過----";
                                    degreesXZ += (90 - degreesXZ) / 8; //XY面平行に戻す
                                    degreesYZ += (90 - degreesYZ) / 8; //XY面平行に戻す
                                }
                                if (newImg_shit_x < winW / 6) {                 // /8で唐突
                                    dbMsg = dbMsg + "----反転開始----";
                                    degreesXZ -= degreesXZ / 8; //手前から奥へ倒す          /4では唐突
                                    degreesYZ -= degreesYZ / 20; //手前から奥へ倒す      /16ではp23反転　、　/32では効果が薄い
                                    newImg_shit_z += vanishingPoint * 0.01; //奥へ  
                                }
                            } else {                                             //後半
                                if (degreesXZ < 90) {
                                    degreesXZ += degreesXZ / 16; //XY面平行に戻す     8では早い
                                    degreesYZ += degreesYZ / 16; //手前から奥へ倒す
                                }
                                if (winW * 0.25 < newImg_shit_x) {
                                    dbMsg = dbMsg + "----右1/4経過----";
                                    degreesXZ = 90;// degreesXZ -= degreesXZ / 10; //手前から奥へ倒す
                                    degreesYZ = 90;// degreesYZ -= degreesYZ / 20; //手前から奥へ倒す      /16ではp23反転　、　/32では効果が薄い
                                    // // newImg_shit_z -= (vanishingPoint - newImg_shit_z) / 7; //5ではトビが出る。10では消失しない      +=
                                    isToEnd = true;
                                }
                                if ((winW / 2 - newImg_resize_w / 2) < newImg_shit_x) {           //左端が画面右へフレームアウトするまで
                                    dbMsg = dbMsg + "----中心が画面中心を経過----";
                                    isCenter = true; //中心到達
                                    tfEnd = true; //終了動作に入る
                                }
                            }
                            break;
                        case 5:                                                         // 左下-右-左上、
                        case 6:                                                         //左上-右-左下、
                            // if (0 < (newImg_shit_x + newImg_resize_w)) {           //左端が画面右へフレームアウトするまで
                            if (!isXReverce) {                                   //前半
                                if (newImg_shit_z < (vanishingPoint * 0.75)) {                     //0.5では大きい
                                    newImg_shit_z += vanishingPoint * 0.3; //奥へ          、0.3では下がり過ぎて戻りが出る
                                    degreesXZ -= degreesXZ / 16; //手前から奥へ倒す
                                    degreesYZ -= degreesYZ / 20; //手前から奥へ倒す      /16ではp23反転　、　/32では効果が薄い
                                    photT = 10;
                                } else if ((newImg_shit_x + newImg_resize_w) <= (winW - winW / 6)) {
                                    dbMsg = dbMsg + "----Z0経過----";
                                    if (degreesXZ < 90) {
                                        degreesXZ += (90 - degreesXZ) / 8; //XY面平行に戻す (90 - degreesXZ) / 8
                                    }
                                    if (degreesYZ < 90) {
                                        degreesYZ += (90 - degreesYZ) / 8; //XY面平行に戻す
                                    }
                                } else if ((stopX - newImg_resize_w / 4) < newImg_shit_x) {         //(newImg_shit_x + newImg_resize_w)
                                    dbMsg = dbMsg + "----反転開始----";
                                    degreesXZ -= degreesXZ / 40; //手前から奥へ倒す
                                    degreesYZ -= degreesYZ / 30; //手前から奥へ倒す
                                    newImg_shit_z += vanishingPoint * 0.01; //奥へ                          0.02では戻りを感じる 
                                }
                            } else {                                             //後半
                                if (degreesXZ < 90) {
                                    degreesXZ += degreesXZ / 16; //XY面平行に戻す     4では早い
                                    degreesYZ += degreesYZ / 16; //手前から奥へ倒す      /16ではp23反転　、　/32では効果が薄い
                                }
                                if (newImg_shit_x < winW * 0.75) {
                                    dbMsg = dbMsg + "----右1/4経過----";
                                    degreesXZ = 90;// degreesXZ -= degreesXZ / 10; //手前から奥へ倒す
                                    degreesYZ = 90;// degreesYZ -= degreesYZ / 20; //手前から奥へ倒す      /16ではp23反転　、　/32では効果が薄い
                                    // // newImg_shit_z -= (vanishingPoint - newImg_shit_z) / 7; //5ではトビが出る。10では消失しない      +=
                                    isToEnd = true;
                                }
                                if (newImg_shit_x < (winW / 2 + newImg_resize_w / 2)) {           //左端が画面右へフレームアウトするまで
                                    dbMsg = dbMsg + "----中心が画面中心を経過----";
                                    isCenter = true; //中心到達
                                    tfEnd = true; //終了動作に入る
                                }
                            }
                             break;
                    }                                           //傾き、軌道、終了設定
                    if (!isXReverce && (vanishingPoint * 0.9 < newImg_shit_z)) {                    //旋回動作の前半で無く、 消失点までの限度を超えたら 
                        newImg_shit_z = vanishingPoint * 0.9; //限度値に固定
                        dbMsg = dbMsg + ">Z>=" + newImg_shit_z;
                    }                                                               //奥行リミット
                    var newScales = scaleOfZ(vpPer, orgW, orgH, newImg_shit_z);
                    newImg_resize_w = newScales.newImg_resize_w; //-newImg_shit_z * Math.tan(vpPer) + winW * Math.tan(vpPer);
                    scale_xy = newScales.scale_xy; //  = newImg_resize_w / orgW; //1 / Math.max(newImg_shit_z / winW, 0.001);
                    dbMsg = dbMsg + "で" + scale_xy * 100 + "%";
                    newImg_resize_h = newScales.newImg_resize_h; // = orgH * scale_xy;
                    dbMsg = dbMsg + ",resize_[" + newImg_resize_w + "×" + newImg_resize_h + "]";
                    var endStepP = 30;
                    switch (naPattern) {
                        case 4:                                                             //右下-左-右上
                        case 5:                                                         // 左下-右-左上、
                            if (isToEnd) {
                                newImg_shit_y = newImg_shit_y + (winH / 2 + newImg_resize_h / 2 - newImg_shit_y) / endStepP;        // / 2だと早い     - newImg_shit_y
                            } else {
                                newImg_shit_y -= stepY; //上昇    
                                if (newImg_shit_y <= reverceY) {
                                    isXReverce = true; //横移動の反転発生;旋回軌道の前/後半判定
                                    dbMsg = dbMsg + "---反転=";
                                }
                            }
                            break;
                        case 6:                                                         //左上-右-左下、
                        case 7:                                                             //右上-左-右下
                            if (isToEnd) {
                                newImg_shit_y = newImg_shit_y - (newImg_shit_y -winH / 2 - newImg_resize_h / 2) / endStepP;        // / 2だと早い
                            } else {
                                newImg_shit_y += stepY; //降下    
                                if (reverceY <= newImg_shit_y) {
                                    isXReverce = true; //横移動の反転発生;旋回軌道の前/後半判定
                                    dbMsg = dbMsg + "---反転=";
                                }
                            }
                            break;
                    }                                       //旋回運動のy軸移動
                    var remain2Stop = Math.abs(reverceY - newImg_shit_y); //反転座標までの距離
                    dbMsg = dbMsg + ",反転まで" + remain2Stop;
                    switch (naPattern) {
                        case 4:                                                             //右下-左-右上
                        case 7:                                                             //右上-左-右下
                            if (isToEnd) {
                                newImg_shit_x = newImg_shit_x + (winW / 2 + newImg_resize_w / 2 - newImg_shit_x) / endStepP;
                            } else {
                                newImg_shit_x = stopX + Math.pow(remain2Stop, 2); //右開口の放物線 
                            }
                            break;
                        case 5:                                                         // 左下-右-左上、
                        case 6:                                                         //左上-右-左下、
                            if (isToEnd) {
                                newImg_shit_x = newImg_shit_x - (newImg_shit_x - winW / 2 - newImg_resize_w / 2) / endStepP;
                            } else {
                                newImg_shit_x = stopX - Math.pow(remain2Stop, 2); //左開口の放物線 - newImg_resize_w
                            }
                            break;
                    }                                       //旋回運動の軌跡
                    dbMsg = dbMsg + ">newImg_shit>(" + newImg_shit_x + "," + newImg_shit_y + ";" + winH + ")";
                    if (scale_xy < 0.01) {
                        scale_xy = 0.01;
                        newImg_resize_w = orgW * scale_xy;
                        newImg_resize_h = orgH * scale_xy;
                        dbMsg = dbMsg + ">>" + scale_xy + "%[" + newImg_resize_w + "×" + newImg_resize_h + "]";
                    }
                    var d_Width = b_Width - newImg_resize_w;
                    var d_hight = b_hight - newImg_resize_h;
                    dbMsg = dbMsg + ">>[" + d_Width + "×" + d_hight + "]";
                    var dX = newImg_shit_x - b_x;
                    var dY = newImg_shit_y - b_y;
                    var dZ = newImg_shit_z - b_z;
                    dbMsg = dbMsg + "移動量[" + dX + "," + dY + "," + dZ + "]";
                    var targetXS = newImg_shit_x;
                    var targetXE = newImg_shit_x + newImg_resize_w;
                    var targetYS = newImg_shit_y;
                    var targetYE = newImg_shit_y + newImg_resize_h;
                    dbMsg = dbMsg + "移動先(" + targetXS + "," + targetYS + ")～(" + targetXE + "," + targetYE + "),Z=" + newImg_shit_z;
                    var pW = []; //（例）左上のX座標を知るときは,  p[0].x 、右上のY座標だと p[3].y と書く。
                    pW.push(
                        new Point(targetXS, targetYS), //p0 
                        new Point(targetXE, targetYS), //p1
                        new Point(targetXS, targetYE), //p2
                        new Point(targetXE, targetYE)				//p3
                    ); // 座標の左上、右上、左下、右下の4箇所のX,Y座標はPointクラスで管理
                    var dZdegXZ = 0;
                    degreesXZ = degreesXZ % 360;
                    if (degreesXZ < 35) {
                        degreesXZ = 35;
                    }                                                               //p01xの反転防止
                    dbMsg = dbMsg + ",XZ=" + degreesXZ + "度";
                    degreesYZ = degreesYZ % 360;
                    if (degreesYZ < 40) {
                        degreesYZ = 40;
                    }                                                               //p01xの反転防止
                    dbMsg = dbMsg + ",YZ=" + degreesYZ + "度";
                    dbMsg = dbMsg + ",Y可動=" + dY;
                    if (89 < degreesXZ) {
                        thX = 0;
                        degreesXZ = 90;
                        dbMsg = dbMsg + "角度戻り";
                    } else if (degreesXZ != 0) {                                           //上下に傾きが有れば
                        dZdegXZ = newImg_resize_h * Math.sin(degreesXZ * Math.PI / 180); //http://keisan.casio.jp/exec/system/1161228779
                        var dZdegScale = dZdegXZ / newImg_resize_h;
                        dbMsg = dbMsg + ",高さの変化=" + dZdegXZ + ",垂直時の=" + dZdegScale * 100 + "%"; //最少 3.306546357697861e-15       var zH = newImg_resize_h * Math.sin(degreesXZ * Math.PI / 180);                 //degreesXZ傾斜時の高さ　               
                        if (degreesYZ == 90) {
                            newImg_resize_h = newImg_resize_h * dZdegScale;
                            dbMsg = dbMsg + ",再resize_[" + newImg_resize_w + "×" + newImg_resize_h + "]";
                        }
                        var dYdegXZ = (newImg_resize_h - dZdegXZ) / 2;
                        dbMsg = dbMsg + ".y座標の変化" + dYdegXZ;
                        thX = (newImg_resize_w - newImg_resize_w * dZdegScale) / 2;
                        dbMsg = dbMsg + ",thX;P0xずれ量=" + thX;
                        switch (naPattern) {
                            case 4:                                                             //右下-左-右上
                            case 5:                                                         // 左下-右-左上、
                                pW = fpsB2T(pW, thX, dYdegXZ);
                                break;
                            case 6:                                                         //左上-右-左下、
                            case 7:                                                             //右上-左-右下
                                pW = fpsT2B(pW, thX, dYdegXZ);
                                break;
                            default:
                                if (0 < dY) {               //降下
                                    pW = fpsT2B(pW, thX, dYdegXZ);
                                } else {
                                    pW = fpsB2T(pW, thX, dYdegXZ);
                                }
                                break;
                        }
                    }                                     //上下；X軸(YZ面)の傾き変形

                    if (89 < degreesYZ) {
                        thY = 0;
                        degreesYZ = 90;
                        dbMsg = dbMsg + "角度戻り";
                        centerX = winW / 2;
                    } else if (degreesYZ != 0) {                                           //左右に傾きが有れば
                        var dZdegYZ = newImg_resize_w * Math.sin(degreesYZ * Math.PI / 180); //http://keisan.casio.jp/exec/system/1161228779
                        var dYdegScale = dZdegYZ / newImg_resize_w;
                        dbMsg = dbMsg + ",幅の変化=" + dZdegYZ + ",垂直時の=" + dYdegScale * 100 + "%"; //最少 3.306546357697861e-15       var zH = newImg_resize_h * Math.sin(degreesXZ * Math.PI / 180);                 //degreesXZ傾斜時の高さ　               
                        var dXdegYZ = (newImg_resize_w - dZdegYZ);
                        dbMsg = dbMsg + "x座標の変化" + dXdegYZ;
                        thY = (newImg_resize_h - newImg_resize_h * dYdegScale) / 2;
                        dbMsg = dbMsg + ",thY;P1yずれ量=" + thY;
                        switch (naPattern) {
                            case 4:                                                             //右下-左-右上
                            case 7:                                                             //右上-左-右下
                                if (isXReverce) {
                                    pW = fpsL2R(pW, dXdegYZ, thY);
                                } else {
                                    pW = fpsR2L(pW, dXdegYZ, thY);
                                }
                                break;
                            case 5:                                                         // 左下-右-左上、
                            case 6:                                                         //左上-右-左下、
                                if (isXReverce) {
                                    pW = fpsR2L(pW, dXdegYZ, thY);
                                } else {
                                    pW = fpsL2R(pW, dXdegYZ, thY);
                                }
                                break;
                            default:
                                if (0 < dX) {               //右へ
                                    pW = fpsL2R(pW, dXdegYZ, thY);
                                } else {
                                    pW = fpsR2L(pW, dXdegYZ, thY);
                                }
                                break;
                        }
                    }                                       //左右；Y軸(XZ面)の傾き変形
                    dbMsg = dbMsg + "、傾き変形後;p0(" + pW[0].x + "," + pW[0].y + "),p1(" + pW[1].x + "," + pW[1].y + "),p2(" + pW[2].x + "," + pW[2].y + "),p3(" + pW[3].x + "," + pW[3].y + ")";
                    var xMini = Math.min(pW[0].x, pW[1].x, pW[2].x, pW[3].x);
                    var yMini = Math.min(pW[0].y, pW[1].y, pW[2].y, pW[3].y);
                    var xMax = Math.max(pW[0].x, pW[1].x, pW[2].x, pW[3].x);
                    var yMax = Math.max(pW[0].y, pW[1].y, pW[2].y, pW[3].y);
                    //                dbMsg = dbMsg + ",頂点(" + xMini + "," + yMini + ")～(" + xMax + "," + yMax + ")";
                    newImg_resize_w = xMax - xMini;
                    newImg_resize_h = yMax - yMini;
                    dbMsg = dbMsg + "[" + newImg_resize_w + "×" + newImg_resize_h + "](" + xMax + "," + yMax + ")";
                    var contlorlX = 0; //newImg_shit_x - xMini;                          //newImg_shit_x - xMini;
                    if (0 < dX) {                                                   //右へ
                        switch (naPattern) {
                            case 5:                                                         // 左下-右-左上、
                            case 6:                                                         //左上-右-左下、
                                contlorlX = -newImg_resize_w;
                                break;
                            default:
                                contlorlX = targetXE - xMax + d_Width; //(b_xEnd + dX) - newImg_resize_w;
                                break;
                        }                                       //旋回運動のy方向拡張  
                        pW[0].x += contlorlX;
                        pW[1].x += contlorlX;
                        pW[2].x += contlorlX;
                        pW[3].x += contlorlX;
                    } else if (dX < 0) {                                               //左へ
                        contlorlX = xMini - targetXS;
                        pW[0].x -= contlorlX;
                        pW[1].x -= contlorlX;
                        pW[2].x -= contlorlX;
                        pW[3].x -= contlorlX;
                    }                                                               //進行方向に合わせて左右調整
                    var contlorlY = 0;
                    if (0 < dY) {                                                   //下へ
                        switch (naPattern) {
                            case 6:                                                         //左上-右-左下、
                            case 7:                                                             //右上-左-右下
                                contlorlY = -newImg_resize_h + targetYS;
                                break;
                            default:
                                contlorlY = targetYE - yMax + d_hight;
                                break;
                        }                                       //旋回運動のy方向拡張  
                        pW[0].y += contlorlY;
                        pW[1].y += contlorlY;
                        pW[2].y += contlorlY;
                        pW[3].y += contlorlY;
                    } else if (dY < 0) {                                               //上へ
                        contlorlY = yMini - targetYS; //(b_y - yMini) + (b_hight - newImg_resize_h) / 2;
                        pW[0].y -= contlorlY;
                        pW[1].y -= contlorlY;
                        pW[2].y -= contlorlY;
                        pW[3].y -= contlorlY;
                    }                                                               //進行方向に合わせて上下調整
                    dbMsg = dbMsg + ",contlorl(" + contlorlX + "," + contlorlY + ")";
                    if (!isToEnd) {
                        newImg_shit_x = Math.min(pW[0].x, pW[1].x, pW[2].x, pW[3].x);
                        newImg_shit_y = Math.min(pW[0].y, pW[1].y, pW[2].y, pW[3].y);
                        xMax = Math.max(pW[0].x, pW[1].x, pW[2].x, pW[3].x);
                        yMax = Math.max(pW[0].y, pW[1].y, pW[2].y, pW[3].y);
                        dbMsg = dbMsg + ",>>(" + newImg_shit_x + "," + newImg_shit_y + ")";
                        centerX = newImg_shit_x + newImg_resize_w / 2;
                        centerY = newImg_shit_y + newImg_resize_h / 2;
                        dbMsg = dbMsg + ",center(" + centerX + "," + centerY + ")(" + xMax + "," + yMax + ")";
                        switch (naPattern) {
                            case 4:                                                             //右下-左-右上
                            case 5:                                                         // 左下-右-左上、
                            case 6:                                                         //左上-右-左下、
                            case 7:                                                             //右上-左-右下
                                if (targetYS < reverceY) {                                //上半分なら
                                    contlorlY = -remain2Stop;
                                } else {
                                    contlorlY = remain2Stop * 10;
                                }
                                pW[0].y += contlorlY;
                                pW[1].y += contlorlY;
                                pW[2].y += contlorlY;
                                pW[3].y += contlorlY;
                                break;
                        }                                       //旋回運動のy方向拡張 
                        if (naPattern == 5 || naPattern == 6) {
                            newImg_shit_x = b_x + dX;
                        }                                       //旋回運動のx座標修正 
                        if (naPattern == 6 || naPattern == 7) {
                            newImg_shit_y = b_y + dY;
                        }                                       //旋回運動のy座標修正
                    }               //中心へ
                    photX = Math.min(pW[0].x, pW[1].x, pW[2].x, pW[3].x) - newImg_resize_w / 2;
                    photW = newImg_resize_w * 2;
                    photY = Math.min(pW[0].y, pW[1].y, pW[2].y, pW[3].y) - newImg_resize_h / 2;
                    photH = newImg_resize_h * 2;
                    if (Math.abs(dY) < Math.abs(dX)) {
                        if (dX < 0) {                                               //左へ
                            photX -= newImg_resize_w;
                        }
                        photW += newImg_resize_w;
                    } else {
                        if (0 < dY) {                                                   //下へ
                            photY -= newImg_resize_h;
                        }
                        photH += newImg_resize_h;
                    }
                    if (!tfEnd) {                                                   //XZ.YZを戻し終えるまで
                        dbMsg = dbMsg + "、最終p0(" + pW[0].x + "," + pW[0].y + "),p1(" + pW[1].x + "," + pW[1].y + "),p2(" + pW[2].x + "," + pW[2].y + "),p3(" + pW[3].x + "," + pW[3].y + ")";
                        drawPerspective(ctx, iObj, orgW, orgH, pW); //三角分割する
                        dbMsg = dbMsg + ",resize_[" + newImg_resize_w + "×" + newImg_resize_h + "]";
                    }
                    dbMsg = dbMsg + ">回避；photID=" + photID + "(" + photX + "," + photY + "," + photZ + ")[" + photW + "×" + photH + "×" + photT + "]";
                    rewitePhotAria(); //回避エリアを更新
                    testRect(100, 100, 100, 100, 0, 'red', 0, 1);
                    ctx.setTransform(1, 0, 0, 1, 0, 0); //setTransform;マトリックス変形 ctxのwidth×heightは変化しない
                }
                myLog(dbMsg);
            }
                , PhotAFRate)); // ミリ秒ごとにキャンバスを再描画
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；';
            back2Main(dbMsg);
        }
    }                                                                           //シアーで登場した写真を定位置まで移動

    function scaleOfZ(vpPer, orgW, orgH, newImg_shit_z) {
        var tag = "[arrival.scaleOfZ]";
        var dbMsg = tag + "Z=" + newImg_shit_z;
        var newImg_resize_w = -newImg_shit_z * Math.tan(vpPer) + winW * Math.tan(vpPer);
        var scale_xy = newImg_resize_w / orgW; //1 / Math.max(newImg_shit_z / winW, 0.001);
        dbMsg = dbMsg + "で" + scale_xy * 100 + "%";
        var newImg_resize_h = orgH * scale_xy;
        dbMsg = dbMsg + ",resize_[" + newImg_resize_w + "×" + newImg_resize_h + "]";
        //    myLog(dbMsg);
        return { scale_xy: scale_xy, newImg_resize_w: newImg_resize_w, newImg_resize_h: newImg_resize_h };
    }

    //Pointクラス
    function Point(x, y) {
        this.x = x;
        this.y = y;
        return { x: this.x, y: this.y };
    }

    /**
     * パースをかける
     * w, h, //元画像のオリジナルサイズ、wは横、hは縦
     * http://akibahideki.com/blog/html5-canvas-1/canvas.html       (40,80)[400×300]の画像を台形化
     * */
    function drawPerspective(ctx, img, wO, hO, pW) {
        var tag = "[arrival.drawPerspective]";
        var dbMsg = tag + "ctx[" + ctx.width + "×" + ctx.height + "]";
        var dbMsg = dbMsg + "元画像のオリジナルサイズ[" + wO + "×" + hO + ")";
        dbMsg = dbMsg + "、p0(" + pW[0].x + "," + pW[0].y + "),p1(" + pW[1].x + "," + pW[1].y + "),p2(" + pW[2].x + "," + pW[2].y + "),p3(" + pW[3].x + "," + pW[3].y + ")";
        ctx.clearRect(-winW, -winH, winW * 2, winH * 2); //ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.save(); //セグメント1
        ctx.beginPath(); //四角形のパスを描く
        ctx.strokeStyle = "yellow";
        ctx.moveTo(pW[0].x, pW[0].y);
        ctx.lineTo(pW[1].x, pW[1].y);
        ctx.lineTo(pW[3].x, pW[3].y);
        ctx.lineTo(pW[2].x, pW[2].y);
        ctx.closePath(); //四角形のパス終了
        if (!debug_now) {
            ctx.clip(); //以下に描画される画像を、これまで描いた四角形でマスクする
        }
        //描画空間を変形（変換マトリックスを計算
        var m11 = (pW[1].x - pW[0].x) / wO;
        var m12 = (pW[1].y - pW[0].y) / wO;
        var m21 = (pW[2].x - pW[0].x) / hO;
        var m22 = (pW[2].y - pW[0].y) / hO;
        var dx = pW[0].x;
        var dy = pW[0].y;
        dbMsg = dbMsg + "img1(m11=" + m11 + ",m12=" + m12 + ",m21=" + m21 + ",m22=" + m22 + ",dx=" + dx + ",dy=" + dy + ")";
        ctx.setTransform(m11, m12, m21, m22, dx, dy); //上記のt1〜t6の計算結果で描画空間を変形させる
        ctx.drawImage(img, 0, 0); //変形した空間に画像（写真）を配置
        ctx.restore(); //クリップ（マスク）領域をリセット

        ctx.save(); //セグメント2
        ctx.beginPath(); // 右下の三角形を描く
        ctx.strokeStyle = "red";
        ctx.moveTo(pW[1].x, pW[1].y);
        ctx.lineTo(pW[2].x, pW[2].y);
        ctx.lineTo(pW[3].x, pW[3].y);
        ctx.closePath(); // 右下の三角形のパス終了
        ctx.clip(); //以下に描画される画像を、これまで描いた三角形でマスクする

        m11 = (pW[3].x - pW[2].x) / wO;
        m12 = (pW[3].y - pW[2].y) / wO;
        m21 = (pW[3].x - pW[1].x) / hO;
        m22 = (pW[3].y - pW[1].y) / hO;
        dx = pW[2].x;
        dy = pW[2].y;
        dbMsg = dbMsg + "img2(m11=" + m11 + ",m12=" + m12 + ",m21=" + m21 + ",m22=" + m22 + ",dx=" + dx + ",dy=" + dy + ")";
        ctx.setTransform(m11, m12, m21, m22, dx, dy); //上記のt1〜t6の計算結果で描画空間を変形させる
        ctx.drawImage(img, 0, 0 - hO); //変形した空間に画像（写真）を配置
        ctx.restore(); //クリップ（マスク）領域をリセット
        if (debug_now) {
            ctx.stroke(); //db;マスクの外形
        }
        //   myLog(dbMsg);
    }

    /**
     * 手前下から上奥手に移動する形状
     * */
    function fpsB2T(pW, thX, thY) {
        var tag = "[arrival.fpsB2T]";
        var dbMsg = tag + "、p0(" + pW[0].x + " , " + pW[0].y + " ),p1(" + pW[1].x + " , " + pW[1].y + " ),p2(" + pW[2].x + " , " + pW[2].y + " ),p3(" + pW[3].x + " , " + pW[3].y + " )";
        var newImg_shit_x = pW[0].x;
        var newImg_shit_y = pW[0].y;
        var newImg_resize_w = pW[3].x - pW[2].x;
        var newImg_resize_h = pW[2].y - pW[0].y;
        dbMsg = dbMsg + "(" + newImg_shit_x + "×" + newImg_shit_y + "に[" + newImg_resize_w + "×" + newImg_resize_h + "]を{" + thX + "、" + thY + "}で変形";
        pW[0].x += thX;
        pW[0].y += thY;
        pW[1].x -= thX;
        pW[1].y += thY;
        pW = pointAmend(pW);
        dbMsg = dbMsg + ">p0>(" + pW[0].x + " , " + pW[0].y + " ),p1(" + pW[1].x + " , " + pW[1].y + " ),p2(" + pW[2].x + " , " + pW[2].y + " ),p3(" + pW[3].x + " , " + pW[3].y + " )";
        //        myLog(dbMsg);
        return pW;
    }

    /**
     * 手前左から右奥手に移動する形状
     * */
    function fpsL2R(pW, thX, thY) {
        var tag = "[arrival.fpsL2R]";
        var dbMsg = tag + "、p0(" + pW[0].x + " , " + pW[0].y + " ),p1(" + pW[1].x + " , " + pW[1].y + " ),p2(" + pW[2].x + " , " + pW[2].y + " ),p3(" + pW[3].x + " , " + pW[3].y + " )";
        var newImg_shit_x = pW[0].x;
        var newImg_shit_y = pW[0].y;
        var newImg_resize_w = pW[1].x - pW[0].x;
        var newImg_resize_h = pW[2].y - pW[0].y;
        dbMsg = dbMsg + "(" + newImg_shit_x + "×" + newImg_shit_y + "に[" + newImg_resize_w + "×" + newImg_resize_h + "]を{" + thX + "、" + thY + "}で変形";
        pW[1].x -= thX;
        pW[1].y += thY;
        pW[3].x -= thX;
        pW[3].y -= thY;
        pW = pointAmend(pW);
        dbMsg = dbMsg + ">p0>(" + pW[0].x + " , " + pW[0].y + " ),p1(" + pW[1].x + " , " + pW[1].y + " ),p2(" + pW[2].x + " , " + pW[2].y + " ),p3(" + pW[3].x + " , " + pW[3].y + " )";
        //        myLog(dbMsg);
        return pW;
    }

    /**
     * 手前上から下奥手に移動する形状
     * */
    function fpsT2B(pW, thX, thY) {
        var tag = "[arrival.fpsT2B]";
        var dbMsg = tag + "、p0(" + pW[0].x + " , " + pW[0].y + " ),p1(" + pW[1].x + " , " + pW[1].y + " ),p2(" + pW[2].x + " , " + pW[2].y + " ),p3(" + pW[3].x + " , " + pW[3].y + " )";
        var newImg_shit_x = pW[0].x;
        var newImg_shit_y = pW[0].y;
        var newImg_resize_w = pW[1].x - pW[0].x;
        var newImg_resize_h = pW[2].y - pW[0].y;
        dbMsg = dbMsg + "(" + newImg_shit_x + "×" + newImg_shit_y + "に[" + newImg_resize_w + "×" + newImg_resize_h + "]を{" + thX + "、" + thY + "}で変形";
        pW[0].y += thY;
        pW[1].y += thY;
        pW[2].x += thX;
        pW[3].x -= thX;
        pW = pointAmend(pW);
        dbMsg = dbMsg + ">p0>(" + pW[0].x + " , " + pW[0].y + " ),p1(" + pW[1].x + " , " + pW[1].y + " ),p2(" + pW[2].x + " , " + pW[2].y + " ),p3(" + pW[3].x + " , " + pW[3].y + " )";
        //        myLog(dbMsg);
        return pW;
    }

    /**
     * 手前右から左奥手に移動する形状
     * @param {flort[]} pW 4頂点座標
     * @param {flort} thX, thY  左右パース時の左右辺の差
     * */
    function fpsR2L(pW, thX, thY) {
        var tag = "[arrival.fpsR2L]";
        var dbMsg = tag + "、p0(" + pW[0].x + " , " + pW[0].y + " ),p1(" + pW[1].x + " , " + pW[1].y + " ),p2(" + pW[2].x + " , " + pW[2].y + " ),p3(" + pW[3].x + " , " + pW[3].y + " )";
        var newImg_shit_x = pW[0].x;
        var newImg_shit_y = pW[0].y;
        var newImg_resize_w = pW[1].x - pW[0].x;
        var newImg_resize_h = pW[2].y - pW[0].y;
        dbMsg = dbMsg + "(" + newImg_shit_x + "×" + newImg_shit_y + "に[" + newImg_resize_w + "×" + newImg_resize_h + "]を{" + thX + "、" + thY + "}で変形";
        pW[1].x -= thX;
        pW[3].x -= thX;
        pW[0].y += thY;
        pW[2].y -= thY;
        pW = pointAmend(pW);
        dbMsg = dbMsg + ">p0>(" + pW[0].x + " , " + pW[0].y + " ),p1(" + pW[1].x + " , " + pW[1].y + " ),p2(" + pW[2].x + " , " + pW[2].y + " ),p3(" + pW[3].x + " , " + pW[3].y + " )";
        //        myLog(dbMsg);
        return pW;
    }

    /**
     * 上下左右が逆転したポイントを修正する
     * */
    function pointAmend(pW) {
        var tag = "[arrival.pointAmend]";
        var dbMsg = tag + "、p0(" + pW[0].x + " , " + pW[0].y + " ),p1(" + pW[1].x + " , " + pW[1].y + " ),p2(" + pW[2].x + " , " + pW[2].y + " ),p3(" + pW[3].x + " , " + pW[3].y + " )";
        var irekae;
        if (pW[1].x < pW[0].x) {                                                //上辺
            irekae = pW[0].x;
            pW[0].x = pW[1].x;
            pW[1].x = irekae; //p0x + thX; では反転発生
            dbMsg = dbMsg + "上辺のx入れ替え"
            myLog(dbMsg);
        }
        if (pW[3].x < pW[2].x) {                                                //下辺
            irekae = pW[2].x;
            pW[2].x = pW[3].x;
            pW[3].x = irekae; //p0x + thX; では反転発生
            dbMsg = dbMsg + "下辺のx入れ替え"
            myLog(dbMsg);
        }
        if (pW[2].y < pW[0].y) {                                                //左辺
            irekae = pW[0].y;
            pW[0].y = pW[2].y;
            pW[2].y = irekae; //p0x + thX; では反転発生
            dbMsg = dbMsg + "左辺のy入れ替え"
            myLog(dbMsg);
        }
        if (pW[3].y < pW[1].y) {                                                //右辺
            irekae = pW[1].y;
            pW[1].y = pW[3].y;
            pW[3].y = irekae; //p0x + thX; では反転発生
            dbMsg = dbMsg + "右辺のy入れ替え"
            myLog(dbMsg);
        }
        dbMsg = dbMsg + ">p0>(" + pW[0].x + " , " + pW[0].y + " ),p1(" + pW[1].x + " , " + pW[1].y + " ),p2(" + pW[2].x + " , " + pW[2].y + " ),p3(" + pW[3].x + " , " + pW[3].y + " )";
        //        myLog(dbMsg);
        return pW;
    }

    /**
     * 渡されたcanvasを引き継ぎ、拡大して既定サイズになったら既定秒数停止
     * 拡大しながらフィードアウト
     * @param {Strings} imageURL 画像のURL
     * @param {int} quantity 登場させる枚数
     * @param {int} position 登場させる位置;0中央：1:左上　、2;右上、4;左下、8;右下  、3=1+2:上部、5=1+4:左、10=2+8;右、12=4+8:下部
     * 停止時のサイズはtargetW　など
     * */
    function caB2f(imgObj, quantity, position) {
        var tag = "[arrival.caB2f]";
        var dbMsg = tag + quantity + "枚構成で位置は" + position;
        try {
            var ctx = imgObj.ctx;
            var iObj = imgObj.iObj;
            var orgW = iObj.naturalWidth;
            var orgH = iObj.naturalHeight;
            var scale_xy = imgObj.scale;
            var newImg_shit_x = imgObj.x;
            var newImg_shit_y = imgObj.y;
            var newImg_shit_z = imgObj.z;
            var dbMsg = dbMsg + "渡されたcanvas=" + ctx.canvas.id + ",org[" + orgW + "×" + orgH + "]" + scale_xy * 100 + "%" +
                "(" + Math.round(newImg_shit_x) + "," + Math.round(newImg_shit_y) + "," + Math.round(newImg_shit_z) + ")";
            var dbMsg = dbMsg + "α=" + ctx.globalAlpha;
            var rect = document.getElementById(ctx.canvas.id).getBoundingClientRect();
            dbMsg = dbMsg + ",ctx(" + rect.left + "," + rect.top + ")[" + rect.width + "×" + rect.height + "]";
            photAria = [];
            photID = ctx.canvas.id;
            addPhotAria(ctx.canvas.id); //エフェクトに渡す写真情報
            var toOut = false
            var stayCount = 0;
            var endCount = stayTime / PhotAFRate;
            var dbMsg = dbMsg + ",停止指定" + stayTime + "ms=" + endCount + "カウント";
            var nowW = orgW * scale_xy;
            var nowH = orgH * scale_xy;
            dbMsg = dbMsg + ",スタートサイズ[" + nowW + "×" + nowW + "]" + scale_xy * 100 + "％";
            var targetW = winW / quantity * 0.5; //0.7>0.6>0.5(4/28)
            var targetScale = targetW / orgW;
            if (orgW < orgH) {
                var targetH = winH * 0.6; //0.7
                targetScale = targetH / orgH;
            }
            dbMsg = dbMsg + ",targetScale=" + targetScale * 100 + "%";
            if (0 < newImg_shit_z) {
                ctx.globalAlpha = 1.0;
            }
            if (ctx.globalAlpha < 0.9) {                        //消失からの復帰は
                nowW = winW / 100;              // winW / 100;
                scale_xy = nowW / orgW;
            }
            caB2fArray.push(newImg_fadeTimer = setInterval(function () {
                var dbMsg = "[caB2f]";
                photX = newImg_shit_x - 30; //- IMG_SIZE * 2; // + winW;                   //エフェクトに渡す逐次の座標情報
                photY = newImg_shit_y - 30; //- IMG_SIZE * 2; // + winH;
                photW = nowW + 60; // + IMG_SIZE * 4;
                photH = nowH + 60; // + IMG_SIZE * 4;
                photZ = -150; //newImg_shit_z - 200;
                photT = 200; //-150～250で追い出し
                if (toOut == true) {
                    isStayEnd = true; //画像のアニメーション静止終了
                    if (ctx.globalAlpha < 0.1) {
                        ctx.globalAlpha = 0.0;
                        var addID = arrivalsIDArray[0];
                        dbMsg = dbMsg + ",maxid= " + nowMaxId + ",addID= " + addID;
                        if (nowMaxId < addID) {
                            nowMaxId = addID;
                        }
                        dbMsg = dbMsg + "----caB2f終了----" + ",arrivalsIDArray=" + arrivalsIDArray.length + "件";
                        stopNIAnimation(caB2fArray);
                        dellElement(ctx.canvas.id, "newimg_div", 0);

                        var cookieiD = -1;
                        if ($.cookie('slideshow.max-id') != null) {
                            cookieiD = $.cookie('slideshow.max-id');                //20170315dell
                        }
                        dbMsg = dbMsg + '、cookieに記載されているID=' + cookieiD + '、type=' + typeof (nowMaxId) + '、newId=' + newId;
                        var maxId = localStorage.getItem("maxid");
                        dbMsg = dbMsg + 'localStorage=' + maxId;

                        if (cookieiD < newId || maxId < newId) {                         //☆重複処理が発生するとundefinedになる       && (newId != undefined || newId != 'undefined')
                            localStorage.setItem("maxid", newId);
                            $.cookie('slideshow.max-id', newId);
                        }
                        var allImages = JSON.parse(localStorage.getItem("all-keys"));
                        // dbMsg = dbMsg + '、再生待ちStock=' + allImages;
                        if (allImages != null) {
                            dbMsg = dbMsg + '、' + allImages.length + '件(最終' + allImages[allImages.length - 1];
                            allImages.push(newId);
                        } else {
                            allImages = [];
                            allImages[0] = newId;
                        }
                        dbMsg = dbMsg + '>>' + allImages.length + '件=' + allImages[allImages.length - 1];
                        localStorage.setItem("all-keys", JSON.stringify(allImages));            //JSON.stringify(newId)では0件から繋がらない        '[' + allImages + ']'

                        totalClount++;
                        $("#total_count").text(totalClount);
                        var photos_ids = JSON.parse(localStorage.getItem("photos"));
                        dbMsg = dbMsg + ',photos=' + photos_ids.length + '件=' + photos_ids[photos_ids.length - 1];
                        var delPosition = photos_ids.indexOf(newId);
                        dbMsg = dbMsg + "は" + delPosition + "番目";
                        photos_ids.splice(delPosition, 1);
                        localStorage.setItem("photos", JSON.stringify(photos_ids));
                        dbMsg = dbMsg + '>>' + photos_ids.length + '件=' + photos_ids[photos_ids.length - 1];
                        // console.log(localStorage);
                        farstArrival = false; //一通目;一通でも通過すれば最初では無い
                        myLog(dbMsg);
                        newImageWrite(); //新着処理ループへ戻る
                    } else {
                        ctx.globalAlpha = ctx.globalAlpha - 0.05; //FO                0.1では唐突,0.5でも早い、0.01では遅い
                        newImg_shit_z -= 30; //拡大     20では遅い         30では早い
                        var newScales = scaleOfZ(vpPer, orgW, orgH, newImg_shit_z);
                        scale_xy = newScales.scale_xy;
                        dbMsg = dbMsg + ",scale=" + scale_xy * 100 + "%";
                        nowW = orgW * scale_xy;
                        dbMsg = dbMsg + ">>" + nowW;
                        nowH = orgH * scale_xy;
                        newImg_shit_x = winW / 2 - nowW / 2;
                        newImg_shit_y = winH / 2 - nowH / 2;
                    }
                    dbMsg = dbMsg + ",Alpha=" + ctx.globalAlpha;
                    dbMsg = dbMsg + "scale_xy= " + scale_xy;
                } else if (scale_xy < targetScale) {                                        //設定した幅になるまでズームアップ
                    isStayEnd = false; //画像のアニメーション中
                    dbMsg = dbMsg + ",nowW=" + nowW;
                    if (scale_xy < (targetScale * 0.9)) {
                        if (ctx.globalAlpha < 1.0) {                                //前段で透過されていたら
                            ctx.globalAlpha = ctx.globalAlpha * 2 + 0.1; //可視状態に戻す
                        }
                        newImg_shit_z -= 20; //20は早すぎ      nowW += nowW * 0.1; //拡大
                        photX = newImg_shit_x - 50; //40だと追い付かない
                        photY = newImg_shit_y - 50;
                        photW = nowW + 100; //80だと追い付かない
                        photH = nowH + 100;
                    } else if ((targetScale * 0.9) < scale_xy && scale_xy < (targetScale * 1.01)) {
                        newImg_shit_z -= 5; //2は粘りすぎ      nowW += nowW * 0.005;
                    }
                    var newScales = scaleOfZ(vpPer, orgW, orgH, newImg_shit_z);
                    scale_xy = newScales.scale_xy;
                    dbMsg = dbMsg + ",scale=" + scale_xy + " * 100%";
                    nowW = orgW * scale_xy;
                    dbMsg = dbMsg + ">>" + nowW;
                    nowH = orgH * scale_xy;
                    newImg_shit_x = winW / 2 - nowW / 2;
                    newImg_shit_y = winH / 2 - nowH / 2;
                    photZ = newImg_shit_z - winW; //newImg_shit_z - winWで背面からの蹴りだし
                    photT = winW * 2; //winW * 2で背面からの蹴りだし

                } else {
                    stayCount++;
                    if (endCount < stayCount) {
                        dbMsg = dbMsg + ",stayCount=" + stayCount + "/endCount=" + endCount; //stayCount=41/endCount=40?
                        toOut = true;
                    } else if (stayCount == 1) {
                        removePhotAria(ctx.canvas.id); //回避エリアの消去
                        photAria = [];
                        dbMsg = dbMsg + ",photAria=~" + photAria.length + "件"; //回避エリアの消去
                    }

                }
                dbMsg = dbMsg + ">>(" + newImg_shit_x + "," + newImg_shit_y + "," + newImg_shit_z + ")[" + nowW + "×" + nowH + "]" + scale_xy + "%" + ",Alpha=" + ctx.globalAlpha;
                rewitePhotAria(); //回避エリアを更新
                dbMsg = dbMsg + ">回避；photID=" + photID + "(" + photX + "," + photY + "," + photZ + ")[" + photW + "×" + photH + "×" + photT + "]";
                drowPhotFream(ctx, iObj, newImg_shit_x, newImg_shit_y, nowW, nowH);
            }, PhotAFRate));
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；';
            back2Main(dbMsg);
        }
    }                                   // 新着アニメーションの終端；中心からFi～Fo;新着配列からStock配列への移し替え

    /**
     * フレームを付けて写真描画
     * */
    function drowPhotFream(ctx, iObj, x, y, wi, hi) {
        var tag = "[arrival.drowPhotFream]";
        var dbMsg = tag + "(" + x + "," + y + ")[" + wi + "×" + hi + "]";
        try {
            var lWidth = 10;
            lWidth = wi / winW / 2;
            var dbMsg = dbMsg + "に" + lWidth + "の枠をつけると";
            ctx.clearRect(-winW, -winH, winW * 2, winH * 2); //×ctx.canvas.width, ctx.canvas.heigh
            flX = x - lWidth / 2;
            flY = y - lWidth / 2;
            flW = wi + lWidth;
            flH = hi + lWidth;
            dbMsg = dbMsg + "(" + flX + "," + flY + ")[" + flW + "×" + flH + "]";
            ctx.lineWidth = lWidth; //線の太さ☆指定座標を中心に線を引く
            ctx.strokeStyle = 'rgb(255,255,255)'; //枠線の色は白
            ctx.lineCap = "round"; //線の端を丸くする http://www.pori2.net/html5/Canvas/050.html
            ctx.strokeRect(flX, flY, flW, flH);
            ctx.drawImage(iObj, x, y, wi, hi); //書き込み        myLog(dbMsg);
        } catch (e) {
            dbMsg = dbMsg + 'でエラー；';
            back2Main(dbMsg);
        }
        return ctx;
    }

    $(window).resize(function () {
        var dbMsg = "[window.resize]";
        resize_now = true; //リドロウ以降に画面サイズが変わった
        winW = $(window).width();
        winH = $(window).height();
        dbMsg = dbMsg + "[" + winW + "×" + winH + "]";
        if (ceremonies_slide_bg == 0 || ceremonies_slide_bg == 1) {
            wallDraw(b_bgv, winW, winH); //キャンバスに静止画読み込み
        }
        // effectInit();
        myLog(dbMsg);
        resize_now = false; //リドロウ以降に画面サイズが変わった
    }); //ウインドウサイズが変更されたときの処理

    function delElement(canvasID) {
        var dbMsg = "[delElement]";
        if (document.getElementById(canvasID)) {            //同一IDのエレメントが有れば
            dbMsg = dbMsg + "既存の" + canvasID + "を削除";
            var delNode = document.getElementById(canvasID);
            if (delNode) {
                delNode.parentNode.removeChild(delNode); //特定の子要素削除
            }
        }
    }

    //デバッグツール///////////////////////////////////////////////////////////////////スレッド管理/////
    function myLog(msg) {
        if (debug_now) {
            //        if (msg.responseText) {                   //デバッガーによっては長すぎて落ちる
            //            msg = msg.responseText;
            //        }
            // if ($is_mobile || $is_tablet) {
            //     alert(msg);
            // } else {
            console.log(msg);
            // }
        }
    }

    function tStamp() {
        var date = new Date();
        var unixTimestamp = date.getTime();
        var mS = unixTimestamp - b_time;
        b_time = unixTimestamp;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
        var min = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
        var sec = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
        return hour + ':' + min + ':' + sec + '(' + mS + ')';
    }

    var long_message;
    function showPage() {
        //http://amenti.usamimi.info/windowopen.html
        //        var page = window.open(this.href, "_blank", "width=80%,height=auto,top=50,left=50, menubar=yes, toolbar=yes, scrollbars=yes ");             //url ( this.href ) , name [, features]// サイズを指定すると新規ウィンドウで開く
        //        page.document.open();
        //        page.document.write(long_message);
        //        page.document.close();
        //        long_message = null;
        //        $('#long_message_eria').css({"display": "none"});
    }

    /**
     *
     * */
    function testRect(x, y, wi, hi, deg, sStyle, lCount, chCount) {
        var dbMsg = "[testRect]";
        if (debug_now) {
            dbMsg = dbMsg + "(" + x + " , " + y + ")[" + wi + "×" + hi + "]" + deg + "°、sStyle=" + sStyle;
            var canvasID = "testCa2";
            if (deg == 5) {
                canvasID = "testCa1";
            }
            dbMsg = dbMsg + ",canvasID=" + canvasID;
            if (document.getElementById(canvasID)) {            //同一IDのエレメントが有れば
                delElement(canvasID);
            }
            var testCanvas = document.createElement("canvas");
            dbMsg = dbMsg + ",efectCanvas=" + testCanvas;
            efectOj = document.getElementById("newimg_div"); //efectCanvasの親ノード
            dbMsg = dbMsg + ",efectCanvasの親ノード=" + efectOj.id;
            efectOj.appendChild(testCanvas); // 親ノードの末尾にクローンノードを追加
            testCanvas.setAttribute("id", canvasID); //       newImg_canvas.id = "canvas" + Nid; // クローンノードのID名を付け替え
            dbMsg = dbMsg + ",win[" + winW + "×" + winH + "]";
            $("#" + testCanvas.id).attr("width", winW + "px").attr("height", winH + "px").css({ 'display': 'inline-block' }).css({ 'position': 'absolute' }); //static                main.cssの対策   .attr("background-color", 'transparent')
            dbMsg = dbMsg + "追加したエレメント" + testCanvas.id + ",[" + testCanvas.width + "×" + testCanvas.height + "]";
            testCtx = testCanvas.getContext('2d'); //☆ページロード直後は非表示なのでサイズプロパティーは取れない
            dbMsg = dbMsg + ">effectContex>" + testCtx.id;

            if (sStyle) {
                testCtx.strokeStyle = sStyle; //指定色に設定
            } else {
                if (lCount < 0) {
                    testCtx.strokeStyle = "green"; //db;線の色を赤にする（最終的に不要）
                } else if (lCount < chCount) {
                    testCtx.strokeStyle = "blue"; //db;線の色を赤にする（最終的に不要）
                } else {
                    var rVal = lCount * 2;
                    testCtx.strokeStyle = "rgb(" + rVal + ", 128, 0)"; //db;線の色を赤にする（最終的に不要）
                }
            }
            // testCtx.beginPath(); //パスを描画開始
            if (deg != 0) {
                var rad = deg * Math.PI / 180;
                // testCtx.rotate(rad);
                // x = x - hi * Math.sin(rad);
                // y = y - wi * Math.sin(rad);
                var dX = wi * Math.tan(rad); //wi
                var dY = hi * Math.tan(rad); //hi
                dbMsg = dbMsg + "、移動(" + dX + "," + dY + ")";
                testCtx.setTransform(1, 0, 0, 1, 0, 0);
                testCtx.setTransform(Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), dX, dY);
            }
            testCtx.strokeRect(x, y, wi, hi);
            testCtx.closePath(); //パスを閉じる、三角形の形が決まる
            testCtx.stroke();
            //     myLog(dbMsg)
        }
    }
})(jQuery);
////////////////////////////////////////////////////////////デバッグツール///
/*
 * Canvasアニメーションの要点                http://qiita.com/nekoneko-wanwan/items/33afa5d20264c83b2bd1
 *
 * 奥行きのあるSAKURA                       http://jsdo.it/blogparts/hXeH
 canvasの範囲で壁にバウンドして動く円        http://honttoni.web.fc2.com/blog_honttoni/samples/sample69set/index13-1.html
 物理エンジン「Matter.js」で                 http://sterfield.co.jp/designer/%E7%89%A9%E7%90%86%E3%82%A8%E3%83%B3%E3%82%B8%E3%83%B3%E3%80%8Cmatter-js%E3%80%8D%E3%81%A7canvas%E3%82%A2%E3%83%8B%E3%83%A1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%AE%E8%B3%AA%E6%84%9F%E3%82%92/
 KAYAC DESIGNER'S BLOG                            http://design.kayac.com/topics/2012/12/canvasArtScripting.php
 Trail Fader           161 lines                      http://jsdo.it/hakim/fxVB
 Physics Synthesizer   203 lines                      http://jsdo.it/matsu4512/zUpI
 Wavy colorful paths   89 lines                      http://jsdo.it/y3i12/WavyPaths
 線香花火的な何か       228 lines                     http://jsdo.it/bugcloud/6ieo
 線香花灯              CoffeeScript 154 lines           http://jsdo.it/_moritam/4OG2
 曲率さくら             218 lines                     http://jsdo.it/totetero/sakura

 HTML 5 canvas要素 + Javascriptで作る、動的コンテンツ    http://yoppa.org/taumedia10/2065.html
 **/
