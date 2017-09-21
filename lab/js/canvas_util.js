var tbCanvas; //下絵
var tbCtx;
var cPNow = ''; //cutPict2Element側
var iPhot = [];
var pCanvas = []; //下絵
var pCtx = [];
var fPNow = ''; //fitPict2Element側
var fPCount = 0; //fitPict2Element側
var photalign = 0; //canvas内でフィットさせる位置
var photFitalign = 0;
var cutPictWidht;
var cutPictHight;
var cutOpacity;
var fitOpacity;
var fitFleamWidth;
var fitFleamColor;
var backBord = "back_bord";
var phot1 = "add_phot1";
var phot2 = "add_phot2";
var pictScale = 1;

function makeWallBace(elentName, pearentID, tX, tY, tWidth, tHeight) {
    var tag = "[canvas_util.makeWallBace]";
    var dbMsg = tag + ",elentName=" + elentName + "を" + pearentID + "に作成";
    dbMsg = dbMsg + "(" + tX + "," + tY + ")[" + tWidth + "×" + tHeight + "]";
    var node = document.getElementById(elentName);
    if (node) {
        // if (node.parentNode) {
        //     node.parentNode.removeChild(node);
        //     dbMsg = dbMsg + ",既存削除";
        // }
    } else {
        var pearentObj = document.getElementById(pearentID); //idで親要素を取得 
        tbCanvas = document.createElement("canvas");
        tbCanvas.id = elentName;
        tbCanvas.style.width = '100%'; //tWidth + "px"; //☆'100vw';ではプロパティがデフォルトの300*150になる
        tbCanvas.style.height = 'auto'; //tHeight + "px"; //tHeight + "px"; //'100vh'; // = winH - 5;'auto'
        tbCanvas.style.left = tX + "px";
        tbCanvas.style.top = tY + "px";
        dbMsg = dbMsg + ",作成したcanvas=" + tbCanvas.id;
        pearentObj.appendChild(tbCanvas); //「boxes」の要素の最後尾に複製した要素を追加
    }

    tbCanvas = document.getElementById(elentName);
    tbCtx = tbCanvas.getContext('2d');
    myLog(dbMsg);
    if (debug_now == true) {
        // console.log(imgObj);
    }
}

/**
 * 親エレメントにcanvasを作成して全画面いっぱいに写真を配置する
 * @param {*} elentName 
 * @param {*} pearentID 
 * @param {*} tX 
 * @param {*} tY 
 * @param {*} tWidth 
 * @param {*} tHeight 
 * @param {*} align カットされる写真の中で残す部分
 * @param {*} srcName 
 * @param {*} opacity 
 */
function cutPict2Element(elentName, pearentID, tX, tY, tWidth, tHeight, align, srcName, opacity) {
    var tag = "[canvas_util.cutPict2Element]";
    var dbMsg = tag + ",elentName=" + elentName + "を" + pearentID + "に作成";
    dbMsg = dbMsg + "(" + tX + "," + tY + ")[" + tWidth + "×" + tHeight + "]align=" + align + "、opacity=" + opacity;
    cutPictWidht = tWidth;
    cutPictHight = tHeight;
    opacity = opacity * 1;
    if (opacity) {
        cutOpacity = opacity
    } else {
        cutOpacity = 1;
    }
    photalign = align * 1;
    if (tbCtx) {} else {
        makeWallBace(backBord, "canvas_bace", 0, 0, tWidth, tHeight); //baceWidth, baceHeight);
    }
    var img = new Image();
    dbMsg = dbMsg + ",src=" + srcName;
    img.src = srcName;
    // img.crossOrigin = "Anonymous"; //XAMPP必要；file;//ではcrossdomeinエラー発生   http://inside.pixiv.net/entry/2014/12/16/181804
    cPNow = img.src + '';
    myLog(dbMsg);
    img.onload = function(event) {
        var dbMsg = tag + "[cutPict2Element.onload]";
        dbMsg = dbMsg + ",src=" + img.src;
        if (img.src.match(cPNow)) { //前の設定に書き戻される
            var dstWidth = this.naturalWidth; //this.width;
            var dstHeight = this.naturalHeight; //this.height;
            dbMsg = dbMsg + ",写真の元サイズ[" + dstWidth + "×" + dstHeight + "]";
            var tbCanvasWidth = Math.round(cutPictWidht + 0.5); //$('#' + tbCanvas.id).width(); //tbCanvas.clientWidth;
            var tbCanvasHeight = Math.round(cutPictHight + 0.5); // $('#' + tbCanvas.id).height(); //tbCanvas.clientHeight;
            dbMsg = dbMsg + ",Canvas[" + tbCanvasWidth + "×" + tbCanvasHeight + "]";
            tbCtx.canvas.width = tbCanvasWidth; //  canvas#canvas_aria
            tbCtx.canvas.height = tbCanvasHeight;
            var scaleWidth = tbCanvasWidth / dstWidth;
            var scaleHeight = tbCanvasHeight / dstHeight;
            dbMsg = dbMsg + ",scale[" + scaleWidth + "×" + scaleHeight + "]%";
            var biScale = scaleHeight;
            if (scaleHeight < scaleWidth) {
                biScale = scaleWidth;
            }
            dbMsg = dbMsg + ">>" + biScale + "%";
            dstWidth = dstWidth * biScale;
            dstHeight = dstHeight * biScale;
            dbMsg = dbMsg + ",書込み[" + dstWidth + "×" + dstHeight + "]align=" + photalign;
            var sPosition = camvasaPosition(photalign, dstWidth, dstHeight, tbCanvasWidth, tbCanvasHeight, 0);
            var sx = sPosition.x;
            var sy = sPosition.y;
            dbMsg = dbMsg + ",shit(" + sx + "," + sy + ")";
            tbCtx.clearRect(sx, sy, dstWidth, dstHeight);
            tbCtx.drawImage(this, sx, sy, dstWidth, dstHeight); //書き込み
            // if (1 < biScale) {
            //     document.getElementById('back_bord').style.transform = 'scale(' + (1 / biScale) + ')'; //-webkit-transform: scale(0.9);
            //     document.getElementById('back_bord').style.webkitTransformOrigin = '0 0 0'; //左肩に指定しないと中心に寄せられる
            // }

            cutOpacity = cutOpacity + '';
            dbMsg = dbMsg + ",cutOpacity=" + cutOpacity;
            $('#' + backBord).css({ "opacity": '0' }).css({ "position": "absolute" }).css({ "display": "block" }); //css({ "z-index": "-1" }).
            dbMsg = dbMsg + ",cutOpacity＝" + cutOpacity + ",fiTime＝" + fiTime;
            if (0 < fiTime) {
                $('#' + backBord).fadeTo(fiTime / 2, cutOpacity);
            } else {
                $('#' + backBord).css({ "opacity": cutOpacity });
            }
            var imgObj = { ctx: tbCtx, iObj: this, scale: biScale, x: sx, y: sy };
        }
        myLog(dbMsg);
        if (debug_now == true) {
            // console.log(imgObj);
        }
    }
    img.onerror = function(message, source, lineno, colno, error) {
        var tag = "[cutPict2Element.onerror]";
        var dbMsg = tag + ".message=" + message;
        dbMsg = dbMsg + ".source=" + source;
        dbMsg = dbMsg + ".lineno=" + lineno;
        dbMsg = dbMsg + ".colno=" + colno;
        dbMsg = dbMsg + ".error=" + error;
        myLog(dbMsg);
    }
}


/**
 * 
 * @param {*} align 
 * @param {*} dstWidth 
 * @param {*} dstHeight 
 * @param {*} tbCanvasWidth 
 * @param {*} tbCanvasHeight 
 * @param {*} fleamWidth 
 */
function camvasaPosition(align, dstWidth, dstHeight, tbCanvasWidth, tbCanvasHeight, fleamWidth) {
    var tag = "[camvasaPosition]";
    var dbMsg = dbMsg + "元画像[" + dstWidth + "×" + dstHeight + "]を[" + tbCanvasWidth + "×" + tbCanvasHeight + ",fleamWidth=" + fleamWidth;
    var sx = (tbCanvasWidth - dstWidth - fleamWidth * 2) / 2 + fleamWidth; //横中心
    var sy = (tbCanvasHeight - dstHeight - fleamWidth * 2) / 2 + fleamWidth; //縦中心
    dbMsg = dbMsg + ",align=" + align;
    switch (align) {
        case 1:
        case 4:
        case 7:
            sx = fleamWidth; //左寄せ
            break;
        case 2:
        case 5:
        case 8:
            sx = tbCanvasWidth - dstWidth + fleamWidth; //右寄せ
            break;
    }
    switch (align) {
        case 3:
        case 4:
        case 5:
            sy = fleamWidth;
            break;
        case 6:
        case 7:
        case 8:
            sy = tbCanvasHeight - dstHeight + fleamWidth;
            break;
    }
    return { x: sx, y: sy };
}

/**
 * 親エレメントにcanvasを作成しその中に収める
 * @param {*} elentName 
 * @param {*} pearentID 
 * @param {*} tX 
 * @param {*} tY 
 * @param {*} tWidth 
 * @param {*} tHeight 
 * @param {*} align 余白ができる場合に寄せる方向
 * @param {*} srcName 
 * @param {*} opacity 透明度　0～1
 * @param {*} fleamWidth 枠線の太さ　0/未記入で無し　
 * @param {*} fleamColor 枠線の色
 */
function fitPict2Element(elentName, pearentID, tX, tY, tWidth, tHeight, align, srcName, scale, opacity, fleamWidth, fleamColor) {
    var tag = "[fitPict2Element]";
    var dbMsg = tag + ",elentName=" + elentName + ",pearentID=" + pearentID;

    dbMsg = dbMsg + "(" + tX + "," + tY + ")[" + tWidth + "×" + tHeight + "]align=" + align + "、scale=" + scale + "、fleamWidth=" + fleamWidth + "、Color=" + fleamColor;
    photFitalign = align * 1;
    if (scale == 0) {
        scale = 100;
    }
    pictScale = scale / 100;
    opacity = opacity * 1;
    if (0 < opacity) {
        fitOpacity = opacity;
    } else {
        fitOpacity = 1;
    }
    if (fleamWidth) {
        fitFleamWidth = fleamWidth;
    } else {
        fitFleamWidth = 0;
    }
    if (fleamColor) {
        fitFleamColor = fleamColor;
    } else {
        fitFleamColor = 'white';
    }
    // // var defer = $.Deferred();
    // // var pandSize = boxes.style.paddingTop;
    // // dbMsg = dbMsg + "pandSize=" + pandSize;
    $('#' + pearentID).css({ "display": "inline-block" }); //inline-block
    // $('#' + pearentID).css({ "width": tWidth + "px" });
    // $('#' + pearentID).css({ "height": tHeight + "px" });
    // document.getElementById(pearentID).clientWidth = tWidth;
    // document.getElementById(pearentID).clientHeight = tHeight;
    var pearentObj = document.getElementById(pearentID); //idで親要素を取得 
    pearentObj.innerHTML = "";
    // fPCount++;
    dbMsg = dbMsg + "(fPCount;" + fPCount + ")";
    pCanvas[fPCount] = document.createElement("canvas");
    pCanvas[fPCount].id = elentName;
    // // pCanvas.style.position = 'absolute';
    // // pCanvas[fPCount].style.width = tWidth + "px"; //☆'100vw';ではプロパティがデフォルトの300*150になる  pCanvas[fPCount].width = tWidth + "px";では反映されない
    // // pCanvas[fPCount].style.height = tHeight + "px"; //'100vh'; // = winH - 5;
    // pCanvas[fPCount].style.marginLeft = tX + "px"; //☆'100vw';ではプロパティがデフォルトの300*150になる
    // pCanvas[fPCount].style.marginTop = tY + "px"; //'100vh'; // = winH - 5;
    pCanvas[fPCount].width = tWidth;
    pCanvas[fPCount].height = tHeight;
    dbMsg = dbMsg + ",作成したcanvas=" + pCanvas[fPCount].id;
    pearentObj.appendChild(pCanvas[fPCount]); //「boxes」の要素の最後尾に複製した要素を追加
    pCanvas[fPCount] = document.getElementById(elentName);
    dbMsg = dbMsg + ",src=" + srcName;
    pCtx[fPCount] = pCanvas[fPCount].getContext('2d');
    iPhot[fPCount] = new Image();
    iPhot[fPCount].src = srcName;
    iPhot[fPCount].id = elentName;
    // pCanvas[fPCount].clientWidth = tWidth; // iPhot[fPCount].width = tWidth;
    // pCanvas[fPCount].clientHeight = tHeight; // iPhot[fPCount].height = tHeight;
    dbMsg = dbMsg + " , location=" + window.location.href;
    if (!window.location.href.match('localhost')) {
        iPhot[fPCount].crossOrigin = "Anonymous"; //crossdomeinエラー発生①file;//②http://をXAMPPで読む
    }
    fPNow = iPhot[fPCount].src + '';
    myLog(dbMsg);
    if (debug_now == true) {
        console.log(pCanvas[fPCount]);
        console.log(pCtx[fPCount]);
    }
    iPhot[fPCount].addEventListener('load', function() {
        dbMsg = "[fitPict2Element.onload]";
        dbMsg = dbMsg + "(" + fPCount + ")";
        dbMsg = dbMsg + ",src=" + this.src; //iPhot[fPCount].src;
        for (var j = 0; j < iPhot.length; j++) {
            dbMsg = dbMsg + "  (" + j + "/" + iPhot.length + ")" + iPhot[j].src;
            if (iPhot[j].src.match(this.src) && iPhot[j].id.match(this.id)) { //同じ画像でもエレメントが異なれば処理開始
                var dstWidth = this.width;
                var dstHeight = this.height;
                dbMsg = dbMsg + ",写真の元サイズ[" + dstWidth + "×" + dstHeight + "]";
                var tbCanvasWidth = pCanvas[j].width; //.clientWidth; //this.clientWidth; //pCanvas[j].element.clientWidth;
                var tbCanvasHeight = pCanvas[j].height; //.clientHeight; //this.clientHeight; // pCanvas[j].element.clientHeight;
                dbMsg = dbMsg + ",Canvas[" + tbCanvasWidth + "×" + tbCanvasHeight + "]";
                // pCtx[j].canvas.width = tbCanvasWidth;
                // pCtx[j].canvas.height = tbCanvasHeight;
                var ctx_w = pCtx[j].canvas.width;
                var ctx_h = pCtx[j].canvas.height;
                dbMsg = dbMsg + "読み込み前[" + ctx_w + "×" + ctx_h + "]"; //読み込み前[916×941]=offsetWidth=clientWidth=scroll 
                var scaleWidth = (tbCanvasWidth - fitFleamWidth * 2) / dstWidth;
                var scaleHeight = (tbCanvasHeight - fitFleamWidth * 2) / dstHeight;
                dbMsg = dbMsg + ",scale[" + scaleWidth + "×" + scaleHeight + "]%";
                var biScale = scaleHeight;
                if (scaleWidth < scaleHeight) {
                    biScale = scaleWidth;
                }
                dbMsg = dbMsg + ">>" + biScale + "%";
                dstWidth = dstWidth * biScale * pictScale;
                dstHeight = dstHeight * biScale * pictScale;
                dbMsg = dbMsg + ",書込み[" + dstWidth + "×" + dstHeight + "]align=" + photFitalign;
                pCtx[j].fillStyle = fitFleamColor;
                dbMsg = dbMsg + "、枠線＝" + fitFleamWidth + "、色-" + fitFleamColor;
                var drowWidth = fitFleamWidth; // * biScale;
                dbMsg = dbMsg + ">>drowWidth=" + drowWidth;
                var sPosition = camvasaPosition(photFitalign, dstWidth, dstHeight, tbCanvasWidth, tbCanvasHeight, drowWidth);
                var sx = sPosition.x;
                var sy = sPosition.y;
                dbMsg = dbMsg + ">>shit(" + sx + "," + sy + ")";
                pCtx[j].clearRect(0, 0, tbCanvasWidth, tbCanvasHeight);
                dbMsg = dbMsg + ",fitOpacity=" + fitOpacity;
                pCtx[j].globalAlpha = fitOpacity;
                pCtx[j].fillRect(sx - fitFleamWidth, sy - fitFleamWidth, dstWidth + fitFleamWidth * 2, dstHeight + fitFleamWidth * 2);
                pCtx[j].clearRect(sx, sy, dstWidth, dstHeight);
                pCtx[j].drawImage(this, sx, sy, dstWidth, dstHeight); //書き込み
                var imgObj = { ctx: pCtx[fPCount], iObj: this, scale: biScale, x: sx, y: sy };
                dbMsg = dbMsg + ",残り" + iPhot.length + "件";
            }
            if (debug_now == true) {
                console.log(pCanvas[j]);
                console.log(pCtx[j]);
            }
        }
        myLog(dbMsg);
    }, false);

    iPhot[fPCount].onerror = function(message, source, lineno, colno, error) {
        var tag = "[fitPict2Element.onerror]";
        var dbMsg = tag + ".message=" + message;
        dbMsg = dbMsg + ".source=" + source;
        dbMsg = dbMsg + ".lineno=" + lineno;
        dbMsg = dbMsg + ".colno=" + colno;
        dbMsg = dbMsg + ".error=" + error;
        myLog(dbMsg);
    }
} //型になる静止画を読み//