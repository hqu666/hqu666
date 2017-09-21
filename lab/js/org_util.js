/**
 * 全スクリプト共通ライブラリ
 */
var targetDisplayWidth = 1920;
var targetDisplayHight = 1080;
var winScale = 1.0;

//スレッド管理///////////////////////////////////////////////////////////////////////////////////
function stopNIAnimation(delArrey) {
    var tag = "[stopNIAnimation]";
    var dbMsg = tag + ",timerArray=" + delArrey.length + "スレッド稼働中";
    if (delArrey != null) {
        while (0 < delArrey.length) {
            clearInterval(delArrey.shift());
        }
    }
    var dbMsg = dbMsg + ">稼働中>" + delArrey.length + "スレッド";
    // myLog(dbMsg);
}
////////////////////////////////////////////////////////////////////////////////スレッド管理/////
function strCount(str, seq) {
    var tag = "[strCount]";
    var dbMsg = tag + ",str=" + str + "から" + seq;
    myLog(dbMsg);
    return str.split(seq).length - 1;
}
//オブジェクト操作/////////////////////////////////////////////////////////スレッド管理//
function delObjByIndex(obj, delIndex) {
    var tag = "[delObjByIndex]";
    var dbMsg = tag + obj.length + "件からdelIndex=" + delIndex + "を削除";
    var retObj = new Array();
    for (var i = 0; i < obj.length; ++i) {
        if (i != delIndex) {
            retObj[retObj.length] = obj[i];
        }
    }
    dbMsg = dbMsg + ">>結果=" + retObj.length + "件";
    myLog(dbMsg);
    return retObj;
}
//エレメント操作///////////////////////////////////////////////////////////オブジェクト操作///
/**
 * 渡された要素の初期化
 * @param {*} usedElement 
 */
function removeElement(usedElement) {
    var tag = "[removeElement]";
    var dbMsg = tag;
    dbMsg = dbMsg + "対象" + usedElement + "," + usedElement.length + "件";
    while (0 < usedElement.length) { // 
        var i = usedElement.length - 1;
        var elmName = usedElement[i];
        dbMsg = dbMsg + "(" + i + ")" + elmName;
        // if (!elmName.match('top_fix_center')) {
        var delElement = document.getElementById(elmName);
        delElement.innerHTML = '';
        if (elmName.match('add_')) {
            while (delElement.firstChild) {
                delElement.removeChild(delElement.firstChild); //Failed to execute 'removeChild' on 'Node': parameter 1 is not of type 'Node'.
            }
            $('#' + delElement).css({ "height": "" }).css({ "width": "" });
        }
        // }
        $('#' + elmName).css({ "height": "" }).css({ "width": "" });
        usedElement.pop(); //先頭から消す時はshift
    }
    usedElement = [];
    myLog(dbMsg);
}

/**
 * 渡されたエレメントのフェードアウトを連続設定する
 * @param {*} usedElement 
 * @return  fiTime   フェードインタイム
 */
function fiAlllement(usedElement, isFI) {
    var tag = "[fiAlllement]";
    var dbMsg = tag;
    for (i = 0; i < usedElement.length; i++) {
        var elmName = '#' + usedElement[i];
        dbMsg = dbMsg + "(" + i + ")" + elmName;
        $(elmName).css({ "opacity": "0" });
        if (isFI == true) {
            $(elmName).fadeTo(fiTime, 1);
        }
    }
    // myLog(dbMsg);
    return fiTime;
} //渡されたエレメントのフェードアウトを連続設定する

/**
 * JQueryのfadeOutでは最後に    display: none;されるので透過だけを設定する
 */
function feedOutOrg() {
    var tag = "[feedOutOrg]";
    var dbMsg = tag;
    dbMsg = dbMsg + "対象=" + feedOutElement;

    if ($('#' + feedOutElement)) {
        dbMsg = dbMsg + "feedOutCount=" + feedOutCount;
        if (feedOutCount < 0.1) {
            $('#' + feedOutElement).css({ "opacity": 0 });
            stopNIAnimation(feedOutArray);
        } else {
            feedOutCount = feedOutCount - 0.05;
            dbMsg = dbMsg + ">>" + feedOutCount;
            $('#' + feedOutElement).css({ "opacity": feedOutCount });
            feedOutArray.push(setTimeout("feedOutOrg()", 100));
        }
    }
    // myLog(dbMsg);
}
//環境情報取得/////////////////////////////////////////////////////////////エレメント操作////
function getWindowScale(targrtElement) {
    var tag = "[getWindowScale]";
    var dbMsg = tag + targrtElement;
    var retScale = winScale;
    // if (winScale != 1.0) {
    dbMsg = dbMsg + ",baceWidth[" + baceWidth + "×" + baceHeight + "]";
    if (baceWidth) {
        winW = baceWidth; //モニター画面の幅
    } else {
        winW = window.parent.screen.width;
    }
    if (baceHeight) {
        winH = baceHeight;
    } else {
        winH = window.parent.screen.height; //$(window).height(); //window.innerHeight;
    }
    dbMsg = dbMsg + ",window[" + winW + "×" + winH + "]" + targrtElement;
    var retValse = getElementCoordinates(targrtElement);
    var eWidth = retValse.width * 1;
    var eHeight = retValse.height * 1;
    dbMsg = dbMsg + ",element[" + eWidth + "×" + eHeight + "]px";
    var wScale = eWidth / winW;
    var hScale = eHeight / winH;
    dbMsg = dbMsg + "[" + wScale + ":" + hScale + "]%";
    retScale = wScale;
    if (hScale < wScale) {
        retScale = wScale;
    }
    // if (0 < eWidth && 0 < eHeight) {
    //     if (winW < winH) {
    //         retScale = eWidth / winH;
    //         dbMsg = dbMsg + ",縦横入替";
    //     }
    // }
    dbMsg = dbMsg + ",retScale=" + retScale + "%";
    myLog(dbMsg);
    return retScale;
}

//エレメントプロパティ取得///////////////////////////////////////////////////環境情報取得///
/**
 * エレメントに設定されてるsouceを読み取る
 * @param {*} targrtElement 
 */
function getSouceOfElement(targrtElement) {
    var tag = "[getSouceOfElement]";
    var dbMsg = tag;
    var dbMsg = tag;
    var retVal = "";
    dbMsg = dbMsg + '(' + nextSC + ')' + targrtElement; //
    // if (targrtElement.match('fix')) {
    //     console.log(cutArray[nextSC]['scene']);
    //      retVal = cutArray[nextSC]['scene'][targrtElement].souce;
    // } else {
    //     retVal = cutArray[nextSC][targrtElement][souce];
    // }
    var element = document.getElementById(targrtElement);

    if (element.innerHTML) {
        retVal = element.innerHTML;
    } else if (element.innerText) {
        retVal = element.innerText;
    }
    dbMsg = dbMsg + ",souce=" + retVal;
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(element);
    }
    return retVal;
} //エレメントに設定されてるsouceを読み取る

function getStyleOfElement(targrtElement, columun) { //fontSize
    var tag = "[getStyleOfElement]";
    var dbMsg = tag + targrtElement + 'の' + columun;
    var chElement = document.getElementById(targrtElement);
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(chElement);
    }
    var style;
    if (chElement) {
        style = chElement.currentStyle;
        if (style) {
            style = document.defaultView.getComputedStyle(chElement, '');
        }
    }
    dbMsg = dbMsg + ",style=" + style;
    var retVal;
    if (style) {
        retVal = style[columun];
    }
    dbMsg = dbMsg + "=" + retVal;
    myLog(dbMsg);
    return retVal;
} //エレメントに設定されてるsouceを読み取る
/**
 * 指定されたエレメントのx,y,w,hをObjectで返す
 * @param {*} targrtElement 
 */
function getElementCoordinates(targrtElement) {
    var tag = "[getElementCoordinates]";
    var winPXoffset = window.pageXOffset;
    var winPYoffset = window.pageYOffset;
    var dbMsg = tag + ",pageYOff(" + winPXoffset + "," + winPYoffset + ")";
    dbMsg = dbMsg + targrtElement + "は";
    var targetRect = document.getElementById(targrtElement).getBoundingClientRect();
    var targetX = targetRect.left + winPXoffset; // 要素のX座標
    var targetY = targetRect.top + winPYoffset; // 要素のY座標
    dbMsg = dbMsg + "(" + targetX + "," + targetY + ")";
    var targetWidth = targetRect.width; // + window.pageYOffset;
    var targetHeight = targetRect.height; // + window.pageYOffset;
    dbMsg = dbMsg + "[" + targetWidth + "×" + targetHeight + "]";

    var retValse = { x: targetX, y: targetY, width: targetWidth, height: targetHeight };
    // myLog(dbMsg);
    // if (debug_now == true) {
    //     // console.log(event);
    // }
    return retValse;
} //指定されたエレメントのx,y,w,hをObjectで返す

/** 
 * 下にエレメントが無ければ底辺まで高さ拡張
 * @param {*} targrtElement canvasなどの親エレメント
 */
function setElementHight(targrtElement) {
    var tag = "[setElementHight]";
    var winPXoffset = window.pageXOffset;
    var winPYoffset = window.pageYOffset;
    var dbMsg = tag + "pageOffset(" + winPXoffset + "," + winPYoffset + ")";
    var baceRect = document.getElementById('canvas_bace').getBoundingClientRect(); //エレメントの絶対座標値を取得する
    var baceX = baceRect.left + winPXoffset; // 要素のX座標
    var baceY = baceRect.top + winPYoffset; // 要素のY座標   .clientTopdでは0
    var bWidth = baceRect.width;
    var bHeight = baceRect.height;
    dbMsg = dbMsg + "、表示領域(" + baceX + "," + baceY + ")[" + bWidth + "×" + bHeight + "]";
    if (bHeight < 5) {
        bHeight = bWidth / targetDisplayWidth * targetDisplayHight;
        dbMsg = dbMsg + ">>" + bHeight;
    }
    dbMsg = dbMsg + ";" + targrtElement + "は";
    var targetRect = document.getElementById(targrtElement).getBoundingClientRect();
    var targetX = targetRect.left + winPXoffset; // 要素のX座標
    var targetY = targetRect.top + winPYoffset; // 要素のY座標
    dbMsg = dbMsg + "(" + targetX + "," + targetY + ")";
    var targetHeight = targetRect.height; // + window.pageYOffset;
    dbMsg = dbMsg + ",高さ=" + targetHeight;
    dbMsg = dbMsg + "、表示座標上＝" + (targetY - baceY);

    var nextRect = document.getElementById('center_aria').getBoundingClientRect();
    var nextX = nextRect.left + winPXoffset; // 要素のX座標
    var nextY = nextRect.top + winPYoffset; // 要素のY座標
    var nextHeight = nextRect.height; // + window.pageYOffset;
    var underHight = 0;
    if (targrtElement.match('center_')) {
        if (document.getElementById('bottom_aria')) {
            nextRect = document.getElementById('bottom_aria').getBoundingClientRect();
            nextX = nextRect.left + winPXoffset; // 要素のX座標
            nextY = nextRect.top + winPYoffset; // 要素のY座標
            underHight = nextRect.height;
        }
    } else if (targrtElement.match('top_')) {
        if (document.getElementById('center_aria')) {
            nextRect = document.getElementById('center_aria').getBoundingClientRect();
            underHight = underHight + nextRect.height;
        }
    }
    dbMsg = dbMsg + "、以下の高さ" + underHight;

    var setHight = bHeight - (targetY - baceY) - underHight; // - bHeight / 100;
    dbMsg = dbMsg + ",設定する高さ=" + setHight;
    document.getElementById(targrtElement).style.height = setHight + "px";
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(event);
    }
    return setHight;
} //下にエレメントが無ければ底辺まで高さ拡張

/**
 * 底辺基準でY位置を返す
 * @param {*} targrtElement 
 * @param {*} referenceElement 
 * @param {*} winH 
 */
function setYPositionFBpttom(targrtElement, referenceElement, winH) {
    var tag = "[setYPositionFBpttom]";
    winH = window.parent.screen.height; //$(window).height(); //window.innerHeight;
    var retY = winH;
    var winPXoffset = window.pageXOffset;
    var winPYoffset = window.pageYOffset;
    var dbMsg = tag + "pageOffset(" + winPXoffset + "," + winPYoffset + ")";
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(event);
    }
    return retY;
}
//ドラッグ操作　http://qiita.com/kaikusakari/items/ca45910a35712daca68c　//////エレメントプロパティ取得//
var move_flg = "";
var move_start_x = 0;
var move_start_y = 0;
var dragElement;
var isNowDorag = false;

/**
 * ドラッグするエレメントを指定する
 * @param {*} elementName 
 */
function setDragElement(elementName) {
    var tag = "[setDragElement]";
    var dbMsg = tag;
    dbMsg = dbMsg + "対象=" + elementName + ",isNowDorag=" + isNowDorag;
    if (!isNowDorag) {
        dragElement = document.getElementById(elementName);
        isNowDorag = true;
    } else {
        dragElement = null;
        isNowDorag = false;
    }
    myLog(dbMsg);
}

function fileSysCheck() {
    var tag = "[fileSysCheck]";
    var dbMsg = tag;
    var retStr = '非対応無し';
    // myAlert('データを書き出す機能は只今制作中です。\nこの機能は皆さんが編集したデータをご自身のPCに保存し、再利用できる様、開発中です。');
    if (window.File) {
        dbMsg = dbMsg + ',window.File対応';
    } else {
        retStr = 'window.File 非対応'
    }
    if (window.FileReader) {
        dbMsg = dbMsg + ',window.FileReader対応';
    } else {
        retStr = retStr + 'window.FileReader 非対応'
    }
    if (window.FileList && window.Blob) {
        dbMsg = dbMsg + ',window.FileList対応';
    } else {
        retStr = retStr + 'window.FileList 非対応'
    }
    if (window.Blob) {
        dbMsg = dbMsg + ',window.Blob対応';
    } else {
        retStr = retStr + 'window.Blob 非対応'
    }
    dbMsg = dbMsg + '::' + retStr;
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elementArray);
    }
    return retStr;
} //bt;書込

// start drag
window.onmousedown = function(e) {
        var tag = "[window.onmousedown]";
        var dbMsg = tag;
        if (dragElement) {
            move_flg = "true";
            dbMsg = dbMsg + "move_flg=" + move_flg;
            dbMsg = dbMsg + ",event.client(" + event.clientX + "," + event.clientY + ")";
            var rect = dragElement.getBoundingClientRect();
            dbMsg = dbMsg + ",modal_box(" + rect.left + "," + rect.top + ")";

            move_start_x = event.clientX - rect.left; //parseInt(element.style.left.replace("px", ""));      
            move_start_y = event.clientY - rect.top; //parseInt(element.style.top.replace("px", ""));
            dbMsg = dbMsg + ",move_start(" + move_start_x + "," + move_start_y + ")";
            // myLog(dbMsg);
            // if (debug_now) {
            //     console.log(e);
            // }
        }
    }
    // end drag
window.onmouseup = function(e) {
        var tag = "[window.onmouseup]";
        var dbMsg = tag;
        if (move_flg) {
            move_flg = "false";
            dbMsg = dbMsg + "move_flg=" + move_flg;
            // myLog(dbMsg);
            // if (debug_now) {
            //     console.log(e);
            // }
        }
    }
    // dræg 
window.onmousemove = function(e) {
    var tag = "[window.onmousemove ]";
    var dbMsg = tag;
    dbMsg = dbMsg + "move_flg=" + move_flg;
    if (dragElement) {
        if (move_flg == "true") {
            dbMsg = dbMsg + ",event.client(" + event.clientX + "," + event.clientY + ")";
            dbMsg = dbMsg + ",move_start(" + move_start_x + "," + move_start_y + ")";
            dragElement.style.left = (event.clientX - move_start_x) + "px";
            dragElement.style.top = (event.clientY - move_start_y) + "px";
        }
        // myLog(dbMsg);
        // if (debug_now) {
        //     // console.log(e);
        // }
    }
}

function myAlert(msg) {
    alert(msg);
}

//その他///////////////////////////////////////////////////////////ドラッグ操作//
function createXmlHttp() {
    if (window.ActiveXObject) {
        //Windows IE用
        try {
            return new ActiveXObject("CDO.Message");
        } catch (e) {
            try {
                return new ActiveXObject("Microsoft.CDO.Message");
            } catch (e) {
                return null;
            }
        }
    }
    //   else if(window.XMLHttpRequest){
    //     //Windows IE以外のXMLHttpRequestオブジェクト実装ブラウザ用
    //     return new XMLHttpRequest();
    //   }
    //   else {
    //     return null;
    //   }
}

function XMLHttpRequestCreate() {
    try {
        return new XMLHttpRequest();
    } catch (e) {}
    try {
        return new ActiveXObject('MSXML2.XMLHTTP.6.0');
    } catch (e) {}
    try {
        return new ActiveXObject('MSXML2.XMLHTTP.3.0');
    } catch (e) {}
    try {
        return new ActiveXObject('MSXML2.XMLHTTP');
    } catch (e) {}

    return null;
}
/**
 * メール送信
 * @param {*} event 
 */
function mailSender(event) {
    var tag = "[mailSender]";
    var dbMsg = tag;
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var mTitol = document.getElementById(elementId + '_titol').value + '';
    dbMsg = dbMsg + ",タイトル=" + mTitol;
    if (mTitol === '') {
        alert('御社名をご記入ください。');
    }
    var mSouce = document.getElementById(elementId + '_souce').value + '';
    dbMsg = dbMsg + ",文面=" + mSouce;
    if (mSouce === '') {
        alert('業務内容などをご記入ください。');
    }
    location.href = "mailto:?to=" + encodeURIComponent('shyaroo@gmail.com') +
        "&subject=" + encodeURIComponent(mTitol) + "&body=" + encodeURIComponent(mSouce);
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(cdoMsg);
        console.log(xhr);
    }
    cdoMsg = null; // 後処理

} //メール送信

/***
 * urlから?以降のescapeを削除する
 * pending
 */
function removeEscape() {
    var tag = "[removeEscape]";
    var dbMsg = tag;
    var hrefStr = location.href; //window.location.hre//
    dbMsg = dbMsg + ",href=" + hrefStr;
    var data = location.search.substring(1, location.search.length); //エスケープされた文字をアンエスケープする
    var escapeStr = unescape(data); // ?以降の文字を表示する
    dbMsg = dbMsg + ",escapeStr=" + escapeStr;
    if (escapeStr) {
        dbMsg = dbMsg + ",escapeStr=" + escapeStr;
        hrefStr = hrefStr.replace('?' + escapeStr, '')
        dbMsg = dbMsg + ",書換" + hrefStr;
        // window.location.href = hrefStr;
        // history.replaceState('', '', '');
    }
    myLog(dbMsg);
}

//デバッグツール///////////////////////////////////////////////////////////その他//
//   var debug_now = true;
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