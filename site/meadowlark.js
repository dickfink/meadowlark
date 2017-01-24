var express = require("express");
var app = express();

// set up handlebars view engine
var handlebars = require('express-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set("port", process.env.PORT || 3000);

var fortunes = ["this is a thing", "that is a thing", "here is another thing",];

app.get('/', function(req, res){
    res.render('home');
});

app.get('/about', function(req, res){
    var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    res.render('about', {fortune: randomFortune});
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