/**
 * Created by mario on 3/12/16.
 */
var express = require('express');
var evospace = require('../lib/evospace');
var evodraw = require('../lib/evodraw-evo');
var router = express.Router();

/* GET home page. */


router.post('/:space/evolve', function(req, res, next) {

    evodraw.evolve_Tournament(req.params.space,6,2,0.2 );
    res.send( { 'result': "async started" } );


});


router.get('/:space/dashboard', function(req, res, next) {
    res.render('evospace-dashboard',  {title: req.params.space});

});



router.delete('/:space', function (req, res) {
    var population =  new evospace.Population(req.params.space);
    population.delete(function(err, result)
    {
        res.send(  result );
    });
});


//Read an individual
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

router.get('/:space/zrange/:start/:finish', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    population.read_zrange(req.params.start,req.params.finish, function(err, result)
    {
        res.send(  result );
    });

});

router.get('/:space/zrevrange/:start/:finish', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    population.read_zrevrange(req.params.start,req.params.finish, function(err, result)
    {
        res.send( result  );
    });

});


router.get('/:space/all', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    population.read_all( function(err, result)
    {
        res.send( { 'population': result } );
    });

})

router.get('/:space/sample_queue', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    population.read_sample_queue( function(err, result)
    {
        res.send( { 'result': result } );
    });

})



router.post('/:space/respawn', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    population.respawn(req.body.n ,function(err, result) {
        res.send( { 'result': result } );
    });

});


/* GET home page. */
router.get('/:space/cardinality', function(req, res, next) {

    var population =  new evospace.Population(req.params.space);

    population.card( function(err, result)
    {

        res.send( { 'cardinality': result } );
    });
});

router.post('/:space/initialize', function(req, res, next) {

    var population =  new evospace.Population(req.params.space);

    population.initialize( function(err, result)
    {

        res.send( { 'result': result } );
    });

});

router.post('/:space/individual', function(req, res, next) {

    var population =  new evospace.Population(req.params.space);

    console.log(req.body['chromosome[]']);

    var individual = {chromosome: req.body['chromosome[]']};


    population.put_individual(individual, function(err, result)
    {

        res.send( { 'result': result } );
    });

});


router.get('/:space/sample/:size', function(req, res, next) {

    var population =  new evospace.Population(req.params.space);
    population.get_sample( req.params.size ,function(err, result)
    {
        res.send( { 'result': result } );
    });
});


router.post('/:space/sample/', function(req, res, next) {
    var population =  new evospace.Population(req.params.space);
    population.put_sample( req.body.sample);
    res.send( { 'result': "async started" } );
});


router.get('/:space/sample/:size', function(req, res, next) {

    var population =  new evospace.Population(req.params.space);
    population.get_sample( req.params.size ,function(err, result)
    {
        res.send( { 'result': result } );
    });
});




module.exports = router;