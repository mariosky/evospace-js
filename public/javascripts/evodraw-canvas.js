/**
 * Created by mario on 3/18/16.
 */

$(document).ready(function () {

    $.get('/evospace/pop/sample/1')
        .done(function (data) {

            g_start_time = Date.now();
            g_sample = data.result;
            g_individual = JSON.parse(g_sample.sample[0]);

            $('#drawing_id').html( data.result.sample[0]);

            // alert("Data Loaded: " + JSON.stringify(data));



            //initialize
            var bound = false;

            //pjs

            function getPJS() {
                pjs = Processing.getInstanceById("lienzo");
                if(pjs!=null) {
                    var chrome = pjs.getChromosome();
                    //alert(chrome)
                    chrome.length = 0;
                    Array.prototype.push.apply(chrome, g_individual.chromosome);
                    pjs.setup();//Se resetea el canvas
                    pjs.draw();
                    bound = true; }
                if(!bound) setTimeout(getPJS, 50);
            }

            getPJS();




        });



});





var get_another = function() {

    //TODO
    //PUT SAMPLE BACK

        var current_fitness = xbox_id.toString()+':'+Date.now();
        g_individual.fitness[current_fitness] = g_start_time;
        g_sample.sample = [g_individual];

        $.post('/evospace/pop/sample',{sample:g_sample} )
            .done(function(data){
                console.log("PUT success");
            });


    // Async get another
    $.get('/evospace/pop/sample/1')
        .done(function (data) {
            $('#drawing_id').html( data.result.sample[0]);

            g_start_time = Date.now();
            g_sample = data.result;
            g_individual = JSON.parse(g_sample.sample[0]);

            $('#drawing_id').html( data.result.sample[0]);


            //initialize
            var bound = false;


            //pjs

            function getPJS() {
                pjs = Processing.getInstanceById("lienzo");
                if(pjs!=null) {
                    var chrome = pjs.getChromosome();
                    //alert(chrome)
                    chrome.length = 0;
                    Array.prototype.push.apply(chrome, g_individual.chromosome);
                    pjs.setup();//Se resetea el canvas
                    pjs.draw();
                    bound = true; }
                if(!bound) setTimeout(getPJS, 50);
            }

            getPJS();

        });




};

var interval = 1000 * 60 * minutes; // where X is your every X minutes

setInterval(get_another, interval);