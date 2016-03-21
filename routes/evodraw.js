/**
 * Created by mariosky on 3/16/16.
 */
var express = require('express')

var router = express.Router();



router.get('/', function(req, res, next) {
    console.log("[DEBUG][Cookies Request]%s", JSON.stringify(req.cookies));
    if (req.cookies.xbox != undefined) {

        var minutes = req.cookies.minutes || 1;
        var size = req.cookies.size || 1080;

        res.render('evodraw', {title: 'EvoDraw', xbox:req.cookies.xbox, minutes:minutes, size:size });
    }
    else{
        res.render('evodraw-config', {title: 'EvoDraw Config'});
    }
});

router.post('/', function(req, res, next) {
    console.log("[DEBUG][Cookies Request]%s", JSON.stringify(req.body));

    res.cookie('xbox' , req.body.xbox);
    res.cookie('minutes' , req.body.minutes);
    res.cookie('size' , req.body.size);

    res.render('evodraw-config-saved', {title: 'Saved'});
});



router.get('/dashboard/', function(req, res, next) {
    res.render('evodraw-dashboard', { title: 'Express' });
});


module.exports = router;