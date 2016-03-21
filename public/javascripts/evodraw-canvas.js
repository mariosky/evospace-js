/**
 * Created by mario on 3/18/16.
 */

$(document).ready(function () {

    $.get('/evospace/pop/sample/1')
        .done(function (data) {


            $('#drawing_id').html( data.result.sample[0]);

            // alert("Data Loaded: " + JSON.stringify(data));

            var individual = JSON.parse( data.result.sample[0]);

            //initialize
            var bound = false;
            var chromosome = individual.chromosome;

            //pjs

            function getPJS() {
                pjs = Processing.getInstanceById("lienzo");
                if(pjs!=null) {
                    var chrome = pjs.getChromosome();
                    //alert(chrome)
                    chrome.length = 0;
                    Array.prototype.push.apply(chrome, chromosome);
                    pjs.setup();//Se resetea el canvas
                    pjs.draw();
                    bound = true; }
                if(!bound) setTimeout(getPJS, 50);
            }

            getPJS();




        });



});





var get_another = function() {



    $.get('/evospace/pop/sample/1')
        .done(function (data) {
            $('#drawing_id').html( data.result.sample[0]);

            // alert("Data Loaded: " + JSON.stringify(data));

            var individual = JSON.parse( data.result.sample[0]);

            //initialize
            var bound = false;
            var chromosome = individual.chromosome;

            //pjs

            function getPJS() {
                pjs = Processing.getInstanceById("lienzo");
                if(pjs!=null) {
                    var chrome = pjs.getChromosome();
                    //alert(chrome)
                    chrome.length = 0;
                    Array.prototype.push.apply(chrome, chromosome);
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