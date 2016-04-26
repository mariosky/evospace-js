/**
 * Created by mario on 3/26/16.
 */
$(document).ready(function () {
    refresh_state();


    $("#respawn").click(function () {
        $.post('/evospace/' + namePopulation +'/respawn/',{n:1})
            .done(function (data) {
                console.log(data);

            });

        });

    /*
    $("#evolve").click(function () {
        $.post('/evospace/pop/evolve/')
            .done(function (data) {
                console.log(data);

            });

    });
    */


});

var refresh_state = function(){

    $.get('/evospace/' + namePopulation)
        .done(function (data) {
            console.log(data);
            $("#population").html(data.join(", ")) ;


        });

    $.get('/evospace/' + namePopulation +'/sample_queue')
        .done(function (data) {
            console.log(data);

            $( "#sample-queue" ).html(function() {
                $("#sample-queue").empty();

                data.result.forEach( function(key){

                    var id = key.split(":");
                    //alert(id[2]);

                    $("#sample-queue").append("<a href='../sample/" + key + "/dashboard' target='_blank'>" + key +" </a>  -  ");
                    $("#sample-queue").append("<a id='" + id[2] + "' onclick='respawnSample(this.id);'> Respawn </a>");
                    $("#sample-queue").append(
                        "<form method='POST' action='../"+ namePopulation +"/dashboard' enctype='application/x-www-form-urlencoded' id='respawnSample"+ id[2] +"'>" +
                        "<input type='hidden' name='_method' value='DELETE'>" +
                        "<input type='hidden' name='idSample' value='" + key +"'>" +
                        "<input type='hidden' name='namePopulation' value='" + namePopulation +"'>" +
                        "</form>"
                    );


                });

            });

        });
}

function respawnSample(id)
{
    var res = confirm('Are you sure?');
    if(res == true)
    {
        document.getElementById('respawnSample'+id).submit();
    }
}


var interval = 2000; // where X is your every X minutes

setInterval(refresh_state, interval);