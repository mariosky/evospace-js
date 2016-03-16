/**
 * Created by mario on 3/6/16.
 */
var socket = io.connect();
socket.emit('iamhere', 'mariosky');

socket.on('whoshere', function (data) {
    var ul = document.getElementById('events');

    for (var i = 0, len = data.length; i < len; i++) {
        ul.innerHTML = makeEventRow(data[i]) + ul.innerHTML;
    }
});


var makeEventRow = function (data){
    var object = JSON.parse(data);
    var date = new Date(object.date_time);
    var display = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return '<li>' + '<b> happy' + object.happy + ': </b><span>' + display + '</span></li>';

};