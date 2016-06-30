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

        // Some times individual is null, if that is the case we skip this individual
        if (individual != null  && Object.keys(individual.fitness).length != 0)
         {
             for (var event_key in individual.fitness)
             {
                 var xbox_id = event_key.split(':')[0];
                 var time_finish = event_key.split(':')[1];
                 var time_start = individual.fitness[event_key];
                 console.log("[DEBUG][xbox_id %s] %s -- %s ",xbox_id , Math.floor(time_start / 1000),Math.floor(time_finish / 1000));
                 redis.zrangebyscore(xbox_id, Math.floor(time_start / 1000), Math.floor(time_finish / 1000));
             }
         }
    redis.exec(function (err, results) {
        console.log("[DEBUG][zrangebyscore] %s -- %s ",err ,results);

        var events = { results:results, id:individual };

        return callback(null,events);
    });
};



exports.calcFitness = function(space,sample_size, callback){

    var population =  new evospace.Population(space);

    population.get_sample(sample_size, function(err, result){
    //population.read_all( function(err, result){

          //  console.log("[DEBUG][calcFitness: get_sample] %s",JSON.stringify( result));
        var inds = result.sample;
        console.log("[DEBUG][result READ ALL] %s", JSON.stringify(inds));
        async.map(inds, exports.individualEvents, function(err, results){
            // results is now an array of stats for each file
            async.map(results,exports.individualFitness,function(err, results) {

              // console.log("[DEBUG][results read_all] %s", JSON.stringify(results));
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


            //console.log("[DEBUG][put Result] %s %s", JSON.stringify( frames),individual.id);
            return callback(null,fitness );
            //console.log("[DEBUG][put Err] %s", JSON.stringify(err));
        });




    }
    else
    {
        console.log("[DEBUG][individualFitness]  %s", event_keys);
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



exports.evolve_Tournament = function(pop, sample_size, tournament_size,mutation_rate,callback){
    var sample_size = sample_size || 8;
    var mutation_rate = mutation_rate || 0.2;
    var tournament_size = tournament_size || 6;

    // Get all the Population with fitness
    exports.calcFitness('pop',sample_size,function(err,population){
        var pop_fitness = [];

        for (var k in population) {

             var f = getFitness(population[k]);
            console.log("[DEBUG][getFitness] %s", JSON.stringify(f));
             if (f) pop_fitness.push([f,k]);
        }
        console.log("[DEBUG][pop_fitness] %s", JSON.stringify(population));
        console.log("[DEBUG][pop_fitness] %s", JSON.stringify(pop_fitness.length));
        var evoSpace =  new evospace.Population(pop)

        //All individuals in the sample must have fitness
        if (pop_fitness.length >= sample_size) {
            pop_fitness.sort();
            pop_fitness.reverse();

            var best1 = population[pop_fitness[0][1]].ind;
            best1.score = pop_fitness[0][0];
            var best2 = population[pop_fitness[1][1]].ind;
            best2.score = pop_fitness[1][0];
            var the_best = [population[pop_fitness[0][1]].ind, population[pop_fitness[1][1]].ind];

            var pool = tournament_selection(pop_fitness, tournament_size,sample_size);
            var offspring = reproduction(pool, population, mutation_rate);

            var new_population = the_best.concat(offspring);

            var sample = {sample_id: null, sample: new_population};




            evoSpace.put_sample(sample);
        }
        else
        //If not, just return the sample as is
        {
            var sample_population = [];


            for (var k in population) {
                sample_population.push(population[k].ind);
            }
            //console.log("[DEBUG][population] %s", JSON.stringify(sample_population));
            var sample = {sample_id: null, sample: sample_population};
            evoSpace.put_sample(sample);
      }
    });
};

// From Nodeo:
function reproduction(  pool, population, mutation_rate ) {
    /*jshint validthis: true */
    var offspring = [];
    while (pool.length ) {
        var first = pool.splice( Math.floor(Math.random()*pool.length), 1 );
        var second = pool.splice( Math.floor(Math.random()*pool.length), 1 );
        var crossovers = crossover(population[first[0][1]].ind, population[second[0][1]].ind );

        for ( var i in crossovers ) {
            offspring.push( mutate(crossovers[i],mutation_rate));
        console.log("[DEBUG][crossovers] %s", JSON.stringify(crossovers));
        }
    }
    return offspring;
};
// From Nodeo:
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

  // return  f.total/(f.total+100 ) * (f.engaged+f.happy+1)/(f.total*2 +1);
   return 1 + f.total + f.engaged*3 + f.happy*4
};


// From Nodeo:
function tournament_selection(population ,tournament_size, pool_size ) {
    /*jshint validthis: true */
    var pool = [];
    if ( tournament_size <= 1 ) {
        return new Error ("Tournament size too small");
    }
    do {
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

function mutate (chromosome, prob ) {
    if (Math.random() <= prob ) {
        var l_min = [10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var l_max = [150, 80, 1, 1, 1, 1, 4, 1, 1, 1, 3, 1, 1, 2, 3];

        var mutation_point = Math.floor(Math.random() * chromosome.chromosome.length);

        chromosome.chromosome[mutation_point] = getRandomInt(l_min[mutation_point], l_max[mutation_point]);

        console.log("[DEBUG][mutation] %s", JSON.stringify(chromosome.chromosome));

    }
    return chromosome;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max+1 - min)) + min;
}

//
//exports.evolve_Tournament('pop',6,4,0.2 );

//i={"id":"pop:individual:6","fitness":{"243646335247:1458947298813":"1458947283792","243646335247:1458947448797":"1458947433810","243646335247:1458947583781":"1458947568799","243646335247:1458947808780":"1458947793773","243646335247:1458947868785":"1458947853768","243646335247:1458948033766":"1458948018762","243646335247:1458948108764":"1458948093758","243646335247:1458948408762":"1458948393742"},"chromosome":["126","18","1","1","0","0","1","1","1","0","0","1","1","0","3"]}
//exports.individualEvents(i, function(err,results){
//    exports.individualFitness(results, function(err,results) {
//        console.log(JSON.stringify( results));
//    });
//        });
//i={chromosome:["42","65","1","1","0","1","2","1","1","1","0","1","1","2","2"], f:{}, parents:["pop:individual:4","pop:individual:4"],id:"pop:individual:17"}
//console.log(i);
//console.log(mutate(i));