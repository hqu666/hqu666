var isCellDrow = false;
var blankAreaInfo = "";
var readColorInfo = "";
var revsarceColor = 'rgba(255,255,255,1)';
var isEven = false;
var threePointMode = false;
var testPointVal = 3;
var layoutVal = 2;
var lineColmun = 2;
var b_judge = false; //前回判定地；線形取得
var doneCount = 0; //連続して同状況がいくつ続くか

/**
 * ローカルホストのデレクトリーないファイルを取得
 * * */
function getlocalHostDirFils(tFolderName) {
    var tag = "[common.getlocalHostDirFils]";
    var dbMsg = tag + "指定=" + tFolderName;
    thmbnails.push(tFolderName + 'cl11.png');
    thmbnails.push(tFolderName + 'cl12.png');
    thmbnails.push(tFolderName + 'cl13.png');
    thmbnails.push(tFolderName + 'di11.png');
    thmbnails.push(tFolderName + 'di12.png');
    thmbnails.push(tFolderName + 'di13.png');
    thmbnails.push(tFolderName + 'ha11.png');
    thmbnails.push(tFolderName + 'ha12.png');
    thmbnails.push(tFolderName + 'ha13.png');
    thmbnails.push(tFolderName + 'sp11.png');
    thmbnails.push(tFolderName + 'sp12.png');
    thmbnails.push(tFolderName + 'sp13.png');
    // var folderRef = new Folder(tFolderName); //一覧を取得するフォルダを指定します
    // var fileList = folderRef.getFiles(); //ファイルリスト（ フォルダ含む全て） を取得します
    // for (i = 0; i < fileList.length; i++) { //ファイル数だけ繰り返します
    //     var thubName = files[i].webkitRelativePath; //'thmbs/'
    //     dbMsg = dbMsg + thubName + "<br>";
    //     thmbnails.push(thubName);
    // }
    myLog(dbMsg);
    setDEqually();
}
/**
 *分割薄の指定を読取り、処理を開始
 */
function setDEqually() {
    var tag = "[common.setDEqually]";
    var dbMsg = tag;
    flCtx.clearRect(0, 0, winW, winH);
    var dEqually = document.getElementById("dEqually"); //
    if (blankCount == 0 && blankParcent == 0) {
        divideEqually = 2000;
    } else {
        divideEqually = dEqually.value;　
        divideEqually = Math.round(divideEqually * (1 / blankParcent));
    }
    dbMsg = dbMsg + ",分割数" + divideEqually;
    // threePointMode = $("[name=three_point]").prop("checked");
    // var three_point = document.getElementById("three_point"); //document.form1.three_point.checked;
    // threePointMode = three_point.checked;
    if (threePointMode != true) {
        threePointMode = false;
    }
    dbMsg = dbMsg + ",threePointMode=" + threePointMode;
    var is_cell_drow = document.getElementById("is_cell_drow"); // = document.form1.debug_mode.checked;
    isCellDrow = is_cell_drow.checked;
    blankAreaInfo = '4頂点中3点まで許容\n';
    if (isCellDrow != true) {
        isCellDrow = false;
        blankAreaInfo = '4頂点中1点でも掛かれば除外\n';
    }
    dbMsg = dbMsg + ",isCellDrow=" + isCellDrow;
    myLog(dbMsg);
    tileBaceRead(srcName);
} //指定された座標のRGBAを返す

/**
 * 型になる静止画を読み込む
 * @param {*} srcName 型の画像ファイル名
 */
function tileBaceRead(srcName) {
    var tag = "[common.tileBaceRead]";
    var img = new Image();
    img.src = srcName;
    var dbMsg = tag + ",src=" + img.src;
    img.crossOrigin = "Anonymous"; //XAMPP必要；file;//ではcrossdomeinエラー発生
    img.onload = function(event) {
        var dbMsg = tag + "[tileBaceRead.onload]";
        var dstWidth = this.width;
        var dstHeight = this.height;
        dbMsg = dbMsg + ",dst[" + dstWidth + "×" + dstHeight + "]=" + (dstWidth / dstHeight);
        var tbCanvasWidth = tbCanvas.width;
        var tbCanvasHeight = tbCanvas.height;
        dbMsg = dbMsg + ",tbCanvas[" + tbCanvasWidth + "×" + tbCanvasHeight + "]";
        var scaleWidth = dstWidth / tbCanvasWidth;
        var scaleHeight = dstHeight / tbCanvasHeight;
        var tile_bace_size = document.getElementById("tile_bace_size"); //idで親要素を取得          //http://unitopi.com/jquery-parent-child-3/
        tileBaceSize = tile_bace_size.value * 1; //idで親要素を取得          //http://unitopi.com/jquery-parent-child-3/
        dbMsg = dbMsg + ",枠サイズ" + tileBaceSize + "%";
        dbMsg = dbMsg + ",scale[" + scaleWidth + "×" + scaleHeight + "%]更に" + tileBaceSize + "%";
        var biScale = 1 / scaleHeight * tileBaceSize / 100;
        if (scaleHeight < scaleWidth) {
            biScale = 1 / scaleWidth * tileBaceSize / 100;
        }
        dbMsg = dbMsg + "," + biScale + "%";
        dstWidth = dstWidth * biScale;
        dstHeight = dstHeight * biScale;
        dbMsg = dbMsg + ",dst[" + dstWidth + "×" + dstHeight + "]=" + (dstWidth / dstHeight);
        var shiftX = (winW - dstWidth) / 2;
        var shiftY = (winH - dstHeight) / 2;
        dbMsg = dbMsg + ",(" + shiftX + "," + shiftY + ")";
        tbCtx.clearRect(0, 0, tbCanvas.width, tbCanvas.height);
        tbCtx.drawImage(this, shiftX, shiftY, dstWidth, dstHeight);
        // myLog(dbMsg);
        var dEqually = divideEqually;
        if (blankParcent == 0) {
            dEqually = 1000;
        }
        makeMeasure(dEqually); //tile.jsもしくはslideshow.jsへ
    }
} //型になる静止画を読み//

/**
 * 面配置用の配列作成
 * @param {*} rowPosition 
 * @param {*} colPosition 
 * @param {*} wSide 
 * @param {*} hSide 
 * @param {*} yePosition 
 * @param {*} shiftX 
 * @param {*} leftSideCel 
 * @param {*} centerCol 
 * @param {*} lineMax 
 * @param {*} tileCell 
 */
function stockSurface(rowPosition, colPosition, wSide, hSide, yePosition, shiftX, leftSideCel, centerCol, lineMax, tileCell) {
    var tag = "[stockSurface]";
    var dbMsg = tag;
    dbMsg = dbMsg + "r" + rowPosition + "c" + colPosition;
    var cName = "C" + colPosition;
    // var cellName = rName + colName;
    var xePosition = wSide * colPosition + shiftX;
    if (threePointMode || testPointVal == 3) {
        judge = tplfJudge(rowPosition, colPosition, wSide, hSide, testPointVal);
    } else {
        judge = writeJudge(rowPosition, colPosition, wSide, hSide);
    }
    if ((judge && layoutVal == 0) || (!judge && layoutVal == 1)) {
        // dbMsg = dbMsg + "," + cellName + "=(" + xePosition + "," + yePosition + ")";
        var cellDate = new Array(rowPosition, colPosition, xePosition - wSide, yePosition - hSide, wSide, hSide);
        tileCell.push(cellDate); //末尾に追加
        if (0 < omitCount) {
            dbMsg = dbMsg + "C" + colPosition + "まで";
        }
        omitCount = 0;
    } else {
        blankCount++;
        if (leftSideCel == 0 && colPosition < centerCol) {
            leftSideCel = colPosition - 1;
            rightSideCel = lineMax - leftSideCel - 1;
        }
        omitCount++;
        switch (omitCount) {
            case 1:
                shiftX = wSide / 2;
                dbMsg = dbMsg + ",回避開始C" + colPosition + "～";
                xePosition = wSide * colPosition + shiftX;
                if (threePointMode || testPointVal == 3) {
                    judge = tplfJudge(rowPosition, colPosition, wSide, hSide, testPointVal);
                } else {
                    judge = writeJudge(rowPosition, colPosition, wSide, hSide);
                }
                if ((judge && layoutVal == 0) || (!judge && layoutVal == 1)) {
                    // dbMsg = dbMsg + "," + cellName + "=(" + xePosition + "," + yePosition + ")";
                    var cellDate = new Array(rowPosition, colPosition, xePosition - wSide, yePosition - hSide, wSide, hSide);
                    tileCell.push(cellDate); //末尾に追加
                    if (0 < omitCount) {
                        dbMsg = dbMsg + "C" + colPosition + "まで";
                    }
                    omitCount = 0;
                } else {
                    shiftX = 0;
                }
                break;
        }
        if (rightSideCel <= colPosition) {
            shiftX = 0;
        }
    }
    // myLog(dbMsg);
    return xePosition;
}

/**
 * 線置用の配列作成
 * @param {*} rowPosition 
 * @param {*} colPosition 
 * @param {*} wSide 
 * @param {*} hSide 
 * @param {*} yePosition 
 * @param {*} shiftX 
 * @param {*} leftSideCel 
 * @param {*} centerCol 
 * @param {*} lineMax 
 * @param {*} tileCell 
 */
function stockLine(rowPosition, colPosition, wSide, hSide, yePosition, shiftX, leftSideCel, centerCol, lineMax, tileCell) {
    var tag = "[stockLine]";
    var dbMsg = tag + "R" + rowPosition + "C" + colPosition + ",threePointMode=" + testPointVal + ",=" + testPointVal;
    var cName = "C" + colPosition;
    // var cellName = rName + colName;
    var xePosition = wSide * colPosition + shiftX;
    if (threePointMode || testPointVal == 3) {
        judge = tplfJudge(rowPosition, colPosition, wSide, hSide, testPointVal);
    } else {
        judge = writeJudge(rowPosition, colPosition, wSide, hSide);
    }
    dbMsg = dbMsg + ",judge=" + judge;
    var isDone = false;
    if (1 < colPosition) { //2列目から累積
        dbMsg = dbMsg + ",前=" + b_judge;
        if (judge != b_judge) { //反転発生          
            isDone = true;
            doneCount = 0;
            if (judge && (!b_judge)) { //着色域から無色に変わった(右側)
                colPosition--;
                xePosition -= wSide;
            }
        } else {
            if ((!judge) && (!b_judge)) { //着色域が続いたら
                var vJudge = false;
                if (threePointMode || testPointVal == 3) {
                    judge = tplfJudge(rowPosition, colPosition, wSide, hSide, testPointVal);
                } else {
                    vJudge = writeJudge(rowPosition - 1, colPosition, wSide, hSide);
                }
                if (vJudge) { //無色から着色域に変わった」
                    isDone = true;
                } else {
                    if (threePointMode || testPointVal == 3) {
                        judge = tplfJudge(rowPosition, colPosition, wSide, hSide, testPointVal);
                    } else {
                        vJudge = writeJudge(rowPosition + 1, colPosition, wSide, hSide);
                    }
                    if (vJudge) { //無色から着色域に変わった」
                        isDone = true;
                    }

                }
            }
            doneCount++; //カウント
            dbMsg = dbMsg + ",連続=" + doneCount + "/" + lineColmun;
            // if (doneCount < lineColmun) {
            //     isDone = true;
            // }
        }
        dbMsg = dbMsg + "書き込む=" + isDone;
        // myLog(dbMsg);
        if (isDone) {
            // dbMsg = dbMsg + "," + cellName + "=(" + xePosition + "," + yePosition + ")";
            var cellDate = new Array(rowPosition, colPosition, xePosition - wSide, yePosition - hSide, wSide, hSide);
            tileCell.push(cellDate); //末尾に追加
            if (0 < omitCount) {
                dbMsg = dbMsg + "C" + colPosition + "まで";
            }
            omitCount = 0;
        } else {
            blankCount++;
            if (leftSideCel == 0 && colPosition < centerCol) {
                leftSideCel = colPosition - 1;
                rightSideCel = lineMax - leftSideCel - 1;
            }
            omitCount++;
            switch (omitCount) {
                case 1:
                    shiftX = wSide / 2;
                    dbMsg = dbMsg + ",回避開始C" + colPosition + "～";
                    xePosition = wSide * colPosition + shiftX;
                    if (threePointMode || testPointVal == 3) {
                        judge = tplfJudge(rowPosition, colPosition, wSide, hSide, testPointVal);
                    } else {
                        judge = writeJudge(rowPosition, colPosition, wSide, hSide);
                    }
                    if ((judge && layoutVal == 0) || (!judge && layoutVal == 1)) {
                        // dbMsg = dbMsg + "," + cellName + "=(" + xePosition + "," + yePosition + ")";
                        var cellDate = new Array(rowPosition, colPosition, xePosition - wSide, yePosition - hSide, wSide, hSide);
                        tileCell.push(cellDate); //末尾に追加
                        if (0 < omitCount) {
                            dbMsg = dbMsg + "C" + colPosition + "まで";
                        }
                        omitCount = 0;
                    } else {
                        shiftX = 0;
                    }
                    break;
            }
            if (rightSideCel <= colPosition) {
                shiftX = 0;
            }
        }
    }
    b_judge = judge; //今回の判定を保持
    // myLog(dbMsg);
    return xePosition;
} //線置用の配列作成

/**
 * 当分割した升目を作成
 * @param {*} divideEqually    　分割数 
 * https://techacademy.jp/magazine/5600
 */
function makeMeasure(divideEqually) {
    var tag = "[makeMeasure]" + divideEqually + "枠";
    var dbMsg = tag + "layoutVal=" + layoutVal;
    var totalSpace = winW * winH; //
    dbMsg = dbMsg + ",総面積=" + totalSpace + "px";
    var individuallySpace = totalSpace / divideEqually; //個々の面積
    dbMsg = dbMsg + "/" + divideEqually + "=" + individuallySpace + ",threePointMode=" + threePointMode;
    var wSide = Math.sqrt(individuallySpace); //+ 0.5
    dbMsg = dbMsg + ">>一辺=" + wSide;
    colEnd = Math.round(winW / wSide);
    dbMsg = dbMsg + ",colEnd=" + colEnd + ",偶数判定=" + colEnd % 2 + ",偶数指定=" + isEven;
    var amari = winW - winW / wSide;
    if (isEven) {
        if (colEnd % 2 == 1) {
            colEnd = colEnd + 1;
        }
        dbMsg = dbMsg + ">colEnd>" + colEnd;
    } else {
        if (colEnd % 2 == 0) {
            colEnd = colEnd - 1;
        }
        dbMsg = dbMsg + ">colEnd>" + colEnd;
    }
    // var addEach = (winW - winW / wSide) / colEnd;
    wSide = winW / colEnd;
    dbMsg = dbMsg + ">>" + colEnd + "Col>>一辺=" + wSide;
    colCenter = colEnd / 2;

    var rowPosition = 0;
    rowEnd = Math.round(winH / wSide);
    var shiftX = 0;
    var lineMax = Math.round(winW / wSide);
    var centerCol = Math.round(lineMax / 2);
    var rightSideCel = lineMax;
    dbMsg = dbMsg + ",一行当たり" + lineMax + "列、中心" + centerCol + "列目";
    rowEnd = Math.round(winH / wSide);
    dbMsg = dbMsg + ",rowEnd=" + rowEnd + ",偶数判定=" + rowEnd % 2;
    rowEnd = rowEnd + rowEnd % 2
    var hSide = winH / rowEnd;
    dbMsg = dbMsg + "row>>一辺=" + hSide;
    tileCell = []; //タイル個々のデータ配列
    blankCount = 0;
    // myLog(dbMsg);
    do {
        rowPosition++;
        dbMsg = dbMsg + "\n(" + rowPosition + "行目";
        var rName = "R" + rowPosition;
        var yePosition = hSide * rowPosition;
        var colPosition = 0;
        shiftX = 0;
        omitCount = 0;
        var leftSideCel = 0;
        var xePosition;
        do {
            colPosition++;
            if (layoutVal == 0 || layoutVal == 1) {
                xePosition = stockSurface(rowPosition, colPosition, wSide, hSide, yePosition, shiftX, leftSideCel, centerCol, lineMax, tileCell);
            } else {
                xePosition = stockLine(rowPosition, colPosition, wSide, hSide, yePosition, shiftX, leftSideCel, centerCol, lineMax, tileCell);
            }

        } while (xePosition <= winW);
        lineMax = colPosition;
        dbMsg = dbMsg + "," + lineMax + "列,左端=" + leftSideCel + "列目,右端=" + rightSideCel + "列目";
    } while (yePosition <= winH && rowPosition < rowEnd);
    var wrCount = tileCell.length;
    dbMsg = tag + ",書込み" + wrCount + "升,blankParcent=" + blankParcent + "%";
    var colorMoni = document.getElementById('colorMoniter');
    colorMoni.textContent = "枠内;" + wrCount + "/総数;" + divideEqually + "=" + wrCount / divideEqually + "%";
    if (blankParcent == 0) {
        blankParcent = wrCount / divideEqually;
        dbMsg = dbMsg + ">>" + blankParcent + "%";
        // divideEqually = Math.round(divideEqually * 1 / blankParcent);
        // dbMsg = dbMsg + ">>" + divideEqually + "枠を作成";
        getlocalHostDirFils('thmbs/');
        myLog(dbMsg);
        //   setDEqually();
    } else {
        var nowHref = window.location.href;
        myLog(dbMsg);
        if (nowHref.match('tile.htm')) {
            assignmentMeasure();
        } else {
            assignment2Measure();
        }
    }
} //当分割した升目を作成

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
    var agreePx = 0; //隣接誤判定の回避値
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
    var agreePx = 0; // 16; //隣接誤判定の回避値
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
 * 各セルへの書き込み
 * @param {*} cellDate 
 */
function drowThumb(cellDate, srcName) {
    var tag = "[common.drowThumb]";
    var dbMsg = tag;
    var rowPosition = cellDate[0][0];
    var colPosition = cellDate[0][1];
    var cellName = "R" + rowPosition + "C" + colPosition;
    var wrX = cellDate[0][2];
    var wrY = cellDate[0][3];
    var wrW = cellDate[0][4];
    var wrH = cellDate[0][5];
    dbMsg = dbMsg + "," + cellName + "(" + wrX + "," + wrY + ")[" + wrW + "×" + wrH + "]";
    var img = new Image();
    img.src = srcName;
    var dbMsg = tag + ",src=" + img.src;
    // flCanvas.width = winW;
    // flCanvas.height = winH;
    img.crossOrigin = "Anonymous"; //XAMPP必要；file;//ではcrossdomeinエラー発生
    img.onload = function(event) {
        var dbMsg = tag + "[drowThumb.onload]";
        dbMsg = dbMsg + "," + cellName + "(" + wrX + "," + wrY + ")[" + wrW + "×" + wrH + "]";
        var dstWidth = this.width;
        var dstHeight = this.height;
        dbMsg = dbMsg + ",元サイズ[" + dstWidth + "×" + dstHeight + "]=" + (dstWidth / dstHeight);
        var flCanvasWidth = wrW;
        var flCanvasHeight = wrH;
        dbMsg = dbMsg + ",flCanvas[" + flCanvasWidth + "×" + flCanvasHeight + "]";
        var scaleWidth = flCanvasWidth / dstWidth;
        var scaleHeight = flCanvasHeight / dstHeight;
        dbMsg = dbMsg + ",scale[" + scaleWidth + "×" + scaleHeight + "%]";
        var biScale = scaleHeight;
        if (scaleHeight < scaleWidth) {
            biScale = scaleWidth;
        }
        dbMsg = dbMsg + ">>" + biScale + "%";
        var sw = dstWidth * biScale;
        var sh = dstHeight * biScale;
        dbMsg = dbMsg + ",dst[" + sw + "×" + sh + "]";
        var sx = (sw - wrW) / 2;
        var sy = (sh - wrH) / 2;
        dbMsg = dbMsg + ",shif(" + sx + " , " + sy + ")";
        flCtx.clearRect(wrX, wrY, wrW, wrH);
        flCtx.drawImage(this, 0, 0, dstWidth, dstHeight, wrX, wrY, wrW, wrH); //http://www.html5.jp/canvas/ref/method/drawImage.html
        // isCellDrow = document.getElementById("is_cell_drow").checked;
        dbMsg = dbMsg + ",isCellDrow=" + isCellDrow;
        if (isCellDrow == true) {
            if (rowPosition == 1) {
                flCtx.strokeRect(wrX, wrY, wrW, winH)
            }
            if (colPosition == 1) {
                flCtx.strokeRect(wrX, wrY, winW, wrH)
            }
            flCtx.strokeStyle = 'rgba(0,255,0,1)'; //文字と線の色 "'" + revsarceColor + "'";
            flCtx.strokeRect(wrX, wrY, wrW, wrH);
            flCtx.strokeText("R" + rowPosition, wrX + 3, wrY + 10);
            flCtx.strokeText("C" + colPosition, wrX + 3, wrY + 20);
        }
        // myLog(dbMsg);
    }
}
/**
 * DB;マウスポインタを置いた処のRGBA値をモニターDIVに書き出す
 * https://msdn.microsoft.com/ja-jp/library/jj203843(v=vs.85).aspx
 */
function colorPick(event) {
    var tag = "[colorPick]";
    var x = event.layerX;
    var y = event.layerY;
    var dbMsg = tag + "(" + x + "," + y + ")";
    var rgba = 'rgba(' + readColor(x, y) + ')';
    dbMsg = tag + ",rgba=" + rgba + ",revsarceColor=" + revsarceColor;
    var colorMoni = document.getElementById('colorMoniter');
    colorMoni.style.background = rgba;
    colorMoni.style.color = revsarceColor;
    colorMoni.textContent = rgba;
    // myLog(dbMsg);
} //情報領域へマウスポイントの色情報書込み

function showBlankInfo() {
    var tag = "[showBlankInfo]";
    alert(blankAreaInfo);
} //回避情報表示

/**
 * サムネイル非表示
 */
function veiwFleam() {
    var tag = "[veiwFleam]";
    var dbMsg = tag;
    var swichElement = document.getElementById("veiw_fleam");
    if (swichElement.checked) {
        document.getElementById("flCanvas").style.display = "block"; //display: none;block
    } else {
        document.getElementById("flCanvas").style.display = "none"; //display: none;block       
    }
    // myLog(dbMsg);
} //サムネイル非表示

/**
 * 枠型非表示
 */
function viewBase() {
    var tag = "[viewBase]";
    var dbMsg = tag;
    var swichElement = document.getElementById("view_base");
    if (swichElement.checked) {
        document.getElementById("tbCanvas").style.display = "block"; //display: none;block
    } else {
        document.getElementById("tbCanvas").style.display = "none"; //display: none;block       
    }
    // myLog(dbMsg);
}

/**
 * ４頂点中
 */
function testPoint() {
    var tag = "[testPoint]";
    var dbMsg = tag;
    var select = document.getElementById("test_point");
    testPointVal = parseInt(select.value);
    dbMsg = dbMsg + ",testPointVal=" + testPointVal;
    switch (testPointVal) {
        case 4:
            threePointMode = false;
            break;
        case 3:
            threePointMode = true;
            break;
        default:
            alert('現在作成中');
            break;
    }
    dbMsg = dbMsg + ",threePointMode=" + threePointMode;
    myLog(dbMsg);
    setDEqually();
}

function lineCol() {
    var tag = "[lineCol]";
    var dbMsg = tag;
    var select = document.getElementById("line_col");
    lineColmun = parseInt(select.value);
    dbMsg = dbMsg + ",lineColmun=" + lineColmun + "列(" + select.selectedIndex + ")";
    myLog(dbMsg);
    setDEqually();
}

/**
 * 配置範囲
 */
function revarceLayout() {
    var tag = "[revarceLayout]";
    var dbMsg = tag;
    var select = document.getElementById("revarce_layout_out");
    dbMsg = dbMsg + ",select=" + select.selectedIndex;
    layoutVal = select.selectedIndex;
    dbMsg = dbMsg + "layoutVal=" + layoutVal;
    if (layoutVal == 2) {
        $('#line_col_alia').css('display', 'inline-block');
    } else {
        $('#line_col_alia').css('display', 'none');
    }
    myLog(dbMsg);
    setDEqually();
}


/**
 * 列薄の偶数/奇数切替
 */
function evenOddSel() {
    var tag = "[evenOddSel]";
    var dbMsg = tag;
    var check1 = document.setform.even_odd_even.checked;
    var check2 = document.setform.even_odd_odd.checked;
    dbMsg = dbMsg + "check1=" + check1 + ",check2=" + check2;
    if (check1 == true) {
        isEven = true;
    } else if (check2 == true) {
        isEven = false;
    }
    dbMsg = dbMsg + "isEven=" + isEven;
    setDEqually();
    myLog(dbMsg);
}