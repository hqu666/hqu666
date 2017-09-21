$(function() {

    $.ajax('acount.html', {
        timeout: 1000, // 1000 ms
        datatype: 'html'
    }).then(function(data) {
        console.log(data);
        var out_html = $($.parseHTML(data)); //parse
        $('#acount_aria').empty().append(out_html.filter('#acount')[0].innerHTML); //insert
        $('#credit_aria').empty().append(out_html.filter('#credit')[0].innerHTML); //insert
    }, function(jqXHR, textStatus) {
        console.log(jqXHR);
        console.log(textStatus);
        if (textStatus !== "success") {
            var txt = "<p>textStatus:" + textStatus + "</p>" +
                "<p>status:" + jqXHR.status + "</p>" +
                "<p>responseText : </p><div>" + jqXHR.responseText +
                "</div>";
            $('#acount_aria').html(txt);
            //        $('#credit_aria').html(txt);
        }
    });
    // $('#page').load('external.html');
});


/**
 * http://qiita.com/yumetodo/items/00b37234cb86e741f0fb
 */