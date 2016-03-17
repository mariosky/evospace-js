/**
 * Created by mariosky on 3/16/16.
 */

$("#initialize").click(function () {


    //initialize

    $.post('/evospace/pop/initialize')
        .done(function (data) {
            alert("Data Loaded: " + data);
            initializeDrawings(5);
        });


});




function initializeDrawings(size){

    var l_min = [10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var l_max = [150, 80, 1, 1, 1, 1, 4, 1, 1, 1, 3, 1, 1, 2, 3]


    for (var i = 0; i<size; i++ ) {
        var chromosome = [];
        for (var j = 0; j < l_min.length; j++)
            chromosome[j] = getRandomInt(l_min[j], l_max[j]);

        $.post('/evospace/pop/individual',{'chromosome[]': chromosome})
            .done(function (data) {
                alert("Data Loaded: " + data);
            });

        console.log(chromosome);
    }



}



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max+1 - min)) + min;
}


