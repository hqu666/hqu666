var blankParcent = 0;
var blankCount = 0;
var threePointMode = false;
var isCellDrow = false;
var blankAreaInfo = "";
var divideEqually = 100;　 //分割数 
var tileCell; //タイル個々のデータ配列
var omitCount = 0;
var colEnd = 0;
var colCenter = 0;
var rowEnd = 0
var fleamWidth = 10; //フレーム幅

//スレッド管理///////////////////////////////////////////////////////////////////////////////////
var timerArray = new Array(); //左の一つ目
var rightZi2StayArray = new Array();
var leftZo2FoArray = new Array();
var rightZo2FoArray = new Array();

function stopNIAnimation(delArrey) {
    var tag = "[stopNIAnimation]";
    var dbMsg = tag + ",timerArray=" + delArrey.length + "スレッド稼働中";
    if (delArrey != null) {
        while (0 < delArrey.length) {
            // if (0 < delArrey.length) {
            clearInterval(delArrey.shift());
        }
    }
    var dbMsg = dbMsg + ">稼働中>" + delArrey.length + "スレッド";
    // myLog(dbMsg);
}

////////////////////////////////////////////////////////////////////////////////スレッド管理/////

/**
 * 当分割した升目を作成して比率取り/スライドショーへ
 * @param {*} divideEqually    　分割数 
 * https://techacademy.jp/magazine/5600
 */
// function makeMeasure(divideEqually) {
//     var tag = "[makeMeasure]";
//     var dbMsg = tag;
//     var totalSpace = winW * winH; //総面積
//     dbMsg = dbMsg + totalSpace;
//     var individuallySpace = totalSpace / divideEqually; //個々の面積
//     dbMsg = dbMsg + "/" + divideEqually + "=" + individuallySpace + ",threePointMode=" + threePointMode;
//     var wSide = Math.sqrt(individuallySpace); //+ 0.5
//     dbMsg = dbMsg + ">>一辺=" + wSide;
//     colEnd = Math.round(winW / wSide);
//     dbMsg = dbMsg + ",colEnd=" + colEnd + ",偶数判定=" + colEnd % 2 + ",偶数指定=" + isEven;
//     var amari = winW - winW / wSide;
//     if (isEven) {
//         if (colEnd % 2 == 1) {
//             colEnd = colEnd + 1;
//         }
//         dbMsg = dbMsg + ">colEnd>" + colEnd;
//     } else {
//         if (colEnd % 2 == 0) {
//             colEnd = colEnd - 1;
//         }
//         dbMsg = dbMsg + ">colEnd>" + colEnd;
//     }
//     // var addEach = (winW - winW / wSide) / colEnd;
//     wSide = winW / colEnd;
//     dbMsg = dbMsg + ">>" + colEnd + "Col>>一辺=" + wSide;
//     colCenter = colEnd / 2;

//     var rowPosition = 0;
//     rowEnd = Math.round(winH / wSide);
//     var shiftX = 0;
//     var lineMax = Math.round(winW / wSide);
//     var centerCol = Math.round(lineMax / 2);
//     var rightSideCel = lineMax;
//     dbMsg = dbMsg + ",一行当たり" + lineMax + "列、中心" + centerCol + "列目";
//     rowEnd = Math.round(winH / wSide);
//     dbMsg = dbMsg + ",rowEnd=" + rowEnd + ",偶数判定=" + rowEnd % 2;
//     rowEnd = rowEnd + rowEnd % 2
//     var hSide = winH / rowEnd;
//     dbMsg = dbMsg + "row>>一辺=" + hSide;
//     tileCell = []; //タイル個々のデータ配列
//     blankCount = 0;
//     myLog(dbMsg);
//     do {
//         rowPosition++;
//         dbMsg = dbMsg + "\n(" + rowPosition + "行目";
//         var rName = "R" + rowPosition;
//         var yePosition = hSide * rowPosition;
//         var colPosition = 0;
//         shiftX = 0;
//         omitCount = 0;
//         var leftSideCel = 0;
//         do {
//             colPosition++;
//             dbMsg = dbMsg + "c" + colPosition;
//             var cName = "C" + colPosition;
//             // var cellName = rName + colName;
//             var xePosition = wSide * colPosition + shiftX;
//             if (threePointMode) {
//                 judge = tplfJudge(rowPosition, colPosition, wSide, hSide, 3);
//             } else {
//                 judge = writeJudge(rowPosition, colPosition, wSide, hSide);
//             }
//             if ((judge && layoutVal == 0) || (!judge && layoutVal == 1)) {
//                 // dbMsg = dbMsg + "," + cellName + "=(" + xePosition + "," + yePosition + ")";
//                 var cellDate = new Array(rowPosition, colPosition, xePosition - wSide, yePosition - hSide, wSide, hSide);
//                 tileCell.push(cellDate); //末尾に追加
//                 if (0 < omitCount) {
//                     dbMsg = dbMsg + "C" + colPosition + "まで";
//                 }
//                 omitCount = 0;
//             } else {
//                 blankCount++;
//                 if (leftSideCel == 0 && colPosition < centerCol) {
//                     leftSideCel = colPosition - 1;
//                     rightSideCel = lineMax - leftSideCel - 1;
//                 }
//                 omitCount++;
//                 switch (omitCount) {
//                     case 1:
//                         shiftX = wSide / 2;
//                         dbMsg = dbMsg + ",回避開始C" + colPosition + "～";
//                         xePosition = wSide * colPosition + shiftX;
//                         if (threePointMode) {
//                             judge = tplfJudge(rowPosition, colPosition, wSide, hSide, 3);
//                         } else {
//                             judge = writeJudge(rowPosition, colPosition, wSide, hSide);
//                         }
//                         if ((judge && layoutVal == 0) || (!judge && layoutVal == 1)) {
//                             // dbMsg = dbMsg + "," + cellName + "=(" + xePosition + "," + yePosition + ")";
//                             var cellDate = new Array(rowPosition, colPosition, xePosition - wSide, yePosition - hSide, wSide, hSide);
//                             tileCell.push(cellDate); //末尾に追加
//                             if (0 < omitCount) {
//                                 dbMsg = dbMsg + "C" + colPosition + "まで";
//                             }
//                             omitCount = 0;
//                         } else {
//                             shiftX = 0;
//                         }
//                         break;
//                 }
//                 if (rightSideCel <= colPosition) {
//                     shiftX = 0;
//                 }
//             }
//         } while (xePosition <= winW);
//         lineMax = colPosition;
//         dbMsg = dbMsg + "," + lineMax + "列,左端=" + leftSideCel + "列目,右端=" + rightSideCel + "列目";
//     } while (yePosition <= winH && rowPosition < rowEnd);
//     dbMsg = tag + "," + tileCell.length + "升,blankParcent=" + blankParcent + "%";
//     myLog(dbMsg);
//     if (blankParcent == 0) {
//         blankParcent = blankCount / divideEqually;
//         getlocalHostDirFils('thmbs/');
//         //   setDEqually();
//     } else {
//         assignment2Measure();
//     }
//     var colorMoni = document.getElementById('colorMoniter');
//     colorMoni.textContent = "枠内;" + blankCount + "/総数;" + divideEqually + "=" + divideEqually + "%";
// } //当分割した升目を作成

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
        pushLoopStart();
    }
} //書き込み可能な枠へ割付け;セル数分のループ

/**
 * 左右に振り分けた配列からの書き出し
 */
function pushLoopStart() {
    var tag = "[slide.pushLoopStart]";
    var dbMsg = tag + "(" + cellCount + ")左" + leftCell.length + "件から";
    if (0 < leftCell.length) {
        var targetNo = Math.floor(Math.random() * leftCell.length); // 最終からなら var trgetNo=rightCell.length - 1;
        var lData = leftCell.splice(targetNo, 1);
        dbMsg = dbMsg + ",R" + lData[0][0] + "C" + lData[0][1];
        dbMsg = dbMsg + ">>" + leftCell.length + "件待機";
        if (lData) {
            var thmSrc = thmbnails[cellCount];
            if (thmSrc) {
                cellCount++;
            } else {
                thmSrc = thmbnails[0];
                cellCount = 1;
            }
            dbMsg = dbMsg + "thmSrc=" + thmSrc + ">>" + leftCell.length + "件";
            myLog(dbMsg);
            makeACanvae(lData, thmSrc);
        }
    }
} //左に振り分けた配列からの書き出し

function pushLoopStartRight() {
    var tag = "[slide.pushLoopStartRight]";
    var dbMsg = tag + "(" + cellCount + ")右=" + rightCell.length + "件から";
    if (0 < rightCell.length) {
        var targetNo = Math.floor(Math.random() * rightCell.length); // 最終からなら var trgetNo=rightCell.length - 1;
        var rData = rightCell.splice(targetNo, 1);
        dbMsg = dbMsg + ",R" + rData[0][0] + "C" + rData[0][1];
        dbMsg = dbMsg + ">>" + rightCell.length + "件待機";
        if (rData) {
            var thmSrc = thmbnails[cellCount];
            if (thmSrc) {
                cellCount++;
            } else {
                thmSrc = thmbnails[0];
                cellCount = 1;
            }
            dbMsg = dbMsg + "thmSrc=" + thmSrc + "、右=" + rightCell.length + "件";
            // myLog(dbMsg);
            makeACanvae(rData, thmSrc);
        }
    }
} //右に振り分けた配列からの書き出し

/**
 * 左右それぞれのcanvasを作成して
 */
function makeACanvae(cellData, thmSrc) {
    var tag = "[slide.makeACanvae]";
    var dbMsg = tag + "thmSrc=" + thmSrc;
    var rowPosition = cellData[0][0];
    var colPosition = cellData[0][1];
    var cellName = "R" + rowPosition + "C" + colPosition;
    dbMsg = dbMsg + "を" + cellName;
    var wAriaWidth = winW / 2; //書込み領域幅
    var wightWidth = wAriaWidth * 0.7; //目標サイズ
    var wrStartX = (wAriaWidth - wightWidth) / 2;; //最終x
    var aCanvasName = cellName + "left";
    var rotate = -5;
    if (colCenter < colPosition) { //右側なら
        aCanvasName = cellName + "right";
        wrStartX = wAriaWidth + (wAriaWidth - wightWidth) / 2;
        rotate = 5;
    }
    dbMsg = dbMsg + "=" + aCanvasName + ",x=" + wrStartX + "," + rotate + "°";
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
    img.crossOrigin = "Anonymous"; //XAMPP必要；file;//ではcrossdomeinエラー発生
    img.onload = function(event) {
        dbMsg = dbMsg + tag + ".onload]";
        var dstWidth = this.width;
        var dstHeight = this.height;
        dbMsg = dbMsg + ",dst[" + dstWidth + "×" + dstHeight + "]=" + (dstWidth / dstHeight);
        var aCanvasWidth = wAriaWidth;
        var aCanvasHeight = winH;
        dbMsg = dbMsg + ",aCanvas[" + aCanvasWidth + "×" + aCanvasHeight + "]";
        var scaleWidth = dstWidth / aCanvasWidth;
        var scaleHeight = dstHeight / aCanvasHeight;
        var tile_bace_size = document.getElementById("tile_bace_size"); //idで親要素を取得          //http://unitopi.com/jquery-parent-child-3/
        tileBaceSize = tile_bace_size.value * 1; //idで親要素を取得          //http://unitopi.com/jquery-parent-child-3/
        dbMsg = dbMsg + ",枠サイズ" + tileBaceSize + "%";
        dbMsg = dbMsg + ",scale[" + scaleWidth + "×" + scaleHeight + "%]更に" + tileBaceSize + "%";
        var endScale = 1 / scaleHeight * tileBaceSize / 100;
        if (scaleHeight < scaleWidth) {
            endScale = 1 / scaleWidth * tileBaceSize / 100;
        }
        dbMsg = dbMsg + "," + endScale + "%";
        dstWidth = dstWidth * endScale;
        dstHeight = dstHeight * endScale;
        dbMsg = dbMsg + ",dst[" + dstWidth + "×" + dstHeight + "]=" + (dstWidth / dstHeight);
        var wrStartY = (winH - dstHeight) / 2;
        dbMsg = dbMsg + ",(" + wrStartX + "," + wrStartY + ")";

        var endScale = winW / 2 * 0.7;
        var StrtScale = winW / 2 * 0.2;
        if (dstWidth < dstHeight) {
            endScale = winH / 2 * 0.7;
            StrtScale = winH / 2 * 0.2;
        }
        dbMsg = dbMsg + ",ズームアップ⁼" + StrtScale + "～" + endScale;
        amimeCtx.clearRect(0, 0, aCanvasWidth, aCanvasHeight);
        amimeCtx.drawImage(this, wrStartX, wrStartY, dstWidth, dstHeight);
        dbMsg = dbMsg + "終了";
        myLog(dbMsg);
        amimeCtx.globalAlpha = 0.0;
        var imgObj = { ctx: amimeCtx, iObj: img, scale: endScale, x: wrStartX, y: wrStartY, w: dstWidth, h: dstHeight, rot: rotate, cell: cellData };
        zi2Stay(amimeCtx, imgObj, 0, 0);
        if (colPosition <= colCenter) {
            pushLoopStartRight();
        }
    }
}

/**
 * フェードインしながらズームアップして停止
 * 回転       http://jsdo.it/tomozz/nV0E
 */
function zi2Stay(wrCTX, imObj, aCount, dig) {
    var tag = "[slide.zi2Stay]";
    var dbMsg = tag + "(" + aCount + ")";
    var img = imObj.iObj;
    var biScale = imObj.scale;
    var wrStartX = imObj.x;
    var wrStartY = imObj.y;
    var dstWidth = imObj.w;
    var dstHeight = imObj.h;
    var rotate = imObj.rot;
    var cellData = imObj.cell;
    var upAlpha = 0.05; //%なので増分値は掛けるだけ
    var upDig = rotate * upAlpha;
    var nowScale = biScale * upAlpha;

    dbMsg = dbMsg + "thmSrc=" + img.src;
    dbMsg = dbMsg + "を" + wrCTX.canvas.id;
    var rowPosition = cellData[0][0];
    var colPosition = cellData[0][1];
    // var cellName = "R" + rowPosition + "C" + colPosition;
    // dbMsg = dbMsg + cellName;       
    var wrObj = { ctx: wrCTX, iObj: img, scale: biScale, x: wrStartX, y: wrStartY, w: dstWidth, h: dstHeight, rot: rotate, cell: cellData };
    if (5 < aCount) { //10なら*100mSで1秒
        var dbMsg = dbMsg + ">>次へ";
        if (colPosition <= colCenter) {
            stopNIAnimation(timerArray);
        } else {
            stopNIAnimation(rightZi2StayArray);
        }
        myLog(dbMsg);
        zo2Fo(wrCTX, wrObj, 0, dig);
    } else {
        wrCTX.globalAlpha += upAlpha;
        dbMsg = dbMsg + "、Alpha=" + wrCTX.globalAlpha;
        if ((1 - upAlpha) < wrCTX.globalAlpha) {
            wrCTX.globalAlpha = 1.0;
            aCount++;
            myLog(dbMsg);
        } else {
            dbMsg = dbMsg + "のスケール=" + wrCTX.globalAlpha + "(" + biScale + ")%";
            var nowWidth = dstWidth * wrCTX.globalAlpha;
            var nowHeight = dstHeight * wrCTX.globalAlpha;
            var dWidth = (dstWidth - nowWidth) / 2;
            var nowStartX = wrStartX + dWidth; //中心固定　wrStartX + (dstWidth - nowWidth) / 2;
            var dHeight = (dstHeight - nowHeight) / 2;
            var nowStartY = wrStartY + dHeight; //中心固定　 wrStartY + (dstHeight - nowHeight) / 2
            dbMsg = dbMsg + "で(" + nowStartX + "、" + nowStartY + ")[" + nowWidth + "、" + nowHeight + "]";

            dbMsg = dbMsg + "のdig=" + dig + "°";
            dig = dig + upDig;
            if (colPosition <= colCenter) { //左側
                // dig = dig - upDig;
                if (dig < (-5 + upDig)) {
                    dig = -5;
                }
                nowStartX = nowStartX + dWidth; //中心に寄せる      ☆2では交差する
                // nowStartY = nowStartY + dHeight;
            } else {
                // dig = dig + upDig;
                if ((5 - upDig) < dig) {
                    dig = 5;
                }
                nowStartX = nowStartX - dWidth;
                // nowStartY = nowStartY - dHeight;
            }
            dbMsg = dbMsg + ",x=" + nowStartX;
            dbMsg = dbMsg + ">>" + dig + "°";
            var rad = dig * Math.PI / 180; // 回転角度をラジアン値で設定
            dbMsg = dbMsg + "=" + rad + "red";
            // dbMsg = dbMsg + ",[Scale=" + biScale + "%,Start(" + wrStartX + "," + wrStartY + ")[" + dstWidth + "×" + dstHeight + "]";
            wrCTX.clearRect(0, 0, winW, winH); //wrCTX.canvas.height, wrCTX.canvas.width);
            var dX = nowWidth * Math.sin(rad); //dstWidth
            var dY = nowHeight * Math.sin(rad); //dstHeight
            // if (colPosition <= colCenter) { //左側
            //     dY = -dY;
            // } else {

            // }
            dbMsg = dbMsg + "、移動(" + dX + "," + dY + ")";
            // var orgX = wrStartX + dX;
            // var orgY = wrStartY + dY;
            // dbMsg = dbMsg + "、原点補正(" + orgX + "," + orgY + ")";
            wrCTX.setTransform(Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), dX, -dY);
            wrCTX.fillStyle = 'white';
            wrCTX.fillRect(nowStartX - fleamWidth, nowStartY - fleamWidth, nowWidth + fleamWidth * 2, nowHeight + fleamWidth * 2);
            wrCTX.drawImage(img, nowStartX, nowStartY, nowWidth, nowHeight); //, wrStartX, wrStartY, dstWidth, dstHeight);  // nowStartX, nowStartY, nowWidth, nowHeight);
            myLog(dbMsg);
        }
        // dbMsg = dbMsg + ">>[Scale=" + biScale + "%,Start(" + wrStartX + "," + wrStartY + ")[" + dstWidth + "×" + dstHeight + "]";
        wrObj = { ctx: wrCTX, iObj: img, scale: biScale, x: wrStartX, y: wrStartY, w: dstWidth, h: dstHeight, rot: rotate, cell: cellData };
        if (colPosition <= colCenter) {
            timerArray.push(setTimeout(function() {
                zi2Stay(wrCTX, wrObj, aCount, dig);
            }, 50));
        } else {
            rightZi2StayArray.push(setTimeout(function() {
                zi2Stay(wrCTX, wrObj, aCount, dig);
            }, 50));
        }
    }
}

function zo2Fo(wCTX, wObj, aCount, dig) {
    var tag = "[slide.zo2Fo]";
    var imObj = wObj.iObj;
    var dbMsg = tag + "thmSrc=" + imObj.src;
    var img = imObj;
    var biScale = wObj.scale;
    var wrStartX = wObj.x;
    var wrStartY = wObj.y;
    var dstWidth = wObj.w;
    var dstHeight = wObj.h;
    // console.log(img);
    var cellData = wObj.cell;
    var rowPosition = cellData[0][0];
    var colPosition = cellData[0][1];
    var cellName = "R" + rowPosition + "C" + colPosition;
    dbMsg = dbMsg + "を" + cellName;
    var netxId = wCTX.canvas.id;
    dbMsg = dbMsg + "に" + netxId;
    var downAlpha = 0.1; //%なので増分値は掛けるだけ
    var wrObj = { ctx: wCTX, iObj: img, scale: biScale, x: wrStartX, y: wrStartY, w: dstWidth, h: dstHeight, cell: cellData };
    if (2 < aCount) { //10なら*100mSで1秒
        drowThumb(cellData, imObj.src);
        dellElement(netxId, colPosition);
        if (colCenter <= colPosition) { //右側
            stopNIAnimation(rightZo2FoArray);
            dbMsg = dbMsg + "、残り=" + rightCell.length + "件";
            if (0 < rightCell.length) { // && 0 < leftCell.length
                dbMsg = dbMsg + ">>次へ";
                myLog(dbMsg);
                pushLoopStart();
            }
        } else {
            stopNIAnimation(leftZo2FoArray);
        }
    } else {
        wCTX.globalAlpha -= downAlpha;
        dbMsg = dbMsg + "、Alpha=" + wCTX.globalAlpha;
        if (wCTX.globalAlpha == 0) {
            wCTX.globalAlpha = 0;
            aCount++;
        } else {
            if (wCTX.globalAlpha < downAlpha) {
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
                // dig = dig + upDig;
                // if ((5 - upDig) < dig) {
                //     dig = 5;
                // }
                nowStartX = nowStartX + dWidth; //中心に寄せる      ☆2では交差する
                // nowStartY = nowStartY + dWHeight / 2;
            } else {
                // dig = dig - upDig;
                // if (dig < (-5 + upDig)) {
                //     dig = -5;
                // }
                nowStartX = nowStartX - dWidth; //中心に寄せる      ☆2では交差する
            }
            dbMsg = dbMsg + ",x=" + nowStartX;
            dbMsg = dbMsg + ">>" + dig + "°";
            var rad = dig * Math.PI / 180; // 回転角度をラジアン値で設定
            dbMsg = dbMsg + "=" + rad + "red";
            // dbMsg = dbMsg + ",[Scale=" + biScale + "%,Start(" + wrStartX + "," + wrStartY + ")[" + dstWidth + "×" + dstHeight + "]";
            wCTX.clearRect(0, 0, winW, winH);
            var dX = nowWidth * Math.sin(rad);
            var dY = nowHeight * Math.sin(rad);
            dbMsg = dbMsg + "、移動(" + dX + "," + dY + ")";
            wCTX.setTransform(Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), dX, -dY);
            wCTX.fillStyle = 'white';
            wCTX.fillRect(nowStartX - fleamWidth, nowStartY - fleamWidth, nowWidth + fleamWidth * 2, nowHeight + fleamWidth * 2);
            wCTX.drawImage(img, nowStartX, nowStartY, nowWidth, nowHeight);

        }
        // dbMsg = dbMsg + ">>[Scale=" + biScale + "%,Start(" + wrStartX + "," + wrStartY + ")[" + dstWidth + "×" + dstHeight + "]";
        wrObj = { ctx: wCTX, iObj: img, scale: biScale, x: wrStartX, y: wrStartY, w: dstWidth, h: dstHeight, cell: cellData };
        if (colPosition <= colCenter) {
            leftZo2FoArray.push(setTimeout(function() {
                zo2Fo(wCTX, wObj, aCount, dig);
            }, 50));
        } else {
            rightZo2FoArray.push(setTimeout(function() {
                zo2Fo(wCTX, wObj, aCount, dig);
            }, 50));
        }
    }

} //書き込み可能な枠へ割付け;セル数分のループ

function dellElement(netxId, colPosition) {
    var tag = "[slide.dellElement]";
    var dbMsg = tag + netxId + ",C" + colPosition;
    try {
        if (document.getElementById(netxId)) {
            dbMsg = dbMsg + "既存の" + netxId + "を削除";
            var aNode = document.getElementById(netxId);
            aNode.parentNode.removeChild(aNode);
        }
        if (colCenter <= colPosition) { //右側
            // if (0 < rightCell.length) { // && 0 < leftCell.length
            var parentOj = document.getElementById("newimg_div");
            while (parentOj.lastElementChild) { //消せなかったエレメントを
                dbMsg = dbMsg + "消せなかったエレメント=" + parentOj.lastElementChild.id;
                parentOj.removeChild(parentOj.lastElementChild); //削除
            }
        }

    } catch (e) {}
    myLog(dbMsg);
}