function readElement(urlStr, wElement) {
    var dbmsg = '[readElement]' + urlStr + ',wElement=' + wElement;
    $.ajax({
        url: urlStr, //パスはcommon.jsが読み込まれたHTMLファイルが基準になります
        cache: false, //キャッシュを利用するか（お好みで）
        async: false, //非同期で読み込むか（お好みで）
        success: function(whtml) {
            document.getElementById(wElement).innerHTML = whtml;
            //    console.log(html);
        }
    });
    console.log(dbmsg);
} //http://affiliate.ks-product.com/javascript-common-parts-external/