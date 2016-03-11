/**
 * Created by mariosky on 3/11/16.
 */
var Redis = require('ioredis');
var redis = new Redis(6379, 'localhost');





var Individual = function(args){

    Individual.prototype = args;
    //Check if id exists
    this.id = args.id;

    this.fitness = args.fitness || {};
    this.chromosome = args.chromosome || [];

    this.put = function(population){
        redis.multi({pipeline: true});
        redis.sadd(population,this.id);
        redis.set(this.id,JSON.stringify(i));

        redis.exec(function(err, result){

        });
    }

    this.get = function(callback ){
        redis.get(this.id, function (err, result) {
            return callback(err, result);
        });

    }

    this.toString = function(){

        return JSON.stringify(this);
    }

}



var i = new Individual( {id:1234, name:"Mario", chromosome:[1,2,3,1,1,2,2,2],"fitness":{"s":1} } )

console.log(i.chromosome);
console.log(JSON.stringify(i));
i.put("pop");

i.get( function(err, result) {
    console.log(result);
});

console.log(i.toString());
console.log(i.fitness.s);








