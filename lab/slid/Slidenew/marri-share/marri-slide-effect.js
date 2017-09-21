////効果/////////////////////////////////////////
/**
 * エフェクト描画を消去し、再生成。
 * 呼び出し  $(window).resize [$(window).loadから継続して呼び出されるので、この一か所のみ]
 * */
function effectInit() {
    var dbMsg = "[effect.effectInit]";
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
    $("#" + effectCanvas.id).attr("width", winW + 'px').attr("height", winH + 'px').css({'display': 'inline-block'}).css({'position': 'absolute'}); //static                main.cssの対策   .attr("background-color", 'transparent')
//         $("#" + effectCanvas.id).css({'width': '100%'}).css({'height': 'auto'}).css({'display': 'inline-block'}).css({'position': 'absolute'}); //static                main.cssの対策   .attr("background-color", 'transparent')
    dbMsg = dbMsg + "追加したエレメント" + effectCanvas.id + ",[" + effectCanvas.width + "×" + effectCanvas.height + "]";
    effectContex = effectCanvas.getContext('2d'); //☆ページロード直後は非表示なのでサイズプロパティーは取れない
    dbMsg = dbMsg + ">effectContex>" + effectContex;
    var effImg = new Image();
    //            IMAGE_URL = "<?php echo $this->webroot; ?>files/gerbera_marri-slide_orange.png"          // = 'http://jsrun.it/assets/3/5/o/O/35oOZ.png'
    dbMsg = dbMsg + ",IMAGE_URL=" + IMAGE_URL;
    effImg.src = IMAGE_URL;
//        console.log(effImg);
    effImg.onload = function () {
        var tag = "[effect.onload]";
        var dbMsg = tag + ",effectFRate=" + effectFRate;
        effectTimer = setInterval(function () {          //org; setInterval(function () {
            var tag = "[slidenew.index.effectInit.onload.setInterval]";
            var dbMsg = tag;
//                myLog(dbMsg);
            effectContex.clearRect(0, 0, winW, winH); //画面クリア   org;  _ctx.fillStyle = "rgba(0, 0, 0, 0.9)";で黒く塗り潰し
            rewitePhotAria(); //回避エリアを更新
            var len = _sakuras.length;
            for (var i = 0; i < len; ++i) {
                dbMsg = tag + i + '/' + len + ')';
                _sakuras[i] = effectFall(_sakuras[i]); //生成されたオブジェクトに次回描画の座標や大きさのパラメータを与える
            }
            removeEffectObje(); //_sakura配列要素の削除;表示エリアからはみ出したものを配列から削除
        }, 1000 / effectFRate); //org;1000/60  effectPlay();                  //  effectImg.onload = play;
        effectImgS = new Array();
        var num = effectImgS.push(effImg);
        effectImgS = effectImgMake(effectImgS); //登場させる花の配列を作る
        SAKURA_COUNT = SAKURA_COUNT * winW / 1920; //オブジェクト数を戻す
        addEffectObje(); //_sakura配列要素の生成;(0,0)～(winW, winH;)の範囲に0～150%の大きさでランダムに傾いた花を生成
        dbMsg = dbMsg + "," + effectImgS.length + "番目の花を登録";
        dbMsg = dbMsg + ",isStart=" + isStart;
        if (!isStart) {
            mainLoopStart() //スライドショースタート
        }
//            myLog(dbMsg);
    }
    effImg.onerror = function () {                                         //2016/11/18;画像が読み込めなければ
        var dbMsg = "[effect.onerror]";
        console.log(dbMsg);
        return false;
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
    for (var i = 0; i < 5; ++i) {
        var IMAGE_URL = image_url01;   //"<?php echo $this->webroot; ?>files/gerbera_marri-slide_purple.png"         // 'image_url00': '<?php echo $this->webroot; ?>files/gerbera_marri-slide_purple.png',  
        switch (i) {
            case 1:
                IMAGE_URL = image_url02;   //"<?php echo $this->webroot; ?>files/lily_marri-slide_white.png"
                break;
            case 2:
                IMAGE_URL = image_url03;   // "<?php echo $this->webroot; ?>files/lily_marri-slide_yellow.png"
                break;
            case 3:
                IMAGE_URL = image_url04;   // "<?php echo $this->webroot; ?>files/rose_marri-slide_pink.png"
                break;
            case 4:
                IMAGE_URL = image_url05;   // "<?php echo $this->webroot; ?>files/rose_marri-slide_red.png"
                break;
        }
        var eImg = new Image();
        eImg.src = IMAGE_URL;
        var num = effectImgS.push(eImg);
        dbMsg = dbMsg + "," + effectImgS.length + "つ目の花を登録=" + IMAGE_URL;
    }
    myLog(dbMsg);
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
    var idouMin = 1;
    sakura.lifeCount++; //生成されて書き直された回数
    dbMsg = dbMsg + "[" + sakura._id + ";arrival=" + arrivalID + "]" + sakura.lifeCount + "回目(" + sakura.x + "," + sakura.y + "," + sakura.z + ")";
    //回転///////////////////////////////////////////
    if (sakura.rotationX < -80 || -20 < sakura.rotationX) {
        sakura.rotationVx = -1 * sakura.rotationVx; //-0.5～+0.5 
    }
    sakura.rotationX += sakura.rotationVx; // + Math.random() * 2;
    if (sakura.rotationY < -80 || -20 < sakura.rotationY) {
        sakura.rotationVy = -1 * sakura.rotationVy;
    }
    sakura.rotationY += sakura.rotationVy; // + Math.random() * 2;
    sakura.rotationZ += sakura.rotationVz; //x平面上の動き   sakura.rotationVz + Math.random() * 1;   
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
    //        safeAria = 20 + Math.random() * 50; //回避範囲
    //        if (!isStayEnd) {                                          //アニメーションが静止するまでは回避動作
    //            safeAria = 20 + Math.random() * 20; //広げる
    //        }
    var testX = sakura.x + sakura.vx;
    var testY = sakura.y + sakura.vy;
    var testZ = sakura.z + sakura.vz;
    dbMsg = dbMsg + "元座標sakura(" + testX + " , " + testY + " , " + testZ + ")";
    var safePoint = setSafePosition(testX, testY, testZ); //回避エリア外ならそのままの座標が戻る☆zは範囲判定にのみ使う
    if (testX != safePoint.x || testY != safePoint.y) {           //x,y各座標の回避する距離が返されたら
        dbMsg = dbMsg + "回避先(" + safePoint.x + " , " + safePoint.y + " , " + safePoint.z + ")";
        var avoidanceX = (safePoint.x - testX) * (1 + Math.random()) * 15; //回避量    12だと追い付かれてギトギト止まる　30だと飛び上がる
        var avoidanceY = (safePoint.y - testY) * (1 + Math.random()) * 15;
        dbMsg = dbMsg + "移動距離[" + avoidanceX + " , " + avoidanceY + "]";
        if (testZ != safePoint.z) {
            if (isArrival01) {                                              //新着の軌道移動中
                if (sakura._id % 9 == 0 && safePoint.x < winW * 0.25 && safePoint.x < winW * 0.75 && safePoint.y < winH * 0.25 && safePoint.y < winH * 0.75) {
                    sakura.vz -= 0.1; //10では蹴散らされる
                }
                if (Math.abs(avoidanceX) < Math.abs(avoidanceY)) {
                    sakura.vx = avoidanceX / effectFRate;
                } else {
                    sakura.vy = avoidanceY / effectFRate;
                }
                dbMsg = dbMsg + "加速[" + sakura.vx + " , " + sakura.vy + "]";
                //         myLog(dbMsg);
            } else {                                                        //Stockなどの通常動作
                if (Math.abs(avoidanceX) < Math.abs(avoidanceY)) {
                    sakura.vx = avoidanceX / effectFRate;
                } else {
                    sakura.vy = avoidanceY / effectFRate;
                }
            }

        }
    } else {                                                                //回避エリア外では減速 
        var fLimit = 1.7; //1.5では止まって線上に並ぶ,2では表示域外に押し出される 2だと枠外に流出するもｂの多数
        dbMsg = dbMsg + "回避領域外；速度(" + sakura.vx;
        if (sakura.vx < -fLimit || fLimit < sakura.vx) {
            sakura.vx = sakura.vx * 0.8; //0.5だとカクカクした動きになる 
            dbMsg = dbMsg + ">超過>" + sakura.vx;
            //                myLog(dbMsg);
        } else if (-0.1 < sakura.vx && sakura.vx < 0.1) {
            sakura.vx = sakura.vx * 5;
        }
        dbMsg = dbMsg + ",vy;" + sakura.vy;
        if (sakura.vy < -fLimit || fLimit < sakura.vy) {
            sakura.vy = sakura.vy * 0.8;
            dbMsg = dbMsg + ">超過>" + sakura.vy + ")";
            //                myLog(dbMsg);
        } else if (-0.1 < sakura.vy && sakura.vy < 0.1) {
            sakura.vy = sakura.vy * 5;
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
    }
    dbMsg = dbMsg + "速度(" + sakura.vx + " , " + sakura.vy + ")";
    sakura.x += sakura.vx;
    sakura.y += sakura.vy;
    sakura.z += sakura.vz; //原点比例で移動

    dbMsg = dbMsg + ">>(" + sakura.x + "," + sakura.y + "," + sakura.z + ")";
    //                           myLog(dbMsg);
    drawSakuras(sakura);
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
        dbMsg = dbMsg +"で" +e;
        myLog(dbMsg);
    }
}                                                                          //渡されたビットマップを _sakurasの枚数分、描画する

//花弁と写真の連携////////////////////////////////////////////////////////
/**
 * 写真表示エリアの取得
 * IDを受け取ってphotAria配列に加える
 * @param {String} id そのエレメントを識別できるID
 * */
function addPhotAria(id) {                  //エフェクトに渡す写真ID
    var tag = "[effect.addPhotAria]";
    var dbMsg = tag;
    dbMsg = dbMsg + "," + photAria.length + "件有り";
    dbMsg = dbMsg + ",id=" + id;
    var photParam = {};
    photParam.id = id;
    photAria.push(photParam);
    dbMsg = dbMsg + ">>" + photAria.length + "件目";
    //   myLog(dbMsg);
}                           //写真表示エリアの取得

function rewitePhotAria() {                  //写真枠の修正
    var tag = "[effect.rewitePhotAria]";
    var dbMsg = tag;
    if (useBGAnime) {
        dbMsg = dbMsg + "," + photAria.length + "件有り";
        if (-1 < photAria.length) {
            var photParam = {};
            for (var i = 0; i < photAria.length; i++) {
                var ariaID = photAria[i].id;
                dbMsg = dbMsg + ",ariaID=" + ariaID;
                if (isArrival == true) {        //登場アニメーション    canvas
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
                        dbMsg = dbMsg + ">>結果(" + photParam.x + "," + photParam.y + "," + photParam.z + ")[" + photParam.w + "," + photParam.h + "," + photParam.t + "]";
                        photAria.push(photParam);
                    }
                    //          myLog(dbMsg);
                } else {                //imgタグ
                    var rAria = document.getElementById(ariaID);
                    if (rAria) {
                        //                        dbMsg = dbMsg + ",nodeName=" + nodeName;
                        removePhotAria(ariaID); //回避エリアの消去
                        photParam = {};
                        photParam.id = ariaID;
                        var ariaX = parseInt(rAria.style.left.replace("px", "")); //photAria[i].x;
                        var ariaY = parseInt(rAria.style.top.replace("px", "")); //photAria[i].y;
                        dbMsg = dbMsg + ",id=" + photParam.id + "(" + ariaX + "," + ariaY + ")";
                        var ariaScale = rAria.style.transform.replace("scale(", ""); //transform: scale(0.999857) rotate(5deg);
                        var rotate = ariaScale.split(") rotate("); //transform: scale(0.999857) rotate(5deg);
                        ariaScale = rotate[0];
                        if (rotate[1]) {
                            var ariaRotate = rotate[1].replace("deg)", ""); //TypeError: Cannot read property 'replace' of undefined
                            dbMsg = dbMsg + "scale=" + ariaScale + ",rotate=" + ariaRotate + "deg"; // + " , margin(" + marginLeft + " , " + marginTop + ")";
                        }
                        photParam.w = parseInt(rAria.style.width.replace("px", "")) * ariaScale * 1.14 + IMG_SIZE;
                        photParam.h = parseInt(rAria.style.height.replace("px", "")) * ariaScale * 1.14 + IMG_SIZE; //parseInt(rAria.style.height.replace("px", "")) * ariaScale * 1.14 + IMG_SIZE;
                        photParam.t = photT; //200;
                        photParam.x = ariaX - photParam.w / 2 - photParam.w * 0.002 - IMG_SIZE / 2;
                        photParam.y = ariaY - photParam.h / 2 - photParam.h * 0.002 - IMG_SIZE / 2;
                        photParam.z = photZ; //-100;
                        dbMsg = dbMsg + ">>結果(" + photParam.x + "," + photParam.y + ")[" + photParam.w + "," + photParam.h + "]";
                        photAria.push(photParam); //                        }
                    }
                }
            }
            testRect(effectContex, photParam.x, photParam.y, photParam.w, photParam.h, 'orange', 99, 99);
            dbMsg = dbMsg + ">>" + photAria.length + "件目";
        }
    }
    //   myLog(dbMsg);
}                           //写真表示エリアの取得

/**
 * 写真エリアの破棄
 * */
function removePhotAria(id) {                                               //回避エリアの消去
    var tag = "[effect.removePhotAria]";
    var dbMsg = tag;
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
}                                    // 写真エリアの破棄

/**
 * 衝突回避
 * ；渡された座標が表示エリア内なら回避できる座標を返す
 * :エリア内なら元座標を返す
 * */
function setSafePosition(testX, testY, testZ) {
    var tag = "[effect.setSafePosition]";
    var dbMsg = tag;
    dbMsg = dbMsg + "test(" + testX + "," + testY + "," + testZ + ")";
    var vX = testX; //       retX = testX;
    var vY = testY; //retY = testY;
    var vZ = testZ; //retY = testY;
    if (isStayEnd = true) {           //; //画像のアニメーション静止終了;trueは静止中；回避エリアの拡大/縮小に使用
        if (0 < testX && testX < winW && 0 < testY && testY < winH) {               //表示エリア内
            var ariaEnd = photAria.length;
            if (0 < ariaEnd) {                                               //回避すべき写真エリアが無ければ処理不要
                for (var i = 0; i < ariaEnd; i++) {
                    dbMsg = dbMsg + "\n回避aria(" + i + "/" + ariaEnd + ")";
                    var ariaID = photAria[i].id;
                    dbMsg = dbMsg + "=" + ariaID;
                    //          console.log(rAria);
                    var ariaX = photAria[i].x - safeAria;
                    var ariaY = photAria[i].y - safeAria;
                    var ariaZ = photAria[i].z;
                    var ariaW = photAria[i].w + safeAria * 2;
                    var ariaH = photAria[i].h + safeAria * 2;
                    var ariaT = photAria[i].t;
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
                            vY = ariaY; //初期値は上へ回避        10 - 100 = -90 
                            if (ariaY + ariaH / 2 < testY) {                                 //画面の下半分なら　下へ回避       800 - 700 = 100 
                                vY = ariaEY;
                            }
                            vZ = ariaZ; //初期値は奥へ回避
                            dbMsg = dbMsg + ",移動先(" + vX + "," + vY + "," + vZ + ")]";
                            return  {x: vX, y: vY, z: vZ};
                        }
                        //         myLog(dbMsg);
                    }
                }                   //for (var i = 0; i < ariaEnd; i++)
            }
        }
    }
    return  {x: vX, y: vY, z: vZ};
}                         //衝突回避；渡された座標が表示エリア内なら回避できる座標を返す

/**
 * _sakura配列要素の生成;(0,0)～(winW, winH;)の範囲に0～150%の大きさでランダムに傾いた花を生成
 * removeEffectObje, effectInit,から呼ばれる
 * */
function addEffectObje() {
    var tag = "[effect.addEffectObje]";
     dbMsg = tag + ",isArrival=" + isArrival + ",開始時" + _sakuras.length + "枚";
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
        sakura.z = (Math.random() - 0.5) * 100 + 50; //50 ～　150
        if (sakura._id % 4 == 0) {
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
            sakura.x = winW / 10 + Math.random() * (winW - winW / 20); //発生領域は表示領域全体        
            sakura.y = winH / 10 + Math.random() * (winH - winH / 20); //;0～1*500-500 ≒-499～500 
        }                                                                   //半分の発生域を回避エリア周辺に集める
        //    myLog(dbMsg);
        sakura.rotationX = -80 + Math.random() * 20; //-80～-60          //org;Math.random() *360=0～360     ≒0～360
        sakura.rotationY = -80 + Math.random() * 20;
        sakura.rotationZ = Math.random() * 360;
        sakura.vx = (Math.random() - 0.5);                    //移動速度          * 0.001では減速しない
        sakura.vy = (Math.random() - 0.5);
        sakura.vz = -0.03 + (Math.random() - 0.5) / 10; //0.3 + 0.2 * Math.random();だと中心に向かって動く
        sakura.alpha = 0.05;
        dbMsg = dbMsg + ",発生点(" + sakura.x + "," + sakura.y + "," + sakura.z + ")";
        sakura.alphaV = 0.05;
        var safePoint = setSafePosition(sakura.x, sakura.y, sakura.z);
        if (sakura.x != safePoint.x || sakura.y != safePoint.y) {
            dbMsg = dbMsg + ">回避>(" + safePoint.x + " , " + safePoint.y + ")";
            sakura.x = safePoint.x;
            sakura.y = safePoint.y;
            dbMsg = dbMsg + ">変更結果>(" + sakura.x + " , " + sakura.y + ")";
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
}
