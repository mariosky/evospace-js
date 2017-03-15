/**
 * Created by mariosky on 3/11/16.
 */
var Redis = require('ioredis');
var redis = new Redis(6379, 'localhost');
var async = require("async");

exports.Individual = function(args){

    //Check if id exists
    this.id = args.id;

    this.fitness = args.fitness || {};
    this.chromosome = args.chromosome || [];

    //Adds other args to this, like a __dict__.update()
    for (var key in args) {
        if (!this.hasOwnProperty(key)) {
            this[key] = args[key]
        }

    }

   // console.log("[DEBUG][put Ind:] %s" , JSON.stringify(this));


    this.put = function(population, callback){
        if (population.slice(-1) != ":") population = population + ":";

        var self = this;
        //console.log("[DEBUG][put] Pop %s", JSON.stringify(population));

        if (this.hasOwnProperty('score'))
        {  redis.multi()
                .sadd(population,self.id)
                .zadd(population+"z",self.score,self.id)
                .set(self.id,JSON.stringify(self))
                .exec(function (err, results) {
                   // console.log("[DEBUG][put Err] %s", JSON.stringify(err));
                    if (callback && typeof callback == 'function')
                        return callback(err,results);

                });
        }
        else{
            redis.multi()
                .sadd(population,self.id)
                .set(self.id,JSON.stringify(self))
                .exec(function (err, results) {
                   // console.log("[DEBUG][put Err] %s", JSON.stringify(err));
                    if (callback && typeof callback == 'function')
                        return  callback(err,results);
                });
        }
    };

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
    this.name = name+":" || "pop:";
    this.sample_count = this.name + 'sample_count';
    this.individual_count = this.name + 'individual_count';
    this.sample_queue = this.name + "sample_queue";
    this.returned_count = this.name + "returned_count";
    this.log_queue = this.name + "log_queue";

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
       //console.log("[DEBUG][initialize pattern] %s", pattern);
        var self = this;
        redis.keys(pattern, function (err, keys) {
            var commands = [];
            keys.forEach(function(key){
               // console.log("[DEBUG][initialize] %s", key);
                commands.push(['del',key]);
            });

            redis.pipeline(commands)
                .setnx(self.sample_count,0)
                .setnx(self.individual_count,0)
                .setnx(self.returned_count,0)
                .set(self.name+"found",0)
                .exec(function(err,results)
                {
                    callback(err,results);
                }

            );
       });
    }



    this.delete = function(callback ){
        var pattern =  this.name + "*";
      //  console.log("[DEBUG][delete pattern] %s", pattern);
        var self = this;
        redis.keys(pattern, function (err, keys) {
            var commands = [];
            keys.forEach(function(key){
                //console.log("[DEBUG][initialize] %s", key);
                commands.push(['del',key]);

            });
        redis.pipeline(commands)
            .exec(function(err,results)
            {
                callback(err,results);
            });
        });
    }

    this.card = function(callback) {
      redis.scard(this.name, function (err, result) {
          return callback(err, result);
      });
    }

    this.read = function(key,callback){
        redis.get(key, function (err, result) {
            return callback(err, result);
        });

    }

    this.read_zrange = function (start,stop ,callback){
        var self = this;

        redis.zrange(this.name+"z",start,stop ,function (err, result)
        {
           // console.log("[DEBUG][read_all keys] %s", JSON.stringify(result));

            redis.multi({pipeline: false});
            result.forEach( function(key){
                if (key != undefined)
                {
                    redis.get(key);
                }
            });

            redis.exec(function (err, results) {
                var clean_str = self.get_results(results);
                var result = {};
                var clean = clean_str.map( function (val) {
                    return JSON.parse(val);
                });

                //remove last two results from sadd and rpush
                result.sample = clean;
                return callback(err, result)
                
            });
        });
    }

    this.read_zrevrange = function (start,stop ,callback){
        var self = this;

        redis.zrevrange(this.name+'z',start,stop ,function (err, result)
        {
          //  console.log("[DEBUG][read_all keys] %s", JSON.stringify(result));

            redis.multi({pipeline: false});
            result.forEach( function(key){
                if (key != undefined)
                {
                    redis.get(key);
                }
            });

            redis.exec(function (err, results) {
                var clean_str = self.get_results(results);
                var result = {};
                var clean = clean_str.map( function (val) {
                    return JSON.parse(val);
                });

                //remove last two results from sadd and rpush
                result.sample = clean;
                return callback(err, result)
            });
        });
    }
    this.read_topn = function (n, callback){
        var self = this;

        redis.zrevrangebyscore(this.name+'z','+inf','-inf','LIMIT',0,n,function (err, result)
        {
          //  console.log("[DEBUG][read_top keys] %s", JSON.stringify(result));

            redis.multi({pipeline: false});
            result.forEach( function(key){
                if (key != undefined)
                {
                    redis.get(key);
                }
            });

            redis.exec(function (err, results) {
                var clean_str = self.get_results(results);
                var result = {};
                var clean = clean_str.map( function (val) {
                    return JSON.parse(val);
                });

                //remove last two results from sadd and rpush
                result.sample = clean;
                return callback(err, result)
            });
        });
    }


    this.get_sample = function (size, callback){
        // TODO: RESPAWN
        var commands = []
       // console.log("[DEBUG][get sample] space:%s size:%s", this.name,size);
        for (var i = 0; i<size; i++)
        {
            commands[i] = ['spop',this.name];
        }
        var self = this;// To useit in callback

        redis.pipeline(commands)
            .incr(self.sample_count)
            .exec(function (err, results) {
                //Results are in the form:  [[null,"pop:individual:3"],[null,4]] key,key,next_sample_id
                //Last result is the sample count + 1
                var sample_id = results[results.length - 1][1];
                // leave just the keys

                //console.log("[DEBUG][get_sample sample_id] %s", JSON.stringify(sample_id));
                var keys = self.get_results(results.slice(0,-1));
               // console.log("[DEBUG][get_sample keys] %s", JSON.stringify(keys));
                if (keys.length == 0)
                    return callback( null, null);

                redis.multi({pipeline: false});
                keys.forEach( function(key){
                    if (key != undefined)
                    {
                    redis.get(key);
                    }
                });
                redis.sadd(self.name+"sample:" + sample_id,keys);
                redis.rpush(self.sample_queue, self.name+"sample:" + sample_id);

                redis.exec(function (err, results) {

                    var clean_str = self.get_results(results);
                    var clean = clean_str.map( function (val) {
                        return JSON.parse(val);
                    });
                    //var clean = self.get_results(results);

                    var result = {};
                    result.sample_id =self.name+"sample:" + sample_id;
                    //remove last two results from sadd and rpush
                    result.sample = clean.slice(0,clean.length-2);

                    return callback(err, result)

                });
            });
    }

    this.read_sample_queue = function(callback) {
        redis.lrange(this.sample_queue, 0,-1, function (err, result) {
            return callback(err, result);
        });
    }

    this.read_pop_keys = function (callback){
        var that = this;
        redis.smembers(that.name, function (err, result)
        {
            return callback(err, result);
        });
    }

    this.read_all = function (callback){
        var self = this;
        redis.smembers(this.name, function (err, result)
        {
            //console.log("[DEBUG][read_all keys] %s", JSON.stringify(result));

            redis.multi({pipeline: false});
            result.forEach( function(key){
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

    this.put_individual= function(obj,callback){
        var self = this;
        if (obj.id == undefined)
        {
            this.individual_next_key( function (err,result){
                    //console.log("next:%s",result );
                    obj.id = self.name+"individual:" + result;
                   // console.log("i:%s" , JSON.stringify(obj));
                    var i = new exports.Individual(obj);
                    i.put(self.name,callback);
                    }
            );
        }
        else
        {
            var i = new exports.Individual(obj);
            //console.log("update i:%s" , JSON.stringify(i));
            i.put(self.name,callback);
        }
    }
    
    // Put back a sample to a [space]   
    this.put_sample = function(sample){
        var self = this;
        //console.log("[DEBUG][put_sample sample.sample_id] %s", JSON.stringify(sample));
        redis.pipeline()
            .incr(this.returned_counter)
            .del(sample.sample_id)
            .lrem(this.sample_queue,0,sample.sample_id)
            .exec(function (err, results) {

                var that = self;
                sample.sample.forEach(function(val){
                    console.log("[DEBUG][put_sample results] %s", JSON.stringify(results));
                    //console.log("Member:%s" , JSON.stringify(val));
                    that.put_individual(val);

                });

            });
        if ('benchmark_data' in sample)
        {
        var log_name = 'log:'+this.name + sample.benchmark_data.experiment_id ;

        redis.pipeline()
            .lpush(log_name,JSON.stringify(sample.benchmark_data) )
            .exec(function (err, results) {

                //console.log("[LOGGED]benchmark_data");


            });
        }


    }

    // Post back a sample to a [space]
    this.add_sample = function(sample){
        var self = this;
        //console.log("[DEBUG][add_sample sample.sample_id] %s", JSON.stringify(sample));
        redis.pipeline()
            .exec(function (err, results) {
                var that = self;
                sample.sample.forEach(function(val){
                    //console.log("[DEBUG][add_sample results] %s", JSON.stringify(results));
                    that.put_individual(val);

                });

            });
    }
    
    this.respawn_sample= function (sample_id, callback) {
        //console.log("[DEBUG][respawn_sample sample_id] %s", JSON.stringify(sample_id));

        var self = this;

        redis.smembers(sample_id,function(err,samples){
            redis.multi({pipeline: false});
            //console.log("[DEBUG][respawn_sample smembers:] %s", JSON.stringify(samples));
            if (samples.length){
                redis.sadd(self.name,samples);
                redis.del(sample_id);
                redis.lrem(self.sample_queue,0,sample_id);
                console.log("[DEBUG][respawn_sample] sample_queue:%s sample_id:%s",self.sample_queue, sample_id);
            }
            else
            {  //console.log("[DEBUG][respawn_sample] sample_queue:%s sample_id:%s",self.sample_queue, sample_id);
                redis.del(sample_id);
                redis.lrem(self.sample_queue,0,sample_id);
            }
            redis.exec(function(err,results){

                callback(err,results);

            });

            //console.log("[DEBUG][respawn_sample sample_id] %s", JSON.stringify(samples));
        });
    };

    this.respawn = function(n, callback) {
        var n = n || 1;
        var self = this;
        redis.llen(this.sample_queue, function (err, current_size) {
            if (n > current_size) n = current_size;
            redis.lrange(self.sample_queue, 0, n-1, function (err, sample_keys) {
                //console.log("[DEBUG][respawn sample_queue] %s", JSON.stringify(self.sample_queue));
                //console.log("[DEBUG][respawn n] %s", JSON.stringify(sample_keys));
                async.map(sample_keys, self.respawn_sample.bind(self), function (err, results) {
                   return  callback(err,results);
                   //console.log("[DEBUG][respawn map] %s", JSON.stringify(results));

                });
            });
        });
    };

}

exports.namePopulations = function(){

    this.nameSet = "namePopulations";
    this.namePop = "_namePopulation";

    // Add Functions for Test
    this.save_name_population = function(name, callback) {

        var namePopulation = name + this.namePop;

        redis.sadd(this.nameSet,namePopulation);
    };

    this.delete_name_population = function(name, callback){

        var namePopulation = name + this.namePop;

        redis.srem(this.nameSet,namePopulation);
    };

    this.read_names_populations = function (name, callback){

        redis.smembers(name, function (err, result)
        {
            callback(err,result);
        });
    }

    this.read_sample = function (name, callback){

        redis.smembers(name, function (err, result)
        {
            callback(err,result);
        });
    }
    
    this.empty_population = function (name, callback){

        redis.scard(name, function (err, result)
        {
            //console.log(result);
            callback(err,result);
        });
    }

    this.no_samples = function (name, callback){

        var listSamples = name + this.sample_queue;

        redis.llen(listSamples, function (err, result)
        {
            //console.log(result);
            callback(err,result);
        });
    }
}

/*
var pop = new exports.Population("pop");
pop.delete(function(err, result) {
        console.log(result);
    }
);

pop.read_zrevrange(0,3,function(err, result) {
        console.log(result;
    }
);

pop.initialize(function(err,results)
    {
        for (var x= 0; x<15; x++)
        {
            var i = new exports.Individual( {id:x, name:"Mario", chromosome:[1,2,3,1,1,2,2,2],"fitness":{"s":1},"score":x } )
            //console.log(JSON.stringify(i));
            i.put("pop5");
        }
    }
);

var pop = new exports.Population("pop");

pop.read_sample_queue(function(err, result) {
        console.log(result);
    }
);

pop.respawn(5 ,function(err, result) {
        console.log(result);
    }
);

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