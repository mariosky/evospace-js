/**
 * Created by mariosky on 3/11/16.
 */
var Redis = require('ioredis');
var redis = new Redis(6379, 'localhost');

exports.Individual = function(args){

    //Check if id exists
    this.id = args.id;

    this.fitness = args.fitness || {};
    this.chromosome = args.chromosome || [];
    //TODO: Add other args to this, like a __dict__.update()
    console.log("Ind:%s" , JSON.stringify(this));

    this.put = function(population){
        redis.multi()
            .sadd(population,this.id)
            .set(this.id,JSON.stringify(this))
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


exports.Population = function(name) {
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

    this.initialize = function(callback ){
       var pattern =  this.name + "*";
       console.log("[DEBUG][initialize pattern] %s", this.name);
        var self = this;
        redis.keys(pattern, function (err, keys) {
            var commands = [];
            keys.forEach(function(key){
                console.log("[DEBUG][initialize] %s", key);
                commands.push(['del',key]);

            });

            redis.pipeline(commands)
                .setnx(self.sample_count,0)
                .setnx(self.individual_count,0)
                .setnx(self.returned_count,0)
                .set(self.name+":found",0)
                .exec(function(err,results)
                {
                    callback(err,results);
                }


            );



       });
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
                // leave just the keys


                var keys = self.get_results(results.slice(1));

                if (keys.length == 0)
                    return callback( null, null);


                redis.multi({pipeline: false});
                keys.forEach( function(key){
                    if (key != undefined)
                    {
                    redis.get(key);
                    }
                });
                redis.sadd(self.name+":sample:%s" % sample_id,keys);
                redis.rpush(self.sample_queue, self.name+":sample:%s" % sample_id);

                redis.exec(function (err, results) {


                    var clean = self.get_results(results);
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

    this.read_pop_keys = function (callback){
        redis.smembers(this.name, function (err, result)
        {   var keys = this.get_results(result);
            var res = {sample:keys};
            return callback(err, res);
        });
    }

    this.read_all = function (callback){
        var self = this;
        redis.smembers(this.name, function (err, result)
        {   var keys = self.get_results(result);
            var res = {sample:keys};

            redis.multi({pipeline: false});
            keys.forEach( function(key){
                if (key != undefined)
                {
                    redis.get(key);
                }
            });

            redis.exec(function (err, results) {
                var clean = self.get_results(results);
                var result = {};
                //remove last two results from sadd and rpush
                result.sample = clean;
                return callback(err, result)
            });
        });
    }

    this.put_individual= function(obj){
        if (obj.id == undefined)
        {
            this.individual_next_key( function (err,result){
                    obj.id = this.name+":individual:%s" % result[1];
                    console.log("i:%s" , JSON.stringify(obj));
                    var i = new exports.Individual(obj);
                    i.put(this.name);
                    }
            );
        }
        else
        {
            var i = new exports.Individual(obj);
            console.log("i:%s" , JSON.stringify(i));
            i.put(this.name);
        }
    }

    this.put_sample = function(sample){
        var self = this;
        redis.pipeline()
            .incr(this.returned_counter)
            .del(sample.sample_id)
            .lrem(this.sample_queue,sample.sample_id)
            .exec(function (err, results) {
                var that = self;
                sample.sample.forEach(function(val){
                    console.log("Member:%s" , JSON.stringify(val));
                    that.put_individual(val);

                });


            });

    }



}


/*
var pop = new exports.Population("pop");
pop.initialize(function(err,results)
    {
        for (var x= 0; x<15; x++)
        {
            var i = new exports.Individual( {id:x, name:"Mario", chromosome:[1,2,3,1,1,2,2,2],"fitness":{"s":1} } )
            //console.log(JSON.stringify(i));
            i.put("pop");


        }
    }


);




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

pop.put_individual(new exports.Individual( {id:234, name:"Jose Mario", chromosome:[1,2,3,1,1,2,2,2],"fitness":{"s":1}} ) );
pop.read_all(
    function(err, result)
    {
        console.log("read_all:"+JSON.stringify(result))
    }

)


pop.get_sample(2,
    function(err, result)
    {
        console.log("read_all:"+JSON.stringify(result)+result.sample_id);

        pop.put_sample(result);

    }

)


for (var x= 0; x<15; x++)
{
    var i = new exports.Individual( {id:x, name:"Mario", chromosome:[1,2,3,1,1,2,2,2],"fitness":{"s":1} } )
    console.log(JSON.stringify(i));
    i.put("pop");


}
*/





