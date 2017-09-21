var fiTime = 2000; //フェードイン　ｍS
var signageName = 'オリジナルシナリオ';

var cutTimeArray = new Array();
var elementIdArray = ['footer_left', 'footer_right', 'bottom_left', 'bottom_right', 'fix_left', 'fix_right', 'top_left', 'top_right', 'center_left', 'center_right']; //'fix_aria', 'top_center','center_center', 'bottom_center', 
var elmSortIds = ['fix_left', 'fix_right', 'top_left', 'top_right', 'center_left', 'center_right', 'bottom_left', 'bottom_right', 'footer_left', 'footer_right'];
var elementArray; //各エレメント単位の情報
var sceneEndCuts = []; //各シーンの最終カット
var sceneArray; //全シーン名配列
var cutArray; //全シーンカット配列
var cutArrayName = 'cutArray'; //全シーンカット配列
var elementKeyName = 'elementKey';
var elementArrayName = 'elementArray';
var templateFileName = 'conte.txt';
var nextSC; //cutArrayの再生中カットのレコードインデックス
var sceneCut; //シーンカット名
var lastSceneCut; //最終シーンカット名
var targetCutArray; //対象カットだけの抜き出し
var usedElement = new Array();
var isMoniter = false; //エディターからモニター表示
var thisCutDuration = 5000;
var vIdArray = ['fix', 'top', 'center', 'bottom', 'footer'];
var typeArray = ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
var wallSrc; //背景
var wallOpacity = 1;
var wallalign;
var baceWidth;
var baceHeight;
var audioUrl = '';
var now_audioUrl = '';
var now_wall = '';
var now_wall_align = '';
var now_layout = '';
var scene_layout = '';
var now_fixText = '';
var isHDivide; //左右分割
var tCount = 0;
var controlAriaTop = 92;
var endSceneCut; //最終シーンカット
var autoSend = false;
var isThisWindow = false;

//データ操作//////////////////////////////////////////////////////////////////////////
function initlocalStorage() {
    var tag = "[initlocalStorage]";
    var dbMsg = tag;
    console.log(localStorage.getItem('elementArray'));
    console.log(localStorage.getItem('cutArray'));

    localStorage.removeItem('elementArray');
    localStorage.removeItem('cutArray');

    myLog(dbMsg);
    if (debug_now == true) {
        var elementArray2 = JSON.parse(localStorage.getItem('elementArray'));
        console.log(elementArray2);
    }
} //現状のcutArrayをlocalStorageに書き込む

/**
 * 現状のcutArrayをlocalStorageに書き込む
 */
function elementArray2localStorage(eArray) {
    var tag = "[elementArray2localStorage]";
    var dbMsg = tag + eArray.length + "要素";
    var elementArrayObj = new Object();
    elementArrayObj = $.extend(true, [], eArray); //20170629 {}から変更
    wrStr = JSON.stringify(elementArrayObj);
    // dbMsg = dbMsg + ";" + wrStr;
    localStorage.removeItem(elementArrayName);
    localStorage.setItem(elementArrayName, wrStr);
    var elementArray2 = JSON.parse(localStorage.getItem(elementArrayName));
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elementArray2);
    }
    return elementArray2;
} //現状のcutArrayをlocalStorageに書き込む

/**
 * elementArrayをscene_cutと上部に配置されたエレメント順で降順ソートする
 * @param {*} a 
 * @param {*} b 
 */
function elementArraySort(a, b) {
    var tag = "[elementArraySort]";
    var dbMsg = tag;
    tCount++;
    var aName = a['scene_cut'];
    var bName = b['scene_cut'];
    dbMsg = dbMsg + "(" + tCount + ")" + aName + "と" + bName;
    var retInt = 0;
    if (aName < bName) {
        retInt = -1;
    } else if (aName > bName) {
        retInt = 1;
    }
    if (retInt == 0) {
        var aElm = a['element'];
        var bElm = b['element'];
        dbMsg = dbMsg + "," + aElm + "と" + bElm;
        var c = elmSortIds.indexOf(aElm);
        var d = elmSortIds.indexOf(bElm);
        var eIndex = c - d;
        dbMsg = dbMsg + ",eIndex=" + eIndex;
        if (eIndex < 0) {
            retInt = -1;
        } else if (0 < eIndex) {
            retInt = 1;
        }
    }
    dbMsg = dbMsg + "；retInt=" + retInt;
    // myLog(dbMsg);
    if (debug_now == true) {
        // console.log(tArray);
    }
    return retInt;
} //elementArrayをscene_cutと上部に配置されたエレメント順で降順ソートする

/**
 * 数値をシーンを示す文字にする
 * @param {*} sceneNo 
 */
function sceneNum2Str(sceneNo) {
    var tag = "[sceneNum2Str]";
    var dbMsg = tag + 'sceneNo=' + sceneNo;
    var sceneStr = 's0' + sceneNo + '0';
    if (9 < sceneNo) {
        sceneStr = 's' + sceneNo + '0';
    }
    dbMsg = tag + 'sceneStr=' + sceneStr;
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(rowObj);
        // console.log(elementArray);
    }
    return sceneStr;
} //指定されシーンカットにエレメントレコードを新規作成する

/**
 * 数値をシーンを示す文字にする
 * @param {*} sceneNo 
 */
function cutNum2Str(cutNo) {
    var tag = "[cutNum2Str]";
    var dbMsg = tag + 'cutNo=' + cutNo;
    var cutStr = 'c0' + cutNo;
    if (9 < cutNo) {
        cutStr = 'c' + cutNo;
    }
    dbMsg = tag + 'cutStr=' + cutStr;
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(rowObj);
        // console.log(elementArray);
    }
    return cutStr;
} //指定されシーンカットにエレメントレコードを新規作成する

/**
 * 指定されシーンカットにエレメントレコードを新規作成する
 * @param {*} scName 
 * @param {*} elementStr 
 * @param {*} setType 
 */
function makeNewElementRecord(scName, elementStr, setType, setSouce) {
    var tag = "[makeNewElementRecord]";
    var dbMsg = tag + 'scName=' + scName + 'の' + setType;
    if (elementArray) {} else {
        elementArray = JSON.parse(localStorage.getItem('elementArray'));
    }
    var eaEnd = elementArray.length; //134から151レコードに増加；追加レコードは142；正解は135の１レコード
    dbMsg = dbMsg + ',eaEnd=' + eaEnd;
    var souceStr = "";
    var leftStr = "";
    var topStr = "";
    var widthStr = "";
    var hightStr = "";
    var fontColorStr = '';
    var bgColorStr = "";
    var alignStr = "";
    var scaleStr = "";
    var opacityStr = "";
    var fleamWidthStr = "";
    var fleamColorStr = "";
    var fontFamilyStr = "";
    var fontSizeStr = "";
    var vRowsStr = "";
    var scrollSpeadStr = "";
    var mStartStr = "";
    var mPositionStr = "";

    if (setType === "wall") {
        souceStr = "#ffffff";
        alignStr = "0";
        scaleStr = "100";
        opacityStr = "1";
        mStartStr = "0";
        mPositionStr = "0";
    } else if (setType === "layout") {
        souceStr = "free";
    } else if (setType === "audio") {
        souceStr = "bgm/010.mp3";
        mStartStr = "0";
        mPositionStr = "0";
    } else if (setType === "text") {
        souceStr = "追加したtextです。内容を編集して下さい";
        topStr = "0";
        hightStr = "12";
        fontColorStr = '#000000';
        bgColorStr = "-1";
        alignStr = "0";
        scaleStr = "100";
        opacityStr = "1";
        fontFamilyStr = 'meiryo';
        fontSizeStr = "24";
        vRowsStr = "1";
        mStartStr = "0";
        mPositionStr = "0";
    } else if (setType === "scroll") {
        souceStr = 'スクロール\nさせる\n文字を\n設定して\n下さい\n\n&lt;br&gt;などの\nタグは\n自動的に\n書き込みますので、\nEnterキーで\n改行を\n設定して\n下さい。';
        topStr = "0";
        hightStr = "12";
        fontColorStr = '#000000';
        bgColorStr = "-1";
        alignStr = "0";
        scaleStr = "100";
        opacityStr = "1";
        fontFamilyStr = 'meiryo';
        fontSizeStr = "24";
        vRowsStr = "20";
        scrollSpeadStr = "20";
        mStartStr = "0";
        mPositionStr = "0";
    } else if (setType === "pict") {
        souceStr = "img/please-select.png";
        topStr = "0";
        hightStr = "12";
        fontColorStr = '#000000';
        bgColorStr = "-1";
        alignStr = "0";
        scaleStr = "100";
        opacityStr = "1";
        fleamWidthStr = "1";
        fleamColorStr = '#ffffff';
    } else if (setType === "signage") {
        scName = "s000c00";
        elementStr = "signage";
        setType = "signage";
        setSouce = textFileName;
        leftStr = "0";
        topStr = "0";
        if (localStorage.getItem('fws_baceWidth')) {
            baceWidth = localStorage.getItem('fws_baceWidth') + '';
        }
        widthStr = baceWidth + '';
        if (localStorage.getItem('fws_baceHeight')) {
            baceHeight = localStorage.getItem('fws_baceHeight') + '';
        }
        hightStr = baceHeight + "";
        if (localStorage.getItem('fws_autoSend')) {
            autoSend = localStorage.getItem('fws_autoSend') + ''; //   var elementArray2 = JSON.parse(localStorage.getItem(elementArrayName));
        }
        dbMsg = dbMsg + ",autoSend=" + autoSend;
        fontColorStr = autoSend;
    }
    dbMsg = dbMsg + ',souceStr=' + souceStr + '>setSouce>' + setSouce;
    if (setSouce !== '') {
        souceStr = setSouce;
        dbMsg = dbMsg + '>souceStr>' + souceStr;
    }

    if (elementStr.match('_right')) {
        leftStr = "50";
        widthStr = "50";
    } else if (elementStr.match('_left')) {
        leftStr = "0";
        widthStr = "100";
    }

    elementArray[eaEnd] = new Array(); // elementArray[recName] = new Array();
    var obj = new Object();
    obj['scene_cut'] = scName;
    obj['type'] = setType;
    obj['element'] = elementStr;
    obj['souce'] = souceStr;
    obj['left'] = leftStr;
    obj['top'] = topStr;
    obj['width'] = widthStr;
    obj['hight'] = hightStr;
    obj['fontColor'] = fontColorStr;
    obj['bgColor'] = bgColorStr;
    obj['align'] = alignStr;
    obj['scale'] = scaleStr;
    obj['opacity'] = opacityStr;
    obj['fleamWidth'] = fleamWidthStr;
    obj['fleamColor'] = fleamColorStr;
    obj['fontFamily'] = fontFamilyStr;
    obj['fontSize'] = fontSizeStr;
    obj['vRows'] = vRowsStr;
    obj['scrollSpead'] = scrollSpeadStr;
    obj['mStart'] = mStartStr;
    obj['mPosition'] = mPositionStr;
    obj['effect'] = "fi";
    obj['time'] = "5000";
    obj['備考'] = "";
    elementArray[eaEnd] = obj; //elementArray[recName] = obj;   なら名称設定できるがJSONstrにできない
    elementArray.sort(
        function(a, b) {
            var retInt = elementArraySort(a, b);
            return retInt;
        }
    );

    elementArray2localStorage(elementArray);

    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(rowObj);
        console.log(elementArray);
    }
    return elementArray;
} //指定されシーンカットにエレメントレコードを新規作成する


/**
 * 指定されたelementArrayのレコードを編集（無ければ追加）する
 * @param {*} scName 
 * @param {*} targrtElement 
 * @param {*} columun 
 * @param {*} setVal 
 * @param {*} targrtType 
 */
function reWrightElemenValue(scName, targrtElement, columun, setVal, targrtType) {
    var tag = "[reWrightElemenValue]";
    var dbMsg = tag + 'scName=' + scName + 'の' + targrtElement + '(' + targrtType + ')の' + columun + 'を' + setVal + 'に';
    var elementStr = targrtElement.split('_');
    var vPosition = elementStr[0];
    var hPosition = elementStr[1];
    dbMsg = dbMsg + '、縦=' + vPosition + '、横=' + hPosition;
    if (elementArray) {} else {
        elementArray = JSON.parse(localStorage.getItem('elementArray'));
    }
    dbMsg = dbMsg + '、' + elementArray.length + '件中';
    var reWriteIndex = -1;
    var sceneStartIndex = -1;
    var sceneEndIndex = -1;

    for (var i = 0; i < elementArray.length; ++i) {
        var nowSC = elementArray[i].scene_cut;
        var nowElement = elementArray[i].element;
        if (nowSC === scName && nowElement === targrtElement) {
            dbMsg = dbMsg + '変更(' + i + '件目)' + nowSC + 'の' + nowElement + 'の' + columun;
            elementArray[i][columun] = setVal + '';
            reWriteIndex = i;
        }
    }
    if (reWriteIndex === -1) { //書き換える対象が無ければ
        dbMsg = dbMsg + ',該当エレメント無し';
        var rowObj = new Object();
        dbMsg = dbMsg + ',elementKeyName=' + elementKeyName;
        var colNames = JSON.parse(localStorage.getItem(elementKeyName)); //最初の要素で列名を読み取る
        dbMsg = dbMsg + ',colNames=' + colNames.length + "件";
        var colNameCount = colNames.length;
        dbMsg = dbMsg + 'colNames' + colNameCount + '項目追加';
        var wrVal = '';
        // myLog(dbMsg);
        for (var j = 0; j < colNameCount; ++j) { //取得した列鵜数分
            var colName = colNames[j] + '';
            dbMsg = dbMsg + ',' + j + ")" + colName;
            var readVal = '';
            if (colName === "scene_cut") { //最終columnがundefinedになていた
                rowObj['scene_cut'] = scName;
            } else if (colName === 'element') {
                rowObj['element'] = targrtElement + '';
            } else if (colName === 'type') {
                rowObj['type'] = targrtType + '';
            } else if (colName === 'souce') {
                // if (targrtType === 'scroll') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                //     setVal = cr2br(setVal);
                // }
                rowObj['souce'] = setVal + '';
            } else if (colName === 'align') {
                var wrVal = '';
                if (targrtType === 'wall' || targrtType === 'pict') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                    wrVal = 0;
                }
                rowObj['align'] = wrVal + '';
            } else if (colName === 'bgColor') {
                var wrVal = '';
                // if (targrtType === 'wall' || targrtType === 'pict') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                //     wrVal = 0;
                // }
                rowObj['bgColor'] = wrVal + '';
            } else if (colName === 'effect') {
                var wrVal = '';
                // if (targrtType === 'wall' || targrtType === 'pict') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                //     wrVal = 0;
                // }
                rowObj['effect'] = wrVal + '';
            } else if (colName === 'fleamColor') {
                var wrVal = '';
                // if (targrtType === 'wall' || targrtType === 'pict') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                //     wrVal = 0;
                // }
                rowObj['fleamColor'] = wrVal + '';
            } else if (colName === 'fleamWidth') {
                var wrVal = '';
                // if (targrtType === 'wall' || targrtType === 'pict') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                //     wrVal = 0;
                // }
                rowObj['fleamWidth'] = wrVal + '';
            } else if (colName === 'fontColor') {
                var wrVal = '#000000';
                // if (targrtType === 'wall' || targrtType === 'pict') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                //     wrVal = 0;
                // }
                rowObj['fontColor'] = wrVal + '';
            } else if (colName === 'fontSize') {
                var wrVal = '0'; //最長行を一行に収める
                // if (targrtType === 'wall' || targrtType === 'pict') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                //     wrVal = 0;
                // }
                rowObj['fontSize'] = wrVal + '';
            } else if (colName === 'fontFamily') {
                var wrVal = '';
                if (targrtType === 'text' || targrtType === 'scroll') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                    wrVal = false;
                }
                rowObj['fontFamily'] = wrVal + '';
            } else if (colName === 'hight') {
                // if (targrtType === 'wall' || targrtType === 'pict') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                //     wrVal = 0;
                // }
                rowObj['hight'] = wrVal + '';
            } else if (colName === 'width') {
                wrVal = 12;
                var leftVal = getElementPropaty(scName, vPosition + '_left', 'width');
                dbMsg = dbMsg + "[leftVal=" + leftVal;
                var rightVal = getElementPropaty(scName, vPosition + '_right', 'width');
                dbMsg = dbMsg + ",rightVal=" + rightVal + ']';
                if (leftVal == 'undefined' || leftVal == undefined) {
                    leftVal = 0;
                } else {
                    leftVal = leftVal * 1;
                }
                dbMsg = dbMsg + ">>[" + leftVal;
                if (rightVal == 'undefined' || rightVal == undefined) {
                    rightVal = 0;
                } else {
                    rightVal = rightVal * 1;
                }
                dbMsg = dbMsg + "," + rightVal + ']';

                if (hPosition === 'left') {
                    wrVal = 12 - rightVal;
                    if (12 === rightVal) { //既に右がある
                        wrVal = 6;
                        elementArray = reWrightElemenValue(scName, vPosition + '_right', 'width', 6, targrtType);
                    }
                } else if (hPosition === 'right') {
                    if (leftVal == 12) { //既に左がある
                        wrVal = 6;
                        elementArray = reWrightElemenValue(scName, vPosition + '_left', 'width', 6, targrtType);
                    } else if (0 < rightVal) {
                        wrVal = 12 - leftVal;
                    } else {
                        wrVal = rightVal;
                    }
                }
                rowObj['width'] = wrVal + '';
            } else if (colName === 'left') {
                var wrVal = '';
                if (targrtType === 'wall' || targrtType === 'pict') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                    wrVal = 0;
                }
                rowObj['left'] = wrVal + '';
            } else if (colName === 'top') {
                var wrVal = '';
                if (targrtType === 'scroll') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                    wrVal = '20';
                }
                rowObj['top'] = wrVal + '';
            } else if (colName === 'mPosition') {
                var wrVal = '';
                // if (targrtType === 'wall' || targrtType === 'pict') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                //     wrVal = 0;
                // }
                rowObj['mPosition'] = wrVal + '';
            } else if (colName === 'mStart') {
                var wrVal = '0.0';
                // if (targrtType === 'wall' || targrtType === 'pict') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                //     wrVal = 0;
                // }
                rowObj['mStart'] = wrVal + '';
            } else if (colName === 'opacity') {
                var wrVal = '1.0';
                if (targrtType === 'wall') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                    wrVal = '0.5';
                }
                rowObj['opacity'] = wrVal + '';
            } else if (colName === 'scale') {
                var wrVal = '100';
                // if (targrtType === 'wall') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                //     wrVal = '0.5';
                // }
                rowObj['scale'] = wrVal + '';
            } else if (colName === 'scrollSpead') {
                var wrVal = '';
                if (targrtType === 'scroll') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                    wrVal = '20';
                }
                rowObj['scrollSpead'] = wrVal + '';
            } else if (colName === 'time') {
                var wrVal = ''; //
                // if (targrtType === 'scroll') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                //     wrVal = '20';
                // }
                rowObj['time'] = wrVal + '';
            } else if (colName === 'vRows') {
                var wrVal = '';
                if (targrtType === 'scroll') { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
                    wrVal = '10';
                }
                rowObj['vRows'] = wrVal + '';
            } else {
                readVal = getElementPropaty(scName, targrtElement, columun);
                rowObj[colName] = readVal;
            }
            // rowObj[colNames[j]] = colValue;
        } //取得した列鵜数分
        // var recName = rowObj.scene_cut + "_" + rowObj.element;
        elementArray.push(rowObj); //elementArray[recName] = obj;   なら名称設定できるがJSONstrにできない
        elementArray.sort(
            function(a, b) {
                var retInt = elementArraySort(a, b);
                return retInt;
            }
        );
    }
    dbMsg = dbMsg + '、結果=' + elementArray.length + '件中';
    elementArray2localStorage(elementArray);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(rowObj);
        // console.log(elementArray);
    }
    return elementArray;
} //指定されたelementArrayのレコードを編集（無ければ追加）する

/**
 * 指定したシーンのエレメントレコードを削除する
 * @param {*} scName 
 * @param {*} targrtElement 
 */
function delFromElementArray(scName, targrtElement) {
    var tag = "[delFromElementArray]";
    var dbMsg = tag + 'scName=' + scName + 'の' + targrtElement;
    if (elementArray) {} else {
        elementArray = JSON.parse(localStorage.getItem('elementArray'));
    }
    dbMsg = dbMsg + '、' + elementArray.length + '件中';
    var reWriteIndex = -1;
    for (var i = 0; i < elementArray.length; ++i) {
        var nowSC = elementArray[i].scene_cut;
        if (nowSC.match(scName)) {
            var nowElement = elementArray[i].element;
            if (nowElement === targrtElement) {
                dbMsg = dbMsg + '(' + i + '件目)' + nowSC + 'の' + nowElement;
                elementArray.splice(i, 1);
                reWriteIndex = i;
            }
        }
    }
    if (reWriteIndex === -1) {
        dbMsg = dbMsg + '、該当なし';
    } else {
        dbMsg = dbMsg + '、結果=' + elementArray.length + '件';
        elementArray2localStorage(elementArray);
    }
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(elementArray);
    }
    return elementArray;
} //指定したシーンのエレメントレコードを削除する

/**
 * elementArrayでエレメントとソースを照合してシーンカットの更新
 * @param {*} sceneCut 
 * @param {*} elmId 
 * @param {*} reWrSC 
 */

function elementArrayReWrite(sceneCut, elmId, tSouce, reWrSC) {
    var tag = "[common.elementArrayReWrite]";
    var dbMsg = tag + ",nowPosition=" + sceneCut + "," + elmId + "の" + tSouce + "を" + reWrSC + "へ(" + elementArray.length + "件中)";
    var retIndex = -1;
    for (var i = 0; i < elementArray.length; i++) {
        var rSC = elementArray[i].scene_cut;
        if (rSC === sceneCut) {
            var rElemrnt = elementArray[i]['element'];
            // dbMsg = dbMsg + ",rElemrnt＝" + rElemrnt;
            if (rElemrnt === elmId) {
                var rSouce = elementArray[i]['souce'];
                dbMsg = dbMsg + ",rSouce=" + rSouce;
                if (rSouce === tSouce) {
                    dbMsg = dbMsg + ",(" + i + ")" + rSC;
                    elementArray[i].scene_cut = reWrSC;
                    dbMsg = dbMsg + ">>" + elementArray[i].scene_cut;
                    retIndex = i;
                }
            }
        }
    }
    dbMsg = dbMsg + ",書き換えたIndex=" + retIndex;
    // myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elementArray);
    }
    return retIndex;
} //elementArrayでエレメントとソースを照合してシーンカットの更新

/**
 * elementArrayの中でシーンカットの書き換え
 * @param {*} targetSC 
 * @param {*} repSC 
 */
function sceneCutReWrite(targetSC, repSC) {
    var tag = "[common.sceneCutReWrite]";
    var dbMsg = tag + elementArray.length + "件から" + targetSC + 'を' + repSC + 'に書き換え';
    var motoObj = new Object();
    for (var i = 0; i < elementArray.length; i++) {
        var rSC = elementArray[i].scene_cut;
        if (rSC === targetSC) {
            dbMsg = dbMsg + '(' + i + ')'
                // var rElement = elementArray[i].element
                // if (rSC.match('c01') && (rElement === 'audio' || rElement === 'wall' || rElement === 'layout' || rElement.match('fix_'))) { } else {
            elementArray[i].scene_cut = repSC;
            //     // motoObj[Object.keys(motoObj).length] = $.extend(true, [], elementArray[i]); //移動先配列コピー
            // }
        }
    }
    elementArray2localStorage(elementArray);
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(elementArray);
    }
    return elementArray;
} //elementArrayの中でシーンカットの書き換え

/**
 * elementArrayの中でシーンカットの入れ替え
 * @param {*} targetSC 
 * @param {*} repSC 
 */
function sceneCutReplece(targetSC, repSC) {
    var tag = "[common.sceneCutReplece]";
    var dbMsg = tag + elementArray.length + "件から" + targetSC + 'を' + repSC + 'に置換え';
    var repArray = new Object();
    for (var i = 0; i < elementArray.length; i++) {
        var rSC = elementArray[i].scene_cut;
        if (rSC === repSC) {
            // console.log(elementArray[i]);
            elementArray[i].scene_cut = targetSC;
            repArray[Object.keys(repArray).length] = $.extend(true, {}, elementArray[i]); //移動先配列コピー
            elementArray.splice(i, 1);
            i--;
        }
    }
    dbMsg = dbMsg + ",置き換え先;repArray=" + Object.keys(repArray).length + "件,elementArray=" + elementArray.length + "件に";
    // myLog(dbMsg);
    // console.log(repArray);
    elementArray = sceneCutReWrite(targetSC, repSC);
    // var motoObj = new Object();
    // for (var i = 0; i < elementArray.length; i++) {
    //     var rSC = elementArray[i].scene_cut;
    //     if (rSC === targetSC) {
    //         elementArray[i].scene_cut = repSC;
    //         motoObj[Object.keys(motoObj).length] = $.extend(true, [], elementArray[i]); //移動先配列コピー
    //     }
    // }
    // dbMsg = dbMsg + ",motoObj=" + Object.keys(motoObj).length + "件";
    // // myLog(dbMsg);
    // // console.log(motoObj);
    for (var i = 0; i < Object.keys(repArray).length; i++) {
        elementArray[elementArray.length] = $.extend(true, {}, repArray[i]);
    }
    dbMsg = dbMsg + ",最終；elementArray=" + elementArray.length + "件に";
    elementArray.sort(
        function(a, b) {
            var retInt = elementArraySort(a, b);
            return retInt;
        }
    );
    elementArray2localStorage(elementArray);
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(elementArray);
    }
    return elementArray;

} //elementArrayの中でシーンカットの入れ替え

/**
 * 指定したシーンの最終カットを返す
 * @param {*} targetScene 
 */
function getSceneEndCut(targetScene) {
    var tag = "[common.getSceneEndCut]";
    var dbMsg = tag + elementArray.length + "件から" + targetScene + 'を検索';
    var cutNo = -1;
    for (var i = elementArray.length - 1; 0 < i; i--) {
        var rSC = elementArray[i].scene_cut;
        var scStrs = rSC.split('c');
        var sceneNo = scStrs[0];
        dbMsg = dbMsg + ",sceneNo=" + sceneNo;
        if (targetScene === sceneNo) {
            if (cutNo < 0) {
                cutNo = scStrs[1] * 1;
                dbMsg = dbMsg + ",cutNo=" + cutNo + "," + i + "件目";
                // myLog(dbMsg);
                return cutNo;
            }
        }
    }
    // myLog(dbMsg);
    return cutNo;
} //指定したシーンの最終カットを返す

/**
 * elementArrayのシーン・カットを先頭からs010c01でふり直す
 */
function scRenameElementArray() {
    var tag = "[common.scRenameElementArray]";
    var dbMsg = tag + elementArray.length + "件";
    var b_rSC = elementArray[2].scene_cut;
    var b_rSCtStrs = b_rSC.split('c');
    var b_rSceneStr = b_rSCtStrs[0];
    var b_rCutNo = b_rSCtStrs[1] * 1;
    dbMsg = dbMsg + "先頭は" + b_rSceneStr + "c" + b_rCutNo;
    var sceneNo = 1;
    var org_sceneNo = 1;
    var sceneStr = sceneNum2Str(org_sceneNo);
    var b_sceneNo = 1;
    var b_sceneStr = sceneNum2Str(b_sceneNo);
    var b_cutNo = 1;
    dbMsg = dbMsg + ",書換は" + b_sceneStr + "c" + b_cutNo;

    for (var i = 0; i < elementArray.length; i++) {
        var rSC = elementArray[i].scene_cut;
        if (rSC !== 's000c00') {} else {
            dbMsg = dbMsg + "\n(" + i + ")" + rSC;
            var scStrs = rSC.split('c');
            var sceneStr = scStrs[0];
            var cutNo = scStrs[1] * 1;
            // var scStr = rSC.split('0c');
            dbMsg = dbMsg + ",sceneStr=" + sceneStr + ",cutNo=" + cutNo;
            org_sceneNo = scStrs[0].substring(1, 3) * 1;
            if (b_sceneNo < org_sceneNo) { //s2以降が先頭なら
                sceneStr = sceneNum2Str(b_sceneNo); //書き込みはs1に戻す
                dbMsg = dbMsg + ">>" + sceneStr;
            }
            if (b_rSceneStr !== sceneStr) { //シーンが変わった
                b_rSceneStr = sceneStr;
                b_sceneNo++;
                b_cutNo = 1;
            }
            if (b_cutNo < cutNo) { //カットが変わった
                cutNo = b_cutNo;
            }
            if (b_rSC !== rSC) { //シーンが変わった
                b_cutNo++;
            }

            // b_sceneNo = sceneStr;
            // if (i == 0 && org_sceneNo != 1) {
            //     sceneNo = 1;
            //     dbMsg = dbMsg + ">>" + sceneNo;
            // } else {
            //     sceneNo++;
            // }

            var rewrSCName = sceneStr + cutNum2Str(cutNo) //sceneNum2Str(sceneNo);
                // var cutNo = scStr[1] * 1;
                // rewrSCName = rewrSCName + cutNum2Str(cutNo)
            dbMsg = dbMsg + ">rewrSCName>" + rewrSCName;
            elementArray[i].scene_cut = rewrSCName;
        }
    }
    // elementArray.sort(
    //     function(a, b) {
    //         var retInt = elementArraySort(a, b);
    //         return retInt;
    //     }
    // );
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(elementArray);
    }
    return elementArray;
} //elementArrayのシーン・カットを先頭からs010c01でふり直す

function getElementPropaty(sceneCutName, tElement, tPropaty) {
    var tag = "[common.getElementPropaty]";
    // if (debug_now == true) {
    //     console.log(elementArray);
    // }
    if (elementArray) {} else {
        elementArray = JSON.parse(localStorage.getItem('elementArray'));
    }
    var dbMsg = tag + elementArray.length + "件から" + sceneCutName + "の" + tElement + "から" + tPropaty + "を検索";
    var rStr = '';
    for (var i = 0; i < elementArray.length; ++i) {
        var rName = elementArray[i]['scene_cut'];
        if (rName === sceneCutName && rStr === '') {
            var rElement = elementArray[i]['element'];
            if (rElement === tElement) {
                dbMsg = dbMsg + "(" + i + ")" + rName + "の" + rElement;
                myLog(dbMsg);
                if (debug_now == true) {
                    console.log(elementArray[i]);
                }
                if (elementArray[i][tPropaty]) {
                    rStr = elementArray[i][tPropaty] + '';
                }
            }
        }
    }
    dbMsg = dbMsg + ",rStr= " + rStr;
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(cutArray);
    }
    return rStr;
} //シーンカットとエレメントで検索してtypeを返す

/**
 * シーンカットとエレメントで検索してtypeを返す
 * @param {*} sceneCutName 
 * @param {*} tElement 
 */
function getElementType(sceneCutName, tElement) {
    var tag = "[common.getElementType]";
    if (debug_now == true) {
        console.log(elementArray);
    }
    if (elementArray) {} else {
        elementArray = JSON.parse(localStorage.getItem('elementArray'));
    }
    var dbMsg = tag + elementArray.length + "件から" + sceneCutName + "の" + tElement + "を検索";
    var rType = '';
    for (var i = 0; i < elementArray.length; ++i) {
        var rName = elementArray[i]['scene_cut'];
        if (rName === sceneCutName && rType === '') {
            dbMsg = dbMsg + "(" + i + ")" + rName;
            var rElement = elementArray[i]['element'];
            if (rElement === tElement) {
                dbMsg = dbMsg + "の" + rElement;
                rType = elementArray[i]['type'];
            }
        }
    }
    dbMsg = dbMsg + ",rType= " + rType; // myLog(dbMsg);
    if (debug_now == true) {
        // console.log(cutArray);
    }
    return rType;
} //シーンカットとエレメントで検索してtypeを返す

/**
 * 指定したシーンカットが最初に出現するelementArrayのインデックスを返す
 * @param {*} sceneCutName 
 */
function getElementArrayFarstIndex(sceneCutName) {
    var tag = "[common.getElementArrayFarstIndex]";
    var dbMsg = tag + elementArray.length + "件から" + sceneCutName + "を検索";
    var retIndex = -1;
    for (var i = 0; i < elementArray.length; ++i) {
        var rName = elementArray[i]['scene_cut'];
        if (rName === sceneCutName && retIndex === -1) {
            dbMsg = dbMsg + "(" + i + ")" + rName;
            retIndex = i;
        }
    }
    dbMsg = dbMsg + ",retIndex= " + retIndex; // myLog(dbMsg);
    if (debug_now == true) {
        // console.log(cutArray);
    }
    return retIndex;
} //指定したシーンカットが最初に出現するelementArrayのインデックスを返す

/**
 * シーンカット名でcutArrayを検索してインデックスを取得
 * @param {*} sceneCutName 
 */
function getCutArrayIndex(sceneCutName) {
    var tag = "[common.getCutArrayIndex]";
    var dbMsg = tag + cutArray.length + "件から" + sceneCutName + "を検索";
    var retIndex = -1;
    for (var i = 0; i < cutArray.length; ++i) {
        var rName = cutArray[i]['scene_cut'];
        if (rName === sceneCutName) {
            dbMsg = dbMsg + "(" + i + ")" + rName;
            retIndex = i;
        }
    }
    dbMsg = dbMsg + ",retIndex= " + retIndex;
    // myLog(dbMsg);
    if (debug_now == true) {
        // console.log(cutArray);
    }
    return retIndex;
} //CutArrayから該当するscene_cut名のインデックスを返す

/**
 * 現状のcutArrayをlocalStorageに書き込む
 */
function cutArray2localStorage(rCutArray) {
    var tag = "[cutArray2localStorage]";
    var dbMsg = tag; // + cutArray.keys('scene_cut').length + "要素";
    var ecutArrayObj = new Object();
    ecutArrayObj = $.extend(true, {}, rCutArray);
    wrStr = JSON.stringify(ecutArrayObj);
    dbMsg = dbMsg + ";" + wrStr.length + "文字";
    localStorage.removeItem(cutArrayName);
    localStorage.setItem(cutArrayName, wrStr);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(rCutArray);
        // // console.log(ecutArrayObj);
        // var cutArray2 = JSON.parse(localStorage.getItem(cutArrayName));
        // console.log(cutArray2);
    }
} //現状のcutArrayをlocalStorageに書き込む

/**
 * cutArray.sceneオブジェクトを読み出す。
 * @param {*} scIndex 
 */
function getSceneObj(scIndex) {
    var tag = "[getSceneObj]";
    var dbMsg = tag + cutArray.length + "カット中の" + scIndex;
    var sObj = new Object();
    sObj = $.extend(true, [], cutArray[scIndex].scene); //cutArrayからsceneオブジェクトを読み出す
    dbMsg = dbMsg + '=' + sObj.length + '件';
    // myLog(dbMsg);
    // if (debug_now == true) {
    //     console.log(sObj);
    // }
    for (var k = 0; k < typeArray.length; ++k) { // ['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move']; 
        dbMsg = dbMsg + '(' + k + ')';
        var typeId = typeArray[k];
        dbMsg = dbMsg + typeId;
        var rObj;
        rObj = sObj[typeId];
        // console.log(rObj);
        if (rObj) {
            var sChaildObj = new Object();
            sChaildObj = $.extend(true, [], rObj);
            dbMsg = dbMsg + sChaildObj.length + '件';
            // myLog(dbMsg);
            if (debug_now == true) {
                console.log(sChaildObj);
            }
            for (var h = 0; h < colNames.length; ++h) { //一行分
                dbMsg = dbMsg + '(' + h + ')';
                colName = colNames[h];
                dbMsg = dbMsg + colName;
                colVar = rObj[colName] + '';
                dbMsg = dbMsg + '=' + colVar;
                if (h == (colNames.length - 1)) {
                    wrData = wrData + colVar + '\n';
                } else {
                    wrData = wrData + colVar + '\t';
                }
            }
        }
    }
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(cutArray);
        // console.log(ecutArrayObj);
        // var cutArray2 = JSON.parse(localStorage.getItem('cutArray'));
        // console.log(cutArray2);
    }
    return wrData;
} //cutArray.sceneオブジェクトを読み出す

/**
 * 各エレメントレコードを集めてカットを構成
 * @param {*} elementArray 
 */
function makeCutArray(elemArray) {
    var tag = "[makeCutArray]";
    var dbMsg = tag; // + elemArray.length + "要素";
    var b_sn = ""; //前の行のシーン・カット
    var b_sceneNo = 's010';
    var b_scene = ""; //前の行のシーン
    var b_cTime = ""; //前の行の長さ
    var audioUrl = '';
    var b_audioUrl = ''; //使用曲
    var viewType = "text"; //使用スレッドの区分
    var cutArrayCount = -1; //-1
    var lastElement = '';
    var audioPosition = 0;
    var b_cutTime = 0;
    var audioChange = false;
    try {
        var cutArray = {};
        var wrStr = '';
        dbMsg = tag + "," + elemArray.length + "件";
        if (0 < elemArray.length) {
            var sceneObj = new Object();
            var fastNC = elemArray[0].scene_cut;
            var lastNC = elemArray[elemArray.length - 1].scene_cut;
            dbMsg = dbMsg + fastNC + '～' + lastNC;
            if (debug_now == true) {
                // console.log(elemArray);
            }
            var farstRec = 0;
            if (elemArray[farstRec].scene_cut === 's000c00') {
                if (elemArray[farstRec].width) {
                    baceWidth = elemArray[farstRec].width * 1;
                    localStorage.setItem('fws_baceWidth', baceWidth);
                }
                if (elemArray[farstRec].hight) {
                    baceHeight = elemArray[farstRec].hight * 1;
                    localStorage.setItem('fws_baceHeight', baceHeight);
                }
                dbMsg = dbMsg + "[" + baceWidth + "×" + baceHeight + "]";
                if (elemArray[farstRec].fontColor) {
                    autoSend = elemArray[farstRec].fontColor + '';
                    localStorage.setItem('fws_autoSend', autoSend);
                }
                dbMsg = dbMsg + ",autoSend=" + autoSend;
                farstRec = 1;
            }
            dbMsg = dbMsg + "、" + farstRec + "行から";
            myLog(dbMsg);
            cutArray[cutArrayCount] = new Object(); //各カット単位；ArrayではJSONstrにならない
            for (var i = farstRec; i < elemArray.length; ++i) {
                dbMsg = tag + "(" + i + "行)";
                var sn = elemArray[i].scene_cut; //シーン・カット
                dbMsg = dbMsg + sn;
                var sceneNo = sn.slice(0, 4); //elemArray[i].scene_cut.slice(0, 4);
                var cutNo = sn.slice(-3); //elemArray[i].scene_cut.slice(-3);
                dbMsg = dbMsg + "(シーン=" + sceneNo + "/カット=" + cutNo + ")";
                var cElement = elemArray[i].element;
                dbMsg = dbMsg + "の" + cElement;
                var cType = elemArray[i].type;
                dbMsg = dbMsg + "に" + cType;
                var cTime = elemArray[i].time;
                dbMsg = dbMsg + "," + cTime + "秒";
                if (sn != b_sn) { // && sn !== 's010c01'
                    dbMsg = dbMsg + "シーンの変わり目";
                    cutArrayCount = cutArrayCount + 1;
                    cutArray[cutArrayCount] = new Object(); //各カット単位；ArrayではJSONstrにならない
                    b_sn = sn;
                    b_time = cTime;
                    cutArray[cutArrayCount]['scene_cut'] = sn;
                    if (sn != fastNC) {
                        sceneEndCuts.push(cutArray[cutArrayCount - 1]['scene_cut']); //各シーンの最終カット
                        cutArray[cutArrayCount - 1]['viewType'] = viewType;
                        cutArray[cutArrayCount - 1]['lastElement'] = lastElement; //カットで最後のエレメント
                        //20170720//////////////////////////////
                        if (audioChange == true) {
                            dbMsg = dbMsg + ",audioChange=" + audioChange;
                            audioPosition = 0;
                        } else {
                            audioPosition = audioPosition + b_cutTime;
                            audioPosition = Math.round(audioPosition * 1000) / 1000;
                        }
                        dbMsg = dbMsg + ">>" + cutArray[cutArrayCount - 1]['scene_cut'] + "は" + audioPosition + "秒";
                        cutArray[cutArrayCount - 1]['audioPosition'] = audioPosition;
                        ///////////////////////////////20170720//
                        if (sceneNo != b_sceneNo) { //.match(
                            dbMsg = dbMsg + ",sceneNo=" + sceneNo + ";" + b_sceneNo;
                            b_sceneNo = sceneNo;
                            // sceneObj = new Object();
                            if (sceneObj['fix_left']) {
                                delete sceneObj['fix_left'];
                            }
                            if (sceneObj['fix_right']) {
                                delete sceneObj['fix_right'];
                            }
                            // myLog(dbMsg);
                        }
                    } else {
                        b_sceneNo = sceneNo;
                    }
                    viewType = "text"; //使用スレッドの区分
                    if (cType.match('scroll')) {
                        viewType = "scroll";
                    }
                    audioChange = false;
                    // myLog(dbMsg);
                } //if (sn != b_sn) { カットの変わり目
                cutArray[cutArrayCount]['isSoFo'] = false; //音声をフェードアウトするカット
                var elementObj = new Object();
                elementObj = $.extend(true, {}, elemArray[i]);
                cutArray[cutArrayCount][cElement] = $.extend(true, {}, elementObj); //{}

                if (elemArray[i].time) {
                    dbMsg = dbMsg + ",このカットは" + elemArray[i].time + "秒";
                    cutArray[cutArrayCount]['time'] = elemArray[i].time;
                    if (0 < cutArrayCount) { //  && (1 < cutArrayCount && 0 < cutArray[cutArrayCount - 1]['audioPosition'])
                        dbMsg = dbMsg + ",audio=" + audioPosition; //parseFloat(  parseInt(elemArray[i-1].time / 1000
                        b_cutTime = cutArray[cutArrayCount - 1]['time'] / 1000;
                        dbMsg = dbMsg + "+" + b_cutTime; //parseFloat(  parseInt(elemArray[i-1].time / 1000
                        if (audioChange == false) {
                            // audioPosition = audioPosition + b_cutTime;
                            // dbMsg = dbMsg + ">>" + audioPosition + "秒";
                            // cutArray[cutArrayCount]['audioPosition'] = audioPosition;
                        } else if (sn != lastNC) {
                            if (cutArray[cutArrayCount - 1]['scene_cut'] != fastNC) {
                                cutArray[cutArrayCount - 1]['isSoFo'] = true;
                                dbMsg = dbMsg + ",isSoFo";
                            }
                            // audioChange = false;
                        }
                        // myLog(dbMsg);
                    }
                }
                if (cElement.match('audio') || cElement.match('wall') || cElement.match('layout') || cElement.match('fix_')) {
                    sceneObj[cElement] = $.extend(true, {}, elementObj);
                    if (cElement.match('audio')) {
                        audioPosition = 0;
                        // dbMsg = dbMsg + ">audioPosition>" + audioPosition;
                        // cutArray[cutArrayCount]['audioPosition'] = audioPosition;
                        audioChange = true;
                    }
                } else if (!lastElement.match('footer_') || !lastElement.match('bottom_')) { //
                    lastElement = cElement;
                }
                cutArray[cutArrayCount]['scene'] = $.extend(true, {}, sceneObj);
                dbMsg = dbMsg + "," + (cutArrayCount + 1) + "カット目";
            } //for (var i = 0; i < elemArray.length; ++i) {
            cutArray[cutArrayCount]['viewType'] = viewType;
            cutArray[cutArrayCount]['lastElement'] = lastElement; //カットで最後のエレメント

            dbMsg = dbMsg + ";cutArray=" + cutArray.length + "件";
            isStartNow = true;
            dbMsg = dbMsg + ";現在の対象=" + textFileName;
            cutArray2localStorage(cutArray);
            myLog(dbMsg);
            if (debug_now == true) {
                console.log(cutArray);
                var cutArray2 = JSON.parse(localStorage.getItem('cutArray'));
                console.log(cutArray2);
            }
        }
        receveCutArray(cutArray); //各viewの受け口に戻る
        // location.reload(true);
    } catch (e) {
        dbMsg = dbMsg + ';e=' + e;
        console.log(dbMsg);
        // window.location.reload(); //再読み込み
    }
} //3;各エレメントレコードを集めてカットを構成

//エレメント操作//////////////////////////////////////////////////////データ操作////
/***
 * 使用ページエレメントからfont設定を消去する
 */
function clossAllElement() {
    var tag = "[clossAllElement]";
    var dbMsg = tag;
    $('#fix_left').css({ "font-family": "" }).css({ "font-size": "" });
    $('#fix_right').css({ "font-family": "" }).css({ "font-size": "" });
    $('#top_left').css({ "font-family": "" }).css({ "font-size": "" });
    $('#top_right').css({ "font-family": "" }).css({ "font-size": "" });
    $('#center_left').css({ "font-family": "" }).css({ "font-size": "" });
    $('#center_right').css({ "font-family": "" }).css({ "font-size": "" });
    $('#bottom_left').css({ "font-family": "" }).css({ "font-size": "" });
    $('#bottom_right').css({ "font-family": "" }).css({ "font-size": "" });
    usedElement = [];
    myLog(dbMsg);
} //使用ページエレメントからfont設定を消去する

/**
 * 基準にする幅
 */
function getBasicWidth() {
    var tag = "[getBasicWidth]";
    var dbMsg = tag;

    var koko = location.href;
    dbMsg = dbMsg + ",href=" + koko;
    var retWidth = $(window).innerWidth(); //width(); //
    if (koko.match('edit')) {
        var retValse = getElementCoordinates('canvas_bace');
        var retWidth = retValse.width * 1;
        var eHeight = retValse.height * 1;
        dbMsg = dbMsg + "[" + retWidth + "×" + eHeight + "]px";
    }
    dbMsg = dbMsg + ",retWidth=" + retWidth;
    myLog(dbMsg);
    return retWidth;
} //基準にする幅

function getBasicScale(targrtElement) {
    var tag = "[getBasicScale]";
    var dbMsg = tag;
    var retValse = getElementCoordinates('canvas_bace');
    var eWidth = retValse.width * 1;
    var eHeight = retValse.height * 1;
    dbMsg = dbMsg + "[" + eWidth + "×" + eHeight + "]px";
    var retScale = eWidth / getBasicWidth();
    dbMsg = dbMsg + ",retScale=" + retScale + "%";
    myLog(dbMsg);
    return retScale;
}

/**
 * 指定したエレメントのクラスなど重複記載が可能なパラメータを取得し、指定した項目を削除して返す
 * @param {*} element 
 * @param {*} attribute 
 * @param {*} removeName 
 */
function getElementAttribute(elementName, attribute, removeName) {
    var tag = "[getElementAttribute]";
    var dbMsg = tag + elementName + "の" + attribute;
    var retStr = "";
    var checkElement = document.getElementById(elementName);
    if (checkElement) {
        if (checkElement.hasAttribute(attribute)) {
            var checkAbs = checkElement.getAttribute(attribute);
            dbMsg = dbMsg + ".元の記載は" + checkAbs;
            var attributeList = checkAbs.split(' ');
            dbMsg = dbMsg + "=" + attributeList.length + "件";
            dbMsg = dbMsg + ",除外=" + removeName;
            for (var i = 0; i < attributeList.length; i++) {
                dbMsg = dbMsg + "(" + i + ")";
                var testStr = attributeList[i];
                dbMsg = dbMsg + testStr;
                if (!testStr.match(removeName)) {
                    retStr = retStr + ' ' + testStr;
                }
            }
        }
    }
    dbMsg = dbMsg + ">戻り値>" + retStr;
    myLog(dbMsg);
    return retStr;
} //指定したエレメントのクラスなど重複記載が可能なパラメータを取得し、指定した項目を削除して返す

/**
 * 指定したエレメントに設定されているbootstrapのグリッド指定（col-）を返す
 * 取り敢えず先頭一個
 * @param {*} elementName 
 */
// function getGlidWidth(elementName) {
//     var tag = "[getGlidWidth]";
//     var dbMsg = tag + elementName;
//     var retStr = "";
//     var checkElement = document.getElementById(elementName);
//     var checkAbs = checkElement.getAttribute("class");
//     dbMsg = dbMsg + ".元の記載は" + checkAbs;
//     var attributeList = checkAbs.split(' ');
//     dbMsg = dbMsg + "=" + attributeList.length + "件";
//     for (var i = 0; i < attributeList.length; i++) {
//         dbMsg = dbMsg + "(" + i + ")";
//         var testStr = attributeList[i];
//         dbMsg = dbMsg + testStr;
//         if (testStr.match('col-')) {
//             retStr = retStr + ' ' + testStr;
//         }
//     }
//     dbMsg = dbMsg + ">戻り値>" + retStr;
//     myLog(dbMsg);
//     return retStr;
// } //指定したエレメントに設定されているbootstrapのグリッド指定（col-）を返す

/**
 * 指定したエレメントをグリッドシステムの数値で幅変更
 * @param {*} targrtElement 
 * @param {*} setVal 
 * 呼出し元 setLRWidth　のみ
 */
function setElementWidth(elementId, setVal) {
    var tag = "[setElementWidth]";
    var dbMsg = tag + elementId + "を" + setVal + "に";
    myLog(dbMsg);
    var idInfo = elementId.split('_');
    var vPosition = idInfo[0];
    var hPosition = idInfo[1];
    if (hPosition.match('left') && setVal == 100) {
        document.getElementById(vPosition + '_right').style.display = 'none';
    }
    document.getElementById(elementId).style.width = setVal + '%';
    // var motoClass = getElementAttribute(elementId, 'class', "col-sm-");
    // dbMsg = dbMsg + ",motoClass=" + motoClass;
    // var targrtElement = document.getElementById(elementId);
    // targrtElement.setAttribute('class', motoClass);
    // targrtElement.setAttribute('class', "col-sm-" + setVal + motoClass);

    if (debug_now == true) {
        // console.log(event);
    }
} //定したエレメントをグリッドシステムの数値で幅変更

/**
 * 反対側の幅との差分から自動設定
 * @param {*} tElement 
 */
function setDeductWidth(tElement) {
    var tag = "[setDeductWidth]";
    var dbMsg = tag;
    var retWidth = 0;
    dbMsg = dbMsg + ",書込み先=" + tElement;
    var srts = tElement.split('_');
    var vPosition = srts[0];
    var hPosition = srts[1];
    dbMsg = dbMsg + "[v=" + vPosition + ",h=" + hPosition + "]";
    var referElement = vPosition + '_left';
    if (hPosition === 'left') {
        referElement = vPosition + '_right';
    }
    dbMsg = dbMsg + ",referElement=" + referElement;
    retWidth = document.getElementById(referElement).style.width + '';
    retWidth = retWidth.replace('%', '') * 1;
    retWidth = Math.round(100 - retWidth);
    dbMsg = dbMsg + ",retWidth=" + retWidth;
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    return retWidth;
} //反対側の幅との差分から自動設定

function getUpperBottomElement(tElement) {
    var tag = "[getUpperBottomElement]";
    var dbMsg = tag + tElement;
    var upperElement = '';
    var bottomElement = '';
    if (tElement.match('footer_')) {
        upperElement = 'bottom_aria';
        bottomElement = 'control_aria';
    } else if (tElement.match('bottom_')) {
        upperElement = 'center_aria';
        bottomElement = 'footer_aria';
    } else if (tElement.match('center_')) {
        upperElement = 'top_aria';
        bottomElement = 'bottom_aria';
    } else if (tElement.match('top_')) {
        upperElement = 'fix_aria';
        bottomElement = 'center_aria';
    } else if (tElement.match('fix_')) {
        // retHight = document.getElementById()
    }
    dbMsg = dbMsg + ",upper=" + upperElement + "～" + bottomElement;
    var elementObj = { upperElement: upperElement, bottomElement: bottomElement };

    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(event);
    }
    return elementObj;
} //指定したエレメントの高さを周辺エレメントの差から算出する
/**
 * 指定したエレメントの高さを周辺エレメントの差から算出する
 * @param {*} tElement 
 */
function getElementHightRemainParcent(tElement) {
    var tag = "[getElementHightRemainParcent]";
    var dbMsg = tag + tElement;
    var retHight = 0;
    var elementObj = getUpperBottomElement(tElement);
    var upperElement = elementObj.upperElement;
    var bottomElement = elementObj.bottomElement;
    dbMsg = dbMsg + ",上下=" + upperElement + "～" + bottomElement;
    // var upperTop = document.getElementById(upperElement).style.top;
    // upperTop = upperTop.replace('%', '') * 1;
    // dbMsg = dbMsg + ",upperTop=" + upperTop;
    // var upperHeight = document.getElementById(upperElement).style.height;
    // upperHeight = upperHeight.replace('%', '') * 1;
    // dbMsg = dbMsg + ",upperHeight=" + upperHeight;
    var upperBottom = getUpperElementBottom(upperElement)
    dbMsg = dbMsg + ",upperBottom=" + upperBottom;
    var bottomTop = 0;
    if (document.getElementById(bottomElement)) {
        bottomTop = document.getElementById(bottomElement).style.top;
        bottomTop = bottomTop.replace('%', '') * 1;
    }
    dbMsg = dbMsg + ",bottomTop=" + bottomTop;
    retHight = bottomTop - upperBottom;
    dbMsg = dbMsg + ",retHight=" + retHight;
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(event);
    }
    return retHight;
} //指定したエレメントの高さを周辺エレメントの差から算出する

function setWall() {
    var tag = "[setWall]";
    var dbMsg = tag + wallSrc + "でwallOpacity＝" + wallOpacity + "[" + baceWidth + "×" + baceHeight + "]";
    var moniterScale = getWindowScale("moniter_row"); //"moniter_bace"
    dbMsg = dbMsg + "、moniterScale=" + moniterScale;
    var wrW = baceWidth * moniterScale;
    var wrH = baceHeight * moniterScale;
    dbMsg = dbMsg + ">>wr[ " + wrW + " × " + wrH + " ]";

    if (wallSrc.match('#')) {
        if (tbCtx) {} else {
            makeWallBace(backBord, "canvas_bace", 0, 0, baceWidth, baceHeight);
        }
        tbCtx.clearRect(0, 0, baceWidth, baceHeight);
        dbMsg = dbMsg + 'substring(' + wallSrc.substring(1, 3) + ',' + wallSrc.substring(3, 5) + ',' + wallSrc.substring(5, 7) + ')';
        var rVar = parseInt(wallSrc.substring(1, 3), 16); //wallSrc.substring(1, 3).toString(10);
        var gVar = parseInt(wallSrc.substring(3, 5), 16); //wallSrc.substring(3, 5).toString(10);
        var bVar = parseInt(wallSrc.substring(5, 7), 16); // wallSrc.substring(5, 6).toString(10);
        dbMsg = dbMsg + 'rgba(' + rVar + ',' + gVar + ',' + bVar + ',' + wallOpacity + ')';
        tbCtx.fillStyle = 'rgba(' + rVar + ',' + gVar + ',' + bVar + ',' + wallOpacity * 1 + ')'; //wallSrc;//
        tbCtx.fillRect(0, 0, baceWidth, baceHeight);
    } else if (wallSrc === '') {
        cutPict2Element(backBord, "canvas_bace", 0, 0, wrW, wrH, wallalign, 'img\back.jpg', 0);
    } else {
        cutPict2Element(backBord, "canvas_bace", 0, 0, wrW, wrH, wallalign, wallSrc, wallOpacity);
    }
    // document.getElementById('canvas_bace').style.position = 'absolute';
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(event);
    }
}

/****
 * 左右分割設定
 */
function setLRWidth(leftVar) {
    var tag = "[setLRWidth]";
    var dbMsg = tag + "左" + leftVar;
    leftVar = leftVar * 1;
    for (var i = 0; i < elementIdArray.length; ++i) {
        var elementId = elementIdArray[i];
        dbMsg = dbMsg + "(" + i + ")" + elementId;
        var idInfo = elementId.split('_');
        var vPosition = idInfo[0];
        var hPosition = idInfo[1];
        if (hPosition.match('left')) {
            setElementWidth(elementId, leftVar);
        } else {
            if (leftVar == 100) {
                $('#' + elementId).css({ "display": "none" });
                // document.getElementById(elementId).style.display = 'none';
                dbMsg = dbMsg + ">非表示";
            } else {
                $('#' + elementId).css({ "display": "inline-block" });
                // document.getElementById(elementId).style.display = 'block';
                setElementWidth(elementId, 100 - leftVar);
            }
        }
    }
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(targetCutArray);
    }
} //左右分割設定

function setTopPx(tElement, hightPx, baceY, baceHeight) {
    var tag = "[setTopPx]";
    var dbMsg = tag;
    var top = 0;
    dbMsg = dbMsg + "baceY=" + baceY + "、baceHeight=" + baceHeight;
    dbMsg = dbMsg + ",target=" + tElement;
    if (!tElement.match('fix_')) {
        var tValse = getElementCoordinates(tElement);
        var targetX = tValse.x * 1;
        var targetY = tValse.y * 1;
        dbMsg = dbMsg + "(" + targetX + "," + targetY + ")";
        var targettWidth = tValse.width * 1;
        var targetHeight = tValse.height * 1;
        dbMsg = dbMsg + "[" + targettWidth + "×" + targetHeight + "]px";
        dbMsg = dbMsg + ",hightPx=" + hightPx;
        if (targetHeight < hightPx) {
            targetHeight = hightPx;
        }
        var referElement = '';
        if (tElement.match('footer_')) {
            referElement = 'control_aria';
        } else if (tElement.match('bottom_')) {
            referElement = 'footer_aria';
        } else if (tElement.match('top_')) {
            referElement = 'fix_aria';
        } else if (tElement.match('center_')) {
            referElement = 'top_aria';
        }
        dbMsg = dbMsg + ",参照先=" + referElement;
        if (!tElement.match('fix_')) {
            var rValse = getElementCoordinates(referElement);
            var referX = rValse.x * 1;
            var referY = rValse.y * 1;
            dbMsg = dbMsg + "(" + referX + "," + referY + ")";
            var referWidth = rValse.width * 1;
            var referHeight = rValse.height * 1;
            dbMsg = dbMsg + "[" + referWidth + "×" + referHeight + "]px";
        }
        if (tElement.match('footer_') || tElement.match('bottom_')) {
            top = baceHeight - (referY + targetHeight); //(baceY + baceHeight) -
        } else {
            top = referY + referHeight - baceY;
        }
    }
    dbMsg = dbMsg + "を" + top + "pxに";
    // $('#' + tElement).css({ "top": top + "px" }); //☆　document.getElementById(elmId).style.hight = hight + '%';利かず
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
    }
} //エレメント高さのpx指定

/**
 * 各rowの上端を%で設定する
 * @param {*} tElement 
 * @param {*} hight 
 */
function setTopParcent(tElement, hight) {
    var tag = "[setTopParcent]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",target=" + tElement + ",高さ=" + hight + "%";
    var top = 0;
    var referElement = '';
    var referY = 0;
    var referMarginTop = 0;
    var referHeight = 0;
    var srts = tElement.split('_');
    var vPosition = srts[0];
    var hPosition = srts[0];
    var kakikomiAria = vPosition + '_aria';
    dbMsg = dbMsg + ",kakikomiAria=" + kakikomiAria;
    // var motoH = document.getElementById(kakikomiAria).style.top * 1;
    // dbMsg = dbMsg + ",元の高さ=" + motoH + '%';

    if (tElement.match('footer_')) {
        top = controlAriaTop;
        referY = 100;
        //  referElement = 'control_aria';
    } else if (tElement.match('bottom_')) {
        referElement = 'footer_aria';
    } else if (tElement.match('center_')) {
        referElement = 'top_aria';
    } else if (tElement.match('top_')) {
        referElement = 'fix_aria';
    } else if (tElement.match('fix_')) {
        top = 0;
        referY = 0;
    }
    myLog(dbMsg);
    if (referElement !== '') { //document.getElementById(referElement)
        dbMsg = dbMsg + ",参照先=" + referElement;
        referY = document.getElementById(referElement).style.top;
        if (referY) {
            referY = referY.replace("%", "") * 1;
            dbMsg = dbMsg + "=" + referY;
        }
        referHeight = document.getElementById(referElement).style.height;
        if (referHeight) {
            referHeight = referHeight.replace("%", "") * 1;
            dbMsg = dbMsg + "=" + referHeight;
        }
        referMarginTop = document.getElementById(referElement).style.marginTop;
        if (referMarginTop) {
            referMarginTop = referMarginTop.replace("%", "") * 1;
            dbMsg = dbMsg + "=" + referMarginTop;
        }
        var referMarginBottom = document.getElementById(referElement).style.marginBottom;
        if (referMarginBottom) {
            referMarginBottom = referMarginBottom.replace("%", "") * 1;
            dbMsg = dbMsg + "=" + referMarginBottom;
        }

        if (tElement.match('top_') || tElement.match('center_')) {
            top = referMarginTop + referY + referHeight + referMarginBottom; //referY + referHeight - baceY;
            // dbMsg = dbMsg + ",top=" + top + "px/baceHeight=" + baceHeight + "px"; //top_aria(1309.1875)[123]px,top=1432.1875px/baceHeight=1080pxのtopを133%に
            // top = Math.round(top / baceHeight * 100);
        } else if (tElement.match('footer_') || tElement.match('bottom_')) {
            top = referY - hight - referMarginTop;
        }
    }
    $('#' + kakikomiAria).css({ "position": "absolute" }); // fixed   ☆　document.getElementById(elmId).style.hight = hight + '%';利かず
    dbMsg = dbMsg + "のtopを" + top + "%に";
    $('#' + kakikomiAria).css({ "top": top + "%" });
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
    }
    return top;
} //エレメント高さのpx指定  
/**
 * このシリーズ固有のエレメント評価で残りの高さを取得
 * @param {*} elmId 
 * @param {*} baseValse 
 * @param {*} width 
 * @param {*} cutObj 
 */
function getAriaSize(elmId, baseValse, width, cutObj) {
    var tag = "[getAriaSize]";
    var dbMsg = tag + "elmId=" + elmId;
    var srts = elmId.split('_');
    var vPosition = srts[0];
    dbMsg = dbMsg + ",vPosition=" + vPosition;
    var baseLeft = baseValse.x * 1;
    var baseTop = baseValse.y * 1;
    var baseWidth = baseValse.width * 1;
    var baseHeight = baseValse.height * 1;
    dbMsg = dbMsg + ",base(" + baseLeft + "," + baseTop + ")[" + baseWidth + "×" + baseHeight + "]px";
    if (baseWidth == 0) {
        baseWidth = winW * winScale;
        dbMsg = dbMsg + ">baseWidth>" + baseWidth;
    }
    if (baseHeight == 0) {
        baseHeight = winH * winScale;
        dbMsg = dbMsg + ">baseHeight>" + baseHeight;
    }

    // document.getElementById(elmId).innerText = elmId;
    var pealentValse = getElementCoordinates(elmId);
    var pealentLeft = pealentValse.x * 1;
    var pealentTop = pealentValse.y * 1;
    var pealentWidth = pealentValse.width * 1;
    var pealentHeight = pealentValse.height * 1;
    dbMsg = dbMsg + ",現在(" + pealentLeft + "," + pealentTop + ")";
    dbMsg = dbMsg + "[" + pealentWidth + "×" + pealentHeight + "]px"; //pealent(0,0][0×0]px,
    if (pealentHeight == 0) {
        document.getElementById(elmId).innerHTML = '';

        pealentHeight = baseHeight; // - (uHeight); //
        dbMsg = dbMsg + ",pealentHeight=" + pealentHeight;
        var lastElement = cutObj.lastElement;
        dbMsg = dbMsg + ",lastElement=" + lastElement;

        var botmomMargin = baseHeight * 0.1;
        var uValse;
        var uHight = 0;
        var fixHight = 0;
        // if (cutObj['fix_left']) {
        uValse = getElementCoordinates('fix_left'); //fix_left
        fixHight = uValse.height * 1;
        dbMsg = dbMsg + ",fix_left=" + fixHight;
        var topHight = baseHeight * 0.1;
        uValse = getElementCoordinates('top_left'); //top_left
        topHight = uValse.height * 1;
        dbMsg = dbMsg + ",top_left=" + topHight;
        if (topHight < uHight) {
            topHight = uHight;
            dbMsg = dbMsg + ">>" + topHight;
        }
        var centerHight = baseHeight * 0.2;
        uValse = getElementCoordinates('center_aria'); //center_left
        uHight = uValse.height * 1;
        dbMsg = dbMsg + ",center_aria=" + uHight;
        if (centerHight < uHight) {
            centerHight = uHight;
            dbMsg = dbMsg + ">>" + centerHight;
        }
        var bottomHight = baseHeight * 0.1;
        uValse = getElementCoordinates('bottom_aria'); //bottom_left
        uHight = uValse.height * 1;
        dbMsg = dbMsg + ",bottom_aria=" + uHight;
        if (bottomHight < uHight) {
            bottomHight = uHight;
        }
        dbMsg = dbMsg + ">>" + bottomHight;
        if (vPosition.match('fix')) {
            // uValse = getElementCoordinates('top_aria');
            pealentHeight = baseHeight - (topHight + centerHight + bottomHight); // pHeight = pWidth * 9 / 16;
        } else if (vPosition.match('top')) {
            pealentHeight = baseHeight - (fixHight + centerHight + bottomHight);
            if (lastElement.match('top')) {
                pealentHeight = baseHeight - (fixHight + topHight);
                dbMsg = dbMsg + ">center無し>" + pealentHeight;
            }
        } else if (vPosition.match('center')) {
            pealentHeight = baseHeight - (fixHight + topHight + bottomHight);
            dbMsg = dbMsg + ",center以降=" + pealentHeight;
            if (lastElement.match('center')) {
                pealentHeight = baseHeight - (fixHight + topHight);
                dbMsg = dbMsg + ">bottom無し>" + pealentHeight;
            }
        } else if (vPosition.match('bottom')) {
            pealentHeight = baseHeight - (fixHight + topHight + centerHight);
        }
        dbMsg = dbMsg + ",botmomMargin=" + botmomMargin;
        pealentHeight = pealentHeight - botmomMargin;
    }
    dbMsg = dbMsg + ">>[" + pealentWidth + "×" + pealentHeight + "]px"; //>>[249.9×620]px
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(event);
    }
    var retValse = { x: pealentLeft, y: pealentTop, width: pealentWidth, height: pealentHeight };
    return retValse;
} //下にエレメントが無ければ底辺まで高さ拡張；このシリーズ固有のエレメント評価で残りの高さを取；

/**
 * 上のエレメントの底辺Y座標を返す
 * @param {*} tElement 
 */
function getUpperElementBottom(tElement) {
    var tag = "[getUpperElementBottom]";
    var dbMsg = tag;
    var retBottom = 0;
    dbMsg = dbMsg + ",tElement=" + tElement;
    var srts = tElement.split('_');
    var vPosition = srts[0];
    var hPosition = srts[1];
    dbMsg = dbMsg + "[v=" + vPosition + ",h=" + hPosition + "]";
    var referElement = vPosition + '_aria';
    dbMsg = dbMsg + ",referElement=" + referElement;
    myLog(dbMsg);
    if (document.getElementById(referElement)) {
        var referTop = document.getElementById(referElement).style.top;
        referTop = referTop.replace('%', '') * 1;
        dbMsg = dbMsg + ",referTop=" + referTop;
        var referHeight = document.getElementById(referElement).style.height;
        referHeight = referHeight.replace('%', '') * 1;
        dbMsg = dbMsg + ",referHeight=" + referHeight;
        var referMarginTop = document.getElementById(referElement).style.marginTop;
        referMarginTop = referMarginTop.replace('%', '') * 1;
        dbMsg = dbMsg + ",referMarginTop=" + referMarginTop;
    }
    retBottom = referTop + referHeight + referMarginTop;
    dbMsg = dbMsg + ",retBottom=" + retBottom;
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(event);
    }
    return retBottom;
} //上のエレメントの底辺Y座標を返す

function getUnderElementtop(tElement) {
    var tag = "[getUnderElementtop]";
    var dbMsg = tag;
    var retTop = 0;
    dbMsg = dbMsg + ",tElement=" + tElement;
    var referElement = '';
    if (tElement.match('footer_')) {
        retTop = controlAriaTop;
        // referElement = 'control_aria';
    } else if (tElement.match('bottom_')) {
        referElement = 'footer_aria';
    } else if (tElement.match('center_')) {
        referElement = 'bottom_aria';
    } else if (tElement.match('top_')) {
        referElement = 'center_aria';
    }
    dbMsg = dbMsg + "," + referElement;
    if (referElement !== '') { //document.getElementById(referElement)
        retTop = document.getElementById(referElement).style.top;
    }
    dbMsg = dbMsg + ",retTop=" + retTop;
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(event);
    }
    return retTop;
} //下エレメントの上辺Y座標を返す

///フォント//////////////////////////////////////////////////////////////レイアウト/////
/**
 * 文字寄せ
 * @param {*} event 
 */
function setfontAline(tElement, alignNo) {
    var tag = "[setfontAline]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",tElement=" + tElement;
    alignNo = alignNo * 1; //☆文字列で渡されていた
    dbMsg = dbMsg + ",alignNo=" + alignNo;
    $('#' + tElement).css({ "text-align": "" }).css({ "position": "" }).css({ "top": "" }).css({ "bottom": "" }).css({ "margin-top": "" });
    if (9 == alignNo) {
        dbMsg = dbMsg + "=justify";
        $('#' + tElement).css({ "text-align": "justify" });
        $('#' + tElement).css({ "top": "50%" }).css({ "margin-top": "-1.0rem" });
        // if (tElement.match('_right')) {
        $('#' + tElement).css({ "position": "absolute" });
        // }
    } else if (6 <= alignNo) { //下詰め
        dbMsg = dbMsg + "=下詰め";
        var uet = getUnderElementtop(tElement);
        dbMsg = dbMsg + uet + "まで";
        uet = 100 - uet.replace('%', '');
        dbMsg = dbMsg + uet + "まで";
        $('#' + tElement).css({ "bottom": uet + '%' });
        // if (tElement.match('_right')) {
        $('#' + tElement).css({ "position": "absolute" });
        // }
        alignNo = alignNo - 6;
    } else if (3 <= alignNo) { //上詰め
        dbMsg = dbMsg + "=上詰め";
        var ueb = getUpperElementBottom(tElement);
        dbMsg = dbMsg + ueb + "まで";
        $('#' + tElement).css({ "top": ueb });
        // if (tElement.match('_right')) {
        $('#' + tElement).css({ "position": "absolute" });
        // }
        alignNo = alignNo - 3;
    }
    dbMsg = dbMsg + ">>" + alignNo;

    switch (alignNo) {
        case 0:
            dbMsg = dbMsg + "=center";
            $('#' + tElement).css({ "text-align": "center" });
            break;
        case 1:
            dbMsg = dbMsg + "=left";
            $('#' + tElement).css({ "text-align": "left" });
            break;
        case 2:
            dbMsg = dbMsg + "=right";
            $('#' + tElement).css({ "text-align": "right" });
            break;
        case 9:
            dbMsg = dbMsg + "=justify";
            $('#' + tElement).css({ "text-align": "justify" });
            break;
    }
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(eventElement);
    }
} //文字寄せ

/**
 *和文/英雲変更
 * @param {*} event 
 */
function setFontType(wrId, sFontFamily) {
    var tag = "[setFontType]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",書込み先=" + wrId + ",を" + sFontFamily;
    if (sFontFamily === 'true') { // || fontFamily == 'true'
        document.getElementById(wrId).style.fontFamily = '"Great Vibes", cursive';
        dbMsg = dbMsg + ">>英文";
    } else if (sFontFamily === 'false') { // || fontFamily == 'true'
        document.getElementById(wrId).style.fontFamily = 'meiryo';
        dbMsg = dbMsg + ">>和文";
    } else {
        document.getElementById(wrId).style.fontFamily = sFontFamily;
        dbMsg = dbMsg + ">>和文";
    }
    // var motoClass = getElementAttribute(wrId, 'class', "jtfont");
    // dbMsg = dbMsg + ",motoClass=" + motoClass;
    // var motoClass = getElementAttribute(wrId, 'class', "etfont");
    // dbMsg = dbMsg + ">>" + motoClass;
    // var setFont = "jtfont";
    // document.getElementById(wrId).setAttribute('class', motoClass + " " + setFont);
    myLog(dbMsg);

} //和文/英雲変更

/**
 * 指定したエリアの中で最大のフォントサイズを探す
 */
function getMaxfontSize() {
    var tag = "[getMaxfontSize]";
    var dbMsg = tag;
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(targetCutArray);
    }
    dbMsg = dbMsg + targetCutArray.length + "件";
    targetCutArray
    var retSize = 6;
    var ChackIdArray = ['fix_left', 'fix_right', 'top_left', 'top_right'];
    for (var i = 0; i < ChackIdArray.length; i++) {
        var elmId = ChackIdArray[i]; //var elmName = nameArray[i];
        dbMsg = tag + "(" + i + ")" + elmId;
        var rObj;
        if (elmId.match('fix_')) {
            rObj = targetCutArray['scene'][elmId];
        } else {
            rObj = targetCutArray[elmId];
        }
        if (rObj) {
            var type = rObj.type + '';
            dbMsg = dbMsg + ',type=' + type;
            if (type.match('text') || type.match('scroll')) {
                var fontSize = rObj.fontSize * 1;
                dbMsg = dbMsg + ',fontSize=' + fontSize + 'pt';
                if (retSize < fontSize) {
                    retSize = fontSize;
                }

            }
        }
    }
    dbMsg = dbMsg + ',retSize=' + retSize + 'pt';
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(eventElement);
    }
    return retSize;
} //指定したエリアの中で最大のフォントサイズを探す

/**
 * pxでフォントサイズ指定
 * @param {*} event 
 */
function setFontSizePx(wrId, settVal, souce) {
    var tag = "[setFontSizePx]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",書込み先=" + wrId;
    dbMsg = dbMsg + ",settVal=" + settVal;
    var fontRESize = settVal;
    dbMsg = dbMsg + ",souce=" + souce;
    winScale = getWindowScale("moniter_row"); // backBord
    dbMsg = dbMsg + ",winScale=" + winScale;
    var isWrap = -1;
    souce = souce + '';
    fontRESize = fontRESize; //* winScale;
    dbMsg = dbMsg + ">fontSize>" + fontRESize;
    // if (5 < fontRESize) {
    fontRESize = Math.round(fontRESize - 0.5); //切り捨て
    document.getElementById(wrId).style.fontSize = fontRESize + "pt";
    // } else {
    //     document.getElementById(wrId).style.fontSize = settVal + "pt";
    //     // document.getElementById(wrId).style.webkitTransform = 'scale(' + winScale + ',' + winScale + ',1)'; // -webkit-transform: scale3d(0.5, 0.5, 1);
    //     document.getElementById(wrId).style.transform = 'scale(' + winScale + ')'; //-webkit-transform: scale(0.9);
    //     document.getElementById(wrId).style.webkitTransformOrigin = '0 0 0'; //左肩に指定しないと中心に寄せられる
    //     document.getElementById(wrId).parentNode.style.transform = 'scale3d(1,' + winScale + ',1)'; //    transform: scale3d(1,0.2,1);
    //     document.getElementById(wrId).parentNode.style.webkitTransformOrigin = '0 0 0'; //    transform: scale3d(1,0.2,1);
    // }
    myLog(dbMsg);
    return settVal;
} //pxでフォントサイズ指定

/**
 * 上部のフォントサイズからのパーセンテージでサイズ設定
 * @param {*} wrId       実際に書き込むdivやｐ
 * @param {*} settVal    指定値
 */
function setFontSizeParcent(wrId, settVal) {
    var tag = "[setFontSizeParcent]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",settVal=" + settVal + "%";
    dbMsg = dbMsg + ",書込み先=" + wrId;
    var maxFontSize = getMaxfontSize();
    dbMsg = dbMsg + ",maxFontSize=" + maxFontSize;
    // dbMsg = dbMsg + ",mRation=" + mRation;
    var setFontSize = maxFontSize * settVal;
    dbMsg = dbMsg + ",setFontSize=" + setFontSize;
    document.getElementById(wrId).style.fontSize = (setFontSize * winScale) + "pt";
    myLog(dbMsg);
    return setFontSize;
} //上部のフォントサイズからのパーセンテージでサイズ設定

/**
 * フォントサイズの合わせ方選択
 * 文字を書き込んでから最終的に行う
 * @param {*} event 
 */
function setfontSizeFit(wrId, souce) {
    var tag = "[setfontSizeFit]";
    var dbMsg = tag;
    winScale = getWindowScale("moniter_row"); // backBord
    dbMsg = dbMsg + ",winScale=" + winScale;
    var checkElement = document.getElementById(wrId);
    dbMsg = dbMsg + ",書込み先=" + wrId;
    var maxLine = souce;
    if (souce.match('<br>')) {
        isWrap = souce.indexOf('<br>') * 1;
        maxLine = getMAxLenLine(souce);
    }
    dbMsg = dbMsg + ",最長行=" + maxLine + "=" + maxLine.length + "文字";
    document.getElementById(wrId).innerHTML = maxLine;
    // var orgSize = document.defaultView.getComputedStyle(document.getElementById(wrId), null).fontSize; //= checkElement.style.fontSize;
    // dbMsg = dbMsg + ",orgSize=" + orgSize;
    // if (orgSize) {
    //     orgSize = orgSize.replace("pt", '');
    //     orgSize = orgSize.replace("px", '') * 1;
    // }
    // if (0 < orgSize) {} else {
    //     orgSize = 300;
    // }
    // dbMsg = dbMsg + ">>" + orgSize;
    var fontReSize = 1400 / maxLine.length; //あいうえおかきくけこ　の10文字が改行するまで140pt
    $('#' + wrId).css({ "font-size": (fontReSize * winScale) + "pt" });

    $('#' + wrId).css({ "word-wrap": "" }); //改行
    $('#' + wrId).css({ "white-space": "nowrap" }); //改行させない
    var orgWidth = document.defaultView.getComputedStyle(document.getElementById(wrId), null).width; //retValse.width; //document.getElementById('dummy_element').clientWidth; //$('#dummy_element').width(); // retValse.width;
    var orgHeight = document.defaultView.getComputedStyle(document.getElementById(wrId), null).height; //retValse.width; //document.getElementById('dummy_element').clientWidth; //$('#dummy_element').width(); // retValse.width;
    dbMsg = dbMsg + ",元[" + orgWidth + "×" + orgHeight + ']';
    orgHeight = orgHeight.replace("px", '') * 1;
    $('#' + wrId).css({ "white-space": "" }); //改行させない
    $('#' + wrId).css({ "word-wrap": "break-word" }); //改行
    var expandWidth = document.defaultView.getComputedStyle(document.getElementById(wrId), null).width; //retValse.width; //document.getElementById('dummy_element').clientWidth; //$('#dummy_element').width(); // retValse.width;
    var expandHeight = document.defaultView.getComputedStyle(document.getElementById(wrId), null).height; //retValse.width; //document.getElementById('dummy_element').clientWidth; //$('#dummy_element').width(); // retValse.width;
    dbMsg = dbMsg + ":改行[" + expandWidth + "×" + expandHeight + ']';
    expandHeight = expandHeight.replace("px", '') * 1;
    while (orgHeight < expandHeight) {
        fontReSize--;
        fontReSize = Math.round(fontReSize - 0.5); //切り捨て
        dbMsg = dbMsg + ">" + fontReSize + "pt";
        $('#' + wrId).css({ "font-size": (fontReSize * winScale) + "pt" });
        expandHeight = document.defaultView.getComputedStyle(document.getElementById(wrId), null).height;
        dbMsg = dbMsg + ";" + expandHeight;
        expandHeight = expandHeight.replace("px", '') * 1;
    }
    $('#' + wrId).css({ "word-wrap": "" }); //改行
    document.getElementById(wrId).innerHTML = souce;
    // fontReSize = fontReSize / winScale;
    dbMsg = dbMsg + ">>" + fontReSize + "pt";
    myLog(dbMsg);
    return fontReSize;
} //フォントサイズの合わせ方選択

/**
 * 書込み先と指定値でフォントサイズ設定の分岐
 * @param {*} wrId       実際に書き込むdivやｐ
 * @param {*} settVal    指定値
 */
function setFontSize2Element(wrId, fSize, souce) {
    var tag = "[setFontSize2Element]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",書込み先=" + wrId;
    dbMsg = dbMsg + ",fontSize=" + fSize;
    dbMsg = dbMsg + ",souce=" + souce;
    // myLog(dbMsg);
    // if (fSize < 10) { //pt指定
    //     fSize = 24;
    // }

    fSize = setFontSizePx(wrId, fSize, souce);
    // } else if (-1 < fSize) { //%指定
    //     fSize = setFontSizeParcent(wrId, fSize);
    // } else { //0以下は最長行をエレメント幅に収める
    //     fSize = setfontSizeFit(wrId, souce);
    // }
    dbMsg = dbMsg + ">>" + fSize + "pt";
    myLog(dbMsg);
    return fSize;
} //書込み先と指定値でフォントサイズ設定の分岐

function setFontColor(wrId, settVal) {
    var tag = "[setFontColor]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",settVal=" + settVal;
    dbMsg = dbMsg + ",書込み先=" + wrId;
    document.getElementById(wrId).style.color = settVal;
    myLog(dbMsg);
    return settVal;
} //上部のフォントサイズからのパーセンテージでサイズ設定

function setElementBGColor(wrId, settVal) {
    var tag = "[setElementBGColor]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",settVal=" + settVal;
    dbMsg = dbMsg + ",書込み先=" + wrId;
    if (settVal.match('-1')) {
        document.getElementById(wrId).style.backgroundColor = '';
        // getElementAttribute(wrId, 'style', 'backgroundColor');
    } else {
        document.getElementById(wrId).style.backgroundColor = settVal;
    }
    myLog(dbMsg);
    return settVal;
} //上部のフォントサイズからのパーセンテージでサイズ設定

/**
 * 複数行テキストエリアの行数を文字数で指定する
 * @param {*} wrId 
 * @param {*} settVal 
 */
function setScrollHigt(wrId, settVal) {
    var tag = "[setScrollHigt]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",書込み先=" + wrId;
    dbMsg = dbMsg + ",settVal=" + settVal;
    myLog(dbMsg);
    var rStrs = wrId.split('_');
    var baceElement = rStrs[0] + "_" + rStrs[1] + '';
    dbMsg = dbMsg + ",baceElement=" + baceElement;
    targetCutArray[baceElement].vRows = settVal;
    reWriteScroll(wrId); //baceElement + '_scroll'

    // document.getElementById(wrId).style.height = settVal + "em";
} //複数行テキストエリアの行数を文字数で指定する

/**
 * スクロールテキストの書き直し
 * @param {*} wrId 
 */
function reWriteScroll(wrId) {
    var tag = "[reWriteScroll]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",書込み先=" + wrId;
    var rStrs = wrId.split('_');
    var baceElement = rStrs[0] + "_" + rStrs[1] + '';
    dbMsg = dbMsg + ",baceElement=" + baceElement;
    // setElementHight(baceElement);
    // var elementWidth = $('#' + baceElement).width(); //☆親エレメントから描画範囲を変更する
    // var elementHight = $('#' + baceElement).height();
    // dbMsg = dbMsg + ",エレメント[" + elementWidth + "×" + elementHight + "]";
    var rStrs = wrId.split('_');
    var baceElement = rStrs[0] + "_" + rStrs[1] + '';
    dbMsg = dbMsg + "," + nextSC + 'カット目の' + baceElement;
    var rObj = targetCutArray[baceElement];
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(rObj);
    }
    var souce = rObj.souce + '';
    dbMsg = dbMsg + ",souce=" + souce;
    var align = rObj.align;
    dbMsg = dbMsg + ",align=" + align;
    var left = rObj.left * 1;
    var top = rObj.top * 1;
    dbMsg = dbMsg + "(" + left + "," + top + ")";
    var retValse = getElementCoordinates(baceElement);
    var width = retValse.width * 1;
    dbMsg = dbMsg + ",width=" + width;
    var vRows = rObj.vRows;
    dbMsg = dbMsg + ",vRows=" + vRows + "行";
    var sSpead = rObj.scrollSpead;
    dbMsg = dbMsg + ",scrollSpead=" + sSpead;
    var sFontFamily = rObj.fontFamily;
    dbMsg = dbMsg + ",fontFamily=" + sFontFamily;
    var fontSize = rObj.fontSize * 1;
    if (fontSize == 0) {
        fontSize = 24;
    }
    if (winScale < 0) {
        var retVal = getWindowScale("moniter_row"); // backBord
        if (0 < retVal) {
            winScale = retVal;
        }
    }
    dbMsg = dbMsg + ",winScale=" + winScale;
    fontSize = fontSize * winScale;
    dbMsg = dbMsg + ",fontSize=" + fontSize;
    if (document.getElementById(wrId)) {
        var pearentElement = document.getElementById(baceElement);
        if (pearentElement.firstChild) {
            pearentElement.removeChild(pearentElement.firstChild);
            dbMsg = dbMsg + "既存削除";
        }
    }
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(rObj);
    }
    varticalscroll(wrId, baceElement, souce, vRows, sSpead, left, width, sFontFamily, fontSize);
    return sSpead;
} //スクロールテキストの書き直し
////pict操作/////////////////////////////////////////////////////////////////////フォント////
/**
 * 画像の透明度設定
 * @param {*} wrId 
 * @param {*} settVal 
 */
function setPictOpt(wrId, settVal) {
    var tag = "[setPictOpt]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",書込み先=" + wrId;
    dbMsg = dbMsg + ",settVal=" + settVal;
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
    document.getElementById(wrId).style.opacity = settVal * 1;
} //画像の透明度

/**
 * 画像の書き直し
 * @param {*} wrId 
 */
function reWritePict(wrId) {
    var tag = "[reWritePict]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",書込み先=" + wrId;
    var rStrs = wrId.split('_');
    var baceElement = rStrs[0] + "_" + rStrs[1] + '';
    dbMsg = dbMsg + ",baceElement=" + baceElement;
    setElementHight(baceElement);
    var elementWidth = $('#' + baceElement).width(); //☆親エレメントから描画範囲を変更する
    var elementHight = $('#' + baceElement).height();
    dbMsg = dbMsg + ",エレメント[" + elementWidth + "×" + elementHight + "]";
    var rStrs = wrId.split('_');
    var baceElement = rStrs[0] + "_" + rStrs[1] + '';
    dbMsg = dbMsg + ",baceElement=" + baceElement;
    var rObj = targetCutArray[baceElement];
    var souce = rObj.souce;
    dbMsg = dbMsg + ",souce=" + souce;
    var align = rObj.align;
    dbMsg = dbMsg + ",align=" + align;
    var left = rObj.left * 1;
    var top = rObj.top * 1;
    dbMsg = dbMsg + "(" + left + "," + top + ")";
    var scale = rObj.scale;
    dbMsg = dbMsg + ",scale=" + scale + "%";
    var opacity = rObj.opacity;
    dbMsg = dbMsg + ",opacity=" + opacity;
    if (opacity) {} else {
        opacity = 1.0;
        dbMsg = dbMsg + ">>" + opacity;
    }
    var fleamWidth = rObj.fleamWidth * 1;
    if (0 == fleamWidth) {
        fleamWidth = 10;
    }
    dbMsg = dbMsg + ",fleamWidth=" + fleamWidth;
    var fleamColor = rObj.fleamColor;
    if (fleamColor) {} else {
        fleamColor = "#ffffff";
    }
    dbMsg = dbMsg + ",fleamColor=" + fleamColor;
    if (document.getElementById(wrId)) {
        var pearentElement = document.getElementById(baceElement);
        if (pearentElement.firstChild) {
            pearentElement.removeChild(pearentElement.firstChild);
            dbMsg = dbMsg + "既存削除";
        }
    }
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(rObj);
    }
    fitPict2Element(wrId, baceElement, left, top, elementWidth, elementHight, align, souce, scale, opacity, fleamWidth, fleamColor);

} //画像の書き直し

/**
 * 画像エリアに隙間がある場合に寄せる方向
 * @param {*} wrId 
 * @param {*} alignNo 
 */
function setPictAline(wrId, alignNo) {
    var tag = "[setPictAline]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",書込み先=" + wrId;
    dbMsg = dbMsg + ",alignNo=" + alignNo;

    var rStrs = wrId.split('_');
    var baceElement = rStrs[0] + "_" + rStrs[1] + '';
    dbMsg = dbMsg + ",baceElement=" + baceElement;
    var wrElement = baceElement + "_" + rStrs[2] + '';
    dbMsg = dbMsg + ",wrElement=" + wrElement;
    var rObj = targetCutArray[baceElement];
    dbMsg = dbMsg + ",align=" + rObj.align;

    rObj.align = alignNo;
    dbMsg = dbMsg + ">>" + rObj.align;
    setElementHight(baceElement);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(eventElement);
    }
    reWritePict(wrElement);
} //画像エリアに隙間がある場合に寄せる方向

/**
 * 画像の縮小率
 * @param {*} wrId 
 * @param {*} settVal 
 */
function setPictScale(wrId, settVal) {
    var tag = "[setPictScale]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",書込み先=" + wrId;
    dbMsg = dbMsg + ",settVal=" + settVal;
    var rStrs = wrId.split('_');
    var baceElement = rStrs[0] + "_" + rStrs[1] + '';
    dbMsg = dbMsg + ",baceElement=" + baceElement;
    var rObj = targetCutArray[baceElement];
    dbMsg = dbMsg + ",scale=" + rObj.scale;
    rObj.scale = settVal;
    dbMsg = dbMsg + ">>" + rObj.scale;
    myLog(dbMsg);
    reWritePict(wrId);
} //画像の縮小率

///カット毎の共通描画部////////////////////////////////////////////////pict操作//
/**
 * カット毎のエレメント書込み
 * @param {*} cutObj 
 */
function cutWrigt(cutObj) {
    var tag = "[cutWrigt]";
    var dbMsg = tag;
    var elementCount = 0;
    var topFSize = 0;
    var pictCount = 0; //1画面中に作成されるcanasのカウント
    var scrollItem;
    var sSpead = 0;
    try {
        cutTimeArray = new Array();
        iPhot = [];
        pCanvas = [];
        pCtx = [];
        fPCount = -1; //一画面中の画像カウント；canvas_utilで設定するfitPict2Element用カウンタ
        dbMsg = tag + "(" + nextSC + ")" + sceneCut; //cutObj.scene_cut;
        targetCutArray = $.extend(true, [], cutObj); //配列コピー
        if (localStorage.getItem('fws_baceWidth')) {
            baceWidth = localStorage.getItem('fws_baceWidth');
        }
        if (localStorage.getItem('fws_baceHeight')) {
            baceHeight = localStorage.getItem('fws_baceHeight');
        }
        dbMsg = dbMsg + ",指定モニター[" + baceWidth + "×" + baceHeight + ']';
        winScale = getWindowScale("moniter_row"); // backBord
        dbMsg = dbMsg + ",winScale=" + winScale;

        var baseValse = getElementCoordinates('back_bord'); //back_bord     canvas_baceは高さ0？
        var baceY = baseValse.y;
        // var baceHeight = baseValse.height;
        // dbMsg = dbMsg + ",back_bord(" + baseValse.x + "," + baceY + "[" + baseValse.width + "×" + baceHeight + ']';
        for (var i = 0; i < elementIdArray.length; i++) {
            elmId = elementIdArray[i];
            dbMsg = dbMsg + ",none(" + i + ")" + elmId;
            // myLog(dbMsg);
            document.getElementById(elmId).setAttribute('style', 'padding-right: 0px;display:none');
            // $('#' + vPosition + '_aria').css({ "position": "" })
        }
        now_layout = cutObj.scene.layout.souce + '';
        dbMsg = dbMsg + ",now_layout=" + now_layout + "(" + scene_layout + ")";
        var leftVar = 50;
        var rightVar = 50;
        myLog(dbMsg);
        if (debug_now == true) {
            console.log(cutObj);
            console.log(targetCutArray);
        }
        if (now_layout.match(':')) {
            var lStr = now_layout.split(':');
            leftVar = lStr[0] * 1;
            isHDivide = true;
            dbMsg = dbMsg + ",leftVar=" + leftVar + ",左右分割=" + isHDivide;
        } else {
            isHDivide = false;
        }
        if (now_layout !== scene_layout) { //match
            scene_layout = now_layout;
            if (0 < leftVar) {
                setLRWidth(leftVar);
            }
        }
        for (var i = 0; i < elementIdArray.length; i++) { //for (var i = 0; i < nameArray.length; i++) {
            var elmId = elementIdArray[i]; //var elmName = nameArray[i];
            dbMsg = tag + "(" + i + ")" + elmId;
            var srts = elmId.split('_');
            var vPosition = srts[0];
            var hPosition = srts[1];
            dbMsg = dbMsg + "[v=" + vPosition + ",h=" + hPosition + "]leftVar=" + leftVar;
            document.getElementById(elmId).style = '';
            document.getElementById(elmId).setAttribute('style', 'padding-right: 0px;display:none'); //有無不明な段階では非表示に
            document.getElementById(elmId).style.marginTop = '0px'; //padding-left: 1px;
            document.getElementById(elmId).style.marginBottom = '0px'; //padding-left: 1px;
            $('#' + elmId).css({ "text-align": "" });
            $('#' + elmId).css({ "top": "" });
            $('#' + elmId).css({ "bottom": "" });
            $('#' + elmId).css({ "margin-top": "" });
            if (hPosition === 'left') {
                dbMsg = dbMsg + "," + vPosition + "_ariaにabsolute";
                $('#' + vPosition + '_aria').css({ "height": "" });
                $('#' + vPosition + '_aria').css({ "top": "" });
            }
            //  $('#' + elmId).css({ "position": "" });
            var leftHight = 0;
            var rObj;
            if (elmId.match('fix_')) {
                rObj = cutObj['scene'][elmId];
            } else {
                rObj = cutObj[elmId];
            }
            if (rObj) {
                var souce = rObj.souce + '';
                dbMsg = dbMsg + ",souce=" + souce;
                if (souce !== '') {
                    document.getElementById(elmId).style.display = 'inline-block'; //有れば表示
                    var type = rObj.type + '';
                    dbMsg = dbMsg + " , type=" + type;
                    souce = souce.replace(/"/g, '');
                    souce = souce.replace(/'/g, '');
                    var align = rObj.align * 1;
                    dbMsg = dbMsg + ",align=" + align;
                    var effect = rObj.effect;
                    dbMsg = dbMsg + ",effect=" + effect;
                    var left = rObj.left * 1;
                    $('#' + elmId).css({ "left": left + '%' });
                    var top = rObj.top * 1;
                    dbMsg = dbMsg + ".left/top(" + left + "," + top + ")";
                    var width = rObj.width * 1;
                    dbMsg = dbMsg + "[" + width + "col";
                    var setWidth = width;
                    dbMsg = dbMsg + ">>" + setWidth + "%";
                    $('#' + elmId).css({ "width": setWidth + "%" }); //☆　document.getElementById(elmId).style.hight = hight + '%';
                    var hight = rObj.hight * 1;
                    dbMsg = dbMsg + "×" + hight + "%]";
                    var hightPx = baceHeight * hight / 100; // * winScale
                    // $('#' + elmId).css({ "height": hightPx + 'px' }); // $('#' + elmId).css({ "height": hight + "%" }); //☆　document.getElementById(elmId).style.hight = hight + '%';
                    if (vPosition === 'footer') {
                        $('#' + vPosition + '_aria').css({ "position": "absolute" });
                        $('#' + vPosition + '_aria').css({ "top": top + "%" });
                        $('#' + vPosition + '_aria').css({ "height": hight + "%" });
                    } else {
                        var yPosition = setTopParcent(elmId, hight);
                        dbMsg = dbMsg + "、yPosition=" + yPosition + "%";
                        if (hPosition === 'right') {
                            var readHight = document.getElementById(vPosition + '_aria').style.height;
                            readHight = readHight.replace('%', '') * 1;
                            dbMsg = dbMsg + "readHight=" + readHight + "%";
                            if (readHight < hight) {
                                $('#' + vPosition + '_aria').css({ "height": hight + "%" });
                            }
                        } else if (hPosition === 'left') {
                            dbMsg = dbMsg + "," + vPosition + "_ariaにabsolute";
                            $('#' + vPosition + '_aria').css({ "position": "absolute" });
                            $('#' + vPosition + '_aria').css({ "height": hight + "%" });
                        }
                    }
                    var pealentValse = getAriaSize(elmId, baseValse, width, cutObj);
                    var pealentLeft = pealentValse.x * 1;
                    var pealentTop = pealentValse.y * 1;
                    var pealentWidth = pealentValse.width * 1;
                    var pealentHeight = pealentValse.height * 1;
                    dbMsg = dbMsg + ">書込み範囲[" + pealentWidth + "×" + pealentHeight + "]px"; //296.335205078125×184.9090850830078
                    pealentWidth = baceWidth * setWidth / 100 * winScale; //winH * winScale * (1 / 3);
                    pealentHeight = baceHeight * hight / 100 * winScale;
                    dbMsg = dbMsg + ">pealentHeight>" + pealentHeight;
                    if (type.match("text") || type.match("scroll")) {
                        var wrightElement = elmId;
                        if (type.match("scroll")) {
                            var vRows = rObj.vRows;
                            dbMsg = dbMsg + ",vRows=" + vRows;
                            var wrightElement = elmId + "_scroll";
                            dbMsg = dbMsg + ",wrightElement=" + wrightElement;
                            var vRows = rObj.vRows;
                            dbMsg = dbMsg + ",vRows=" + vRows + "行";
                            sSpead = reWriteScroll(wrightElement);
                            dbMsg = dbMsg + ",sSpead=" + sSpead;
                            // myLog(dbMsg);
                            scrollItem = wrightElement;
                            scrollT = wrightElement + '_scroll';
                        } else {
                            document.getElementById(elmId).innerHTML = souce;
                        }
                        dbMsg = dbMsg + ",wrightElement=" + wrightElement;
                        var sFontFamily = rObj.fontFamily + '';
                        dbMsg = dbMsg + ",setFontFamily=" + sFontFamily;
                        // myLog(dbMsg);
                        setFontType(wrightElement, sFontFamily);
                        // var align = rObj.align * 1;
                        // dbMsg = dbMsg + ",align=" + align;
                        setfontAline(wrightElement, align);
                        var fontSize = rObj.fontSize * 1 * winScale;
                        dbMsg = dbMsg + ",fontSize=" + fontSize;
                        var retSize = setFontSize2Element(wrightElement, fontSize, souce);
                        dbMsg = dbMsg + ">設定後>" + retSize;
                        var fontColor = rObj.fontColor + '';
                        dbMsg = dbMsg + ",fontColor=" + fontColor;
                        if (!fontColor.match('#')) {
                            fontColor = '#000000';
                        }
                        setFontColor(wrightElement, fontColor);
                        var bgColor = rObj.bgColor + '';
                        dbMsg = dbMsg + ",bgColor=" + bgColor;
                        if (!bgColor.match('#')) {
                            bgColor = '-1';
                        }
                        setElementBGColor(wrightElement, bgColor);
                    } else if (type.match("pict")) {
                        var pScale = rObj.scale * 1;
                        dbMsg = dbMsg + ",pScale=" + pScale;
                        var opacity = rObj.opacity * 1;
                        dbMsg = dbMsg + ",opacity=" + opacity;
                        var fleamColor = rObj.fleamColor;
                        dbMsg = dbMsg + ",fleamColor=" + fleamColor;
                        if (fleamColor) {} else {
                            fleamColor = "#ffffff";
                            dbMsg = dbMsg + ">>" + fleamColor;
                        }
                        var fleamWidth = rObj.fleamWidth;
                        dbMsg = dbMsg + ",fleamWidth=" + fleamWidth;
                        if (fleamWidth) {} else {
                            fleamWidth = 10;
                            dbMsg = dbMsg + ">>" + fleamWidth;
                        }
                        dbMsg = dbMsg + ",canvasSize[" + pealentWidth + "×" + pealentHeight + "]px";
                        var addName = elmId + "_phot";
                        fPCount++;
                        fitPict2Element(addName, elmId, left, top, pealentWidth, pealentHeight, align, souce, pScale, opacity, fleamWidth * winScale, fleamColor);
                    }
                    if (!elmId.match(/fix/)) {
                        usedElement.push(elmId);
                        dbMsg = dbMsg + ",usedElement＝" + usedElement.length + '件';
                    } else {
                        dbMsg = dbMsg + ",fix除外";
                    }
                    $('#' + elmId).css({ "position": "absolute" }); //absolute
                    elementCount++;
                }
            } else {
                dbMsg = dbMsg + ",該当なし";
                if (vPosition === 'fix') {} else {
                    if (hPosition === 'left') {
                        var uet = getUnderElementtop(elmId);
                        dbMsg = dbMsg + "下エレメントまで" + uet;
                        if (uet) {} else {
                            uet = getUnderElementtop('bottom_left');
                            dbMsg = dbMsg + ">>" + uet;
                        }
                        $('#' + vPosition + '_aria').css({ "top": uet + '%' }); //.css({ "position": "absolute" })
                    }
                }
            }
            // for (var i = 0; i < vIdArray.length; i++) {
            //     vPosition = vIdArray[i];
            //     $('#' + vPosition + '_aria').css({ "position": "absolute" })

            // }
            myLog(dbMsg);
        }
        dbMsg = dbMsg + '終了';
        myLog(dbMsg);
    } catch (e) {
        dbMsg = dbMsg + '>エラー>' + e;
        console.log(dbMsg);
        // window.location.reload(); //再読み込み
    }
    var retValse = { scrollItem: scrollItem, scrollSpead: sSpead, pictCount: pictCount, elementCount: elementCount };
    myLog(dbMsg);
    stopNIAnimation(cutTimeArray)
    return retValse;
}