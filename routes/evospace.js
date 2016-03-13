/**
 * Created by mario on 3/12/16.
 */
var express = require('express')
var evospace = require('../lib/evospace');

var router = express.Router();


var population =  new evospace.Population("pop");


/* GET home page. */
router.get('/card', function(req, res, next) {

    population.card( function(err, result)
    {
        res.send( { 'cardinality': result } );
    });

});


module.exports = router;