/**
 * Created by mariosky on 3/16/16.
 */

$("#initialize").click(function () {


    //initialize

    $.post('/evospace/pop/initialize/6')
        .done(function (data) {
            console.log("initialized");
        });


});






