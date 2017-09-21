var debug_now = false;
var bratherList;
var nowPosition;
var nowPearent;
var nowElementName;
var nowCutArray; // = $.extend(true, [], cutArray[nowPosition - 1]); //元配列コピー
var targetCutArray; // = $.extend(true, [], cutArray[targetPosition - 1]); //移動先配列コピー
var moveSheenTitol = 'の移動';
var readTempretTitol = 'テンプレート選択';

/**
 * モダールダイアログを表示してセレクタ選択を求める
 * @param {*} targetName 
 * @param {*} titolStr 
 */
function dlogSet(targetName, titolStr) {
    var tag = "[dlogSet]";
    var dbMsg = tag + 'targetName=' + targetName + 'titolStr=' + titolStr;
    document.getElementById('dlog_targrt').innerText = targetName;
    document.getElementById('dlog_titlo').innerText = titolStr;
    myLog(dbMsg);
    if (dbMsg == true) {
        console.log(event);
        console.log(elementArray);
    }
    $('#modal_box').modal('show');
} //モダールダイアログを表示してセレクタ選択を求める

/**
 * localStorageを読んでcutArrayを作り直す
 * @param {*} event 
 */
function saveRecord(event) {
    var tag = "[saveRecord]";
    var dbMsg = tag;
    nowEditType = 'text';
    var eventElement = event.target;
    var elementId = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",id=" + elementId;
    localStorage.removeItem(cutArrayName);
    localStorage.removeItem(elementArrayName);
    // localStorage.clear();
    templeteRead();
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
} //localStorageを読んでcutArrayを作り直す
//Element検索///////////////////////////////////////////////////////////////////////////////
/**
 * 以下のパラメータで指摘したエレメントを取得する
 * @param {*} parentNode 
 * @param {*} tagName 
 * @param {*} attribute 
 * @param {*} funcName 
 * event.toElementで同じデータが取れる
 */
function getElementByEventObj(parentNode, tagName, attribute, funcName) {
    var tag = "[getElementByEventObj]";
    console.log(parentNode);
    var dbMsg = tag + ",parentNode=" + parentNode;
    dbMsg = tag + "の" + tagName + "から" + attribute + "が「" + funcName + "」を検索";
    var rObj;
    var parts = parentNode.getElementsByTagName(tagName); //.childNodes だとtextが混ざる
    for (i = 0; i < parts.length; i++) {
        dbMsg = dbMsg + "," + i + ")";
        var rObj = parts[i];
        var onclick = rObj.getAttribute(attribute);
        if (onclick.match(funcName)) {
            dbMsg = dbMsg + onclick; //+ ",pearentID=" + pearentID;
            myLog(dbMsg);
            return rObj;
        }
    }
} //指摘したエレメントを取得する

function findSameElement(parentNode, tagetElement, depth, attribute, funcName) {
    var tag = "[findSameElement]";
    var rObj = null;
    dbMsg = tag + parentNode.id + "の" + tagetElement.id + "を";
    console.log(parentNode);
    console.log(tagetElement);
    var targrtNode = tagetElement.nodeName;
    dbMsg = dbMsg + "," + targrtNode + "の";
    var targrtAttribute = tagetElement.getAttribute(attribute);
    dbMsg = dbMsg + "," + targrtNode + "が「" + funcName + "」を" + depth + "階層下の";
    var brathers = parentNode.childNodes;
    for (j = 0; j < depth; j++) {
        dbMsg = dbMsg + "(" + j;
        for (i = 0; i < brathers.length; i++) {
            dbMsg = dbMsg + ";" + i + ")";
            var bratherNode = brathers[i];
            // var tNodeName = bratherNode.nodeName + '';
            // dbMsg = dbMsg + tNodeName;
            if (bratherNode.childNodes) {
                break;
            }
        }
        myLog(dbMsg);
        console.log(brathers[i].nextElementSibling);
        brathers = brathers[i].nextElementSibling.childNodes;
    }
    dbMsg = dbMsg + "," + brathers.length + "件から検索";

    for (i = 0; i < brathers.length; i++) {
        dbMsg = dbMsg + "(" + i + ")";
        var bratherNode = brathers[i];
        // console.log(bratherNode);
        var tNodeName = bratherNode.nodeName + '';
        if (tNodeName.match(targrtNode)) {
            dbMsg = dbMsg + tNodeName;
            var attributeNode = bratherNode.getAttribute(attribute); //検索対象attribute
            dbMsg = dbMsg + "の" + attribute + "に";
            if (attributeNode) {
                dbMsg = dbMsg + funcName + "は";
                myLog(dbMsg);
                console.log(rObj);
                if (attributeNode.match(funcName)) {
                    dbMsg = dbMsg + attributeNode; //+ ",pearentID=" + pearentID;
                    myLog(dbMsg);
                    return rObj;
                } else if (rObj.childNodes) {
                    dbMsg = dbMsg + "無い";
                    findSameElement(bratherNode, tagetElement, attribute, funcName)
                }
            } else {
                dbMsg = dbMsg + "無い";
                findSameElement(bratherNode, tagetElement, attribute, funcName)
            }
        }
    }
    myLog(dbMsg);

}
////////////////////////////////////////////////////////////////////////////Element検索//
function changeCutElement(wElement, rewrScene) {
    var tag = "[changeCutElement]";
    var dbMsg = tag + elementArray.length + "件に";
    dbMsg = dbMsg + wElement.length + "件を" + rewrScene + "へ";
    for (var i = 0; i < wElement.length; i++) {
        var rSC = wElement[i]['scene_cut'];
        dbMsg = dbMsg + ",(" + i + ")" + rSC;
        var scStrs = rSC.split('c');
        var cNo = scStrs[1] * 1;
        dbMsg = dbMsg + ">>" + cNo;
        var scNo = rewrScene + "c0" + cNo;
        if (9 < cNo) {
            scNo = rewrScene + "c" + cNo;
        }
        dbMsg = dbMsg + ">>" + scNo;
        wElement[i]['scene_cut'] = scNo;
        elementArray[elementArray.length] = $.extend(true, {}, wElement[i]);
    }
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(wElement);
        console.log(elementArray);
    }
    return wElement;
} //シーン全体のエレメント移動
/**
 * シーン全体のエレメント移動
 * @param {*} nowScene 
 * @param {*} targetScene 
 */
function changeSceneElement(nowScene, targetScene) {
    var tag = "[changeSceneElement]";
    var dbMsg = tag + nowScene + "を" + targetScene + "へ";
    // if (elementArray) {} else {
    dbMsg = dbMsg + "呼出し";
    elementArray = JSON.parse(localStorage.getItem('elementArray'));
    // }
    dbMsg = dbMsg + ",elementArray=" + elementArray.length + "件";
    var nowElementArray = []; //new Array(); //[]; //
    var targetElementArray = []; //new Array();
    var nowSceneNo = nowScene.substr(1, 2) * 1;
    var targetSceneNo = targetScene.substr(1, 2) * 1;
    for (var i = 0; i < elementArray.length; i++) {
        var rSC = elementArray[i]['scene_cut'];
        if (rSC.match(nowScene)) {
            dbMsg = dbMsg + ",(" + i + ")" + rSC;
            nowElementArray[nowElementArray.length] = $.extend(true, [], elementArray[i]); //☆[]で配列にする  elementArray[i].concat(); //$.extend(true, [], elementArray[i]); 
            elementArray.splice(i, 1);
            i--;
        } else if (rSC.match(targetScene)) {
            dbMsg = dbMsg + ",target(" + i + ")" + rSC;
            targetElementArray[targetElementArray.length] = $.extend(true, [], elementArray[i]); //☆[]で配列にする
            elementArray.splice(i, 1);
            i--;
        }
    }
    dbMsg = dbMsg + ",読取り後elementArray=" + elementArray.length + "件";
    dbMsg = dbMsg + "、now=" + nowSceneNo + "を" + nowElementArray.length + "件";
    dbMsg = dbMsg + "target=" + targetSceneNo + "を" + targetElementArray.length + "件";
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(elementArray);
        console.log(nowElementArray);
        console.log(targetElementArray);
    }
    if (targetSceneNo < nowSceneNo) {
        changeCutElement(nowElementArray, targetScene);
        changeCutElement(targetElementArray, nowScene);
    } else {
        changeCutElement(targetElementArray, nowScene);
        changeCutElement(nowElementArray, targetScene);
    }
    elementArray.sort(
        function(a, b) {
            var retInt = elementArraySort(a, b);
            return retInt;
        }
    );

    elementArray2localStorage(elementArray);
    // makeCutArray(elementArray);
    dbMsg = dbMsg + ",移し替え後elementArray=" + elementArray.length + "件";
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(elementArray);
        // console.log(nowElementArray);
        // console.log(targetElementArray);
    }
} //シーン全体のエレメント移動

/**
 * 指定されたシーンカット以降の番号を振り直し、エレメント順もソートする
 * @param {*} startSC 
 */
function sceneCutAllReNumber(startSC) {
    var tag = "[sceneCutAllReNumber]";
    var dbMsg = tag + startSC + "以降を";
    var startIndex = -1;
    var b_sceneCut = startSC;
    if (elementArray) {} else {
        dbMsg = dbMsg + "呼出し";
        elementArray = JSON.parse(localStorage.getItem('elementArray'));
    }
    dbMsg = dbMsg + ",elementArray=" + elementArray.length + "件中";
    var scStrs = startSC.split('c');
    var b_SceneStr = scStrs[0];
    var wrSceneNo = b_SceneStr.substr(1, 2) * 1;
    var wrCutNo = scStrs[1].substr(0, 2) * 1;
    var rSceneNo = -1;
    var rCutNo = -1;
    var wrSceneStr = '';
    var rwSceneCut = '';
    var wrCutStr = '';
    dbMsg = dbMsg + ",スタートs" + wrSceneNo + "c" + wrCutNo;
    for (var i = 0; i < elementArray.length; i++) {
        var rElementSC = elementArray[i].scene_cut + '';
        if (rElementSC === startSC && startIndex === -1) {
            startIndex = i;
            dbMsg = dbMsg + "インデックス" + startIndex + "から";
        }
        if (-1 < startIndex) {
            if (b_sceneCut !== rElementSC) {
                rwSceneCut = '';
                wrCutStr = '';
                var rscStrs = rElementSC.split('c');
                var rSceneStr = rscStrs[0];
                rSceneNo = rSceneStr.substr(1, 2) * 1;
                rCutNo = rscStrs[1].substr(0, 2) * 1;
                if (b_SceneStr !== rSceneStr) {
                    wrSceneNo++; //= wrSceneNo * 1 + 1;
                    if (wrSceneNo !== rSceneNo) {
                        dbMsg = dbMsg + "シーン" + rSceneNo + "を" + wrSceneNo + 'に';
                        wrSceneStr = sceneNum2Str(wrSceneNo);
                        wrCutStr = cutNum2Str(wrCutNo);
                        rwSceneCut = wrSceneStr + wrCutStr;
                    }
                    b_SceneStr = rSceneStr;
                    wrCutNo = 1;
                } else {
                    wrCutNo++;
                }
                if (wrCutNo !== rCutNo) {
                    dbMsg = dbMsg + "::" + rElementSC + "のカット" + rCutNo + "を" + wrCutNo + 'に';
                    wrCutStr = cutNum2Str(wrCutNo);
                } else {
                    wrCutStr = cutNum2Str(rCutNo);
                }
                if (wrSceneNo !== rSceneNo || wrCutNo !== rCutNo) {
                    rwSceneCut = wrSceneStr + wrCutStr;
                }
                b_sceneCut = rElementSC;
            }
            if (rwSceneCut !== '') {
                dbMsg = dbMsg + "\n(" + i + ")" + rElementSC;
                dbMsg = dbMsg + ">>s" + rSceneNo + "c" + rCutNo;
                dbMsg = dbMsg + ">更新>" + rwSceneCut;
                elementArray[i].scene_cut = rwSceneCut;
            }
        }
    }
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
        var elementArray2 = JSON.parse(localStorage.getItem('elementArray'));
        console.log(elementArray2);
    }
    // document.getElementById('player_bt').style.display = 'none'
    //     // document.getElementById('reCutNamber_bt').style.display = 'inline-block'
    makeCutArray(elementArray); //再読み込み
} //指定されたシーンカット以降の番号を振り直し、エレメント順もソートする

/**
 * elementArrayを指定されたシーンカットに書き換える
 * elementArrayReWriteでsouce総合して置換え
 * @param {*} nowSC 
 * @param {*} targetSC 
 * 読出し元 moveSceneBody
 */
function sceneCutCangeNumber(nowSC, targetSC) {
    var tag = "[sceneCutCangeNumber.singl]";
    var dbMsg = tag + nowSC + "を" + targetSC + "へ";
    nowPosition = getCutArrayIndex(nowSC);
    dbMsg = dbMsg + ",nowPosition=" + nowPosition;
    nowCutArray = $.extend(true, [], cutArray[nowPosition]); //元配列コピー
    // var nowCutArray = $.extend(true, [], cutArray[nowPosition - 1]); //元配列コピー
    // var targetCutArray = $.extend(true, [], cutArray[targetPosition - 1]); //移動先配列コピー
    // var targetSC = targetCutArray.scene_cut;
    // var nowSC = nowCutArray.scene_cut;
    // dbMsg = dbMsg + ",nowSC=" + nowSC + "を" + targetSC + "へ";
    if (elementArray) {} else {
        dbMsg = dbMsg + "呼出し";
        elementArray = JSON.parse(localStorage.getItem('elementArray'));
    }
    dbMsg = dbMsg + ",elementArray=" + elementArray.length + "件";
    var nowIndex = [];
    for (var i = 0; i < elementIdArray.length; i++) {
        elmId = elementIdArray[i];
        if (!elmId.match('fix')) {
            dbMsg = dbMsg + ",now(" + i + ")" + elmId;
            var rObj = nowCutArray[elmId];
            if (rObj) {
                var nowSouce = rObj.souce;
                var retIndex = elementArrayReWrite(nowSC, elmId, nowSouce, targetSC);
                // nowCutArray[elmId].scene_cut = targetSC;
                nowIndex.push(retIndex);
            }
        }
    }
    if (debug_now == true) {
        console.log(elementArray);
        console.log(nowIndex);
    }
    elementArray.sort(
        function(a, b) {
            var retInt = elementArraySort(a, b);
            return retInt;
        }
    );
    elementArray2localStorage(elementArray);
    // myLog(dbMsg);
    // if (debug_now == true) {
    // console.log(elementArray);
    //     var elementArray2 = JSON.parse(localStorage.getItem('elementArray'));
    //     console.log(elementArray2);
    // }
    document.getElementById('player_bt').style.display = 'none'
        // document.getElementById('reCutNamber_bt').style.display = 'inline-block'

} //elementArrayのscene_cutを書き換える

/**
 * Node上でelementArrayのscene_cutを書き換える
 * @param {*} nowPosition 
 * @param {*} targetPosition 
 */
function sceneCutReNumber(nowPosition, targetPosition) {
    var tag = "[sceneCutReNumber]";
    var dbMsg = tag + ",nowPosition=" + nowPosition + "を" + targetPosition + "へ";
    // var nowCutArray = $.extend(true, [], cutArray[nowPosition - 1]); //元配列コピー
    // var targetCutArray = $.extend(true, [], cutArray[targetPosition - 1]); //移動先配列コピー
    var targetSC = targetCutArray.scene_cut;
    var nowSC = nowCutArray.scene_cut;
    dbMsg = dbMsg + ",nowSC=" + nowSC + "を" + targetSC + "へ";
    // elementArray = JSON.parse(localStorage.getItem('elementArray'));
    var elementArrayObj = JSON.parse(localStorage.getItem('elementArray')); //localStorageから読み出し
    elementArray = $.extend(true, [], elementArrayObj); //☆[]で配列にする
    dbMsg = dbMsg + ",elementArray=" + elementArray.length + "件";

    myLog(dbMsg);
    if (debug_now == true) {
        console.log(targetCutArray);
        console.log(nowCutArray);
    }
    var targetIndex = [];
    for (var i = 0; i < elementIdArray.length; i++) {
        elmId = elementIdArray[i];
        // if (!elmId.match('fix')) {
        dbMsg = dbMsg + ",target(" + i + ")" + elmId;
        var rObj = targetCutArray[elmId];
        if (rObj) {
            var targetSouce = rObj.souce;
            var retIndex = elementArrayReWrite(targetSC, elmId, targetSouce, nowSC);
            // targetCutArray[elmId].scene_cut = nowSC;
            targetIndex.push(retIndex);
        }
        // }
    }

    var nowIndex = [];
    for (var i = 0; i < elementIdArray.length; i++) {
        elmId = elementIdArray[i];
        // if (!elmId.match('fix')) {
        dbMsg = dbMsg + ",now(" + i + ")" + elmId;
        var rObj = nowCutArray[elmId];
        if (rObj) {
            var nowSouce = rObj.souce;
            var retIndex = elementArrayReWrite(nowSC, elmId, nowSouce, targetSC);
            // nowCutArray[elmId].scene_cut = targetSC;
            nowIndex.push(retIndex);
        }
        // }
    }
    if (debug_now == true) {
        console.log(elementArray);
        console.log(targetIndex);
        console.log(nowIndex);
    }

    var startIndex = targetIndex[0];
    var endIndex = nowIndex[0];
    dbMsg = dbMsg + ",変更箇所=" + startIndex + "～" + endIndex;
    if (startIndex < endIndex) {
        startIndex = endIndex
        endIndex = targetIndex[targetIndex.length - 1]
    } else {
        endIndex = nowIndex[nowIndex.length - 1]
    }
    dbMsg = dbMsg + ">>" + startIndex + "～" + endIndex;
    // var nowCount = 0;
    // for (var i = startIndex; i < endIndex; i++) {
    //     dbMsg = dbMsg + ",移し替え(" + i + ")";
    //     if (nowCount < nowIndex.length) {
    //         elementArray[i] = $.extend(true, [], elementArray[nowIndex[nowCount]]);
    //         nowCount++;
    //     }

    // }

    elementArray.sort(
        function(a, b) {
            var retInt = elementArraySort(a, b);
            // var tag = "[elementArray.sort]";
            // var dbMsg = tag;
            // tCount++;
            // var aName = a['scene_cut'];
            // var bName = b['scene_cut'];
            // dbMsg = dbMsg + "(" + tCount + ")" + aName + "と" + bName;
            // var retInt = 0;
            // if (aName < bName) {
            //     retInt = -1;
            // } else if (aName > bName) {
            //     retInt = 1;
            // }
            // if (retInt == 0) {
            //     var aElm = a['element'];
            //     var bElm = b['element'];
            //     dbMsg = dbMsg + "," + aElm + "と" + bElm;
            //     var elmNames = ['fix_left', 'fix_right', 'top_left', 'top_right', 'center_left', 'center_right', 'bottom_left', 'bottom_right'];
            //     var c = elmNames.indexOf(aElm);
            //     var d = elmNames.indexOf(bElm);
            //     var eIndex = c - d;
            //     dbMsg = dbMsg + ",eIndex=" + eIndex;
            //     if (eIndex < 0) {
            //         retInt = -1;
            //     } else if (0 < eIndex) {
            //         retInt = 1;
            //     }
            // }
            // dbMsg = dbMsg + "；retInt=" + retInt;
            // myLog(dbMsg);
            return retInt;
        }
    );
    elementArray2localStorage(elementArray);
    myLog(dbMsg);
    // if (debug_now == true) {
    //  console.log(elementArray);
    //     var elementArray2 = JSON.parse(localStorage.getItem('elementArray'));
    //     console.log(elementArray2);
    // }
    document.getElementById('player_bt').style.display = 'none'
        // document.getElementById('reCutNamber_bt').style.display = 'inline-block'
} //Node上でelementArrayのscene_cutを書き換える

/**
 * 指定したエレメントの親ノードから、同ノード内の子ノードをリストアップ
 * @param {*} elementName 
 * http://blog.livedoor.jp/logical_good/archives/50512273.html
 */
function makeBratherList(elementName) {
    var tag = "[makeBratherList]";
    var dbMsg = tag + ",elementName=" + elementName;
    try {
        bratherList = new Array();
        var element = document.getElementById(elementName);
        var targrtParentNode = element.parentNode;
        if (targrtParentNode) {
            var brathers = targrtParentNode.childNodes;
            for (i = 0; i < brathers.length; i++) {
                var rObj = brathers[i];
                if (rObj.id) {
                    dbMsg = dbMsg + "," + i + ")" + rObj.id; //+ ",pearentID=" + pearentID;
                    bratherList.push(rObj.id);
                }
            }
            dbMsg = dbMsg + ",bratherList=" + bratherList.toLocaleString(); //+ ",pearentID=" + pearentID;
        } else {
            dbMsg = dbMsg + 'parentNode取れず';
        }
    } catch (e) {
        dbMsg = dbMsg + 'でエラー；' // Cannot read property 'parentNode' of null
        console.log(e);
        bratherList = null;
        // window.location.reload(); //再読み込み
    }
    // myLog(dbMsg);
    return bratherList;
} //指定したエレメントの親ノードから、同ノード内の子ノードをリストアップ

//カット操作///////////////////////////////////////////////////////////////////
/**
 * 指定されたシーンカットに該当するelementArrayのレコードをすべて削除し、再描画
 * @param {*} delSC 
 */
function dellCutloop(delSC, isThisCut) {
    var tag = "[dellCutloop]";
    var dbMsg = tag + "delSC=" + delSC + ",isThisCut=" + isThisCut;
    // try {
    // var strDelSC = delSC.split('c');
    // var delScene = strDelSC[0];
    // dbMsg = dbMsg + ",delScene=" + delScene;
    // var startCutNo = strDelSC[1] * 1;
    // dbMsg = dbMsg + ",startCutNo=" + startCutNo;
    // // var delNode = document.getElementById(delSC); //削除対象☆再読込みするのでノードの処理は不要
    // // delNode.style.display = "none";
    // // delNode.parentNode.removeChild(delNode);
    // var delStrs = delSC.split('c');
    // var detSn = delStrs[0];
    // var scIndex = getCutArrayIndex(delSC);
    // dbMsg = dbMsg + ",cut=" + scIndex + "/" + cutArray.length + '件目';
    // var nextSC = ''; //delSC; //現在のシーンカットを初期値として
    // if (cutArray[scIndex + 1]) { //次のカットが有れば
    //     var nextSC = cutArray[scIndex + 1].scene_cut; //そのシーンカットを記録
    //     dbMsg = dbMsg + ",nextSC=" + nextSC;
    //     var nextCutIndex = getCutArrayIndex(nextSC);
    //     dbMsg = dbMsg + "(" + nextCutIndex + ')';
    //     var nextElmIndex = getElementArrayFarstIndex(nextSC);
    //     dbMsg = dbMsg + "(" + nextElmIndex + ')';
    // }
    // var startElementIndex = -1;
    dbMsg = dbMsg + ",elementArray=" + elementArray.length + "件中," + delSC + "を削除";
    var lastSC = elementArray[elementArray.length - 1].scene_cut;
    dbMsg = dbMsg + "、最終＝" + lastSC;
    var lastStrs = lastSC.split('c');
    var lastSceneStr = lastStrs[0];
    var lastCutNo = lastStrs[1];
    dbMsg = dbMsg + ",last=" + lastSceneStr + "c" + lastCutNo;
    var delStrs = delSC.split('c');
    var delSceneStr = delStrs[0];
    var delCutNo = delStrs[1];
    var delEndCut = getSceneEndCut(delSceneStr);
    dbMsg = dbMsg + ",delEndCut=" + delEndCut;
    var ddelEndSceneCut = delSceneStr + 'c' + delEndCut;
    for (i = 0; i < elementArray.length; i++) {
        var rSC = elementArray[i].scene_cut;
        if (rSC === delSC) {
            dbMsg = dbMsg + "(eleme;" + i + ")" + rSC;
            var scStrs = rSC.split('c');
            var sceneStr = scStrs[0];
            var cutNo = scStrs[1];
            dbMsg = dbMsg + ",sceneStr=" + sceneStr + ",cutNo=" + cutNo;
            var rType = elementArray[i].type;
            dbMsg = dbMsg + ",rType=" + rType;
            var rElement = elementArray[i].element;
            dbMsg = dbMsg + ",rElement=" + rElement;
            if (rType === 'signage' || rType === 'audio' || rElement === 'audio' || rType === 'layout' || rType === 'wall' || rElement.match('fix_')) {
                if (rSC === ddelEndSceneCut) {
                    elementArray.splice(i, 1);
                    i--;
                } else {
                    dbMsg = dbMsg + "除外対象";
                }
            } else {
                elementArray.splice(i, 1);
                i--;
            }
            // if (startElementIndex == -1) {
            //     startElementIndex = i;
            // }
            // if (nextSC !== '') { //次のカットが有れば
            //     if (rType === 'audio' || rElement === 'audio' || rType === 'layout' || rType === 'wall' || rElement.match('fix_')) {
            //         var nextCutType;
            //         var nextCutElement;
            //         if (cutArray[scIndex + 1]) {
            //             nextCutType = cutArray[scIndex + 1][rType];
            //             nextCutElement = cutArray[scIndex + 1][rElement];
            //         }
            //         dbMsg = dbMsg + ",nextCutType=" + nextCutType;
            //         dbMsg = dbMsg + ",nextCutElement=" + nextCutElement;
            //         if (nextCutElement || nextCutType) { //Scene要素が
            //             dbMsg = dbMsg + "次のカットに有り";
            //             elementArray.splice(i, 1);
            //             i--;
            //         } else {
            //             dbMsg = dbMsg + "次のカットへ";
            //             elementArray[i].scene_cut = nextSC;
            //         }
            //     } else { //Scene要素でなければ
            //         elementArray.splice(i, 1); //消す
            //         i--;
            //     }
            // } else { //次のカットが無ければ
            //     elementArray.splice(i, 1);
            //     i--; //削除した分、次の判定がスキップされるのでカウンタを戻す
            // }
        }
    }
    // if (isThisCut == true) { //deletSceneからの呼出しでなければ
    //     dbMsg = dbMsg + ">elementArrayのインデックス=" + startElementIndex + "から" + elementArray.length + "件まで(cut=" + cutArray.length + "件)";
    //     var b_wrSC = '';
    //     if (-1 < startElementIndex) {
    //         for (i = startElementIndex; i < elementArray.length; i++) { //カットNoの修正ループ
    //             var wrSC = elementArray[i].scene_cut;
    //             if (b_wrSC === '') {
    //                 b_wrSC = wrSC;
    //             }
    //             var compStrs = wrSC.split('c');
    //             var compScene = compStrs[0];
    //             if (compScene === delScene) {
    //                 dbMsg = dbMsg + "置換え(" + i + ")" + wrSC + 'を(' + compScene + ')=' + elementArray[i].element;
    //                 if (wrSC !== b_wrSC) {
    //                     startCutNo++;
    //                     b_wrSC = wrSC;
    //                 }
    //                 var reWrSC = delScene + 'c0' + startCutNo;
    //                 if (9 < startCutNo) {
    //                     reWrSC = delScene + 'c' + startCutNo;
    //                 }
    //                 dbMsg = dbMsg + ">>reWrSC=" + reWrSC;
    //                 elementArray[i].scene_cut = reWrSC;
    //             }
    //         } //カットNoの修正ループ
    //     }
    //     makeCutArray(elementArray2localStorage(scRenameElementArray(elementArray)));
    //     document.getElementById('reCutNamber_bt').style.display = 'none'
    // }
    dbMsg = dbMsg + ",elementArray=" + elementArray.length + "件に";
    myLog(dbMsg);
    if (dbMsg == true) {
        console.log(elementArray);
    }
    elementArray.sort(
        function(a, b) {
            var retInt = elementArraySort(a, b);
            return retInt;
        }
    );
    elementArray = scRenameElementArray();
    makeCutArray(elementArray2localStorage(scRenameElementArray(elementArray)));
    // makeCutArray(elementArray);

    dbMsg = dbMsg + ",detSn=" + delSceneStr;
    myLog(dbMsg);
    if (dbMsg == true) {
        console.log(elementArray);
    }
    $("#" + delSceneStr + 'd').collapse('show'); //対象パネルの再表示
    // } catch (e) {
    //     dbMsg = dbMsg + ';エラー;' + e;
    //     console.log(dbMsg);
    // }
} //指定されたシーンカットに該当するelementArrayのレコードをすべて削除し、再描画

/**
 * 新規カットのデータとnodeをシーンの末尾に作成する
 * @param {*} sceneNo 
 * addCutとaddScene
 */
function addCut2Node(sceneNo) {
    var tag = "[addCut2Node]";
    var dbMsg = tag;
    var scName = sceneNo + "c01";
    if (elementArray) {
        console.log(elementArray);
    } else {
        dbMsg = dbMsg + "localStorageから";
        elementArray = JSON.parse(localStorage.getItem('elementArray'));
    }
    bratherList = makeBratherList(scName);
    var targetPosition = -1;
    if (bratherList) {
        dbMsg = dbMsg + ",bratherList=" + bratherList.length + "件中,";
        targetPosition = bratherList.length + 1;
        // var listEndPosition = bratherList.length;
        // dbMsg = dbMsg + "中,現在" + nowElementName + "から";
        var repName = bratherList[targetPosition - 1];
        dbMsg = dbMsg + repName + "の下に";
        var sceneCut = sceneNo + "c0" + targetPosition;
        if (9 < targetPosition) {
            sceneCut = sceneNo + "c" + targetPosition;
        }
    } else {
        sceneCut = scName;
    }
    dbMsg = dbMsg + sceneCut + "を作成";
    var tpl = Hogan.compile($('#tpl_cut').text());
    var html = tpl.render({
        sceneNo: sceneNo,
        sceneCut: sceneCut,
    });
    $('#' + sceneNo + '_group').append(html);
    var elemArray = makeNewElementRecord(sceneCut, "top_left", "text", '');
    myLog(dbMsg);
    if (dbMsg == true) {
        console.log(elementArray);
    }

    document.getElementById(sceneCut + '_title').innerHTML = sceneCut;
    document.getElementById(sceneCut + '_sc_summary').innerHTML = elementArray[elementArray.length - 1]['souce'];
    var scElement = sceneCut + '_' + elementArray[elementArray.length - 1]['element'];
    dbMsg = dbMsg + ",scElement=" + scElement;

    tpl = Hogan.compile($('#tpl_element').text());
    html = tpl.render({
        sceneNo: sceneNo,
        sceneCut: sceneCut,
        scElement: scElement,
    });
    $('#' + sceneCut + '_table').append(html);
    document.getElementById(scElement + '_type').innerHTML = elementArray[elementArray.length - 1]['type'];
    document.getElementById(scElement + '_elm').innerHTML = elementArray[elementArray.length - 1]['element'];
    document.getElementById(scElement + '_souce').innerHTML = elementArray[elementArray.length - 1]['souce'];

    // document.getElementById(sceneCut + '_down_bt').style.display = 'none';
    var b_SN = sceneNo + 'c0' + (targetPosition - 1);
    if (9 < (targetPosition - 1)) {
        b_SN = sceneNo + 'c' + (targetPosition - 1);
    }
    if (document.getElementById(b_SN + '_down_bt')) {
        document.getElementById(b_SN + '_down_bt').style.display = '';
    }

    elementArray.sort(
        function(a, b) {
            var retInt = elementArraySort(a, b);
            return retInt;
        }
    );
    // console.log(elementArray);
    // makeCutArray(elementArray2localStorage(scRenameElementArray(elementArray)));
    makeCutArray(elementArray);
    // document.getElementById('reCutNamber_bt').style.display = 'none'
    myLog(dbMsg);
    if (dbMsg == true) {
        console.log(elementArray);
        // console.log(cutArray);
    }
    $("#" + sceneNo + 'd').collapse('show');
} //新規カットのデータとnodeをシーンの末尾に作成する

/**
 * 指定以降のシーンナンバーを上に詰める
 * @param {*} startScene 
 */
function underScene2Up(startScene) {
    var tag = "[underScene2Up]";
    var dbMsg = tag;
    dbMsg = dbMsg + 'startScene=' + startScene + "(" + elementArray.length + "件中)";
    var startSceneNo = startScene.substr(1, startScene.length - 2) * 1;
    dbMsg = dbMsg + 'startSceneNo=' + startSceneNo;
    var rewriteSceneNo = startSceneNo;
    var b_rewriteSceneNo = rewriteSceneNo;
    var rewriteScene = 's0' + rewriteSceneNo + '0';
    if (10 < rewriteSceneNo) {
        rewriteScene = 's' + rewriteSceneNo + '0';
    }
    for (var i = 0; i < elementArray.length; i++) {
        var rSC = elementArray[i].scene_cut;
        var rSCStrs = rSC.split('c');
        var rSceneStr = rSCStrs[0];
        var rSceneNo = rSceneStr.substr(1, 2) * 1;
        if (startSceneNo < rSceneNo) {
            dbMsg = dbMsg + "(" + i + ")rSceneStr=" + rSceneStr + ",rSceneNo=" + rSceneNo;
            rewriteSceneNo = rSceneNo - 1;
            if (b_rewriteSceneNo < rewriteSceneNo) {
                rewriteScene = 's0' + rewriteSceneNo + '0';
                if (10 < rewriteSceneNo) {
                    rewriteScene = 's' + rewriteSceneNo + '0';
                }
                b_rewriteSceneNo = rewriteSceneNo;
            }
            var rCutStr = 'c' + rSCStrs[1];
            var rewriteSceneCut = rewriteScene + rCutStr;
            dbMsg = dbMsg + ",rewriteSceneCut" + rewriteSceneCut;
            elementArray[i].scene_cut = rewriteSceneCut;
        }
    }

    myLog(dbMsg);
    if (dbMsg == true) {
        console.log(elementArray);
    }
    return elementArray;
} //指定以降のシーンナンバーを上に詰める

/**
 * カットを指定されたシーンに異動する
 * @param {*} event 
 */
function moveSceneBody(event) {
    var tag = "[moveSceneBody]";
    var dbMsg = tag;
    var eventElement = event.target;
    if (elementArray) {} else {
        dbMsg = dbMsg + "呼出し";
        elementArray = JSON.parse(localStorage.getItem('elementArray'));
    }
    dbMsg = dbMsg + ",elementArray=" + elementArray.length + "件";
    var elementID = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",elementID=" + elementID;
    var targetSC = document.getElementById('dlog_targrt').innerText;
    dbMsg = dbMsg + ",targetSC=" + targetSC;
    var scStrs = targetSC.split('c');
    var sceneStr = scStrs[0];
    var motoEndCut = getSceneEndCut(sceneStr);
    var repScene = event.target.value; // 選択されている値を取得
    dbMsg = dbMsg + ",repScene=" + repScene;
    document.getElementById('modal_close').click(); //クローズボックスクリックでダイアログを閉じる

    var endCut = getSceneEndCut(repScene);
    dbMsg = dbMsg + ",endCut=" + endCut;
    var cutNo = endCut + 1;
    dbMsg = dbMsg + ">cutNo>" + cutNo;
    if (cutNo < 10) {
        cutNo = 'c0' + cutNo;
    } else {
        cutNo = 'c' + cutNo;
    }
    var repSC = repScene + cutNo;
    dbMsg = dbMsg + ",repSC=" + repSC;
    localStorage.setItem('fws_opeScene', repSC);

    var elemArray = sceneCutReWrite(targetSC, repSC);

    dbMsg = dbMsg + ",motoEndCut=" + motoEndCut;
    if (motoEndCut === 1) {
        elemArray = underScene2Up(sceneStr)
    }
    elemArray.sort(
        function(a, b) {
            var retInt = elementArraySort(a, b);
            return retInt;
        }
    );

    myLog(dbMsg);
    if (debug_now == true) {
        console.log(elemArray);
    }
    makeCutArray(elemArray); //再読み込み


    // var nowBratherList = makeBratherList(nowElementName);
    // bratherList = makeBratherList(scName);
    // var targetPosition = -1;
    // if (bratherList) {
    //     dbMsg = dbMsg + ",bratherList=" + bratherList.length + "件";
    //     targetPosition = bratherList.length;
    //     var listEndPosition = bratherList.length;
    //     dbMsg = dbMsg + "中,現在" + nowElementName + "から";
    //     var repName = bratherList[targetPosition - 1];
    //     dbMsg = dbMsg + repName + "の下に移動";
    //     var repNode = document.getElementById(repName); //☆入れ替え前に取得
    //     var sameClass = document.getElementsByClassName('recordUp');
    //     var repObj = sameClass[repName];
    //     $('#' + repName).after($('#' + nowElementName)); //http://cly7796.net/wp/javascript/to-insert-or-move-by-operating-the-dom/
    //     document.getElementById(repName + "_down_bt").style.display = 'inline-block';
    //     // document.getElementById(nowElementName + "_down_bt").style.display = 'none';
    //     if (targetPosition < 10) {
    //         scName = sceneNo + "c0" + (targetPosition + 1);
    //     } else {
    //         scName = sceneNo + "c" + (targetPosition + 1);
    //     }
    //     dbMsg = dbMsg + ",追加カットは" + scName;
    //     sceneCutCangeNumber(nowElementName, scName);
    //     if (nowBratherList) {
    //         dbMsg = dbMsg + ",nowBratherList=" + nowBratherList.length + "件";
    //         var startPosition = getCutArrayIndex(nowElementName) + 1; //nowBratherList.indexOf(nowElementName);
    //         var scStrs = nowElementName.split('c');
    //         var cNo = scStrs[1] * 1;
    //         var endPosition = startPosition + (nowBratherList.length - cNo);
    //         dbMsg = dbMsg + ",cutArrayの" + startPosition + "～" + endPosition + "を更新";
    //         for (var i = startPosition; i < endPosition; i++) {
    //             var rSC = cutArray[i]['scene_cut'];
    //             dbMsg = dbMsg + ",(" + i + ")" + rSC;
    //             var scStrs = rSC.split('c');
    //             var sNo = scStrs[0];
    //             var cNo = scStrs[1] - 1;
    //             var cSC = sNo + "c0" + cNo;
    //             if (9 < cNo) {
    //                 cSC = sNo + "c" + cNo;
    //             }
    //             dbMsg = dbMsg + "を" + cSC + "に";
    //             sceneCutCangeNumber(rSC, cSC);
    //         }
    //     }
    //     myLog(dbMsg);
    //     if (dbMsg == true) {
    //         // console.log(elementArray);
    //         // console.log(targetCutArray);
    //     }
    // }
} //カットを指定されたシーンに異動する・セレクタ選択以降の処理

/**
 * そのカットを別のシーンへ移動・ダイアログ表示まで
 * @param {*} event 
 */
function moveSheen(event) {
    var tag = "[moveSheen]";
    var dbMsg = tag;
    // myAlert('カットを他のシーンに移動する機能は只今制作中です');
    var eventElement = event.target;
    targetName = eventElement.getAttribute('name');
    dbMsg = dbMsg + ",targetName=" + targetName; // this>>obj だと obj.getAttribute('name'); //event.srcElement,target,toElementはspanタグ,divはundefined,event.path[0]などはタグ
    document.getElementById('scene_slsect_gr').style.display = "inline";
    document.getElementById('templeat_slsect_gr').style.display = "none";
    var scStrs = targetName.split('c');
    var sceneStr = scStrs[0];
    document.getElementById(sceneStr + '_select').selected = "selected"; // document.setform.scene_slsect.options[nowPearent].selected = "selected";
    dlogSet(targetName, moveSheenTitol);

    myLog(dbMsg);
    if (dbMsg == true) {
        console.log(event);
        console.log(elementArray);
    }
} //そのカットを別のシーンへ移動・ダイアログ表示まで

/**
 * 下へ移動するボタンから自分自身と親エレメント検索し、次のエレメントと入れ替え
 * 入れ替え後、IDの振り直しと
 * 一番下になった場合、ボタンの非表示処理を行う
 * @param {*} elentName 
 * @param {*} pearentID 
 * http://www.hp-stylelink.com/news/2014/04/20140422.php
 * http://zombiebook.seesaa.net/article/42061419.html
 */
function recordDown(event) {
    var tag = "[recordDown]";
    var dbMsg = tag; // + ",elentName=" + elentName + ",pearentID=" + pearentID;
    // console.log(event);
    var eventElement = event.target;
    var elementName = eventElement.getAttribute('name');
    dbMsg = dbMsg + ",elementName=" + elementName; // elementName=s030c03
    var targetSC = elementName;
    dbMsg = dbMsg + ",targetSC=" + targetSC;
    var scStrs = targetSC.split('c');
    var sceneStr = scStrs[0];
    dbMsg = dbMsg + ",sceneStr=" + sceneStr;
    var motoScene = sceneStr;
    var repSceneStr = sceneStr;
    var sceneNo = sceneStr.substr(1, scStrs[0].length - 2) * 1;
    dbMsg = dbMsg + ",sceneNo=" + sceneNo;
    var motoSceneNo = sceneNo;
    var repSceneNo = sceneNo;
    var cutNo = scStrs[1] * 1;
    dbMsg = dbMsg + ",cutNo=" + cutNo;
    var motCut = cutNo;
    var endCut = getSceneEndCut(motoScene);
    dbMsg = dbMsg + ",endCut=" + endCut;
    var repCutStr = 'c01';
    if (cutNo === endCut) {
        dbMsg = dbMsg + ",下のカットへ";
        repSceneNo = sceneNo + 1;
        repSceneStr = sceneNum2Str(repSceneNo);
        dbMsg = dbMsg + ",repSceneStr=" + repSceneStr;
        var nextSceneEndCut = getSceneEndCut(repSceneStr) + 1;
        dbMsg = dbMsg + ",nextSceneEndCut=" + nextSceneEndCut;
        for (var i = nextSceneEndCut; 0 < i; i--) { //var i = 1; i < nextSceneEndCut; i++//
            dbMsg = dbMsg + "\n(" + i + ")";
            var tSC = repSceneStr + cutNum2Str(i);
            var rSC = repSceneStr + cutNum2Str(i + 1);
            dbMsg = dbMsg + ",tSC=" + tSC + "をrSC=" + rSC;
            var elemArray = sceneCutReWrite(tSC, rSC);
        }
        cutNo = 1;
    } else if (cutNo < endCut) {
        cutNo = cutNo + 1;
    }
    // repCutStr = repSceneStr + cutNum2Str(cutNo);
    var repSC = repSceneStr + cutNum2Str(cutNo);
    dbMsg = dbMsg + ",repSC=" + repSC;
    var elemArray = sceneCutReplece(targetSC, repSC);
    localStorage.setItem('fws_opeScene', repSC);
    sceneCutAllReNumber('s010c01');
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(elemArray);
    }
    // makeCutArray(elemArray); //再読み込み
} // ↓ボタンで次のカットと入れ替え

/**
 * ↟ボタンで前のカットと入れ替え
 * @param {*} event 
 */
function recordUp(event) {
    var tag = "[recordUp]";
    var dbMsg = tag;
    var eventElement = event.target;
    var elementName = eventElement.getAttribute('name');
    dbMsg = dbMsg + ",elementName=" + elementName; // elementName=s030c03
    var targetSC = elementName;
    dbMsg = dbMsg + ",targetSC=" + targetSC;
    var scStrs = targetSC.split('c');
    var sceneStr = scStrs[0];
    dbMsg = dbMsg + ",sceneStr=" + sceneStr;
    var motoScene = sceneStr;
    var endCut = getSceneEndCut(motoScene);
    var sceneNo = sceneStr.substr(1, scStrs[0].length - 2) * 1;
    dbMsg = dbMsg + ",sceneNo=" + sceneNo;
    var motoSceneNo = sceneNo;
    var cutNo = scStrs[1] * 1;
    dbMsg = dbMsg + ",cutNo=" + cutNo;
    var motCut = cutNo;
    if (1 < cutNo) {
        cutNo = cutNo - 1;
    } else {
        if (1 < sceneNo) {
            sceneNo = sceneNo - 1;
        }
        sceneStr = sceneNum2Str(sceneNo);
        dbMsg = dbMsg + ">sceneStr>" + sceneStr;
        cutNo = getSceneEndCut(sceneStr);
        cutNo = cutNo + 1;
    }
    cutNo = cutNum2Str(cutNo);
    var repSC = sceneStr + cutNo;
    dbMsg = dbMsg + ",repSC=" + repSC;
    localStorage.setItem('fws_opeScene', repSC);

    var elemArray = sceneCutReplece(targetSC, repSC);

    if (repSC === 's010c01') {
        elemArray = makeNewElementRecord('s010c01', "wall", "wall", '');
        elemArray = makeNewElementRecord('s010c01', "layout", "layout", '');
    }
    sceneCutAllReNumber('s010c01');
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(elemArray);
    }
    makeCutArray(elemArray); //再読み込み
} // ↟ボタンで前のカットと入れ替え

function recordEdit(event) {
    var tag = "[recordEdit]";
    var dbMsg = tag;
    var eventElement = event.target;
    var sceneCut = eventElement.getAttribute('name');
    // dbMsg = dbMsg + ",sceneCut=" + sceneCut; // + ",pearentID=" + pearentID;
    // dbMsg = dbMsg + ",textFileName=" + textFileName; // + ",pearentID=" + pearentID;
    // var escapeStr = textFileName + '&' + sceneCut;
    // dbMsg = dbMsg + ",escapeStr=" + escapeStr; // + ",pearentID=" + pearentID;
    // // var eventParent = eventElement.parentNodes;
    // // dbMsg = dbMsg + ",eventParent=" + eventParent.name; // + ",pearentID=" + pearentID;
    dbMsg = dbMsg + ">send>" + 'edit.htm?' + escape(sceneCut); // + ",pearentID=" + pearentID;
    myLog(dbMsg);
    window.location.href = 'edit.htm?' + escape(sceneCut);
    // console.log(event);
    // console.log(event.target);
} //編集画面へ

function deletCut(event) {
    var tag = "[deletCut]";
    var dbMsg = tag;
    var eventElement = event.target;
    // dbMsg = dbMsg + ",eventElement=" + eventElement;
    nowElementName = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",nowElementName=" + nowElementName; //s050c03_del_bt
    var nodeStrs = nowElementName.split('_');
    var delSC = nodeStrs[0];
    var res = confirm(delSC + "を削除します。");
    myLog(dbMsg);
    if (res == true) { // OKなら削除
        dellCutloop(delSC, true);
    }
} //そのカットを削除

/**
 * bt;カットを追加
 * @param {*} event 
 */
function addCut(event) {
    var tag = "[addCut]";
    var dbMsg = tag;
    var eventElement = event.target;
    // dbMsg = dbMsg + ",eventElement=" + eventElement;
    nowElementName = eventElement.getAttribute('name');
    dbMsg = dbMsg + ",nowElementName=" + nowElementName;
    if (nowElementName) { //エレメント名を取得できないタイミングがある
        var res = confirm(nowElementName + "にカットを追加します。");
        myLog(dbMsg);
        if (res == true) { // OKなら追加
            addCut2Node(nowElementName);
        }
    }

} //bt;カットを追加
//シーン操作////////////////////////////////////////////////////////////////カット操作///
function scenedDown(event) {
    var tag = "[scenedDown]";
    var dbMsg = tag;
    var eventElement = event.target;
    // dbMsg = dbMsg + ",eventElement=" + eventElement;
    nowElementName = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",nowElementName=" + nowElementName;
    var nodeStrs = nowElementName.split('_');
    var sceneName = nodeStrs[0];
    dbMsg = dbMsg + ",対象シーン=" + sceneName;
    var sceneNo = sceneName.substr(1, 2) * 1 + 1;
    dbMsg = dbMsg + ">>" + sceneNo;
    var downSceneNAme = "s0" + sceneNo + '0';
    dbMsg = dbMsg + ">>" + downSceneNAme;
    // $('#' + downSceneNAme).after($('#' + sceneName)); //http://cly7796.net/wp/javascript/to-insert-or-move-by-operating-the-dom/
    myLog(dbMsg);
    changeSceneElement(sceneName, downSceneNAme);
    // document.getElementById(sceneName + "_down_bt").style.display = '';
}

/**
 * シーンパネルのアップボタンクリック
 * @param {*} event 
 */
function scenedUp(event) {
    var tag = "[scenedUp]";
    var dbMsg = tag;
    var eventElement = event.target;
    // dbMsg = dbMsg + ",eventElement=" + eventElement;
    nowElementName = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",nowElementName=" + nowElementName;
    var nodeStrs = nowElementName.split('_');
    var sceneName = nodeStrs[0];
    dbMsg = dbMsg + ",移動対象シーン=" + sceneName;
    var sceneNo = sceneName.substr(1, 2) * 1 - 1;
    dbMsg = dbMsg + ">>" + sceneNo;
    var upSceneNAme = "s0" + sceneNo + '0';
    if (9 < sceneNo) {
        upSceneNAme = "s" + sceneNo + '0';
    }
    dbMsg = dbMsg + ">upSceneNAme>" + upSceneNAme;
    // $('#' + upSceneNAme).before($('#' + sceneName)); //http://cly7796.net/wp/javascript/to-insert-or-move-by-operating-the-dom/
    myLog(dbMsg);
    changeSceneElement(sceneName, upSceneNAme);
    // document.getElementById(sceneName + "_down_bt").style.display = '';
} //シーンパネルのアップボタンクリック

/**
 * そのシーンを削除する
 * @param {*} event 
 * Nodeからそこに属すカットをdellCutloopで削除する
 */
function deletScene(event) {
    var tag = "[deletScene]";
    var dbMsg = tag;
    var eventElement = event.target;
    // dbMsg = dbMsg + ",eventElement=" + eventElement;
    nowElementName = eventElement.getAttribute('id');
    dbMsg = dbMsg + ",nowElementName=" + nowElementName;
    var nodeStrs = nowElementName.split('_');
    var delScene = nodeStrs[0];
    var res = confirm(delScene + "を削除します。");
    if (res == true) { // OKなら削除
        bratherList = makeBratherList(delScene + 'c01');
        for (var j = 0; j < bratherList.length; ++j) {
            var sceneCut = bratherList[j] + '';
            dbMsg = dbMsg + "(" + j + ")" + sceneCut;
            dellCutloop(sceneCut, false);
        }
        // var delNode = document.getElementById(delScene); //削除対象
        // if (delNode) {
        //     delNode.style.display = "none";
        //     // delNode.parentNode.removeChild(delNode);
        // }
        myLog(dbMsg);
        makeCutArray(elementArray2localStorage(scRenameElementArray(elementArray)));
        // document.getElementById('reCutNamber_bt').style.display = 'none'
    }
} //そのシーンを削除する

/**
 * 最後のシーンを追加する
 * @param {*} event 
 */
function addScene(event) {
    var tag = "[addScene]";
    var dbMsg = tag;
    if (elementArray) {} else {
        var elementArrayObj = JSON.parse(localStorage.getItem('elementArray')); //localStorageから読み出し
        elementArray = $.extend(true, [], elementArrayObj); //☆[]で配列にする
    }
    dbMsg = dbMsg + ",elementArray=" + elementArray.length + "件";
    var lastSC = 's000c01';
    if (1 < elementArray.length) {
        lastSC = elementArray[elementArray.length - 1]['scene_cut'];
    }
    dbMsg = dbMsg + ",最終シーン=" + lastSC;
    var scStr = lastSC.split('c');
    var lastScene = scStr[0];
    dbMsg = dbMsg + ",追加シーン=" + lastScene;
    lastScene = lastScene.slice(1, 3) * 1;
    lastScene++;
    if (9 < lastScene) {
        lastScene = "s" + lastScene + "0"
    } else {
        lastScene = "s0" + lastScene + "0"
    }
    dbMsg = dbMsg + ">>" + lastScene;

    var addSC = lastScene + 'c01'
    dbMsg = dbMsg + "に" + addSC + "追加";
    var tpl = Hogan.compile($('#tpl_scene').text());
    var html = tpl.render({
        sceneNo: lastScene,
        sceneCut: sceneCut,
    });
    $('#scene_list').append(html);
    document.getElementById(lastScene + '_title').innerText = lastScene + ' 追加シーン';
    addCut2Node(lastScene);
    // makeCutArray(elementArray2localStorage(scRenameElementArray(elementArray)));
    myLog(dbMsg);
} //最後のシーンを追加する
//サイドメニュー/////////////////////////////////////////////////////////シーン操作///
/**
 * この並びでカットナンバーを更新
 * @param {*} event 
 */
function reCutNamber(event) {
    var tag = "[reCutNamber]";
    var dbMsg = tag;
    sceneCutAllReNumber('s010c01');
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(elementArray);
    }
    // makeCutArray(elementArray);
    // document.getElementById('reCutNamber_bt').style.display = 'none'
    document.getElementById('player_bt').style.display = 'inline-block'
} //bt;この並びでカットナンバーを更新

/**
 * テンプレートセレクトの処理
 * @param {*} event 
 */
function readTempretBody(event) {
    var tag = "[readTempretBody]";
    var dbMsg = tag;
    var selectedIndex = event.target.selectedIndex; // 選択されている値を取得
    dbMsg = dbMsg + ",selectedIndex=" + selectedIndex;
    document.getElementById('modal_close').click(); //クローズボックスクリックでダイアログを閉じる
    var textFileName = 'sample/marrig_endroll/conte.txt';
    switch (selectedIndex) {
        case 1:
            textFileName = 'sample/prezen/prezen.txt';
            break;
    }
    dbMsg = dbMsg + ",textFileName=" + textFileName;
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
    templeteRead(textFileName);
    location.reload(true);
} //テンプレートセレクトの処理

/**
 * テンプレートボタンのクリック
 * @param {*} event 
 */
function readTempret(event) {
    var tag = "[readTempret]";
    var dbMsg = tag;
    localStorage.setItem('fws_opeScene', '');
    document.getElementById('scene_slsect_gr').style.display = "none";
    document.getElementById('templeat_slsect_gr').style.display = "inline";
    if (textFileName.match('conte')) {
        document.getElementById('templeat_conte').selected = "selected"; // document.setform.scene_slsect.options[nowPearent].selected = "selected";
    } else if (textFileName.match('prezen')) {
        document.getElementById('templeat_prezen').selected = "selected"; // document.setform.scene_slsect.options[nowPearent].selected = "selected";
    }
    dlogSet('', readTempretTitol);

    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elementArray);
    }
} //bt;テンプレートボタンのクリック

/**
 * データ読み込みボタンのクリックでFileReaderを開きテキストファイルを読み込む
 * @param {*} event 
 */
function readUrl(event) {
    var tag = "[readUrl]";
    var dbMsg = tag;
    var outPass = event.target.value;
    dbMsg = dbMsg + "outPass=" + outPass;
    var file = event.target.files;
    var reader = new FileReader(); //FileReaderの作成
    reader.readAsText(file[0]); //テキスト形式で読み込む
    textFileName = file[0].name;
    var tfStrs = textFileName.split('.');
    textFileName = tfStrs[0];
    dbMsg = dbMsg + ",textFileName=" + textFileName;
    signageName = textFileName;
    localStorage.setItem('fws_textFileName', textFileName);
    dbMsg = dbMsg + ",type=" + file[0].type;
    dbMsg = dbMsg + ",size=" + file[0].size;

    reader.onload = function(ev) { //読込終了後の処理
        initlocalStorage();
        localStorage.setItem('fws_opeScene', '');
        convertTabText2Array(reader.result);
        location.reload(true);
    }
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(file);
    }
    // return outPass;
} //データ読み込みボタンのクリックでFileReaderを開きテキストファイルを読み込む

/**
 * データ読み込みボタンのクリック
 * @param {*} event 
 */
function readData(event) {
    var tag = "[readData]";
    var dbMsg = tag;
    // myAlert('データを読み込む機能は現在開発中です。\n現在はテンプレートと同じ機能を割り当てています。');
    document.getElementById('read_url').click();
    // var sysCh = fileSysCheck();
    // dbMsg = dbMsg + sysCh;
    // myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elementArray);
    }
} //データ読み込みボタンのクリック

function saveData(event) {
    var tag = "[saveData]";
    var dbMsg = tag;
    // myAlert('データを書き出す機能は只今制作中です。\nこの機能は皆さんが編集したデータをご自身のPCに保存し、再利用できる様、開発中です。');
    textFileName = signageName;
    var elemArray = JSON.parse(localStorage.getItem('elementArray')); // var elementArray2 = JSON.parse(localStorage.getItem('elementArray'));
    dbMsg = dbMsg + ',text=' + elemArray.length + "件";
    var retType = getElementType("s000c00", "signage");
    if (retType !== "signage") {
        elemArray = makeNewElementRecord("s000c00", "signage", "signage", textFileName);
    }
    convertArray2TabText(elemArray)
        // writeToLocal("hoge.txt", elementArray2);     //http://naopr.hatenablog.com/entry/20140401/1396341503
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elementArray);
    }
} //bt;書込み

function baceWidthPx(event) {
    var tag = "[baceWidthPx]";
    var dbMsg = tag;
    if (event) {
        baceWidth = event.target.value;
    } else {
        baceWidth = document.getElementById('disp_width_px').value * 1;
    }
    dbMsg = dbMsg + "表示幅=" + baceWidth;
    localStorage.setItem('fws_baceWidth', baceWidth);
    var elemArray = reWrightElemenValue("s000c00", "signage", 'width', baceWidth + '', "signage");
    document.getElementById('bace_rotation').disabled = false;
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
} //使用するデイスプレイの高さ

/**
 * 使用するデイスプレイの高さ
 * @param {*} event 
 */
function baceHightPx(event) {
    var tag = "[baceHightPx]";
    var dbMsg = tag;
    if (event) {
        baceHeight = event.target.value;
    } else {
        baceHeight = document.getElementById('disp_hight_px').value * 1;
    }
    dbMsg = dbMsg + "表示高さ=" + baceHeight;
    localStorage.setItem('fws_baceHeight', baceHeight);
    var elemArray = reWrightElemenValue("s000c00", "signage", 'hight', baceHeight + '', "signage");
    document.getElementById('bace_rotation').disabled = false;
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
} //使用するデイスプレイの高さ

/**
 * 編集しているこのディスプレイで表示する
 * @param {*} event 
 */
function useThisWindow(event) {
    var tag = "[useThisWindow]";
    var dbMsg = tag;
    isThisWindow = event.target.checked;
    dbMsg = dbMsg + 'isThisWindow=' + isThisWindow;
    // localStorage.setItem('fws_thisWindow', isThisWindow);
    var winW = window.parent.screen.width * 1; //モニター画面の幅
    var winH = window.parent.screen.height * 1; //$(window).height(); //window.innerHeight;
    dbMsg = dbMsg + ",window[" + winW + "×" + winH + "]";
    document.getElementById('disp_width_px').value = winW;
    document.getElementById('disp_hight_px').value = winH;
    baceWidthPx();
    baceHightPx();
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
} //編集しているこのディスプレイで表示する

/**
 * 読み取った画像サイズの縦横を入れ替える
 * @param {*} event 
 */
function baceRotation(event) {
    var tag = "[baceRotation]";
    var dbMsg = tag;
    var rW = document.getElementById('disp_width_px').value * 1;
    var rH = document.getElementById('disp_hight_px').value * 1;
    dbMsg = dbMsg + "[" + rW + "×" + rH + "]";
    document.getElementById('disp_width_px').value = rH;
    document.getElementById('disp_hight_px').value = rW;
    baceWidthPx();
    baceHightPx();
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(event);
    }
} //読み取った画像サイズの縦横を入れ替える

/**
 * 自動送り
 * @param {*} event 
 */
function autoSendBool(event) {
    var tag = "[autoSendBool]";
    var dbMsg = tag;
    autoSend = event.target.checked;
    dbMsg = dbMsg + 'autoSend=' + autoSend;
    localStorage.setItem('fws_autoSend', autoSend);
    var elemArray = reWrightElemenValue("s000c00", "signage", 'fontColorStr', autoSend + '', "signage");
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(event);
    }
} //自動送り

///起動～このページの構成開始//////////////////////////////////////////////サイドメニュー//

function writeSceneElement(rObj) {
    var tag = "[list.writeSceneElement]";
    var dbMsg = tag;
    var sceneCut = rObj.scene_cut;
    dbMsg = dbMsg + ",sceneCut=" + sceneCut;
    var elmId = rObj.element;
    dbMsg = dbMsg + ",elmId=" + elmId;
    var souce = rObj.souce;
    dbMsg = dbMsg + ",souce=" + souce;
    var scElement = sceneCut + '_' + elmId;
    // myLog(dbMsg);
    // if (debug_now == true) {
    //     console.log(cutArray);
    // }
    var tpl;
    if (elmId.match('wall')) {
        if (souce.match('#')) {
            tpl = Hogan.compile($('#tpl_element').text());
        } else {
            tpl = Hogan.compile($('#tpl_element_pict').text());
        }
    } else {
        tpl = Hogan.compile($('#tpl_element').text());
    }
    var html = tpl.render({
        scElement: scElement,
    });
    $('#' + sceneCut + '_table').append(html);
    document.getElementById(scElement + '_type').innerText = elmId;
    document.getElementById(scElement + '_elm').innerText = elmId;
    if (elmId.match('wall')) {
        if (souce.match('#')) {
            document.getElementById(scElement + '_souce').innerHTML = souce;
            document.getElementById(scElement + '_sub').style.backgroundColor = souce;
            document.getElementById(scElement + '_sub').style.marginLeft = '1em';
            document.getElementById(scElement + '_sub').style.width = '4em';
            document.getElementById(scElement + '_sub').style.height = '1.5em';
            document.getElementById(scElement + '_sub').style.borderStyle = 'solid';
            document.getElementById(scElement + '_sub').style.borderWidth = '1px';
            document.getElementById(scElement + '_sub').style.display = 'inline-block';
        } else {
            document.getElementById(scElement + '_souce').src = souce;
        }
    } else {
        document.getElementById(scElement + '_souce').innerHTML = souce;
    }
}

/**
 * 全シーンカットのリストアップ
 * 各エレメントの編集IFをhogan.jsで書き出す
 */
function writeEditElement() {
    var tag = "[list.writeEditElement]";
    var dbMsg = tag;
    dbMsg = dbMsg + cutArray.length + "カット";
    var b_sceneCut = '';
    var b_sceneNo = '';
    var b_cutNo = 0;

    var sceneArray = [];
    var sceneObj = new Object();
    if (localStorage.getItem('fws_textFileName')) {
        textFileName = localStorage.getItem('fws_textFileName'); //   var elementArray2 = JSON.parse(localStorage.getItem(elementArrayName));
        dbMsg = dbMsg + ",textFileName=" + textFileName;
    }
    endSceneCut = elementArray[elementArray.length - 1].scene_cut;
    dbMsg = dbMsg + ",endSceneCut=" + endSceneCut;
    var endScStrs = endSceneCut.split('c');
    var endSceneStr = endScStrs[0];
    // var endScene = endScene.substr(1, endScene.length - 2);
    if (textFileName.match('conte')) {
        signageName = "結婚式用エンドロールテンプレート";
    } else if (textFileName.match('prezen')) {
        signageName = "プレゼンスライドテンプレート";
    } else if (textFileName === signageName) {
        signageName = signageName;
    }
    dbMsg = dbMsg + ",signageName=" + signageName;

    document.getElementById('page_titol').innerHTML = signageName + 'のシーン・カットリスト'; //シーン選択リスト
    document.getElementById('scene_slsect').innerHTML = ''; //シーン選択リスト
    document.getElementById('scene_list').innerHTML = ''; //リストの書き込み範囲
    if (localStorage.getItem('fws_autoSend')) {
        autoSend = localStorage.getItem('fws_autoSend') + ''; //   var elementArray2 = JSON.parse(localStorage.getItem(elementArrayName));
    }
    dbMsg = dbMsg + ",autoSend=" + autoSend;
    document.getElementById('auto_send').checked = '';
    if (autoSend === 'true') {
        document.getElementById('auto_send').checked = true;
    }
    if (localStorage.getItem('fws_thisWindow')) {
        isThisWindow = localStorage.getItem('fws_thisWindow') + '';
    }
    dbMsg = dbMsg + ",isThisWindow=" + isThisWindow;
    // document.getElementById('use_this_window').checked = '';
    // if (isThisWindow === 'true') {
    //     document.getElementById('use_this_window').checked = true;
    // }
    if (localStorage.getItem('fws_baceWidth')) {
        baceWidth = localStorage.getItem('fws_baceWidth') + '';
    }
    if (localStorage.getItem('fws_baceHeight')) {
        baceHeight = localStorage.getItem('fws_baceHeight') + '';
    }
    dbMsg = dbMsg + "表示サイズ[" + baceWidth + "×" + baceHeight + "]";
    document.getElementById('disp_width_px').value = baceWidth;
    document.getElementById('disp_hight_px').value = baceHeight;
    var rW = document.getElementById('disp_width_px').value * 1;
    var rH = document.getElementById('disp_hight_px').value * 1;
    dbMsg = dbMsg + "[" + rW + "×" + rH + "]";
    if (rW === 0 || rH === 0) {
        document.getElementById('bace_rotation').disabled = true;
    }

    myLog(dbMsg);

    for (var j = 0; j < cutArray.length; ++j) {
        var sceneCut = cutArray[j].scene_cut + '';
        dbMsg = dbMsg + "(" + j + ")" + sceneCut;
        var snInfo = sceneCut.split('c');
        var sceneNo = snInfo[0];
        var cutNo = snInfo[1] * 1;
        dbMsg = dbMsg + "[scene=" + sceneNo + "cut=" + cutNo + "]";

        var tpl;
        if (b_sceneNo !== sceneNo) {
            tpl = Hogan.compile($('#tpl_scene').text());
            var html = tpl.render({
                sceneNo: sceneNo,
            });
            $('#scene_list').append(html);
            sceneArray[b_sceneNo] = $.extend(true, {}, sceneObj);
            if (sceneNo.match('s010')) {
                document.getElementById(sceneNo + '_up_bt').style.display = 'none';
            }
            tpl = Hogan.compile($('#tpl_scene_list_option').text());
            var html = tpl.render({
                sceneNo: sceneNo,
                sceneCut: sceneCut,
            });
            $('#scene_slsect').append(html);
            document.getElementById(sceneNo + '_select').innerText = sceneNo;
            b_sceneNo = sceneNo;
            sceneObj = new Object();
            document.getElementById(sceneNo + '_title').innerText = sceneNo;
        }

        tpl = Hogan.compile($('#tpl_cut').text());
        var html = tpl.render({
            sceneNo: sceneNo,
            sceneCut: sceneCut,
        });
        $('#' + sceneNo + '_group').append(html);
        document.getElementById(sceneCut + '_title').innerText = sceneCut;
        if (sceneCut === 's010c01') {
            document.getElementById(sceneCut + '_up_bt').style.display = 'none';
            if (sceneCut === endSceneCut) {
                document.getElementById(sceneCut + '_down_bt').style.display = 'none';
            }
        } else {
            document.getElementById(sceneCut + '_up_bt').style.display = '';
        }

        if (cutArray[j].layout) {
            writeSceneElement(cutArray[j].layout);
            sceneObj['layout'] = $.extend(true, {}, cutArray[j].layout);
        }
        if (cutArray[j].audio) {
            writeSceneElement(cutArray[j].audio);
            sceneObj['audio'] = $.extend(true, {}, cutArray[j].audio);
        }
        if (cutArray[j].wall) {
            writeSceneElement(cutArray[j].wall);
            sceneObj['wall'] = $.extend(true, {}, cutArray[j].wall);
        }
        if (cutArray[j].fix_left) {
            writeSceneElement(cutArray[j].fix_left);
            sceneObj['fix_left'] = $.extend(true, {}, cutArray[j].fix_left);
        }
        if (cutArray[j].fix_right) {
            writeSceneElement(cutArray[j].fix_right);
            sceneObj['fix_right'] = $.extend(true, {}, cutArray[j].fix_right);
        }

        for (var i = 0; i < elmSortIds.length; i++) {
            var b_souce = '';
            elmId = elmSortIds[i];
            dbMsg = tag + ",none(" + i + ")" + elmId;
            var scElement = sceneCut + '_' + elmId;
            var elmId = elmSortIds[i]; //elmName
            dbMsg = tag + "(" + i + ")" + elmId;
            var rObj = cutArray[j][elmId];
            // console.log(rObj);
            if (rObj) {
                var idInfo = elmId.split('_');
                var vPosition = idInfo[0];
                var hPosition = idInfo[1];
                var type = rObj.type;
                dbMsg = dbMsg + ",type=" + type;
                if (!elmId.match('fix')) {
                    if (type.match('pict')) {
                        tpl = Hogan.compile($('#tpl_element_pict').text());
                    } else {
                        tpl = Hogan.compile($('#tpl_element').text());
                    }
                    var html = tpl.render({
                        sceneNo: sceneNo,
                        sceneCut: sceneCut,
                        scElement: scElement,
                    });
                    $('#' + sceneCut + '_table').append(html);
                }
                var souce = rObj.souce + '';
                dbMsg = dbMsg + ",souce=" + souce;
                if (souce !== '') {
                    if (vPosition === 'fix' && cutNo === 1) { //elmId.match('fix_')       
                        document.getElementById(sceneNo + '_title').innerText = sceneNo + " ： " + souce;
                    } else if (elmId.match('top_left')) {
                        document.getElementById(sceneCut + '_sc_summary').innerText = souce;
                        //     document.getElementById(sceneCut + '_sc_summary').innerText = document.getElementById(sceneCut + '_sc_summary').innerText + " " + souce;
                    }
                    document.getElementById(scElement + '_type').innerText = type;
                    document.getElementById(scElement + '_elm').innerText = elmId;
                    if (type.match('pict')) {
                        document.getElementById(scElement + '_souce').src = souce;
                    } else {
                        document.getElementById(scElement + '_souce').innerHTML = souce;
                    } // dbMsg = dbMsg + ",vPosition=" + vPosition;                var type = rObj.type;
                }
            }
            if (endSceneStr == 's010') {
                document.getElementById(sceneCut + '_move_bt').style.display = 'none';
            }
        }
        b_sceneCut = sceneCut;
    }
    // document.getElementById(sceneCut + '_down_bt').style.display = 'none';
    document.getElementById(sceneNo + '_down_bt').style.display = 'none';

    sceneArray[b_sceneNo] = $.extend(true, {}, sceneObj);
    var opeScene = localStorage.getItem('fws_opeScene') + ''; //   var elementArray2 = JSON.parse(localStorage.getItem(elementArrayName));
    dbMsg = dbMsg + ',opeScene=' + opeScene;
    if (opeScene !== '') {
        var scStrs = opeScene.split('c');
        var sceneStr = scStrs[0];
        dbMsg = dbMsg + ",sceneStr=" + sceneStr;
        document.getElementById(sceneStr + '_title').click(); //操作後のアイテムを表示する
    }
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(sceneArray);
        // console.log(cutArray);
    }
} //全シーンカットのリストアップ

/**
 * cutArrayを受け取ってviewの画面を再構成
 * @param {*} scutArray 
 */
function receveCutArray(scutArray) {
    var tag = "[view.receveCutArray]";
    // var sCut = this.sceneCut;
    var dbMsg = tag; //+ "scene_cut=" + sCut;
    dbMsg = dbMsg + ";現在の対象=" + textFileName;
    cutArray = $.extend(true, [], scutArray); //配列コピー
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(cutArray);
    }
    writeEditElement();
}