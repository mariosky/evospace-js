/**
 * Created by mario on 3/26/16.
 */
$(document).ready(function () {
    refresh_state();

});

var refresh_state = function(){
$.get('/evospaceTest/namePopulations')
    .done(function (data) {
        console.log(data);

        $( "#namePopulations" ).html(function() {
            $("#namePopulations").empty();

            data.forEach( function(key){
                var name = key.split("_");
                //$("#namePopulations").append(name[0]+"</br>");
                $("#namePopulations").append("<a href='../evospace/" + name[0] + "'>" + name[0]+"</a>  -  ");
                $("#namePopulations").append("<a href='../evospaceTest/" + key + "' data-method='delete' onclick='return deletePop()'> Delete </a></br>");
            });

        });

    });
}

function deletePop() {
    return confirm('are you sure?');
}


var interval = 2000; // where X is your every X minutes

setInterval(refresh_state, interval);