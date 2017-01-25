var express = require("express");
var app = express();
var fortune = require('./lib/fortune.js')
var bodyParser  = require('body-parser');
// set up handlebars view engine
var handlebars = require('express-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
//set static folder
app.use(express.static(__dirname + '/public'));
// set up body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));
// set up server
app.set("port", process.env.PORT || 3000);

// routes
app.get('/', function(req, res){
    res.render('home');
});

app.get('/about', function(req, res){
    res.render('about', {fortune: fortune.getFortune});
});


// form posting
app.post('/', function(req, res){
   console.log('Quote (from querystring):' + req.body.goodThing);
   res.redirect(303, '/');
});

// custom 404 page
app.use(function(req, res){
    res.status(404);
    res.render('404');
});

// custom 500 page
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.render('500');
});

app.listen(app.get('port'), function(){
    console.log("Express started...");
});