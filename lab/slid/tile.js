var debug_now = true;
var blankParcent = 0;
var blankCount = 0;
// var threePointMode = false;
var isCellDrow = false;
var blankAreaInfo = "";
var readColorInfo = "";
var revsarceColor = 'rgba(255,255,255,1)';
var divideEqually = 100;　 //分割数 
var tileCell; //タイル個々のデータ配列
var omitCount = 0;
var colEnd = 0;
var colCenter = 0;
var rowEnd = 0


function getCellData(divideEqually) {
    var tag = "[getCellData]";
    var dbMsg = tag;
}

/**
 * 指定された範囲が着色された範囲が掛かればfalseを返す
 * ・四隅と各辺中央で判定
 * @param {*} xePosition 
 * @param {*} yePosition 
 * @param {*} wSide 
 * @param {*} hSide 
 */
function writeJudge(rowPositon, cellPositon, wSide, hSide) {
    var tag = "[writeJudge]";
    var dbMsg = "R" + rowPositon + "C" + cellPositon;
    var retBool = true;
    var judgVal = 30;
    var agreePx = 0;
    var xS = (cellPositon - 1) * wSide;
    var yS = (rowPositon - 1) * hSide;
    // dbMsg = dbMsg + "(" + xS + "," + yS + ")";
    var xePosition = xS + wSide;
    var yePosition = yS + hSide;
    // dbMsg = dbMsg + "(" + xePosition + "," + yePosition + ")";
    retBool = writeJudgeBody(xS + agreePx, yS + agreePx, judgVal);
    if (retBool == true) {
        retBool = writeJudgeBody(xePosition - agreePx, yS + agreePx, judgVal);
        if (retBool == true) {
            retBool = writeJudgeBody(xS + agreePx, yePosition - agreePx, judgVal);
            if (retBool == true) {
                retBool = writeJudgeBody(xePosition - agreePx, yePosition - agreePx, judgVal);
                if (retBool == true) {
                    retBool = writeJudgeBody(xS + wSide / 2, yS, judgVal); //上中央
                    if (retBool == true) {
                        retBool = writeJudgeBody(xePosition - wSide / 2, yS, judgVal); //右中央
                        if (retBool == true) {
                            retBool = writeJudgeBody(xS + wSide / 2, yePosition, judgVal); //左中央
                            if (retBool == true) {
                                retBool = writeJudgeBody(xePosition - wSide / 2, yePosition, judgVal); //下中央
                                if (retBool == true) {
                                    dbMsg = dbMsg + "追加";
                                } else {
                                    dbMsg = dbMsg + ",下中央";
                                }
                            } else {
                                dbMsg = dbMsg + ",左中央";
                            }
                        } else {
                            dbMsg = dbMsg + ",右中央";
                        }
                    } else {
                        dbMsg = dbMsg + ",上中央";
                    }
                } else {
                    dbMsg = dbMsg + ",右下";
                }
            } else {
                dbMsg = dbMsg + ",左下";
            }
        } else {
            dbMsg = dbMsg + ",右上";
        }
    } else {
        dbMsg = dbMsg + ",左上";
    }
    if (!retBool) {
        blankAreaInfo = blankAreaInfo + dbMsg + readColorInfo + '\n';
        dbMsg = tag + dbMsg + readColorInfo;
        // myLog(dbMsg);
    }
    return retBool;
} //指定された範囲が着色された範囲が掛かればfalseを返す

/**
 * 最終パラメータで指定された頂点数に画像が掛からなければtrue
 * ただし各辺の中心に画像が掛かれば減点
 * @param {*} xePosition 
 * @param {*} yePosition 
 * @param {*} whSide 
 * @param {*} hSide 
 * @param {*} tPoint 
 */
function tplfJudge(rowPositon, cellPositon, whSide, hSide, tPoint) {
    var tag = "[tplfJudge]";
    var dbMsg = "R" + rowPositon + "C" + cellPositon;
    var retBool = true;
    var totalPoint = 1;
    var judgVal = 30;
    var agreePx = 0; //隣接誤判定の回避値
    var xS = (cellPositon - 1) * whSide;
    var yS = (rowPositon - 1) * hSide;
    // dbMsg = dbMsg + "(" + xS + "," + yS + ")";
    var xePosition = xS + whSide;
    var yePosition = yS + hSide;
    // dbMsg = dbMsg + "(" + xePosition + "," + yePosition + ")";
    if (!writeJudgeBody(xS + agreePx, yS + agreePx, judgVal)) {
        totalPoint++;
    } else {
        dbMsg = dbMsg + ",左上";
    }
    if (!writeJudgeBody(xePosition - agreePx, yS + agreePx, judgVal)) {
        totalPoint++;
    } else {
        dbMsg = dbMsg + ",右上";
    }
    if (!writeJudgeBody(xS + agreePx, yePosition - agreePx, judgVal)) {
        totalPoint++;
    } else {
        dbMsg = dbMsg + ",左下";
    }
    if (!writeJudgeBody(xePosition - agreePx, yePosition - agreePx, judgVal)) {
        totalPoint++;
    } else {
        dbMsg = dbMsg + ",右下";
    }
    if (!writeJudgeBody(xS + whSide / 2, yS, judgVal)) {
        totalPoint++;
        // } else {
        dbMsg = dbMsg + ",上中央";
    }
    if (!writeJudgeBody(xePosition - hSide / 2, yS, judgVal)) {
        totalPoint++;
        // } else {
        dbMsg = dbMsg + ",右中央";
    }
    if (!writeJudgeBody(xS + hSide / 2, yePosition, judgVal)) {
        totalPoint++;
        // } else {
        dbMsg = dbMsg + ",左中央";
    }
    if (!writeJudgeBody(xePosition - whSide / 2, yePosition, judgVal)) {
        totalPoint++;
        // } else {
        dbMsg = dbMsg + ",下中央";
    }
    retBool = true;
    if (tPoint <= totalPoint) {
        retBool = false;
    }
    // dbMsg = dbMsg + ",judgeBool=" + retBool;
    if (!retBool) {
        dbMsg = dbMsg + ",totalPoint=" + totalPoint + "/" + tPoint;
        blankAreaInfo = blankAreaInfo + dbMsg + readColorInfo + '\n';
        dbMsg = tag + dbMsg + readColorInfo;
        // myLog(dbMsg);
    }
    return retBool;
} //最終パラメータで指定された頂点数に画像が掛からなければtrue

/**
 * 指定されたポイントの色がjudgValより濃い色調ならfalseを返す
 * @param {*} xePosition 
 * @param {*} yePosition 
 * @param {*} judgVal 
 */
function writeJudgeBody(xePosition, yePosition, judgVal) {
    var tag = "[writeJudgeBody]";
    var dbMsg = tag + "judgVal=" + judgVal;

    var retBool = true;
    var rgbaStr = readColor(xePosition, yePosition);
    dbMsg = dbMsg + "," + rgbaStr;
    var rgbaStrs = rgbaStr.split(",");
    var cVal = rgbaStrs[0] * 1 + rgbaStrs[1] * 1 + rgbaStrs[2] * 1;
    var alfa = rgbaStrs[3] * 1;
    readColorInfo = "(" + Math.round(xePosition) + "," + Math.round(yePosition) + ")R" + rgbaStrs[0] + "G" + rgbaStrs[1] + "B" + rgbaStrs[2] + "α" + rgbaStrs[2] + ",合計=" + cVal + "/" + judgVal;
    dbMsg = dbMsg + "=cVal=" + cVal;
    if (cVal != 0 || 0 < alfa) { //0=黒と無着色
        retBool = false;
    }
    dbMsg = dbMsg + "終了";
    // myLog(dbMsg);
    return retBool;
} //指定されたポイントの色がjudgValより濃い色調ならfalseを返す

/**
 * 指定された座標のRGBAを返す
 * @param {*} x 
 * @param {*} y 
 * https://developer.mozilla.org/ja/docs/Web/Guide/HTML/Canvas_tutorial/Pixel_manipulation_with_canvas
 * http://mementoo.info/archives/1617
 */
function readColor(x, y) {
    var tag = "[readColor]";
    var dbMsg = tag + "(" + x + "," + y + ")";
    var pixel = tbCtx.getImageData(x, y, 1, 1);
    var data = pixel.data;
    var rgba = +data[0] + ',' + data[1] + ',' + data[2] + ',' + (data[3] / 255);
    // var rgba = 'rgba(' + data[0] + ',' + data[1] + ',' + data[2] + ',' + (data[3] / 255) + ')';
    revsarceColor = 'rgba(' + (255 - data[0] * 1) + ',' + (255 - data[1] * 1) + ',' + (255 - data[2] * 1) + ',' + 1 + ')';
    if (data[3] == 0) { //透明の場合
        revsarceColor = 'rgba(0,0,0,1)';
        // rgba = 'rgba(255,255,255,1)';
    }
    dbMsg = tag + "rgba=" + rgba;
    // myLog(dbMsg);
    return rgba;
} //指定された座標のRGBAを返す

/**
 * 書き込み可能な枠へ割付け
 * 
 */
function assignmentMeasure() {
    var tag = "[assignmentMeasure]";
    var dbMsg = tag + tileCell.length + "件";
    var cellCount = 0;
    do {
        var cellDate = tileCell.splice(0, 1); //指定位置からいくつまで抜き出すか    http://qiita.com/takeharu/items/d75f96f81ff83680013f
        if (cellDate) {
            var thmSrc = thmbnails[cellCount];
            drowThumb(cellDate, thmSrc);
        } else {
            dbMsg = dbMsg + tileCell.length + "件=" + cellDate;
        }
        cellCount++;
        if (thmbnails.length <= cellCount) {
            cellCount = 0;
        }
    } while (0 < tileCell.length);
    dbMsg = dbMsg + "終了";
    myLog(dbMsg);
} //書き込み可能な枠へ割付け;セル数分のループ