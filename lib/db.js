/**
 * Created by mario on 3/6/16.
 */




var Redis = require('ioredis');
var redis = new Redis(6379, '127.0.0.1');





module.exports.getCard = function(callback) {

    redis.zcard('243646335247', function (err, result) {
        console.log("[DEBUG][db.getCard] %s", result);
        callback(null, result);
    });
};



module.exports.getLast = function(xbox_id,limit, callback) {
    console.log("[DEBUG][xbox_id] %s", xbox_id);
    redis.zrevrange(xbox_id, 0,limit,  function (err, keys) {
        console.log("[DEBUG][db.getCard] %s", keys);

        MHGETALL(keys, function (err, events)
            {
                console.log("[DEBUG][db.MHEGETALL] %s", events);

                var clean = events.map( function (val) {
                    return val[1];
                });
                console.log("[DEBUG][db.MHEGETALL]clean %s", clean);

                callback(null, clean);
            }
        )




    });
};

function MHGETALL(keys, cb) {

    redis.multi({pipeline: false});

    keys.forEach(function(key){
        console.log("[DEBUG][db.getCard] %s", key);
        redis.get(key);

    });

    redis.exec(function(err, result){

        cb(err, result);
    });
}
