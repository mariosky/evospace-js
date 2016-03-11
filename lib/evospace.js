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
        redis.multi()
            .sadd(population,this.id)
            .set(this.id,JSON.stringify(i))
            .exec();
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


var Population = function(name) {
    this.name = name || "pop";
    this.sample_count = this.name + ':sample_count';
    this.individual_count = this.name + ':individual_count';
    this.sample_queue = this.name + ":sample_queue";
    this.returned_count = this.name + ":returned_count";
    this.log_queue = this.name + ":log_queue";

    this.get_returned_counter = function(callback ) {
        redis.get(this.returned_count, function (err, result) {
            return callback(err, result);
        });
    }

    this.individual_next_key = function(){
        return redis.incr(this.individual_count);
    }

    this.initalize = function(){
       var pattern =  this.name + "*";
       redis.keys(pattern, function (err, keys) {

           keys.forEach(function(key){
               console.log("[DEBUG][db.getCard] %s", key);
               redis.delete(key);

           });


           });



    }



}



var i = new Individual( {id:1234, name:"Mario", chromosome:[1,2,3,1,1,2,2,2],"fitness":{"s":1} } )
var pop = new Population("pop");
pop.initalize();
console.log(i.chromosome);
console.log(JSON.stringify(i));
i.put("pop");

i.get( function(err, result) {
    console.log(result);
});

console.log(i.toString());
console.log(i.fitness.s);

console.log(pop.name);







