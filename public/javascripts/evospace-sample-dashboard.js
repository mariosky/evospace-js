/**
 * Created by mario on 3/26/16.
 */
$(document).ready(function () {
    refresh_state();
});

var refresh_state = function(){

    $.get('/evospaceTest/sample/' + sample)
        .done(function (data) {
            console.log(data);
            $("#samples").html(data.join(", "));

        });
}


var interval = 2000; // where X is your every X minutes

setInterval(refresh_state, interval);