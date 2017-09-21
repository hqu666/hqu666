var scrollT = "add_scrollT";
var scrollY = 0;
var isScrollEnd = false;
var scrollArray = new Array();
var limitFontSize = 96; //最大フォントサイズ
var scrollT;
var scrollSpead = 20; //スクロールアイテムがある

/**
 * 改行コードをbrタグに置き換える
 * @param {*} souceText 
 */
function cr2br(souceText) {
    var tag = "[cr2br]";
    var dbMsg = tag + "souceText=" + souceText;
    var retStr = souceText.replace(/\n/g, '<br>');
    dbMsg = dbMsg + ">>" + retStr;
    // myLog(dbMsg);
    return retStr;
} //改行コードをbrタグに置き換える

function br2cr(souceText) {
    var tag = "[br2cr]";
    var dbMsg = tag + "souceText=" + souceText;
    var retStr = souceText.replace(/<br>/g, '\n');
    myLog(dbMsg);
    return retStr;
} //brタグを改行コードに置き換える

// all の中に part が出現する回数を取得  http://qiita.com/yasumodev/items/94ab3c74520201fdd70f
function strCount(tStr, tPart) {
    return (tStr.match(new RegExp(tPart, "g")) || []).length;
}


/**
 * ページ内で最も大きなfontSizeを返す
 */
function getMaxFontSize() {
    var tag = "[getMaxFontSize]";
    var dbMsg = tag; //+ "souceText=" + souceText;
    var maxFontSize = 0;
    var checkFontSize = 0;
    for (var i = 0; i < (elementIdArray.length - 2); i++) {
        dbMsg = dbMsg + "(" + i + ")";
        var baceElementID = elementIdArray[i];
        dbMsg = dbMsg + baceElementID;
        if (document.getElementById(baceElementID + '_scroll')) {
            baceElementID = baceElementID + '_scroll';
        }
        if (document.getElementById(baceElementID).style) {
            checkFontSize = document.getElementById(baceElementID).style.fontSize;
            checkFontSize = checkFontSize.replace('px', '') * 1;
        }
        dbMsg = dbMsg + ";" + checkFontSize + "px";
        if (maxFontSize < checkFontSize) {
            maxFontSize = checkFontSize;
            dbMsg = dbMsg + ">max>" + maxFontSize + "px";
        }
    }
    dbMsg = dbMsg + ">結果>" + maxFontSize + "px";
    myLog(dbMsg);
    return maxFontSize;
} //ページ内で最も大きなfontSizeを返す


/**
 * 改行無しのエレメントに実際に文字を書き込み、はみ出した分、フォントサイズを縮小し、そのサイズを返す
 * @param {*} tElement 
 * @param {*} scriptStr 
 * @param {*} fontFamily 
 * @param {*} orgWidth 
 * @param {*} tfSize 
 * 
 */
function nowrapFit(tElement, scriptStr, fontFamily, wLeft, orgWidth, tfSize) {
    var tag = "[nowrapFit]";
    var dbMsg = tag + "tElement=" + tElement + "に「" + scriptStr + "」fontFamily＝" + fontFamily + ",左=" + wLeft + ",幅=" + orgWidth + ",指定サイズ=" + tfSize;
    orgWidth = orgWidth * 0.96;
    dbMsg = dbMsg + ">>" + orgWidth + ",指定=" + tfSize;
    var targetElement = document.getElementById(tElement);
    targetElement.innerHTML = '';
    $('#' + tElement).css('white-space', 'nowrap');
    var retFontSize = tfSize;
    if (limitFontSize < tfSize) {
        targetElement.innerHTML = scriptStr;
    } else {
        $('#' + tElement).css('width', '');
        $('#' + tElement).css({ "font-size": retFontSize + "px" });
        var orgFontSize = retFontSize; //$('#' + tElement).get(0).fontSize;
        dbMsg = dbMsg + ",元幅=" + orgWidth + ",font-size=" + orgFontSize;
        // var testWidth = $('#' + tElement).text(scriptStr).get(0).offsetWidth;
        targetElement.innerHTML = scriptStr;
        var testWidth = $('#' + tElement).get(0).clientWidth;
        dbMsg = dbMsg + ",書込み後=" + testWidth;
        if (orgWidth < testWidth) {
            var fontScal = orgWidth / testWidth;
            retFontSize = orgFontSize * fontScal;
            dbMsg = dbMsg + ">>" + retFontSize + 'に変更';
        }
    }
    $('#' + tElement).css({ "font-size": retFontSize + "px" });
    // if (0 < orgWidth && orgWidth < 0.5) {
    //     orgWidth = winW * orgWidth;
    // $('#' + tElement).css('width', orgWidth + 'px'); //widthを不要に広げるとセンタリングがずれる
    // $('#' + tElement).css('margin-left', wLeft + 'px'); //widthを不要に広げるとセンタリングがずれる
    // }
    dbMsg = dbMsg + ",結果= " + retFontSize;
    myLog(dbMsg);
    return retFontSize;
} //改行無しのエレメントに実際に文字を書き込み、はみ出した分、フォントサイズを縮小し、そのサイズを返す

/**
 * 渡された文章の中で最も長い行を抽出し、その一行を返す
 * @param {*} scriptStr 
 */
function getMAxLenLine(scriptStr) {
    var tag = "[getMAxLenLine]";
    var dbMsg = tag + "scriptStr=" + scriptStr;
    var testStrs = scriptStr.split("<br>");
    var retLineStr;
    dbMsg = dbMsg + "," + testStrs.length + "行=" + testStrs.toLocaleString();
    var mLen = 0;
    for (var i = 0; i < testStrs.length; i++) {
        var tStr = testStrs[i];
        var tRLen = tStr.length;
        dbMsg = dbMsg + "," + tStr + "=" + tRLen + "文字";
        if (mLen < tRLen) {
            mLen = tRLen;
            retLineStr = tStr;
        }
    }
    tFLen = mLen;
    dbMsg = dbMsg + ">>" + tFLen + "文字;" + retLineStr;
    // var maxLineObj = { row: tbCtx, src: this };
    // myLog(dbMsg);
    return retLineStr;
}

function wrightScriptBody(tElement, scriptStr, fontFamily, wLeft, wWidth, tfSize) {
    var tag = "[wrightScriptBody]";
    var dbMsg = tag + "tElement=" + tElement + "に「" + scriptStr + "」fontFamily＝" + fontFamily + ",左=" + wLeft + ",幅=" + wWidth + ",指定サイズ=" + tfSize;
    var target = document.getElementById(tElement);

    if (scriptStr.match('<br>')) {
        var maxLineStr = getMAxLenLine(scriptStr);
        dbMsg = dbMsg + ",最長= " + maxLineStr;
        tfSize = nowrapFit(tElement, maxLineStr, fontFamily, wWidth, tfSize);
        target.innerHTML = scriptStr; // tfSize = target.style.fontSize; //Math.round(target.style.fontSize);
    } else {
        tfSize = nowrapFit(tElement, scriptStr, fontFamily, wLeft, wWidth, tfSize);
    }
    dbMsg = dbMsg + ">結果>" + tfSize;
    myLog(dbMsg);
    return tfSize;
}

/**
 * エレメントに合わせて文字入力
 * @param {*} tElement 
 * @param {*} scriptStr 
 * @param {*} fontFamily 
 * @param {*} wWidth 
 */
function wrightScript(tElement, scriptStr, fontFamily, wLeft, wWidth, tfSize) {
    var tag = "[wrightScript]";
    var dbMsg = tag + "tElement=" + tElement + "に「" + scriptStr + "」fontFamily＝" + fontFamily + ",左=" + wLeft + ",幅=" + wWidth + ",指定サイズ=" + tfSize;
    var target = document.getElementById(tElement);
    if (0 < wWidth < 1) {
        $('#' + tElement).css({ "width": wWidth * 95 + "vw" });
    }
    if (fontFamily == 'true' || fontFamily == true) {
        $('#' + tElement).css({ "font-family": "'Great Vibes', cursive" });
    } else {
        $('#' + tElement).css({ "font-family": "" });
    }
    $('#' + tElement).css({ "display": "inline-block" });
    var tFLen = scriptStr.length;
    dbMsg = dbMsg + "," + tFLen + "文字";
    if (tfSize == 0 || tfSize == undefined || tfSize == 'undefined') {
        tfSize = limitFontSize;
        dbMsg = dbMsg + ">無指定>" + tfSize;
        tfSize = wrightScriptBody(tElement, scriptStr, fontFamily, wLeft, wWidth, tfSize);
    } else {
        if (9 < tfSize) {
            dbMsg = dbMsg + ">直接指定>" + tfSize;
            if (tElement.match('top_')) { //最初のエレメントの場合のみ
                tfSize = Math.round(tfSize * winW / 1920); //画面サイズに合わせて縮小
            }
            $('#' + tElement).css({ "font-size": tfSize + "px" });
            target.innerHTML = scriptStr;
        } else {
            tfSize = wrightScriptBody(tElement, scriptStr, fontFamily, wLeft, wWidth, tfSize);
        }
    }
    dbMsg = dbMsg + ",結果= " + tfSize;
    myLog(dbMsg);
    return tfSize;
}

/**
 * テキストスクロールの内部
 */
function vScroll() {
    var tag = "[vScroll]";
    var dbMsg = tag + 'scrollT=' + scrollT + '、Spead=' + scrollSpead;
    var sctFilde = document.getElementById(scrollT);
    if (sctFilde) {
        dbMsg = dbMsg + ',scrollTop=' + sctFilde.scrollTop + '(' + scrollY + ')';
        sctFilde.scrollTop = ++scrollY;
        var scrollEnd = sctFilde.scrollHeight - sctFilde.clientHeight;
        dbMsg = dbMsg + ">>" + scrollY + "/" + scrollEnd;
        if (scrollY < scrollEnd) {
            scrollArray.push(setTimeout("vScroll()", scrollSpead));
        } else {
            dbMsg = dbMsg + "スクロール終了";
            dbMsg = dbMsg + ",stayTime=" + stayTime;
            dbMsg = dbMsg + ",nextFunction=" + nextFunction;
            myLog(dbMsg);
            if (nextFunction != null) {
                scrollArray.push(setTimeout(function() {
                    removeElement(usedElement);
                }, stayTime - 10));

                scrollArray.push(setTimeout(nextFunction, stayTime));
            }
        }
    }
    // myLog(dbMsg);
} //テキストスクロールの内部

//ボッス要素を自動スクロール  http://alphasis.info/2013/09/javascript-gyakubiki-autoscrollelement/
/**
 * <p>タグでscrollテキストエリアを作成
 * @param {*} elentName 
 * @param {*} pearentID 
 * @param {*} scriptStr 
 * @param {*} vewiRow 
 * @param {*} sSpead 
 * @param {*} wLeft 
 * @param {*} wWidth 
 * @param {*} fontFamily 
 * @param {*} tfSize 
 */
function varticalscroll(elentName, pearentID, scriptStr, vewiRow, sSpead, wLeft, wWidth, fontFamily, tfSize) {
    var tag = "[varticalscroll]";
    var dbMsg = tag + "pearentID=" + pearentID + "に" + elentName + "を作成.左=" + wLeft + ".指定[" + wWidth + "px ×" + vewiRow + "行]" + tfSize + 'px' + ",scriptStr=" + scriptStr;
    dbMsg = dbMsg + "scrollSpead=" + sSpead;
    this.scrollSpead = sSpead;
    if (scrollArray) {
        stopNIAnimation(scrollArray);
    }
    isScrollEnd = false;
    // dbMsg = dbMsg + ",location=" + location;
    // myLog(dbMsg);
    // if (debug_now == true) {
    //     console.log(targetCutArray);
    // }
    // if (targetCutArray) {
    //     var rObj;
    //     // if (location.match('edit.htm')) {
    //     rObj = targetCutArray[pearentID];
    //     // } else if (location.match('index.htm')) {
    //     //     rObj = targetCutArray[nextSC][pearentID];
    //     // }
    //     // myLog(dbMsg);
    //     // if (debug_now == true) {
    //     //     console.log(targetCutArray);
    //     // }
    //     var col = rObj.width;
    //     dbMsg = dbMsg + ">>設定値;width=" + col;
    //     var retValse = getElementCoordinates(pearentID);
    //     wWidth = retValse.width * 1;
    //     wHeight = retValse.height * 1;
    //     dbMsg = dbMsg + "[" + wWidth + "×" + wHeight + "px]";
    //     vewiRow = rObj.vRows;
    //     tfSize = rObj.fontSize * 1;
    //     if (tfSize == 0) {
    //         tfSize = 24;
    //     }

    //     fontFamily = rObj.fontFamily;
    //     dbMsg = dbMsg + "[" + wWidth + "px ×" + vewiRow + "行]" + tfSize + 'px,fontFamily=' + fontFamily;
    //     // scriptStr = rObj.souce + '';
    //     // dbMsg = dbMsg + ",scriptStr=" + scriptStr;
    // }
    scriptStr = scriptStr.replace(/"/g, '');
    scriptStr = scriptStr.replace(/'/g, '');
    scriptStr = cr2br(scriptStr); //改行をbrに
    dbMsg = dbMsg + ",scriptStr= " + scriptStr;
    var maxLineStr = getMAxLenLine(scriptStr);
    var wLen = maxLineStr.length;
    dbMsg = dbMsg + ",最長= " + maxLineStr + "=" + wLen + "文字";
    var tHeight;
    if (0 < vewiRow) {
        tHeight = vewiRow * 1.5 + "em"; //行間1.5文字設定
    } else {
        tHeight = setElementHight(pearentID) + 'px';
    }
    dbMsg = dbMsg + ",tHeight= " + tHeight;

    $('#' + pearentID).css({ "display": "inline-block" });
    var pearentObj = document.getElementById(pearentID); //idで親要素を取得
    pearentObj.innerHTML = "";
    var sctFilde = document.createElement("p");
    sctFilde.id = elentName;
    var retValse = getElementCoordinates(pearentID);
    wWidth = retValse.width;
    dbMsg = dbMsg + ",幅= " + wWidth;
    sctFilde.style.width = '100%'; //wWidth + "px";
    sctFilde.style.height = tHeight;
    pearentObj.appendChild(sctFilde); //「boxes」の要素の最後尾に複製した要素を追加
    if (fontFamily == 'true' || fontFamily == true) {
        $('#' + elentName).css({ "font-family": "'Great Vibes', cursive" });
    } else {
        $('#' + elentName).css({ "font-family": "" });
    }
    //  tfSize = nowrapFit(elentName, maxLineStr, fontFamily, wLeft, wWidth, tfSize); //フォントサイズで指定して
    // if (tfSize == undefined || tfSize == 'undefined') {
    //     tfSize = 32;
    //     dbMsg = dbMsg + ">無指定>" + tfSize;
    // } else if (tfSize < 10) {
    //     var pMaxFontSize = getMaxFontSize();
    //     dbMsg = dbMsg + ",このページの最大=" + pMaxFontSize + "pt";
    //     if (0 < pMaxFontSize) {
    //         tfSize = pMaxFontSize * tfSize;
    //     } else {
    //         tfSize = 32;
    //     }
    // }
    // dbMsg = dbMsg + ">調整>" + tfSize + "px";
    // var winScale = getWindowScale('canvas_bace');
    // dbMsg = dbMsg + ",winScale=" + winScale;
    // tfSize = tfSize * winScale;
    // dbMsg = dbMsg + ",fontSize=" + tfSize;
    sctFilde.style.fontSize = tfSize + "px";

    // $('#' + elentName).css({ "width": wLen + "em" });
    // $('#' + elentName).css({ "width": wLen + "em" });
    var addObj = document.getElementById(elentName); //idで親要素を取得
    addObj.innerHTML = scriptStr;
    dbMsg = dbMsg + "[" + wWidth + "×" + tHeight + "em]";
    // $('#' + elentName).css({ "width": wLen + "em" }); //文字数で拡張
    $('#' + elentName).css({ "overflow": "hidden" });
    dbMsg = dbMsg + ",fontSize=" + tfSize;
    scrollY = 0; //初期化
    myLog(dbMsg);
}