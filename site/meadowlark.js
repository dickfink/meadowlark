var express = require("express");
var app = express();
var fortune = require('./lib/fortune.js')
var bodyParser  = require('body-parser');
var credentials = require("./credentials.js")
var GoodThing = require('./models/goodthing.js');
// set up handlebars view engine
var handlebars = require('express-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
//set static folder
app.use(express.static(__dirname + '/public'));
// set up cookie=parser
app.use(require('cookie-parser')(credentials.cookieSecret));
// set up express-session
app.use(require('express-session')({
    resave: false,
    saveUninitalized: false,
    secret: credentials.cookieSecret,
}))
// set up body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));
// set up database
var mongoose = require('mongoose');
var opts = {server: { socketOptions: { keepAlive: 1 } } };
switch (app.get('env')) {
    case 'development':
        mongoose.connect(credentials.mongo.development.connectionString, opts);
        console.log('connected to DB--dev')
        break;
        
    case 'production':
        mongoose.connect(credentials.mongo.production.connectionString, opts);
        console.log('connected to DB--prod')
        break;
    
    default:
    throw new Error('Unknown execution environment: ' + app.get('env'));
}
// seed database with some goodThings
GoodThing.find(function(err, goodThings){
    if(err) return console.log(err);
    if(goodThings.length) return;
    
    new GoodThing({
        thing: 'good thing 1',
    }).save();
    
    new GoodThing({
        thing: 'good thing 2',
    }).save();
    
    new GoodThing({
        thing: 'good thing 3',
    }).save();
    
});
// set up server
app.set("port", process.env.PORT || 3000);
//set up flash messages
app.use(function(req, res, next){
    // if there's a flash message, transfer it to the content, then clear it
    res.locals.flash = req.session.flash;
    delete req.session.flash;
    next();
});

// routes
app.get('/', function(req, res){
    res.render('home');
});

app.get('/about', function(req, res){
    res.render('about', {fortune: fortune.getFortune});
});


// form posting
app.post('/', function(req, res){
    // log the form named "goodThing"
   console.log('Quote (from querystring):' + req.body.goodThing);
   new GoodThing({
       thing: req.body.goodThing,
   }).save();
    // show success flash  
   req.session.flash = {
       type: 'success',
       intro: 'Thank you!',
       message: "You have now been signed up for the news letter.",
   };
   //   redirect back to form page
   res.redirect(303, '/');
});

app.get('/goodthings', function(req, res) {
    
    GoodThing.find(function(err, goodThings){
        
        var context = {
            goodThings: goodThings.map(function(goodThing){
                return {
                    thing: goodThing.thing,
                }
            })
        };
        res.render('goodthings', context);
    });
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