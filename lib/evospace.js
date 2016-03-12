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

    this.individual_next_key = function(callback){
        redis.incr(this.individual_count,function (err, result) {
                return callback(err, result);
            }
        );
    }


    this.get_results = function(arr)
    {
        var keys = arr.map( function (val) {
            return val[1];
        });

        return keys;
    }

    this.initalize = function( ){
       var pattern =  this.name + "*";
       redis.keys(pattern, function (err, keys) {

           keys.forEach(function(key){
               console.log("[DEBUG][db.getCard] %s", key);
               redis.del(key);

           });

       });

        redis.multi()
            .setnx(this.sample_count,0)
            .setnx(this.individual_count,0)
            .setnx(this.returned_count,0)
            .set(this.name+":found",0)
            .exec();

     }


    this.card = function(callback) {
      redis.scard(this.name,
                                function (err, result) {
                                        return callback(err, result);
                                });
    }

    this.get_sample = function (size, callback){
        // TODO: RESPAWN
        var commands = []
        for (var i = 0; i<=size; i++)
        {
            commands[i] = ['spop',this.name];
        }
        var self = this;// To useit in callback

        redis.pipeline(commands)
            .incr(this.sample_count)
            .exec(function (err, results) {


                // results are in the form: [[ null, '2' ],[ null, '5' ],[ null, '7' ]]
                //First result is the sample count

                var sample_id = results[0][1];
                console.log("[DEBUG][get] %s", sample_id);
                // leave just the keys


                var keys = self.get_results(results.slice(1));


                redis.multi({pipeline: false});
                keys.forEach( function(key){
                    if (key != undefined)
                    {
                    console.log("[DEBUG][get] %s", key);
                    redis.get(key);
                    }
                });
                redis.sadd(self.name+":sample:%s" % sample_id,keys);
                redis.rpush(self.sample_queue, self.name+":sample:%s" % sample_id);

                redis.exec(function (err, results) {


                    var clean = self.get_results(results);
                    console.log("[DEBUG][clean] %s", clean);
                    var result = {};
                    result.sample_id =sample_id;
                    //remove last two results from sadd and rpush
                    result.sample = clean.slice(0,clean.length-2);



                    return callback(err, result)

                });
            });
    }

    this.read_sample_queue = function(callback) {
        redis.lrange(0,-1, function (err, result) {
            return callback(err, result);
        });
    }

    this.read_sample_queue_len = function(callback) {
        redis.len(0,-1, function (err, result) {
            return callback(err, result);
        });
    }


}



var pop = new Population("pop");
pop.initalize();


for (var x= 0; x<5; x++)
{
    var i = new Individual( {id:x, name:"Mario", chromosome:[1,2,3,1,1,2,2,2],"fitness":{"s":1} } )
    console.log(JSON.stringify(i));
    i.put("pop");


}

i.get( function(err, result) {
    console.log(result);
});

console.log(i.toString());
console.log(i.fitness.s);

console.log(pop.name);
pop.card( function(err, result)
    {
        console.log(result);
    });

pop.individual_next_key(
    function(err, result)
    {
        console.log("Next Key:"+result);
    }


)


pop.get_sample(2,
    function(err, result)
    {
        console.log("get_sample:"+JSON.stringify(result))
    }

)




