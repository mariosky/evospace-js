/**
 * Created by Luis Rodriguez on 16/05/16.
 */

var barrister = require('barrister');
var express   = require('express');
var fs        = require('fs');
var bodyParser = require('body-parser');
var evospace = require('../lib/evospace');

function Individual() { }

function Population() { }
Population.prototype.initialize = function(name, number, callback) {
    var population =  new evospace.Population(name);
    population.initialize( function(err, result)
    {
        var sample = createPopultaion(number);
        console.log(JSON.stringify(sample));
        population.put_sample(sample);


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

        callback(null, "Successful initialization")
    });
};
Population.prototype.read_pop_keys = function(name, callback) {

    var population =  new evospace.Population(name);
    population.read_pop_keys( function(err, result)
    {
        callback(err, result);
    });
};
Population.prototype.read_all = function(name, callback) {

    var population =  new evospace.Population(name);
    population.read_all( function(err, result)
    {
        callback(err, result);
    });
};
Population.prototype.read = function (name, key, callback) {
    var population =  new evospace.Population(name);
    population.read(name+":individual:"+ key, function(err, result)
    {
        callback(err, result);
    });
};
Population.prototype.put_sample = function (name, sample, callback) {
    var population =  new evospace.Population(name);

    var sam = JSON.parse(sample)
    population.put_sample(sam);

    callback(null, "Success");

};
Population.prototype.get_sample = function (name, size, callback) {
    var population =  new evospace.Population(name);
    population.get_sample( size ,function(err, result)
    {
        //console.log(result)
        callback(err,JSON.stringify(result));
    });
};
Population.prototype.respawn_sample = function (name, id, callback) {
    var pop =  new evospace.Population(name);
    pop.respawn_sample(id,function(err, result)
    {
        //console.log(result);
        callback(err, JSON.stringify(result))
    });
};

function namePopulations() { }
namePopulations.prototype.createPopulation = function(name, callback) {
    var namePopulation = name;
    var pop =  new evospace.Population(namePopulation);
    pop.initialize(function(err,results)
        {

        }
    );
    var populations = new evospace.namePopulations();
    populations.save_name_population(namePopulation);

    callback(null, "Population created and ready to initialize");
};


var idl    = JSON.parse(fs.readFileSync("evospace-rpc.json").toString());
var server = new barrister.Server(idl);
server.addHandler("Individual", new Individual());
server.addHandler("Population", new Population());
server.addHandler("namePopulations", new namePopulations());

var app = express();
app.use(bodyParser());
app.post('/', function(req, res) {
    server.handle({}, req.body, function(respJson) {
        res.contentType('application/json');
        res.send(respJson);
    });
});
app.listen(1818);