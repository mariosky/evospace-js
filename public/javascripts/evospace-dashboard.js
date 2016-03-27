/**
 * Created by mario on 3/26/16.
 */
$(document).ready(function () {
    refresh_state();
    $("#respawn").click(function () {
        $.post('/evospace/pop/respawn/',{n:1})
            .done(function (data) {
                console.log(data);

            });

        });


});

var refresh_state = function(){
$.get('/evospace/pop')
    .done(function (data) {
        console.log(data);

        $("#population").html(data.population.join(", ")) ;

    });

$.get('/evospace/pop/sample_queue')
    .done(function (data) {
        console.log(data);

        $("#sample-queue").html(data.result.join(", ")) ;

    });
}


var interval = 1000; // where X is your every X minutes

setInterval(refresh_state, interval);