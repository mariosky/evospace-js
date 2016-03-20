/**
 * Created by mario on 3/12/16.
 */
var express = require('express');
var evospace = require('../lib/evospace');

var router = express.Router();

/* GET home page. */



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

router.post('/:space/initialize/:size', function(req, res, next) {

    var population =  new evospace.Population(req.space);

    population.initialize( function(err, result)
    {
        initializeDrawings(req.space,req.size);


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

    var population =  new evospace.Population(req.space);

    population.put_sample( req.sample);

});





function initializeDrawings(space, size){
    var population =  new evospace.Population(space);

    var l_min = [10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var l_max = [150, 80, 1, 1, 1, 1, 4, 1, 1, 1, 3, 1, 1, 2, 3]


    for (var i = 0; i<size; i++ ) {
        var chromosome = [];
        for (var j = 0; j < l_min.length; j++)
            chromosome[j] = getRandomInt(l_min[j], l_max[j]);

        var individual = {chromosome: req.body['chromosome[]']};


        population.put_individual(individual, function(err, result)
        {
            console.log("inserted");

        });


    }


}



function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max+1 - min)) + min;
}




module.exports = router;