/****
 * edit.htm固有function
 */
var debug_now = false;
var leftBarance = 0.5;
var rightBarance = 0.5;
var sceneEndCuts = []; //各シーンの最終カット
var isTop = false; //スクロールアイテムがある
var nowEditType;
var nowEditSouce = '';

//変更反映////////////////////////////////////////////////////////////////////
/**
 * 変更されたエレメントのパラメータをlocalStorage経由で他のページに渡す
 * 　elementArrayを変更し、cutArrayを更新する
 * @param {*} targrtElement 
 * @param {*} columun 
 * @param {*} setVal 
 */
function reWrightElemenData(targrtElement, columun, setVal) {
    var tag = "[reWrightElemenData]";
    var dbMsg = tag;
    dbMsg = dbMsg + targrtElement + 'の' + columun + 'を' + setVal + 'に変更'; //fix_leftのfontFamilyをfalseに変更;現在の(18)s040c02は
    // var sCut = sceneCut;
    // dbMsg = dbMsg + ';現在の(' + nextSC + ')' + sCut + 'は';
    // var idInfo = sCut.split('c');
    // if (targrtElement.match('fix') || targrtElement.match('layout') || targrtElement.match('audio') || targrtElement.match('wall')) {
    //     sCut = idInfo[0]; // + "_" + idInfo[1];
    //     dbMsg = dbMsg + ">>" + sCut;
    // }
    var elementArray = JSON.parse(localStorage.getItem('elementArray'));
    // var elementArrayObj = JSON.parse(localStorage.getItem('elementArray')); //localStorageから読み出し
    // elementArray = $.extend(true, [], elementArrayObj); //☆[]で配列にする

    dbMsg = dbMsg + '、' + elementArray.length + '件中';
    var reWriteIndex = 0;
    var judgeStart = false;
    for (var i = 0; i < elementArray.length; ++i) {
        var nowSC = elementArray[i].scene_cut;
        if (nowSC.match(sceneCut)) {
            dbMsg = dbMsg + '(' + i + '件目)' + nowSC + 'は' + elementArray[i].element;
            // var scArray = nowSC.split('c');
            judgeStart = true;
            if (elementArray[i].element.match(targrtElement)) {
                dbMsg = dbMsg + 'の' + columun;
                // console.log(elementArray[i]);
                var nowVal = elementArray[i][columun] + '';
                dbMsg = dbMsg + "は現在＝" + nowVal;
                elementArray[i][columun] = setVal + '';
                dbMsg = dbMsg + '>>' + elementArray[i][columun];
                reWriteIndex = i;
                i = elementArray.length;
                if (columun.match('type')) {
                    dbMsg = dbMsg + ",columun＝" + columun;
                    if (nowEditType) {
                        dbMsg = dbMsg + ",nowEditType＝" + nowEditType;
                        if (nowEditType.match('none')) {
                            dbMsg = dbMsg + ",elementArray＝" + elementArray.length + '件';
                            console.log(elementArray[reWriteIndex]); //elementArray.reWriteIndexではundefined
                            elementArray = delObjByIndex(elementArray, reWriteIndex)
                                // elementArray = elementArray.filter(function(element, index, array) { return (element.a && element.a === i); });
                                //delete elementArray[reWriteIndex]; // 配列なら    elementArray.splice(i, 1);
                            dbMsg = dbMsg + ">>" + elementArray.length + '件';
                        }
                    }
                }
            }
        } else if (judgeStart && !nowSC.match(sceneCut)) {
            dbMsg = dbMsg + '該当項目なし';
            var obj = new Object();
            obj['scene_cut'] = sceneCut;
            obj['type'] = nowEditType;
            obj['element'] = targrtElement;
            obj['souce'] = nowEditSouce;
            obj['width'] = '6';
            obj['align'] = '0';
            if (nowEditType.match('text') || nowEditType.match('scroll')) {
                obj['fontSize'] = '1';
                obj['fontColor'] = "#e81384";
                obj['fontFamily'] = 'meiryo';
                if (nowEditType.match('scroll')) {
                    obj['vRows'] = '5';
                    obj['scrollSpead'] = '20';
                }
            } else if (nowEditType.match('pict')) {
                obj['align'] = '4';
                obj['fleamColor'] = "#ffffff";
                obj['fleamWidth'] = '5';
                obj['opacity'] = '1';
                obj['scale'] = "100";
            }
            if (columun.match('souce')) {
                obj['souce'] = setVal;
            } else {
                obj[columun] = setVal;
            }
            elementArray.splice(i, 0, obj);
            reWriteIndex = i;
            i = elementArray.length;
            myLog(dbMsg);
            if (debug_now == true) {
                console.log(obj);
                console.log(elementArray);
            }
        }
    }

    dbMsg = dbMsg + ',reWriteIndex=' + reWriteIndex;
    dbMsg = dbMsg + '、結果=' + elementArray.length + '件中';

    var keyName = 'elementArray';
    // dbMsg = dbMsg + keyName;
    localStorage.removeItem(keyName);
    wrStr = JSON.stringify(elementArray);
    // dbMsg = dbMsg + ";" + wrStr;
    localStorage.setItem(keyName, wrStr);
    // console.log(elementArray[i]);
    dbMsg + ';nextSC(' + nextSC + ')';
    myLog(dbMsg);
    if (debug_now == true) {
        var elementArray2 = JSON.parse(localStorage.getItem('elementArray'));
        console.log(elementArray2[reWriteIndex]);
    }
    isEdit = true; //編集中
    if (targrtElement.match('layout')) {
        isReWrite = true
    }
    makeCutArray(elementArray);
    // return;
} //変更されたエレメントのパラメータをlocalStorage経由で他のページに渡す


//ページメニュー///////////////////////////////////////////////////変更反映//

/**
 * プレイヤーで確認表示
 * @param {*} event 
 */
function viewPlayer(event) {
    var tag = "[viewPlayer]";
    var dbMsg = tag;
    // dbMsg = '現在' + nextSC; // + ';' + cutArray[nextSC].scene_cut;
    // // console.log(cutArray);
    // var scName = cutArray[nextSC].scene_cut;
    dbMsg = '、送り先=' + sceneCut;
    myLog(dbMsg);
    window.open('index.html?' + escape(sceneCut), "_blank");
    //ページを書き換えるだけなら window.location.href = 'index.html?' + escape(scName);
} //プレイヤーで確認表示

/**
 * 前のカットへ戻る
 * @param {*} event 
 */
function previewCut(event) {
    var tag = "[previewCut]";
    var dbMsg = tag;
    dbMsg = dbMsg + '現在' + nextSC; // + ';' + cutArray[nextSC].scene_cut;
    // console.log(cutArray);
    dbMsg = dbMsg + cutArray[nextSC].scene_cut;
    nextSC--;
    var scName = cutArray[nextSC].scene_cut;
    // dbMsg = dbMsg + ",textFileName=" + textFileName; // + ",pearentID=" + pearentID;
    // var escapeStr = textFileName + '&' + scName;
    // dbMsg = dbMsg + ",escapeStr=" + escapeStr; // + ",pearentID=" + pearentID;
    dbMsg = '、送り先=' + scName;
    myLog(dbMsg);
    window.location.href = 'edit.htm?' + escape(scName);
} //前のカットへ戻る

/**
 * 次のカットへ進む
 * @param {*} event 
 */
function forwordCut(event) {
    var tag = "[forwordCut]";
    var dbMsg = tag;
    dbMsg = dbMsg + '現在' + nextSC; // + ';' + cutArray[nextSC].scene_cut;
    // console.log(cutArray);
    dbMsg = dbMsg + cutArray[nextSC].scene_cut;
    nextSC++;
    var scName = cutArray[nextSC].scene_cut;
    // dbMsg = dbMsg + ",textFileName=" + textFileName; // + ",pearentID=" + pearentID;
    // var escapeStr = textFileName + '&' + scName;
    // dbMsg = dbMsg + ",escapeStr=" + escapeStr; // + ",pearentID=" + pearentID;
    dbMsg = '、送り先=' + scName;
    myLog(dbMsg);
    window.location.href = 'edit.htm?' + escape(scName);
} //次のカットへ進む

function saveData(event) {
    var tag = "[saveData]";
    var dbMsg = tag;
    // myAlert('データを書き出す機能は只今制作中です。\nこの機能は皆さんが編集したデータをご自身のPCに保存し、再利用できる様、開発中です。');

    textFileName = signageName;
    var elementArray2 = JSON.parse(localStorage.getItem('elementArray')); // var elementArray2 = JSON.parse(localStorage.getItem('elementArray'));
    dbMsg = dbMsg + ',text=' + elementArray2.length + "件";
    convertArray2TabText(elementArray2)

    // writeToLocal("hoge.txt", elementArray2);     //http://naopr.hatenablog.com/entry/20140401/1396341503
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elementArray);
    }
} //bt;書込み
//シーンプロパティ//////////////////////////////////////////////ページメニュー//
/**
 * レイアウトのフリー/左右分割切替
 */
function layoutSet() {
    var tag = "[layoutSet]";
    var dbMsg = tag;
    var check1 = document.setform.layout_free.checked;
    var check2 = document.setform.layout_lr.checked;
    dbMsg = dbMsg + "フリー=" + check1 + ",左右=" + check2;
    var settVal = event.target.value;
    dbMsg = dbMsg + ",settVal=" + settVal;
    nowEditType = 'layout';
    var elemArray;
    if (check1 == true) {
        isHDivide = false; //フリー
        elementDisp(document.getElementsByName('center_edit'), 'inline-block');
        document.getElementById('layout_lr_balance').style.display = 'none';
        // writeThisCut(targetCutArray);
        elemArray = reWrightElemenValue(sceneCut, 'layout', 'souce', 'free', 'layout');
        // reWrightElemenData('layout', 'souce', 'free'); //データ更新
    } else if (check2 == true) {
        isHDivide = true; //左右分割
        elementDisp(document.getElementsByName('center_edit'), 'none');
        document.getElementById('layout_lr_balance').style.display = 'inline-block';
        setLRWidth(50); //モニター更新
        elemArray = reWrightElemenValue(sceneCut, 'layout', 'souce', '50:50', 'layout');
        //         reWrightElemenData('layout', 'souce', '50:50'); //データ更新
    }
    dbMsg = dbMsg + ",isHDivide=" + isHDivide;
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
} //レイアウトのフリー/左右分割切替

function addObjRecord(event) {
    var tag = "[addObjRecord]";
    var dbMsg = tag;
    var elementId = event.target.id;
    dbMsg = dbMsg + 'elementId=' + elementId;
    dbMsg = dbMsg + ',sceneCut=' + sceneCut;
    var idInfo = elementId.split('_');
    var setType = idInfo[0];
    dbMsg = dbMsg + ',setType=' + setType;
    var elemArray = makeNewElementRecord(sceneCut, setType, setType, '')
    elementArray2localStorage(elemArray);
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //各エレメントに何を設定するか

function deletObjRecord(event) {
    var tag = "[deletObjRecord]";
    var dbMsg = tag;
    var elementId = event.target.id;
    dbMsg = dbMsg + 'elementId=' + elementId;
    dbMsg = dbMsg + ',sceneCut=' + sceneCut;
    var idInfo = elementId.split('_');
    var setType = idInfo[0];
    dbMsg = dbMsg + ',setType=' + setType;
    var elemArray = delFromElementArray(sceneCut, setType);
    elementArray2localStorage(elemArray);
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
        console.log(elemArray);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //各エレメントに何を設定するか

/**
 * 各エレメントに何を設定するか
 * @param {*} event 
 */
function elementTypeSelect(event) {
    var tag = "[elementTypeSelect]";
    var dbMsg = tag;
    var eventElement = event.target;
    var elementName = eventElement.getAttribute('name');
    dbMsg = dbMsg + ",elementName=" + elementName; // this>>obj だと obj.getAttribute('name'); //event.srcElement,target,toElementはspanタグ,divはundefined,event.path[0]などはタグ
    var clickBtElement = event.toElement;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var vPosition = idInfo[0];
    var hPosition = idInfo[1];
    var elmId = vPosition + "_" + hPosition;
    dbMsg = dbMsg + ",elmId=" + elmId;
    var settVal = event.target.value;
    dbMsg = dbMsg + ",settVal=" + settVal;
    nowEditType = settVal;

    if (targetCutArray[elmId]) {
        dbMsg = dbMsg + "既存エレメントの変更";
    } else {
        dbMsg = dbMsg + "新規エレメントの作成";
    }
    if (settVal.match('none')) {
        if (targetCutArray[elmId]) {
            var res = confirm(sceneCut + "の" + elmId + "を削除します。");
            if (res == true) { // OKなら削除
                elemArray = delFromElementArray(sceneCut, elmId);
                // window.location.reload(); //再読み込み
            }
        }
    } else {
        var motoType = getElementPropaty(sceneCut, elmId, 'type') + '';
        dbMsg = dbMsg + ",motoType=" + motoType;
        if (motoType !== '') {
            nowEditSouce = getElementPropaty(sceneCut, elmId, 'souce');
            dbMsg = dbMsg + ",nowEditSouce=" + nowEditSouce;
            if (settVal.match('text') && motoType.match('scroll')) {} else if (settVal.match('scroll') && motoType.match('text')) {} else {
                elemArray = delFromElementArray(sceneCut, elmId);
            }
        }
        var elemArray = makeNewElementRecord(sceneCut, elmId, settVal, nowEditSouce)
            // if ((nowEditSouce === 'scroll' && motoType === 'text') || (nowEditSouce === 'text' && motoType === 'scroll')) {

        // }

        // elemArray = reWrightElemenValue(sceneCut, elmId, 'type', settVal, settVal);
        // if (settVal.match('text') || settVal.match('scroll')) {
        //     if (settVal.match('text')) {
        //         if (nowEditSouce === '' || motoType !== 'scroll') {
        //             nowEditSouce = '表示する文章を設定して下さい';
        //         }
        //     } else if (settVal.match('scroll')) {
        //         if (nowEditSouce === '' || motoType !== 'text') {
        //             nowEditSouce = 'スクロール\nさせる\n文字を\n設定して\n下さい\n\n&lt;br&gt;などの\nタグは\n自動的に\n書き込みますので、\nEnterキーで\n改行を\n設定して\n下さい。';
        //         }
        //         elemArray = reWrightElemenValue(sceneCut, elmId, 'scrollSpead', '20', settVal);
        //     }
        //     elemArray = reWrightElemenValue(sceneCut, elmId, 'fontColor', '#000000', settVal);
        //     elemArray = reWrightElemenValue(sceneCut, elmId, 'fontFamily', 'false', settVal);
        //     elemArray = reWrightElemenValue(sceneCut, elmId, 'fontSize', '24', settVal);
        //     elemArray = reWrightElemenValue(sceneCut, elmId, 'vRows', '1', settVal);

        // } else if (settVal.match('pict')) {
        //     // nowEditType = 'pict';
        //     if (nowEditSouce === '' || motoType === 'text' || motoType === 'scroll') {
        //         nowEditSouce = "img/please-select.png";
        //     }
        //     elemArray = reWrightElemenValue(sceneCut, elmId, 'fleamWidth', '1', settVal);
        //     elemArray = reWrightElemenValue(sceneCut, elmId, 'fleamColor', '#ffffff', settVal);
        //     elemArray = reWrightElemenValue(sceneCut, elmId, 'scale', '100', settVal);
        //     elemArray = reWrightElemenValue(sceneCut, elmId, 'opacity', '1', settVal);
        // }
        // elemArray = reWrightElemenValue(sceneCut, elmId, 'souce', nowEditSouce, settVal);
        // if (motoType.match('pict')) {
        //     if (settVal.match('text') || settVal.match('scroll')) {
        //         elemArray = reWrightElemenValue(sceneCut, elmId, 'fontSize', 24, settVal);
        //     }
        // }
        // var rLeft = 0;
        // var rTop = 0;
        // var rWidth = 100; //setDeductWidth(elmId);
        // var rHight = getElementHightRemainParcent(elmId);
        // var lWidth = getElementPropaty(sceneCut, vPosition + '_left', 'width') * 1;
        // dbMsg = dbMsg + ",lWidth=" + lWidth;
        // if (hPosition === 'right') {
        //     rWidth = 50; //100 - lWidth;
        //     rLeft = Math.round(100 - rWidth);
        //     rHight = getElementPropaty(sceneCut, vPosition + '_left', 'hight') * 1;
        //     dbMsg = dbMsg + ",rHight=" + rHight;
        //     rTop = getElementPropaty(sceneCut, vPosition + '_left', 'top') * 1;
        //     dbMsg = dbMsg + ",rTop=" + rTop;
        // } else {
        //     if (lWidth != 0) {
        //         rWidth = lWidth;
        //     }
        //     if (vPosition === 'footer') {
        //         rTop = controlAriaTop - 12;
        //     } else if (vPosition === 'bottom') {
        //         rTop = controlAriaTop - 24;
        //     }
        // }
        // elemArray = reWrightElemenValue(sceneCut, elmId, 'left', rLeft * 1, settVal);
        // elemArray = reWrightElemenValue(sceneCut, elmId, 'top', rTop * 1, settVal);
        // elemArray = reWrightElemenValue(sceneCut, elmId, 'width', rWidth * 1, settVal);
        // elemArray = reWrightElemenValue(sceneCut, elmId, 'hight', rHight * 1, settVal);
        // elemArray = reWrightElemenValue(sceneCut, elmId, 'bgColor', '-1', settVal); //'#ffffff'
        // elemArray = reWrightElemenValue(sceneCut, elmId, 'align', '0', settVal);
        // elemArray = reWrightElemenValue(sceneCut, elmId, 'time', '5000', settVal);

    }
    // elementArray2localStorage(elemArray);
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
        console.log(elemArray);
        // console.log(targetCutArray[elmId]);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //各エレメントに何を設定するか

//カットプロパティ//////////////////////////////////////////////シーンプロパティ//
function cutTime(event) {
    var tag = "[cutTime]";
    var dbMsg = tag;
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var dousaKubun = idInfo[0];
    dbMsg = dbMsg + ",dousaKubun=" + dousaKubun;
    idInfo = sceneCut.split('c');
    var sceneStr = idInfo[0] + '';
    dbMsg = dbMsg + ",sceneStr=" + sceneStr;
    var setVal = document.getElementById('cp_cut_time').value * 1; //eventElement.value;
    dbMsg = dbMsg + ",内容=" + setVal;
    dbMsg = dbMsg + ",sceneCut=" + sceneCut;
    if (elementArray) {} else {
        elementArray = JSON.parse(localStorage.getItem('elementArray'));
    }
    dbMsg = dbMsg + '、' + elementArray.length + '件中';
    for (var i = 0; i < elementArray.length; ++i) {
        var nowSC = elementArray[i].scene_cut;
        idInfo = nowSC.split('c');
        var nowSceneStr = idInfo[0] + '';
        if ((dousaKubun === 'cp' && nowSC === sceneCut) ||
            (dousaKubun === 'sp' && nowSceneStr === sceneStr) ||
            dousaKubun === 'all'
        ) {
            dbMsg = dbMsg + ",(" + i + ')' + nowSceneStr;
            var tElement = elementArray[i].element;
            dbMsg = dbMsg + ",tElement=" + tElement;
            var setType = getElementPropaty(nowSC, tElement, 'type');
            dbMsg = dbMsg + ",setType=" + setType;
            var mototime = getElementPropaty(nowSC, tElement, 'time');
            dbMsg = dbMsg + ",元設定=" + mototime;
            var elemArray = reWrightElemenValue(nowSC, tElement, 'time', setVal, setType);
        }
    }
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
}

function fedeinTime(event) {
    var tag = "[fedeinTime]";
    var dbMsg = tag;
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var setVal = eventElement.value;
    dbMsg = dbMsg + ",内容=" + setVal;
    // var elemArray = reWrightElemenValue(sceneCut, tElement, 'souce', setVal, tType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    // makeCutArray(elemArray);
    // window.location.reload(); //再読み込み
}

function fedeoutTime(event) {
    var tag = "[fedeoutTime]";
    var dbMsg = tag;
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var setVal = eventElement.value;
    dbMsg = dbMsg + ",内容=" + setVal;
    // var elemArray = reWrightElemenValue(sceneCut, tElement, 'souce', setVal, tType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    // makeCutArray(elemArray);
    // window.location.reload(); //再読み込み
}

//文章変更//エレメント変更//////////////////////////////////////////////カットプロパティ//

function leftParcent(event) {
    var tag = "[leftParcent]";
    var dbMsg = tag;
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var tElement = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",書込み先=" + tElement;
    var settVal = event.target.value;
    dbMsg = dbMsg + ",settVal=" + settVal + "%";
    dbMsg = dbMsg + "(nextSC=" + nextSC + ')';
    var setType = getElementPropaty(sceneCut, tElement, 'type');
    dbMsg = dbMsg + ",setType=" + setType;
    var elemArray = reWrightElemenValue(sceneCut, tElement, 'left', settVal, setType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //エレメント高さの％指定

function topParcent(event) {
    var tag = "[topParcent]";
    var dbMsg = tag;
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var tElement = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",書込み先=" + tElement;
    var settVal = event.target.value;
    dbMsg = dbMsg + ",settVal=" + settVal + "%";
    dbMsg = dbMsg + "(nextSC=" + nextSC + ')';
    var setType = getElementPropaty(sceneCut, tElement, 'type');
    dbMsg = dbMsg + ",setType=" + setType;
    var elemArray = reWrightElemenValue(sceneCut, tElement, 'top', settVal, setType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //エレメント高さの％指定

/**
 * 左右分割時の左右比設定
 */
function sayuuHi(event) {
    var tag = "[sayuuHi]";
    var dbMsg = tag;
    dbMsg = dbMsg + "(sceneCut=" + sceneCut + ')';
    var eventElement = event.target;
    // var elementId = eventElement.getAttribute('id');
    // dbMsg = dbMsg + ",id=" + elementId;
    // var idInfo = elementId.split('_');
    // var tElement = idInfo[0] + "_" + idInfo[1];
    // dbMsg = dbMsg + ",書込み先=" + tElement;
    var leftVar = event.target.value * 1;
    dbMsg = dbMsg + ",leftVar=" + leftVar + "[%]";
    var rightVar = 100 - leftVar;
    dbMsg = dbMsg + ",rightVar=" + rightVar + "[%]";
    var elemArray = reWrightElemenValue(sceneCut, 'layout', 'souce', leftVar + ':' + rightVar, 'layout');
    for (var i = 0; i < elementIdArray.length; i++) {
        elmId = elementIdArray[i];
        dbMsg = tag + ",(" + i + ")" + elmId;
        var srts = elmId.split('_');
        var vPosition = srts[0];
        var hPosition = srts[1];
        dbMsg = dbMsg + "=" + vPosition + "と" + hPosition;
        var rObj;
        if (vPosition === 'fix') {
            rObj = targetCutArray['scene'][elmId];
        } else {
            rObj = targetCutArray[elmId];
        }
        myLog(dbMsg);
        if (debug_now == true) {
            console.log(rObj);
        }
        if (rObj) {
            var widthVal = leftVar;
            var leftPosiVal = 0;
            if (hPosition === 'right') {
                widthVal = rightVar;
                leftPosiVal = leftVar;
            } else {
                var checkElement = vPosition + '_right';
                rObj = targetCutArray[checkElement];
                if (rObj) {} else {
                    widthVal = 100;
                }
            }
            dbMsg = dbMsg + "に" + widthVal + ",左端=" + leftPosiVal;
            var setType = getElementPropaty(sceneCut, elmId, 'type');
            dbMsg = dbMsg + ",setType=" + setType;
            var elemArray = reWrightElemenValue(sceneCut, elmId, 'width', widthVal, setType);
            elemArray = reWrightElemenValue(sceneCut, elmId, 'left', leftPosiVal, setType);
        }
    }
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
    //  var leftVar = event.target.value * 1; //select.value * 1      parseFloat(select.value);
    // dbMsg = dbMsg + ",left=" + leftVar;
    // rightVar = 12 - leftVar;
    // dbMsg = dbMsg + ",right=" + rightVar;
    // document.getElementById('migi_hi').innerText = rightVar; //Math.round(rightBarance * 10);
    // var settVal = leftVar + ":" + rightVar;
    // dbMsg = dbMsg + ",settVal=" + settVal;
    // nowEditType = 'layout';

    // setLRWidth(leftVar); //モニター更新
    // reWrightElemenData('layout', 'souce', settVal); //データ更新

    // writeThisCut(cutArray[nextSC])
} //左右分割時の左右比設定

/**
 * 各row内の左右比
 * 左の幅をbootstrapのグリッド数で設定し、残りを右半分の幅にする
 * @param {*} event 
 */
function sayuuHi_vposi(event) {
    var tag = "[sayuuHi_vposi]";
    var dbMsg = tag;
    nowEditType = 'layout';
    var eventElement = event.target;
    var elementName = eventElement.getAttribute('name');
    dbMsg = dbMsg + ",Name=" + elementName; // this>>obj だと obj.getAttribute('name'); //event.srcElement,target,toElementはspanタグ,divはundefined,event.path[0]などはタグ
    var elementClass = eventElement.getAttribute('class');
    dbMsg = dbMsg + ",Class=" + elementClass;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var eventSelectedIndex = eventElement.selectedIndex;
    dbMsg = dbMsg + ",SelectedIndex=" + eventSelectedIndex;
    var leftVal = eventElement.value * 1; //eventSelectedIndex + 1;
    var rightVal = 12 - leftVal;
    dbMsg = dbMsg + ",左右比=" + leftVal + "：" + rightVal;
    document.getElementById(elementId + '_migi').innerText = rightVal;
    var idInfo = elementId.split('_');
    var vPosition = idInfo[0];
    var hPosition = idInfo[1];

    if (rightVal == 0) {
        document.getElementById(vPosition + '_right').style.display = 'none';
    } else {
        setElementWidth(vPosition + '_right', rightVal);
    }
    setElementWidth(vPosition + '_left', leftVal);

    var baceElement = vPosition + '_left';
    dbMsg = dbMsg + ",baceElement=" + baceElement;
    // targetCutArray[baceElement].width = leftVal;
    var leftType = targetCutArray[baceElement].type;
    dbMsg = dbMsg + ",=" + leftType;
    // if (leftType.match('pict')) {
    //     dbMsg = dbMsg + "再描画";
    //     reWritePict(baceElement + '_pict');
    // } else if (leftType.match('scroll')) {
    //     reWriteScroll(baceElement + '_scroll');
    // }
    var elemArray = reWrightElemenValue(sceneCut, vPosition + '_left', 'width', leftVal, leftType);
    // var baceElement = vId + '_right';
    // dbMsg = dbMsg + ",baceElement=" + baceElement;
    // myLog(dbMsg);
    // if (targetCutArray[baceElement]) { //右側が有れば
    //     // targetCutArray[baceElement].width = rightVal;
    //     var rightType = targetCutArray[baceElement].type;
    //     dbMsg = dbMsg + ",=" + rightType;
    //     // if (rightType.match('pict')) {
    //     //     dbMsg = dbMsg + "再描画";
    //     //     reWritePict(baceElement + '_pict');
    //     // } else if (leftType.match('scroll')) {
    //     //     reWriteScroll(baceElement + '_scroll');
    //     // }
    //     elemArray = reWrightElemenValue(sceneCut, vId + '_right', 'width', rightVal, rightType);
    // }
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //各row内の左右比；左の幅をbootstrapのグリッド数で設定し、残りを右半分の幅に////20170731廃止

/**
 * エレメント幅の％指定
 * @param {*} event 
 */
function widthParcentSet(event) {
    var tag = "[widthParcentSet]";
    var dbMsg = tag;
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var tElement = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",書込み先=" + tElement;
    var settVal = event.target.value;
    dbMsg = dbMsg + ",settVal=" + settVal + "[%]";
    dbMsg = dbMsg + "(nextSC=" + nextSC + ')';
    var setType = getElementPropaty(sceneCut, tElement, 'type');
    dbMsg = dbMsg + ",setType=" + setType;
    var elemArray = reWrightElemenValue(sceneCut, tElement, 'width', settVal, setType);

    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //エレメント幅の％指定

/**
 * 反対側の幅との差分から自動設定
 * @param {*} event 
 */
function deductWidth(event) {
    var tag = "[deductWidth]";
    var dbMsg = tag;
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var tElement = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",書込み先=" + tElement;
    var settVal = setDeductWidth(tElement);
    dbMsg = dbMsg + ",settVal=" + settVal + "%";
    dbMsg = dbMsg + "(nextSC=" + nextSC + ')';
    var setType = getElementPropaty(sceneCut, tElement, 'type');
    dbMsg = dbMsg + ",setType=" + setType;
    var elemArray = reWrightElemenValue(sceneCut, tElement, 'width', settVal, setType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //反対側の幅との差分から自動設定

/**
 * エレメント高さの％指定
 * @param {*} event 
 */
function hightParcentSet(event) {
    var tag = "[hightParcentSet]";
    var dbMsg = tag;
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var vPosition = idInfo[0];
    var hPosition = idInfo[1];
    var tElement = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",書込み先=" + tElement;
    var settVal = event.target.value;
    dbMsg = dbMsg + ",settVal=" + settVal + "%";
    dbMsg = dbMsg + "(nextSC=" + nextSC + ')';
    var setType = getElementPropaty(sceneCut, tElement, 'type');
    dbMsg = dbMsg + ",setType=" + setType;
    var elemArray = reWrightElemenValue(sceneCut, tElement, 'hight', settVal, setType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //エレメント高さの％指定

/**
 * 選択したエレメントを底辺まで伸ばす
 * @param {*} event 
 */
function setHight2Bottom(tElement) {
    var tag = "[setHight2Bottom]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",書込み先=" + tElement;
    var idInfo = tElement.split('_');
    var vPosition = idInfo[0];
    var hPosition = idInfo[1];
    $('#' + tElement).css({ "height": "" });
    var settVal = getElementHightRemainParcent(tElement)
    dbMsg = dbMsg + ",settVal=" + settVal + "%";
    document.getElementById(tElement + '_hight_parcent').value = settVal;
    dbMsg = dbMsg + "(sceneCut=" + sceneCut;
    var setType = getElementPropaty(sceneCut, tElement, 'type');
    dbMsg = dbMsg + ";" + setType + ')';
    var elemArray = reWrightElemenValue(sceneCut, tElement, 'hight', settVal, setType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //選択したエレメントを底辺まで伸ばす

function setHightEMBody(tElement, vRows) {
    var tag = "[setHightEMBody]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",書込み先=" + tElement;
    dbMsg = dbMsg + ",vRows=" + vRows;
    var lineHeight = document.getElementById(tElement).style.lineHeight; //.getAttribute('line-height');
    dbMsg = dbMsg + ",lineHeight=" + lineHeight;
    if (0 < lineHeight) {} else {
        lineHeight = document.getElementById(tElement).style.lineHeight;
        dbMsg = dbMsg + ">>" + lineHeight;
        if (0 < lineHeight) {} else {
            lineHeight = 150;
            dbMsg = dbMsg + ">>" + lineHeight;
        }
    }
    vRows = vRows * lineHeight / 100;
    dbMsg = dbMsg + ">>" + vRows + "行";

    $('#' + tElement).css({ "height": vRows + "em" });
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
    //モニター更新
    // reWrightElemenData(wrId, 'vRows', settVal); //データ更新
} //スクロールテキストの表示行数
/**
 * 文字数で高さ設定
 * @param {*} tElement 
 */
function setHightEM(tElement) {
    var tag = "[setHightEM]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",書込み先=" + tElement;
    var setType = getElementPropaty(sceneCut, tElement, 'type');
    dbMsg = dbMsg + ";" + setType + ')';
    var vRows = document.getElementById(tElement + '_text_edit_v_rows').value;
    dbMsg = dbMsg + ';' + vRows + "行";
    if (setType === 'scroll') {
        tElement = tElement + '_scroll';
    }
    $('#' + tElement).css({ "height": "" });
    setHightEMBody(tElement, vRows);
    var tValse = getElementCoordinates(tElement);
    var targetX = tValse.x * 1;
    var targetY = tValse.y * 1;
    dbMsg = dbMsg + "(" + targetX + "," + targetY + ")";
    var targettWidth = tValse.width * 1;
    var targetHeight = tValse.height * 1;
    dbMsg = dbMsg + "[" + targettWidth + "×" + targetHeight + "]px";
    var moniterScale = getWindowScale("moniter_bace");
    dbMsg = dbMsg + ",scale=" + moniterScale + "%";
    targetHeight = targetHeight / moniterScale;
    dbMsg = dbMsg + ">>" + targetHeight + "px";
    var settVal = Math.round(targetHeight / baceHeight * 100);
    dbMsg = dbMsg + ",settVal=" + settVal + "%";
    tElement = tElement.replace('_scroll', '');
    dbMsg = dbMsg + ",tElement=" + tElement;
    myLog(dbMsg);
    document.getElementById(tElement + '_hight_parcent').value = settVal;
    dbMsg = dbMsg + "(sceneCut=" + sceneCut;
    var elemArray = reWrightElemenValue(sceneCut, tElement, 'hight', settVal, setType);
    var elemArray = reWrightElemenValue(sceneCut, tElement, 'vRows', vRows, setType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //文字数で高さ設定

/**
 * 現在の高さでエレメント高さの％指定
 * @param {*} tElement 
 */
function setHightNowElement(tElement) {
    var tag = "[setHightNowElement]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",書込み先=" + tElement;
    var idInfo = tElement.split('_');
    var vPosition = idInfo[0];
    var hPosition = idInfo[1];
    var setType = getElementPropaty(sceneCut, tElement, 'type');
    dbMsg = dbMsg + ";" + setType + ')';
    $('#' + tElement).css({ "height": "" });
    var trElement = tElement;
    if (setType === 'pict') {
        trElement = tElement + '_phot';
    } else if (setType === 'scroll') {
        trElement = tElement + '_scroll';
    }
    dbMsg = dbMsg + ",参照先=" + trElement;
    var tValse = getElementCoordinates(trElement);
    var targetX = tValse.x * 1;
    var targetY = tValse.y * 1;
    dbMsg = dbMsg + "(" + targetX + "," + targetY + ")";
    var targettWidth = tValse.width * 1;
    var targetHeight = tValse.height * 1;
    dbMsg = dbMsg + "[" + targettWidth + "×" + targetHeight + "]px";
    var moniterScale = getWindowScale("moniter_bace");
    dbMsg = dbMsg + "scale=" + moniterScale;
    targetHeight = targetHeight / moniterScale;
    dbMsg = dbMsg + ">>" + targetHeight + "px";
    var settVal = Math.round(targetHeight / baceHeight * 100);
    dbMsg = dbMsg + ",settVal=" + settVal + "%";
    document.getElementById(tElement + '_hight_parcent').value = settVal;
    dbMsg = dbMsg + "(sceneCut=" + sceneCut;
    var elemArray = reWrightElemenValue(sceneCut, tElement, 'hight', settVal, setType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //現在の高さでエレメント高さの％指定

/**
 * スクロールテキストの表示行数
 * @param {*} event 
 */
function higtByEm(event) {
    var tag = "[higtByEm]";
    var dbMsg = tag;
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var tElement = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",書込み先=" + tElement;
    var vRows = event.target.value;
    dbMsg = dbMsg + ",vRows=" + vRows;
    setHightEMBody(tElement, vRows);
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
} //スクロールテキストの表示行数

function hightSelect(event) {
    var tag = "[hightSelect]";
    var dbMsg = tag;
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var selectedIndex = event.target.selectedIndex;
    dbMsg = dbMsg + ",selectedIndex=" + selectedIndex;
    var idInfo = elementId.split('_');
    var tElement = idInfo[0] + "_" + idInfo[1] + '';
    dbMsg = dbMsg + ",書込み先=" + tElement;
    // winScale = getWindowScale(backBord);
    // dbMsg = dbMsg + ",winScale=" + winScale;
    switch (selectedIndex) { //0;上記のまま  1;底辺まで伸ばす   2;行数指定  3;現在の高さ
        case 0:
            break;
        case 1:
            dbMsg = dbMsg + ",下エレメントまで伸ばす";
            setHight2Bottom(tElement);
            break;
        case 2:
            dbMsg = dbMsg + ",現在の高さで記録";
            setHightNowElement(tElement);
            break;
        case 3:
            dbMsg = dbMsg + ",行数指定";
            setHightEM(tElement);
            break;
    }
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
        console.log(cutArray[nextSC]);
    }
    // writeThisCut(cutArray[nextSC])
} //エレメント高さのpx指定
//背景設定//////////////////////////////////////////////////////////////////////////////////////
/**
 * 壁紙Souceの更新
 * @param {*} event 
 */
function wallSouceChange(event) {
    var tag = "[wallSouceChange]";
    var dbMsg = tag;
    var eventElement = event.target;
    nowEditType = 'wall';
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",書込み先=" + wrId;
    var setVal = event.target.value + '';
    dbMsg = dbMsg + ",setVal=" + setVal;
    var elemArray;
    if (setVal === '') {
        var res = confirm(sceneCut + "の背景設定を削除します。");
        if (res == true) { // OKなら削除
            elemArray = delFromElementArray(sceneCut, 'wall')
        } else {
            elemArray = reWrightElemenValue(sceneCut, 'wall', 'souce', setVal, 'wall');
        }
    } else {
        elemArray = reWrightElemenValue(sceneCut, 'wall', 'souce', setVal, 'wall');
    }
    wallSrc = setVal;
    wallOpacity = 0.5;
    dbMsg = dbMsg + ",wallSrc=" + wallSrc + ",wallOpacity=" + wallOpacity;
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
        console.log(elemArray);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //壁紙Souceの更新

var findFile = '';
/**
 * 背景のソースファイル変更
 * @param {*} event 
 * fileAPI          //http://hakuhin.jp/js/blob_url_scheme.html
 * fileAPI以前     //http://so-zou.jp/web-app/tech/programming/javascript/file/file-api/
 */
function wallUrlChange(event) {
    var tag = "[wallUrlChange]";
    var dbMsg = tag;
    var eventElement = event.target;
    nowEditType = 'wall';
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",書込み先=" + wrId;
    findFile = event.target.value;
    dbMsg = dbMsg + ",findFile=" + findFile;
    var file = event.target.files[0];
    var blob_url = window.URL.createObjectURL(file); //http://hakuhin.jp/js/blob_url_scheme.html
    dbMsg = dbMsg + ",blob_url=" + blob_url;
    // dbMsg = dbMsg + " , webkitRelativePath=" + file.webkitRelativePath;
    //file:///C:/Users/%E5%8D%9A%E8%87%A3/Pictures/%E5%BF%83%E3%81%AB%E9%9F%BF%E3%81%8F%20Wedding%E3%83%95%E3%82%A9%E3%83%88%E3%83%A0%E3%83%BC%E3%83%93%E3%83%BC/%E3%82%A4%E3%83%A9%E3%82%B9%E3%83%88/WA01_012L.jpg
    // file:///C:/Users/博臣/Pictures/心に響く Weddingフォトムービー/イラスト/
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    // window.requestFileSystem(window.TEMPORARY, 1024 * 1024 * 1024 /*1GB*/ , onInitFs, errorHandler); //TEMPORARY を使用して保存したデータは、ブラウザの裁量で（空き容量が必要な場合など）削除できます。https://www.html5rocks.com/ja/tutorials/file/filesystem/
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 1024, function(grantedBytes) {
        var tag = "[requestQuota] ";
        var dbMsg = tag;
        dbMsg = dbMsg + 'grantedBytes=' + grantedBytes;
        // window.webkitRequestFileSystem(window.PERSISTENT, grantedBytes, onInitFs, onError); //onError
        window.webkitRequestFileSystem(window.PERSISTENT, grantedBytes, function(fs) {
            if (debug_now == true) {
                // console.log('webkitRequestFileSystem: ', arguments); // I see this on Chrome 27 in Ubuntu
                console.log('webkitRequestFileSystem: fs', fs);
                console.log('webkitRequestFileSystem: ', findFile);
            }
            fs.root.getFile(findFile.replace(), {}, function(fileEntry) {
                fileEntry.file(function(file) {
                    var reader = new FileReader();
                    reader.onloadend = function(e) {
                        if (debug_now == true) {
                            console.log('getFile: ', e); // true
                            console.log('getFile: ', this.result);
                        }
                    };
                    console.log('getFile: ', blob_url);
                    reader.readAsDataURL(blob_url);
                    // reader.readAsText(file);
                }, onError);

                // fs.root.getFile(findFile, { create: false, exclusive: true }, function(fileEntry) { // getFile の第2引数で { create: true, exclusive: true }を付けるとファイルを新規作成する。
                //     if (debug_now == true) {
                //         console.log('getFile: ', fileEntry.isFile); // true
                //         console.log('getFile: ', fileEntry.name); // log.txt 
                //         console.log('getFile: ', fileEntry.fullPath); // /log.txt 
                //     }
                // }, onError);
            }, onError); //onError
        }, onError); //onError
        if (debug_now == true) {
            console.log('requestQuota: ', arguments);
        }
    }, onError);

    var elemArray = reWrightElemenValue(sceneCut, 'wall', 'souce', blob_url, 'wall');
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
        console.log(file); //.webkitRelativeP//
    }
    makeCutArray(elemArray);
} //背景のソースファイル変更

/****
 * 背景のエディタ画面反映
 */
function setWallMoniter() {
    var tag = "[setWallMoniter]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",wallSrc=" + wallSrc + ",wallOpacity=" + wallOpacity;
    document.getElementById('scp_wall_url').innerHTML = wallSrc; //textarea

    // var moniWidth = $('#scp_wall_div').outerWidth(true); //サムネイルのIMGタグ
    // // var moniWidth = document.getElementById('scp_wall_div').clientWidth; //サムネイルのIMGタグ
    // var wW = window.parent.screen.width;
    // var wH = window.parent.screen.height;
    // var moniHeight = (moniWidth / wW * wH);
    // if (wW < wH) {
    //     moniHeight = (moniWidth / wH * wW);
    // }
    // dbMsg = dbMsg + ",moni[" + moniWidth + "×" + moniHeight + "]";
    // document.getElementById('scp_wall_div').style.height = moniHeight + 'px';
    // document.getElementById('scp_wall_src').style.display = 'none';
    if (wallSrc.match('#')) {
        setElementBGColor('scp_wall_div', wallSrc);
        document.getElementById('scp_wall_color').value = wallSrc;
    } else if (wallSrc === '') {
        document.getElementById('scp_wall_src').src = 'img/white.png'; //img
        // setElementBGColor('scp_wall_div', '#ffffff');
    } else {
        document.getElementById('scp_wall_src').style.display = 'inline-block;';
        document.getElementById('scp_wall_src').src = wallSrc; //img
    }
    document.getElementById('scp_wall_div').style.opacity = wallOpacity;
    if (document.getElementById('back_bord')) {
        document.getElementById('back_bord').style.opacity = 1;
    }
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(document.getElementById('scp_wall_div'));
    }
} //背景のエディタ画面反映

/**
 * 背景を単色に設定
 * @param {*} event 
 */
function wallColorSet(event) {
    var tag = "[wallColorSet]";
    var dbMsg = tag;
    nowEditType = 'wall';
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1] + '_src'; //id=scp_wall_color,書込み先=scp_wall
    dbMsg = dbMsg + ",書込み先=" + wrId;
    wallSrc = event.target.value;
    dbMsg = dbMsg + ",wallSrc=" + wallSrc;
    var elemArray = reWrightElemenValue(sceneCut, 'wall', 'souce', wallSrc, 'wall');
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //背景を単色に設定

/**
 * 背景の透明度変更
 * @param {*} event 
 */
function wallOpacitySet(event) {
    var tag = "[wallColorSet]";
    var dbMsg = tag;
    nowEditType = 'wall';
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1] + '_src'; //id=scp_wall_color,書込み先=scp_wall
    dbMsg = dbMsg + ",書込み先=" + wrId;
    wallOpacity = event.target.value;
    dbMsg = dbMsg + ",wallOpacity=" + wallOpacity;
    var elemArray = reWrightElemenValue(sceneCut, 'wall', 'opacity', wallOpacity, 'wall');
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //背景の透明度変更

//文字要素設定////////////////////////////////////////////////////////////////////////////////////背景設定//
/**
 * 文章変更
 * @param {*} event 
 */
function souceChange(event) {
    var tag = "[souceChange]";
    var dbMsg = tag;
    nowEditType = 'text';
    var eventElement = event.target;
    var elementName = eventElement.getAttribute('name');
    dbMsg = dbMsg + ",Name=" + elementName; // this>>obj だと obj.getAttribute('name'); //event.srcElement,target,toElementはspanタグ,divはundefined,event.path[0]などはタグ
    var elementClass = eventElement.getAttribute('class');
    dbMsg = dbMsg + ",Class=" + elementClass;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var setVal = eventElement.value;
    dbMsg = dbMsg + ",内容=" + setVal;
    var idInfo = elementId.split('_');
    var tElement = idInfo[0] + "_" + idInfo[1];
    tElement = tElement.replace('scp_', '');
    if (tElement === 'audio') {
        tElement = 'audio';
    }
    dbMsg = dbMsg + ",tElement=" + tElement;
    var rStrs = elementId.split('_');
    var baceElement = rStrs[0] + "_" + rStrs[1] + '';
    dbMsg = dbMsg + ",baceElement=" + baceElement;
    var tType = getElementType(sceneCut, tElement);
    dbMsg = dbMsg + ",tType=" + tType;
    if (tType === 'text' || tType === 'scroll') { //['audio', 'layout', 'wall', 'text', 'pict', 'scroll', 'move'];
        targetCutArray[baceElement].souce = setVal;
        setVal = cr2br(setVal);
        document.getElementById(tElement).innerHTML = setVal; //モニター更新
    } else if (tType === 'audio') {
        //      element:"audio"     type:"audio"
    }
    // reWrightElemenData(baceElement, 'souce', setVal); //データ更新
    var elemArray = reWrightElemenValue(sceneCut, tElement, 'souce', setVal, tType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //文章変更

/**
 *和文/英雲変更
 * @param {*} event 
 */
function fontTypeChange(event) {
    var tag = "[fontTypeChange]";
    var dbMsg = tag;
    var eventElement = event.target;
    nowEditType = 'text';
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",書込み先=" + wrId;
    var eventSelectedIndex = eventElement.selectedIndex;
    dbMsg = dbMsg + ",SelectedIndex=" + eventSelectedIndex;
    var setVal = eventElement.children[eventSelectedIndex].style.fontFamily; //eventElement.value; //eventSelectedIndex + 1;
    dbMsg = dbMsg + ",setVal=" + setVal;
    // var fontFamily = false;
    // if (selectVal.match('Great Vibes') || eventSelectedIndex == 0) {
    //     fontFamily = true;
    // }
    // dbMsg = dbMsg + ",選択値=" + fontFamily;
    var rStrs = elementId.split('_');
    var baceElement = rStrs[0] + "_" + rStrs[1] + '';
    dbMsg = dbMsg + ",baceElement=" + baceElement;
    var setType = getElementPropaty(sceneCut, wrId, 'type');
    dbMsg = dbMsg + ",setType=" + setType;
    var elemArray = reWrightElemenValue(sceneCut, wrId, 'fontFamily', setVal, setType); //font-family
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
}

function fontReSize(event) {
    var tag = "[fontReSize]";
    var dbMsg = tag;
    nowEditType = 'text';
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",書込み先=" + wrId;
    var settVal = event.target.value;
    dbMsg = dbMsg + ",settVal=" + settVal + "pt";
    dbMsg = dbMsg + "(" + nextSC + ')';
    // var souce = getSouceOfElement(wrId);
    // dbMsg = dbMsg + ",souce=" + souce;
    // myLog(dbMsg);
    dbMsg = dbMsg + "(" + nextSC + ')';
    setFontSizePx(wrId, settVal); //モニター更新☆強制書き換えの為、戻り値を取らない    souce
    dbMsg = dbMsg + ">>" + settVal + 'pt';
    dbMsg = dbMsg + ",sceneCut=" + sceneCut;
    var setType = getElementPropaty(sceneCut, wrId, 'type');
    dbMsg = dbMsg + ",setType=" + setType;
    var elemArray = reWrightElemenValue(sceneCut, wrId, 'fontSize', settVal, setType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
    // reWrightElemenData(wrId, 'fontSize', settVal); //データ更新
} //指定したエレメントのフォントサイズをpt値で設定（10pt以上の数値）

/**
 * 指定したエレメントのフォントサイズをpt値で設定（10pt以上の数値）
 * @param {*} event 
 */
function fontSizeChangePx(event) {
    var tag = "[fontSizeChangePx]";
    var dbMsg = tag;
    nowEditType = 'text';
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",書込み先=" + wrId;
    var settVal = event.target.value;
    dbMsg = dbMsg + ",settVal=" + settVal + "pt";
    dbMsg = dbMsg + "(" + nextSC + ')';
    // var souce = getSouceOfElement(wrId);
    // dbMsg = dbMsg + ",souce=" + souce;
    // myLog(dbMsg);
    dbMsg = dbMsg + "(" + nextSC + ')';
    setFontSizePx(wrId, settVal); //モニター更新☆強制書き換えの為、戻り値を取らない    souce
    dbMsg = dbMsg + ">>" + settVal + 'pt';
    dbMsg = dbMsg + ",sceneCut=" + sceneCut;
    var setType = getElementPropaty(sceneCut, wrId, 'type');
    dbMsg = dbMsg + ",setType=" + setType;
    var elemArray = reWrightElemenValue(sceneCut, wrId, 'fontSize', settVal, setType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //指定したエレメントのフォントサイズをpt値で設定（10pt以上の数値）

/**
 * 指定したエレメントのフォントサイズを最大フォントサイズからの%で設定（小数から10未満の数値）
 * @param {*} event 
 */
function fontSizeChangeParcent(event) {
    var tag = "[fontSizeChangeParcent]";
    var dbMsg = tag;
    nowEditType = 'text';
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    // document.getElementById('elementId').blur() //フォーカスを外す
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",書込み先=" + wrId;
    var settVal = event.target.value / 100;
    dbMsg = dbMsg + ",settVal=" + settVal + "%";

    settVal = setFontSizeParcent(wrId, settVal); //モニター更新
    dbMsg = dbMsg + ">>" + settVal + 'pt';
    dbMsg = dbMsg + ",sceneCut=" + sceneCut;
    var setType = getElementPropaty(sceneCut, wrId, 'type');
    dbMsg = dbMsg + ",setType=" + setType;
    var elemArray = reWrightElemenValue(sceneCut, wrId, 'fontSize', settVal, setType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    makeCutArray(elemArray);
    // reWrightElemenData(wrId, 'fontSize', settVal); //データ更新
} //指定したエレメントのフォントサイズを最大フォントサイズからの%で設定（小数から10未満の数値）

function fontSizeChange(event) {
    var tag = "[fontSizeChange]";
    var dbMsg = tag;
    nowEditType = 'text';
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var selectedIndex = event.target.selectedIndex;
    dbMsg = dbMsg + ",selectedIndex=" + selectedIndex;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1] + '';
    dbMsg = dbMsg + ",書込み先=" + wrId;
    winScale = getWindowScale(backBord);
    dbMsg = dbMsg + ",winScale=" + winScale;
    var nowSetting = document.defaultView.getComputedStyle(document.getElementById(wrId), null).fontSize; //http://freefielder.jp/blog/2013/01/javascript-ie-8-fontsize-in-px.html
    dbMsg = dbMsg + ",元設定(実設定)=" + nowSetting;
    nowSetting = nowSetting.replace('pt', '');
    nowSetting = nowSetting.replace('px', '') * 1;
    nowSetting = Math.round(nowSetting); //四捨五入
    if (0 < nowSetting) {
        nowSetting = nowSetting / winScale;
    } else {
        nowSetting = 24 / winScale;
    }
    nowSetting = Math.round(nowSetting);
    dbMsg = dbMsg + ">縮小補正>" + nowSetting;
    var settVal = event.target.value * 1;
    dbMsg = dbMsg + ",settVal=" + settVal + "番目";
    $('#' + wrId + '_text_edit_font_size_parcent').css({ "display": "none" });
    $('#' + wrId + '_text_edit_font_size_unit').css({ "display": "none" });
    // $('#' + wrId + '_font_re_size').css({ "display": "" }); //   document.getElementById(wrId + "_font_re_size").style.display = 'inline';
    switch (selectedIndex) { //1;fit /2;% /
        case 0:
            // $('#' + wrId + '_text_edit_font_size_parcent').css({ "display": "none" });
            // $('#' + wrId + '_text_edit_font_size_unit').css({ "display": "inline-block" });
            // document.getElementById(wrId + '_text_edit_font_size_unit').innerHTML = 'pt';
            break;
        case 1:
            var souce = getSouceOfElement(wrId);
            var fontReSize = setfontSizeFit(wrId, souce);
            // fontReSize = Math.round(fontReSize - 0.5); //切り捨て
            dbMsg = dbMsg + ",sceneCut=" + sceneCut;
            var setType = getElementPropaty(sceneCut, wrId, 'type');
            dbMsg = dbMsg + ",setType=" + setType + "=" + fontReSize + "pt";
            var elemArray = reWrightElemenValue(sceneCut, wrId, 'fontSize', fontReSize, setType);
            makeCutArray(elemArray);
            window.location.reload(); //再読み込み
            break;
        case 2:
            var maxFontSize = getMaxfontSize();
            dbMsg = dbMsg + ",maxFontSize=" + maxFontSize;
            var parcentFS = Math.round(nowSetting / maxFontSize * 100);
            dbMsg = dbMsg + ",parcentFS=" + parcentFS + "%";
            $('#' + wrId + '_text_edit_font_size_parcent').css({ "display": "inline-block" });
            document.getElementById(wrId + '_text_edit_font_size_parcent').value = parcentFS;
            $('#' + wrId + '_text_edit_font_size_unit').css({ "display": "inline-block" });
            // document.getElementById(wrId + '_text_edit_font_size_unit').innerHTML = '%';
            break;
    }
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
}

function fontColorSet(event) {
    var tag = "[fontColorSet]";
    var dbMsg = tag;
    nowEditType = 'text';
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",書込み先=" + wrId;
    var setVal = event.target.value;
    setFontColor(wrId, setVal); //モニター更新
    var setType = getElementPropaty(sceneCut, wrId, 'type');
    dbMsg = dbMsg + ",setType=" + setType;
    var elemArray = reWrightElemenValue(sceneCut, wrId, 'fontColor', setVal, setType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
}

function fontBGColor(event) {
    var tag = "[fontBGColor]";
    var dbMsg = tag;
    setType = 'text';
    var eventElement = event.target;
    // var elementName = eventElement.getAttribute('name');
    // dbMsg = dbMsg + ",Name=" + elementName; // this>>obj だと obj.getAttribute('name'); //event.srcElement,target,toElementはspanタグ,divはundefined,event.path[0]などはタグ
    // var elementClass = eventElement.getAttribute('class');
    // dbMsg = dbMsg + ",Class=" + elementClass;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",書込み先=" + wrId;
    var settVal = event.target.value;
    setElementBGColor(wrId, settVal); //モニター更新
    var setType = getElementPropaty(sceneCut, wrId, 'type');
    dbMsg = dbMsg + ",setType=" + setType;
    var elemArray = reWrightElemenValue(sceneCut, wrId, 'bgColor', settVal, setType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
}

function fontBGTrance(event) {
    var tag = "[fontBGTrance]";
    var dbMsg = tag;
    nowEditType = 'text';
    var eventElement = event.target;
    // var elementName = eventElement.getAttribute('name');
    // dbMsg = dbMsg + ",Name=" + elementName; // this>>obj だと obj.getAttribute('name'); //event.srcElement,target,toElementはspanタグ,divはundefined,event.path[0]などはタグ
    // var elementClass = eventElement.getAttribute('class');
    // dbMsg = dbMsg + ",Class=" + elementClass;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",書込み先=" + wrId;
    var settVal = event.target.checked;
    dbMsg = dbMsg + ",settVal=" + settVal;
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
    if (settVal == true) {
        setElementBGColor(wrId, '-1'); //モニター更新
        var setType = getElementPropaty(sceneCut, wrId, 'type');
        dbMsg = dbMsg + ",setType=" + setType;
        var elemArray = reWrightElemenValue(sceneCut, wrId, 'bgColor', '-1', setType);
        myLog(dbMsg);
        if (debug_now == true) {
            // console.log(elemArray);
            // console.log(event);
        }
        makeCutArray(elemArray);
        window.location.reload(); //再読み込み
        // document.getElementById(wrId + "_text_edit_font_backgrand").disabled = true;
    } else {
        // document.getElementById(wrId + "_text_edit_font_backgrand").disabled = false;
    }

}

//スクロールテキスト設定////////////////////////////////////////////////文字要素設定//
/**
 * スクロールテキストの移動速度
 * @param {*} event 
 */
function scrollSpeedSet(event) {
    var tag = "[scrollSpeedSet]";
    var dbMsg = tag;
    nowEditType = 'scroll';
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",書込み先=" + wrId;
    var settVal = event.target.value;
    dbMsg = dbMsg + ",settVal=" + settVal;
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
    reWrightElemenData(wrId, 'scrollSpead', settVal); //データ更新
} //スクロールテキストの移動速度

/**
 * スクロールテキストの稼働テスト
 * @param {*} event 
 */
function scrollTest(event) {
    var tag = "[scrollTest]";
    var dbMsg = tag;
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",読み込み=" + wrId;
    var settVal = targetCutArray[wrId].scrollSpead * 1; //event.target.value;
    dbMsg = dbMsg + ",settVal=" + settVal;
    scrollT = wrId + '_scroll'; ////
    dbMsg = dbMsg + ",書込み先=" + scrollT;
    scrollY = 0;
    dbMsg = dbMsg + ",scrollTop=" + document.getElementById(scrollT).scrollTop;
    document.getElementById(scrollT).scrollTop = 0;
    dbMsg = dbMsg + ">>" + document.getElementById(scrollT).scrollTop;
    stayTime = 0;
    nextFunction = null;
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
    vScroll(); //settVal
} //スクロールテキストの稼働テスト

//画像設定////////////////////////////////////////////////スクロールテキスト設定//

/**
 * リソースファイルの選択
 * @param {*} event 
 */
function resoceUrlChange(event) {
    var tag = "[resoceUrlChange]";
    var dbMsg = tag;
    nowEditType = 'pict';
    var eventElement = event.target;
    var elementName = eventElement.getAttribute('name');
    dbMsg = dbMsg + ",Name=" + elementName;
    var elementClass = eventElement.getAttribute('class');
    dbMsg = dbMsg + ",Class=" + elementClass;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var settVal = eventElement.value * 1; //eventSelectedIndex + 1;
    dbMsg = dbMsg + ",settVal=" + settVal;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1] + "_scroll";
    dbMsg = dbMsg + ",書込み先=" + wrId;
    var rStrs = elementId.split('_');
    var baceElement = rStrs[0] + "_" + rStrs[1] + '';
    dbMsg = dbMsg + ",baceElement=" + baceElement;
    // targetCutArray[baceElement].souce = settVal;
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
    //モニター更新
    reWrightElemenData(wrId, 'souce', settVal); //データ更新

} //リソースファイルの選択

/**
 * 画像エリアに隙間がある場合に寄せる方向
 * @param {*} event 
 */
function ptAline(event) {
    var tag = "[ptAline]";
    var dbMsg = tag;
    var eventElement = event.target;
    var elementName = eventElement.getAttribute('name');
    dbMsg = dbMsg + ",Name=" + elementName; // this>>obj だと obj.getAttribute('name'); //event.srcElement,target,toElementはspanタグ,divはundefined,event.path[0]などはタグ
    var elementClass = eventElement.getAttribute('class');
    dbMsg = dbMsg + ",Class=" + elementClass;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var alignNo = 0;
    var rStrs = elementId.split('_');
    var wrId = rStrs[0] + "_" + rStrs[1] + '';
    dbMsg = dbMsg + ",wrId=" + wrId;
    var rObj = targetCutArray[wrId];
    var motoSetting = rObj.align;
    dbMsg = dbMsg + ",元align=" + motoSetting;
    // myLog(dbMsg);
    // if (debug_now == true) {
    //     console.log(rObj);
    // }
    var vAlign = 0;
    var hAlign = 0;
    if (9 == motoSetting) {
        vAlign = 0;
    } else if (6 <= motoSetting) {
        vAlign = 6; //bottom
        hAlign = motoSetting - 6;
    } else if (3 <= motoSetting) {
        vAlign = 3; //top
        hAlign = motoSetting - 3;
    }
    dbMsg = dbMsg + ",vAlign=" + vAlign;
    if (elementId.match('pos_left')) {
        hAlign = 1;
    } else if (elementId.match('pos_center')) {
        hAlign = 0;
    } else if (elementId.match('pos_right')) {
        hAlign = 2;
    }
    dbMsg = dbMsg + ",hAlign=" + hAlign;
    if (elementId.match('pos_top')) {
        alignNo = hAlign + 3;
    } else if (elementId.match('pos_mid')) {
        alignNo = hAlign;
    } else if (elementId.match('pos_bottom')) {
        alignNo = hAlign + 6;
    } else {
        alignNo = hAlign;
    }
    if (elementId.match('pos_justify')) {
        alignNo = 9;
    }
    dbMsg = dbMsg + ",alignNo=" + alignNo;
    // targetCutArray[wrId].align = alignNo;
    // myLog(dbMsg);
    if (debug_now == true) {
        // console.log(eventElement);
    }
    setAlineBtn(elementName);
    if (elementId.match('_pict_')) {
        setPictAline(elementId, alignNo);
    } else if (elementId.match('_text_')) {
        setfontAline(wrId, alignNo);
    }
    //モニター更新
    // reWrightElemenData(baceElement, 'align', alignNo); //データ更新
    var setType = getElementPropaty(sceneCut, wrId, 'type');
    dbMsg = dbMsg + ",setType=" + setType;
    var elemArray = reWrightElemenValue(sceneCut, wrId, 'align', alignNo, setType);
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(rObj);
        // console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //画像エリアに隙間がある場合に寄せる方向

/**
 * 画像の透明度
 * @param {*} event 
 */
function pictOpt(event) {
    var tag = "[pictOpt]";
    var dbMsg = tag;
    nowEditType = 'pict';
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var settVal = eventElement.value * 1; //eventSelectedIndex + 1;
    dbMsg = dbMsg + ",settVal=" + settVal;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1];
    dbMsg = dbMsg + ",書込み先=" + wrId;
    // var baceElement = rStrs[0] + "_" + rStrs[1] + '';
    // dbMsg = dbMsg + ",baceElement=" + baceElement;
    // document.getElementById(wrId).opacity = settVal;
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
    // setPictOpt(wrId, settVal); //モニター更新
    reWrightElemenData(wrId, 'opacity', settVal); //データ更新
} //画像の透明度

/**
 * 画像の縮小率
 * @param {*} event 
 */
function picScale(event) {
    var tag = "[picScale]";
    var dbMsg = tag;
    nowEditType = 'pict';
    var eventElement = event.target;
    // var elementName = eventElement.getAttribute('name');
    // dbMsg = dbMsg + ",Name=" + elementName;
    // var elementClass = eventElement.getAttribute('class');
    // dbMsg = dbMsg + ",Class=" + elementClass;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var setVal = eventElement.value * 1; //eventSelectedIndex + 1;
    dbMsg = dbMsg + ",setVal=" + setVal;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1]; // + "_phot";
    dbMsg = dbMsg + ",書込み先=" + wrId;
    var setType = getElementPropaty(sceneCut, wrId, 'type');
    dbMsg = dbMsg + ",setType=" + setType;
    var elemArray = reWrightElemenValue(sceneCut, wrId, 'scale', setVal, setType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //画像の縮小率

/**
 * 枠線の太さ
 * @param {*} event 
 */
function borderWidth(event) {
    var tag = "[borderWidth]";
    var dbMsg = tag;
    nowEditType = 'pict';
    var eventElement = event.target;
    var elementName = eventElement.getAttribute('name');
    dbMsg = dbMsg + ",Name=" + elementName;
    var elementClass = eventElement.getAttribute('class');
    dbMsg = dbMsg + ",Class=" + elementClass;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var setVal = event.target.value * 1; //eventElement.value * 1; //eventSelectedIndex + 1;
    dbMsg = dbMsg + ",setVal=" + setVal;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1]; // + "_scroll";
    dbMsg = dbMsg + ",書込み先=" + wrId;
    var setType = getElementPropaty(sceneCut, wrId, 'type');
    dbMsg = dbMsg + ",setType=" + setType;
    var elemArray = reWrightElemenValue(sceneCut, wrId, 'fleamWidth', setVal, setType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み
} //枠線の太さ

/**
 * 枠線の色
 * @param {*} event 
 */
function borderColor(event) {
    var tag = "[borderColor]";
    var dbMsg = tag;
    nowEditType = 'pict';
    var eventElement = event.target;
    var elementName = eventElement.getAttribute('name');
    dbMsg = dbMsg + ",Name=" + elementName;
    var elementClass = eventElement.getAttribute('class');
    dbMsg = dbMsg + ",Class=" + elementClass;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    var setVal = event.target.value; //eventSelectedIndex + 1;
    dbMsg = dbMsg + ",setVal=" + setVal;
    var idInfo = elementId.split('_');
    var wrId = idInfo[0] + "_" + idInfo[1]; // + "_scroll";
    dbMsg = dbMsg + ",書込み先=" + wrId;
    var setType = getElementPropaty(sceneCut, wrId, 'type');
    dbMsg = dbMsg + ",setType=" + setType;
    var elemArray = reWrightElemenValue(sceneCut, wrId, 'fleamColor', setVal, setType);
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elemArray);
        // console.log(event);
    }
    makeCutArray(elemArray);
    window.location.reload(); //再読み込み

} //枠線の太さ

//編集エレメント共用////////////////////////////////////////////////画像設定//

/**
 * nameでグループ化されたボタンのacvtivを全解除
 * @param {*} elementName 
 */
function bottomGrReActive(targetName) {
    var tag = "[bottomGrReActive]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",targetName=" + targetName;
    var sameNames = document.getElementsByName(targetName);
    // console.log(sameNames);
    if (sameNames) {
        dbMsg = dbMsg + ",同じName=" + sameNames.length + "件";
        for (var i = 0; i < sameNames.length; i++) {
            dbMsg = dbMsg + "\n(" + i + ")";
            var obj = sameNames[i];
            // console.log(obj);
            // var checkElement = document.getElementById(elementName);
            if (obj.classList) {
                var elmID = obj.id;
                dbMsg = dbMsg + elmID;
                dbMsg = dbMsg + ",設定してあるclass=" + obj.classList.length + "件";
                var retStr = '';
                for (var j = 0; j < obj.classList.length; j++) {
                    dbMsg = dbMsg + "(" + j + ")";
                    var testStr = obj.classList[j];
                    dbMsg = dbMsg + testStr;
                    if (!testStr.match("active")) {
                        retStr = retStr + ' ' + testStr;
                    } else {
                        dbMsg = dbMsg + '削除対象';
                    }
                }
                document.getElementById(elmID).setAttribute('class', retStr);
            }
        }
    }
    // myLog(dbMsg);
    // if (debug_now == true) {
    //     console.log(sameNames);
    // }
} //nameでグループ化されたボタンのacvtivを全解除

/**
 * 指定されたnameGr中で選択されたボタンをActiveに設定する
 * @param {*} elementId _text_alignもしくは_pict_alignまでを指定
 */
function setAlineBtn(elementId) {
    var tag = "[setAlineBtn]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",id=" + elementId;
    var alignNo = 0;
    var rStrs = elementId.split('_');
    var baceElement = rStrs[0] + "_" + rStrs[1] + '';
    dbMsg = dbMsg + ",baceElement=" + baceElement;
    var targetName = baceElement + "_" + rStrs[2] + '';
    dbMsg = dbMsg + ",targetName=" + targetName;
    bottomGrReActive(targetName + "_" + rStrs[3]);
    // myLog(dbMsg);
    var rObj;
    if (elementId.match('fix_')) {
        rObj = targetCutArray['scene'][baceElement];
    } else {
        rObj = targetCutArray[baceElement];
    }
    var motoSetting = rObj.align;
    dbMsg = dbMsg + ",元align=" + motoSetting;
    var vAlign = 0;
    var hAlign = 0;
    var motoClass = '';
    // myLog(dbMsg);
    if (9 == motoSetting) {
        motoClass = document.getElementById(targetName + '_valign_pos_mid').getAttribute('class');
        document.getElementById(targetName + '_valign_pos_mid').setAttribute('class', motoClass + ' active');
        hAlign = 9;
    } else if (6 <= motoSetting) {
        motoClass = document.getElementById(targetName + '_valign_pos_bottom').getAttribute('class');
        document.getElementById(targetName + '_valign_pos_bottom').setAttribute('class', motoClass + ' active');
        vAlign = 6; //bottom
        hAlign = motoSetting - 6;
    } else if (3 <= motoSetting) {
        motoClass = document.getElementById(targetName + '_valign_pos_top').getAttribute('class');
        document.getElementById(targetName + '_valign_pos_top').setAttribute('class', motoClass + ' active');
        vAlign = 3; //top
        hAlign = motoSetting - 3;
    } else {
        hAlign = motoSetting;
    }
    dbMsg = dbMsg + ",vAlign=" + vAlign + ",hAlign=" + hAlign;
    if (hAlign == 1) {
        motoClass = document.getElementById(targetName + '_align_pos_left').getAttribute('class');
        document.getElementById(targetName + '_align_pos_left').setAttribute('class', motoClass + ' active');
    } else if (hAlign == 0) {
        motoClass = document.getElementById(targetName + '_align_pos_center').getAttribute('class');
        document.getElementById(targetName + '_align_pos_center').setAttribute('class', motoClass + ' active');
    } else if (hAlign == 2) {
        motoClass = document.getElementById(targetName + '_align_pos_right').getAttribute('class');
        document.getElementById(targetName + '_align_pos_right').setAttribute('class', motoClass + ' active');
    } else if (hAlign == 9) {
        motoClass = document.getElementById(targetName + '_align_pos_justify').getAttribute('class');
        document.getElementById(targetName + '_align_pos_justify').setAttribute('class', motoClass + ' active');
    }
    // myLog(dbMsg);
} //指定されたnameGr中で選択されたボタンをActiveに設定する

function elementDisp(noneElms, nd) {
    var tag = "[elementDisp]";
    var dbMsg = tag + "nd=" + nd;
    for (i = 0; i < noneElms.length; i++) {
        dbMsg = dbMsg + '(' + i + ')';
        var nonElement = noneElms[i];
        nonElement.style.display = nd;
    }
    myLog(dbMsg);
}

$(function() {
    $('[data-toggle=" tooltip "]').tooltip();
})

$(function() {
        $('.dropdown-menu a').click(function() {
            //反映先の要素名を取得
            var visibleTag = $(this).parents('ul').attr('visibleTag');
            var hiddenTag = $(this).parents('ul').attr('hiddenTag');
            //選択された内容でボタンの表示を変える
            $(visibleTag).html($(this).attr('value'));
            //選択された内容でhidden項目の値を変える
            $(hiddenTag).val($(this).attr('value'));
        })
    }) //http://doop-web.com/blog/archives/1064

/**
 * 1カット分のデータ書き込みとIFの設定
 * @param {*} eCutArray 
 */
function writeThisCut(eCutArray) {
    var tag = "[edit.writeThisCut]";
    var dbMsg = tag + "scene_cut=" + sceneCut;
    targetCutArray = $.extend(true, {}, eCutArray); //配列コピー
    dbMsg = dbMsg + ",cutArray=" + Object.keys(eCutArray).length + "件";
    var leftVa;
    var elmId = '';
    var retValse = getElementCoordinates('left_element');
    var leftElementX = retValse.x * 1;
    var leftElementY = retValse.y * 1;
    dbMsg = dbMsg + "leftElement(" + leftElementX + "," + leftElementY + ")";
    var leftElementWidth = retValse.width * 1;
    var leftElementHeight = retValse.height * 1;
    dbMsg = dbMsg + "[" + leftElementWidth + "×" + leftElementHeight + "]px";
    //   backBord = 'moniter_bace';
    dbMsg = dbMsg + ",backBord=" + backBord;
    retValse = getElementCoordinates('moniter_bace');
    var baceX = retValse.x * 1;
    var baceY = retValse.y * 1 - leftElementY;
    dbMsg = dbMsg + "(" + baceX + "," + baceY + ")";
    var retWidth = retValse.width * 1;
    var eHeight = retValse.height * 1;
    dbMsg = dbMsg + "[" + retWidth + "×" + eHeight + "]px";
    document.getElementById('moniter_row').style.width = targetDisplayWidth + 'px'; //-webkit-transform: scale(0.9);
    baceWidth = targetDisplayWidth; //$('#moniter_bace').outerWidth(); //canvas_bace
    // baceHeight = document.getElementById('#moniter_bace').outerHeight(true);//この時点では0
    baceHeight = targetDisplayHight * winScale; //baceWidth / targetDisplayWidth * targetDisplayHight;
    dbMsg = dbMsg + ",モニター[" + baceWidth + "×" + baceHeight + "]";
    var moniterScale = retWidth / baceWidth; //        getWindowScale("moniter_bace"); //"moniter_bace"      left_element
    dbMsg = dbMsg + "、moniterScale=" + moniterScale;
    winScale = 1; //moniterScale;
    document.getElementById('moniter_bace').style.height = baceHeight + "px";

    document.getElementById('control_img').style.width = (564.5 * winScale) + "px";
    document.getElementById('control_aria').style.width = baceWidth + "px";
    document.getElementById('control_aria').style.left = baceX + "px";
    document.getElementById('control_aria').style.top = controlAriaTop + "%"; //(baceY + baceHeight * 0.9)

    // var sceneCut = cutArray.scene_cut
    dbMsg = dbMsg + ",sceneCut=" + sceneCut;
    document.getElementById('scNoPanel').innerHTML = sceneCut + "     シーンプロパティ";
    var layout;
    if (eCutArray.scene.layout) {
        layout = eCutArray.scene.layout.souce;
    } else {
        layout = 'free';
    }
    dbMsg = dbMsg + ",レイアウト=" + layout;
    // myLog(dbMsg);
    // if (debug_now == true) {
    //     console.log(layout);
    // }
    document.setform.scp_layout_is_start.checked = "";
    if (eCutArray.layout) {
        document.setform.scp_layout_is_start.checked = true;
        document.getElementById('layout_add_bt').style.display = 'none';
        if (sceneCut === 's010c01') {
            document.getElementById('layout_del_bt').style.display = 'none';
        } else {
            document.getElementById('layout_del_bt').style.display = 'inline';
        }
    } else {
        // document.setform.scp_layout_is_start.checked = false;
        document.getElementById('layout_add_bt').style.display = 'inline';
        document.getElementById('layout_del_bt').style.display = 'none';
    }
    leftVar = 100;
    if (layout) {
        if (layout.match(':')) {
            document.getElementById('layout_lr').checked = "checked";
            document.getElementById('layout_lr_balance').style.display = 'inline-block'; //table-cell
            var retStr = layout.split(':');
            leftVar = retStr[0] * 1;
            dbMsg = dbMsg + ",左側=" + leftVar + '';
            $('#sayuu_hi').val(leftVar);
            // elementDisp(document.getElementsByName('center_edit'), 'none');
            setLRWidth(leftVar);
            document.getElementById('migi_hi').innerText = 100 - leftVar;
            isHDivide = true;
            // document.getElementsByName('row_sayuu_hi').style.display = 'none';
        } else {
            // document.getElementsByName('row_sayuu_hi').style.display = 'inline-block';
            document.getElementById('layout_free').checked = "checked";
            document.getElementById('layout_lr_balance').style.display = 'none';
            isHDivide = false;
            setLRWidth(100);
        }
        // } else {
        //     document.getElementById('layout_free').checked = "checked";
        //     document.getElementById('layout_lr_balance').style.display = 'none';
    }
    dbMsg = dbMsg + "、isHDivide=" + isHDivide;
    wallSrc = '#ffffff'; //このカットから始まる壁紙
    wallOpacity = 0;
    wallalign = 0;
    document.setform.scp_wall_is_start.checked = "";
    if (eCutArray.wall) {
        wallSrc = eCutArray.wall.souce + ''; //このカットから始まる壁紙
        wallOpacity = eCutArray.wall.opacity * 1; //scene_wall_opacity
        wallalign = eCutArray.wall.align; //scene_wall_align
        document.setform.scp_wall_is_start.checked = true;
        document.getElementById('wall_add_bt').style.display = 'none';
        if (sceneCut === 's010c01') {
            document.getElementById('wall_del_bt').style.display = 'none';
        } else {
            document.getElementById('wall_del_bt').style.display = 'inline';
        }
    } else if (eCutArray.scene.wall) {
        wallSrc = eCutArray.scene.wall.souce + ''; //scene_wall
        wallOpacity = eCutArray.scene.wall.opacity * 1; //scene_wall_opacity
        wallalign = eCutArray.scene.wall.align; //scene_wall_align
        document.getElementById('wall_add_bt').style.display = 'inline';
        document.getElementById('wall_del_bt').style.display = 'none';
    }
    dbMsg = dbMsg + "、背景=" + wallSrc;
    myLog(dbMsg);
    dbMsg = dbMsg + ",wallOpacity=" + wallOpacity;
    document.getElementById('scp_wall_opt').value = wallOpacity;
    dbMsg = dbMsg + ",wallalign=" + wallalign;
    setWallMoniter();
    setWall();
    document.setform.scp_audio_is_start.checked = '';
    if (eCutArray.audio) {
        document.setform.scp_audio_is_start.checked = true;
        document.getElementById('audio_add_bt').style.display = 'none';
        document.getElementById('audio_del_bt').style.display = 'inline';
    } else {
        document.getElementById('audio_add_bt').style.display = 'inline';
        document.getElementById('audio_del_bt').style.display = 'none';
    }

    document.getElementById('scp_audio_position').value = '';
    if (eCutArray.scene.audio) {
        var audioUrl = eCutArray.scene.audio.souce;
        var mStart = eCutArray.scene.audio.mStart;
        var mPosition = eCutArray.scene.audio.mPosition;
        if (eCutArray.audioPosition) {
            mPosition = eCutArray.audioPosition * 1;
        }
        dbMsg = dbMsg + ",audio=" + audioUrl + ",を" + mPosition + "m秒から";
        audio = document.getElementById('audio_control'); //idで親要素を取得
        dbMsg = dbMsg + "Audioを新規生成";
        audioLoad2Play(audioUrl, mPosition);
        audio.pause();
        document.getElementById('scp_audio_url').value = audioUrl;
        // var audioPosition = cutArray.audioPosition;
        // dbMsg = dbMsg + "、audioPosition=" + audioPosition;
        document.getElementById('scp_audio_position').value = mPosition;
    }
    ////2017/0615保留/////////////////////
    document.setform.scp_fix_left_is_start.checked = '';
    if (eCutArray.fix_left) {
        dbMsg = dbMsg + "fix_leftここから";
        document.setform.scp_fix_left_is_start.checked = true; //？？check入らず
    }

    document.setform.scp_fix_right_is_start.checked = '';
    if (eCutArray.fix_right) {
        document.setform.scp_fix_right_is_start.checked = true;
    }
    ////2017/0615保留/////////////////////

    thisCutDuration = eCutArray.time * 1;
    dbMsg = dbMsg + ",thisCutDuration=" + thisCutDuration;
    document.getElementById('cp_cut_time').value = thisCutDuration;

    ///モニターへの設定値反映////////////////////////////////////////////////
    var pictCount = 0;
    cutTimeArray = new Array();
    var retValse = cutWrigt(eCutArray);
    dbMsg = dbMsg + "、描画後はmoniterScale=" + moniterScale + "に";
    document.getElementById('moniter_row').style.transform = 'scale(' + moniterScale + ')'; //-webkit-transform: scale(0.9);
    document.getElementById('moniter_row').style.webkitTransformOrigin = '0 0 0'; //左肩に指定しないと中心に寄せられる
    var retValse = getElementCoordinates('moniter_row');
    var leftElementX = retValse.x * 1;
    var moniterY = retValse.y * 1;
    dbMsg = dbMsg + ", moniter_row(" + leftElementX + "," + moniterY + ")";
    var leftElementWidth = retValse.width * 1;
    var moniterHeight = retValse.height * 1;
    dbMsg = dbMsg + "[" + leftElementWidth + "×" + moniterHeight + "]px";
    retValse = getElementCoordinates('left_element');
    var leftElementX = retValse.x * 1;
    var leftElementY = retValse.y * 1;
    dbMsg = dbMsg + "、leftElement(" + leftElementX + "," + leftElementY + ")";
    document.getElementById('left_element').style.height = (moniterY + moniterHeight - leftElementY) + 'px'; //-webkit-transform: scale(0.9);

    scrollSpead = retValse.scrollSpead;
    dbMsg = dbMsg + "、スクロールスピード=" + scrollSpead;
    scrollT = retValse.scrollItem;
    dbMsg = dbMsg + "=" + scrollT;
    if (scrollT) { //スクロールアイテムがある
        dbMsg = dbMsg + ",fiTime=" + fiTime;
        nextFunction = null;
        stayTime = thisCutDuration;
        dbMsg = dbMsg + ",stayTime=" + stayTime;
        vScroll();
    }
    document.getElementById('moniter_bace').style.border = 'solid'; //プレビューの外枠
    document.getElementById('moniter_bace').style.borderColor = 'black';
    ///各行の編集項目/////////////////////////モニターへの設定値反映/////
    myLog(dbMsg);
    for (var i = 0; i < elementIdArray.length; i++) {
        try {
            elmId = elementIdArray[i];
            dbMsg = tag + ",none(" + i + ")" + elmId;
            document.getElementById(elmId + "_souce").value = '';
            document.getElementById(elmId + "_type").value = 'none';
            document.getElementById(elmId + "_text_edit").style.display = 'none';
            document.getElementById(elmId + "_scroll_edit").style.display = 'none';
            document.getElementById(elmId + "_pict_edit").style.display = 'none';
            var elmId = elementIdArray[i]; //elmName
            dbMsg = tag + "(" + i + ")" + elmId;
            var srts = elmId.split('_');
            var vPosition = srts[0];
            var hPosition = srts[1];
            dbMsg = dbMsg + "=" + vPosition + "と" + hPosition;
            var rObj;
            if (elmId.match('fix_')) {
                rObj = eCutArray['scene'][elmId];
                document.setform.scp_fix_left_is_start.checked = '';
                document.setform.scp_fix_right_is_start.checked = '';
                if (elmId.match('fix_left')) {
                    if (eCutArray.fix_left) {
                        dbMsg = dbMsg + "、左の固定要素はここから";
                        document.setform.scp_fix_left_is_start.checked = true;
                    }
                } else if (elmId.match('fix_right')) {
                    if (eCutArray.fix_right) {
                        dbMsg = dbMsg + "、右の固定要素はここから";
                        document.setform.scp_fix_right_is_start.checked = true;
                    }
                }
            } else {
                rObj = eCutArray[elmId];
            }
            // myLog(dbMsg);
            // if (debug_now == true) {
            //     console.log(rObj);
            // }
            if (rObj) {
                // if (!isHDivide) { //左右分割レイアウト
                //     document.getElementById(vPosition + "_layout_lr_balance").style.display = 'table-cell';//20170731廃止
                // } else { //フリーレイアウト
                //     document.getElementById(vPosition + "_layout_lr_balance").style.display = 'none';//20170731廃止
                // }
                var elementObj = getUpperBottomElement(elmId);
                var upperElement = elementObj.upperElement;
                var bottomElement = elementObj.bottomElement;
                dbMsg = dbMsg + ",上下=" + upperElement + "～" + bottomElement;
                var type = rObj.type;
                dbMsg = dbMsg + ",type=" + type;
                document.getElementById(elmId + "_type").value = type;
                document.getElementById(elmId + "_" + type + "_edit").style.display = 'inline-block';

                var souce = rObj.souce;
                dbMsg = dbMsg + ",souce=" + souce;
                souce = souce.replace(/"/g, '');
                souce = souce.replace(/'/g, '');
                var souceNbr = br2cr(souce);
                dbMsg = dbMsg + ",souce=" + souceNbr;
                document.getElementById(elmId + "_souce").value = souceNbr;
                var align = rObj.align;
                dbMsg = dbMsg + ",align=" + align;

                var effect = rObj.effect;
                dbMsg = dbMsg + ",effect=" + effect;
                var left = rObj.left * 1;
                dbMsg = dbMsg + "(" + left;
                // if (left === 0) {
                //     left = getUpperElementBottom(upperElement);
                //     dbMsg = dbMsg + ">>" + left;
                // }
                document.getElementById(elmId + "_left_parcent").value = left;
                var top = rObj.top * 1;
                dbMsg = dbMsg + "%," + top + ")";
                if (top == 0) {
                    myLog(dbMsg);
                    dbMsg = dbMsg + ">upperElement>" + upperElement;
                    if (upperElement !== '') {
                        top = getUpperElementBottom(upperElement);
                        dbMsg = dbMsg + ">>" + top + "%)";
                    }
                }
                document.getElementById(elmId + "_top_parcent").value = top;
                var width = rObj.width * 1;
                dbMsg = dbMsg + "[" + width;
                var setWidth = width;
                dbMsg = dbMsg + ">setWidth>" + setWidth;
                document.getElementById(elmId + "_width_parcent").value = setWidth;

                var hight = rObj.hight * 1;
                dbMsg = dbMsg + "×" + hight + "%]";
                if (hight) { //設定済み
                    if (hight < 1) { //設定済み
                        setHightNowElement(elmId);
                    }
                } else { //未設定
                    hight = getElementHightRemainParcent(elmId);
                    // setHightNowElement(elmId);
                }
                // myLog(dbMsg);
                if (hight === 0) { //ブラウザの表示最低値を割ったら
                    retValse = getElementCoordinates(elmId); //実測
                    var elementX = retValse.x * 1;
                    var elementY = retValse.y * 1;
                    dbMsg = dbMsg + ",element(" + elementX + "," + elementX + ")";
                    var elementWidth = (retValse.width * 1) / winScale;
                    hight = (retValse.height * 1) / winScale;
                    dbMsg = dbMsg + "[" + elementWidth + "×" + hight + "]px";
                    // myLog(dbMsg);
                    hight = Math.round(hight / baceHeight * 100);
                    dbMsg = dbMsg + ">>" + hight + "%";
                }
                // myLog(dbMsg);
                document.getElementById(elmId + "_hight_parcent").value = hight;
                if (type.match("text") || type.match("scroll")) {
                    document.getElementById(elmId + "_text_edit").style.display = 'inline-block';
                    var wrightElement = elmId;
                    var sFontFamily = rObj.fontFamily + '';
                    dbMsg = dbMsg + ",fontFamily=" + sFontFamily;
                    var selIndex = 0;
                    if (sFontFamily == true || sFontFamily == 'true') {
                        document.getElementById(elmId + "_text_edit_font_type").selectedIndex = 0; //フォントリスト
                    } else if (sFontFamily == false || sFontFamily == 'false') {
                        document.getElementById(elmId + "_text_edit_font_type").selectedIndex = 2; //フォントリスト
                    } else {
                        var rElement = document.getElementById(elmId + "_text_edit_font_type");
                        for (var rOption in rElement) { // オブジェクトの中のプロパティ名を取り出す。
                            if (rElement[rOption].style) {
                                dbMsg = dbMsg + "," + rOption;
                                var rFontFamily = rElement[rOption].style.fontFamily;
                                if (rFontFamily == sFontFamily) {
                                    selIndex = rOption * 1;
                                    dbMsg = dbMsg + ",rFontFamily=" + rFontFamily + "は" + selIndex + "番目";
                                    break;
                                }
                            }
                        }
                        document.getElementById(elmId + "_text_edit_font_type").selectedIndex = selIndex; //フォントリスト                  
                        //    document.getElementById(elmId + "_text_edit_font_type").value = fontFamily; //フォントリスト                  
                    }
                    var fontSize = rObj.fontSize * 1;
                    dbMsg = dbMsg + ",fontSize=" + fontSize;
                    document.getElementById(elmId + "_text_edit_font_size_px").value = fontSize;
                    // document.getElementById(elmId + "_font_re_size").value = fontSize;
                    // document.getElementById(elmId + "_font_re_size").innerHTML = fontSize + "ptに戻す";
                    document.getElementById(elmId + "_text_edit_font_size_parcent").style.display = 'none';
                    document.getElementById(elmId + "_text_edit_font_size_unit").style.display = 'none';
                    selIndex = 0; //0以下は最長行をエレメント幅に収める
                    document.getElementById(elmId + "_text_edit_font_size").selectedIndex = 0;
                    var fontColor = rObj.fontColor + '';
                    if (!fontColor.match('#')) {
                        fontColor = '#000000';
                    }
                    dbMsg = dbMsg + ",fontColor=" + fontColor;
                    document.getElementById(elmId + "_text_edit_font_color").value = fontColor;

                    var bgColor = rObj.bgColor + '';
                    if (!bgColor.match('#')) {
                        bgColor = '-1';
                    }
                    dbMsg = dbMsg + ",bgColor=" + bgColor;
                    if (bgColor === '') {
                        bgColor = "#000000";
                        dbMsg = dbMsg + ">>" + bgColor;
                    }
                    if (bgColor.match('-1')) {
                        document.getElementById(elmId + '_text_edit_font_bgtrance').checked = true;
                        // document.getElementById(elmId + "_text_edit_font_backgrand").disabled = true;
                    } else {
                        // document.getElementById(elmId + "_text_edit_font_backgrand").disabled = false;//選択不可
                        document.getElementById(elmId + "_text_edit_font_backgrand").value = bgColor;
                        document.getElementById(elmId + '_text_edit_font_bgtrance').checked = "";
                    }

                    var vRows = rObj.vRows * 1;
                    dbMsg = dbMsg + ",vRows=" + vRows;
                    if (0 < vRows) {} else {
                        vRows = strCount(souce, "<br>") + 1;
                        dbMsg = dbMsg + ">>" + vRows + "行";
                    }
                    document.getElementById(elmId + "_text_edit_v_rows").value = vRows;
                    if (type.match("scroll")) {
                        var wrightElement = elmId + "_scroll";
                        dbMsg = dbMsg + ",wrightElement=" + wrightElement;
                        var vRows = rObj.vRows * 1;
                        dbMsg = dbMsg + ",vRows=" + vRows + "行";
                        document.getElementById(elmId + "_text_valign").style.display = 'none';
                        document.getElementById(elmId + "_scroll_edit").style.display = 'inline-block';
                        var sSpead = rObj.scrollSpead * 1;
                        dbMsg = dbMsg + ",scrollSpead=" + sSpead;
                        document.getElementById(elmId + "_text_edit_scroll_spead").value = sSpead;
                    }
                    setAlineBtn(elmId + '_text_align');
                } else if (type.match("pict")) {
                    document.getElementById(elmId + "_hight_select").children[3].style.display = 'none'; //行数に合わせる を非表示にする
                    var pScale = rObj.scale * 1;
                    dbMsg = dbMsg + ",pScale=" + pScale;
                    document.getElementById(elmId + "_pict_edit_pict_scale").value = pScale;
                    var opacity = rObj.opacity * 1;
                    dbMsg = dbMsg + ",opacity=" + opacity;
                    document.getElementById(elmId + "_pict_edit_p_opt").value = opacity;
                    var fleamColor = rObj.fleamColor;
                    dbMsg = dbMsg + ",fleamColor=" + fleamColor;
                    if (fleamColor) {} else {
                        fleamColor = "#ffffff";
                        dbMsg = dbMsg + ">>" + fleamColor;
                    }
                    document.getElementById(elmId + "_pict_edit_fleme_color").value = fleamColor;
                    var fleamWidth = rObj.fleamWidth;
                    dbMsg = dbMsg + ",fleamWidth=" + fleamWidth;
                    if (fleamWidth) {} else {
                        fleamWidth = 10;
                        dbMsg = dbMsg + ">>" + fleamWidth;
                    }
                    document.getElementById(elmId + "_pict_edit_fleme_widht").value = fleamWidth;
                    var pWidth = document.getElementById(elmId).clientWidth; //pWidth
                    var pHeight = document.getElementById(elmId).clientHeight; //pWidth
                    dbMsg = dbMsg + ",親のサイズ[" + pWidth + "×" + pHeight + "]";
                    if (pHeight < 10) {
                        pHeight = pWidth * 9 / 16;
                        dbMsg = dbMsg + ",>>" + pHeight + "]";
                    }
                    document.getElementById(elmId + "_pict_edit").style.display = 'inline-block';
                    var addName = elmId + "_phot";
                    setAlineBtn(elmId + '_pict_align');
                    pictCount++
                    document.getElementById(elmId + "_pict_edit_src").src = souce; //imgタグのSRC
                }
                $('#' + elmId).css({ "border-style": "solid" }).css({ "border-width": "3px" }).css({ "border-width": "3px" }); //エレメントごとに枠線を付ける
            } else {
                var ndisps = document.getElementsByName(elmId + '_eidter'); //.style.display = 'none'; //'inline-block';           
                for (var nonedisp in ndisps) { // オブジェクトの中のプロパティ名を取り出す。
                    // console.log(ndisps[nonedisp]);
                    if (ndisps[nonedisp].style) {
                        ndisps[nonedisp].style.display = 'none';
                    }
                }
            }
            myLog(dbMsg);
        } catch (e) {
            dbMsg = dbMsg + ';エラー;' + e;
            console.log(dbMsg);
        }
    }
    // document.getElementById('moniter_row').style.transform = 'scale(' + moniterScale + ')'; //-webkit-transform: scale(0.9);
    // document.getElementById('moniter_row').style.webkitTransformOrigin = '0 0 0'; //左肩に指定しないと中心に寄せられる
    var retValse = getElementCoordinates('moniter_row');
    var leftElementX = retValse.x * 1;
    var moniterY = retValse.y * 1;
    dbMsg = dbMsg + ",moniter_row(" + leftElementX + "," + moniterY + ")";
    var leftElementWidth = retValse.width * 1;
    var moniterWidth = retValse.height * 1;
    dbMsg = dbMsg + "[" + moniterWidth + "×" + moniterHeight + "]px"; //moniter_row(10,2413)[417×234.5625]px
    retValse = getElementCoordinates('top_bt_gr');
    var topBtX = retValse.x * 1;
    var topBtY = retValse.y * 1;
    dbMsg = dbMsg + ",topBt(" + topBtX + "," + topBtY + ")";
    var topBtWidth = retValse.width * 1;
    var topBtHeight = retValse.height * 1;
    dbMsg = dbMsg + "[" + topBtWidth + "×" + topBtHeight + "]px"; //topBt(10,2313)[417×34]px
    var bottomGtTop = (topBtHeight + moniterHeight + 20) + "px";
    dbMsg = dbMsg + ",bottomGtTop=" + bottomGtTop; //topBt(10,2313)[417×34]px
    document.getElementById('bottom_bt_gr').style.top = bottomGtTop;
    document.getElementById('bottom_bt_gr').style.width = moniterWidth;
    var elementArray = JSON.parse(localStorage.getItem('elementArray'));
    var lastSC = elementArray[elementArray.length - 1].scene_cut + '';
    dbMsg = dbMsg + ",lastSC=" + lastSC;
    myLog(dbMsg);
    document.getElementById('rd_btn').disabled = ""; //.style.display = 'inline-block';
    document.getElementById('rd_btn').style.opacity = "1";
    document.getElementById('fs_btn').disabled = ""; //.style.display = 'inline-block';
    document.getElementById('fs_btn').style.opacity = "1";
    if (sceneCut === 's010c01') {
        document.getElementById('rd_btn').disabled = "disabled"; //style.display = 'none'; //
        document.getElementById('rd_btn').style.opacity = "0";
    } else if (sceneCut === lastSC) {
        document.getElementById('fs_btn').disabled = "disabled";
        document.getElementById('fs_btn').style.opacity = "0";
    }

} //1カット分のデータ書き込みとIFの設定

///起動～このページの構成開始///////////////////////////////////////////////////////////

function receveCutArray(scutArray) {
    var tag = "[edit.receveCutArray]";
    var sCut = this.sceneCut;
    var dbMsg = tag + "scene_cut=" + sCut;
    // myLog(dbMsg);
    this.cutArray = $.extend(true, [], scutArray); //配列コピー
    // console.log(scutArray);
    if (cutArray) {
        dbMsg = dbMsg + "を" + cutArray.length + "件から検索";
        for (var i = 0; i < cutArray.length; ++i) {
            dbMsg = dbMsg + "(" + i + ")";
            // myLog(dbMsg);
            // console.log(cutArray[i]);
            dbMsg = dbMsg + cutArray[i].scene_cut;
            if (cutArray[i].scene_cut.match(sCut)) {
                nextSC = i;
                dbMsg = dbMsg + "該当；nextSC=" + nextSC;
                myLog(dbMsg);
                if (debug_now == true) {
                    console.log(cutArray[i]);
                }
                writeThisCut(cutArray[i]);
            }
        }
        dbMsg = dbMsg + ",ループ終了後；nextSC=" + nextSC;
        myLog(dbMsg);
    } else {
        dbMsg = dbMsg + ",cutArray=" + cutArray;
    }
    myLog(dbMsg);
}

function readStrage() {
    var tag = "[readStrage]";
    var sCut = this.sceneCut;
    var dbMsg = tag + "scene_cut=" + sCut;
    myLog(dbMsg);
    var scutArray = JSON.parse(localStorage.getItem("cutArray"));
    console.log(scutArray);
    receveCutArray(scutArray)
}

function cutDataRead(sCut) {
    var tag = "[cutDataRead]";
    var dbMsg = tag + "scene_cut=" + sCut;
    this.sceneCut = sCut;
    myLog(dbMsg);
    // var promise = new Promise(function(resolve, reject) {
    if (cutArray) {
        dbMsg = dbMsg + "cutArray有り";
        receveCutArray(cutArray)
    } else {
        dbMsg = dbMsg + "localStorage";
        cutArray = JSON.parse(localStorage.getItem('cutArray')); //localStorageから読み出し
        if (cutArray) {
            dbMsg = dbMsg + "cutArray有り";
            receveCutArray(cutArray)
        } else {
            dbMsg = dbMsg + "templeteRead";
            cutArray = templeteRead();
        }
    }
    myLog(dbMsg);
    // });
    console.log(promise);
    promise.then(function(value) {
        myLog(dbMsg);
        console.log(value);
        readStrage();
    });
    //     var cutArray = templeteRead();
    //     console.log(cutArray);
    // });

    // window.addEventListener("storage", function(event) {
    //     var tag = "[addEventListener]";
    //     var dbMsg = tag; // + "scene_cut=" + sCut;
    //     myLog(dbMsg);
    //     var data = 'key:' + event.key +
    //         ' oldValue:' + event.oldValue +
    //         ' newValue:' + event.newValue +
    //         ' url:' + event.url +
    //         ' storageArea:' + event.storageArea;
    //     console.log(event);
    //     readStrage();
    // });
    // window.addEventListener("storagecommit", function(event) {
    //     console.log("storagecommit");
    //     console.log(event);
    // });
}

/**
 * 各エレメントの編集IFをhogan.jsで書き出す
 */
function writeEditElement() {
    var tag = "[edit.writeEditElement]";
    var dbMsg = tag;
    textFileName = localStorage.getItem('fws_textFileName'); //   var elementArray2 = JSON.parse(localStorage.getItem(elementArrayName));
    dbMsg = dbMsg + ',textFileName=' + textFileName;
    if (textFileName.match('conte')) {
        signageName = "結婚式用エンドロールテンプレート";
    } else if (textFileName.match('prezen')) {
        signageName = "プレゼンスライドテンプレート";
    } else if (textFileName === signageName) {
        signageName = signageName;
    }
    dbMsg = dbMsg + ',signageName=' + signageName;
    document.getElementById('page_titol').innerHTML = signageName + " ; " + sceneCut + 'の編集'; //シーン選択リスト

    dbMsg = dbMsg + ',' + elementIdArray.length + "件";
    for (var i = 0; i < elementIdArray.length; ++i) {
        var elementId = elementIdArray[i];
        dbMsg = dbMsg + "(" + i + ")" + elementId;
        var idInfo = elementId.split('_');
        var vPosition = idInfo[0];
        var hPosition = idInfo[1];
        var tpl;
        // if (hPosition.match('left')) {
        //     tpl = Hogan.compile($('#tpl_left_edit').text());
        // } else {
        //     tpl = Hogan.compile($('#tpl_right_edit').text());
        // }
        // var html = tpl.render({
        //     vPosition: vPosition,
        //     elmId: elementId,
        // });
        // $('#' + elementId + "_eidt").append(html);
        // myLog(dbMsg);
        tpl = Hogan.compile($('#tpl_common').text());
        html = tpl.render({
            elmId: elementId,
        });
        $('#' + elementId + "_eidt").append(html);
        // if (vPosition.match('fix') || vPosition.match('top')) { //
        //     document.getElementById(elementId + '_text_edit_font_size').options[2].disabled = true;
        //     dbMsg = dbMsg + ">font_size;disabled>";
        // }

        tpl = Hogan.compile($('#tpl_view').text());
        html = tpl.render({
            elmId: elementId,
        });
        $('#' + vPosition + "_aria").append(html);
    }
    myLog(dbMsg);
} //各エレメントの編集IFをhogan.jsで書き出す