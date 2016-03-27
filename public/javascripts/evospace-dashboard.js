/**
 * Created by mario on 3/26/16.
 */
$(document).ready(function () {

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

    $("#respawn").click(function () {
        $.post('/evospace/pop/respawn/',{n:1})
            .done(function (data) {
                console.log(data);

            });

        });







});
