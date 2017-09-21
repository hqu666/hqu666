    ////新着/////////////////////////////////////////////
    /**
     * 新着として登録されたPhot_iDの写真をスライドに表示
     * 新規追加ID;newIdを初期化（-1）
     * `@param {type} name description
     * */
    function newImageWrite() {
        var dbMsg = "[arrival.newImageWrite]";
         myLog(dbMsg);
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
                var nID = newId + "in"
                removeEffectObje(); //_sakura配列要素の削除;表示エリアからはみ出したものを配列から削除
                photAria = [];
                rewitePhotAria(); //回避エリアを更新
                addEffectObje(); //花がなくなるタイミングが有るのでエフェクト再始動
                caDraw(imageURL, nID, 1); //    newArrivals(imageURL, imgObj);へ
            } else {
                newImageWriteEnd()
            }
        } else {
            newImageWriteEnd()
        }
        myLog(dbMsg);
    }

    function newImageWriteEnd() {
        var dbMsg = "[arrival.newImageWriteEnd]arrivalsArray=" + arrivalsArray.length + "件"
        dbMsg = dbMsg + "/登場アニメーション実行終了";
        isArrival = false;
        newId = -1; //処理が終われば初期化
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
        myLog(dbMsg);
        //            console.log(localStorage);
        dataQueueingStart();
    }

    /**
     * 新着～移動～消失
     * テストアルバム　AlNptPB4
     * 角度と高さから底辺と斜辺を計算   http://keisan.casio.jp/exec/system/1177477195
     * */
    function newArrivals(imageURL, imgObj) {
        var tag = "[arrival.newArrivals]";
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
        var pMax = 6; //用意したパターンの最終caseNo 7-1
        if (pMax < naPattern) {
            //            naPattern = 0;
            naPattern = Math.floor(Math.random() * pMax + 1); //乱数生成;0～pMax
        } else {
            naPattern++;
        }                                                                       //パターン変更を0スタートの順送りにする場合
        if (debug_now) {
            //            naPattern = 7;          //naPattern = document.getElementById("aliveSel").value;              //1; //アニメーションパターン；-1;終了、0;左下から、1;左上から、2;右上から、3;右下から中央へ、4;右下-左-右上、5;左下-右-左上、6;左上-右-左下、7;右上-左-右下
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
        if (3 < naPattern) {
            endCount = stayTime / PhotAFRate; //   2000/ 30
            dbMsg = dbMsg + ",軌道範囲(" + startX + "," + startY + ")反転(" + stopX + "," + reverceY + ")～(" + startX + "," + stopY + ")stepY=" + stepY;
        } else {
            dbMsg = dbMsg + ",軌道範囲(" + startX + "," + startY + ")～stop(" + stopX + "," + stopY + ")";
        }
        isArrival01 = true; //登場アニメーションの飛行部分実行中
        photAria = [];
        addPhotAria(ctx.canvas.id); //エフェクトに渡す写真情報
        ctx.globalAlpha = 0.8; //で透明化してスタート
        isStayEnd = false; //画像のアニメーション静止終了
        //        myLog(dbMsg);
        photID = ctx.canvas.id; //回避エリアに渡すID
        timerArray.push(newImg_fadeTimer = setInterval(function () {
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
                stopNIAnimation();
                ctx.globalAlpha = 1.0;
                ctx.setTransform(1, 0, 0, 1, 0, 0); //setTransform;マトリックス変形 ctxのwidth×heightは変化しない
                var rect = document.getElementById(ctx.canvas.id).getBoundingClientRect();
                dbMsg = dbMsg + "ctx(" + rect.left + "," + rect.top + ")[" + rect.width + "×" + rect.height + "]";
                myLog(dbMsg);
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
                imgObj = {ctx: ctx, iObj: iObj, scale: scale_xy, x: newImg_shit_x, y: newImg_shit_y, z: newImg_shit_z};
                caB2f(imgObj, 1, 0); //奥手からZoomInにcanvasを渡す
            } else if (tfEnd) {                   // || winW < newImg_shit_x || (newImg_shit_x + newImg_resize_w) < 0 ||winH < newImg_shit_y || (newImg_shit_y + newImg_resize_h) < 0
                dbMsg = dbMsg + "----停止----win[" + winW + "×" + winH + "]";
                stayCount++;
                dbMsg = dbMsg + ",stayCount=" + stayCount + "/" + endCount;
                if (naPattern < 4 && isCenter == true) {
                    newImg_shit_x = winW / 2 - newImg_resize_w / 2; //中心に戻す
                    newImg_shit_y = winH / 2 - newImg_resize_h / 2; //中心に戻す
                    dbMsg = dbMsg + ",センター補正(" + newImg_shit_x + "," + newImg_shit_y + "," + newImg_shit_z + ")";
                }                               //直線軌道の終了前補正
            } else {
                if (ctx.globalAlpha < 0.95) {
                    ctx.globalAlpha += 0.1; //caFadeIn(0.05, ctx, iObj, newImg_shit_x, newImg_shit_y, newImg_resize_w, newImg_resize_h);
                }
                isCenter = false;
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
                        if (newImg_shit_x < winW) {           //左端が画面右へフレームアウトするまで
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
                                if (winW * 0.75　 < newImg_shit_x) {
                                    dbMsg = dbMsg + "----最終1/4経過----";
                                    degreesXZ -= degreesXZ / 10; //手前から奥へ倒す
                                    degreesYZ -= degreesYZ / 20; //手前から奥へ倒す      /16ではp23反転　、　/32では効果が薄い
                                    newImg_shit_z += (vanishingPoint - newImg_shit_z) / 7; //5ではトビが出る。10では消失しない
                                }
                            }
                        } else {
                            dbMsg = dbMsg + "----左端が画面右へフレームアウト----";
                            tfEnd = true; //終了動作に入る
                        }                                                       //ZX軸
                        break;
                    case 5:                                                         // 左下-右-左上、
                    case 6:                                                         //左上-右-左下、
                        if (0 < (newImg_shit_x + newImg_resize_w)) {           //左端が画面右へフレームアウトするまで
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
                                if (newImg_shit_x < winW / 4) {
                                    dbMsg = dbMsg + "----最終1/4経過----";
                                    degreesXZ -= degreesXZ / 10; //手前から奥へ倒す
                                    degreesYZ -= degreesYZ / 20; //手前から奥へ倒す
                                    newImg_shit_z += (vanishingPoint - newImg_shit_z) / 7; //5ではトビが出る。10では消失しない
                                }
                            }
                        } else {
                            dbMsg = dbMsg + "----左端が画面右へフレームアウト----";
                            tfEnd = true; //終了動作に入る
                        }                                                       //ZX軸
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
                switch (naPattern) {
                    case 4:                                                             //右下-左-右上
                    case 5:                                                         // 左下-右-左上、
                        newImg_shit_y -= stepY; //上昇    
                        if (newImg_shit_y <= reverceY) {
                            isXReverce = true; //横移動の反転発生;旋回軌道の前/後半判定
                            dbMsg = dbMsg + "---反転=";
                        }
                        break;
                    case 6:                                                         //左上-右-左下、
                    case 7:                                                             //右上-左-右下
                        newImg_shit_y += stepY; //降下    
                        if (reverceY <= newImg_shit_y) {
                            isXReverce = true; //横移動の反転発生;旋回軌道の前/後半判定
                            dbMsg = dbMsg + "---反転=";
                        }
                        break;
                }                                       //旋回運動のy軸移動
                var remain2Stop = Math.abs(reverceY - newImg_shit_y); //反転座標までの距離
                dbMsg = dbMsg + ",反転まで" + remain2Stop;
                switch (naPattern) {
                    case 4:                                                             //右下-左-右上
                    case 7:                                                             //右上-左-右下
                        newImg_shit_x = stopX + Math.pow(remain2Stop, 2); //右開口の放物線 
                        break;
                    case 5:                                                         // 左下-右-左上、
                    case 6:                                                         //左上-右-左下、
                        newImg_shit_x = stopX - Math.pow(remain2Stop, 2); //左開口の放物線 - newImg_resize_w
                        break;
                }                                       //旋回運動の軌跡
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
                testRect(ctx, 100, 100, 100, 100, 'red', 0, 1);
                ctx.setTransform(1, 0, 0, 1, 0, 0); //setTransform;マトリックス変形 ctxのwidth×heightは変化しない
            }
            //            myLog(dbMsg);
        }
        , PhotAFRate)); // ミリ秒ごとにキャンバスを再描画
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
        return {scale_xy: scale_xy, newImg_resize_w: newImg_resize_w, newImg_resize_h: newImg_resize_h};
    }

    //Pointクラス
    function Point(x, y) {
        this.x = x;
        this.y = y;
        return {x: this.x, y: this.y};
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
     * */
    function caB2f(imgObj, quantity, position) {
        var tag = "[arrival.caB2f]";
        var dbMsg = tag + quantity + "枚構成で位置は" + position;
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
        var targetW = winW / quantity * 0.6; //0.7
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
            nowW = winW / 100;
            scale_xy = nowW / orgW;
        }
        timerArray.push(newImg_fadeTimer = setInterval(function () {
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
                    stopNIAnimation();
                    var delNode = document.getElementById(ctx.canvas.id);
                    if (delNode) {
                        delNode.parentNode.removeChild(delNode); //特定の子要素削除
                    }
                    var cookieiD = -1;
                    if ($.cookie('slideshow.max-id') != null) {
                        cookieiD = $.cookie('slideshow.max-id');                //20170315dell
                    }
                    dbMsg = dbMsg + '、cookieに記載されているID=' + cookieiD + '、type=' + typeof (nowMaxId) + '、newId=' + newId;
                    console.log(localStorage);
                    if (cookieiD < newId) {                         //☆重複処理が発生するとundefinedになる       && (newId != undefined || newId != 'undefined')
                        localStorage.setItem("maxid", newId);
                        $.cookie('slideshow.max-id', newId);
                    }
                    var allImages = JSON.parse(localStorage.getItem("all-keys"));
                    dbMsg = dbMsg + '、再生待ちStock=' + allImages;
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
                    console.log(localStorage);
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
    }                                   // 新着アニメーションの終端；中心からFi～Fo;新着配列からStock配列への移し替え

    /**
     * フレームを付けて写真描画
     * */
    function drowPhotFream(ctx, iObj, x, y, wi, hi) {
        var tag = "[arrival.drowPhotFream]";
        var dbMsg = tag + "(" + x + "," + y + ")[" + wi + "×" + hi + "]";
        var lWidth = wi / 50;
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
        return ctx;
    }
