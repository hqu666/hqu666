       var log_file; //fileオブジェクト
       var my_coookie;
       var tourokubi;
       var gid;
       var pid;
       var data;
       var dateStr;
       var timeStr;
       //    $(document).ready(function() { // ページ読み込み時に実行したい処理
       //        tourokubi = null;
       //        gid = null;
       //        pid = null;
       //        data = null;
       //        //       document.getElementById("gr_kousin_bt").style.display = "none"; //グループ更新
       //        syokika();
       //        //     fileInputRead(document.getElementById("input_02_file"), document.getElementById("edit_02_result"));
       //        my_coookie = 'atare_dice';
       //        readLoc();
       //    });

       //    function syokika() {
       //        var dbmsg = '[syokika]';
       //        document.getElementById("kousin_bt").style.display = "none"; //更新
       //        document.getElementById("qr_make_bt").style.display = "none"; //QRコード作成
       //        document.getElementById("qr_aria").style.display = "none";
       //        document.getElementById("gr_mail_bt").style.display = "none"; //メ-ルで連絡
       //        document.getElementById("member_list").style.display = "none";
       //        document.getElementById("alart_text").style.display = "none";
       //        isCookie();
       //    }

       function readLoc() {
           var dbmsg = '[readLoc]';
           /////http://www.tam-tam.co.jp/tipsnote/javascript/post9911.html   #789?gid=123&pid=456&data=789
           dbmsg = dbmsg + '現在のURLは' + location; //   document.write('現在のURLは' + location);
           dateStr = makeDateStr();
           dbmsg = dbmsg + '、現在;' + dateStr + '日';
           timeStr = makeTimeStr();
           dbmsg = dbmsg + timeStr + '秒';
           var urlHash = location.hash; // URLのアンカー（#以降の部分）を取得 アンカーが無ければ?以降の
           dbmsg = dbmsg + ' ,location.hash= ' + urlHash;
           if (urlHash) { //ハッシュが有れば
               hashRead(urlHash);
               dbmsg = dbmsg + ' ,渡された登録日=' + tourokubi + ',gid=' + gid;
               var cookie = getCookie(my_coookie); //
               dbmsg = dbmsg + ',cookie= ' + cookie;
               if (cookie) { //既に使ったことが有るディーラー経験者　と　
                   cookieRead(cookie); //設定内容の読取りに
               } else {
                   dbmsg = dbmsg + ',gid= ' + gid;
                   if (gid) {
                       if (pid) { //ディーラー以外
                           if (pid != 0) { //ディーラー以外

                           }
                       } else {
                           makeNewMember();
                       }
                   } else {
                       makeNewDealer();
                   }
               }
           } else { //初めてのアクセス
               makeNewDealer(); //ディーラー情報作成
           }

           $('#touroku').text(tourokubi);
           $('#gid').text(gid);
           $('#pid').text(pid);
           $('#data').text(data);
           makeNewCoookie(tourokubi, gid, pid, data);
           console.log(dbmsg);
       }

       function makeDateStr() {
           var result = null;
           var dbmsg = '[makeNewGrupe]';
           try {
               var hiduke = new Date(); //今日の日付データを変数hidukeに格納
               var year = hiduke.getFullYear(); //年・月・日・曜日を取得する
               dbmsg = dbmsg + ',year=' + year;
               var month = hiduke.getMonth() + 1;
               if (month < 10) {
                   month = "0" + month;
               }
               dbmsg = dbmsg + ',month=' + month;
               var day = hiduke.getDate();
               if (day < 10) {
                   day = "0" + day;
               }
               dbmsg = dbmsg + ',day=' + day;
               result = year + month + day;
               dbmsg = dbmsg + ',result=' + result;
               //       console.log(dbmsg);
           } catch (err) {
               console.log(dbmsg + 'で' + err);
           }
           return result;
       }

       function makeTimeStr() {
           var result = null;
           var dbmsg = '[makeTimeStr]';
           try {
               var hiduke = new Date(); //今日の日付データを変数hidukeに格納
               var houre = hiduke.getHours();
               if (houre < 10) {
                   houre = "0" + houre;
               }
               var minut = hiduke.getMinutes();
               if (minut < 10) {
                   minut = "0" + minut;
               }
               dbmsg = dbmsg + ',minut=' + minut;
               var seconds = hiduke.getSeconds();
               if (seconds < 10) {
                   seconds = "0" + seconds;
               }
               dbmsg = dbmsg + ',seconds=' + seconds;
               result = String(new String(houre)) + minut + seconds;
               dbmsg = dbmsg + ',result=' + result;
               //      console.log(dbmsg);
           } catch (err) {
               console.log(dbmsg + 'で' + err);
           }
           return result;
       }

       function makeNewCoookie(tourokubi, gid, pid, data) {
           var dbmsg = '[makeNewCoookie]';
           var result = null;
           try {
               // var gid = ''; // lastrecord_read("dice.txt");
               // var dateStr = makeDateStr();
               // if (gid) {
               //     gid = gid + 1;
               // } else {
               //     var timeStr = makeTimeStr();
               //     gid = (dateStr + timeStr).slice(2); //parseInt(
               // }
               var hashStr = tourokubi + "?gid=" + gid;
               if (pid) {
                   hashStr = hashStr + "&pid=" + pid;
               }
               if (data) {
                   hashStr = hashStr + "&data=\"" + data + "\""; //数値で,は無視された＞＞文字列にして渡した
               }
               dbmsg = dbmsg + ',' + my_coookie + 'に' + hashStr //   document.write('現在のURLは' + location);
               cockCookie(my_coookie, hashStr);
               //      writeTextFile(location.hash + "\n", "dice.txt"); //file.js
               hashRead(location.hash); //設定内容の読取りに
               //    readLoc();
               console.log(dbmsg);
           } catch (err) {
               showAlartAia(dbmsg + 'で' + err, "alert-warning");
               console.log(dbmsg + 'で' + err);
           }
           return result;
       }

       function hashRead(urlHash) {
           var dbmsg = '[hashRead]';
           try {
               dbmsg = dbmsg + ',urlHash=' + urlHash;
               // $('#location_str').text(urlHash);
               var datapart = urlHash.split("?");
               var tourokubi = datapart[0];
               $('#touroku').text(tourokubi);
               var hasypart = datapart[1];
               var hashd = hasypart.split("&");
               hashd.forEach(function(name) {
                   dbmsg = dbmsg + ',name=' + name;
                   var items = name.split("=");
                   var item_name = items[0];
                   var item_val = items[1];
                   dbmsg = dbmsg + ',' + item_name + '=' + item_val;
                   if (item_name == 'gid') {
                       gid = item_val;
                       $('#gid').text(item_val);
                   } else if (item_name == 'pid') {
                       pid = item_val;
                       $('#pid').text(item_val);
                   } else if (item_name == 'data') {
                       data = item_val;
                       $('#data').text(item_val);
                   }
               });
               console.log(dbmsg);
           } catch (err) {
               showAlartAia(dbmsg + 'で' + err, "alert-warning");
               console.log(dbmsg + 'で' + err);
           }
       }

       function cookieRead(urlHash) {
           var dbmsg = '[cookieRead]';
           try {
               dbmsg = dbmsg + ',urlHash=' + urlHash;
               var datapart = urlHash.split("?");
               var tourokubi = datapart[0];
               $('#touroku').text(tourokubi);
               var hasypart = datapart[1];
               var hashd = hasypart.split("&");
               hashd.forEach(function(name) {
                   dbmsg = dbmsg + ',name=' + name;
                   var items = name.split("=");
                   var item_name = items[0];
                   var item_val = items[1];
                   dbmsg = dbmsg + ',' + item_name + '=' + item_val;
                   if (item_name == 'gid') {
                       $('#gid').text(item_val);
                   } else if (item_name == 'pid') {
                       $('#pid').text(item_val);
                   } else if (item_name == 'data') {
                       $('#data').text(item_val);
                   }
               });
               console.log(dbmsg);
           } catch (err) {
               showAlartAia(dbmsg + 'で' + err, "alert-warning");
               console.log(dbmsg + 'で' + err);
           }
       }

       function makeNewGrupe() {
           var dbmsg = '[makeNewGrupe]';
           try {
               if (confirm('現在のグループ' + gid + 'を破棄して新しいグループでゲームを始めますか？')) {
                   var locationStr = String(new String(location));
                   dbmsg = dbmsg + ",location=" + locationStr;
                   // var hostnameStr = String(new String(location.hostname));                     拾えず
                   // dbmsg = dbmsg + ",hostname=" + hostnameStr;
                   var hashStr = String(new String(location.hash));
                   locationStr = locationStr.replace(hashStr, "");
                   dbmsg = dbmsg + ">>" + locationStr;
                   console.log(dbmsg);
                   document.location = locationStr;
                   syokika();
                   makeNewDealer();
               }
           } catch (err) {
               showAlartAia(dbmsg + 'で' + err, "alert-warning");
               console.log(dbmsg + 'で' + err);
           }
       }

       function makeNewDealer() {
           var dbmsg = '[makeNewDealer]';
           try {
               dbmsg = dbmsg + ',ディーラー情報作成';
               tourokubi = '#' + dateStr;
               gid = (dateStr + timeStr).slice(2);

               // $.confirm({ //http://jisakupc-technical.info/programing/jquery/3449/
               //     'title': 'タイトル',
               //     'message': 'ここにメッセージを表示します。',
               //     'buttons': {
               //         'OK': function() {
               //             //OKボタンの処理
               //             $(this).dialog('close');
               //         },
               //         'キャンセル': function() {
               //             //キャンセルボタンの処理
               //             $(this).dialog('close');
               //         }
               //     }
               // });

               if (confirm('参加者を集めますか？\n(キャンセルしたら一人で楽しむ設定でゲームをスタートします。)')) {
                   document.getElementById("gr_kousin_bt").style.display = "block"; //グループ更新
                   document.getElementById("qr_make_bt").style.display = "block";
                   document.getElementById("qr_aria").style.display = "none";
                   document.getElementById("gr_mail_bt").style.display = "block"; //メ-ルで連絡
                   document.getElementById("member_list").style.display = "block";
               }
               location.hash = tourokubi + "?gid=" + gid;
               pid = 0;
           } catch (err) {
               showAlartAia(dbmsg + 'で' + err, "alert-warning");
               console.log(dbmsg + 'で' + err);
           }
       }

       function makeNewMember() {
           var dbmsg = '[makeNewMember]';
           try {
               dbmsg = dbmsg + ',未登録メンバー';
               pid = (dateStr + timeStr).slice(6);
               dbmsg = dbmsg + "作成するpid=" + pid;
               location.hash = tourokubi + "?gid=" + gid + "?pid=" + pid;
           } catch (err) {
               showAlartAia(dbmsg + 'で' + err, "alert-warning");
               console.log(dbmsg + 'で' + err);
           }
       }

       function makeQR() { //http://jump-up.info/jquery/jquery_qrcode_js.html
           var dbmsg = '[makeQR]';
           try {
               gid = $('#gid').text();
               dbmsg = dbmsg + ',現在のグループ=' + gid;
               var dateStr = makeDateStr();
               dbmsg = dbmsg + ',dateStr=' + dateStr;
               document.getElementById("qr_make_bt").style.display = "none";
               document.getElementById("qr_aria").style.display = "block";
               $("#qr_aria").html("");
               var url_str = location;
               dbmsg = dbmsg + ',this_url=' + url_str;
               var testStr = String(new String(url_str)); //urlのままでは文字列判定できない
               dbmsg = dbmsg + ',testStr=' + testStr;
               if (testStr.match("file")) { //☆基本的にローカルファイル（使用しているマシンのディスク等）に情報を書き込むことは出来ません
                   url_str = testStr.replace("file:///I:/an/workspace/hqu666/hqu666/atarekunn/", "http://www.geocities.jp/hqu666/atarekunn/");
                   dbmsg = dbmsg + ">>" + url_str;
               }
               url_str = "\"" + url_str + "#" + dateStr + "?gid=" + gid + "\"";
               dbmsg = dbmsg + '　,location= ' + url_str;
               $("#qr_aria").qrcode({
                   width: 120,
                   height: 120,
                   text: url_str
               });
               $("a").attr("href", "?gid=" + gid);
               console.log(dbmsg);
           } catch (err) {
               console.log(dbmsg + 'で' + err);
           }
       }

       function lastrecord_read(file_name) {
           var dbmsg = '[lastrecord_read]';
           var retStr = null;
           dbmsg = dbmsg + ',file_name=' + file_name;
           urlHash = readTextFile(file_name); //file.js
           dbmsg = dbmsg + ',urlHash=' + urlHash;
           if (urlHash) {
               var datapart = urlHash.split("?");
               var tourokubi = datapart[0];
               $('#l_touroku').text(tourokubi);
               var hasypart = datapart[1];
               var hashd = hasypart.split("&");
               hashd.forEach(function(name) {
                   dbmsg = dbmsg + ',name=' + name;
                   var items = name.split("=");
                   var item_name = items[0];
                   var item_val = items[1];
                   dbmsg = dbmsg + ',' + item_name + '=' + item_val;
                   if (item_name == 'gid') {
                       $('#l_gid').text(item_val);
                       retStr = item_val;
                   } else if (item_name == 'pid') {
                       $('#l_pid').text(item_val);
                   } else if (item_name == 'data') {
                       $('#l_data').text(item_val);
                   }
               });
           }
           console.log(dbmsg);
           return retStr;
       }

       function alartCookie() {
           var dbmsg = '[alartCookie]';
           var result = null;
           try {
               cookieName = 'atare_dice';
               dbmsg = dbmsg + ',cookieName=' + cookieName;
               var result = getCookie(cookieName)
               var aType = "alert-info";
               if (result) {} else {
                   aType = "alert-danger";
                   result = 'このロケーションではcookeiが使えません。';
               }
               dbmsg = dbmsg + ',cookie=' + result;
               showAlartAia(result, aType);
               //           alert(result);
           } catch (err) {
               showAlartAia(dbmsg + 'で' + err, "alert-warning");
               console.log(dbmsg + 'で' + err);
           }
       }

       var nowArartType;

       function showAlartAia(wStr, aType) {
           var dbmsg = '[showAlartAia]';
           try {
               dbmsg = dbmsg + ',aType=' + aType;
               document.getElementById("alart_text").style.display = "inline-flex";
               $('#alart_text').addClass(aType);
               nowArartType = aType;
               dbmsg = dbmsg + ',書込み=' + wStr;
               document.getElementById("alart_str").innerHTML = wStr;
               //      alert(wStr);
           } catch (err) {
               showAlartAia(dbmsg + 'で' + err, "alert-warning");
               console.log(dbmsg + 'で' + err);
           }
       }

       function hideAlartAia() {
           var dbmsg = '[hideAlartAia]';
           try {
               $('#alart_text').removeClass(nowArartType);
               document.getElementById("alart_str").innerHTML = "";
               document.getElementById("alart_text").style.display = "none";
               console.log(document.getElementById("alart_text"));
           } catch (err) {
               console.log(dbmsg + 'で' + err);
           }
       }