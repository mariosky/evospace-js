/**
 * Created by mariosky on 3/16/16.
 */

$("#initialize").click(function () {


    //initialize

    $.post('/evospace/pop/initialize/6')
        .done(function (data) {
            console.log("initialized");
            var sample =createPopultaion(50);
            console.log(JSON.stringify(sample));

            $.post('/evospace/pop/sample',{sample:sample})
                .done(function(data){
                    console.log("success");
                });


        });


});




function createPopultaion( size){

    var new_individuals = []
    var l_min = [10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var l_max = [150, 80, 1, 1, 1, 1, 4, 1, 1, 1, 3, 1, 1, 2, 3]


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








