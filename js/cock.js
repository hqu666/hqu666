function isCookie() {
    var dbmsg = '[isCookie]';
    try {
        if (window.navigator.cookieEnabled) {
            dbmsg = dbmsg + 'クッキーが利用できます。'; // クッキーの受け入れが有効時の処理
        } else {
            alert("みなさんのグループID、ユーザーID、およびゲームに必要なデータをcookieで配信します。\nクッキーを受け入れる様にブラウザを設定してください。 "); // クッキーの受け入れが無効時の処理
        }
        //    console.log(dbmsg);
    } catch (err) {
        console.log(dbmsg + 'で' + err);
    }
} //cookieEnabled確認

function cockCookie(cookie_name, write_text) {
    var dbmsg = '[cockCookie]';
    try {
        dbmsg = dbmsg + cookie_name + 'に' + write_text + 'を書き込み';
        var path = location.pathname;
        // pathをフォルダ毎に指定する場合のIE対策
        var paths = readPath(); // new Array();
        // paths = path.split("/");
        // if (paths[paths.length - 1] != "") {
        //     paths[paths.length - 1] = "";
        //     path = paths.join("/");
        // }
        var expire = new Date();
        expire.setTime(expire.getTime() + 1000 * 3600 * 24 * 7); //有効股間７日
        document.cookie = cookie_name + '=' + escape(write_text) + ';path=' + path + ';expires=' + expire.toUTCString(); //'name=' +  encodeURIComponent(write_text)
        console.log(dbmsg);
    } catch (err) {
        console.log(dbmsg + 'で' + err);
    }
}

function readPath() {
    var dbmsg = '[readPath]';
    var result = null;
    try {
        var path = location.pathname;
        // pathをフォルダ毎に指定する場合のIE対策
        var paths = new Array();
        paths = path.split("/");
        if (paths[paths.length - 1] != "") {
            paths[paths.length - 1] = "";
            path = paths.join("/");
        }
        result = path;
        dbmsg = dbmsg + path;
        console.log(dbmsg);
    } catch (err) {
        console.log(dbmsg + 'で' + err);
    }
    return result;
}

function getCookie(cookieName) {
    var result = null;
    var dbmsg = '[getCookie]';
    try {
        var urlStr = document.URL;
        dbmsg = dbmsg + ",url=" + urlStr;
        if (-1 < urlStr.indexOf("file:///")) { //☆基本的にローカルファイル（使用しているマシンのディスク等）に情報を書き込むことは出来ません
            urlStr = urlStr.replace("file:///I:/an/workspace/hqu666/hqu666/atarekunn/", "http://www.geocities.jp/hqu666/atarekunn/");
            dbmsg = dbmsg + ">>" + urlStr;
            console.log(dbmsg);
            document.URL = urlStr;
            console.log(document.URL); //書換えは出来ない
        }
        dbmsg = dbmsg + cookieName;
        var cookieName = cookieName + '=';
        var allcookies = document.cookie; //書き込み時と同じURL（サイト）のデータのみ読み出されます。
        console.log(decodeURIComponent(allcookies.substring(0, 200)));
        var position = allcookies.indexOf(cookieName);
        dbmsg = dbmsg + 'を' + position + '個から検索';
        dbmsg = dbmsg + ',全長=' + document.cookie.length;
        if (position != -1) {
            var startIndex = position + cookieName.length;
            var endIndex = allcookies.indexOf(';', startIndex);
            if (endIndex == -1) {
                endIndex = allcookies.length;
            }
            dbmsg = dbmsg + '、' + startIndex + '～' + endIndex;
            //   result = decodeURIComponent(allcookies.substring(startIndex, endIndex));
            result = unescape(allcookies.substring(startIndex, endIndex));
        }
        dbmsg = dbmsg + '、result＝' + result;
        console.log(dbmsg);
    } catch (err) {
        console.log(dbmsg + 'で' + err);
    }
    return result;
}

function deleteCookie(cookieName) {
    var dbmsg = '[deleteCookie]';
    var result = null;
    try {
        dbmsg = dbmsg + cookieName + 'を削除';
        var paths = readPath(); // new Array();
        var expire = new Date();
        expire.setTime(expire.getTime() - 1000 * 3600 * 24 * 7); //７日前
        document.cookie = cookie_name + '=' + '' + ';path=' + path + ';expires=' + expire.toUTCString(); //'name=' +  encodeURIComponent(write_text)
        console.log(dbmsg);
    } catch (err) {
        console.log(dbmsg + 'で' + err);
    }
    return result;
}

function retPID(read_text) {
    var dbmsg = '[retPID]';
    var result = null;
    try {
        dbmsg = dbmsg + read_text + 'からpIDを読み取り';

        console.log(dbmsg);
    } catch (err) {
        console.log(dbmsg + 'で' + err);
    }
    return result;
}

function retData(read_text) {
    var dbmsg = '[retPID]';
    var result = null;
    try {
        dbmsg = dbmsg + read_text + 'からDataを読み取り';

        console.log(dbmsg);
    } catch (err) {
        console.log(dbmsg + 'で' + err);
    }
    return result;
}

/*
cookieの仕様   http://www.openspc2.org/JavaScript/study/cookie.html
 */