$(document).ready(function () {
    $.cookie.json = true;

    var page = 1;
    var limit = 10;
    var condition = {'keyword': '', 'pid': '0', 'prev_disp': '1'};

    loadCookie();

    dataBind(false); // initial load

    $(document).on('click', '.ceremony-result-prev', function () {
        page--;
        if (page < 0) page = 1;
        dataBind(false);
    });

    $(document).on('click', '.ceremony-result-next', function () {
        page++;
        dataBind(false);
    });

    $('.search-cond-clear').on('click', function () {
        condition = {'keyword': '', 'pid': '0', 'prev_disp': '1', 'begin_date': '', 'end_date': ''};
        //conditionBind(condition);
        saveCookie();
        loadCookie();
        searchExecute(false);
    });

    $(".search-execute").on('click', function () {
        console.log('検索');
        var pattern = $("#name-pattern");
        var planner = $('#planner-id');



        var keyword = pattern.val();
        var pid = planner.val();
        var beginDate = $('#ceremony_search_begin').val();
        var endDate = $('#ceremony_search_end').val();
        console.log(beginDate);
        console.log(endDate);
        var disp_prev = $("input[name='disp-prev-data']:checked").val();
        condition = {'keyword': keyword, 'pid': pid, 'prev_disp': disp_prev, 'begin_date': beginDate, 'end_date': endDate};
        saveCookie();

        if(document.getElementById("mobile") != null) {
            searchExecute(true);
        } else {
            searchExecute(false);
        }
    });

    function searchExecute(isScroll) {
        page = 1;
        dataBind(isScroll);
    }

    function loadCookie() {
        var cookie_value = $.cookie('ceremony-search');
        if (typeof cookie_value !== "undefined") {
            condition = cookie_value;
        }
        $('#name-pattern').val(condition.keyword);
        $('#planner-id').val(condition.pid);
        $('#ceremony_search_begin').val(condition.begin_date);
        $('#ceremony_search_end').val(condition.end_date);
        if (condition.prev_disp == 0) {
            $('#disp_off').prop('checked', true);
        } else {
            $('#disp_on').prop('checked', true);
        }
    }

    function saveCookie() {
        $.cookie('ceremony-search', condition);
    }

    function dataBind(isScroll) {
        console.log(condition);
        var json = {'data': condition, 'page': page, 'limit': limit};

        var result = $('.result');
        result.hide();

        $.ajax({
            type: "post",
            url: "/ceremonies/search",
            data: JSON.stringify(json),
            dataType: 'json'
        }).done(function (data) {
            var template;
            if (data.info.count > 0) {
                template = Hogan.compile($('#template').text());
                result.empty().append(template.render(data));
                result.show();
            } else {
                template = Hogan.compile($('#notfound-template').text());
                result.empty().append(template.render());
                result.show();
            }

            if (page == 1) {
                $('.ceremony-result-prev').attr('disabled', 'disabled');
            } else {
                $('.ceremony-result-prev').removeAttr('disabled', 'disabled');
            }

            if (!data.info.next) {
                $('.ceremony-result-next').attr('disabled', 'disabled');
            } else {
                $('.ceremony-result-next').removeAttr('disabled', 'disabled');
            }

            if(isScroll) {
                var position = $(".search-execute").offset().top;
                $("html,body").animate({
                    scrollTop : position
                }, {
                    queue : false
                });
            }
            $("img.lazy").lazyload({
                effect: 'fadeIn',
                effectspeed: 1000
            });
        }).fail(function (data) {
        });
    }
});
