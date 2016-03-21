/**
 * Created by mariosky on 3/16/16.
 */
var express = require('express')

var router = express.Router();



router.get('/', function(req, res, next) {

    if (req.cookies.xbox != undefined) {
        res.render('evodraw', {title: 'Express'});
    }
    else{
        res.render('evodraw-config', {title: 'EvoDraw Config'});
    }
});

router.post('/', function(req, res, next) {
    console.log("[DEBUG][Cookies Request]%s", JSON.stringify(req.body));

    res.render('evodraw-config', {title: 'Saved'});
});



router.get('/dashboard/', function(req, res, next) {
    res.render('evodraw-dashboard', { title: 'Express' });
});


module.exports = router;