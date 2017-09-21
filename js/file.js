var file_data;
var file_lastModified; //最終更新日時
var file_name; //ファイル名
var file_size; // ファイルサイズ
var file_type; //mime型

function writeTextFile(write_text, file_name) { //http://www.atmarkit.co.jp/ait/articles/1112/16/news135_2.html
    //http://d.hatena.ne.jp/a_bicky/20110718/1311027391
    var dbmsg = '[writeTextFile]';
    try {
        dbmsg = dbmsg + write_text + 'を' + file_name + 'に書き込み';
        var blobBuilder;
        var isNowChrome = false;
        var readT_text = readFileFSA(file_name);
        write_text = readT_text + write_text;

        console.log(window);
        if ("MozBlobBuilder" in window) { // （1）BlobBuilderの作成
            dbmsg = dbmsg + 'MozBlobBuilder使用';
            blobBuilder = new MozBlobBuilder();
            blobBuilder.append(write_text); // （2）BlobBuilderにテキストを追加する
        } else if ("WebKitBlobBuilder" in window) {
            dbmsg = dbmsg + 'Chrome23以前はWebKitBlobBuilder使用';
            blobBuilder = new WebKitBlobBuilder();
            blobBuilder.append(write_text); // （2）BlobBuilderにテキストを追加する
        } else if ("Blob" in window) {
            dbmsg = dbmsg + 'Chrome24以降はBlob使用';
            var blob1 = new Blob([write_text], { type: "text/plain" });
            blobBuilder = new Blob([blob1, blob1], { type: "text/plain;charset=UTF-8" });
            isNowChrome = true;
            console.log(window.chrome);
            console.log(window.navigator);
        }
        console.log(blobBuilder);
        //	var fs = new ActiveXObject("Scripting.FileSystemObject");         //WScriptはWindows Scripting Hostでしか使えないhttp://3rd.geocities.jp/kaito_extra/Source/TextCtrl.html
        // var fs = WScript.CreateObject("Scripting.FileSystemObject"); //WScriptはWindows Scripting Hostでしか使えないhttp://marupeke296.com/IKDADV_JS_IO.html
        var fs = window.createFileObject(file_name); //9/9；ここまで通った
        console.log(fs);
        var write_file = fs.OpenTextFile(file_name, 8); //1;読み込み用 , 2;書き込み用 , 8;追加書き込み用
        var readT_text = readTextFile(file_name);

        dbmsg = dbmsg + ',readT_text= ' + readT_text;

        var a = document.createElement("a");
        var label = document.createTextNode("ダウンロード");
        var disp = document.getElementById("disp");
        if (window.URL) { // （3）createObjectURLで（2）のテキストへのリンクを作成
            if (isNowChrome) {
                disp.innerHTML = '<a href="' + window.url.createObjectURL(blobBuilder) + '" target="_blank">ファイルダウンロード(Chrome24以降)</a>';
                //location.pathname :"/I:/an/workspace/hqu666/hqu666/atarekunn/js/dice/dice.html"  ;document.URL
            } else {
                disp.innerHTML = '<a href="' + window.URL.createObjectURL(blobBuilder.getBlob()) + '" target="_blank">file</a>';
            }
        } else if (window.webkitURL) {
            disp.innerHTML = '<a href="' + window.webkitURL.createObjectURL(blobBuilder.getBlob()) + '" target="_blank">ファイルダウンロード(Chrome23以前)</a>';
        }
        // write_file.Write(readT_text);
        // write_file.Close();
        console.log(dbmsg);
    } catch (e) {
        console.log(dbmsg + 'で' + e);
    }
}

function readTextFile(file_name) {
    var dbmsg = '[readTextFile]';
    var retStr;
    try {
        dbmsg = dbmsg + file_name + 'から読取り'
        var fs = new ActiveXObject("Scripting.FileSystemObject"); //WScriptはWindows Scripting Hostでしか使えないhttp://3rd.geocities.jp/kaito_extra/Source/TextCtrl.html
        //    var fs = WScript.CreateObject("Scripting.FileSystemObject"); //WScriptはWindows Scripting Hostでしか使えないhttp://marupeke296.com/IKDADV_JS_IO.html
        var read_file = fs.OpenTextFile(file_name, 1); //1;読み込み用 , 2;書き込み用 , 8;追加書き込み用	
        retStr = read_file.ReadAll();
        dbmsg = dbmsg + '現在の書き込み＝' + retStr;
        //	$('#logtext').text($('#logtext').text() + "\n" + str);
        read_file.Close(); //  ファイルを閉じる
        fs = null; //  オブジェクトを解放
        console.log(dbmsg);
    } catch (e) {
        console.log(dbmsg + 'で' + e);
    }
    return retStr;
}

function fileInputRead(element_in, element_result) {
    var dbmsg = '[fileInputRead]';
    if (window.File) { //http://www.atmarkit.co.jp/ait/articles/1112/16/news135.ht//
        dbmsg = dbmsg + ',File API実装';
        if (window.FileReader) { // FileReader をサポートしているか調べる                            //  http://hakuhin.jp/js/file_reader.html
            dbmsg = dbmsg + ',FileReaderサポート';
            // var element_in = document.getElementById("input_02_file"); // 各エレメントを取得
            // var element_result = document.getElementById("edit_02_result");
            console.log(dbmsg);
            element_in.addEventListener("change", function(e) { // 値が変化した時に実行されるイベント
                var dbmsg = '[element_in.addEventListener.change]';
                if (!(element_in.value)) return; // ファイルが選択されたか
                // ------------------------------------------------------------
                // File オブジェクトを取得（HTML5 世代）
                // ------------------------------------------------------------
                var file_list = element_in.files; // ファイルリストを取得
                if (!file_list) return;

                var file = file_list[0]; // 0 番目の File オブジェクトを取得
                if (!file) return;
                file_lastModified = file.lastModified; //最終更新日時
                dbmsg = dbmsg + ',最終更新日時=' + file_lastModified;
                file_name = file.name; //ファイル名
                dbmsg = dbmsg + ',ファイル名=' + file_name;
                file_size = file.size; // ファイルサイズ
                dbmsg = dbmsg + ',ファイルサイズ=' + file_size;
                file_type = file.type; //mime型
                dbmsg = dbmsg + ',mime=' + file_type;
                console.log(file);
                var file_reader = new FileReader(); // FileReader オブジェクトを生成
                if (file.type.indexOf("text") == 0) { // テキストとして読み込む
                    file_reader.onload = function(e) { // 読み込み成功時に実行されるイベント
                        var dbmsg = '[file_reader.onload]';
                        file_data = file_reader.result;
                        element_result.value = file_data;
                        console.log(dbmsg);
                        console.log(e);
                    };
                    file_reader.onabort = function(e) { //読み込み処理が中断
                        var dbmsg = '[file_reader.onabort]';
                        console.log(dbmsg);
                        console.log(e);
                    };
                    file_reader.onerror = function(e) { //読込中にエラー
                        var dbmsg = '[file_reader.onerror ]';
                        console.log(dbmsg);
                        console.log(e);
                    };
                    file_reader.onloadstart = function(e) { //読込が開始
                        var dbmsg = '[file_reader.onloadstart ]';
                        console.log(dbmsg);
                        console.log(e);
                    };
                    file_reader.onloadend = function(e) { //成功・失敗に問わず読込が終了
                        var dbmsg = '[file_reader.onloadend ]';
                        console.log(dbmsg);
                        console.log(e);
                    };
                    file_reader.onprogress = function(e) { //ファイルの読込中
                        var dbmsg = '[file_reader.onprogress  ]';
                        //       console.log(dbmsg);
                    };
                    file_reader.readAsText(file); // 読み込みを開始する（テキスト文字列を得る）
                } else { // バイナリとして読み込む
                    file_reader.onload = function(e) { // // 読み込み成功時に実行されるイベント
                        var result = "";
                        var ary_u8 = new Uint8Array(file_reader.result);
                        var i;
                        var str;
                        var num = ary_u8.length;
                        for (i = 0; i < num; i++) {
                            if (ary_u8[i] < 0x10) {
                                str = "0" + ary_u8[i].toString(16);
                            } else {
                                str = ary_u8[i].toString(16);
                            }
                            if ((i % 16) == 0) {
                                result += str;
                            } else if ((i % 16) == 15) {
                                result += " " + str + "\n";
                            } else {
                                result += " " + str;
                            }
                        }
                        element_result.value = result;
                    };
                    file_reader.readAsArrayBuffer(file); // 読み込みを開始する（ArrayBuffer オブジェクトを得る）
                }
                console.log(dbmsg);
            }); //element_in.addEventListener("change", function(e) 
        } //);         //(); //if (window.FileReader) { 
    } else {
        window.alert("File FileReaderAPI未対応");
    }
}

function readFileFSA(file_name) {
    var dbmsg = '[readFileFSA]';
    var retStr = null;
    try {
        dbmsg = dbmsg + 'file_name=' + file_name;
        window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
        var type = window.TEMPORAR; //削除可能ファイル　/不能はwindow.PERSISTENT
        var size = 5 * 1024 * 1024;
        window.requestFileSystem(type, size, successCallback, errorCallback);
        //	var fs = new ActiveXObject("Scripting.FileSystemObject");         //WScriptはWindows Scripting Hostでしか使えないhttp://3rd.geocities.jp/kaito_extra/Source/TextCtrl.html
        //    var fs = WScript.CreateObject("Scripting.FileSystemObject"); //ReferenceError: WScript is not defined;WScriptはWindows Scripting Hostでしか使えないhttp://marupeke296.com/IKDADV_JS_IO.html
        var fs = window.createFileObject(file_name); //TypeError: window.createFileObject is not a functi//
        var root = fs.root;
        //  log_file = fs.CreateTextFile("dice.log");
        var read_file = fs.root.OpenTextFile(file_name, 8); //1;読み込み用 , 2;書き込み用 , 8;追加書き込み用	
        retStr = read_file.ReadAll();
        dbmsg = dbmsg + '現在の書き込み＝' + retStr;
        //	$('#logtext').text($('#logtext').text() + "\n" + str);
        read_file.Close(); //  ファイルを閉じる
        fs = null; //  オブジェクトを解放
        console.log(dbmsg);
    } catch (e) {
        console.log(dbmsg + "で" + e);
    }
    return retStr;
}

function successCallback(fs) {
    var dbmsg = '[successCallback]';
    console.log(dbmsg);
    console.log(fs);
}

function errorCallback(e) {
    var dbmsg = '[errorCallback]';
    console.log(dbmsg);
    console.log(e);
}


function onInitFs(fs) {
    console.log('Opened file system: ' + fs.name);
    fs.root.getFile('log.txt', {}, function(fileEntry) {

        // Get a File object representing the file,
        // then use FileReader to read its contents.
        fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
                var txtArea = document.createElement('textarea');
                txtArea.value = this.result;
                document.body.appendChild(txtArea);
            };

            reader.readAsText(file);
        }, errorHandler);

    }, errorHandler);

}

function errorHandler(e) {
    var msg = '';
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