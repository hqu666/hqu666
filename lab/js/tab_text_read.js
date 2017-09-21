/****
 * テキストファイルからscriptデータレコードの読み書き
 */
var isEdit = false; //edit.jsで設定する編集中フラグ
var isReWrite = false; //edit.jsで設定する再描画指定
var textFileName;

function wrghtCutLocalStorage(cutArray) {
    var tag = "[wrghtCutLocalStorage]";
    var dbMsg = tag + cutArray.length + "件";

    // if (debug_now == true) {
    //     var cutArray2 = JSON.parse(localStorage.getItem("cutArray"));
    //     console.log(cutArray2);
    // }
    for (var i = 0; i < cutArray.length; ++i) {
        dbMsg = "\n" + tag + "(" + i + ")";
        var rObj = cutArray[i];
        dbMsg = dbMsg + ";" + rObj.length + "項目；";
        var keyName = rObj.scene_cut;
        dbMsg = dbMsg + keyName;
        var wrStr = JSON.stringify(rObj);
        dbMsg = dbMsg + ";" + wrStr;
        localStorage.setItem(keyName, wrStr);

    }
    myLog(dbMsg);
    if (debug_now == true) {
        // var cutArray2 = JSON.parse(localStorage.getItem("cutArray"));
        // console.log(cutArray2);
    }
    return cutArray;
}

var xmlHttp;

function checkStatus() {
    var tag = "[checkStatus]";
    var dbMsg = tag;
    dbMsg = dbMsg + "readyState=" + xmlHttp.readyState;
    dbMsg = dbMsg + ",status=" + xmlHttp.status;
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        // dbMsg = dbMsg + "\nresponseText=" + xmlHttp.responseText;
    }
    // myLog(dbMsg);
}

function str2array(str) {
    var array = [],
        i, il = str.length;
    for (i = 0; i < il; i++) array.push(str.charCodeAt(i));
    return array;
};

/**
 * 読み込んだテキストファイルを改行コードで行配列に分解し、エレメント単位のArrayを構成
 * @param {*} str 
 */
function convertTabText2Array(str) {
    var tag = "[convertTabText2Array]";
    var dbMsg = tag + str.length + "文字";
    var colNames = []; //列名
    var colNameCount;
    var resultRows = []; //再構築後の行配列
    var rowStr;
    var colVar = []; //各列の内容
    var rows = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成
    dbMsg = dbMsg + "" + rows.length + "行";
    // var b_time = '';
    for (var i = 0; i < rows.length; ++i) {
        // dbMsg = dbMsg + "\n(" + i + "行)" + rows[i];
        rowStr = rows[i] + '';
        // dbMsg = dbMsg + rowStr;
        if (i == 0) { //先頭行は各列の内容
            colVar = rowStr.split("\t"); //タブで区切って
            colNames = colVar.concat(); //配列化
            // dbMsg = dbMsg + "=" + colNames;
            // dbMsg = dbMsg + "=" + colNameCount + "項目";
        } else {
            if (rowStr.match('s0')) {
                resultRows.push(rowStr);
            } else if (rowStr !== '') { //先頭に's0'が無い行はセル内の改行として
                var rStr = resultRows[resultRows.length - 1]; //途切れている前の行
                rStr = rStr + '<br>' + rowStr;
                resultRows[resultRows.length - 1] = rStr; //前の行につなげる
                dbMsg = dbMsg + ">セル内改行>" + resultRows[resultRows.length - 1];
            }
        }
        // dbMsg = dbMsg + "\n(" + resultRows.length + ")" + resultRows[resultRows.length - 1];
    }
    colNameCount = colNames.length;
    dbMsg = dbMsg + "、colNameCount=" + colNameCount + "項目";
    dbMsg = dbMsg + "、resultRow=" + resultRows.length + "行";
    localStorage.removeItem(elementKeyName);
    var colStr = JSON.stringify(colNames);
    dbMsg = dbMsg + ",colStr=" + colStr;
    localStorage.setItem(elementKeyName, colStr);

    var elementArray = new Array(); //各エレメント単位の情報を連想配列化

    var farstRec = 0;
    // if (elementArray[1].scene_cut === 's000c00') {
    //     farstRec = 1;
    //     if (elementArray[1].width) {
    //         baceWidth = elementArray[1].width * 1;
    //         localStorage.setItem('fws_baceWidth', baceWidth);
    //     }
    //     if (elementArray[1].hight) {
    //         baceHeight = elementArray[1].hight * 1;
    //         localStorage.setItem('fws_baceHeight', baceHeight);
    //     }
    //     dbMsg = dbMsg + "[" + baceWidth + "×" + baceHeight + "]";
    //     if (elementArray[1].fontColor) {
    //         autoSend = elementArray[1].fontColor + '';
    //         localStorage.setItem('fws_autoSend', autoSend);
    //     }
    //     dbMsg = dbMsg + ",autoSend=" + autoSend;
    // }

    for (var i = farstRec; i < resultRows.length; ++i) { //渡された列数分
        dbMsg = dbMsg + '\n' + i + ")";
        rowStr = resultRows[i] + '';
        // dbMsg = dbMsg + rowStr;
        rowStr = rowStr.substring(0, rowStr.length - 1); //最終列の改行コードを削除
        colVal = rowStr.split('\t');
        var rowObj = new Object();
        for (var j = 0; j < colNameCount; ++j) { //取得した列鵜数分
            var colValue = colVal[j] + '';
            dbMsg = dbMsg + j + ")" + colNames[j] + ";" + colVal[j];
            if (colValue == "undefined" || colValue == undefined) { //最終columnがundefinedになていた
                colValue = '';
            }
            rowObj[colNames[j]] = colValue;
        } //取得した列鵜数分
        var recName = rowObj.scene_cut + "_" + rowObj.element;
        elementArray[i] = new Array(); // elementArray[recName] = new Array();
        elementArray[i] = rowObj; //elementArray[recName] = obj;   なら名称設定できるがJSONstrにできない
    } ////渡された列数分
    elementArray2localStorage(elementArray)
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(elementArray);
        var elementArray2 = JSON.parse(localStorage.getItem('elementArray'));
        // dbMsg = dbMsg + cutArray2.length + "件";
        console.log(elementArray2);
    }
    return makeCutArray(elementArray);
} // 2;読み込んだテキストファイルを改行コードで行配列に分解し、エレメント単位のArrayを構成

/**
 * charset=shift_jisのテキストファイルをJavaScriptで処理できるcharset(utf-8)に変換する
 * @param {*} rUrl 
 */
function sJIsRead(rUrl) {
    var tag = "[sJIsRead]";
    var dbMsg = tag;
    var defer = $.Deferred();
    dbMsg = dbMsg + rUrl;
    $.ajax({
        beforeSend: function(xhr) {
            xhr.overrideMimeType("text/plain; charset=shift_jis");
        },
        type: 'GET',
        url: rUrl,
        dataType: 'text',
        success: function(data) {
            dbMsg = dbMsg + ',' + data.length + "文字";
            myLog(dbMsg);
            nextSC = 0;
            convertTabText2Array(data);
        }
    }); //http://qiita.com/svartalfheim/items/36100328a37c8221d0dd
} //charset=shift_jisのテキストファイルをJavaScriptで処理できるcharset(utf-8)に変換する

function textRead(rUrl) {
    var tag = "[textRead]";
    var dbMsg = tag;
    var defer = $.Deferred();
    dbMsg = dbMsg + rUrl;
    $.ajax({
        beforeSend: function(xhr) {
            xhr.overrideMimeType("text/plain;");
        },
        type: 'GET',
        url: rUrl,
        dataType: 'text',
        success: function(data) {
            dbMsg = dbMsg + ',' + data.length + "文字";
            myLog(dbMsg);
            nextSC = 0;
            convertTabText2Array(data);
        }
    }); //http://qiita.com/svartalfheim/items/36100328a37c8221d0dd
} //charset=shift_jisのテキストファイルをJavaScriptで処理できるcharset(utf-8)に変換する

/**
 * テンプレートを読み込む
 */
function templeteRead(textFileName) {
    var tag = "[templeteRead]";
    var dbMsg = tag;
    var res = confirm('テンプレートの再読込み、設定を初期化します。');
    if (res == true) { // OKなら
        initlocalStorage();
        var defer = $.Deferred();
        // textFileName = 'sample/marrig_endroll/' + templateFileName;
        dbMsg = dbMsg + ',textFileName=' + textFileName;
        myLog(dbMsg);
        localStorage.setItem('fws_textFileName', textFileName);
        textRead(textFileName);
    } else {
        textFileName = signageName;
    }
    dbMsg = dbMsg + textFileName;
    myLog(dbMsg);
} //1;テンプレートを読み込む

//書き出し///////////////////////////////////////////////////////////
/**
 * テキストファイルを書き出す
 * @param {*} wrData 
 * http://blog.fagai.net/2014/08/09/javascript-only-save/
 */
function textWrite(wrData) {
    var tag = "[textWrite]";
    var dbMsg = tag;
    if (signageName.match('テンプレート')) {
        textFileName = 'オリジナルシナリオ';
    }
    dbMsg = dbMsg + textFileName + "に";
    dbMsg = dbMsg + wrData;
    //  myLog(dbMsg);
    var blob = new Blob([wrData], { type: "text/plain" }); // バイナリデータを作ります。     ;charset=shift_jis;
    if (window.navigator.msSaveBlob) { // IEか他ブラウザかの判定
        window.navigator.msSaveBlob(blob, textFileName + '.txt'); // IEなら独自関数を使います。       url
    } else {
        var a = document.createElement("a"); // それ以外はaタグを利用してイベントを発火させます
        a.href = URL.createObjectURL(blob);
        a.target = '_blank';
        a.download = textFileName + '.txt'; //
        a.click();
    }
    // myLog(dbMsg);
    if (debug_now == true) {
        // console.log(elementArray);
    }
} //テキストファイルを書き出す

/**
 * 渡された連想配列をタブテキストに変換する
 * @param {*} wrArray 
 */
function convertArray2TabText(wrArray) {
    var tag = "[convertArray2TabText]";
    var dbMsg = tag + wrArray.length + "件";
    var wrData = ''; //[InternetShortcut]\n' + 'URL=' + window.location + '\nIDList=\n';
    var souceCol = -1;
    var colName = '';
    var colNames = []; //列名
    var colNames = JSON.parse(localStorage.getItem(elementKeyName)); //最初の要素で列名を読み取る
    dbMsg = dbMsg + ',colNames=' + colNames.length + "件";
    for (var i = 0; i < colNames.length; ++i) { //項目名の行を作成
        dbMsg = tag + '(' + i + ')';
        colName = colNames[i];
        if (i == (colNames.length - 1)) {
            wrData = wrData + colName + '\n';
        } else {
            wrData = wrData + colName + '\t';
        }
        if (colName === 'souce') {
            souceCol = i + 1;
        }
    }
    dbMsg = dbMsg + ',souceCol=' + souceCol;
    dbMsg = dbMsg + ',列名=' + wrData;

    var b_scName = '';
    var b_sNo = '';
    var b_time = '';
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(wrArray);
    }
    for (var j = 0; j < wrArray.length; ++j) { //elementArrayのループ
        dbMsg = '\n' + tag + '(' + j + ')';
        var obj = []; //new Array(); //Object();
        obj = $.extend(true, [], wrArray[j]);
        // console.log(obj);
        var scName = '';
        for (var i = 0; i < colNames.length; ++i) { //列名のループ
            dbMsg = dbMsg + '\n(' + i + ')';
            colName = colNames[i];
            // dbMsg = dbMsg + colName; // + ";" + colVal[j];
            var colVar = obj[colName] + '';
            // dbMsg = dbMsg + "=" + colVar; // + ";" + colVal[j];
            if (colName === 'scene_cut') { //シーンカット名を拾って、全レコードに入れるべきプロパティの補完
                scName = colVar;
                dbMsg = dbMsg + scName;
                var scStr = scName.split('c');
                var sNo = scStr[0];
                dbMsg = dbMsg + ',sNo=' + sNo;
                var scIndex = getCutArrayIndex(scName);
                if (cutArray[scIndex]) {
                    b_time = cutArray[scIndex].time;
                    if (sNo !== b_sNo || b_sNo === '') { //b_scName !== '' &&
                        dbMsg = '\n' + tag + scName + '(scIndex=' + scIndex + ')';
                        // wrData = wrData + getSceneObj(scIndex);
                        myLog(dbMsg);
                        b_sNo = sNo;
                    }
                }
            } else if (colName === 'time') {
                if (colVar === '') {
                    colVar = b_time;
                } else {
                    b_time = colVar;
                }
                // } else if (colName === 'souce') {
                //     colVar = colVar.replace(/<br>/g, '\r\n'); //Excelのセル内改行コードは0A(LF)='\n'だが正常に読み込まれない
            } //シーンカット名を拾って、全レコードに入れるべきプロパティの補完
            // if (i == (colNames.length - 1)) {
            //     wrData = wrData + colVar;
            // } else {
            wrData = wrData + colVar + '\t';
            // }
        } //列名のループ
        wrData = wrData + '\n'; //'\r'では読み込めない       %0D%0A
        dbMsg = dbMsg + wrData;
    } ////elementArrayのループ

    dbMsg = dbMsg + ',wrData=' + wrData;
    // myLog(dbMsg);
    textWrite(wrData);
} // 渡された連想配列をタブテキストに変換する

///  https://www.html5rocks.com/ja/tutorials/file/filesystem/   ////
/**
 *  window.requestFileSystemからの呼出し
 * @param {*} fs 
 * http://saj-kz.hatenablog.com/entry/2014/01/13/232341
 */
function onInitFs(fs) {
    var tag = "[onInitFs] ";
    var dbMsg = tag;
    dbMsg = dbMsg + 'Opened file system: ' + fs.name;
    //window.requestFileSystem(window.TEMPORARY, ... で　http_localhost_0:Temporary
    // fs.root.getFile('log.txt', { create: true, exclusive: true }, function(fileEntry) { // getFile の第2引数で「create: true」を付けるとファイルを新規作成する。
    //     var tag = "[onInitFs.getFile] ";
    //     var dbMsg = tag;
    //     //DOMException: The object can not be modified in this way.
    //     myLog(dbMsg);
    //     if (debug_now == true) {
    //         console.log(fileEntry.isFile); // true
    //         console.log(fileEntry.name); // log.txt 
    //         console.log(fileEntry.fullPath); // /log.txt 
    //     }
    // }, onError);
    // fs.root.getFile('log.txt', { create: true, exclusive: true }, function(fileEntry) { //getFileでファイルを作成する
    //     var tag = "[onInitFs.getFile] ";
    //     var dbMsg = tag;
    //     myLog(dbMsg);
    //     // fileEntry.isFile === true
    //     // fileEntry.name == 'log.txt'
    //     // fileEntry.fullPath == '/log.txt'
    //     fileEntry.file(function(file) {
    //         var reader = new FileReader();

    //         reader.onloadend = function(e) {
    //             var tag = "[onInitFs.reader.onloadend] ";
    //             var dbMsg = tag;
    //             var resultStr = this.result;
    //             dbMsg = dbMsg + 'resultStr=' + resultStr
    //             myLog(dbMsg);
    //             if (debug_now == true) {
    //                 console.log(fileEntry);
    //             }
    //         };
    //         reader.readAsText(file);
    //     }, onError); //errorHandler

    //     myLog(dbMsg);
    //     if (debug_now == true) {
    //         console.log(fileEntry);
    //     }
    // }, onError); //errorHandler
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(event);
    }
}

/**
 * window.requestFileSystemエラー処理
 * @param {*} e 
 */
function errorHandler(e) {
    var msg = '';
    if (debug_now == true) {
        console.log(e);
    }
    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    };
    console.log('Error: ' + msg);
}

/**
 * webkitRequestFileSystemをPERSISTENTで呼び出さす
 * @param {*} grantedBytes 
 */
function requestFS(grantedBytes) {
    var tag = "[requestFS]";
    var dbMsg = tag;
    dbMsg = dbMsg + 'grantedBytes=' + grantedBytes;
    window.webkitRequestFileSystem(window.PERSISTENT, grantedBytes, onInitFs, onError); //onError
    // window.webkitRequestFileSystem(window.PERSISTENT, grantedBytes, function(fs) {
    //     console.log('fs: ', arguments); // I see this on Chrome 27 in Ubuntu
    // }, errorHandler); //onError
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(event);
    }
}

function onError() { console.log('Error : ', arguments); }

function requestFileAPI() {
    var tag = "[requestFileAPI]";
    var dbMsg = tag;
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    // do shell script "/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --unlimited-quota-for-files --allow-file-access-from-files > /dev/null 2>&1 &"
    // window.requestFileSystem(window.TEMPORARY, 1024 * 1024 * 1024 /*1GB*/ , onInitFs, errorHandler); //TEMPORARY を使用して保存したデータは、ブラウザの裁量で（空き容量が必要な場合など）削除できます。https://www.html5rocks.com/ja/tutorials/file/filesystem/
    navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 1024, function(grantedBytes) {
        requestFS(grantedBytes);
        console.log('requestQuota: ', arguments);
    }, onError);

    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(event);
    }
}