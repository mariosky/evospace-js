/**
 * Created by mario on 3/6/16.
 */

var socket = io.connect();

socket.emit('get_xbox', xbox_id);

socket.on('event', function (data) {

    $("#events").empty();
    var table_header = $('<tr></tr>').html( '<th>Time</th><th>Happy?</th><th>Engaged?</th>' );

    $("#events").append(table_header);


    var canvas = document.getElementById('faces');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);


    for (var i = 0, len = data.length; i < len; i++) {
        var individual = JSON.parse(data);
        var date = new Date(object.date_time*1000);
        var display_time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        var row = $('<tr></tr>').html(makeEventRow(individual,display_time) );
        $("#events").append(row);
        drawFace(individual);
    }

});


var makeEventRow = function (individual,display_time){
    return '<td>' + display_time + '</td><td>' + individual.happy + '</td><td> ' + individual.engaged+'</td>';
};

var drawFace = function(face){
    var canvas = document.getElementById('faces');
    var context = canvas.getContext('2d');
    drawRectangle(face,context);
};


var drawRectangle = function (face, context) {
    var colors = ["DarkBlue","Green","Sienna","Purple","Coral","Crimson" ]
    var scale = 2;
    context.beginPath();
    context.fillStyle = '#8ED6FF';
    context.fill();
    //context.rect(0, 75, 100,100);
    console.log( Math.floor(face.face_box_left/10));
    console.log( Math.floor(face.face_box_top/10));
    console.log( Math.floor((face.face_box_right - face.face_box_left)/10 ));
    console.log( Math.floor(Math.floor((face.face_box_bottom - face.face_box_top)/10)));

    context.rect(Math.floor(face.face_box_left/scale),Math.floor( face.face_box_top/scale), Math.floor((face.face_box_right - face.face_box_left)/scale),
        Math.floor((face.face_box_bottom - face.face_box_top)/scale));
    context.lineWidth = 1;
    context.strokeStyle = colors[face.face_index];
    context.stroke();

    console.log("draw");
}