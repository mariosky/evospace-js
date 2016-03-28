/**
 * Created by mario on 3/6/16.
 */

var socket = io.connect();

socket.emit('get_xbox', xbox_id);

socket.on('event', function (data) {



    $("#events").empty();


    var canvas = document.getElementById('faces');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);


    for (var i = 0, len = data.length; i < len; i++) {
        var row = $('<li></li>').html(makeEventRow(data[i]) );
        $("#events").append(row);


    }





});


var makeEventRow = function (data){
    var object = JSON.parse(data);
    var date = new Date(object.date_time*1000);
    var display = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    drawFace(object);

    return '<span>' + display + ':</span> happy: ' + object.happy + '   engaged: ' + object.engaged + '  face index: '+ object.face_index  ;


};

var drawFace = function(face){
    var canvas = document.getElementById('faces');
    var context = canvas.getContext('2d');
    drawRectangle(face,context);
};


var drawRectangle = function (face, context) {
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
    context.strokeStyle = 'black';
    context.stroke();

    console.log("draw");
}