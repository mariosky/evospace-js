/**
 * Created by mario on 3/22/16.
 */



var Redis = require('ioredis');
var redis = new Redis(6379, '192.168.1.7');

var evospace = require('../lib/evospace');
var async = require("async");

exports.individualEvents = function(individual, callback){

    redis.multi({pipeline: false});

        console.log("[DEBUG][ind] %s", individual);

        if (Object.keys(individual.fitness).length != 0)
         {
             for (var event_key in individual.fitness)
             {
                 var xbox_id = event_key.split(':')[0];
                 var time_finish = event_key.split(':')[1];
                 var time_start = individual.fitness[event_key];
                 console.log("[DEBUG][xbox_id %s] %s -- %s ",xbox_id , time_start,time_finish);
                 redis.zrangebyscore(xbox_id, Math.floor(time_start / 1000), Math.floor(time_finish / 1000));
             }
         }
    redis.exec(function (err, results) {
        var events = { results:results, id:individual };

        return callback(null,events);
    });
};



exports.calcFitness = function(space, callback){

    var population =  new evospace.Population(space);
    var fitness_list = [];

    population.read_all( function(err, result){

        var inds = result.sample.map(JSON.parse);
        console.log("[DEBUG][result READ ALL] %s", JSON.stringify(inds));
        async.map(inds, exports.individualEvents, function(err, results){
            // results is now an array of stats for each file
            async.map(results,exports.individualFitness,function(err, results) {

                console.log("[DEBUG][results read_all] %s", results);
                var population = {};

                results.forEach( function(res){
                    population[res.ind.id] = res;

                });


                return callback(err,population);
            });






        });


    });
};

exports.individualFitness = function(events, callback) {

    var individual = events.id;
    var results = events.results;

    if (results[0]  !== undefined )
    {
        var event_keys = results[0][1];
        redis.multi({pipeline: false});

        event_keys.forEach(function(key){
            //console.log("[DEBUG][results key] %s", key);
            if (key!= undefined)
                redis.get(key);

        });

        redis.exec(function (err, result ) {
            var frames = get_frames(result);

            var fitness_factors =  getFitnessFactors(frames);

            var fitness = {ind:individual,fit:fitness_factors};


            //console.log("[DEBUG][put Result] %s %s", JSON.stringify( transformed),individual.id);
            return callback(null,fitness );
            //console.log("[DEBUG][put Err] %s", JSON.stringify(err));
        });




    }
    else
    {
        //console.log("[DEBUG][individualFitness]  %s", event_keys);
        var fitness = {ind:individual, fit:{happy:0, total:0, engaged:0}};

        callback(null,fitness);
    }


};


var getFitnessFactors = function( frames){
    var totals = {happy:0, total:0, engaged:0};

    frames.forEach(function(frame){

        var event = JSON.parse(frame);


        totals.total++;

        if(event.happy == 'Yes')
            totals.happy++;
        if(event.engaged == 'Yes')
            totals.engaged++;

        //console.log("[DEBUG][frame] %s", event.engaged);
    });

    return totals;

};


var get_frames = function(arr)
{
    var keys = arr.map( function (val) {
        return val[1];
    });

    return keys;
}



exports.evolve_Tournament = function(sample_size, mutation_rate){
    var sample_size = sample_size || 2;
    var mutation_rate = mutation_rate || 0.5;

    // Get all the Population with fitness
    exports.calcFitness('pop',function(err,population){
        var pop_fitness = [];

        for (var k in population) {
             var f = getFitness(population[k]);
             if (f) pop_fitness.push([f,k]);
        }


        pop_fitness.sort();
        pop_fitness.reverse();
        var the_best = [pop_fitness[0],pop_fitness[1]];

        var pool = tournament_selection(pop_fitness,4,2);
        var new_pop = reproduction(pool,population);





        console.log(JSON.stringify (pop_fitness));
        console.log(JSON.stringify (pool));
        console.log(JSON.stringify (new_pop));


    });
};


function reproduction(  pool, population ) {
    /*jshint validthis: true */
    var offspring = [];
    while (pool.length ) {
        var first = pool.splice( Math.floor(Math.random()*pool.length), 1 );
        var second = pool.splice( Math.floor(Math.random()*pool.length), 1 );
        var crossovers = crossover(population[first[0][1]].ind, population[second[0][1]].ind );
        //for ( var i in crossovers ) {
        //    offspring.push( this.mutate(crossovers[i]));
        console.log(JSON.stringify(crossovers));

        //}
    }
    return offspring;
};

// Interchanges a substring between the two parents
function crossover ( chrom1, chrom2 ) {
    console.log(chrom1.chromosome)
    console.log(chrom2.chromosome)

    var length = chrom1.chromosome.length;
    var xover_point = Math.floor( Math.random() * length);
    var range = 1 + Math.floor(Math.random() * (length - xover_point) );
    var new_chrom1 = chrom1.chromosome.slice(0,xover_point);
    var new_chrom2 = chrom2.chromosome.slice(0,xover_point);

    new_chrom1 = new_chrom1.concat(chrom2.chromosome.slice(xover_point,xover_point+range));
    new_chrom1 = new_chrom1.concat(chrom1.chromosome.slice(xover_point+range,length) );

    new_chrom2 = new_chrom2.concat( chrom1.chromosome.slice(xover_point,xover_point+range) );
    new_chrom2 = new_chrom2.concat( chrom2.chromosome.slice(xover_point+range,length));


    var individual1 = {chromosome: new_chrom1, fitness:{}, parents:[chrom1.id, chrom2.id] };
    var individual2 = {chromosome: new_chrom2, fitness:{}, parents:[chrom1.id, chrom2.id] };

    return [individual1,individual2];
}




var getFitness = function(ind){

    var f = ind.fit;
   return  f.total/(f.total+100 ) * (f.engaged+f.happy)/(f.total*2);


};


// Selects a new population of size pool_size via comparing tournament_size chromosomes and taking the best
function tournament_selection(population ,tournament_size, pool_size ) {
    /*jshint validthis: true */
    var pool = [];
    if ( tournament_size <= 1 ) {
        return new Error ("Tournament size too small");
    }
    do {
//	var joust = [];
        var best =  population[ Math.floor(Math.random()*population.length) ] ;
        for ( var i = 1; i < tournament_size; i ++) {
            var another= population[ Math.floor(Math.random()*population.length) ];
            if ( another[0] > best[0]) {
                best = another;
            }
        }
        pool.push( best );
    } while (pool.length < pool_size );
    return pool;
}



exports.evolve_Tournament(2,0.5 );