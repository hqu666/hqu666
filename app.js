var elem;
var nend_flg = false;
var href = "";

window.addEventListener('load', onLoad, false);

function onLoad(){
  elem = $('#nend_wrapper');
}

app.factory('Data', function(){
    var data = {};

    data.items = [
        {
            title: 'Item 1 Title',
            icon: 'comments-o',
            description: 'Item 1 Description'
        },
        {
            title: 'Another Item Title',
            icon: 'desktop',
            description: 'Item 2 Description'
        },
        {
            title: 'Yet Anoter Item Title',
            icon: 'heart-o',
            description: 'Item 3 Description'
        }
    ];

    return data;
});

app.controller('MasterController', function($scope, Data){

    $scope.items = Data.items;

    $scope.showDetail = function(index){
        var selectedItem = Data.items[index];
        Data.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('detail.html', { title : selectedItem.title });
    }

});

app.controller('DetailController', function($scope, Data, $timeout){

    $scope.item = Data.selectedItem;

    $scope.$watch('$viewContentLoaded', function(){

        var nend_links ;

        if(!nend_flg){
            flg = true;
            nend_links = document.querySelectorAll('.nend a');
            for(var i = 0; i < nend_links.length; i+=1){
              href = nend_links[i].href;
            }
        }

        $('#new_nend_wrapper').append(elem);
        $('#new_nend_wrapper').attr("href","#");
        $('#new_nend_wrapper').click(function(event) { monaca.invokeBrowser(href); return false;});

    });
});