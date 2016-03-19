/**
 * Created by mario on 3/18/16.
 */
$(document).ready(function () {


    //initialize

    $.get('/evospace/pop/sample/1')
        .done(function (data) {
            alert("Data Loaded: " + JSON.stringify(data));

        });


});
