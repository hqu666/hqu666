<style>
    canvas {
        background-color: 'transparent'; 
    }
</style>

<div id="canvas_bace"  style="width: 105%; height: 106%;  position: absolute; z-index: -1;display: block;">
    <canvas id="canvas_aria" style="width: 100%; height: 100%;display: inline; margin-top: -16px; margin-left: -16px;">
    </canvas>
</div>
<div id ="newimg_div" style="width: 100%; height: auto; position: absolute;">        <!-- position: absolute;-->
    <!--<canvas id="new_phot_aria" style="display: none; margin-top: -16px; margin-left: -16px;">
    </canvas>-->
</div>
<video id="bg_video" autoplay loop muted style=" background: #FFF; position: fixed;right: 0; bottom: 0;min-width: 100%;min-height: 100%;width: auto; height: auto; z-index: -1;"></video>

<div id ="efect_div" style="width: 100%; height: auto; position: absolute; z-index: -1;">           <!-- position: absolute;-->
<!--    <canvas id="efect_aria" style="display: inline; ">
    </canvas>-->
</div>

<?php if ($isTrial): ?>
    <span class="trial-panel">
        お試しアカウント(本番使用不可)
    </span>
<?php endif; ?>


<div id="slide-data"></div>

<!-- Hogan template -->
<script type="text/template" class="templateResult">
    {{#images}}
    <img id="{{md5}}" src="{{image}}" class="frame" data-height="{{height}}" data-width="{{width}}">
    {{/images}}
</script>
<!--Hogan template end-->

<div id ="newimg_div" style="width: 100%; height: auto; position: absolute; z-index: -1;">        <!-- position: absolute;-->
    <canvas id="new_phot_aria" style="display: none; margin-top: -16px; margin-left: -16px;">
    </canvas>
</div>

<div class="container" id="info_bord" style="display: inline;color: #0dd813;text-align: center; display: none;">
    <div class="row">
        <div class="col-sm-1"></div>
        <div class="col-sm-10">
            <div  id = "info_bord_bace" style="padding: 10px;margin-bottom: 10px;border: 1px solid #333333;border-radius: 10px;width: 90%;margin-left: 32px;position:absolute;background-color: #ffffff;color: #000000;
                  font-size: 32px;font-family: serif;" align="left"> 
                <div class="col-sm-3">
                    <img border="0" src='/img/slide/photo_empty_design_phone.png' alt="イラスト1" style="width: 100%; margin: 20%;">      
                </div>
                <div class="col-sm-9" style="text-align: center;">
                    <div style="margin-top: 8%;">
                        <img border="0" src="/img/slide/photo_empty_design_txt01.png" alt="フォトシェアをするでボタンからみんなで写真をシェアしよう" style="width: 90%;">
                    </div>
                    <div style="margin-top: 4%;">
                        <img border="0" src='/img/slide/photo_empty_design_txt02.png' alt="写真がこの画面に飛び込んできます！" style="width: 80%; margin-top: 20px;margin-bottom: 20px;">                  
                    </div>
                    <div style="margin-top: 4%;">
                        <img border="0" src='/img/slide/photo_empty_design_txt03.png' alt="お友達同士、会社関係のかた、自撮りなどなど、色んな写真を贈りましょう！" style="width: 80%;">
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-1"></div>
    </div>
</div>
<div id = "count_moniter" style="display: none; bottom: 0px; position: absolute; color: #0dd813;">
    ストック;ID<span id ="now_play_id"></span> / 
    <span id ="max_id"></span> ;
    <span id ="now_play_count"></span> / 
    <span id ="total_count"></span> ;
    新着<span id ="arrival_id"></span> ;
    <span id ="arrival_count"></span> / 
    <span id ="arrival_total"></span> ;
<!--    <select id="aliveSel">
        <option value="0">0;左下から中央へ</option>
        <option value="1">1;左上から中央へ</option>
        <option value="2">2;右上から中央へ</option>
        <option value="3">3;右下から中央へ</option>
        <option value="4">4;右下-左-右上へ旋回</option>
        <option value="5">5;左下-右-左上へ旋回</option>
        <option value="6">6;左上-右-左下へ旋回</option>
        <option value="7">7;右上-左-右下へ旋回</option>
    </select>-->
    <!--     onchange="naPatternSet()"-->
</div>
<script>
    var isReload = false;
    var settings;
    var count = 0;
    var maxId = 0;

    var debug_now = true;   //コミット時はfalseに
    var $data;
    var $is_mobile;
    var $is_tablet;
//        var ceremonyId;
//        var token;
    var isStart = false;                 //既にloopは開始されている;slideStart()でtrueに
    var isReload = false;
    var winW, winH;
    var vanishingPoint; //消失点= Z = winW(写真を止めてみせるのはz=0)
    var vpPer; //原点から消失点までの角度     Math.atan(orgW / winW)
    var nowMaxId = -1;
    var isQueueing = false;                      //データ読み取り中
    var queueingCount = 0;                      //データが有るのにデーターが取得できなかった回数；正常に読み込みを開始したらリセット
    var queueingLimit = 10;                    //強制的にリロードを実施する限度値(3000ms*10回で30秒)
    //写真
    var nextImages = [];                                //ストック再生中の写真データ配列
    var isStock = false; //蓄積画像のアニメーション実行;slideAnimationの開始でtrue/終了でfalse
    var isStockEnd = true; //蓄積画像のアニメーションがFoまで完了している
    var totalClount = 0;
    var newImg_ctx; //☆onloadから戻り値に渡す
    var setCount = 2; //何枚づつ表示させるか； dataQueueing , dataBind
    var stackCount = 4;
    var stayTime = 2000; //停止して表示させる時間[mS]
    var anime_time = 7000; //ストックアニメーション;フェードイン～停止;cssアニメーションに設定されていた秒数
    var queuing_time = anime_time; //アニメーション送り
    var bind_time = anime_time + 1000; //データ読み込み
    var stayScale = 0.7; //停止して表示させる時の表示枠中の比率☆長手方向と表示画面縦横いづれかの比率
    var PhotAFRate = 30; //写真アニメーションのフレームレート               
    var scale_xy;
    var resize_w, resize_h; //チャンバス内の描画領域
    var select_ippenn, select_x, select_y;
    var resize_now = false; //リドロウ以降に画面サイズが変わった
    var reloadCount = 0;             //urlが届かなかったカウント
    var reloadLimit = 5;             //reloadCountがこの値に達した時、Stockが無ければリロード。Stockが有ればリロード前にStockアニメのn周分、info_bordを表示してからリロード
    var noArrivalLoopCount = 0;             //新着が届かなかったStockLoopのカウント
    var noArrivalLoopLimit = 10;             //reloadCountがこの値に達した時、Stockが無ければリロード。Stockが有ればリロード前にStockアニメのn周分、info_bordを表示してからリロード
    var stockID;                        //生成されたimgタグのID

    //新着
    var newId = -1; //追加された写真のID
    var naPattern = -1; //アニメーションパターン；-1;終了、0;下-中央、1;左-中央、2;上-中央、3;右-中央、4;右下-左-右上、5;左下-右-左上、6;左上-右-左下、7;右上-左-右下
    var sinarioNo = -1;
    var arrivalsIDArray; //新着画像のID配列
    var arrivalsArray; //新着画像のUrl配列
    var isArrival = false; //登場アニメーション実行中;newImageWriteの開始でtrue/終了でfalse
    var isArrival01 = false; //登場アニメーションの飛行部分実行中
    var farstArrival = false; //一通目
    var newImageReading = false;    //新着確認中
    var parentOj; //Canvasの親ノード
    var newImg_fadeTimer; // 新着のタイマースレッド

    //花弁アニメーション
    var useBGAnime = true;
    var IMAGE_URL;
    var photAria = []; //回避領域
    var photID = -1, photX = photY = photZ = photW = photH = photT = 1; //エフェクトに渡す逐次の座標情報
    var effectCanvas;
    var effectContex;
    var SAKURA_COUNT = SAKURA_COUNT_DEFAULT = 300; //出現数の上限(FHDでの個数；画面サイズに応じて増減)
    var SAKURA_COUNT_Arrival = SAKURA_COUNT * 2; //新着時；風に流れてフレームアウトするオブジェクトの出現数
    var effctNowID = 0; //次のエフェクト番号
    var arrivalID = -1; //新着への切り替わり番号
    var IMG_SIZE = 30; //drawImageの初期サイズ；w,h org=15
    var endScale = 4.0; //最終倍率
    var safeAria = 50; //回避範囲//20だと追い付かれる   
    var _sakuras = []; //エフェクトオブジェクト個々のパラメータ配列
    var windRoots = []; //風の発生源、org;マウスポイント>>写真の位置？
    var effectImgS = []; //エフェクトオブジェクトを格納する配列；要素数はSAKURA_COUNTまで ; effectInitで初期化
    var effectFRate = 30;
    var isStayEnd = true; //画像のアニメーション静止終了;trueは静止中；回避エリアの拡大/縮小に使用
    var image_url00 = '<?php echo $this->webroot; ?>img/slide/gerbera_marri-slide_orange.png';
    var image_url01 = '<?php echo $this->webroot; ?>img/slide/gerbera_marri-slide_purple.png';
    var image_url02 = '<?php echo $this->webroot; ?>img/slide/lily_marri-slide_white.png';
    var image_url03 = '<?php echo $this->webroot; ?>img/slide/lily_marri-slide_yellow.png';
    var image_url04 = '<?php echo $this->webroot; ?>img/slide/rose_marri-slide_pink.png';
    var image_url05 = '<?php echo $this->webroot; ?>img/slide/rose_marri-slide_red.png';
    //背景
//        var ceremonies_slide_bg; //☆*1で演算して数値化
    var nowColor = '#000000';     //document.body.style.background;
    var efectOj; //efectCanvasの親ノード
    var effectTimer; //エフェクトのタイマースレッド
    var now_setting = false;
    var b_anime = false;
    var b_bgv = '/files/background.mp4';
    var isVideo = false;
    var my_canvas, ctx;
    var img_w, img_h, img_obj;
    var aria_w, aria_h;
    var ctx_w, ctx_h;
    var offset_top, offset_left;
    var offset_width, offset_height;
    var cyouhen, tanpen;
    var x, y, relX, relY, objX, objY;

    $(document).ready(function () {
        var tag = "[document.ready]";
        var dbMsg = tag;
        try {
            resize_now = false; //リドロ-以降に画面サイズが変わった
            $('#canvas_bace').css("display", "none");
            $data = <?php echo json_encode($data, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?>; //コントローラーからのデータ受け取り
            ceremonyId = $data['ceremony']['ceremonies_id'];
            ceremonies_slide_bg = $data['ceremony']['ceremonies_slide_bg'] * 1; //☆*1で演算して数値化
            token = <?php echo json_encode($token, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?>;
            dbMsg = dbMsg + ",ceremonyId=" + ceremonyId + ",token=" + token;
            $is_mobile = <?php echo json_encode($is_mobile, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?>; //デバッグツール        php echo $this->Common->isMobile();で拾えず
            $is_tablet = <?php echo json_encode($is_tablet, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT); ?>; //デバッグツール
            dbMsg = dbMsg + ",is_mobile=" + $is_mobile + ",is_tablet=" + $is_tablet;
            if (slideBgUrl) {
                b_bgv = slideBgUrl;
                isVideo = false;
            } else {
                b_bgv = "";
                isVideo = false;
            }
            myLog(dbMsg);
        } catch (e) {
            console.log(dbMsg);
            window.location.reload(); //再読み込み
        }
    });

    $(window).load(function () {
        var tag = "[(window).load]";
        var dbMsg = tag + ",ceremonies_slide_bg=" + ceremonies_slide_bg;
        try {
            slideStart();
            myLog(dbMsg);
        } catch (e) {
            console.log(dbMsg);
            window.location.reload(); //再読み込み
        }
    }); //読込完了時；備考；$(window).load()はページのすべての要素、つまり画像などがすべてロードされた段階

    $(window).resize(function () {
        var dbMsg = "[window.resize]" + b_bgv;
        try {
            resize_now = true; //リドロウ以降に画面サイズが変わった
            winW = $(window).width();
            winH = $(window).height();
            vanishingPoint = winW;
            vpPer = Math.atan((vanishingPoint * stayScale) / vanishingPoint); //原点から消失点までの角度     Math.atan(orgW / winW)
            myLog(dbMsg);
        } catch (e) {
            console.log(dbMsg);
            window.location.reload(); //再読み込み
        }
    }); //ウインドウサイズが変更されたときの処理☆
//        function pouseToStart() {
//            var dbMsg = "[pouseToStart]";
//             $("#info_bord").css({'display': 'none'});                     //投稿待ちインフォメーション
//            isReload = false;
//             console.log(dbMsg);
//         
//            $(document).dataQueueingStart();                //Uncaught TypeError: $(...).dataQueueingStart is not a function
//        }
</script>