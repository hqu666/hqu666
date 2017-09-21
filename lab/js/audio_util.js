var audioArray = new Array();
var audio = null;
var aVolLimit = 1.0; //0.0（無音）～ 1.0（最大）
var aVol = 0.0; //0.0（無音）～ 1.0（最大）
var aFOTime = 2000;
var aUrl; //オーディオファイルのUrl
var aCalentTimel; //オーディオファイルのカットごとのスタートポイント
//オーディオについて（HTMLAudioElement）   http://hakuhin.jp/js/audio.html#AUDIO_04
function audioFI() {
    var tag = "[audioFI]";
    var dbMsg = tag;
    // console.log(audio);
    dbMsg = dbMsg + "volume=" + audio.volume;
    if (audio.volume < (aVolLimit - 0.1)) {
        audio.volume = audio.volume + 0.05;
        dbMsg = dbMsg + ">>" + audio.volume + "/" + aVolLimit;
        audioArray.push(setInterval("audioFI()", 50));
    } else {
        audio.volume = aVolLimit;
        stopNIAnimation(audioArray);
    }
    // myLog(dbMsg);
}

function audioF0() {
    var tag = "[audioF0]";
    var dbMsg = tag;
    var volStep = 0.02;
    var stepTime = aFOTime * volStep;
    dbMsg = dbMsg + "フェードアウトタイム=" + aFOTime + "ms,ステップ=" + volStep + ",間隔=" + stepTime;
    if (audio) {
        dbMsg = dbMsg + "volume=" + audio.volume;
        if (0.05 < audio.volume) {
            audio.volume = audio.volume - 0.02;
            dbMsg = dbMsg + ">>" + audio.volume;
            audioFOArray.push(setTimeout("audioF0()", stepTime));
        } else {
            audio.volume = 0;
            stopNIAnimation(audioFOArray);
            audio.pause();
            audio.muted = true; // ミュートを有効
        }
    }
    // myLog(dbMsg);
}

function audioCutStayt(audio, startTime) {
    var tag = "[audioCutStayt]";
    var dbMsg = tag;
    audio.muted = false; // ミュートを解除
    dbMsg = dbMsg + ",volume=" + audio.volume;
    audio.volume = 0.1;
    dbMsg = dbMsg + ",>>" + audio.volume;
    aVol = audio.volume;
    dbMsg = dbMsg + ",currentTime=" + audio.currentTime;
    // startTime = startTime;// parseFloat(startTime)
    dbMsg = dbMsg + ",startTime=" + startTime;
    audio.currentTime = startTime;
    dbMsg = dbMsg + ">>" + audio.currentTime; // + "/" + audio.duration;
    myLog(dbMsg);
}


function audioLoad2Play(sSrc, startTime) {
    var tag = "[audioLoad2Play]";
    var dbMsg = tag;
    dbMsg = dbMsg + "sSrc=" + sSrc + "を" + startTime + "秒から再生";
    if (startTime) {
        startTime = startTime * 1;
    } else {
        startTime = 0;
    }
    // myLog(dbMsg);
    if (audio) {
        startTime = startTime * 1;
        dbMsg = dbMsg + "、現在；sSrc=" + audio.src + "、" + audio.currentTime + "ms,Vol=" + audio.volume;
        audio.pause();
        audio.src = '';
        // if (0 < audio.volume) {
        //     audioF0();
        // }
        var typeName = ' type="audio/mpeg">'
        if (sSrc.match('.m4a')) {
            typeName = ' type="audio/mp4">'
        } else if (sSrc.match('.ogg')) {
            typeName = ' type="audio/ogg">'
        } else if (sSrc.match('.wav')) {
            typeName = ' type="audio/wav">'
        }
        dbMsg = dbMsg + ",typeName=" + typeName;
        audio.autoplay = true; // 自動再生を有効
        //   audio.innerHTML = '<source src="' + sSrc + ' type="audio/mpeg">';//Failed to load resource: the server responded with a status of 404 (Not Found)
        audio.src = sSrc; //currentSrc; サウンドファイルまでの URL アドレスを指定
        audio.load(); // 読み込みを開始する
        dbMsg = dbMsg + ",readyState=" + audio.readyState;
        if (audio.readyState === 4) {
            dbMsg = dbMsg + "=HAVE_ENOUGH_DATA:再生位置に加え次フレームデータまでをダウンロード済みであり、且つダウンロード速度から計算し、最後まで再生できるだけのデータをダウンロード済";
            audioCutStayt(audio, startTime);
            // audio.play();
        } else {
            if (audio.readyState === 3) {
                dbMsg = dbMsg + "=HAVE_FUTURE_DATA;再生位置に加え次フレームデータまでをダウンロード済み";
            } else if (audio.readyState === 2) {
                dbMsg = dbMsg + "=HAVE_CURRENT_DATA:現在再生位置の直近までのデータをダウンロード済み";
            } else if (audio.readyState === 1) {
                dbMsg = dbMsg + "=HAVE_METADATA;メディアメタデータのダウンロード済み";
            } else if (audio.readyState === 0) {
                dbMsg = dbMsg + "=HAVE_NOTHING:何もダウンロードしていない";
            }
            // 再生可能状態でなければ再生可能状態になった時のイベント通知をセットします
            audio.addEventListener('canplaythrough', function(e) {
                audio.removeEventListener('canplaythrough', arguments.callee);
                audioCutStayt(audio, startTime);
                // audio.play();
            });
        }
        // audio.addEventListener("timeupdate", function() {
        //     if (Math.floor(this.currentTime * 10) <= 1 && !this.paused) {
        //         playStart(this); //再生開始時の処理
        //     }
        // }, false);
        audio.muted = false; // ミュートを解除
        dbMsg = dbMsg + ",volume=" + audio.volume;
        audio.volume = 0.1;
        dbMsg = dbMsg + ",>>" + audio.volume;
        aVol = audio.volume;
        dbMsg = dbMsg + ",currentTime=" + audio.currentTime;
        audio.currentTime = startTime;
        dbMsg = dbMsg + ">>" + audio.currentTime; // + "/" + audio.duration;
        // console.log(audio);
        // audio.play(); // 再生を開始するaudio.duration

    } else {
        audio = document.getElementById('audio_control'); //idで親要素を取得
        dbMsg = dbMsg + "Audioを新規生成";
        // audio = new Audio(); // AudioElement を作成
    }
    dbMsg = dbMsg + ",paused =" + audio.paused;
    myLog(dbMsg);
    if (debug_now == true) {
        aVol = 0.0;
        aVolLimit = 0.1;
    } else {
        aVolLimit = 1.0;
    }
    audioFI();
}

//bgm   http://www.cinematic.jp/cinematic-freebgm/