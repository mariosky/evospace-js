/**
 * Created by mario on 3/18/16.
 */
$(document).ready(function () {

    $.get('/evospace/pop/sample/1')
        .done(function (data) {


            $('#drawing_id').html( data.result.sample_id);

            // alert("Data Loaded: " + JSON.stringify(data));



            //initialize
            var bound = false;
            var chromosome = data.result.sample.sample[0].chromosome;

            //pjs

            function getPJS() {
                pjs = Processing.getInstanceById(element.id);
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








    $.get('/evospace/pop/sample/1')
        .done(function (data) {

            $('#drawing_id').html( JSON.stringify(data));
           // alert("Data Loaded: " + JSON.stringify(data));

        });


});





var get_another = function() {

    $.get('/evospace/pop/sample/1')
        .done(function (data) {

            $('#drawing_id').html(JSON.stringify(data.result.sample_id));
            //alert("Data Loaded: " + JSON.stringify(data.sample[0]));

        });



};

var interval = 1000 * 60 * 1; // where X is your every X minutes

setInterval(get_another, interval);