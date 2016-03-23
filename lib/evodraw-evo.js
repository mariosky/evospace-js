/**
 * Created by mario on 3/22/16.
 */



var Redis = require('ioredis');
var redis = new Redis(6379, '192.168.1.7');

var evospace = require('../lib/evospace');


exports.calcFitness = function(space, size, callback){

    var population =  new evospace.Population(space);

    population.read_all( function(err, result)
    {

        console.log(JSON.stringify({ 'result': result })); ;
        result.sample.forEach(function(ind){
                var individual = JSON.parse(ind);
                for (var event_key in individual.fitness)
                {
                    var xbox_id = event_key.split(':')[0];
                    var time_finish = event_key.split(':')[1];
                    var time_start = individual.fitness[event_key];
                    console.log("[DEBUG][time] %s", Math.floor(time_start/1000));
                    redis.zrangebyscore(xbox_id, Math.floor(time_start/1000),Math.floor(time_finish/1000),  function (err, keys){

                        MHGETALL(keys, function (err, events)
                            {
                                var clean = events.map( function (val) {
                                    return val[1];
                                });

                                console.log("[DEBUG][db.MHEGETALL]clean %s", clean);

                                fitness(clean);

                                callback(null, clean);
                            }
                        )

                        console.log("[DEBUG][results] %s", result);

                    });




                }
                console.log(individual.id);
                console.log(individual.fitness);
            }


        );

    });

}

function MHGETALL(keys, cb) {

    redis.multi({pipeline: false});

    keys.forEach(function(key){
        redis.get(key);

    });

    redis.exec(function(err, result){

        cb(err, result);
    });
}


var fitness = function( frames ){
    frames.forEach(function(frame){

        var event = JSON.parse(frame);

        console.log("[DEBUG][frame] %s", event.engaged);
    });



}


var sample = exports.calcFitness('pop',2, function(err,results){


    }

);

