/**
 * Created by mario on 3/27/16.
 */

$(document).ready(function () {
    refresh_state();
    $("#respawn").click(function () {
        $.post('/evospace/pop/respawn/',{n:1})
            .done(function (data) {
                console.log(data);

            });

    });
    $("#evolve").click(function () {
        $.post('/evospace/pop/evolve/')
            .done(function (data) {
                console.log(data);

            });

    });

    $("#initialize").click(function () {
        //initialize
        $.post('/evospace/pop/initialize/')
            .done(function (data) {
                console.log("initialized");
                var sample =createPopultaion(10);
                console.log(JSON.stringify(sample));

                $.post('/evospace/pop/sample',{sample:sample})
                    .done(function(data){
                        console.log("success");
                    });
            });
    });

});


$('body').on('click', '.individual-id', function(){

    var id = $(this).attr("id");



    $.get('/evospace/'+id.replace(/:/g,"/"))
        .done(function(data){
            var ind = JSON.parse(data);
            $('#modalContent').html(ind.id +"  ["+ind.chromosome.toString()+"]");

            $('#modalInfo').modal();

        });


});


var refresh_state = function(){
    $.get('/evospace/pop')
        .done(function (data) {
            console.log(data);

            $("#population").empty();
            for (var i = 0; i < data.length; i++) {
                var individual = $('<a></a>').html(' individual:'+data[i].split(':')[2] );
                individual.attr("id",data[i]);
                individual.attr("role","button");
                individual.addClass("individual-id");
                console.log(individual);

                $("#population").append(individual);
            }
            //$("#population").html(data.join(", ")) ;


        });

    $.get('/evospace/pop/sample_queue')
        .done(function (data) {
            console.log(data);

            $("#sample-queue").html(data.result.join(", ")) ;

        });
}

var interval = 2000; // where X is your every X minutes

setInterval(refresh_state, interval);







function createPopultaion( size){

    var new_individuals = []
    var l_min = [10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var l_max = [150, 80, 1, 1, 1, 1, 4, 1, 1, 1, 3, 1, 1, 2, 3];


    for (var i = 0; i<size; i++ ) {
        var chromosome = [];
        for (var j = 0; j < l_min.length; j++)
            chromosome[j] = getRandomInt(l_min[j], l_max[j]);

        var individual = {chromosome: chromosome};
        new_individuals[i] = individual;

    }

    return {sample_id :null, sample:new_individuals};


}



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max+1 - min)) + min;
}
