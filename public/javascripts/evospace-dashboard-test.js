/**
 * Created by mario on 3/26/16.
 */
$(document).ready(function () {
    refresh_state();

});

var refresh_state = function(){
$.get('/evospaceTest/namePopulations')
    .done(function (data) {
        console.log(data);

        $( "#namePopulations" ).html(function() {
            $("#namePopulations").empty();

            data.forEach( function(key){
                var name = key.split("_");

                $("#namePopulations").append("<a href='../evospace/" + name[0] + "'>" + name[0]+"</a>  -  ");
                $("#namePopulations").append("<a id='" + name[0] + "' namePop='" + name[0] + "' onclick='deletePop(this.id);'> Delete</a>");
                $("#namePopulations").append(
                    "<form method='POST' action='../evospaceTest/' enctype='application/x-www-form-urlencoded' id='formDelete"+ name[0] +"' name='formDelete"+ name[0] +"'>" +
                    "<input type='hidden' name='_method' value='DELETE'>" +
                    "<input type='hidden' name='namePopulation' value='" + name[0] +"'>" +
                    "</form>"
                );
            });

        });

    });
}

function deletePop(key)
{
    var res = confirm('Are you sure?');
    if(res == true)
    {
        document.getElementById('formDelete'+key).submit();
    }
}


var interval = 2000; // where X is your every X minutes

setInterval(refresh_state, interval);