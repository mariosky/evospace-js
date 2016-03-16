/**
 * Created by mariosky on 3/16/16.
 */
var express = require('express')

var router = express.Router();



router.get('/', function(req, res, next) {
    res.render('evodraw', { title: 'Express' });
});


module.exports = router;