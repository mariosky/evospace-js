/**
 * Created by mario on 3/12/16.
 */
var express = require('express');
var evospace = require('../lib/evospace');
var evodraw = require('../lib/evodraw-evo');
var router = express.Router();



// Application dependent
router.post('/:space/evolve', function(req, res, next) {

    evodraw.evolve_Tournament(req.params.space,6,2,0.2 );
    res.send( { 'result': "async started" } );
});

// Dashboard
router.get('/:space/dashboard', function(req, res, next) {
    res.render('evospace-dashboard',  {title: req.params.space});
});



router.post('/:space/initialize', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    population.initialize( function(err, result)
    {
        res.send( { 'result': result } );
    });
});


// Delete space
router.delete('/:space', function (req, res) {
    var population =  new evospace.Population(req.params.space);
    population.delete(function(err, result)
    {
        res.send(  result );
    });
});


//Read an individual by key
router.get('/:space/individual/:key', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    population.read(req.params.space+":individual:"+ req.params.key, function(err, result)
    {
        res.send( result  );
    });
});


// Read All the population keys
router.get('/:space', function(req, res, next) {
   var population =  new evospace.Population(req.params.space);
    population.read_pop_keys( function(err, result)
    {
        res.send( result  );
    });
});

// Read all individuals.
router.get('/:space/all', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    population.read_all( function(err, result)
    {
        res.send( { 'population': result } );
    });
})

// Read those individuals with a score between [:start] and [:finish].
router.get('/:space/zrange/:start/:finish', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    population.read_zrange(req.params.start,req.params.finish, function(err, result)
    {
        res.send(  result );
    });
});

// Read those individuals with a score between [:start] and [:finish] in reversed order.
router.get('/:space/zrevrange/:start/:finish', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    population.read_zrevrange(req.params.start,req.params.finish, function(err, result)
    {
        res.send( result  );
    });
});

// Read those individuals with a score between [:start] and [:finish] in reversed order.
router.get('/:space/top/:n', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    population.read_topn(req.params.n,function(err, result)
    {
        res.send( result  );
    });
});




// Read the sample queue.
router.get('/:space/sample_queue', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    population.read_sample_queue( function(err, result)
    {
        res.send( { 'result': result } );
    });
})


// Respawn n samples from the sample queue .
router.post('/:space/respawn', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    population.respawn(req.body.n ,function(err, result) {
        res.send( { 'result': result } );
    });
});


// Read the number of individuals in the population [space]
router.get('/:space/cardinality', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    population.card( function(err, result)
    {

        res.send( { 'cardinality': result } );
    });
});

// Add an individual to [space]
router.post('/:space/individual', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    console.log(req.body);
    var individual = req.body;
    population.put_individual(individual, function(err, result)
    {
        res.send( { 'result': result, 'error':err } );
    });
});





// Take a sample of size [size] from the [space]
router.get('/:space/sample/:size', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    population.get_sample( req.params.size ,function(err, result)
    {
        res.send( { 'result': result } );
    });
});

// Put back a sample to a [space]
router.post('/:space/sample/', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    population.put_sample( req.body.sample);
    res.send( { 'result': "async started" } );
});



module.exports = router;