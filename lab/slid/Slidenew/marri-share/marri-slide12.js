//背景設定//////////////////////////////////////////////////////////////////    
function slideStart() {
    var dbMsg = "[slideStart]";
    //        dbMsg = dbMsg + ",ceremonyId= " + ceremonyId;
    //        dbMsg = dbMsg + ",token= " + token;
    dbMsg = dbMsg + ",ceremonies_slide_bg= " + ceremonies_slide_bg;             //DBから取得
    if (ceremonies_slide_bg) {                                                   //取得できていれば処理開始
        naPattern = -1;
        arrivalsArray = new Array();
        arrivalsIDArray = new Array();
        winW = $(window).width();
        winH = $(window).height();
        vanishingPoint = winW;
        vpPer = Math.atan((vanishingPoint * stayScale) / vanishingPoint); //原点から消失点までの角度     Math.atan(orgW / winW)
        photX = winW / 2 - winW / 10; //エフェクトに渡す逐次の座標情報
        photY = winH / 2 - winH / 10;
        photW = winW / 10;
        photH = winH / 10;
        IMAGE_URL = image_url00;
        if (debug_now == true) {
            $("#count_moniter").css({ 'display': 'inline' });
        } else {
            $("#count_moniter").css({ 'display': 'none' });
        }
        naPattern = -1;
        bgWall();                //背景設定後mainLoopStartへ
    } else {                                                                //DBから値が取得できていれば処理開始
        window.location.reload(); //再読み込み
    }
    myLog(dbMsg);
}                                               //指定された壁紙を設定,effectInitを経てストックループスタート
/////marri-slide.jsから抜粋したアニメーション実行部分/////////////////////////////////////////////////////

/**
 * $(document).ready終端から呼ばれる
 * 呼び出し元；bgWallで背景とeffectInitでエフェクトアニメの初期設定が終わった処で開始
 * */
function mainLoopStart() {       //marri-slide.jsの$.fn.slideshow相当
    var dbMsg = "[mainLoopStart()]> slide loaded";
    clearLocalStorage();
    //org;    var promise = initialize(); //albumIdとphotosの配列をidsに取得し、localStorageに保存
    //    promise.done(function () {
    //      pFunction();
    //   });  
}

/*
 * localStorage削除
 * 呼び出し元は　initialize
 */
function clearLocalStorage() {
    var dbMsg = "[slidenew・clearLocalStorage]";
    localStorage.removeItem('all-keys');        // 現時点でのイメージリスト(id)
    localStorage.removeItem('update-keys');      // 新着イメージリスト(id)
    localStorage.removeItem('queue'); // キューに入っているイメージ情報(id, url, ...)
    localStorage.removeItem('displayed'); // 表示されているイメージ情報(id, url, ...)
    localStorage.removeItem('resent-update');
    dbMsg = dbMsg + '>>> local storage cleared';
    //  myLog(dbMsg);
    initialize();
}

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
            //console.log(data);
            setLocalStorage(data); //key名"all-keys"で渡されたデータをlocalStorageに保存,最終のphot_IDをmaxidに登録
        }).fail(function (data) {
            dbMsg = dbMsg + '全データ読み込み失敗initialize failed.';
            //                            dbMsg = dbMsg + ">fail>" + data.responseText;
            if ($.cookie('slideshow.max-id') != null) {             //前回利用時に
                if (0 < $.cookie('slideshow.max-id')) {               //データが有るのにfallss
                    dbMsg = dbMsg + ",前回最終=" + $.cookie('slideshow.max-id');
                    myLog(dbMsg);
                    window.location.reload(); //再読み込み
                }
            }
        }).always(function () {
            //        defer.resolve();
        });                                                                     //初回の全photID取得
        dbMsg = dbMsg + '>> initialize ended.';
        myLog(dbMsg);
        //    return defer.promise(); // ogrプロミスを作って返す
    } catch (e) {
        dbMsg = dbMsg + 'でエラー；';
        console.log(dbMsg);
        window.location.reload(); //再読み込み
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
            //            upDateStr =Math.round( date.getTime() / 1000 );         //1490663904.	                 //getFullYear();
            //            upDateStr = upDateStr + upDate.getMonth();
            //            upDateStr = upDateStr + upDate.getDate();

            $("#arrival_id").text("前回起動=" + upDateStr + ",今日は" + toDateStr);
        }
        dbMsg = dbMsg + '、開始時点でcookieに記載されているID=' + cookieiD + '、type=' + typeof (cookieiD);         //有ればslideshow.max-id=33377;CakeCookie[auths]=Q2Fr....
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
                    noArrivalLoopLimit = 0;
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
        localStorage.setItem("update-keys", null);
        localStorage.setItem("maxid", cookieiD);
        localStorage.setItem("queue", null);
        localStorage.setItem("displayed", null);
        localStorage.setItem("resent-update", new Date());                      //読み込み時刻を現在に
        dbMsg = dbMsg + '>>> local storage initialized';
        $("#total_count").text(totalClount);
        myLog(dbMsg);
        console.log(localStorage);
        pushNewImages();                                                    //新着確認開始
        pFunction();
    } catch (e) {
        dbMsg = dbMsg + 'でエラー；';
        console.log(dbMsg);
        window.location.reload(); //再読み込み
    }
}                                 //key名"all-keys"で渡されたデータをlocalStorageに保存  と Stick0件時のメッセージ表示

/**
 * slideshow/updateでlastで渡す最終のphot_idから遡って20件をupdate配列に取得し、localStorageにupdate-keysで保存。resent-updateを更新
 * slidenewController.phpのupdateで $photos = $this->Photo->getNewPhotoList($albumId, $lastId, 20);　と指定
 * dataQueueingから呼ばれる
 * */
function pushNewImages() {
    var tag = "[slidenew・pushNewImages]";
    var dbMsg = tag;
    if (0 < totalClount && isReload) {
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
        var dbMsg = tag + ",抽出上限;現在のmaxId=" + maxId;
        if (localStorage.getItem("all-keys") != "null") {                   //Strockが有れば
            var allK = localStorage.getItem("all-keys");
            if (allK) {
                var maxId2 = allK[allK.lenght - 1];                         //Stockの最終IDが
                if (maxId < maxId2) {                                       //localStorageの書き込み値を超えていたら
                    maxId = maxId2;                                         //閾値更新(localStorage.maxidの祖語確認)
                    dbMsg = dbMsg + ">all-keysから更新>" + maxId;
                }
            }
        }
        if (maxId < newId) {                                                //(無ければnewId = -1)
            maxId = newId;
            dbMsg = dbMsg + ">既にdataQueueingを通過している新着ID>" + maxId;
        }
        var newImages = [];                                                 //新着配列
        if (localStorage.getItem("update-keys") != "null") {                //localStorageに読み込んでいる新着IDが有れば
            newImages = JSON.parse(localStorage.getItem("update-keys"));    //新着配列に転記
        }
        if (newImages) {                    // == null || undefined
            newImages = [];
            dbMsg = dbMsg + ",処理中の新着無し";
        } else {
            dbMsg = dbMsg + ",処理中の新着=" + newImages.lenght + "件";
            if (0 < newImages.lenght) {
                maxId = newImages[newImages.lenght - 1];                    //処理中の最大IDを閾値に更新
                dbMsg = dbMsg + ">抽出上限更新>" + maxId;
            }
            dbMsg = dbMsg + ",既に読み込まれている新着ID=" + newImages.length + "件=" + newImages.toLocaleString();
        }
        if (newImages != null) {
            if (0 == newImages.length) {                                        //処理中の新着が無ければ新着確認
                var urlStr = "/" + ceremonyId + "/slidenew/update/token:" + token + "/";
                //                dbMsg = dbMsg + ",urlStr=" + urlStr;
                $.ajax({
                    type: "POST",
                    url: urlStr,
                    data: { "last": maxId },
                    dataType: "json"
                }).done(function (data) {
                    //   console.log(data);
                    if (data.update) {
                        if (totalClount == 0) {
                            farstArrival = true; //一通目
                        } else {
                            farstArrival = false; //一通目
                        }
                        dbMsg = dbMsg + ",一通目か=" + farstArrival;
                        dbMsg = dbMsg + "update=" + data.update.toLocaleString();
                        newImages = data.update;
                        if (newImages != null) {
                            dbMsg = dbMsg + ">>読み込み後の新着ID= " + newImages.length + "件=" + JSON.stringify(newImages);   //newImages.toLocaleString();
                            localStorage.setItem("update-keys", JSON.stringify(newImages));
                            localStorage.setItem("resent-update", new Date());
                            newId = newImages[newImages.length - 1];                //読み込み終えた新着ID
                            dbMsg = dbMsg + "=" + JSON.parse(localStorage.getItem("update-keys"));   //newImages.toLocaleString();
                            dbMsg = dbMsg + ",最終=" + newId + "までの処理開始>>dataQueueing()へ";
                            myLog(dbMsg);
                            //                        console.log(localStorage);
                            $("#info_bord").css({ 'display': 'none' });                     //投稿待ちインフォメーション
                            isReload = false;
                            totalClount++;
                            reloadCount = 0;             //新着が届かなかったカウント
                        }
                        dataQueueing();                                                     //無いと止まる？
                    } else {
                        reloadCount++;
                        dbMsg = dbMsg + ">>新着無し" + reloadCount + "回目";
                        if (totalClount == 0 && reloadLimit < reloadCount) {          //新着が届かなかったカウント
                            reLoadJanction();
                        }
                    }
                    myLog(dbMsg);
                }).fail(function (data) {
                    //                myLog(data.responseText);
                }).always(function () {
                    //                dataQueueing();                                                     //無いと止まる？
                });
            }
        }
        newImageReading = false;    //新着確認中
        myLog(dbMsg);
        if (totalClount == 0 && reloadLimit < reloadCount) {          //新着が届かなかったカウント
            isReload = false;
            reLoadJanction();
        } else {
            setTimeout(function () {
                pushNewImages()
            }, queuing_time);
        }
    }
}                                       //slidenew/updateでlastで渡す最終のphot_idから遡って20件をupdate配列に取得し、localStorageにupdate-keysで保存。resent-updateを更新

/**
 * 2312;新着用のID配列を作成し、ストックの末尾に追記しておく
 * */
function readNewImages(images, wrArray) {
    var tag = "[slidenew・readNewImages]";     //既存max＝" + nowMaxId;
    var maxId = localStorage.getItem("maxid");
    var dbMsg = tag + ",現在のmaxId=" + maxId;
    //☆   arrivalsIDArray = images.concat(); で配列の要素コピーでは追記にならないので
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
    myLog(dbMsg);
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
    var dbMsg = "[slidenew・dataQueueing]";
    //        dbMsg = dbMsg + ",queuing_time=" + queuing_time + "ms";
    dbMsg = dbMsg + ",読み込み確認=" + queueingCount + "/" + queueingLimit;
    try {
        if (queueingLimit < queueingCount) {
            dbMsg + ">>リロード";
            isQueueing = false;
            farstArrival = false;
            reLoadJanction();
            return;
        }
        var images = JSON.parse(localStorage.getItem("all-keys"));      //全データ
        dbMsg = dbMsg + "開始時ストック=" + images;
        dbMsg = dbMsg + "、新着=" + JSON.parse(localStorage.getItem("update-keys"));
        if (isReload) {
            dbMsg = dbMsg + ">>>リロード中 ";
            return;
        } else if (images == null && 0 < localStorage.getItem("maxid")) {           //localStorage.getItem("all-keys") == "null"
            dbMsg = dbMsg + ">>>再生終了 ";
            reLoadJanction();
        } else if (isQueueing) {
            dbMsg = dbMsg + ">>データ読み取り中";
        } else if (isStock) {
            dbMsg = dbMsg + ">>>ストック再生中 ";
        } else if (isArrival) {
            dbMsg = dbMsg + ">>>新着再生中 ";
        } else if (totalClount == 0 && !farstArrival) {
            dbMsg = dbMsg + ">>>ストック無しで新着でもない"
        } else {
            //            console.log(localStorage);
            isQueueing = true; //データ読み取り中
            var queue = [];

            localStorage.setItem("queue.status", "running");
            var newMax = 0;
            var nowMax = localStorage.getItem("maxid");
            if (images != null) {
                if (0 < images.length) {
                    images.sort();                                       //0317;追越防止
                }
                dbMsg = dbMsg + "、ストック残り" + images.length + "件";
                nowMax = images[images.length - 1];                         //newMax?
                $("#max_id").text(nowMax);
                $("#now_play_count").text(images.length);
            }

            $("#arrival_id").text("無し");

            var newImages = [];                                             //新着配列
            if (localStorage.getItem("update-keys") != "null") {                //Uncaught SyntaxError: Unexpected token u in JSON at position 0対策
                newImages = JSON.parse(localStorage.getItem("update-keys"));
                //            console.log(localStorage);
                newImages.sort();                                       //0317;追越防止
            }
            if (newImages == null) {
                newImages = [];
            } else if (0 < newImages.length) {                                                            //if (0 < newImages.length) 
                newMax = newImages[newImages.length - 1];                       //undefined
                $("#arrival_id").text(newMax + "まで");
                dbMsg = dbMsg + ",新着=" + newImages.length + "件,新着.maxid=" + newMax;
            }
            dbMsg = dbMsg + ",通過=" + newId + ",現在のlocalStoragemaxid=" + nowMax + ",一通目=" + farstArrival;
            var photos = [];
            if (0 < newImages.length) {                       //最近追加が有れば         && newId < newMax && nowMax < newMax) || farstArrival
                newId = newMax;
                dbMsg = dbMsg + ">>" + newImages.toLocaleString();
                dbMsg = dbMsg + "現在の最終=" + nowMaxId + ">新着>" + newImages[newImages.length - 1] + ";" + newImages.length + "件";
                arrivalsIDArray = $.extend(true, [], newImages); //配列の要素コピー
                dbMsg = dbMsg + ",arrivalsIDArray=" + arrivalsIDArray.toLocaleString() + ";" + arrivalsIDArray.length + "件";
                photos = readNewImages(newImages, arrivalsIDArray); //idを転記;ajaxで新着のurlをすべて取得       photos = 
                dbMsg = dbMsg + ">>" + arrivalsIDArray.toLocaleString() + "が" + arrivalsIDArray.length + "件目";
                while (photos.length < newImages.length) {                              //setCount=2件ごとに    <  arrivalsIDArray.length
                    var i = photos.length;
                    photos.push(popNewImages(newImages)); //ID格納
                }
            } else {                                                            //ストックは        if(0 < images.length)
                dbMsg = dbMsg + ",ストック";  //+ images.toLocaleString() + "で" + images.length + "件";
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
                        dbMsg = dbMsg + "(" + i + ")" + images[i];
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
            dbMsg = dbMsg + "[QUEUE] append new item."; //データが無い時はここまで
            $.ajax({
                type: "POST",
                url: "/" + ceremonyId + "/slidenew/get/token:" + token + "/",
                data: JSON.stringify(photos),
                contentType: 'application/json',
                dataType: "json"
            }).done(function (data) {                                               //phot_id配列で渡したSlideサイズ写真のurlをsetCountで指定した件数分、data配列に入れてjson_encodeで返す
                //                console.log(data);
                if (data) {                                                     //スライド上映中に削除されると空配列が返される
                    var nextIds = "";
                    dbMsg = dbMsg + ">新着" + arrivalsIDArray.length + "件,読込前queue=" + queue.length + "件";
                    reloadCount = 0;             //urlが届かなかったカウント
                    if (0 < arrivalsIDArray.length) {                 ///新着*******************//蓄積画像のアニメーション実行中でなければ
                        dbMsg = dbMsg + "新着内容=" + arrivalsIDArray.toLocaleString();
                        $.each(data, function (i, photo) {
                            nextIds = nextIds + photo.photoid + " , ";
                            dbMsg = dbMsg + ",photoid=" + photo.photoid + "はarrivalsIDArrayの " + arrivalsIDArray.indexOf(photo.photoid) + "番目";
                            arrivalsArray.push(photo.image); //新着画像のURL配列の末尾に要素を追加
                        });
                        dbMsg = dbMsg + ",新着url= " + arrivalsArray.length + "件,url= " + arrivalsArray.toLocaleString();
                        localStorage.setItem("update-keys", null);                         //0323☆popNewImages廃止に伴いここで削除
                    } else if (queue.length < setCount) {                //  新着中など処理重複時の読み込み防止
                        dbMsg = dbMsg + "、ストック処理開始";
                        queue = JSON.parse(localStorage.getItem("queue"));
                        if (queue == null) {
                            queue = [];
                        }
                        $.each(data, function (i, photo) {                                  //これから表示する2件を一件づつ読みだす
                            dbMsg = dbMsg + "[" + i + "]photoid=" + photo.photoid; //+ "//newId=" + newId;
                            $.preloadImages(photo.image); //imgタグにarguments配列で渡されたurlをセット
                            queue.push(photo); //再生し終えたデータを削除し
                        });
                        dbMsg = dbMsg + ",queue=" + queue.length + "件" + queue.toLocaleString();
                        localStorage.setItem("queue", JSON.stringify(queue)); //localStorageのqueue配列を更新
                        localStorage.setItem("queue.count", queue.length);
                        if ($.isEmptyObject(queue)) {
                            dbMsg = dbMsg + "、queue無し";
                            setTimeout(function () {
                                dataQueueing();
                            }, 300);               //org;300
                            return;
                        }
                    }
                    queueingCount = 0; //データが有るのにデーターが取得できなかった回数；正常に読み込みを開始したらリセット
                    dbMsg = dbMsg + "、dataBindへ";
                    dataBind();
                } else {
                    myLog(dbMsg);
                    queueingCount++;                      //データが有るのにデーターが取得できなかった回数；正常に読み込みを開始したらリセット
                    setTimeout(function () {         //loop中に全消去などURLが取得できない場合
                        dataQueueing();
                    }, 3000);
                }
                isQueueing = false;                      //データ読み取り中
                //                    $("#total_count").text(totalClount);
                myLog(dbMsg);
            }).fail(function (data) {                                           //新着(特に一通目は)すべてのファイルが作成されるまでに時間が掛かりfailが発生する
                //            dbMsg = dbMsg + ">fail>" + data.responseText;
                myLog(dbMsg);
                isQueueing = false;                      //データ読み取り中
                queueingCount++;
                queueingLimit = 60;
                setTimeout(function () {
                    dataQueueing();
                }, 1000);
            }).always(function () {                                                 //常に
            });
        }
        if (reloadLimit < reloadCount) {           //正常にデータ取得できない回数で ||  (totalClount == 0 && )
            reLoadJanction();                       //リロード処理
        }
        dbMsg = dbMsg + "isQueueing＝" + isQueueing;
        if (isQueueing) {                                                       //処理中にデータを消された場合
            dbMsg = dbMsg + "doneでもfailでもない;queueingCount=" + queueingCount;
            queueingCount++;
            //            queueingLimit = 10;
            setTimeout(function () {
                dataQueueing();
            }, 1000);
        }
        //        pushNewImages();                                                    //新着確認開始
        myLog(dbMsg);
    } catch (e) {
        dbMsg = dbMsg + 'でエラー；';
        console.log(dbMsg);
        // window.location.reload(); //再読み込み
    }
}                                        //0.5秒ごとに最新の登録状況を確認しながら待ち行列を作成。行列がなくなるまでデータURLを送出。

/**
 *実質再生ループ。ここから
 *localStorageが空になったらリロード処理
 * dataQueueing後、$.fn.slidenewから呼ばれる
 * */
function dataBind() {
    var dbMsg = "[slidenew・dataBind]";
    var nextIds = "";
    if (isReload) {
        dbMsg = dbMsg + ">>>既にリロード中 ";
        return;
    } else if (isStock) {
        dbMsg = dbMsg + ">>>ストック再生中 ";
    } else if (isArrival) {
        dbMsg = dbMsg + ">>>新着再生中 ";
    } else if (totalClount == 0 && farstArrival == false) {
        dbMsg = dbMsg + ">>>ストック無しで新着でもない"
        //            mainLoopStart()
        //            return;
    } else {
        var allImages = JSON.parse(localStorage.getItem("all-keys"));
        if (allImages != null) {
            dbMsg = dbMsg + '、' + allImages.length + "/" + totalClount + "件";
            $("#now_play_count").text("表示待ち" + allImages.length); //"表示待ち" + lcount
            $("#total_count").text(totalClount);
        }
        var queue = [];                                         //ストックのurl
        if (localStorage.getItem("queue") != "null") {
            queue = JSON.parse(localStorage.getItem("queue"));
        }
        dbMsg = dbMsg + '、開始時queue=' + queue.length + "件";
        if (reLoadMe(queue)) {
            dbMsg = dbMsg + ">>isReload=" + isReload + ">>>リロード ";
        } else {
            $("#arrival_total").text("皆様の投稿をお待ちしてます。");
            $("#arrival_count").text("表示待ちの新着はありません。");
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
                dbMsg = dbMsg + "、" + nextIds;
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
                var template = Hogan.compile($('.templateResult').text());
                if (!$.isEmptyObject(nextImages)) {
                    var nU = Math.floor(new Date().getTime() / 1000);
                    var ids = [null, null];
                    var md5val;
                    $.each(data.images, function (i) {
                        md5val = CryptoJS.MD5(this.id + nU).toString();
                        ids[i] = "#" + md5val;
                        this.md5 = md5val;
                    });
                    $('#slide-data').append(template.render(data));
                    slideIn(ids[0], ids[1]);
                }
            }                                        ///ストック*************************************/
        }
    }
    myLog(dbMsg);
}

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
        } else if (0 < arrivalsIDArray.length) {
            dbMsg = dbMsg + ">>新着ID=" + arrivalsIDArray.length + "件処理中";
        } else if (0 < arrivalsArray.length) {
            dbMsg = dbMsg + ",url=" + arrivalsArray.length + "件";
        } else if (farstArrival) {
            dbMsg = dbMsg + ">>一通目";
        } else if (isQueueing) {
            dbMsg = dbMsg + ">>データ読み取り中";
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
                    isReload = reLoadJanction();
                }
            } else {
                isReload = reLoadJanction();
            }
        }
    } catch (e) {
        dbMsg = dbMsg + "," + e;
        isReload = reLoadJanction();
    }
    dbMsg = dbMsg + ",isReload=" + isReload;
    myLog(dbMsg);
    return isReload;
}

function reLoadJanction() {
    var dbMsg = "[slidenew・reLoadJanction]";
    try {
        isReload = false;
        dbMsg = dbMsg + ",一通目=" + farstArrival + ",データ読み取り中=" + isQueueing + ",新着無し" + noArrivalLoopCount + "/" + noArrivalLoopLimit + "周目,isStockEnd=" + isStockEnd
        if (farstArrival) {
            dbMsg = dbMsg + ",一通目";
        } else if (isQueueing) {
            dbMsg = dbMsg + ",データ読み取り中";
        } else if (noArrivalLoopLimit < noArrivalLoopCount) {           // ||  (totalClount == 0 && reloadLimit < reloadCount)
            dbMsg = dbMsg + ",新着無し" + noArrivalLoopCount + "/" + noArrivalLoopLimit + "周目,isStockEnd=" + isStockEnd + "、確認" + reloadCount + "/" + reloadLimit + "回,totalClount=" + totalClount + ",info_bord.info_bord=" + $("#info_bord").css('display');
            reloadMassage();
        } else if (totalClount == 0 && reloadLimit < reloadCount) {
            reloadCount = 0;
            noArrivalLoopCount = 0;
            reLoadJanction();
        } else {
            isReload = true;
            $.cookie('slideshow.max-id', nowMaxId);              //setLocalStorage>>readNewImages        org  lsMax
            noArrivalLoopCount++;                               //新着が無い場合
            $.cookie('slideshow.no_arrival_loop_count', noArrivalLoopCount);
            $.cookie('slideshow.update', new Date());
            localStorage.clear();
            arrivalsIDArray = []; //新着画像のID配列
            arrivalsArray = []; //新着画像のUrl配列
            if (useBGAnime) {
                $("#effectCa").fadeTo(2000, 0.0, function () {                  //デフォルトムービーを5秒でフェードアウトして
                    efffectStop();
                    dbMsg = dbMsg + "、effectTimer停止 ";
                    //                    nowColor = '#000000';
                    //                    efAriaFO(nowColor); //      
                    //                     reLoadMe2();
                    window.location.reload(); //再読み込み
                })
            } else {
                reLoadMe2();
            }
        }
        dbMsg = dbMsg + ",isReload=" + isReload;
        myLog(dbMsg);
    } catch (e) {
        dbMsg = dbMsg + 'でエラー；';
        console.log(dbMsg);
        window.location.reload(); //再読み込み
    }
    return isReload;
}

function reloadMassage() {
    var dbMsg = "[reloadMassage]";
    dbMsg = dbMsg + ",isStockEnd=" + isStockEnd + ",info_bord.info_bordのdisplay=" + $("#info_bord").css('display');
    setTimeout(function () {
        reloadMassageBody()
    }, 2000);                                                                   //最後の写真のフェードアウト待ち
    dbMsg = dbMsg + ">>" + $("#info_bord").css('display');
    myLog(dbMsg);
}

function reloadMassageBody() {
    var dbMsg = "[reloadMassage]";
    dbMsg = dbMsg + ",isStockEnd=" + isStockEnd + ",info_bord.info_bordのdisplay=" + $("#info_bord").css('display');
    $("#info_bord").css({ 'display': 'inline' });                     //投稿待ちインフォメーション
    fiElementById(document.getElementById("info_bord_bace"));
    setTimeout(function () {
        reloadCount = 0;
        noArrivalLoopCount = 0;
        reLoadJanction();
    }, (anime_time * 2));
    dbMsg = dbMsg + ">>" + $("#info_bord").css('display');
    myLog(dbMsg);
}

setOpacity = function (elm, opacity) {
    var tag = "[setOpacity]";
    var dbMsg = tag + ";opacity= " + opacity;
    elm.style.filter = 'alpha(opacity=' + (opacity * 10) + ')';
    elm.style.MozOpacity = opacity / 10;
    elm.style.opacity = opacity / 10;
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
        window.location.reload(); //再読み込み
    }

}

function rgbToHex(color) {
    var ret = /rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),?\s*([.\d]+)?\)/.exec(color);
    var rgbHex = '';
    for (var i = 1; i <= 3; i++) {
        var hex = Number(ret[i]).toString(16);
        rgbHex += (hex.length === 1) ? '0' + hex : hex;
    }
    return rgbHex;
}

function reLoadMe2() {
    var dbMsg = "[slidenew・reLoadMe2]";
    try {
        if ($data['ceremony']['ceremonies_slide_bg'] == 0 || $data['ceremony']['ceremonies_slide_bg'] == 1) {
            fadeOut(); //2311;静止画を読み込んでいるCanvasのフェードアウト;デフォルトムービー指定ならメソッドに入らない
        } else if ($data['ceremony']['ceremonies_slide_bg'] == 2) {
            $("#bg_video").fadeTo(5000, 0.0, function () {                  //デフォルトムービーを5秒でフェードアウトして
                window.location.reload(); //再読み込み
            })
        } else if ($data['ceremony']['ceremonies_slide_bg'] > 7) {
            window.location.reload(); //再読み込み
            wallFO();
        }
        myLog(dbMsg);
    } catch (e) {
        console.log(dbMsg);
    }
    return isReload;
}

/**
 * localStorageのID受け取りslideAnimationに送る
 * addPhotAriaにも送ってエフェクトオブジェクトを連携させる
 * 呼び出し元はdataBind
 * */
function slideIn(id1, id2) {
    var dbMsg = "[slidenew・slideIn]";
    dbMsg = dbMsg + "id1=" + id1 + ",id2=" + id2;
    $("#max_id").text(id1 + "," + id2 + "(max" + nowMaxId + ")");
    if (id1) {
        slideAnimation($(id1), 0);
        addPhotAria(id1.replace("#", "")); //エフェクトに渡す写真情報
    }
    if (id2) {
        slideAnimation($(id2), 1);
        addPhotAria(id2.replace("#", "")); //エフェクトに渡す写真情報
    }
    //            myLog(dbMsg);
}

function displayCenterPoint() {
    var dbMsg = "[slidenew・displayCenterPoint]";
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
    $("body").append("<div id='vertical-1-1' style='background-color: OrangeRed; width: 1px; height: " + h + "px; margin: 0; top: 0; left: " + (x - x / 10) + "px; position: fixed; z-index: 99999'></div>");
    $("#vertical-1-2").remove();
    $("body").append("<div id='vertical-1-2' style='background-color: OrangeRed; width: 1px; height: " + h + "px; margin: 0; top: 0; left: " + (x / 2 + x / 20) + "px; position: fixed; z-index: 99999'></div>");
    $("#vertical-1-3").remove();
    $("body").append("<div id='vertical-1-3' style='background-color: OrangeRed; width: 1px; height: " + h + "px; margin: 0; top: 0; left: " + (x / 10) + "px; position: fixed; z-index: 99999'></div>");
    $("#vertical-2-1").remove();
    $("body").append("<div id='vertical-2-1' style='background-color: OrangeRed; width: 1px; height: " + h + "px; margin: 0; top: 0; left: " + (x + x / 6) + "px; position: fixed; z-index: 99999'></div>");
    $("#vertical-2-2").remove();
    $("body").append("<div id='vertical-2-2' style='background-color: OrangeRed; width: 1px; height: " + h + "px; margin: 0; top: 0; left: " + (x + x / 2 - x / 20) + "px; position: fixed; z-index: 99999'></div>");
    //   myLog(dbMsg);
}

function resizeImage(img, w, h) {
    var dbMsg = "[slidenew・resizeImage]";
    var imgHeight = img.height();
    var imgWidth = img.width();
    // むりやり
    imgHeight = img.data('height');
    imgWidth = img.data('width');
    var ratio;
    var tempHeight;
    var tempWidth;
    tempHeight = h;
    ratio = tempHeight / imgHeight; //ogr; = tempHeight / imgHeight;     
    tempWidth = imgWidth * ratio;
    imgHeight = tempHeight;
    imgWidth = tempWidth;
    tempWidth = w;
    //tempWidth = (imgWidth > w) ? w : w;

    if (imgWidth > tempWidth) {
        ratio = tempWidth / imgWidth;
        tempHeight = imgHeight * ratio;
        dbMsg = dbMsg + "  resize height: " + tempHeight + "px width : " + tempWidth + "px";
        imgHeight = tempHeight;
        imgWidth = tempWidth;
    }

    imgHeight *= 0.7; //org  *= 0.9;
    imgWidth *= 0.7;
    //     myLog(dbMsg);
    return { width: imgWidth, height: imgHeight };
}

function getWindowParameter() {
    var dbMsg = "[slidenew・getWindowParameter]";
    winW = $(window).width();
    winH = $(window).height() + 20;
    var w = $(window).width(); // current window size - width
    var h = $(window).height(); // current window size - height
    var x = w / 2; // current center position - x
    var y = h / 2; // current center position - y
    //      myLog(dbMsg);
    return { w: w, h: h, x: x, y: y };
}

function getImageSize(images) {
    var dbMsg = "[slidenew・getImageSize]";
    var h = images.height();
    var w = images.width();
    //    myLog(dbMsg);
    return { height: h, width: w };
}

function getParameters(image, _side) {
    var dbMsg = "[slidenew・getParameters]";
    var side = _side || 0;
    var windowInfo = getWindowParameter();
    var imageInfo = getImageSize(image);
    var params = {
        left: {
            init: {
                //left: ( windowInfo.w / 2 ) - (imageInfo.width * 0.4 / 2)
                //left: ( windowInfo.x ) - ( windowInfo.x / 7  )
                left: (windowInfo.x) - (windowInfo.x / 10)
            }, //登場位置；window中心から1/10
            begin: {
                left: (windowInfo.x / 2) + (windowInfo.x / 20) + 20, //2312；20内へ     windowInfo.x = $(window).width()/2
                rotate: "-5deg"
            }, //停止位置；window中心から1/20  右傾斜
            middle: {
                left: (windowInfo.x / 2),
                rotate: "-5deg"
            }, //window左から3/20  右傾斜
            end: {
                //left: -( windowInfo.x / 2  ) ,
                //left: ( windowInfo.x / 2 ) - ( windowInfo.x / 7 ) ,
                left: (windowInfo.x / 10) + (windowInfo.x / 20),
                rotate: "-5deg"
            }                                                //window左から3/20  右傾斜
        },
        right: {
            init: {
                //left: ( windowInfo.w / 2 ) + (imageInfo.width * 0.4 / 2)
                left: (windowInfo.x) + (windowInfo.x / 6)
            },
            begin: {
                left: (windowInfo.x) + (windowInfo.x / 2) - (windowInfo.x / 20) - 20, //2312；20内へ     
                rotate: "5deg"
            },
            middle: {
                left: (windowInfo.w / 2) + (windowInfo.x / 2),
                rotate: "5deg"
            },
            end: {
                left: (windowInfo.w / 2) + (windowInfo.x / 2) + (windowInfo.x / 7),
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
    //    myLog(dbMsg);
    return param;
}

/*
 @var side 0: left, 1: right
 */
function slideAnimation(image, side) {
    var dbMsg = "[slidenew・slideAnimation]";
    //        if (image[0]) {
    //            stockID = '".' + image[0].id + '"';
    //            dbMsg = dbMsg + ",id=" + stockID;
    //        }
    isStock = true; //蓄積画像のアニメーション実行中
    isStockEnd = false;                 //完了フラグoff
    isStayEnd = false; //画像のアニメーション静止終了
    var objWindow = $(window);
    var w = objWindow.width(); // current window size - width
    var h = objWindow.height(); // current window size - height
    var x = w / 2; // current center position - x
    var y = h / 2; // current center position - y
    var winfo = getWindowParameter();
    var param = getParameters(image, side); //sideは0,1
    var obj = resizeImage(image, winfo.w / 2, winfo.h);
    var imgHeightResize = obj.height; //var imgHeightResize = image.height();
    var imgWidthResize = obj.width; //var imgWidthResize = image.width();
    var scale;
    dbMsg = dbMsg + "[" + imgWidthResize + "×" + imgHeightResize + "]";
    photZ = -vanishingPoint;
    photT = vanishingPoint;
    isStockEnd = false; //蓄積画像のアニメーションがFoまで完了している    
    myLog(dbMsg);
    image.css({
        display: 'block',
        opacity: 0.0,
        height: obj.height,
        width: obj.width,
        marginLeft: -(imgWidthResize / 2) - 15, //2312   - 20
        marginTop: -(imgHeightResize / 2) - 15,
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
            duration: anime_time,
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
                    photZ = -150; //-120だとFi中の重なりが残る
                    photT = 250; //200だとFi中の重なりが残る、250だと背面に回ったものが押し出される
                    isStayEnd = true; //画像のアニメーション静止終了
                }
            },
            complete: function () {
                dbMsg = dbMsg + ",停止中"; //ここからは  this.isStock = falseできず    
                //                                               reWritIsStock(); //蓄積画像のアニメーション終了             
                removePhotAria(image[0].id); //回避エリアの消去
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
                            dbMsg = dbMsg + ",停止終了"; //ここからは  this.isStock = falseできず                                        
                            dbMsg = dbMsg + ",complete2;remove;id=" + image[0].id;
                            //                                        reWritIsStock(); //蓄積画像のアニメーション終了             
                            image.remove();
                            setTimeout(function () {
                                dbMsg = dbMsg + ",Timeout;id=" + image[0].id;
                                removePhotAria(image[0].id); //回避エリアの消去
                                image.remove();
                                dbMsg = dbMsg + ",終端";
                                //                                                           myLog(dbMsg);
                                reWritisStockEnd(); //蓄積画像のアニメーションがFoまで完了している                            
                            }, 1000);
                            dbMsg = dbMsg + ",Fo開始"; //ここからは this.isStock = falseできず                                        
                        }
                    }
                );
                dbMsg = dbMsg + ",停止終了"; //ここからは this.isStock = falseできず        
                photZ = -100;
                photT = 0;
                reWritIsStock(); //蓄積画像のアニメーション終了             
            }
        }
        );
}

/**
 *  image.cssの中からグローバル変数を直接書き換える事が出来ないので関数化
 * **/
function reWritIsStock() {
    var dbMsg = "[reWritIsStock]";
    dbMsg = dbMsg + ",isStock=" + isStock;
    try {
        if (isStock) {
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
            isStock = false; //蓄積画像のアニメーション終了
            dbMsg = dbMsg + ">>" + isStock;
            dataQueueingStart();
            // myLog(dbMsg);
        }
    } catch (e) {
        dbMsg = dbMsg + 'でエラー；';
        console.log(dbMsg);
        // window.location.reload(); //再読み込み
    }
}

function reWritisStockEnd() {
    var dbMsg = "[reWritisStockEnd]";
    dbMsg = dbMsg + ",isStockEnd=" + isStockEnd;
    isStockEnd = true;
    dbMsg = dbMsg + ">>" + isStockEnd;
    myLog(dbMsg);
}

/**
 * imgタグにarguments配列で渡されたurlをセット
 * dataQueueingから呼ばれる(配列要素は一つ)
 * */
$.preloadImages = function () {
    var dbMsg = "[$preloadImages]";
    for (var i = 0; i < arguments.length; i++) {
        dbMsg = dbMsg + ',preload : ' + i + "/" + arguments.length + ")" + arguments[i];
        jQuery("<img>").attr("src", arguments[i]);
    }
    //      myLog(dbMsg);
}
//imgタグにarguments配列で渡されたurlをセット

///2312////////////////////////////////////////////////////////////////////////////////marri-slide.jsから抜粋したアニメーション実行部分////
/**
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
    var cyouhen, tanpen;
    sinarioNo = sNo;
    var ni_dvi = document.getElementById('new_phot_aria');
    if (ni_dvi == null) {
        return;
    }
    dbMsg = dbMsg + "src=" + imgSrc;
    winW = $(window).width();
    winH = $(window).height(); //タイトルバー分？加算
    dbMsg = dbMsg + "[window;" + winW + "×" + winH + "]";
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
    $("#" + newImg_canvas.id).attr("width", winW + 'px').attr("height", winH + 'px').css({ 'display': 'inline-block' }).css({ 'position': 'absolute' }); //main.cssの対策     : ;
    newImg_ctx = newImg_canvas.getContext('2d'); //☆ページロード直後は非表示なのでサイズプロパティーは取れない
    dbMsg = dbMsg + "追加したエレメント" + newImg_canvas.id;
    var rStr = "ご利用のブラウザはスライドショーを";
    if (!newImg_canvas || !newImg_ctx) {
        rStr = rStr + "ご利用頂けません。別のブラウザでお試し下さい。";
        dbMsg = dbMsg + rStr;
        alert(rStr);
        return false;
    }
    var newImg_obj = new Image(); // Imageオブジェクトを生成 
    newImg_obj.src = imgSrc; //オブジェクトにデータの読み込み
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
        dbMsg = dbMsg + ",>リサイズ>[" + newImg_resize_w + "×" + newImg_resize_h + "]"; //、>リサイズ>[1324.3703703703704×941]、canvas_aria変更[1324.3703703703704×941]、
        x_nIs = (winW - newImg_resize_w) / 2; //phot_ctx_w - newImg_resize_w;
        dbMsg = dbMsg + "、シフト(" + x_nIs;
        y_nIs = (winH - newImg_resize_h); // phot_ctx_h - newImg_resize_h;                  // Math.subtract(phot_ctx_h , newImg_resize_h);
        dbMsg = dbMsg + "," + y_nIs;
        var imgObj = { ctx: newImg_ctx, iObj: newImg_obj, scale: scale_newImg, x: x_nIs, y: y_nIs };
        //     console.log(imgObj);
        dbMsg = dbMsg + "、1336;戻り値；scale=" + imgObj.scale_newImg + "%(" + imgObj.x_nIs + "," + imgObj.y_nIs + ")ctx=" + newImg_ctx.canvas.id + ",iObj=" + newImg_obj;
        //       myLog(dbMsg);
        dbMsg = dbMsg + ")sinarioNo=" + sinarioNo;
        switch (sinarioNo) {
            case 1:
                newArrivals(imgSrc, imgObj); //到着して手前から奥へ飛行
                break;
            case 2:
                caB2f(imgObj, 1, 0); //奥手からZoomIn
                break;
        }
        //     console.log(newImg_ctx);
        return imgObj;
    }                                                                                       //onload

    newImg_obj.onerror = function () {                                         //2016/11/18;画像が読み込めなければ
        dbMsg = dbMsg + "\n[slidenew.index.caDraw.onerror]";
        console.log(dbMsg);
        return false;
    }
}                                         //新着用Canvasへの書き込み開始

var timerArray = new Array(); //☆順送りで複数のタイマーを使うときは配列で順序制御
function stopNIAnimation() {
    var tag = "[stopNIAnimation]";
    if (timerArray != null) {
        var dbMsg = tag + ",timerArray=" + timerArray.length + "スレッド稼働中";
        if (0 < timerArray.length) {
            clearInterval(timerArray.shift());
        }
        var dbMsg = dbMsg + ">稼働中>" + timerArray.length + "スレッド";
    }
    //   myLog(dbMsg);
}                                   // アニメーションを停止するためのユーティリティ関数

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
    var dbMsg = tag + ",target(" + targetX + " , " + targetY + ")[" + targetW + "×" + targetH + "]";
    dbMsg = dbMsg + ",ctx.canvas[" + ctx.canvas.width + "×" + ctx.canvas.height + "]";
    ctx.clearRect(-winW, -winH, winW * 2, winH * 2); //×ctx.canvas.width, ctx.canvas.heigh
    //    console.log(iObj);
    ctx.drawImage(iObj, targetX, targetY, targetW, targetH); //書き込み
    dbMsg = dbMsg + ",globalAlpha=" + ctx.globalAlpha;
    //     myLog(dbMsg);
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
    //        console.log(ctx);
    //        console.log(iObj);
    //        dbMsg = dbMsg + ">>(" + newImg_shit_x + "," + newImg_shit_y + ")";
    dbMsg = tag + "globalAlpha=" + ctx.globalAlpha;
    if ((1 - increase - 0.01) < ctx.globalAlpha) {                   //0.05秒×100/5
        ctx.globalAlpha = 1.0; //☆浮動小数になっているので整数が加算されなかった
        dbMsg = dbMsg + "----feedIn終了----";
    } else {
        ctx.globalAlpha += increase;
        reDrawiNewImg(ctx, iObj, targetX, targetY, targetW, targetH);
    }
    return ctx.globalAlpha;
}                                           // 登場時のフェードイン

function caFadeOut(ctx, iObj, targetX, targetY, targetW, targetH) {
    var tag = "[caFadeOut]";
    dbMsg = tag + "globalAlpha=" + ctx.globalAlpha;
    if (ctx.globalAlpha < 0.1) {                   //0.05秒×100/5
        ctx.globalAlpha = 0; //☆浮動小数になっているので整数が加算されなかった
        dbMsg = dbMsg + "----feedIn終了----";
    } else {
        ctx.globalAlpha -= 0.05;
        ctx = reDrawiNewImg(ctx, iObj, targetX, targetY, targetW, targetH);
    }
    return ctx;
}

//デバッグツール/////////////////////////////////////////////////////////////
//   var debug_now = true;
function myLog(msg) {
    if (debug_now) {
        //        if (msg.responseText) {                   //デバッガーによっては長すぎて落ちる
        //            msg = msg.responseText;
        //        }
        if ($is_mobile || $is_tablet) {
            alert(msg);
        } else {
            console.log(msg);
        }
    }
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
function testRect(ctx, x, y, wi, hi, sStyle, lCount, chCount) {
    if (debug_now) {
        ctx.beginPath(); //パスを描画開始
        ctx.strokeRect(x, y, wi, hi);
        ctx.closePath(); //パスを閉じる、三角形の形が決まる
        if (sStyle) {
            ctx.strokeStyle = sStyle; //指定色に設定
        } else {
            if (lCount < 0) {
                ctx.strokeStyle = "green"; //db;線の色を赤にする（最終的に不要）
            } else if (lCount < chCount) {
                ctx.strokeStyle = "blue"; //db;線の色を赤にする（最終的に不要）
            } else {
                var rVal = lCount * 2;
                ctx.strokeStyle = "rgb(" + rVal + ", 128, 0)"; //db;線の色を赤にする（最終的に不要）
            }
        }
        ctx.stroke();
    }
}

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