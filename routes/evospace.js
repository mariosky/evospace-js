/**
 * Created by mario on 3/12/16.
 */
var express = require('express')
var evospace = require('../lib/evospace');

var router = express.Router();

/* GET home page. */



router.get('/', function(req, res, next) {
    res.render('evodraw', { title: 'Express' });
});





router.get('/', function(req, res, next) {

    var population =  new evospace.Population(req.space);

    population.card( function(err, result)
    {

        res.send( { 'cardinality': result } );
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

router.put('/:space/initialize', function(req, res, next) {

    var population =  new evospace.Population(req.space);

    population.initialize( function(err, result)
    {

        res.send( { 'result': result } );
    });

});


router.get('/:space/sample/:size', function(req, res, next) {

    var population =  new evospace.Population(req.space);

    population.get_sample( req.size ,function(err, result)
    {

        res.send( { 'result': result } );
    });

});


router.put('/:space/sample/', function(req, res, next) {

    var population =  new evospace.Population(req.space);

    population.put_sample( req.sample);

});

module.exports = router;