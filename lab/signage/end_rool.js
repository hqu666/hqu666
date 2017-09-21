var debug_now = false;
var isStartNow = true;
var winW;
var winH;

var nextFunction;
var stayTime;

var feedOutElement;
var feedOutCount;
var eFontLate = 1.8; //英文本とにした時のサイズ倍率    //1.4では小さい
var cutFarstFontSize; //そのシーンの先頭で基本にするフォントサイズ
var rScene; //前のシーン
var fScene; //次のシーン

//スレッド管理///////////////////////////////////////////////////////////////////////////////////
var timerArray = new Array(); //左の一つ目
var audioFOArray = new Array();
var feedOutArray = new Array();
var cutArray2 = new Array();
//////////////////////////////////////////////////////////////////////////s

function audioCange(audioUrl, mStart, mPosition) {
    var tag = "[audioCange]";
    var dbMsg = tag;
    dbMsg = dbMsg + ",audio=" + audioUrl + "を" + mStart + "秒後に" + mPosition + "から";
    aUrl = audioUrl; //オーディオファイルのUrl
    aCalentTimel = mPosition; //オーディオファイルのカットごとのスタートポイント
    audioFOArray.push(setTimeout(function() {
        audioLoad2Play(audioUrl, mPosition * 1); //010=074_Arigatou
    }, mStart)); //終了フィールドの表示秒巣の半分で
    myLog(dbMsg);
}

function textCange(element, souce, fontFamily, left, width, fontSize) {
    var tag = "[textCange]";
    var dbMsg = tag;
    dbMsg = dbMsg + souce + "を" + element + "に" + fontSize + "pxでfontFamily=" + fontFamily + ",left=" + left + ",width=" + width;
    souce = souce.replace(/"/g, '');
    souce = souce.replace(/'/g, '');
    var retFSize = wrightScript(element, souce, fontFamily, left, width, fontSize);
    dbMsg = dbMsg + ">>" + retFSize + "px";
    myLog(dbMsg);
    return retFSize;
}

function viewLoop() {
    var tag = "[viewLoop]";
    var dbMsg = tag;
    if (localStorage.getItem('fws_autoSend')) {
        autoSend = localStorage.getItem('fws_autoSend') + ''; //   var elementArray2 = JSON.parse(localStorage.getItem(elementArrayName));
    }
    dbMsg = dbMsg + ",autoSend=" + autoSend;
    dbMsg = dbMsg + nextSC + "/" + cutArray.length + "カット";

    // isMoniter = false; //エディターからモニター表示
    // if (location.search.substring(1, location.search.length)) {
    //     dbMsg = dbMsg + 'location=' + location.search.substring(1, location.search.length); //scName
    //     isMoniter = true;
    // }
    // dbMsg = dbMsg + ",isMoniter=" + isMoniter;
    document.getElementById('cut_no').innerHTML = cutArray[nextSC].scene_cut
    $('#start_btn').css('display', 'none');
    $('#pouse_btn').css('display', 'inline-block');
    clossAllElement();
    if (cutTimeArray) {
        stopNIAnimation(cutTimeArray);
    }
    sceneCut = cutArray[nextSC].scene_cut;
    var sceneNo = sceneCut.slice(0, 4);
    var cutNo = sceneCut.slice(-3);
    if (nextSC == 0) {
        $('#rd_btn').css('display', 'none');
    } else if (nextSC == (cutArray.length - 1)) {
        $('#fs_btn').css('display', 'none');
    } else {
        $('#rd_btn').css('display', 'inline-block');
        $('#fs_btn').css('display', 'inline-block');
    }

    var sceneObj = cutArray[nextSC]['scene'];
    myLog(dbMsg);
    if (debug_now) {
        console.log(cutArray[nextSC]);
        console.log(sceneObj);
    }
    //壁紙設定////////////////////////////////////
    wallSrc = sceneObj.wall.souce; //このカットから始まる壁紙
    dbMsg = dbMsg + "、背景=" + wallSrc;
    wallOpacity = 0.5; //scene_wall_opacity
    if (sceneObj.wall.opacity) {
        wallOpacity = sceneObj.wall.opacity * 1; //scene_wall_opacity
    }
    dbMsg = dbMsg + "のOpacity=" + wallOpacity;
    wallalign = sceneObj.wall.align; //scene_wall_align
    dbMsg = dbMsg + ",align=" + wallalign; // now_wall = cutArray[nextSC].wall;
    var wStart = 0.0;
    if (sceneObj.wall.mStart) {
        wStart = sceneObj.wall.mStart * 1;
    }
    dbMsg = dbMsg + ",を" + wStart + "秒から";
    dbMsg = dbMsg + ",前は" + now_wall;
    // // if (!now_wall.match(wallSrc)) { //isMoniter = false; //エディターからモニター表示        cutArray[nextSC].wall
    // //     dbMsg = dbMsg + ">>壁紙変更";
    // //     now_wall = wallSrc;
    // //     wallCange(wallSrc, wallalign, wallOpacity, wStart);
    // // } else if (isMoniter == 'true' || isMoniter == true) { // || now_wall.match('')
    // // baceWidth = winW;
    // // baceHeight = winH;
    setWall();
    // var wallScale = getWindowScale("moniter_row"); //"moniter_bace"
    // dbMsg = dbMsg + "wallScale=" + wallScale;

    // // document.getElementById('back_bord').style.transform = 'scale(' + wallScale + ')'; //-webkit-transform: scale(0.9);
    // // document.getElementById('back_bord').style.webkitTransformOrigin = '0 0 0'; //左肩に指定しないと中心に寄せられる
    // var moniterScale = getWindowScale("moniter_row"); //"moniter_bace"
    // dbMsg = dbMsg + "、moniterScale=" + moniterScale;
    // var moniterW = baceWidth * moniterScale;
    // var moniterH = baceHeight * moniterScale;
    // dbMsg = dbMsg + "[" + moniterW + "×" + moniterH + "]";
    // cutPict2Element(backBord, "canvas_bace", 0, 0, moniterW, moniterH, 0, wallSrc, wallOpacity);
    // }
    //BGM設定///////////////////////////壁紙設定//
    thisCutDuration = cutArray[nextSC].time;
    aCalentTimel = cutArray[nextSC].audioPosition;
    // aCalentTimel = aCalentTimel + thisCutDuration / 1000;
    dbMsg = dbMsg + ",BGMの開始点" + aCalentTimel + "秒目";
    audioUrl = ''; //cutArray[nextSC].audio;
    if (sceneObj.audio) {
        audioUrl = sceneObj.audio.souce + ''; //cutArray[nextSC].audio;
        dbMsg = dbMsg + ",audio=" + audioUrl;
        var mStart = sceneObj.audio.mStart * 1; //cutArray[nextSC].mStart;
        dbMsg = dbMsg + ",mStart=" + mStart;
        var mPosition = sceneObj.audio.mPosition * 1; //cutArray[nextSC].mPosition;
        dbMsg = dbMsg + ",mPosition=" + mPosition;
        if (cutArray[nextSC].audioPosition) {
            mPosition = cutArray[nextSC].audioPosition * 1;
        }
        dbMsg = dbMsg + ",を" + mPosition + "m秒から";
        myLog(dbMsg);
        if (now_audioUrl !== audioUrl) { //cutArray[nextSC].audio
            dbMsg = dbMsg + "Audio変更";
            if (isMoniter == false) { //isMoniter == 'true' ||
                audioCange(audioUrl, mStart, mPosition);
            }
            // } else if (isMoniter == 'true' || isMoniter == true) { // } else if (!audioUrl.match(scene_audio) || audioUrl.match('')) {
            //     // audio = document.getElementById('audio_control'); //idで親要素を取得
            //     // dbMsg = dbMsg + "Audioを新規生成";
            //     audioLoad2Play(audioUrl, mPosition);
            //     scene_audio = audioUrl;
            now_audioUrl = audioUrl;
        }
    }
    var isSoFo = cutArray[nextSC].isSoFo; //音声をフェードアウトするカット
    if (isSoFo) {
        audioFOArray.push(setTimeout(function() {
            audioF0(); //音楽のフェードアウト開始
        }, thisCutDuration - aFOTime));
    }
    //レイアウト///////////////////////////BGM設定//
    scrollSpead = -1; //スクロールアイテムがある
    var isTop = false; //スクロールアイテムがある
    dbMsg = dbMsg + "、フェードアウトするカット=" + isSoFo;
    // var lastElement = cutArray[nextSC].lastElement;
    // dbMsg = dbMsg + ",lastElement=" + lastElement;
    myLog(dbMsg);
    var retValse = cutWrigt(cutArray[nextSC]); //各エレメントの書き込みループ
    scrollSpead = retValse.scrollSpead * 1;
    dbMsg = dbMsg + ",scrollSpead=" + scrollSpead;
    scrollT = retValse.scrollItem;
    dbMsg = dbMsg + "=" + scrollT;

    dbMsg = dbMsg + ",isStartNow=" + isStartNow + ",isMoniter=" + isMoniter;
    myLog(dbMsg);
    // if (isStartNow == true) {
    // pouseCut();
    // if (!isMoniter) {
    //     fiAlllement(usedElement, false);
    // }
    // isStartNow = false;
    // }
    // if (0 < scrollSpead) { //スクロールアイテムがある
    //     dbMsg = dbMsg + ",fiTime=" + fiTime;
    //     stopNIAnimation(scrollArray);
    //     scrollArray.push(setTimeout(function() {
    //         nextFunction = null;
    //         stayTime = thisCutDuration;
    //         dbMsg = dbMsg + ",stayTime=" + stayTime;
    //         vScroll();
    //     }, fiTime)); //thisCutDuration
    //     // }
    // } else {
    fiAlllement(usedElement, true);
    if (isMoniter == true || autoSend !== 'true') { //
        // audio.pause();
        pouseCut();
        isMoniter = false;
    } else {
        // //次のカットへ///////////////////////////BGM設定//
        nextSC++;
        if (0 < scrollSpead) { //スクロールアイテムがある
            stopNIAnimation(scrollArray);
            scrollArray.push(setTimeout(function() {
                nextFunction = 'viewLoop()';
                stayTime = thisCutDuration;
                vScroll();
            }, fiTime)); //thisCutDuration
        } else {
            cutTimeArray.push(setTimeout(function() {
                if (nextSC < cutArray.length) {
                    removeElement(usedElement);
                    viewLoop();
                }
            }, thisCutDuration));
        }
        /////////////////////////////次のカットへ//
    }
    myLog(dbMsg);
}


////////////////////////////////////////////////////////////////////
function getCutRecordNo(rSC, cutArray) {
    var tag = "[getCutRecordNo]";
    var dbMsg = tag;
    dbMsg = dbMsg + "対象カットのレコード=" + rSC;
    dbMsg = dbMsg + "," + cutArray.length + "行中";
    var startC = 0;
    if (0 < nextSC) {
        startC = nextSC - 1
    }
    for (var i = startC; i < cutArray.length; ++i) {
        var sceneCut = cutArray[i].scene_cut;
        dbMsg = dbMsg + "(" + i + ")" + sceneCut;
        if (sceneCut.match(rSC)) {
            nextSC = i;
            dbMsg = dbMsg + ">>" + nextSC;
            myLog(dbMsg);
            return nextSC;
        }
    }
    myLog(dbMsg);
}

function turnCutRecord(nextSC) {
    var tag = "[turnCutRecord]";
    var dbMsg = tag;
    dbMsg = dbMsg + "対象カットのレコード=" + nextSC;
    var rSC = document.getElementById('cut_no').innerHTML;
    dbMsg = dbMsg + ",実表示=" + rSC;
    dbMsg = dbMsg + "," + cutArray.length + "行中";

    var startC = 0;
    if (0 < nextSC) {
        startC = nextSC - 1
    }
    for (var i = startC; i < cutArray.length; ++i) {
        var sceneCut = cutArray[i].scene_cut;
        dbMsg = dbMsg + "(" + i + ")" + sceneCut;
        if (sceneCut.match(rSC)) {
            nextSC = i;
            dbMsg = dbMsg + ">>" + nextSC;
            return nextSC;
        }
    }
    myLog(dbMsg);
}

/**
 * ポーズ
 */
function pouseCut() {
    var tag = "[pouseCut]";
    var dbMsg = tag;
    dbMsg = dbMsg + "再生中カットのレコード=" + nextSC;
    $('#pouse_btn').css('display', 'none');
    $('#start_btn').css('display', 'inline-block');
    nextSC = turnCutRecord(nextSC);
    dbMsg = dbMsg + ">修正>" + nextSC;
    stopNIAnimation(cutTimeArray); //clearTimeout(cutTimeArray);
    stopNIAnimation(scrollArray);
    // if (!audio.paused) {
    audio.pause();
    // }
    autoSend = 'false';
    localStorage.setItem('fws_autoSend', false);
    if (debug_now == true) {
        console.log(audio);
    }
} //ポーズ

/***
 * 再開
 */
function playCut() {
    var tag = "[playCut]";
    var dbMsg = tag;
    dbMsg = dbMsg + "nextSC=" + nextSC;
    $('#start_btn').css('display', 'none');
    $('#pouse_btn').css('display', 'inline-block');
    removeEscape();
    // audio.pause(); //audio.volume = 0;
    isMoniter = false;
    autoSend = 'true';
    localStorage.setItem('fws_autoSend', true);
    if (cutArray[nextSC].scene.audio) {
        aUrl = cutArray[nextSC].scene.audio.souce; //cutArray[nextSC].audio;
        aCalentTimel = cutArray[nextSC].audioPosition;
        dbMsg = dbMsg + ",aUrl=" + aUrl + "を" + aCalentTimel + "秒から";
        audioLoad2Play(aUrl, aCalentTimel);
    }
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(cutArray);
        // console.log(cutArray[nextSC]);
    }
    cutTimeArray.push(setTimeout(function() {
        viewLoop();
    }, 100));
} //再開

/**
 * カット送り
 */
function fowardCut() {
    var tag = "[fowardCut]"; //fowardScene
    var dbMsg = tag;
    dbMsg = dbMsg + "再生中カットのレコード=" + nextSC;
    nextSC = turnCutRecord(nextSC);
    dbMsg = dbMsg + ">修正>" + nextSC;
    nextSC++;
    dbMsg = dbMsg + ">>" + nextSC;
    removeElement(usedElement);
    stopNIAnimation(cutTimeArray);
    stopNIAnimation(scrollArray);
    dbMsg = dbMsg + ".autoSend=" + autoSend;
    myLog(dbMsg);
    // playCut(); //
    viewLoop();
} //カット送り

/***
 * カット戻し
 */
function rewCut() {
    var tag = "[rewCut]";
    var dbMsg = tag;
    dbMsg = dbMsg + "再生中カットのレコード=" + nextSC;
    nextSC = turnCutRecord(nextSC);
    nextSC--; //= 2; //☆-1ではそのカットになる
    dbMsg = dbMsg + ">修正>" + nextSC;
    myLog(dbMsg);
    removeElement(usedElement);
    stopNIAnimation(cutTimeArray);
    stopNIAnimation(scrollArray);
    dbMsg = dbMsg + ".autoSend=" + autoSend;
    myLog(dbMsg);
    // playCut(); //
    viewLoop();
} //カット戻し

function naviClose() {
    var tag = "[naviClose]"; //fowardScene
    var dbMsg = tag;
    $('#control_panel').css('display', 'none');
    $('#navi_open_btn').css('display', 'inline-block');
    autoSend = 'true';
    localStorage.setItem('fws_autoSend', true);
    myLog(dbMsg);
    playCut(); //viewLoop();
}

function naviOpen() {
    var tag = "[naviOpen]"; //fowardScene
    var dbMsg = tag;
    $('#navi_open_btn').css('display', 'none');
    $('#control_panel').css('display', 'table-cell');
    autoSend = 'false';
    localStorage.setItem('fws_autoSend', false);
    myLog(dbMsg);
    // playCut(); //viewLoop();
}

document.onkeydown = keydown;

function keydown() {
    var tag = "[keydown]"; //fowardScene
    var dbMsg = tag;
    var dbMsg = dbMsg + "キーが押されました KeyCode:" + event.keyCode;
    switch (event.keyCode) {
        case 8:
            dbMsg = dbMsg + ",backSpaceキーが押されました";
            dbMsg = dbMsg + ",sceneCut=" + sceneCut;
            if (sceneCut !== 's010c01') {
                $("#rd_btn").click();
            }
            break;
        case 13:
            dbMsg = dbMsg + ",enterキーが押されました";
            dbMsg = dbMsg + ",sceneCut=" + sceneCut + ",最終シーンカット名=" + lastSceneCut;
            if (sceneCut !== lastSceneCut) {
                $("#fs_btn").click();
            }
            break;
        default:
            if (event.shiftKey == true) { //KeyCode:16,Shiftキーが押されました
                dbMsg = dbMsg + ",Shiftキーが押されました";
            } else if (event.ctrlKey == true) { //KeyCode:17,Ctrlキーが押されました
                dbMsg = dbMsg + ",Ctrlキーが押されました";
            } else if (event.altKey == true) { //KeyCode:18,Altlキーが押されました
                dbMsg = dbMsg + ",Altlキーが押されました";
            }
            break;
    }
    // if (event.enterKey == true) { //13
    //     dbMsg = dbMsg + ",enterキーが押されました";
    // } else 
    myLog(dbMsg);
}

/**
 * 各エレメントの編集IFをhogan.jsで書き出す
 */
function writeEditElement() {
    var tag = "[index.writeEditElement]";
    var dbMsg = tag;
    dbMsg = dbMsg + elementIdArray.length + "件";
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
        // });
        // $('#' + elementId + "_eidt").append(html);
        // // myLog(dbMsg);
        // tpl = Hogan.compile($('#tpl_common').text());
        // html = tpl.render({
        //     elmId: elementId,
        // });
        // // dbMsg = dbMsg + ":" + html;
        // $('#' + elementId + "_eidt").append(html);

        tpl = Hogan.compile($('#tpl_view').text());
        var html = tpl.render({
            elmId: elementId,
        });
        $('#' + vPosition + "_aria").append(html);
    }
    myLog(dbMsg);
} //各エレメントの編集IFをhogan.jsで書き出す

//起動～このぺーじのスタートまで/////////////////////////////////////////////////////////////
function receveCutArray(cArray) {
    var tag = "[end_rool.receveCutArray]";
    this.cutArray = cArray;
    var dbMsg = tag;
    var scName = cutArray[0].scene_cut;
    dbMsg = dbMsg + ",scName=" + scName;
    nextSC = getCutRecordNo(scName, cutArray);
    dbMsg = dbMsg + ",nextSC=" + nextSC;
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(cutArray);
    }
    viewLoop();
}

function elInnit(scName) {
    var tag = "[elInnit]";
    var dbMsg = tag + "開始指定＝" + scName;
    if (localStorage.getItem('fws_baceWidth')) {
        baceWidth = localStorage.getItem('fws_baceWidth');
    }
    if (localStorage.getItem('fws_baceHeight')) {
        baceHeight = localStorage.getItem('fws_baceHeight');
    }
    dbMsg = dbMsg + "を[" + baceWidth + "×" + baceHeight + "]";
    var moniterScale = getWindowScale("moniter_row"); //"moniter_bace"
    dbMsg = dbMsg + "、moniterScale=" + moniterScale;
    winW = baceWidth * moniterScale;
    winH = baceHeight * moniterScale;
    dbMsg = dbMsg + ">>[" + winW + "×" + winH + "]"; //[919.0908813476562×516.9886207580566]
    $('#moniter_row').css('height', winH + 'px');
    $('#moniter_bace').css('height', winH + 'px');
    $('#canvas_bace').css('height', winH + 'px');
    $('#docment_bace').css('height', winH + 'px');

    if (localStorage.getItem('fws_autoSend')) {
        autoSend = localStorage.getItem('fws_autoSend');
    }
    dbMsg = dbMsg + ",autoSend=" + autoSend;
    audio = document.getElementById('audio_control'); //idで親要素を取得
    audio.autoplay = false;
    dbMsg = dbMsg + "Audioを新規生成";
    var cArray = JSON.parse(localStorage.getItem("cutArray"));
    if (elementArray) {} else {
        dbMsg = dbMsg + "呼出し";
        elementArray = JSON.parse(localStorage.getItem('elementArray'));
    }
    dbMsg = dbMsg + ",elementArray=" + elementArray.length + "件中";
    lastSceneCut = elementArray[elementArray.length - 1].scene_cut + '';
    dbMsg = dbMsg + ",最終シーンカット名=" + lastSceneCut;
    // myLog(dbMsg);
    // if (debug_now == true) {
    //     console.log(cArray);
    // }
    if (cArray) {
        cutArray = $.extend(true, [], cArray); //オブジェクトから配列に変換
        // if (debug_now == true) {
        //     aVol = 0.0;
        //     aVolLimit = 0.1;
        // }
        dbMsg = dbMsg + "背面＝" + backBord;
        var retValse = getElementCoordinates('canvas_bace');
        var retWidth = retValse.width * 1;
        var eHeight = retValse.height * 1;
        dbMsg = dbMsg + "[" + retWidth + "×" + eHeight + "]px";
        // cutPict2Element(backBord, "canvas_bace", 0, 0, winW, winH, 0, 'img/back.jpg', 0.5);
        var control_aria_height_height = $('#control_aria').height();
        dbMsg = dbMsg + ",control_aria_height_height=" + control_aria_height_height;
        // if (autoSend) {
        //     $('#start_btn').css('display', 'none');
        // } else {}
        // $('#start_btn').css('display', 'none');
        // naviOpen();
        // pouseCut();
        // myLog(dbMsg);
        // if (debug_now == true) {
        //     // console.log(cutArray);
        //     console.log(cutArray[0]);
        // }
        isMoniter = false; //エディターからモニター表示
        if (location.search.substring(1, location.search.length)) {
            dbMsg = dbMsg + 'location=' + location.search.substring(1, location.search.length); //scName
            isMoniter = true;
        }
        dbMsg = dbMsg + 'isMoniter=' + isMoniter; //scName
        if (scName === '') {
            scName = cutArray[0].scene_cut;
            dbMsg = dbMsg + ">scName>" + scName;
        }
        // if (scName) {
        nextSC = getCutRecordNo(scName, cutArray);
        dbMsg = dbMsg + ",nextSC=" + nextSC;
        dbMsg = dbMsg + ",paused =" + audio.paused;
        myLog(dbMsg);
        viewLoop();
        naviOpen();
        audio.autoplay = false;
        // pouseCut();
    } else {
        cutPict2Element(backBord, "canvas_bace", 0, 0, winW, winH, 0, 'img/back.jpg', 0.5);
        templeteRead();
    }

    //  }
    // makeCutArray(templeteRead());
}