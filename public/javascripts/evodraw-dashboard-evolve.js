/**
 * Created by mariosky on 6/29/16.
 */
$(document).ready(function () {
    $("#evolve").click(function () {
        $.post('/evospace/pop/evolve/')
            .done(function (data) {
                console.log("Evolution");
                console.log(data);

            });

    });

});
