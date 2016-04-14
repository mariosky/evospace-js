/**
 * Created by mario on 3/12/16.
 */
var express = require('express');
var evospace = require('../lib/evospace');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('evospace-dashboard-test',  {title: 'Populations'});

});

router.post('/addPopulation', function(req, res, next) {
    var namePopulation = req.body.name;
    var numberInd = req.body.numberInd;
    var pop =  new evospace.Population(namePopulation);

    pop.initialize(function(err,results)
        {
            for (var x= 0; x<numberInd; x++)
            {
                var i = new evospace.Individual( {id:x, name:"Mario", chromosome:[1,2,3,1,1,2,2,2],"fitness":{"s":1} } )
                console.log(JSON.stringify(i));
                i.put(namePopulation);
            }
        }
    );

    pop.save_name_population(namePopulation);

    res.redirect('/evospaceTest');
});

// Read All names of populations
router.get('/namePopulations', function(req, res, next) {
    var name = "namePopulations";
    var populations = new evospace.namePopulations();


    populations.read_names_populations(name ,function(err, result) {
        res.send( result );
    });
});

router.delete('/:space', function (req, res) {

    console.log(req.params.space);
    res.send( req.params.space);
});



module.exports = router;