/**
 * Created by mario on 3/12/16.
 */
var express = require('express');
var evospace = require('../lib/evospace');

var router = express.Router();

/* GET home page. */



router.get('/', function(req, res, next) {
   var population =  new evospace.Population(req.space);
    population.read_all( function(err, result)
    {
        res.send( { 'population': result } );
    });

});




/* GET home page. */
router.get('/:space/cardinality', function(req, res, next) {

    var population =  new evospace.Population(req.space);

    population.card( function(err, result)
    {

        res.send( { 'cardinality': result } );
    });

});

router.post('/:space/initialize', function(req, res, next) {

    var population =  new evospace.Population(req.space);

    population.initialize( function(err, result)
    {

        res.send( { 'result': result } );
    });

});

router.post('/:space/individual', function(req, res, next) {

    var population =  new evospace.Population(req.space);

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
    console.log(JSON.stringify(req.body.sample));
    console.log(JSON.stringify(req.space));
    var population =  new evospace.Population(req.params.space);

    population.put_sample( req.body.sample);

    res.send( { 'result': "async started" } );
});


router.post('/:space/sample/', function(req, res, next) {
    console.log(JSON.stringify(req.body.sample));
    console.log(JSON.stringify(req.space));
    var population =  new evospace.Population(req.params.space);

    population.put_sample( req.body.sample);

    res.send( { 'result': "async started" } );
});






module.exports = router;