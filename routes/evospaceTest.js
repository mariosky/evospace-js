/**
 * Created by mario on 3/12/16.
 */
var express = require('express');
var evospace = require('../lib/evospace');
var router = express.Router();

/* GET home page. */
router.route('/')
    .get(function(req, res) {
        res.render('evospace-dashboard-test',  {title: 'Populations'});
    })
    .post(function(req, res) {
        var namePopulation = req.body.name;
        //var numberInd = req.body.numberInd;
        var pop =  new evospace.Population(namePopulation);

        pop.initialize(function(err,results)
            {
                /*
                for (var x= 0; x<numberInd; x++)
                {
                    var i = new evospace.Individual( {id:x, name:"Mario", chromosome:[1,2,3,1,1,2,2,2],"fitness":{"s":1} } )
                    console.log(JSON.stringify(i));
                    i.put(namePopulation);
                }
                */
            }
        );

        var populations = new evospace.namePopulations();
        populations.save_name_population(namePopulation);

        res.redirect('/evospaceTest');
    })
    .put(function(req,res){
        //res.send("PUT" + req.params.space);
    })
    .delete(function(req, res) {

        var namePopulation = req.body.namePopulation;

        var populations = new evospace.namePopulations();
        var pop =  new evospace.Population(namePopulation);

        populations.delete_name_population(namePopulation);

        pop.delete(function(err, result) {
            //res.send( result );
            res.redirect('/evospaceTest');
        });

        //res.redirect('/evospaceTest');

    });

router.route('/:space/dashboard')
    .get(function(req, res) {

        var namePopulation = req.params.space + ':';
        var populations = new evospace.namePopulations();
        var sizePop = 0;
        var noSamples = 0;

        populations.empty_population(namePopulation ,function(err, result) {

            sizePop = result;
            //console.log(sizeSample);
            //res.render('evospace-population-dashboard',  {title: req.params.space, namePop: req.params.space, sizeSample: sizeSample});

            populations.no_samples(namePopulation ,function(err, result) {
                noSamples = result;
                //console.log(noSamples);

                res.render('evospace-population-dashboard',  {title: req.params.space, namePop: req.params.space, sizePop: sizePop, noSamples: noSamples});
            });
        });

        //res.render('evospace-population-dashboard',  {title: req.params.space, namePop: req.params.space, sizeSample: sizeSample});
        //res.send("Dashboard " + req.params.space);
    })
    .post(function(req, res) {
        var size = req.body.sizeSample;

        //res.send( { 'result': size } );
        var population =  new evospace.Population(req.params.space);
        population.get_sample( size ,function(err, result)
        {
            //res.send( { 'result': result } );
        });
        res.redirect('/evospaceTest/'+req.params.space+'/dashboard');
        //res.redirect('evospace-population-dashboard',  {title: req.params.space});

    })
    .put(function(req,res){
        //res.send("PUT" + req.params.space);
    })
    .delete(function(req, res) {
        var namePopulation = req.body.namePopulation;
        var idSample = req.body.idSample;

        //res.send( { 'result': idSample } );
        var pop =  new evospace.Population(namePopulation);
        //pop.respawn_sample(idSample);
        pop.respawn_sample(idSample,function(err, result)
        {
            //res.send( { 'result': result } );
        });
        res.redirect('/evospaceTest/'+ namePopulation + '/dashboard');
    });

// Read All names of populations
router.get('/namePopulations', function(req, res, next) {
    var name = "namePopulations";
    var populations = new evospace.namePopulations();


    populations.read_names_populations(name ,function(err, result) {
        res.send( result );
    });
});

// Read All members of a sample
router.get('/sample/:sample', function(req, res, next) {

    var name = req.params.sample;
    var populations = new evospace.namePopulations();


    populations.read_sample(name ,function(err, result) {
        res.send( result );
    });
});

// Read All members of a sample
router.get('/sample/:sample/dashboard', function(req, res, next) {

    res.render('evospace-sample-dashboard',  {title: req.params.sample, nameSample: req.params.sample});
});

router.post('/:space/initialize', function(req, res, next) {

    var population =  new evospace.Population(req.params.space);

    population.initialize( function(err, result)
    {
        //res.send( { 'result': result } );
        var sample = createPopultaion(req.body.noIndividuals);
        console.log(JSON.stringify(sample));

        population.put_sample(sample);

        //res.send( { 'result': "async started" } );

        function createPopultaion( size){

            var new_individuals = []
            var l_min = [10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            var l_max = [150, 80, 1, 1, 1, 1, 4, 1, 1, 1, 3, 1, 1, 2, 3];


            for (var i = 0; i<size; i++ ) {
                var chromosome = [];
                for (var j = 0; j < l_min.length; j++)
                    chromosome[j] = getRandomInt(l_min[j], l_max[j]);

                var individual = {chromosome: chromosome};
                new_individuals[i] = individual;

            }

            return {sample_id :null, sample:new_individuals};

        }


        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max+1 - min)) + min;
        }

        res.redirect('/evospaceTest/'+req.params.space+'/dashboard');
    });
    

});



module.exports = router;